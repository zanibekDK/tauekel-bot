const cron = require('node-cron');

class SleepFeedingTracker {
    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.recipientNumber = config.whatsapp.recipientNumber;
        
        // Журналы для отслеживания
        this.sleepLog = new Map();
        this.feedingLog = new Map();
    }

    // Запись события сна
    async logSleep(type, startTime) {
        const date = new Date().toISOString().split('T')[0];
        if (!this.sleepLog.has(date)) {
            this.sleepLog.set(date, []);
        }
        
        this.sleepLog.get(date).push({
            type,
            startTime,
            timestamp: new Date()
        });
    }

    // Запись события кормления
    async logFeeding(amount, type = 'regular') {
        const date = new Date().toISOString().split('T')[0];
        if (!this.feedingLog.has(date)) {
            this.feedingLog.set(date, []);
        }

        this.feedingLog.get(date).push({
            amount,
            type,
            timestamp: new Date()
        });
    }

    // Форматирование сообщения о следующем кормлении
    formatNextFeedingMessage() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        // Поиск следующего кормления
        const allFeeds = [
            ...this.config.sleepFeeding.feeding.dailyFeeds,
            ...this.config.sleepFeeding.feeding.nightFeeds
        ].map(time => {
            const [hours, minutes] = time.split(':').map(Number);
            return { hours, minutes };
        });

        const nextFeeding = allFeeds.find(feed => {
            return feed.hours > currentHour || 
                   (feed.hours === currentHour && feed.minutes > currentMinutes);
        });

        return `
🍼 Следующее кормление:

⏰ Время: ${nextFeeding ? `${nextFeeding.hours}:${nextFeeding.minutes.toString().padStart(2, '0')}` : 'Не определено'}
📊 Рекомендуемый объем: ${this.getRecommendedAmount(nextFeeding)}

💡 Напоминания:
• Проверить температуру смеси
• Подготовить место
• Сменить подгузник перед кормлением
        `;
    }

    // Получение рекомендуемого объема
    getRecommendedAmount(feedingTime) {
        if (!feedingTime) return this.config.sleepFeeding.feeding.portions.day;
        
        const isNightFeeding = feedingTime.hours >= 22 || feedingTime.hours <= 4;
        return isNightFeeding ? 
            this.config.sleepFeeding.feeding.portions.night : 
            this.config.sleepFeeding.feeding.portions.day;
    }

    // Получение статистики за день
    async getDailyStats() {
        const date = new Date().toISOString().split('T')[0];
        const sleepEvents = this.sleepLog.get(date) || [];
        const feedingEvents = this.feedingLog.get(date) || [];

        return `
📊 Статистика за ${new Date().toLocaleDateString()}:

😴 Сон:
${sleepEvents.map(event => `• ${event.type}: ${this.formatTime(event.timestamp)}`).join('\n')}

🍼 Кормления:
${feedingEvents.map(event => `• ${this.formatTime(event.timestamp)}: ${event.amount} мл`).join('\n')}

💡 Рекомендации:
• Интервал между кормлениями: ${this.config.sleepFeeding.feeding.frequency}
• Дневной сон: 3-4 раза по ${this.config.sleepFeeding.sleep.dailyNaps[0].duration}
• Ночной сон: ${this.config.sleepFeeding.sleep.nightSleep.duration}
        `;
    }

    // Форматирование времени
    formatTime(date) {
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Настройка напоминаний
    setupReminders() {
        // Напоминания о кормлении
        this.config.sleepFeeding.feeding.dailyFeeds.forEach(time => {
            const [hours, minutes] = time.split(':');
            cron.schedule(`${minutes} ${hours} * * *`, () => {
                this.sendFeedingReminder();
            });
        });

        // Напоминания о сне
        this.config.sleepFeeding.sleep.dailyNaps.forEach(nap => {
            const [hours, minutes] = nap.time.split(':');
            cron.schedule(`${minutes} ${hours} * * *`, () => {
                this.sendSleepReminder(nap);
            });
        });
    }

    // Отправка напоминания о кормлении
    async sendFeedingReminder() {
        const message = this.formatNextFeedingMessage();
        await this.sendNotification(message);
    }

    // Отправка напоминания о сне
    async sendSleepReminder(nap) {
        const message = `
😴 Время для сна!

⏰ Рекомендуемая длительность: ${nap.duration}

✅ Подготовка:
• Проверить подгузник
• Затемнить комнату
• Включить белый шум
• Создать комфортную температуру

💡 Следить за признаками усталости:
• Трет глазки
• Зевает
• Капризничает
        `;
        await this.sendNotification(message);
    }

    // Отправка уведомления
    async sendNotification(message) {
        try {
            await this.client.sendMessage(this.recipientNumber, message);
        } catch (error) {
            console.error('Ошибка отправки уведомления:', error);
        }
    }
}

module.exports = SleepFeedingTracker; 