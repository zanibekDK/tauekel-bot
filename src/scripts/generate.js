const GenerateAllSchedules = require('../utils/GenerateAllSchedules');

async function generate() {
    try {
        console.log('🚀 Начинаем генерацию расписаний...\n');
        
        const generator = new GenerateAllSchedules("2024-10-29", "Тауекел");
        await generator.generateAllSchedules();
        
        console.log('\n✨ Генерация успешно завершена!');
        
    } catch (error) {
        console.error('\n❌ Ошибка при генерации:', error);
        process.exit(1);
    }
}

generate(); 