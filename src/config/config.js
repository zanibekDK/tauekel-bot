module.exports = {
    // Основные данные о ребенке
    baby: {
        name: "Тауекел",
        birthDate: "2024-06-29",
        currentAge: {
            months: 4,
            days: 5
        }
    },

    // Настройки WhatsApp
    whatsapp: {
        recipientNumber: "7XXXXXXXXXX",
        messageDelay: 1000,
        typingDelay: 500
    },

    // Расписание дня для 4-го месяца
    schedule: {
        fatherSchedule: {
            workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
            workHours: {
                start: "09:00",
                end: "18:00"
            }
        },
        
        dailyRoutine: {
            // Утренний блок
            "05:55": {
                type: "feeding_prep",
                title: "⏰ Подготовка к кормлению",
                importance: "high"
            },
            "06:00": {
                type: "feeding",
                title: "🍼 Первое кормление",
                duration: "30",
                importance: "high"
            },
            "06:45": {
                type: "exercise",
                title: "💪 Утренняя гимнастика",
                duration: "15",
                importance: "medium"
            },
            "08:00": {
                type: "sensory_development",
                title: "👀 Сенсорное развитие",
                duration: "15",
                importance: "medium"
            },
            "09:30": {
                type: "social_development",
                title: "😊 Социальное развитие",
                duration: "20",
                importance: "medium"
            },
            "10:30": {
                type: "walk_prep",
                title: "🌳 Подготовка к прогулке",
                importance: "high"
            }
        },

        // Фокус развития для 4-го месяца
        developmentFocus: {
            physical: [
                "Уверенное держание головы",
                "Опора на предплечья",
                "Захват игрушек"
            ],
            cognitive: [
                "Следит за предметами",
                "Реагирует на звуки",
                "Узнает близких"
            ],
            social: [
                "Улыбается",
                "Гулит",
                "Реагирует на речь"
            ]
        },

        // Еженедельные активности
        weeklyActivities: {
            monday: {
                focus: "Крупная моторика",
                activities: ["Держим головку", "Опора на предплечья"]
            },
            tuesday: {
                focus: "Мелкая моторика",
                activities: ["Тянемся к игрушкам", "Захват погремушки"]
            },
            wednesday: {
                focus: "Сенсорное развитие",
                activities: ["Разные текстуры", "Новые звуки"]
            },
            thursday: {
                focus: "Социальное развитие",
                activities: ["Игра в прятки", "Разговоры"]
            },
            friday: {
                focus: "Комплексное развитие",
                activities: ["Повторение навыков", "Новые упражнения"]
            }
        }
    },

    medical: {
        // График прививок для 4-12 месяцев
        vaccinations: {
            "2024-11-29": {  // 5 месяцев
                type: "АКДС + полиомиелит (вторая вакцинация)",
                preparation: [
                    "Измерить температуру утром",
                    "Отменить прогулку в день вакцинации",
                    "Подготовить жаропонижающее"
                ]
            },
            "2024-12-29": {  // 6 месяцев
                type: "АКДС + полиомиелит (третья вакцинация)",
                preparation: [
                    "Измерить температуру утром",
                    "Отменить прогулку в день вакцинации",
                    "Подготовить жаропонижающее"
                ]
            }
        },

        // График медосмотров
        checkups: {
            "2024-11-29": {  // 5 месяцев
                type: "Плановый осмотр педиатра",
                measurements: [
                    "Рост",
                    "Вес",
                    "Окружность головы",
                    "Окружность груди"
                ]
            },
            "2024-12-29": {  // 6 месяцев
                type: "Комплексный осмотр",
                specialists: [
                    "Педиатр",
                    "Невролог",
                    "Ортопед"
                ],
                measurements: [
                    "Рост",
                    "Вес",
                    "Окружность головы",
                    "Окружность груди"
                ]
            }
        }
    },

    // Настройки сна и кормления для 4-го месяца
    sleepFeeding: {
        // Рекомендуемый режим сна
        sleep: {
            dailyNaps: [
                {
                    time: "08:30",
                    duration: "1.5-2 часа"
                },
                {
                    time: "11:30",
                    duration: "1.5-2 часа"
                },
                {
                    time: "15:00",
                    duration: "1-1.5 часа"
                },
                {
                    time: "18:30",
                    duration: "30-40 минут"
                }
            ],
            nightSleep: {
                time: "20:00",
                duration: "10-11 часов",
                feeds: "1-2 раза"
            }
        },

        // Режим кормления
        feeding: {
            frequency: "каждые 3.5-4 часа",
            dailyFeeds: [
                "06:00",
                "09:30",
                "13:00",
                "16:30",
                "19:30"
            ],
            nightFeeds: [
                "23:00",
                "03:00"
            ],
            portions: {
                day: "150-180 мл",
                night: "120-150 мл"
            }
        }
    }
} 