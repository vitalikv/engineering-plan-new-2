import { renderMenu } from './components/menu';
import { renderFooter } from './components/footer';

const menuContainer = document.getElementById('menu-container');
const footerContainer = document.getElementById('footer-container');
const fonEl = document.querySelector('[data-fon]');

if (menuContainer) renderMenu(menuContainer);
if (footerContainer) renderFooter(footerContainer);

if (document.getElementById('scene-3d')) {
  requestAnimationFrame(() => {
    import('./scene-3d/scene-3d');
  });
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const clickImg = target.hasAttribute('data-click-img') ? target : target.closest('[data-click-img]');
  if (clickImg) {
    const src = (clickImg as HTMLImageElement).src;
    if (src && fonEl) {
      fonEl.innerHTML = `<img src="${src}" class="modal-media" alt="увеличенное">`;
      (fonEl as HTMLElement).style.display = 'block';
      const imgEl = fonEl.querySelector('.modal-media') as HTMLImageElement;
      imgEl?.addEventListener('load', () => {
        const hOkno = window.innerHeight;
        const hHtml = imgEl.height;
        const hResul = (hOkno - hHtml) / 2;
        imgEl.style.marginTop = `${hResul}px`;
      });
      document.body.style.overflow = 'hidden';
    }
    e.stopPropagation();
    return;
  }
  if (target.classList.contains('modal-media')) {
    e.stopPropagation();
    return;
  }
  if (target.hasAttribute('data-fon')) {
    (target as HTMLElement).style.display = 'none';
    target.innerHTML = '';
    document.body.style.overflow = 'auto';
  }
});
