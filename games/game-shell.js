const root = document.querySelector('[data-game-root]');

if (root) {
  const panels = new Map(
    [...root.querySelectorAll('[data-state]')].map((panel) => [panel.dataset.state, panel]),
  );

  function setState(nextState) {
    panels.forEach((panel, stateName) => {
      panel.classList.toggle('is-active', stateName === nextState);
    });
  }

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    const action = button.dataset.action;

    if (action === 'start' || action === 'resume') {
      setState('playing');
    }
    if (action === 'pause') {
      setState('paused');
    }
    if (action === 'end') {
      setState('gameover');
    }
    if (action === 'restart') {
      setState('menu');
    }
  });
}
