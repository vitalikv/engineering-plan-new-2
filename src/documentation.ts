import { renderMenu } from './components/menu';
import { renderFooter } from './components/footer';

const LESSON_VIDEOS: Record<string, string> = {
  '1': 'https://rutube.ru/play/embed/7ac5775c54e7381f9ac01fb137aad92e',
  '2': 'https://rutube.ru/play/embed/1d999522d60e27e277481dc9eaf8fbd8',
  '3': 'https://rutube.ru/play/embed/9dc47b58bdddcf0b5d989e35a83ab715',
  '4': 'https://rutube.ru/play/embed/ab06bd1e538c225b483d7a23558a7844',
  '5': 'https://rutube.ru/play/embed/b60599b5d2bbb65e5f65342fbcd5dbc3',
};

const menuContainer = document.getElementById('menu-container');
const footerContainer = document.getElementById('footer-container');
const wrapV = document.querySelector('[data-wrap-v]');

if (menuContainer) renderMenu(menuContainer);
if (footerContainer) renderFooter(footerContainer);

function showLesson(id: string): void {
  const video = LESSON_VIDEOS[id];
  if (!video || !wrapV) return;

  wrapV.innerHTML = `
    <div class="modal-video">
      <iframe src="${video}" allow="fullscreen" allowfullscreen></iframe>
    </div>`;
  (wrapV as HTMLElement).style.display = 'flex';
}

function hideLesson(): void {
  if (wrapV) {
    (wrapV as HTMLElement).style.display = 'none';
    wrapV.innerHTML = '';
  }
}

document.querySelectorAll('[data-lesson]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const id = (el as HTMLElement).getAttribute('data-lesson');
    if (id) showLesson(id);
  });
});

wrapV?.addEventListener('click', (e) => {
  if (e.target === wrapV) {
    hideLesson();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideLesson();
});
