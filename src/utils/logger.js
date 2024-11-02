const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;
        
        fs.appendFileSync(
            path.join(this.logDir, `${type}.log`),
            logMessage
        );

        console.log(logMessage);
    }
}

module.exports = new Logger(); 