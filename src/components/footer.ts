export function renderFooter(container: HTMLElement): void {
  container.innerHTML = `
<div class="block_line_1">
  <div class="footer_menu">
    <a href="/documentation.html">Инструкция</a>
    <a href="/contact.html">Задать вопрос</a>
  </div>
  <div class="clear"></div>
</div>`;
}
