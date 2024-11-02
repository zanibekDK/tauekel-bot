const { exec } = require('child_process');
const logger = require('../src/utils/logger');

async function update() {
    try {
        // Останавливаем службу
        await execCommand('net stop TauekelBot');
        
        // Получаем обновления
        await execCommand('git pull origin main');
        
        // Обновляем зависимости
        await execCommand('npm install');
        
        // Запускаем службу
        await execCommand('net start TauekelBot');
        
        logger.log('Обновление успешно завершено');
    } catch (error) {
        logger.log(`Ошибка обновления: ${error.message}`, 'error');
    }
}

function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}

update(); 