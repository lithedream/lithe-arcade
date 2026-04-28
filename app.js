const games = [
  {
    slug: 'neon-drift',
    name: 'Neon Drift Runner',
    description: 'Playable infinite runner. Tap anywhere to jump over synthwave hazards.',
    createdAt: '2026-04-25',
  },
  {
    slug: 'starfall-keeper',
    name: 'Starfall Keeper',
    description: 'Cosmic defense setup page. Placeholder shell only, no gameplay yet.',
    createdAt: '2026-04-24',
  },
  {
    slug: 'pixel-quest',
    name: 'Pixel Quest',
    description: 'Adventure framework page. Placeholder shell only, no gameplay yet.',
    createdAt: '2026-04-23',
  },
];

const sortOrder = document.querySelector('#sort-order');
const gameList = document.querySelector('#game-list');
const template = document.querySelector('#game-card-template');

function formatDate(value) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function render(order) {
  gameList.textContent = '';

  const sorted = [...games].sort((a, b) => {
    const diff = Date.parse(a.createdAt) - Date.parse(b.createdAt);
    return order === 'old' ? diff : -diff;
  });

  for (const game of sorted) {
    const fragment = template.content.cloneNode(true);
    const link = fragment.querySelector('[data-role="game-link"]');
    link.href = `games/${game.slug}/`;

    fragment.querySelector('[data-role="name"]').textContent = game.name;
    fragment.querySelector('[data-role="description"]').textContent = game.description;
    fragment.querySelector('[data-role="date"]').textContent = `Added ${formatDate(game.createdAt)}`;

    gameList.append(fragment);
  }
}

sortOrder.addEventListener('change', (event) => {
  render(event.target.value);
});

render(sortOrder.value);
