# Quantum Horizon — Тестовые учётные записи

## Администратор

- **Email:** admin@quantum-horizon.app
- **Пароль:** Admin@123456
- **Роль:** ADMIN
- **Описание:** Полный доступ ко всем функциям системы

## Преподаватель

- **Email:** teacher@quantum-horizon.app
- **Пароль:** Teacher@123456
- **Роль:** MODERATOR
- **Описание:** Доступ к управлению контентом и прогрессом студентов

## Студент

- **Email:** student@quantum-horizon.app
- **Пароль:** Student@123456
- **Роль:** USER
- **Описание:** Базовый доступ к визуализациям и прогрессу

---

## Быстрый вход

### Через форму входа

1. Перейти на `/auth/signin`
2. Ввести email и пароль из таблицы выше
3. Нажать "Войти"

### Через API регистрации

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123456","name":"Test User"}'
```

---

## Примечания

- ⚠️ **Не используйте эти учётные записи в production**
- 🔐 Пароли хранятся в хэшированном виде (bcrypt)
- 📧 Для восстановления пароля используйте `/auth/forgot-password`
- 🔄 Для сброса пароля можно использовать API `/api/auth/reset-password`

---

**Дата создания:** 2026-03-12
**Версия документа:** 1.0
