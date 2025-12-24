/**
 * Главная точка входа приложения
 * Инициализирует все модули при загрузке страницы
 */
import { OverlayManager } from './modules/overlay.js';
import { TCRulesManager } from './modules/tc-rules.js';
import { RouteEditor } from './modules/route-editor.js';
import { TransportSelector } from './modules/transport-selector.js';
import { DateTimeManager } from './modules/datetime.js';

/**
 * Инициализация приложения
 */
function initApp() {
    // Инициализация всех модулей в правильном порядке
    TCRulesManager.init();
    RouteEditor.init();
    TransportSelector.init();
    DateTimeManager.init();
    OverlayManager.init();

    console.log('✅ Приложение инициализировано');
}

// Запуск при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM уже загружен
    initApp();
}
