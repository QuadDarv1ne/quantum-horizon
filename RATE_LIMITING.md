# Rate Limiting Documentation

## Обзор

Quantum Horizon использует rate limiting для защиты API endpoints от злоупотреблений и DDoS-атак. Реализация основана на **Upstash Ratelimit** с использованием Redis в качестве хранилища.

## Архитектура

### Технологии

- **@upstash/ratelimit** — библиотека для rate limiting
- **@upstash/redis** — serverless Redis для хранения состояния
- **Sliding Window** алгоритм — точный подсчёт запросов во времени

### Расположение

- **Middleware:** `src/middleware.ts`
- **Тесты:** `src/middleware.test.ts`

## Конфигурация лимитов

### Authentication Endpoints

| Endpoint | Лимит | Окно | Описание |
|----------|-------|------|----------|
| `/api/auth/signin` | 5 запросов | 1 минута | Вход пользователя |
| `/api/auth/register` | 3 запроса | 1 час | Регистрация нового пользователя |
| `/api/auth/reset-password` | 2 запроса | 1 час | Сброс пароля |

### API Endpoints

| Endpoint | Лимит | Окно | Описание |
|----------|-------|------|----------|
| `/api/visualizations/*` | 100 запросов | 1 минута | Визуализации (квантовая механика, космология) |
| `/api/activity/*` | 60 запросов | 1 минута | Логирование активности пользователя |
| `/api/achievements/*` | 60 запросов | 1 минута | Достижения пользователя |

## Ответы API

### Успешный запрос (200 OK)

```json
{
  "data": {...}
}
```

Заголовки:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 2026-03-29T12:00:00.000Z
```

### Превышение лимита (429 Too Many Requests)

```json
{
  "error": "Слишком много запросов. Попробуйте позже.",
  "remaining": 0,
  "reset": "2026-03-29T12:01:00.000Z"
}
```

Заголовки:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2026-03-29T12:01:00.000Z
```

## Идентификация клиентов

### IP Address Detection

Rate limiting использует IP адрес клиента для идентификации:

1. **X-Forwarded-For** заголовок (если есть)
2. **Fallback** на `127.0.0.1` если заголовок отсутствует

```typescript
const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1"
```

### Proxy Support

При использовании прокси (nginx, Cloudflare) IP адрес извлекается из первого значения в `x-forwarded-for`:

```
x-forwarded-for: 203.0.113.1, proxy1, proxy2
                 ↑
                 client IP
```

## Настройка окружения

### Required Variables

Для работы rate limiting необходимо настроить Upstash Redis:

```env
# .env.local
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### Development Mode

Если переменные окружения не настроены, rate limiting отключается (возвращается `null`):

```typescript
const ratelimit = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Ratelimit({...})
  : null
```

## Алгоритм Sliding Window

### Как работает

Sliding Window (скользящее окно) — комбинация fixed window и moving window:

1. **Окно времени** делится на интервалы
2. **Подсчёт** запросов за текущий интервал + часть предыдущего
3. **Взвешенное среднее** для точного подсчёта

### Преимущества

- ✅ Точный подсчёт без "boundary problem"
- ✅ Эффективное использование памяти
- ✅ Плавное ограничение без резких скачков

### Пример

```
Время: 12:00:00 — 12:01:00 (окно 1 минута)

12:00:30 — запрос 1 (вес: 1.0)
12:00:45 — запрос 2 (вес: 1.0)
12:00:50 — запрос 3 (вес: 1.0)

12:01:10 — запрос 4 (вес: 0.8 + 0.2 от предыдущего окна)
```

## Middleware Architecture

### Flow

```
Request → Middleware → Extract IP → Check Rate Limit
                                      ↓
                          ┌───────────┴───────────┐
                          │                       │
                     Success                  Failure
                          │                       │
                          ↓                       ↓
                   NextResponse.next()      NextResponse.json(429)
```

### Matcher Pattern

Middleware применяется только к API routes:

```typescript
export const config = {
  matcher: ["/api/:path*"],
}
```

### Обработка путей

| Path | Matcher | Rate Limit |
|------|---------|------------|
| `/api/auth/signin` | ✅ | 5/мин |
| `/api/visualizations/quantum` | ✅ | 100/мин |
| `/api/activity/log` | ✅ | 60/мин |
| `/` | ❌ | Нет |
| `/auth/signin` | ❌ | Нет |

## Тестирование

### Unit Tests

Тесты расположены в `src/middleware.test.ts`:

```bash
npm test -- middleware.test.ts
```

### Test Cases

1. ✅ Пропуск запросов в пределах лимита
2. ✅ Возврат 429 при превышении лимита
3. ✅ Установка заголовков X-RateLimit-*
4. ✅ Разные лимиты для разных endpoints
5. ✅ Извлечение IP из x-forwarded-for
6. ✅ Fallback IP если заголовок отсутствует
7. ✅ Matcher только для /api/* routes

## Мониторинг

### Analytics

Upstash Ratelimit предоставляет встроенную аналитику:

```typescript
new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,  // Включить аналитику
  prefix: "@upstash/ratelimit/visualizations",
})
```

### Upstash Dashboard

Для просмотра статистики:

1. Войти в [Upstash Console](https://console.upstash.io/)
2. Выбрать Redis базу
3. Перейти в раздел **Analytics**

### Метрики

- **Requests per second** — количество запросов в секунду
- **Blocked requests** — заблокированные запросы (429)
- **Latency** — задержка проверки rate limit

## Best Practices

### Для разработчиков

1. **Кэширование** — кэшируйте ответы API для уменьшения запросов
2. **Batch requests** — объединяйте несколько запросов в один
3. **Exponential backoff** — при получении 429 увеличивайте задержку

### Для пользователей

1. **Не превышать лимиты** — соблюдать ограничения API
2. **Использовать кэширование** — сохранять результаты запросов
3. **Оптимизировать запросы** — запрашивать только необходимые данные

## Troubleshooting

### Проблема: Rate limiting не работает

**Решение:**
1. Проверьте переменные окружения `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN`
2. Убедитесь, что Redis база активна в Upstash Console
3. Проверьте логи middleware

### Проблема: Слишком много 429 ошибок

**Решение:**
1. Увеличьте лимиты в `src/middleware.ts`
2. Проверьте на наличие зацикленных запросов
3. Реализуйте кэширование на клиенте

### Проблема: Rate limiting не отключается в development

**Решение:**
1. Удалите `.next` директорию
2. Перезапустите dev-сервер
3. Проверьте, что переменные окружения не установлены

## Ссылки

- [Upstash Ratelimit Documentation](https://upstash.com/docs/ratelimit)
- [Upstash Redis Documentation](https://upstash.com/docs/redis)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Sliding Window Algorithm](https://en.wikipedia.org/wiki/Sliding_window_protocol)
