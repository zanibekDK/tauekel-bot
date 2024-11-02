const fs = require('fs');
const path = require('path');
const config = require('../config/config');

async function validateAllSchedules() {
    console.log('🔍 Начинаем проверку всех расписаний...\n');

    const schedulesDir = path.join(__dirname, '..', 'schedules');
    let totalFiles = 0;
    let validFiles = 0;
    let errors = [];

    // Проходим по всем месяцам
    for (let month = 4; month <= 12; month++) {
        const monthDir = path.join(schedulesDir, `month-${month}`);
        if (!fs.existsSync(monthDir)) continue;

        // Проходим по всем неделям
        const weeks = fs.readdirSync(monthDir);
        for (const week of weeks) {
            const weekDir = path.join(monthDir, week);
            if (!fs.statSync(weekDir).isDirectory()) continue;

            // Проверяем все дни
            const days = fs.readdirSync(weekDir).filter(f => f.endsWith('.js'));
            for (const day of days) {
                totalFiles++;
                const filePath = path.join(weekDir, day);
                try {
                    const schedule = require(filePath);
                    validateSchedule(schedule, month);
                    validFiles++;
                } catch (error) {
                    errors.push({
                        file: `month-${month}/${week}/${day}`,
                        error: error.message
                    });
                }
            }
        }
    }

    // Выводим результаты
    console.log('\n📊 Результаты проверки:');
    console.log(`• Всего файлов: ${totalFiles}`);
    console.log(`• Валидных файлов: ${validFiles}`);
    console.log(`• Файлов с ошибками: ${errors.length}`);

    if (errors.length > 0) {
        console.log('\n❌ Найдены ошибки:');
        errors.forEach(({file, error}) => {
            console.log(`\n${file}:`);
            console.log(`  ${error}`);
        });
    } else {
        console.log('\n✅ Все файлы корректны!');
    }
}

function validateSchedule(schedule, month) {
    // Проверка структуры
    if (!schedule.date || !schedule.age || !schedule.schedule) {
        throw new Error('Отсутствуют обязательные поля');
    }

    // Проверка возраста
    if (schedule.age.months !== month) {
        throw new Error(`Несоответствие возраста: ожидается ${month}, получено ${schedule.age.months}`);
    }

    // Проверка событий по возрасту
    validateAgeSpecificEvents(schedule);
}

function validateAgeSpecificEvents(schedule) {
    const events = Object.values(schedule.schedule);
    const month = schedule.age.months;

    // Базовые события
    const requiredEvents = ['feeding_prep', 'feeding', 'morning_routine'];
    
    // Добавляем события по возрасту
    if (month >= 6) requiredEvents.push('solid_food');
    if (month >= 8) requiredEvents.push('crawling');
    if (month >= 10) requiredEvents.push('walking');

    // Проверяем наличие всех необходимых событий
    for (const required of requiredEvents) {
        if (!events.some(e => e.type === required)) {
            throw new Error(`Отсутствует обязательное событие для ${month} месяцев: ${required}`);
        }
    }
}

validateAllSchedules().catch(console.error); 