class DevelopmentTracker {
    constructor(config) {
        this.config = config;
        this.milestones = {
            physical: new Set(),
            cognitive: new Set(),
            social: new Set()
        };
    }

    // Добавление нового достижения
    addMilestone(category, milestone) {
        if (this.milestones[category]) {
            this.milestones[category].add(milestone);
            return true;
        }
        return false;
    }

    // Получение прогресса развития
    getProgress() {
        const progress = {
            physical: {
                achieved: Array.from(this.milestones.physical),
                expected: this.config.schedule.developmentFocus.physical
            },
            cognitive: {
                achieved: Array.from(this.milestones.cognitive),
                expected: this.config.schedule.developmentFocus.cognitive
            },
            social: {
                achieved: Array.from(this.milestones.social),
                expected: this.config.schedule.developmentFocus.social
            }
        };

        return this.formatProgress(progress);
    }

    // Форматирование отчета о прогрессе
    formatProgress(progress) {
        return `
📊 Прогресс развития ${this.config.baby.name}:

💪 Физическое развитие:
✅ Достигнуто:
${progress.physical.achieved.map(m => `• ${m}`).join('\n')}

🎯 Ожидается:
${progress.physical.expected.map(m => `• ${m}`).join('\n')}

🧠 Когнитивное развитие:
✅ Достигнуто:
${progress.cognitive.achieved.map(m => `• ${m}`).join('\n')}

🎯 Ожидается:
${progress.cognitive.expected.map(m => `• ${m}`).join('\n')}

👥 Социальное развитие:
✅ Достигнуто:
${progress.social.achieved.map(m => `• ${m}`).join('\n')}

🎯 Ожидается:
${progress.social.expected.map(m => `• ${m}`).join('\n')}
        `;
    }
}

module.exports = DevelopmentTracker; 