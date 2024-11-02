// injector.js
(function () {
    const links = [
        'https://delta.mil.gov.ua/analytics/i?events=%5B%7B%22key%22%3A%22Sidebar%2FButton%2Fclick%22%2C%22count%22%3A1%2C%22segmentation%22%3A%7B%22name%22%3A%22filters'
    ]
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;

    // Перевизначаємо open, щоб зберегти URL
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._url = url; // Зберігаємо URL в приватному полі
        return originalXhrOpen.apply(this, arguments);
    };

    // Перевизначаємо send, щоб перехоплювати запити
    XMLHttpRequest.prototype.send = function (body) {
        const xhr = this; // Зберігаємо контекст

        // Використовуємо колбек для обробки результату
        const originalOnReadyStateChange = xhr.onreadystatechange;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) { // Запит завершено
                if (typeof xhr._url === 'string' && links.some(link => xhr._url.includes(link))) {
                    console.log("Перехоплено результат запиту:", xhr._url);
                    try {
                        const responseData = JSON.parse(xhr.responseText); // Парсимо JSON
                        console.log("Отримані дані:", responseData);

                        const popup_filter = document.querySelector('[data-testid="presets-filters-content"]')
                        console.log(popup_filter)
                        // Тут можна обробити дані за потреби
                    } catch (error) {
                        console.error("Помилка при парсингу JSON:", error);
                    }
                }
            }
            // Викликаємо оригінальний onreadystatechange, якщо він існує
            if (originalOnReadyStateChange) {
                originalOnReadyStateChange.apply(xhr, arguments);
            }
        };

        // Викликаємо оригінальний метод send
        return originalXhrSend.apply(this, arguments);
    };

})();