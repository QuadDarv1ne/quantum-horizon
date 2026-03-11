# Git - Полное руководство по работе

## Содержание

1. [Базовые команды](#базовые-команды)
2. [Рабочий процесс (Workflow)](#рабочий-процесс-workflow)
3. [Синхронизация веток](#синхронизация-веток)
4. [Полезные команды](#полезные-команды)
5. [Исправление ошибок](#исправление-ошибок)

---

## Базовые команды

### Проверка статуса

```powershell
git status                    # Показать изменённые файлы
git log --oneline -10         # Показать последние 10 коммитов
git branch -a                 # Показать все ветки
```

### Добавление и коммит

```powershell
git add .                     # Добавить все изменения
git add filename.txt          # Добавить конкретный файл
git commit -m "message"       # Создать коммит с сообщением
```

### Формат сообщений коммитов

```textline
feat: новая функция
fix: исправление бага
docs: документация
style: форматирование
refactor: рефакторинг
test: тесты
chore: настройки, зависимости
```

**Примеры:**

```powershell
git commit -m "feat: add user authentication"
git commit -m "fix: resolve Docker build error"
git commit -m "docs: update README"
```

---

## Рабочий процесс (Workflow)

### Стандартный процесс (одна ветка main)

```powershell
# 1. Проверить статус
git status

# 2. Добавить изменения
git add .

# 3. Создать коммит
git commit -m "fix: description"

# 4. Отправить в GitHub
git push origin main
```

### Работа с двумя ветками (main + dev)

```powershell
# === РАЗРАБОТКА В DEV ===

# 1. Переключиться на dev
git checkout dev

# 2. Получить последние изменения
git pull origin dev

# 3. Внести изменения, затем добавить и закоммитить
git add .
git commit -m "feat: new feature"

# 4. Отправить в dev
git push origin dev


# === СЛИЯНИЕ В MAIN ===

# 5. Переключиться на main
git checkout main

# 6. Получить последние изменения main
git pull origin main

# 7. Влить dev в main
git merge dev

# 8. Отправить main
git push origin main

# 9. Вернуться в dev
git checkout dev
```

### Одна строка (dev → main)

```powershell
git checkout dev && git add . && git commit -m "message" && git push origin dev && git checkout main && git pull origin main && git merge dev && git push origin main && git checkout dev
```

---

## Синхронизация веток

### Если main опережает dev

```powershell
git checkout dev
git merge main
git push origin dev
```

### Если dev опережает main

```powershell
git checkout main
git pull origin main
git merge dev
git push origin main
```

### Полная синхронизация (обновить обе ветки)

```powershell
# Обновить main
git checkout main
git pull origin main

# Обновить dev и влить main
git checkout dev
git pull origin dev
git merge main
git push origin dev

# Вернуть main
git checkout main
```

### Проверить разницу между ветками

```powershell
# Коммиты в dev, которых нет в main
git log main..dev --oneline

# Коммиты в main, которых нет в dev
git log dev..main --oneline

# Разница в файлах
git diff main..dev --stat
```

---

## Полезные команды

### Отмена изменений

```powershell
# Отменить изменения в файле (до add)
git restore filename.txt

# Отменить все изменения (до add)
git restore .

# Отменить последний коммит (сохранить изменения)
git reset --soft HEAD~1

# Отменить последний коммит (удалить изменения)
git reset --hard HEAD~1

# Изменить сообщение последнего коммита
git commit --amend -m "new message"
```

### История и поиск

```powershell
# История коммитов с графиком
git log --oneline --graph --all -20

# Найти коммит по тексту
git log --grep="bug fix"

# Кто изменил строку в файле
git blame filename.txt

# История файла
git log --follow filename.txt
```

### Временное сохранение изменений

```powershell
# Сохранить текущие изменения (не коммитя)
git stash

# Посмотреть список stash
git stash list

# Восстановить последнее сохранение
git stash pop

# Восстановить конкретное сохранение
git stash apply stash@{0}
```

### Клонирование и удалённые репозитории

```powershell
# Клонировать репозиторий
git clone https://github.com/user/repo.git

# Клонировать конкретную ветку
git clone -b dev https://github.com/user/repo.git

# Добавить удалённый репозиторий
git remote add upstream https://github.com/original/repo.git

# Обновить информацию о удалённых репозиториях
git fetch --all
```

---

## Исправление ошибок

### Ошибка: "Your branch is behind"

```powershell
git pull origin main
```

### Ошибка: "Your branch is ahead"

```powershell
git push origin main
```

### Ошибка: "divergent branches"

```powershell
git pull origin main --rebase
git push origin main
```

### Ошибка: merge conflict

```powershell
# 1. Посмотреть конфликтующие файлы
git status

# 2. Открыть файл и исправить конфликты вручную
# Ищите markers: <<<<<<< HEAD, =======, >>>>>>> branch-name

# 3. После исправления
git add .
git commit -m "fix: resolve merge conflict"
git push origin main
```

### Сброс локальной ветки до remote

```powershell
git fetch origin
git reset --hard origin/main
```

---

## Шпаргалка для ежедневной работы

```textline
┌─────────────────────────────────────────────────────────────┐
│                    GIT WORKFLOW                              │
├─────────────────────────────────────────────────────────────┤
│  START                                                       │
│    │                                                         │
│    ▼                                                         │
│  git status ──────► Есть изменения? ────NO───► git pull     │
│    │                         │                               │
│    │                        YES                              │
│    │                         │                               │
│    ▼                         ▼                               │
│  git add .              git add .                            │
│    │                         │                               │
│    ▼                         ▼                               │
│  git commit            git commit -m "message"               │
│    │                         │                               │
│    ▼                         ▼                               │
│  git push              git push origin main                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Алиасы (сокращения)

Добавьте в `~/.gitconfig`:

```ini
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --oneline --graph --all
    sync = !git fetch --all && git pull
    done = !git add . && git commit -m "update" && git push
```

**Использование:**

```powershell
git st              # вместо git status
git co main         # вместо git checkout main
git visual          # красивая история
git done            # быстро добавить, закоммитить и запушить
```

---

## Файл .gitignore

**Исключить файлы из отслеживания:**

```gitignore
# Зависимости
node_modules/
__pycache__/
*.pyc

# Окружение
.env
.env.local
venv/

# IDE
.idea/
.vscode/
*.swp

# Сборка
dist/
build/
.next/

# Логи
*.log
logs/

# ОС
.DS_Store
Thumbs.db
```

---

## Быстрые команды для MentorHub

```powershell
# Быстрый пуш в main
git add . && git commit -m "update" && git push origin main

# Синхронизировать dev с main
git checkout dev && git merge main && git push origin dev && git checkout main

# Проверить статус всех веток
git fetch --all && git branch -vv

# Обновить локальный репозиторий
git pull origin main
```

---

## Две команды для синхронизации

1. **Синхронизировать dev с main (dev подтягивает изменения из main):**

```powershell
git checkout dev && git pull origin dev && git merge main && git push origin dev && git checkout main
```

2. **Синхронизировать main с dev (main подтягивает изменения из dev):**

```powershell
git checkout main && git pull origin main && git merge dev && git push origin main && git checkout dev
```
