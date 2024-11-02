const fs = require('fs');
const path = require('path');
const messageTemplates = require('./messageTemplates');

class GenerateAllSchedules {
    constructor(startDate, babyName) {
        this.startDate = new Date(startDate);
        this.babyName = babyName;
        this.totalDays = 270;
        this.templates = messageTemplates;
    }

    async generateAllSchedules() {
        console.log('🚀 Начинаем генерацию файлов...');
        
        // Создаем структуру папок
        this.createFolderStructure();

        // Генерируем файлы для каждого дня
        let currentDate = new Date(this.startDate);
        for (let day = 0; day < this.totalDays; day++) {
            const age = this.calculateAge(currentDate);
            
            // Проверяем, что месяц не превышает 12
            if (age.months > 12) {
                console.log('✅ Генерация завершена (достигнут 12-й месяц)');
                break;
            }

            const schedule = await this.generateDaySchedule(currentDate, age);
            await this.saveScheduleFile(schedule, age);
            
            currentDate.setDate(currentDate.getDate() + 1);
            
            // Показываем прогресс
            if (day % 30 === 0) {
                console.log(`📝 Прогресс: ${Math.floor((day / this.totalDays) * 100)}%`);
            }
        }

        console.log('✨ Генерация файлов успешно завершена');
    }

    createFolderStructure() {
        // Создаем папки только для месяцев 4-12
        for (let month = 4; month <= 12; month++) {
            const monthPath = path.join(__dirname, '..', 'schedules', `month-${month}`);
            if (!fs.existsSync(monthPath)) {
                fs.mkdirSync(monthPath, { recursive: true });
            }

            for (let week = 1; week <= 5; week++) {
                const weekPath = path.join(monthPath, `week-${week}`);
                if (!fs.existsSync(weekPath)) {
                    fs.mkdirSync(weekPath);
                }
            }
        }
    }

    calculateAge(date) {
        const diffTime = Math.abs(date - this.startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const months = 4 + Math.floor(diffDays / 30);
        
        // Ограничиваем максимальный месяц до 12
        return {
            months: Math.min(months, 12),
            days: diffDays % 30
        };
    }

    async generateDaySchedule(date, age) {
        const schedule = {
            date: date.toISOString().split('T')[0],
            age: age,
            schedule: this.getDailySchedule(age),
            recommendations: await this.getRecommendations(age),
            specialEvents: this.getSpecialEvents(date, age)
        };

        return schedule;
    }

    getDailySchedule(age) {
        // Базовое расписание для всех возрастов
        const baseSchedule = {
            "05:55": {
                type: "feeding_prep",
                title: "⏰ Подготовка к кормлению",
                message: this.templates.getTemplate('feeding', 'prep', this.babyName, age),
                importance: "high"
            },
            "06:00": {
                type: "feeding",
                title: "🍼 Первое кормление",
                message: this.templates.getTemplate('feeding', 'main', this.babyName, age),
                duration: "30"
            },
            "07:00": {
                type: "activity",
                title: "🎯 Утренние занятия",
                message: this.templates.getTemplate('activities', 'morning', this.babyName, age),
                duration: "20"
            },
            "08:00": {
                type: "sensory_development",
                title: "👀 Сенсорное развитие",
                message: this.templates.getTemplate('activities', 'sensory', this.babyName, age),
                duration: "15"
            },
            "09:00": {
                type: "social_development",
                title: "😊 Социальное развитие",
                message: this.templates.getTemplate('activities', 'social', this.babyName, age),
                duration: "15"
            },
            "09:30": {
                type: "walk_prep",
                title: "🌳 Подготовка к прогулке",
                message: this.templates.getTemplate('activities', 'walk_prep', this.babyName, age),
                importance: "high"
            },
            "10:00": {
                type: "sleep_prep",
                title: "😴 Подготовка ко сну",
                message: this.templates.getTemplate('sleep', 'prep', this.babyName, age),
                importance: "high"
            }
        };

        return this.adjustScheduleForAge(baseSchedule, age);
    }

    adjustScheduleForAge(schedule, age) {
        // Для 6+ месяцев добавляем прикорм
        if (age.months >= 6) {
            schedule["09:45"] = {
                type: "solid_food_prep",
                title: "🥄 Подготовка к прикорму",
                message: this.templates.getTemplate('feeding', 'solid_food_prep', this.babyName, age),
                importance: "high"
            };
            schedule["10:00"] = {
                type: "solid_food",
                title: "🥄 Прикорм",
                message: this.templates.getTemplate('feeding', 'solid_food', this.babyName, age),
                importance: "high"
            };
        }

        // Для 8+ месяцев добавляем ползание
        if (age.months >= 8) {
            schedule["11:00"] = {
                type: "crawling_practice",
                title: "🐛 Практика ползания",
                message: this.templates.getTemplate('activities', 'crawling', this.babyName, age),
                duration: "20"
            };
        }

        // Для 10+ месяцев добавляем ходьбу
        if (age.months >= 10) {
            schedule["14:00"] = {
                type: "walking_practice",
                title: "🚶‍♂️ Практика ходьбы",
                message: this.templates.getTemplate('activities', 'walking', this.babyName, age),
                duration: "15"
            };
        }

        // Для 12 месяцев добавляем речевое развитие и социальные игры
        if (age.months >= 12) {
            schedule["15:00"] = {
                type: "speech_development",
                title: "🗣 Речевое развитие",
                message: this.templates.getTemplate('activities', 'speech', this.babyName, age),
                duration: "15"
            };
            schedule["16:00"] = {
                type: "social_games",
                title: "👥 Социальные игры",
                message: this.templates.getTemplate('activities', 'social', this.babyName, age),
                duration: "20"
            };
        }

        return schedule;
    }

    async getRecommendations(age) {
        return {
            focus: this.templates.getTemplate('development', 'focus', this.babyName, age),
            activities: this.templates.getTemplate('development', 'activities', this.babyName, age),
            notes: this.templates.getTemplate('development', 'notes', this.babyName, age)
        };
    }

    getSpecialEvents(date, age) {
        const events = [];

        // Проверяем месячный день рождения
        if (date.getDate() === 29) {
            events.push({
                type: "monthly_birthday",
                title: `🎉 ${age.months} месяцев!`,
                message: this.templates.getTemplate('specialEvents', 'monthlyBirthday', this.babyName, age)
            });
        }

        // Проверяем особые события
        if (age.months === 6) {
            events.push({
                type: "half_year",
                title: "🎈 Полгода!",
                message: this.templates.getTemplate('specialEvents', 'halfYear', this.babyName, age)
            });
        }

        return events;
    }

    async saveScheduleFile(schedule, age) {
        try {
            const month = `month-${age.months}`;
            const week = `week-${Math.floor(age.days / 7) + 1}`;
            const day = `day-${age.days % 7 + 1}`;

            const filePath = path.join(
                __dirname,
                '..',
                'schedules',
                month,
                week,
                `${day}.js`
            );

            const fileContent = `// День для ${this.babyName} - ${schedule.date}
module.exports = ${JSON.stringify(schedule, null, 2)};`;

            fs.writeFileSync(filePath, fileContent);
        } catch (error) {
            console.error(`❌ Ошибка при сохранении файла для возраста ${age.months} месяцев ${age.days} дней:`, error);
        }
    }

    getDateComment(date) {
        return `День для ${this.babyName} - ${date}`;
    }
}

module.exports = GenerateAllSchedules; 