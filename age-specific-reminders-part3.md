# Напоминания для 6-го месяца и специальные события

### 1. 6 месяцев (month-6-reminders.js)

```javascript
const month6Reminders = {
    dailySchedule: {
        "06:00": {
            type: "first_meal",
            title: "🥄 Первый прикорм",
            message: `
🌅 Время первого прикорма!

📋 Подготовка:
• 🍼 Сначала грудное молоко/смесь
• 🥣 Отдельная детская посуда
• 👶 Высокий стульчик/удобное место
• 🧴 Нагрудник и влажные салфетки

✅ Последовательность:
1. Молоко/смесь
2. Подождать 30 минут
3. Начало прикорма
4. Вода после еды

💡 Правила прикорма:
• Начинать с 1 чайной ложки
• Наблюдать за реакцией
• Новый продукт - утром
• Перерыв между продуктами 4-7 дней

⚠️ Следить за:
• Аллергическими реакциями
• Состоянием стула
• Общим самочувствием
            `,
            importance: "high"
        },

        "07:30": {
            type: "sitting_practice",
            title: "🪑 Тренировка сидения",
            message: `
💺 Учимся сидеть:

1. Подготовительные упражнения:
   • Укрепление спины
   • Развитие равновесия
   • Поддержка за ручки

2. Основные упражнения:
   • Сидение с опорой
   • Сидение с минимальной поддержкой
   • Игры в сидячем положении

3. Безопасность:
   • Мягкая поверхность
   • Подушки вокруг
   • Постоянный контроль

⏱ Длительность: 5-7 минут
Повторять: 4-5 раз в день
            `
        },

        "09:00": {
            type: "crawling_prep",
            title: "🐛 Подготовка к ползанию",
            message: `
🎯 Учимся ползать:

1. Упражнения на животе:
   • Опора на ладони
   • Покачивания вперед-назад
   • Подтягивание на руках

2. Игры для мотивации:
   • Любимые игрушки впереди
   • Звуковая стимуляция
   • Тоннели и препятствия

3. Безопасность:
   • Мягкий коврик
   • Свободное пространство
   • Отсутствие опасных предметов

⏱ Время: 10-15 минут
            `
        },

        "11:00": {
            type: "cognitive_development",
            title: "🧠 Игры на развитие",
            message: `
🎮 Развивающие занятия:

1. Сенсорное развитие:
   • Разные текстуры
   • Новые звуки
   • Яркие предметы

2. Мелкая моторика:
   • Захват мелких предметов
   • Перекладывание игрушек
   • Игры с пальчиками

3. Познавательные игры:
   • "Где спрятано?"
   • "Что звучит?"
   • "Покажи, где..."

⏱ Длительность: 15-20 минут
            `
        }
    },

    specialEvents: {
        halfYearCelebration: {
            date: "2024-12-29",
            reminders: [
                {
                    time: "09:00",
                    title: "🎉 Полгода малышу!",
                    message: `
🎈 Поздравляем с первым полугодием!

📸 План празднования:
1. Утренняя фотосессия:
   • Нарядная одежда
   • Любимые игрушки
   • Цифра 6 для фото

2. Измерения:
   • Рост
   • Вес
   • Окружность головы

3. Достижения:
   • Сидение
   • Первый прикорм
   • Активные перевороты

4. Памятные моменты:
   • Отпечаток ручки/ножки
   • Видео поздравление
   • Семейное фото
                    `
                }
            ]
        }
    },

    developmentalMilestones: {
        physical: [
            "Уверенное сидение с поддержкой",
            "Попытки ползания",
            "Перевороты в обе стороны"
        ],
        cognitive: [
            "Следит за упавшим предметом",
            "Изучает отражение в зеркале",
            "Различает знакомых и незнакомых"
        ],
        feeding: [
            "Начало прикорма",
            "Интерес к твердой пище",
            "Удержание бутылочки"
        ]
    },

    weeklyProgram: {
        week1: {
            theme: "Знакомство с прикормом",
            activities: {
                feeding: [
                    "Знакомство с ложкой",
                    "Первая каша",
                    "Питьевой режим"
                ],
                development: [
                    "Укрепление спины",
                    "Тренировка сидения",
                    "Захват игрушек"
                ]
            }
        },
        week2: {
            theme: "Активное движение",
            activities: {
                motor: [
                    "Подготовка к ползанию",
                    "Игры в положении сидя",
                    "Перевороты"
                ]
            }
        }
        // ... остальные недели
    }
}
```

[Продолжение следует...]

Хотите, чтобы я продолжил с:
1. Напоминаниями для 7-го месяца?
2. Дополнительными специальными событиями?
3. Расширенной системой развивающих занятий?