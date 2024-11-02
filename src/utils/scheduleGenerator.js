const fs = require('fs');
const path = require('path');

class ScheduleGenerator {
    constructor(startDate, babyName) {
        this.startDate = new Date(startDate);
        this.babyName = babyName;
        this.totalDays = 360;
    }

    // Создание структуры папок
    createFolderStructure() {
        for (let month = 4; month <= 12; month++) {
            const monthFolder = path.join(__dirname, '..', 'schedules', `month-${month}`);
            if (!fs.existsSync(monthFolder)) {
                fs.mkdirSync(monthFolder, { recursive: true });
            }

            for (let week = 1; week <= 4; week++) {
                const weekFolder = path.join(monthFolder, `week-${week}`);
                if (!fs.existsSync(weekFolder)) {
                    fs.mkdirSync(weekFolder);
                }
            }
        }
    }

    // Генерация всех файлов
    generateAllSchedules() {
        this.createFolderStructure();
        let currentDate = new Date(this.startDate);

        for (let day = 0; day < this.totalDays; day++) {
            const age = this.calculateAge(currentDate);
            const schedule = this.generateDaySchedule(currentDate, age);
            this.saveScheduleFile(schedule, age);
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    // Расчет возраста
    calculateAge(date) {
        const diffTime = Math.abs(date - this.startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return {
            months: 4 + Math.floor(diffDays / 30),
            days: diffDays % 30
        };
    }

    // Генерация расписания для конкретного дня
    generateDaySchedule(date, age) {
        const schedule = {
            date: date.toISOString().split('T')[0],
            age: age,
            schedule: this.getDailySchedule(age),
            recommendations: this.getRecommendations(age)
        };

        return schedule;
    }

    // Получение расписания дня в зависимости от возраста
    getDailySchedule(age) {
        const templates = require('./messageTemplates');
        const month = age.months;

        const schedule = {
            // Утренний блок
            "05:55": {
                type: "feeding_prep",
                title: "⏰ Подготовка к кормлению",
                message: templates.getTemplate(month, 'feeding', 'prep'),
                importance: "high"
            },
            "06:00": {
                type: "feeding",
                title: "🍼 Первое кормление",
                message: templates.getTemplate(month, 'feeding', 'main'),
                duration: "30"
            },
            "06:45": {
                type: "morning_routine",
                title: "🌟 Утренняя гимнастика",
                message: templates.getTemplate(month, 'activities', 'morning'),
                duration: "15"
            },
            // ... добавить остальные события дня
        };

        return this.adjustScheduleForAge(schedule, age);
    }

    // Корректировка расписания с учетом возраста
    adjustScheduleForAge(schedule, age) {
        // Корректировки для разных возрастов
        if (age.months >= 6) {
            // Добавляем прикорм
            schedule["10:00"] = {
                type: "feeding",
                title: "🥄 Первый прикорм",
                message: this.getFeedingMessage(age),
                importance: "high"
            };
        }

        if (age.months >= 8) {
            // Добавляем ползание
            schedule["11:00"] = {
                type: "activity",
                title: "🐛 Практика ползания",
                message: this.getCrawlingMessage(age),
                importance: "medium"
            };
        }

        return schedule;
    }

    // Сохранение файла расписания
    saveScheduleFile(schedule, age) {
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

        const fileContent = `// ${this.getDateComment(schedule.date)}
module.exports = ${JSON.stringify(schedule, null, 4)};`;

        fs.writeFileSync(filePath, fileContent);
    }

    // Получение комментария с датой
    getDateComment(date) {
        return `День для ${this.babyName} - ${date}`;
    }
}

// Использование генератора
const generator = new ScheduleGenerator("2024-10-29", "Тауекел");
generator.generateAllSchedules();

module.exports = ScheduleGenerator; 