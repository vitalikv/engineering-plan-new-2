export function renderFooter(container: HTMLElement): void {
  container.innerHTML = `
<div class="section-container">
  <div class="footer-nav">
    <a href="/documentation">Инструкция</a>
    <a href="/contact">Задать вопрос</a>
  </div>
</div>`;
}
