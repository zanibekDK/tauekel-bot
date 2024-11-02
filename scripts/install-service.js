const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
    name: 'TauekelBot',
    description: 'WhatsApp бот для ухода за ребенком',
    script: path.join(__dirname, '../src/server.js'),
    nodeOptions: [],
    workingDirectory: path.join(__dirname, '..'),
    allowServiceLogon: true
});

svc.on('install', () => {
    console.log('Служба успешно установлена');
    svc.start();
});

svc.on('error', (error) => {
    console.error('Ошибка службы:', error);
});

svc.install(); 