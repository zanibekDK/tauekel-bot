const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config/config');
const MessageScheduler = require('./services/MessageScheduler');
const ReminderService = require('./services/ReminderService');
const logger = require('./utils/logger');
const recoveryManager = require('./utils/recoveryManager');
const timeManager = require('./utils/timeManager');

// Инициализация клиента WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "tauekel-bot" }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920x1080'
        ]
    }
});

let reminderService;
let messageScheduler;

// Обработка QR кода
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    logger.log('QR код сгенерирован. Отсканируйте его в WhatsApp.');
});

// При успешном подключении
client.on('ready', async () => {
    logger.log('Бот успешно подключен к WhatsApp!');
    
    // Инициализация сервисов
    reminderService = new ReminderService(client, config);
    messageScheduler = new MessageScheduler(client, config);
    
    // Восстановление после перезапуска
    await recoveryManager.handleRestart(client, reminderService);
    
    // Запуск планировщика
    messageScheduler.startScheduling();

    // Сохраняем состояние каждые 5 минут
    setInterval(() => {
        recoveryManager.saveState({
            lastActiveTime: timeManager.getCurrentTime().toISOString()
        });
    }, 300000);

    // Отправка приветственного сообщения
    await reminderService.sendReminder('custom', `
🤖 Бот-помощник запущен!
⏰ Текущее время: ${timeManager.formatTime(new Date())}
📅 Дата: ${timeManager.formatDate(new Date())}

📋 Доступные команды:
• !режим - показать режим дня
• !занятия - список занятий
• !помощь - список команд
• !прогресс - развитие ${config.baby.name}

💡 Бот будет отправлять напоминания автоматически
    `);
});

// Обработка отключения
client.on('disconnected', async (reason) => {
    logger.log(`Бот отключен: ${reason}`, 'error');
    
    // Попытка восстановления
    const recovered = await recoveryManager.handleError(new Error(reason), client);
    if (!recovered) {
        logger.log('Не удалось восстановить соединение. Требуется ручное вмешательство.', 'error');
        process.exit(1);
    }
});

// Запуск клиента
client.initialize().catch(async error => {
    logger.log(`Ошибка инициализации: ${error.message}`, 'error');
    await recoveryManager.handleError(error, client);
}); 