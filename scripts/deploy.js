const { exec } = require('child_process');
const path = require('path');

// Сохраняем сессию WhatsApp
const sessionPath = path.join(__dirname, '../.wwebjs_auth');
const backupPath = path.join(__dirname, '../backup');

// Копируем файлы сессии
exec(`cp -r ${sessionPath} ${backupPath}`, (error) => {
    if (error) {
        console.error('Ошибка сохранения сессии:', error);
        return;
    }
    console.log('Сессия WhatsApp сохранена');
}); 