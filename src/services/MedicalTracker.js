const cron = require('node-cron');

class MedicalTracker {
    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.recipientNumber = config.whatsapp.recipientNumber;
        this.upcomingEvents = new Map();
        this.initializeEvents();
    }

    initializeEvents() {
        // Инициализация предстоящих прививок
        Object.entries(this.config.medical.vaccinations).forEach(([date, info]) => {
            this.upcomingEvents.set(date, {
                type: 'vaccination',
                ...info
            });
        });

        // Инициализация предстоящих осмотров
        Object.entries(this.config.medical.checkups).forEach(([date, info]) => {
            this.upcomingEvents.set(date, {
                type: 'checkup',
                ...info
            });
        });
    }

    async sendNotification(message) {
        try {
            await this.client.sendMessage(this.recipientNumber, message);
        } catch (error) {
            console.error('Ошибка отправки медицинского уведомления:', error);
        }
    }

    // Получение ближайшего события
    getNextEvent() {
        const today = new Date();
        let nextEvent = null;
        let nextDate = null;

        this.upcomingEvents.forEach((event, date) => {
            const eventDate = new Date(date);
            if (eventDate >= today && (!nextDate || eventDate < nextDate)) {
                nextEvent = event;
                nextDate = eventDate;
            }
        });

        return { date: nextDate, event: nextEvent };
    }

    // Форматирование сообщения о событии
    formatEventMessage(date, event) {
        if (event.type === 'vaccination') {
            return `
💉 Предстоящая вакцинация:

📅 Дата: ${date}
🏥 Тип: ${event.type}

✅ Подготовка:
${event.preparation.map(step => `• ${step}`).join('\n')}

⚠️ После вакцинации:
• Наблюдать за состоянием 3 дня
• Измерять температуру
• Избегать купания
• При повышении температуры дать жаропонижающее
            `;
        } else {
            return `
👨‍⚕️ Предстоящий медосмотр:

📅 Дата: ${date}
🏥 Тип: ${event.type}

${event.specialists ? `
👥 Специалисты:
${event.specialists.map(spec => `• ${spec}`).join('\n')}
` : ''}

📏 Измерения:
${event.measurements.map(m => `• ${m}`).join('\n')}

💡 Не забудьте взять:
• Пелёнку
• Сменный подгузник
• Бутылочку воды
• Медицинскую карту
            `;
        }
    }

    // Настройка напоминаний
    setupReminders() {
        // Ежедневная проверка предстоящих событий
        cron.schedule('0 9 * * *', async () => {
            const { date, event } = this.getNextEvent();
            if (date) {
                const daysUntil = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
                
                if (daysUntil === 7 || daysUntil === 3 || daysUntil === 1) {
                    const message = this.formatEventMessage(date.toLocaleDateString(), event);
                    await this.sendNotification(`
⚠️ Напоминание! До медицинского события осталось ${daysUntil} ${this.getDayWord(daysUntil)}!

${message}
                    `);
                }
            }
        });
    }

    getDayWord(days) {
        if (days === 1) return 'день';
        if (days > 1 && days < 5) return 'дня';
        return 'дней';
    }

    // Добавление нового события
    addEvent(date, eventInfo) {
        this.upcomingEvents.set(date, eventInfo);
    }

    // Получение всех предстоящих событий
    getAllUpcomingEvents() {
        const events = [];
        this.upcomingEvents.forEach((event, date) => {
            if (new Date(date) >= new Date()) {
                events.push({ date, ...event });
            }
        });
        return events.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
}

module.exports = MedicalTracker; 