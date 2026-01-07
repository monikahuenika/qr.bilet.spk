/**
 * Главная точка входа приложения
 * Инициализирует все модули при загрузке страницы
 */
import { OverlayManager } from './modules/overlay.js';
import { TCRulesManager } from './modules/tc-rules.js';
import { TCEditor } from './modules/tc-editor.js';
import { RouteEditor } from './modules/route-editor.js';
import { TransportSelector } from './modules/transport-selector.js';
import { DateTimeManager } from './modules/datetime.js';

/**
 * Инициализация приложения
 */
function initApp() {
    // Инициализация всех модулей в правильном порядке
    TCRulesManager.init();
    TCEditor.init();
    RouteEditor.init();
    TransportSelector.init();
    DateTimeManager.init();
    OverlayManager.init();

    console.log('✅ Приложение инициализировано');
}

/**
 * Регистрация Service Worker для PWA
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('✅ Service Worker зарегистрирован:', registration.scope);
            })
            .catch(error => {
                console.error('❌ Ошибка регистрации Service Worker:', error);
            });
    }
}

// Запуск при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
        registerServiceWorker();
    });
} else {
    // DOM уже загружен
    initApp();
    registerServiceWorker();
}
