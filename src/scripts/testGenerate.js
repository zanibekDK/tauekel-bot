const GenerateAllSchedules = require('../utils/GenerateAllSchedules');
const config = require('../config/config');
const fs = require('fs');
const path = require('path');

async function testGenerate() {
    try {
        console.log('🚀 Начинаем тестовую генерацию...\n');
        
        const generator = new GenerateAllSchedules("2024-10-29", "Тауекел");
        
        // Тестируем генерацию для разных возрастов
        const testCases = [
            { date: "2024-10-29", age: { months: 4, days: 0 } },
            { date: "2024-12-29", age: { months: 6, days: 0 } },
            { date: "2025-02-28", age: { months: 8, days: 0 } }
        ];

        for (const test of testCases) {
            console.log(`\n📋 Тестирование для возраста ${test.age.months} месяцев ${test.age.days} дней:`);
            
            const schedule = await generator.generateDaySchedule(
                new Date(test.date),
                test.age
            );

            // Сохраняем результат в тестовый файл
            const testDir = path.join(__dirname, '..', 'tests', 'schedules');
            if (!fs.existsSync(testDir)) {
                fs.mkdirSync(testDir, { recursive: true });
            }

            const fileName = `test_${test.age.months}m${test.age.days}d.json`;
            fs.writeFileSync(
                path.join(testDir, fileName),
                JSON.stringify(schedule, null, 2),
                'utf8'
            );

            // Проверяем корректность
            validateSchedule(schedule, test.age);
        }

        console.log('\n✨ Тестовая генерация успешно завершена!');
        
    } catch (error) {
        console.error('\n❌ Ошибка:', error);
        process.exit(1);
    }
}

function validateSchedule(schedule, age) {
    // Проверяем обязательные поля
    const requiredFields = ['date', 'age', 'schedule', 'recommendations'];
    for (const field of requiredFields) {
        if (!schedule[field]) {
            throw new Error(`Отсутствует обязательное поле: ${field}`);
        }
    }

    // Проверяем расписание по возрасту
    const events = Object.values(schedule.schedule);
    
    // Базовые события для всех возрастов
    const baseEvents = ['feeding_prep', 'feeding', 'morning_routine'];
    for (const eventType of baseEvents) {
        if (!events.some(e => e.type === eventType)) {
            console.warn(`⚠️ Отсутствует базовое событие: ${eventType}`);
        }
    }

    // Специфичные события по возрасту
    if (age.months >= 6) {
        if (!events.some(e => e.type === 'solid_food')) {
            console.warn('⚠️ Отсутствует прикорм для возраста 6+ месяцев');
        }
    }

    // Проверяем кодировку сообщений
    events.forEach(event => {
        if (event.message && !isValidUtf8(event.message)) {
            console.warn(`⚠️ Проблема с кодировкой в событии: ${event.title}`);
        }
    });

    console.log(`✅ Проверка для возраста ${age.months}м ${age.days}д завершена`);
}

function isValidUtf8(str) {
    try {
        return Buffer.from(str, 'utf8').toString('utf8') === str;
    } catch {
        return false;
    }
}

testGenerate(); 