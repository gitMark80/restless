// Progressive enhancement: all catalog content and links work without JavaScript.
(() => {
  const controls = document.querySelector('[data-catalog-controls]');
  if (!controls) return;
  const buttons = [...controls.querySelectorAll('[data-book-category]')];
  const groups = [...document.querySelectorAll('[data-book-group]')];
  const count = document.querySelector('[data-book-count]');
  const empty = document.querySelector('[data-book-empty]');
  const feature = document.querySelector('[data-catalog-feature]');
  let category = 'all';

  function update() {
    let total = 0;
    groups.forEach(group => {
      const visible = category === 'all' || category === group.dataset.bookGroup;
      const books = group.querySelectorAll('[data-book-search]');
      books.forEach(book => { book.hidden = !visible; });
      group.hidden = !visible || books.length === 0;
      if (visible) total += books.length;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.bookCategory === category)));
    count.textContent = `${total} ${total === 1 ? 'book' : 'books'} ${category === 'all' ? 'to explore' : 'in this category'}`;
    empty.hidden = total !== 0;
    feature.hidden = category !== 'all';
  }

  // Tapping a selected category a second time restores the full catalog.
  buttons.forEach(button => button.addEventListener('click', () => {
    category = category === button.dataset.bookCategory ? 'all' : button.dataset.bookCategory;
    update();
  }));
  const reset = document.querySelector('[data-book-reset]');
  if (reset) reset.addEventListener('click', () => { category = 'all'; update(); });
  controls.hidden = false;
  update();
})();
