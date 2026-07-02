/**
 * ============================================
 * CONECTA JÁ - SERVICE WORKER PWA
 * Versão: 1.2.0
 * ============================================
 */

const CACHE_NAME = 'conectaja-v1.2.0';
const OFFLINE_PAGE = '/offline.html';

// Ficheiros essenciais para cache (funciona offline)
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/prestadores.html',
    '/sobre.html',
    '/contacto.html',
    '/faq.html',
    '/blog.html',
    '/offline.html',
    '/styles.css',
    '/global.css',
    '/script.js',
    '/ao-locations.js',
    '/i18n.js',
];

// Recursos externos (CDN)
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ============================================
// INSTALAÇÃO DO SERVICE WORKER
// ============================================
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(STATIC_CACHE_URLS)
                    .then(() => {
                        return Promise.allSettled(
                            EXTERNAL_RESOURCES.map(url =>
                                cache.add(url).catch(() => {})
                            )
                        );
                    });
            })
            .then(() => self.skipWaiting())
            .catch(() => {})
    );
});

// ============================================
// ATIVAÇÃO DO SERVICE WORKER
// ============================================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// ============================================
// INTERCEPTAÇÃO DE REQUISIÇÕES
// Estratégia: Network First, fallback para Cache
// ============================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') return;

    if (url.origin !== location.origin && !EXTERNAL_RESOURCES.includes(request.url)) return;

    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(request)
                    .then((cachedResponse) => {
                        if (cachedResponse) return cachedResponse;

                        if (request.headers.get('accept')?.includes('text/html')) {
                            return caches.match(OFFLINE_PAGE);
                        }

                        return new Response('Recurso não disponível offline', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({ 'Content-Type': 'text/plain' })
                        });
                    });
            })
    );
});

// ============================================
// NOTIFICAÇÕES PUSH
// ============================================
self.addEventListener('push', (event) => {
    let data = {
        title: 'Conecta Já',
        body: 'Tens uma nova notificação!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'notification'
    };

    if (event.data) {
        try { data = event.data.json(); } catch (_) {}
    }

    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        tag: data.tag,
        vibrate: [200, 100, 200],
        data: data
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// ============================================
// CLIQUE EM NOTIFICAÇÃO
// ============================================
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data?.url || '/')
        );
    }
});

// ============================================
// MENSAGENS DO CLIENTE
// ============================================
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data?.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames =>
                Promise.all(cacheNames.map(name => caches.delete(name)))
            )
        );
    }
});
