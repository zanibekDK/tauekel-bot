const cron = require('node-cron');
const reminderTemplates = require('../templates/reminderTemplates');

class MessageScheduler {
    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.recipientNumber = config.whatsapp.recipientNumber;
    }

    async sendMessage(type, customMessage = '') {
        try {
            const message = customMessage || reminderTemplates[type];
            await this.client.sendPresenceAvailable();
            await new Promise(resolve => setTimeout(resolve, this.config.whatsapp.typingDelay));
            await this.client.sendMessage(this.recipientNumber, message);
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
        }
    }

    startScheduling() {
        // Утренний блок
        cron.schedule('55 5 * * *', () => {
            this.sendMessage('feedingPrep');
        });

        cron.schedule('0 6 * * *', () => {
            this.sendMessage('feeding');
        });

        cron.schedule('45 6 * * *', () => {
            this.sendMessage('morningExercise');
        });

        cron.schedule('0 8 * * *', () => {
            this.sendMessage('sensoryDevelopment');
        });

        cron.schedule('30 9 * * *', () => {
            this.sendMessage('socialDevelopment');
        });

        cron.schedule('30 10 * * *', () => {
            this.sendMessage('walkPrep');
        });

        // Еженедельные напоминания
        cron.schedule('0 9 * * 1', () => {
            const weeklyFocus = reminderTemplates.getWeeklyFocus('monday');
            this.sendMessage('custom', weeklyFocus);
        });

        // Напоминания для папы
        cron.schedule('0 9 * * 1-5', () => {
            this.sendMessage('custom', `
👨‍💼 Папа ушёл на работу

💝 Пожелайте хорошего дня!
            `);
        });

        cron.schedule('0 18 * * 1-5', () => {
            this.sendMessage('custom', `
👨‍👦 Папа вернулся!

💡 Время для:
• Общения с ${this.config.baby.name}
• Совместных игр
• Помощи маме
            `);
        });

        // Ежедневные итоги
        cron.schedule('0 21 * * *', () => {
            this.sendMessage('custom', `
🌙 Итоги дня для ${this.config.baby.name}:

📝 Не забудьте записать:
• Настроение и самочувствие
• Новые достижения
• Важные моменты

😴 Пора готовиться ко сну!
            `);
        });
    }
}

module.exports = MessageScheduler; 