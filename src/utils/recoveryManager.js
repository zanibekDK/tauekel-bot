const logger = require('./logger');
const timeManager = require('./timeManager');
const fs = require('fs');
const path = require('path');

class RecoveryManager {
    constructor() {
        this.stateFile = path.join(__dirname, '..', 'data', 'botState.json');
        this.maxRetries = 5;
        this.retryDelay = 60000; // 1 минута
    }

    // Сохранение состояния
    saveState(state) {
        try {
            fs.writeFileSync(this.stateFile, JSON.stringify({
                ...state,
                lastActiveTime: timeManager.getCurrentTime().toISOString()
            }), 'utf8');
        } catch (error) {
            logger.log(`Ошибка сохранения состояния: ${error.message}`, 'error');
        }
    }

    // Восстановление состояния
    loadState() {
        try {
            if (fs.existsSync(this.stateFile)) {
                return JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
            }
        } catch (error) {
            logger.log(`Ошибка загрузки состояния: ${error.message}`, 'error');
        }
        return null;
    }

    // Обработка перезапуска
    async handleRestart(client, reminderService) {
        const state = this.loadState();
        if (state && state.lastActiveTime) {
            const missedReminders = timeManager.getMissedReminders(state.lastActiveTime);
            
            if (missedReminders.length > 0) {
                logger.log(`Обнаружено ${missedReminders.length} пропущенных напоминаний`, 'info');
                
                for (const reminder of missedReminders) {
                    await reminderService.sendReminder(reminder.type, reminder.message);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка между сообщениями
                }
            }
        }
    }

    // Автоматическое восстановление при сбое
    async handleError(error, client) {
        logger.log(`Произошла ошибка: ${error.message}`, 'error');

        for (let i = 0; i < this.maxRetries; i++) {
            try {
                logger.log(`Попытка восстановления ${i + 1}/${this.maxRetries}`, 'info');
                
                await client.destroy();
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                await client.initialize();
                
                logger.log('Восстановление успешно', 'info');
                return true;
            } catch (retryError) {
                logger.log(`Ошибка восстановления: ${retryError.message}`, 'error');
            }
        }

        logger.log('Превышено максимальное количество попыток восстановления', 'error');
        return false;
    }
}

module.exports = new RecoveryManager(); 