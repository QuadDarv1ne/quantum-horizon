# Content Security Policy (CSP) Documentation

## Обзор

Quantum Horizon использует Content Security Policy (CSP) для защиты от XSS атак и других уязвимостей. CSP определяет, какие ресурсы могут загружаться и выполняться в приложении.

## Конфигурация

### Расположение

- **Конфигурация:** `next.config.ts`
- **Тесты:** `src/security-headers.test.ts`

## Директивы CSP

### default-src

```
default-src 'self'
```

**Описание:** Базовая политика для всех типов ресурсов. Разрешает загрузку ресурсов только с текущего домена.

### script-src

```
script-src 'self' 'wasm-unsafe-eval'
```

**Описание:**
- `'self'` — разрешает скрипты только с текущего домена
- `'wasm-unsafe-eval'` — разрешает WebAssembly (требуется для физических расчётов)

**Безопасность:**
- ✅ Запрещены inline скрипты
- ✅ Запрещено выполнение скриптов со сторонних доменов
- ⚠️ `'wasm-unsafe-eval'` необходим для работы визуализаций

### style-src

```
style-src 'self' 'unsafe-inline'
```

**Описание:**
- `'self'` — разрешает стили с текущего домена
- `'unsafe-inline'` — разрешает inline стили (требуется для Leaflet карт)

**Безопасность:**
- ⚠️ `'unsafe-inline'` необходим для работы Leaflet (карты спутников)
- ✅ Стили загружаются только с текущего домена

### img-src

```
img-src 'self' data: blob: https://images-assets.nasa.gov https://where-theiss.at https://api.wheretheiss.at https://*.basemaps.cartocdn.com
```

**Описание:** Разрешает загрузку изображений из:

| Источник | Описание |
|----------|----------|
| `'self'` | Текущий домен |
| `data:` | Data URI (base64 изображения) |
| `blob:` | Blob URL (загруженные файлы) |
| `https://images-assets.nasa.gov` | NASA Image Gallery |
| `https://where-theiss.at` | WhereTheISS.at (МКС трекер) |
| `https://api.wheretheiss.at` | WhereTheISS.at API |
| `https://*.basemaps.cartocdn.com` | CartoCDN (карты для Leaflet) |

**Безопасность:**
- ✅ Конкретные домены вместо `https:`
- ✅ Нет wildcard для всех HTTPS доменов

### font-src

```
font-src 'self' data:
```

**Описание:**
- `'self'` — шрифты с текущего домена
- `data:` — шрифты в формате data URI

### connect-src

```
connect-src 'self' https://api.nasa.gov https://where-theiss.at https://api.wheretheiss.at https://api.open-notify.org
```

**Описание:** Разрешает подключение к API (fetch, XHR, WebSocket):

| Источник | Описание |
|----------|----------|
| `'self'` | Текущий домен |
| `https://api.nasa.gov` | NASA API (APOD, экзопланеты) |
| `https://where-theiss.at` | WhereTheISS.at |
| `https://api.wheretheiss.at` | WhereTheISS.at API (спутники) |
| `https://api.open-notify.org` | Open Notify API (МКС) |

**Безопасность:**
- ✅ Конкретные домены API
- ✅ Нет wildcard для всех HTTPS доменов

### frame-ancestors

```
frame-ancestors 'none'
```

**Описание:** Запрещает встраивание страницы в iframe на других сайтах.

**Безопасность:**
- ✅ Защита от clickjacking атак

### base-uri

```
base-uri 'self'
```

**Описание:** Запрещает изменение базового URL через `<base>` тег.

**Безопасность:**
- ✅ Защита от атак с изменением относительных URL

### form-action

```
form-action 'self'
```

**Описание:** Разрешает отправку форм только на текущий домен.

**Безопасность:**
- ✅ Защита от CSRF атак через формы

### worker-src

```
worker-src 'self' blob:
```

**Описание:**
- `'self'` — Web Workers с текущего домена
- `blob:` — Workers созданные через Blob URL

## Дополнительные Security Headers

### X-Content-Type-Options

```
X-Content-Type-Options: nosniff
```

**Описание:** Запрещает браузеру определять тип контента (MIME sniffing).

### X-Frame-Options

```
X-Frame-Options: DENY
```

**Описание:** Запрещает встраивание страницы в iframe.

