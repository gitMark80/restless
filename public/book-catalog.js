// Progressive enhancement: all catalog content and links work without JavaScript.
(() => {
  const controls = document.querySelector('[data-catalog-controls]');
  if (!controls) return;
  const search = document.querySelector('#book-search');
  const buttons = [...controls.querySelectorAll('[data-book-category]')];
  const groups = [...document.querySelectorAll('[data-book-group]')];
  const count = document.querySelector('[data-book-count]');
  const empty = document.querySelector('[data-book-empty]');
  const feature = document.querySelector('[data-catalog-feature]');
  let category = 'all';
  const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  function update() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let total = 0;
    groups.forEach(group => {
      let visible = 0;
      group.querySelectorAll('[data-book-search]').forEach(book => {
        const matches = (category === 'all' || category === group.dataset.bookGroup) && terms.every(term => normalize(book.dataset.bookSearch).includes(term));
        book.hidden = !matches;
        if (matches) visible++;
      });
      group.hidden = visible === 0;
      total += visible;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.bookCategory === category)));
    count.textContent = `${total} ${total === 1 ? 'book' : 'books'}${category === 'all' && !terms.length ? ' to explore' : ' found'}`;
    empty.hidden = total !== 0;
    feature.hidden = category !== 'all' || terms.length > 0;
  }
  search.addEventListener('input', update);
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.bookCategory; update(); }));
  document.querySelector('[data-book-reset]').addEventListener('click', () => { search.value = ''; category = 'all'; update(); search.focus(); });
  controls.hidden = false;
  update();
})();
