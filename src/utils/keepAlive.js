const fetch = require('node-fetch');
const logger = require('./logger');

class KeepAlive {
    constructor() {
        this.interval = 5 * 60 * 1000; // 5 минут
        this.url = process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000';
    }

    start() {
        setInterval(async () => {
            try {
                const response = await fetch(`${this.url}/status`);
                const data = await response.json();
                logger.log(`Keep-alive пинг успешен: ${JSON.stringify(data)}`);
            } catch (error) {
                logger.log(`Ошибка keep-alive пинга: ${error.message}`, 'error');
            }
        }, this.interval);

        logger.log('Keep-alive система запущена');
    }
}

module.exports = new KeepAlive(); 