### X-XSS-Protection

```
X-XSS-Protection: 1; mode=block
```

**Описание:** Включает XSS фильтр в браузере.

### Referrer-Policy

```
Referrer-Policy: strict-origin-when-cross-origin
```

**Описание:**
- Отправляет referrer только в пределах текущего origin
- Не отправляет referrer при переходе на HTTPS → HTTP

### Permissions-Policy

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()
```

**Описание:** Отключает доступ к функциям устройства:
- 📷 Камера
- 🎤 Микрофон
- 📍 Геолокация
- 💳 Платежи
- 🔌 USB
- 🧲 Магнитометр
- 🌀 Гироскоп
- 📐 Акселерометр

## API Endpoints

### NASA API

**Используется в:**
- `src/hooks/api/use-apod.ts` — Astronomy Picture of the Day
- `src/components/api/nasa-apod-viewer.tsx` — NASA APOD Viewer
- `src/components/api/exoplanet-explorer.tsx` — Exoplanet Explorer

**Домены:**
- `https://api.nasa.gov` — API endpoint
- `https://images-assets.nasa.gov` — Изображения

### WhereTheISS.at API

**Используется в:**
- `src/hooks/api/use-satellite.ts` — Satellite tracking hook
- `src/components/api/satellite-tracker.tsx` — Satellite Tracker

**Домены:**
- `https://api.wheretheiss.at` — API endpoint
- `https://where-theiss.at` — Веб-сайт

### CartoCDN

**Используется в:**
- `src/components/api/satellite-tracker.tsx` — Карты Leaflet

**Домены:**
- `https://*.basemaps.cartocdn.com` — Тайлы карт

## Тестирование

### Unit Tests

Тесты расположены в `src/security-headers.test.ts`:

```bash
npm test -- security-headers.test.ts
```

### Test Cases

1. ✅ Правильный default-src
2. ✅ Разрешены только свои скрипты и wasm
3. ✅ Разрешены стили с unsafe-inline для Leaflet
4. ✅ Изображения только с доверенных доменов
5. ✅ Нет wildcard https: для img-src
6. ✅ Connect только с доверенных API доменов
7. ✅ Нет wildcard https: для connect-src
8. ✅ Запрещены фреймы (frame-ancestors 'none')
9. ✅ base-uri 'self'
10. ✅ form-action 'self'
11. ✅ worker-src 'self' blob:
12. ✅ Все required директивы присутствуют
13. ✅ Правильный формат CSP строки
14. ✅ Разрешены NASA API endpoints
15. ✅ Разрешены WhereTheISSat API endpoints
16. ✅ Разрешён CartoCDN для карт
17. ✅ Разрешены data: и blob: URI схемы

## Мониторинг нарушений CSP

### Report URI

Для мониторинга нарушений CSP можно добавить `report-uri` или `report-to`:

```
report-uri https://your-csp-report-endpoint.com/csp-report
```

### Console Warnings

Нарушения CSP отображаются в консоли браузера:

```
Refused to load the image 'https://evil.com/image.png' because it violates 
the following Content Security Policy directive: "img-src 'self' ...".
```

## Best Practices

### Для разработчиков

1. **Не добавлять 'unsafe-inline'** — использовать nonce или hash
2. **Не добавлять wildcard (*)** — использовать конкретные домены
3. **Тестировать CSP** — проверять в браузере перед деплоем
4. **Использовать Content-Security-Policy-Report-Only** — для тестирования

### Обновление CSP

При добавлении нового API:

1. Добавить домен в соответствующую директиву
2. Обновить тесты в `security-headers.test.ts`
3. Протестировать локально
4. Обновить документацию

## Troubleshooting

### Проблема: Изображения не загружаются

**Решение:**
1. Проверить консоль браузера на CSP violations
2. Добавить домен в `img-src` директиву
3. Пересобрать приложение

### Проблема: Карты Leaflet не работают

**Решение:**
1. Проверить что `style-src` содержит `'unsafe-inline'`
2. Проверить что `img-src` содержит `https://*.basemaps.cartocdn.com`

### Проблема: WebAssembly не работает

**Решение:**
1. Проверить что `script-src` содержит `'wasm-unsafe-eval'`

## Ссылки

- [MDN CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Report URI](https://report-uri.com/)
