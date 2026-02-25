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
      (fonEl as HTMLElement).style.display = 'flex';
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && fonEl) {
    (fonEl as HTMLElement).style.display = 'none';
    fonEl.innerHTML = '';
    document.body.style.overflow = 'auto';
  }
});
