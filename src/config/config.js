module.exports = {
    // Основные настройки
    baby: {
        name: "Тауекел",
        birthDate: "2024-06-29"
    },

    // Настройки WhatsApp
    whatsapp: {
        recipients: {
            primary: "77763629111@c.us" // Формат WhatsApp: номер + @c.us
        },
        messageDelay: 1000,
        retryAttempts: 3
    },

    // Настройки времени
    timezone: "Asia/Almaty",
    
    // Настройки уведомлений
    notifications: {
        defaultPriority: "normal",
        retryInterval: 60000 // 1 минута
    }
}; 