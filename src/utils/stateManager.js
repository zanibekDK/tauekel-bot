const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

class StateManager {
    constructor() {
        this.statePath = path.join(__dirname, '../../data/state.json');
        this.ensureStateFile();
    }

    ensureStateFile() {
        const dir = path.dirname(this.statePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.statePath)) {
            this.saveState(this.getInitialState());
        }
    }

    getInitialState() {
        const birthDate = moment("2024-06-29");
        const now = moment();
        const age = {
            months: now.diff(birthDate, 'months'),
            days: now.diff(birthDate.add(now.diff(birthDate, 'months'), 'months'), 'days')
        };

        return {
            lastUpdate: now.format(),
            currentAge: age,
            lastMessageTime: now.format(),
            sentMessages: [],
            currentMonth: age.months
        };
    }

    loadState() {
        try {
            const data = fs.readFileSync(this.statePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Ошибка загрузки состояния:', error);
            return this.getInitialState();
        }
    }

    saveState(state) {
        try {
            fs.writeFileSync(this.statePath, JSON.stringify(state, null, 2));
        } catch (error) {
            console.error('Ошибка сохранения состояния:', error);
        }
    }

    updateState() {
        const state = this.loadState();
        const now = moment();
        const birthDate = moment("2024-06-29");
        
        state.currentAge = {
            months: now.diff(birthDate, 'months'),
            days: now.diff(birthDate.add(now.diff(birthDate, 'months'), 'months'), 'days')
        };
        
        state.lastUpdate = now.format();
        
        this.saveState(state);
        return state;
    }

    recordMessage(messageType, content) {
        const state = this.loadState();
        state.sentMessages.push({
            type: messageType,
            content: content,
            time: moment().format()
        });
        state.lastMessageTime = moment().format();
        this.saveState(state);
    }

    getLastMessages(hours = 24) {
        const state = this.loadState();
        const cutoff = moment().subtract(hours, 'hours');
        return state.sentMessages.filter(msg => 
            moment(msg.time).isAfter(cutoff)
        );
    }
}

module.exports = new StateManager(); 