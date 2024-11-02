const reminderTemplates = require('../templates/reminderTemplates');

class ReminderService {
    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.recipientNumber = config.whatsapp.recipientNumber;
    }

    async sendReminder(type, customMessage = '') {
        const template = reminderTemplates[type] || customMessage;
        
        try {
            await this.client.sendPresenceAvailable();
            await this.client.sendMessage(this.recipientNumber, template);
        } catch (error) {
            console.error(`Ошибка отправки напоминания:`, error);
        }
    }

    // Улучшенная обработка команд с подробными ответами
    async handleCommand(message) {
        const text = message.toLowerCase().trim();
        
        // Основные команды
        if (text.startsWith('!')) {
            const [command, ...args] = text.slice(1).split(' ');
            await this.executeCommand(command, args);
            return;
        }

        // Обработка ключевых слов с контекстными ответами
        if (text.includes('устал') || text.includes('спать')) {
            await this.sendSleepAdvice();
        } else if (text.includes('кушать') || text.includes('голоден')) {
            await this.sendFeedingAdvice();
        } else if (text.includes('плачет') || text.includes('капризничает')) {
            await this.sendComfortingAdvice();
        } else if (text.includes('температура')) {
            await this.sendTemperatureAdvice();
        } else if (text.includes('гулять') || text.includes('прогулка')) {
            await this.sendWalkingAdvice();
        } else if (text.includes('игры') || text.includes('занятия')) {
            await this.sendActivityAdvice();
        } else if (text.includes('развитие')) {
            await this.sendDevelopmentAdvice();
        } else {
            await this.sendHelpMessage();
        }
    }

    // Новые методы с подробными советами
    async sendTemperatureAdvice() {
        await this.sendReminder('custom', `
🌡 Рекомендации по температуре:

1. В комнате:
   • Оптимальная: 20-22°C
   • Влажность: 50-70%
   • Проветривать каждые 2 часа
   • Избегать сквозняков

2. Как одевать ${this.config.baby.name}:
   • Дома: 1-2 слоя одежды
   • На прогулку: +1 слой к одежде взрослого
   • Ночью: легкий спальный мешок/пижама

3. Признаки перегрева:
   • Потеет шея и спина
   • Красные щечки
   • Беспокойство
   • Горячие ручки

4. Признаки переохлаждения:
   • Холодный носик
   • Бледность
   • Прохладные конечности
   • Сонливость

⚠️ При сомнениях лучше одеть легче и следить за состоянием
        `);
    }

    async sendWalkingAdvice() {
        const now = new Date();
        const hour = now.getHours();
        
        let timeAdvice = '';
        if (hour < 11) {
            timeAdvice = 'Сейчас хорошее время для прогулки! Не жарко и много солнца витамина D.';
        } else if (hour >= 11 && hour < 16) {
            timeAdvice = 'В это время лучше гулять в тени. Не забудьте головной убор!';
        } else {
            timeAdvice = 'Вечерняя прогулка перед сном поможет лучше уснуть.';
        }

        await this.sendReminder('custom', `
🌳 Рекомендации по прогулке:

⏰ ${timeAdvice}

✅ Подготовка:
1. Проверить погоду:
   • Температура
   • Осадки
   • Ветер
   • УФ-индекс

2. Взять с собой:
   • Запасной подгузник
   • Влажные салфетки
   • Пеленку для пеленания
   • Бутылочку с водой
   • Легкую игрушку
   • Дождевик/солнцезащитный козырек

3. Одежда:
   • По погоде (+1 слой)
   • Удобная
   • Не стесняющая движения
   • Защита от солнца/ветра

4. Активности на прогулке:
   • Наблюдение за природой
   • Рассматривание деревьев
   • Слушание звуков
   • Тактильные ощущения

⏱ Рекомендуемая длительность: 40-60 минут
💡 Следить за состоянием малыша
        `);
    }

    async sendActivityAdvice() {
        await this.sendReminder('custom', `
🎯 Развивающие занятия для ${this.config.baby.name}:

1. Физическое развитие (15-20 минут):
   • Выкладывание на животик
   • "Велосипед"
   • Повороты на бок
   • Тренировка хватания

2. Сенсорное развитие (10-15 минут):
   • Разные текстуры
   • Контрастные картинки
   • Звуковые игрушки
   • Новые вкусы и запахи

3. Социальное развитие (в течение дня):
   • Разговоры с малышом
   • Песенки и потешки
   • Мимическая гимнастика
   • Игры "Ку-ку"

4. Когнитивное развитие (10-15 минут):
   • Поиск спрятанных игрушек
   • Рассматривание книжек
   • Исследование предметов
   • Причинно-следственные связи

⚠️ Важно:
• Следить за настроением
• Делать перерывы
• Хвалить за успехи
• Не перегружать

💡 Лучшее время для занятий:
• После сна
• После кормления (через 30 минут)
• Когда малыш в хорошем настроении
        `);
    }

    // Отправка дневного расписания
    async sendDailySchedule() {
        const schedule = Object.entries(this.config.schedule.dailyRoutine)
            .map(([time, activity]) => `${time} - ${activity.title}`)
            .join('\n');

        await this.sendReminder('custom', `
📋 Режим дня ${this.config.baby.name}:

${schedule}

💡 Используйте:
• !кормление - режим кормления
• !сон - режим сна
• !занятия - занятия на сегодня
        `);
    }

    // Отправка расписания кормлений
    async sendFeedingSchedule() {
        await this.sendReminder('custom', `
🍼 Режим кормления:

⏰ Дневные кормления:
${this.config.sleepFeeding.feeding.dailyFeeds.map(time => `• ${time}`).join('\n')}

🌙 Ночные кормления:
${this.config.sleepFeeding.feeding.nightFeeds.map(time => `• ${time}`).join('\n')}

📊 Рекомендуемый объем:
• День: ${this.config.sleepFeeding.feeding.portions.day}
• Ночь: ${this.config.sleepFeeding.feeding.portions.night}

💡 Интервал: ${this.config.sleepFeeding.feeding.frequency}
        `);
    }

    // Отправка расписания сна
    async sendSleepSchedule() {
        await this.sendReminder('custom', `
😴 Режим сна:

☀️ Дневной сон:
${this.config.sleepFeeding.sleep.dailyNaps.map(nap => 
    `• ${nap.time} (${nap.duration})`
).join('\n')}

🌙 Ночной сон:
• Время: ${this.config.sleepFeeding.sleep.nightSleep.time}
• Длительность: ${this.config.sleepFeeding.sleep.nightSleep.duration}
• Кормления: ${this.config.sleepFeeding.sleep.nightSleep.feeds}
        `);
    }

    // Отправка списка занятий
    async sendActivitiesList() {
        const today = new Date().toLocaleLowerCase('en-US', { weekday: 'monday' });
        const activities = this.config.schedule.weeklyActivities[today];

        if (activities) {
            await this.sendReminder('custom', `
🎯 Занятия на сегодня:
Фокус: ${activities.focus}

${activities.activities.map(activity => `• ${activity}`).join('\n')}
            `);
        }
    }

    // Отправка напоминания о прогулке
    async sendWalkReminder() {
        await this.sendReminder('walkPrep');
    }

    // Отправка справки
    async sendHelpMessage() {
        await this.sendReminder('custom', `
📋 Доступные команды:

• !режим - показать режим дня
• !кормление - режим кормления
• !сон - режим сна
• !занятия - занятия на сегодня
• !прогулка - подготовка к прогулке
• !помощь - список команд

💡 Бот автоматически напоминает о:
• Кормлении
• Сне
• Занятиях
• Прогулках
        `);
    }
}

module.exports = ReminderService; 