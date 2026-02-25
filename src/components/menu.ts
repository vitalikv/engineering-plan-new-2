export function renderMenu(container: HTMLElement): void {
  container.innerHTML = `
<div class="block_line_1">
  <div class="head_menu">
    <div class="float_left">
      <a href="/">Главная</a>
      <a href="/documentation.html">Инструкция</a>
    </div>
    <div class="float_right">
      <a href="/contact.html" class="hm_2">Задать вопрос</a>
    </div>
    <div class="clear"></div>
  </div>
  <div class="line_1"></div>
</div>`;
}
