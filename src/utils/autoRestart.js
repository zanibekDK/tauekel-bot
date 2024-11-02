const cron = require('node-cron');
const { exec } = require('child_process');

// Перезапуск каждые 6 часов
cron.schedule('0 */6 * * *', () => {
    console.log('Performing scheduled restart...');
    exec('npm restart', (error, stdout, stderr) => {
        if (error) {
            console.error(`Restart error: ${error}`);
            return;
        }
        console.log(`Restart stdout: ${stdout}`);
        console.log(`Restart stderr: ${stderr}`);
    });
}); 