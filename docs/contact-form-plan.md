# Настройка отправки формы contact.html

## Исходная проблема

Форма обратной связи не отправляла сообщения. В `src/contact.ts` стоял TODO-комментарий вместо реального запроса на сервер — форма показывала "Сообщение отправлено" без фактической отправки. Серверный PHP-обработчик отсутствовал.

## Что было сделано

### 1. Создан PHP-обработчик `components/contact.php`

Серверный скрипт по образцу рабочего проекта `engineering-plan-new`:

- Принимает POST-параметры: `name`, `mail`, `text`
- Санитизация: `htmlentities()` для имени и текста
- Валидация email через `filter_var(FILTER_VALIDATE_EMAIL)`
- Защита от header injection: удаление `\r\n` из полей name и mail
- Проверка метода запроса (`POST` only)
- Отправка через PHP `mail()`

### 2. Добавлен `fetch()` в `src/contact.ts`

Заменён TODO-комментарий на реальный POST-запрос к `/components/contact.php` с `encodeURIComponent` для всех параметров. Добавлена защита от двойной отправки (флаг `isSending` + класс `disabled` на кнопке).

### 3. Обновлён `.htaccess`

Добавлено правило для прямого доступа к PHP-обработчикам:
```apache
RewriteRule ^components/.*\.php$ - [L]
```

### 4. Настроен Vite proxy в `vite.config.ts`

Добавлено проксирование `/components` запросов на Apache (OpenServer). Домен определяется динамически из имени папки проекта.

## Проблемы при реализации и решения

### Проблема 1: PHP не выполняется, возвращается исходный код

**Симптом:** при нажатии "ОТПРАВИТЬ" в поле ответа выводился сырой PHP-код вместо результата.

**Причина:** сайт работает через Vite dev-сервер (`npm run dev`), который не умеет выполнять PHP — он отдавал файл `components/contact.php` как обычный статический текст.

**Решение:** добавлен `server.proxy` в `vite.config.ts` — запросы к `/components` проксируются на Apache (OpenServer), который выполняет PHP:
```typescript
const domain = basename(process.cwd())

export default defineConfig({
  server: {
    proxy: {
      '/components': `http://${domain}`,
    },
  },
})
```

### Проблема 2: 500 Internal Server Error через прокси

**Симптом:** `Failed to load resource: the server responded with a status of 500`

**Причина:** домен `engineering-plan-new-2` не был зарегистрирован в OpenServer — Vite proxy не мог разрешить имя хоста (`ENOTFOUND engineering-plan-new-2`).

**Решение:** перезапуск OpenServer — после рестарта OpenServer автоматически создал виртуальный хост из папки `domains/engineering-plan-new-2` и добавил запись в hosts.

### Проблема 3: Безопасность

**Симптомы:** в PHP был включён `display_errors` (утечка информации), отсутствовала защита от header injection и двойной отправки.

**Решения:**
- Убран `display_errors` из production-кода
- Добавлена проверка `REQUEST_METHOD === POST`
- Добавлено удаление `\r\n` из name/mail (защита от email header injection)
- Добавлен флаг `isSending` в TypeScript (защита от двойного клика)

## Итоговая структура

```
engineering-plan-new-2/
├── components/
│   └── contact.php          -- серверный обработчик (PHP)
├── src/
│   └── contact.ts           -- клиентский код (fetch + валидация)
├── .htaccess                -- правило для PHP-обработчиков
├── vite.config.ts           -- proxy для dev-режима
└── contact.html             -- форма
```

## Примечание о proxy

`server.proxy` в `vite.config.ts` работает только в dev-режиме (`npm run dev`). В production-билде прокси не нужен — Apache напрямую выполняет PHP по относительному пути `/components/contact.php`.
