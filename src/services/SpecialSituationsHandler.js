class SpecialSituationsHandler {
    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.activeSpecialSituations = new Set();
    }

    // Активация особой ситуации
    activateSituation(situation) {
        this.activeSpecialSituations.add(situation);
        return this.getSituationMessage(situation);
    }

    // Деактивация особой ситуации
    deactivateSituation(situation) {
        this.activeSpecialSituations.delete(situation);
    }

    // Получение сообщения для особой ситуации
    getSituationMessage(situation) {
        const messages = {
            teething: `
🦷 Режим прорезывания зубов:

💡 Рекомендации:
• Охлаждённое полотенце для дёсен
• Прохладная еда
• Специальные игрушки для жевания
• Чаще предлагать питье

⚠️ Следить за:
• Температурой
• Общим состоянием
• Аппетитом

📞 Обратиться к врачу если:
• Высокая температура >38°C
• Отказ от еды >12 часов
• Сильное беспокойство
            `,

            illness: `
🏥 Режим болезни:

✅ Основные правила:
• Больше отдыха
• Частое питье
• Проветривание
• Влажная уборка

📋 Записывать:
• Температуру
• Симптомы
• Время приема лекарств

⚠️ Важно:
• Следить за температурой
• Поддерживать влажность
• Чаще менять подгузник
            `,

            vaccination: `
💉 День прививки:

📝 План действий:
1. До прививки:
   • Измерить температуру
   • Обычный режим питания
   • Спокойные игры

2. После прививки:
   • Наблюдать 30 минут
   • Измерять температуру
   • Возможен сонливый режим

⚠️ Следить за:
• Местом укола
• Температурой
• Общим состоянием
            `
        };

        return messages[situation] || 'Ситуация не определена';
    }

    // Получение дополнительных рекомендаций
    getSpecialRecommendations() {
        let recommendations = '';
        
        for (const situation of this.activeSpecialSituations) {
            recommendations += this.getSituationMessage(situation) + '\n\n';
        }

        return recommendations;
    }
}

module.exports = SpecialSituationsHandler; 