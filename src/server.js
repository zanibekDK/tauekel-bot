const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const path = require('path');
const logger = require('./utils/logger');
const timeManager = require('./utils/timeManager');
const recoveryManager = require('./utils/recoveryManager');
const keepAlive = require('./utils/keepAlive');

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
    } catch (err) {
        logger.log('Ошибка генерации QR кода: ' + err, 'error');
    }
});

// Обработка готовности клиента
client.on('ready', () => {
    logger.log('WhatsApp бот успешно запущен!');
    qrCodeData = null; // Очищаем QR код после успешной авторизации
});

// Обработка отключения
client.on('disconnected', async (reason) => {
    logger.log('Бот отключен: ' + reason, 'error');
    await recoveryManager.handleError(new Error(reason), client);
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