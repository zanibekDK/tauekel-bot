const http = require('http');

// Создаем простой HTTP сервер для проверки работоспособности
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

module.exports = server; 