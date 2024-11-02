const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const path = require('path');
const logger = require('./utils/logger');
const timeManager = require('./utils/timeManager');
const recoveryManager = require('./utils/recoveryManager');
const keepAlive = require('./utils/keepAlive');
const ReminderService = require('./services/ReminderService');

const app = express();
const port = process.env.PORT || 3000;

// Настройка Express
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Инициализация WhatsApp клиента
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "tauekel-bot" }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    }
});

let qrCodeData = null;

// Маршруты
app.get('/', (req, res) => {
    res.render('index', { qrCode: qrCodeData });
});

app.get('/status', (req, res) => {
    res.json({
        status: 'active',
        time: timeManager.getCurrentTime().format(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timezone: process.env.TZ
    });
});

// Обработка QR кода
client.on('qr', async (qr) => {
    logger.log('Новый QR код получен');
    try {
        qrCodeData = await qrcode.toDataURL(qr);
        logger.log('QR код успешно сгенерирован');
    } catch (err) {
        logger.log('Ошибка генерации QR кода: ' + err, 'error');
    }
});

// Очистка QR кода при успешном подключении
client.on('ready', async () => {
    qrCodeData = null; // Очищаем QR код
    logger.log('WhatsApp бот успешно запущен!');
    
    const reminderService = new ReminderService(client);
    const currentState = reminderService.getCurrentSchedule();
    
    try {
        await reminderService.sendReminder('startup', `
🤖 Бот-помощник перезапущен!
⏰ Текущее время: ${timeManager.formatTime(new Date())}
📅 Дата: ${timeManager.formatDate(new Date())}
👶 Возраст: ${currentState.age.months} месяцев ${currentState.age.days} дней

📋 Доступные команды:
• !режим - показать режим дня
• !занятия - список занятий
• !помощь - список команд
• !прогресс - развитие ребенка

💡 Продолжаю работу с текущего возраста
        `);
    } catch (error) {
        logger.log(`Ошибка отправки стартового сообщения: ${error.message}`, 'error');
    }
});

// Обработка отключения
client.on('disconnected', async (reason) => {
    logger.log('Бот отключен: ' + reason, 'error');
    await recoveryManager.handleError(new Error(reason), client);
});

// Обработка сообщений
client.on('message', async msg => {
    const reminderService = new ReminderService(client);
    
    // Тестовые команды
    switch(msg.body.toLowerCase()) {
        case '!тест':
            await reminderService.sendReminder('test', `
🔄 Тест бота:
✅ Бот работает
⏰ Время: ${timeManager.formatTime(new Date())}
📅 Дата: ${timeManager.formatDate(new Date())}
            `);
            break;

        case '!пинг':
            await reminderService.sendReminder('test', `
🏓 Понг!
⌛ Задержка: ${Date.now() - msg.timestamp}ms
            `);
            break;

        case '!статус':
            const uptime = process.uptime();
            const memory = process.memoryUsage();
            await reminderService.sendReminder('test', `
📊 Статус бота:
⏱ Аптайм: ${Math.floor(uptime / 3600)}ч ${Math.floor((uptime % 3600) / 60)}м
💾 Память: ${Math.round(memory.heapUsed / 1024 / 1024)}MB
⚡ Статус: Активен
            `);
            break;

        case '!помощь':
            await reminderService.sendReminder('test', `
📋 Команды для тестирования:
• !тест - проверка работы бота
• !пинг - проверка задержки
• !статус - статус системы
• !время - текущее время
• !эхо [текст] - повтор текста
• !debug - отладочная информация
            `);
            break;

        case '!время':
            await reminderService.sendReminder('test', `
🕒 Время сервера:
• Местное: ${timeManager.formatTime(new Date())}
• Дата: ${timeManager.formatDate(new Date())}
• Зона: ${process.env.TZ}
            `);
            break;

        default:
            // Проверяем команду !эхо
            if (msg.body.startsWith('!эхо ')) {
                const text = msg.body.slice(5); // Убираем '!эхо '
                await reminderService.sendReminder('test', `
🔄 Эхо:
${text}
                `);
            }
            // Проверяем команду !debug
            else if (msg.body === '!debug') {
                await reminderService.sendReminder('test', `
🔍 Отладочная информация:
• ID чата: ${msg.from}
• Тип: ${msg.type}
• Timestamp: ${msg.timestamp}
• Server: ${process.platform}
• Node: ${process.version}
• Memory: ${JSON.stringify(process.memoryUsage(), null, 2)}
                `);
            }
    }
});

// Добавим эндпоинт для проверки статуса QR кода
app.get('/qr-status', (req, res) => {
    res.json({
        hasQR: !!qrCodeData,
        timestamp: Date.now()
    });
});

// Запуск сервера и клиента
const server = app.listen(port, () => {
    logger.log(`Сервер запущен на порту ${port}`);
    
    // Запускаем keep-alive систему
    keepAlive.start();
    
    // Инициализируем WhatsApp клиент
    client.initialize().catch(err => {
        logger.log('Ошибка инициализации клиента: ' + err, 'error');
    });
});

// Обработка выключения
process.on('SIGTERM', () => {
    logger.log('Получен сигнал SIGTERM, выполняется корректное завершение...');
    server.close(() => {
        client.destroy();
        process.exit(0);
    });
}); 