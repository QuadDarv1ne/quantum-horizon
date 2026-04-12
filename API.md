# 📡 API Documentation

Документация по API endpoints Quantum Horizon.

**Base URL:** `https://quantum-horizon.vercel.app` (production) или `http://localhost:3000` (development)

**Аутентификация:** Все endpoints, кроме `/api/auth/*`, требуют авторизации через NextAuth.js session.

---

## 🔐 Authentication (`/api/auth`)

### POST `/api/auth/register`

Регистрация нового пользователя.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "createdAt": "ISO8601"
}
```

**Errors:**
- `400` - Неверный формат данных
- `409` - Email уже используется
- `429` - Rate limit exceeded (3 запроса/час)

**Rate Limit:** 3 requests per hour

---

### POST `/api/auth/reset-password`

Запрос на сброс пароля.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response (200):**
```json
{
  "message": "Письмо отправлено на email"
}
```

**Errors:**
- `400` - Неверный формат email
- `404` - Пользователь не найден
- `429` - Rate limit exceeded (2 запроса/час)

**Rate Limit:** 2 requests per hour

---

## 📊 Visualizations (`/api/visualizations`)

### GET `/api/visualizations/progress`

Получить прогресс пользователя по визуализациям.

**Headers:**
```
Authorization: Bearer <session-token>
```

**Response (200):**
```json
{
  "visualizations": [
    {
      "id": "string",
      "name": "string",
      "progress": number, // 0-100
      "completedAt": "ISO8601 | null",
      "timeSpent": number // seconds
    }
  ],
  "totalProgress": number, // 0-100
  "completedCount": number,
  "totalCount": number
}
```

**Rate Limit:** 100 requests per minute

---

### POST `/api/visualizations/progress`

Обновить прогресс по визуализации.

**Headers:**
```
Authorization: Bearer <session-token>
```

**Request Body:**
```json
{
  "visualizationId": "string",
  "progress": number, // 0-100
  "timeSpent": number // seconds
}
```

**Response (200):**
```json
{
  "id": "string",
  "visualizationId": "string",
  "progress": number,
  "timeSpent": number,
  "updatedAt": "ISO8601"
}
```

**Errors:**
- `400` - Неверный формат данных
- `404` - Визуализация не найдена

**Rate Limit:** 100 requests per minute

---

### GET `/api/visualizations/bookmarks`

Получить bookmarked визуализации пользователя.

**Headers:**
```
Authorization: Bearer <session-token>
```

**Response (200):**
```json
{
  "bookmarks": [
    {
      "id": "string",
      "visualizationId": "string",
      "name": "string",
      "category": "string",
      "bookmarkedAt": "ISO8601"
    }
  ]
}
```

**Rate Limit:** 100 requests per minute

---

## 📈 Activity (`/api/activity`)

### GET `/api/activity`

Получить историю активности пользователя.

**Headers:**
```
Authorization: Bearer <session-token>
```

**Query Parameters:**
- `limit` (optional): number - Количество записей (default: 50, max: 100)
- `offset` (optional): number - Смещение (default: 0)

**Response (200):**
```json
{
  "activities": [
    {
      "id": "string",
      "type": "string", // VISUALIZATION_VIEW, TEST_COMPLETED, etc.
      "metadata": object,
      "createdAt": "ISO8601"
    }
  ],
  "total": number,
  "limit": number,
  "offset": number
}
```

**Rate Limit:** 60 requests per minute

---

### POST `/api/activity`

Записать новую активность.

**Headers:**
```
Authorization: Bearer <session-token>
```

**Request Body:**
```json
{
  "type": "string",
  "metadata": object
}
```

**Response (201):**
```json
{
  "id": "string",
  "type": "string",
  "metadata": object,
  "createdAt": "ISO8601"
}
```

**Errors:**
- `400` - Неверный формат данных

**Rate Limit:** 60 requests per minute

---

## 🏆 Achievements (`/api/achievements`)

### GET `/api/achievements`

Получить все достижения и прогр пользователя.

**Headers:**
```
Authorization: Bearer <session-token>
```

**Response (200):**
```json
{
  "achievements": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "icon": "string",
      "category": "string", // LEARNING, EXPLORATION, SOCIAL, SPECIAL
      "rarity": "string", // COMMON, RARE, EPIC, LEGENDARY
      "xpReward": number,
      "unlocked": boolean,
      "unlockedAt": "ISO8601 | null",
      "progress": number // 0-100
    }
  ],
  "totalUnlocked": number,
  "totalXpEarned": number
}
```

**Rate Limit:** 60 requests per minute

---

### POST `/api/achievements/:id/unlock`

Разблокировать достижение (internal use only).

**Headers:**
```
Authorization: Bearer <session-token>
```

**Response (200):**
```json
{
  "id": "string",
  "unlocked": true,
  "unlockedAt": "ISO8601",
  "xpReward": number
}
```

**Errors:**
- `404` - Достижение не найдено
- `409` - Уже разблокировано

**Rate Limit:** 60 requests per minute

---

## 🔒 Security

### CORS

API поддерживает CORS для следующих доменов:
- `http://localhost:3000`
- `http://localhost:64764`
- `https://quantum-horizon.vercel.app`
- `https://quantum-horizon.onrender.com`

**Preflight cache:** 24 часа

### Rate Limiting

Все API endpoints защищены rate limiting через Upstash Redis:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/nextauth` | 5 | 1 minute |
| `/api/auth/register` | 3 | 1 hour |
| `/api/auth/reset-password` | 2 | 1 hour |
| `/api/visualizations/*` | 100 | 1 minute |
| `/api/activity/*` | 60 | 1 minute |
| `/api/achievements/*` | 60 | 1 minute |

**Response при rate limit (429):**
```json
{
  "error": "Слишком много запросов. Попробуйте позже.",
  "remaining": 0,
  "reset": "2026-04-12T20:00:00.000Z"
}
```

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1713020400
```

### Headers безопасности

Все ответы API включают:
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 📝 Examples

### Регистрация нового пользователя

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123!"
  }'
```

### Получение прогресса визуализаций

```bash
curl -X GET http://localhost:3000/api/visualizations/progress \
  -H "Authorization: Bearer <session-token>"
```

### Обновление прогресса

```bash
curl -X POST http://localhost:3000/api/visualizations/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session-token>" \
  -d '{
    "visualizationId": "wave-function",
    "progress": 75,
    "timeSpent": 300
  }'
```

---

## 🚀 Development

### Локальная разработка

1. Запустите сервер разработки:
   ```bash
   npm run dev
   ```

2. API доступно по адресу: `http://localhost:3000/api/*`

3. Для тестирования авторизации используйте:
   ```bash
   npm run db:seed  # Создаёт тестового пользователя
   ```

### Переменные окружения

```bash
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"  # optional
UPSTASH_REDIS_REST_TOKEN="your-redis-token"  # optional
```

**Примечание:** Rate limiting работает только при настроенном Upstash Redis. Без него запросы проходят без ограничений.

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Upstash Rate Limiting](https://upstash.com/docs/ratelimit)

---

<div align="center">

**⧫ QUANTUM HORIZON** • API Documentation

Made with ❤️ by QuadDarv1ne

</div>
