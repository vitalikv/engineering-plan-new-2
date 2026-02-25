export function renderMenu(container: HTMLElement): void {
  container.innerHTML = `
<div class="section-container">
  <div class="nav-bar">
    <div class="nav-bar__group--left">
      <a href="/">Главная</a>
      <a href="/documentation">Инструкция</a>
    </div>
    <div class="nav-bar__group--right">
      <a href="/contact" class="nav-bar__link--cta">Задать вопрос</a>
    </div>
  </div>
  <div class="nav-divider"></div>
</div>`;
}
