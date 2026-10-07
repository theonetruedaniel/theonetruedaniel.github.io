export function normalize(value) {
  return String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function matchesRepository(record, { query = '', stage = '', layer = '' } = {}) {
  if (stage && record.stage !== stage) return false;
  if (layer && record.layer !== layer) return false;
  const haystack = normalize(record.search);
  return normalize(query).trim().split(/\s+/).every(word => haystack.includes(word));
}

export function initializeCatalog(root) {
  if (!root) return;
  const form = root.querySelector('[data-catalog-filters]');
  const rows = [...root.querySelectorAll('[data-repository]')];
  const count = root.querySelector('[data-catalog-count]');
  const empty = root.querySelector('[data-catalog-empty]');
  const update = () => {
    const filters = { query: form.elements.query.value, stage: form.elements.stage.value, layer: form.elements.layer.value };
    let visible = 0;
    for (const row of rows) {
      row.hidden = !matchesRepository(row.dataset, filters);
      if (!row.hidden) visible++;
    }
    count.textContent = `${visible} of ${rows.length} repositories shown`;
    empty.hidden = visible !== 0;
  };
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  // Reset's default action runs after its listeners; read the restored values next task.
  form.addEventListener('reset', () => setTimeout(update, 0));
  form.hidden = false;
  update();
}

if (typeof document !== 'undefined') initializeCatalog(document.querySelector('#repository-catalog'));
