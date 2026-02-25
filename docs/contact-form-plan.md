# План: Настройка отправки формы contact.html

## Проблема

Форма обратной связи не отправляет сообщения. В файле `src/contact.ts` (строка 40) стоит TODO-комментарий вместо реального запроса на сервер:

```typescript
// TODO: добавить fetch() для отправки данных на сервер
elInf.textContent = 'Сообщение отправлено'; // фейковое сообщение об успехе
```

Форма только валидирует поля на клиенте и показывает "Сообщение отправлено" без реальной отправки.

## Что нужно сделать

### Шаг 1. Создать PHP-обработчик `components/contact.php`

Создать файл `components/contact.php` в корне проекта (рядом с `contact.html`).
Берём рабочий обработчик из `engineering-plan-new/components/contact.php` и адаптируем:

- Принимает POST-параметры: `name`, `mail`, `text`
- Санитизация: `htmlentities()` для имени и текста
- Валидация email через `filter_var(FILTER_VALIDATE_EMAIL)`
- Отправка через PHP `mail()`
- Возвращает текстовый ответ (успех или ошибка)

### Шаг 2. Добавить `fetch()` в `src/contact.ts`

Заменить TODO-комментарий на реальный `fetch()` запрос:

```typescript
// Вместо строк 40-44 сделать:
async function sendMess(): Promise<void> {
  // ...валидация...

  const response = await fetch('/components/contact.php', {
    method: 'POST',
    body: `name=${encodeURIComponent(name)}&mail=${encodeURIComponent(mail)}&text=${encodeURIComponent(text)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
  const answer = await response.text();

  elInf.textContent = answer.trim();
  fieldName.value = '';
  fieldMail.value = '';
  fieldText.value = '';
}
```

### Шаг 3. Обновить `.htaccess`

Добавить правило, чтобы OpenServer (Apache) обрабатывал PHP-файл:

```apache
# Разрешить прямой доступ к PHP-обработчику
RewriteRule ^components/contact\.php$ - [L]
```

### Шаг 4. Проверить структуру

Итоговая структура файлов:

```
engineering-plan-new-2/
├── components/
│   └── contact.php          <-- НОВЫЙ (серверный обработчик)
├── contact.html
├── src/
│   └── contact.ts           <-- ИЗМЕНЁН (добавлен fetch)
├── .htaccess                <-- ИЗМЕНЁН (правило для PHP)
└── ...
```

## Зависимости

- OpenServer с PHP и настроенной функцией `mail()` (уже есть, работает в engineering-plan-new)
- Apache mod_rewrite (уже включён в `.htaccess`)

## Тестирование

1. Открыть `http://engineering-plan-new-2/contact`
2. Заполнить все поля формы
3. Нажать "ОТПРАВИТЬ"
4. Должно появиться "Спасибо! Мы приняли ваше сообщение."
5. Проверить получение письма через OpenServer (fakemailer / hMailServer / логи)
