import { renderMenu } from './components/menu';
import { renderFooter } from './components/footer';

const menuContainer = document.getElementById('menu-container');
const footerContainer = document.getElementById('footer-container');
const fieldName = document.querySelector<HTMLInputElement>('[data-mess-name]');
const fieldMail = document.querySelector<HTMLInputElement>('[data-mess-mail]');
const fieldText = document.querySelector<HTMLTextAreaElement>('[data-mess-text]');
const btnMess = document.querySelector<HTMLElement>('[data-btn-mess]');
const elInf = document.querySelector<HTMLElement>('[data-inf]');

if (menuContainer) renderMenu(menuContainer);
if (footerContainer) renderFooter(footerContainer);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendMess(): void {
  if (!fieldName || !fieldMail || !fieldText || !elInf) return;

  const name = fieldName.value.trim();
  const mail = fieldMail.value.trim();
  const text = fieldText.value.trim();

  const errors: string[] = [];
  if (name === '') errors.push('Укажите имя');
  if (mail === '') {
    errors.push('Укажите почту');
  } else if (!isValidEmail(mail)) {
    errors.push('Неверный формат почты');
  }
  if (text === '') errors.push('Введите сообщение');

  if (errors.length > 0) {
    elInf.textContent = errors.join('. ');
    return;
  }

  // TODO: добавить fetch() для отправки данных на сервер
  elInf.textContent = 'Сообщение отправлено';
  fieldName.value = '';
  fieldMail.value = '';
  fieldText.value = '';
}

btnMess?.addEventListener('click', () => sendMess());
