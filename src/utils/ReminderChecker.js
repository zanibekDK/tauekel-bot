const fs = require('fs');
const path = require('path');

class ReminderChecker {
    constructor(config) {
        this.config = config;
        this.reminders = new Map();
        this.loadAllReminders();
    }

    // Загрузка всех напоминаний
    loadAllReminders() {
        for (let month = 4; month <= 12; month++) {
            const monthPath = path.join(__dirname, '..', 'schedules', `month-${month}`);
            
            // Проверяем все недели
            for (let week = 1; week <= 4; week++) {
                const weekPath = path.join(monthPath, `week-${week}`);
                
                // Проверяем все дни
                for (let day = 1; day <= 7; day++) {
                    const filePath = path.join(weekPath, `day-${day}.js`);
                    if (fs.existsSync(filePath)) {
                        const schedule = require(filePath);
                        this.validateSchedule(schedule, month, week, day);
                    }
                }
            }
        }
    }

    // Проверка расписания
    validateSchedule(schedule, month, week, day) {
        const requiredReminders = {
            4: [ // 4-й месяц
                'feeding_prep',
                'feeding',
                'morning_routine',
                'activity',
                'sleep_prep',
                'sensory_development',
                'social_development',
                'walk_prep'
            ],
            6: [ // 6-й месяц (добавляется прикорм)
                'feeding_prep',
                'feeding',
                'morning_routine',
                'activity',
                'sleep_prep',
                'sensory_development',
                'social_development',
                'walk_prep',
                'solid_food_prep',
                'solid_food'
            ],
            8: [ // 8-й месяц (добавляется ползание)
                'feeding_prep',
                'feeding',
                'morning_routine',
                'activity',
                'sleep_prep',
                'sensory_development',
                'social_development',
                'walk_prep',
                'solid_food',
                'crawling_practice'
            ],
            10: [ // 10-й месяц (добавляется ходьба)
                'feeding_prep',
                'feeding',
                'morning_routine',
                'activity',
                'sleep_prep',
                'sensory_development',
                'social_development',
                'walk_prep',
                'solid_food',
                'walking_practice'
            ],
            12: [ // 12-й месяц (полный набор активностей)
                'feeding_prep',
                'feeding',
                'morning_routine',
                'activity',
                'sleep_prep',
                'sensory_development',
                'social_development',
                'walk_prep',
                'solid_food',
                'walking_practice',
                'speech_development',
                'social_games'
            ]
        };

        // Проверяем наличие всех необходимых напоминаний
        const required = requiredReminders[month] || requiredReminders[4];
        const missing = required.filter(type => 
            !Object.values(schedule.schedule).some(event => event.type === type)
        );

        if (missing.length > 0) {
            console.log(`⚠️ Месяц ${month}, неделя ${week}, день ${day}:`);
            console.log('Отсутствуют напоминания:', missing.join(', '));
        }

        // Проверяем корректность времени
        Object.entries(schedule.schedule).forEach(([time, event]) => {
            if (!this.isValidTime(time)) {
                console.log(`⚠️ Некорректное время ${time} для события ${event.type}`);
            }
        });
    }

    // Проверка корректности времени
    isValidTime(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    }

    // Получение статистики напоминаний
    getStatistics() {
        return {
            totalDays: this.reminders.size,
            byMonth: Array.from({ length: 9 }, (_, i) => i + 4).map(month => ({
                month,
                reminders: this.countRemindersForMonth(month)
            }))
        };
    }

    // Подсчет напоминаний для месяца
    countRemindersForMonth(month) {
        let count = 0;
        this.reminders.forEach(schedule => {
            if (schedule.age.months === month) {
                count += Object.keys(schedule.schedule).length;
            }
        });
        return count;
    }

    // Проверка полноты охвата
    checkCoverage() {
        console.log('📊 Проверка охвата напоминаний:');
        
        const stats = this.getStatistics();
        console.log(`\nВсего дней с напоминаниями: ${stats.totalDays}`);
        
        stats.byMonth.forEach(({ month, reminders }) => {
            console.log(`\nМесяц ${month}:`);
            console.log(`Количество напоминаний: ${reminders}`);
            console.log(`Среднее количество напоминаний в день: ${(reminders / 30).toFixed(1)}`);
        });
    }

    // Проверка специальных событий
    checkSpecialEvents() {
        console.log('\n🎉 Проверка специальных событий:');
        
        const specialEvents = [
            { month: 6, event: 'Полгода' },
            { month: 9, event: 'Первые шаги' },
            { month: 12, event: 'Первый год' }
        ];

        specialEvents.forEach(({ month, event }) => {
            const hasEvent = this.checkEventInMonth(month, event);
            console.log(`${hasEvent ? '✅' : '❌'} ${event} (${month} месяцев)`);
        });
    }

    // Проверка события в месяце
    checkEventInMonth(month, eventName) {
        return Array.from(this.reminders.values()).some(schedule => 
            schedule.age.months === month && 
            Object.values(schedule.schedule).some(event => 
                event.title.toLowerCase().includes(eventName.toLowerCase())
            )
        );
    }
}

// Использование
const checker = new ReminderChecker(require('../config/config'));
checker.checkCoverage();
checker.checkSpecialEvents();

module.exports = ReminderChecker; 