import { OverlayManager } from './modules/overlay.js';
import { TCRulesManager } from './modules/tc-rules.js';
import { TCEditor } from './modules/tc-editor.js';
import { TCSelector } from './modules/tc-selector.js';
import { RouteEditor } from './modules/route-editor.js';
import { TransportSelector } from './modules/transport-selector.js';
import { DateTimeManager } from './modules/datetime.js';

async function initApp() {
    await TCSelector.init();

    TCRulesManager.init();
    TCEditor.init();
    RouteEditor.init();
    TransportSelector.init();
    DateTimeManager.init();
    OverlayManager.init();
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {})
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
        registerServiceWorker();
    });
} else {
    initApp();
    registerServiceWorker();
}
