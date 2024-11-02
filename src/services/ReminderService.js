const config = require('../config/config');
const stateManager = require('../utils/stateManager');
const moment = require('moment-timezone');

class ReminderService {
    constructor(client) {
        this.client = client;
        this.recipient = config.whatsapp.recipients.primary;
        this.state = stateManager.loadState();
    }

    async sendReminder(type, message) {
        try {
            await this.client.sendMessage(this.recipient, message);
            stateManager.recordMessage(type, message);
            console.log(`Сообщение отправлено на номер: ${this.recipient}`);
        } catch (error) {
            console.error(`Ошибка отправки сообщения: ${error.message}`);
            // Попытка повторной отправки
            for (let i = 0; i < config.whatsapp.retryAttempts; i++) {
                try {
                    await new Promise(resolve => setTimeout(resolve, config.whatsapp.messageDelay));
                    await this.client.sendMessage(this.recipient, message);
                    stateManager.recordMessage(type, message);
                    console.log(`Сообщение успешно отправлено после повторной попытки`);
                    return;
                } catch (retryError) {
                    console.error(`Ошибка повторной отправки: ${retryError.message}`);
                }
            }
        }
    }

    getCurrentSchedule() {
        const state = stateManager.updateState();
        return {
            age: state.currentAge,
            month: state.currentMonth,
            lastMessage: state.lastMessageTime
        };
    }

    shouldSendMessage(messageType) {
        const recentMessages = stateManager.getLastMessages(1); // За последний час
        return !recentMessages.some(msg => msg.type === messageType);
    }
}

module.exports = ReminderService; 