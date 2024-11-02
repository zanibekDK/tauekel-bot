const moment = require('moment-timezone');

class TimeManager {
    constructor() {
        // Устанавливаем часовой пояс Тараза
        this.timezone = 'Asia/Almaty';
        moment.tz.setDefault(this.timezone);
    }

    getCurrentTime() {
        return moment().tz(this.timezone);
    }

    formatTime(date) {
        return moment(date).tz(this.timezone).format('HH:mm');
    }

    formatDate(date) {
        return moment(date).tz(this.timezone).format('YYYY-MM-DD');
    }

    // Проверка пропущенных напоминаний
    getMissedReminders(lastActiveTime) {
        const now = this.getCurrentTime();
        const missed = [];
        
        // Получаем все напоминания между lastActiveTime и now
        // TODO: Реализовать логику получения пропущенных напоминаний

        return missed;
    }
}

module.exports = new TimeManager(); 