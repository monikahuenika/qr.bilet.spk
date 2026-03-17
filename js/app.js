import { OverlayManager } from './modules/overlay.js';
import { TCRulesManager } from './modules/tc-rules.js';
import { TCEditor } from './modules/tc-editor.js';
import { RouteEditor } from './modules/route-editor.js';
import { TransportSelector } from './modules/transport-selector.js';
import { DateTimeManager } from './modules/datetime.js';

function initApp() {
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
            .then(registration => {
                registration.update();

                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                }

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
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
