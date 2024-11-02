const config = require('../config/config');

const reminderTemplates = {
    // Подготовка к кормлению
    feedingPrep: `
🔔 До кормления 5 минут:

✅ Проверить:
• 🍼 Бутылочка готова
• 🌡 Температура смеси
• 🧸 Полотенце/пеленка
• 👶 Чистый подгузник

💡 Помните:
• Проверить температуру
• Подготовить удобное место
• Создать спокойную атмосферу
    `,

    // Кормление
    feeding: `
🌅 Время кормления:

📝 Последовательность:
1. Проверка готовности ${config.baby.name}
2. Удобная поза
3. Спокойное кормление (20-30 минут)
4. Подержать столбиком
5. Сменить подгузник

💭 Наблюдаем:
• Аппетит
• Насыщение
• Комфорт

⏰ Следующее кормление через 3 часа
    `,

    // Утренняя гимнастика
    morningExercise: `
🌟 Комплекс упражнений:

1. Разминка (5 минут):
   • Поглаживания
   • Легкий массаж
   • Покачивания

2. Основные упражнения:
   • "Велосипед" (30 сек)
   • "Перекрещивание" (30 сек)
   • Повороты на бок (1 мин)

3. Время на животике (3-5 минут):
   • С опорой на локти
   • Показывать игрушки
   • Разговаривать

⚠️ Следить за:
• Настроением ${config.baby.name}
• Признаками усталости
• Правильностью выполнения
    `,

    // Сенсорное развитие
    sensoryDevelopment: `
🎯 Время развития:

1. Зрительное восприятие:
   • Следим за игрушкой
   • Изучаем контрасты
   • Рассматриваем лица

2. Слуховое развитие:
   • Разные звуки
   • Музыкальные игрушки
   • Голосовые игры

3. Тактильные ощущения:
   • Разные текстуры
   • Поглаживания
   • Касания игрушками

⏱ Длительность: 10-15 минут
    `,

    // Подготовка к прогулке
    walkPrep: `
🚶‍♀️ Собираемся на прогулку:

✅ Проверить:
1. Погода:
   • Температура
   • Осадки
   • Ветер

2. Одежда:
   • По погоде
   • Удобная
   • Чистая

3. Взять с собой:
   • Запасной подгузник
   • Влажные салфетки
   • Бутылочку воды
   • Пеленку

⏱ Длительность прогулки: 40-60 минут
    `,

    // Генератор еженедельного фокуса
    getWeeklyFocus: (day) => {
        const activities = config.schedule.weeklyActivities[day];
        if (!activities) return '';

        return `
🎯 Фокус дня: ${activities.focus}

📋 Сегодняшние занятия:
${activities.activities.map(activity => `• ${activity}`).join('\n')}

💡 Не забывайте отмечать прогресс ${config.baby.name}!
        `;
    }
};

module.exports = reminderTemplates; 