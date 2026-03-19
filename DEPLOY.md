# 🚀 Руководство по деплою Quantum Horizon

Полное руководство по развёртыванию приложения в production.

---

## 📋 Оглавление

1. [Требования](#требования)
2. [Переменные окружения](#переменные-окружения)
3. [Docker деплой](#docker-деплой)
4. [GitHub Actions деплой](#github-actions-деплой)
5. [Vercel деплой](#vercel-деплой)
6. [Ручной деплой](#ручной-деплой)
7. [Мониторинг и логи](#мониторинг-и-логи)

---

## Требования

### Минимальные

- **CPU:** 2 cores
- **RAM:** 2 GB
- **Disk:** 10 GB
- **Node.js:** 20.x

### Рекомендуемые

- **CPU:** 4 cores
- **RAM:** 4 GB
- **Disk:** 20 GB SSD
- **Node.js:** 20.x LTS

---

## Переменные окружения

### Необходимые секреты для GitHub Actions

Настройте в репозитории GitHub: `Settings → Secrets and variables → Actions`

```bash
# Обязательные
NEXTAUTH_SECRET="ваш-секретный-ключ"      # openssl rand -base64 32
NEXTAUTH_URL="https://your-domain.com"     # Ваш домен

# Опциональные (для production БД)
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
```

### Генерация NEXTAUTH_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## Docker деплой

### Локальная разработка

```bash
# Запуск всех сервисов (app + postgres + pgadmin)
docker-compose up --build

# Запуск в фоновом режиме
docker-compose up -d

# Просмотр логов
docker-compose logs -f app
docker-compose logs -f postgres

# Остановка
docker-compose down
```

### Production

```bash
# Сборка и запуск production версии
docker-compose -f docker-compose.prod.yml up --build -d

# Просмотр статуса
docker-compose -f docker-compose.prod.yml ps

# Логи
docker-compose -f docker-compose.prod.yml logs -f app
```

### Переменные для docker-compose.prod.yml

Создайте `.env` в корне проекта:

```bash
# Database
POSTGRES_USER=quantum
POSTGRES_PASSWORD=secure_password_here

# Auth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.com

# Port
PORT=3000
```

---

## GitHub Actions деплой

### Автоматический деплой

При пуше в ветку `main`:

```bash
git checkout main
git merge dev
git push origin main
```

Workflow автоматически:

1. Проверит код (lint, typecheck)
2. Запустит тесты
3. Соберёт приложение
4. Загрузит артефакты

### Ручной запуск

1. Перейдите в `Actions → Deploy → Run workflow`
2. Выберите ветку
3. Нажмите `Run workflow`

---

## Vercel деплой

### Быстрый старт

1. Установите Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Залогиньтесь:

   ```bash
   vercel login
   ```

3. Задеплойте:
   ```bash
   vercel
   ```

### Настройка в Vercel Dashboard

1. Импортируйте репозиторий
2. Настройте переменные окружения:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `DATABASE_URL`
3. Нажмите **Deploy**

### Production деплой

```bash
vercel --prod
```

---

## Ручной деплой на сервер

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PM2
sudo npm install -g pm2

# Установка Docker (опционально)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Клонирование репозитория

```bash
git clone https://github.com/QuadDarv1ne/quantum-horizon.git
cd quantum-horizon
```

### 3. Настройка окружения

```bash
cp .env.example .env.local
nano .env.local
```

### 4. Установка зависимостей

```bash
npm ci --production
```

### 5. Генерация Prisma

```bash
npm run db:generate
```

### 6. Сборка

```bash
npm run build
```

### 7. Запуск через PM2

```bash
# Создание ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'quantum-horizon',
    script: 'node',
    args: '.next/standalone/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Запуск
pm2 start ecosystem.config.js

# Сохранение конфигурации
pm2 save

# Автозапуск при загрузке
pm2 startup
```

### 8. Настройка Nginx (опционально)

```bash
sudo nano /etc/nginx/sites-available/quantum-horizon
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/quantum-horizon /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. HTTPS через Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## Мониторинг и логи

### PM2 команды

```bash
# Статус приложений
pm2 status

# Логи
pm2 logs quantum-horizon

# Перезапуск
pm2 restart quantum-horizon

# Остановка
pm2 stop quantum-horizon

# Метрики
pm2 monit
```

### Docker логи

```bash
# Все логи
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f app
docker-compose logs -f postgres
```

### Systemd логи (если используется systemd)

```bash
journalctl -u quantum-horizon -f
```

---

## Чеклист перед деплоем

- [ ] Все тесты проходят
- [ ] ESLint и Prettier без ошибок
- [ ] TypeScript компилируется без ошибок
- [ ] Переменные окружения настроены
- [ ] `NEXTAUTH_SECRET` сгенерирован
- [ ] База данных настроена
- [ ] Домен настроен (для production)
- [ ] HTTPS сертификат установлен
- [ ] Бэкапы базы данных настроены
- [ ] Мониторинг настроен

---

## Troubleshooting

### Ошибка: "NEXTAUTH_SECRET не установлен"

```bash
# Сгенерируйте новый секрет
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Ошибка: "Prisma Client не сгенерирован"

```bash
npm run db:generate
```

### Ошибка: "Port 3000 already in use"

```bash
# Измените порт в .env.local
PORT=3001
```

### Ошибка сборки в Docker

```bash
# Очистите кэш и пересоберите
docker-compose build --no-cache
```

---

## Поддержка

При возникновении проблем:

1. Проверьте логи
2. Изучите [Issues](https://github.com/QuadDarv1ne/quantum-horizon/issues)
3. Создайте новый Issue с описанием проблемы
