const GenerateAllSchedules = require('../utils/GenerateAllSchedules');
const ReminderChecker = require('../utils/ReminderChecker');
const config = require('../config/config');

async function generateAndValidate() {
    console.log('🚀 Начинаем генерацию расписаний...\n');

    try {
        // Генерация файлов
        const generator = new GenerateAllSchedules("2024-10-29", "Тауекел");
        await generator.generateAllSchedules();

        console.log('\n✅ Генерация файлов завершена');
        console.log('📂 Проверяем структуру файлов...\n');

        // Проверка сгенерированных файлов
        const checker = new ReminderChecker(config);
        checker.checkCoverage();

        console.log('\n✨ Генерация и проверка завершены успешно!');

    } catch (error) {
        console.error('❌ Произошла ошибка:', error);
        process.exit(1);
    }
}

generateAndValidate().catch(console.error); 