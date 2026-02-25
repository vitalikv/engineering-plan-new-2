import './css/reset.css';
import './css/style.css';
import './css/contact.css';
import { renderMenu } from './components/menu';
import { renderFooter } from './components/footer';

const PLACEHOLDER = 'Сообщение';

const menuContainer = document.getElementById('menu-container');
const footerContainer = document.getElementById('footer-container');
const fieldName = document.querySelector<HTMLInputElement>('[data-mess-name]');
const fieldMail = document.querySelector<HTMLInputElement>('[data-mess-mail]');
const fieldText = document.querySelector<HTMLDivElement>('[data-mess-text]');
const btnMess = document.querySelector<HTMLElement>('[data-btn-mess]');
const elInf = document.querySelector<HTMLElement>('[data-inf]');

if (menuContainer) renderMenu(menuContainer);
if (footerContainer) renderFooter(footerContainer);

if (fieldText) {
  fieldText.addEventListener('focusin', () => {
    if (fieldText.innerHTML.trim() === PLACEHOLDER) {
      fieldText.innerHTML = '';
    }
  });
  fieldText.addEventListener('focusout', () => {
    if (fieldText.innerHTML.trim() === '') {
      fieldText.innerHTML = PLACEHOLDER;
    }
  });
}

function sendMess(): void {
  if (!fieldName || !fieldMail || !fieldText || !elInf) return;

  const name = fieldName.value.trim();
  const mail = fieldMail.value.trim();

  let answer = '';
  if (name === '') answer += 'Укажите имя';
  if (mail === '') answer += answer === '' ? ' Укажите почту' : ' и почту';

  if (answer === '') {
    answer = 'Сообщение отправлено';
    fieldName.value = '';
    fieldMail.value = '';
    fieldText.innerHTML = '';
  }

  elInf.innerHTML = answer.trim();
}

btnMess?.addEventListener('mousedown', () => sendMess());
