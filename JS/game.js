// ─── ESTADO DEL JUEGO ─────────────────────────────────────────────────────────
const State = {
  playerName: 'PLAYER',
  snakeColor: '#00ff88',
  background: 'galaxy',
  fruitType: '🍎',
  fruitCount: 3,
  gameMode: 'normal',
  sfxVolume: 0.7,
  musicVolume: 0.4,
  score: 0,
  highScore: parseInt(localStorage.getItem('snakeHS') || '0'),
  paused: false,
  running: false,
};

// ─── MÚSICA DE FONDO ──────────────────────────────────────────────────────────
const musicMenu = new Audio('sounds/Menu Sound.mp3');
const musicGame = new Audio('sounds/Game Sound.mp3');
musicMenu.loop = true;
musicGame.loop = true;
musicMenu.volume = State.musicVolume;
musicGame.volume = State.musicVolume;

function playMenuMusic() {
  musicGame.pause();
  musicGame.currentTime = 0;
  musicMenu.volume = State.musicVolume;
  musicMenu.play().catch(() => { });
}

function playGameMusic() {
  musicMenu.pause();
  musicMenu.currentTime = 0;
  musicGame.volume = State.musicVolume;
  musicGame.play().catch(() => { });
}

function updateMusicVolume() {
  musicMenu.volume = State.musicVolume;
  musicGame.volume = State.musicVolume;
}

// ─── EFECTOS DE SONIDO ────────────────────────────────────────────────────────
const sfxEat = new Audio('sounds/Eat-sound.mp3');
const sfxDie = new Audio('sounds/Die-Sound.mp3');
const sfxClick = new Audio('sounds/Click-Sound.mp3');

function playEat() {
  sfxEat.currentTime = 0;
  sfxEat.volume = State.sfxVolume;
  sfxEat.play().catch(() => { });
}

function playDie() {
  sfxDie.currentTime = 0;
  sfxDie.volume = State.sfxVolume;
  sfxDie.play().catch(() => { });
}

function playClick() {
  sfxClick.currentTime = 0;
  sfxClick.volume = State.sfxVolume;
  sfxClick.play().catch(() => { });
}

// ─── CUSTOMIZACIÓN ───────────────────────────────────────────────────────────────────
const BACKGROUNDS = {
  galaxy: { label: 'GALAXY', file: 'images/backgrounds/Galaxia.png', overlay: 'rgba(0,0,20,0.45)' },
  snow: { label: 'SNOWY', file: 'images/backgrounds/Nieve.jpg', overlay: 'rgba(0,0,0,0.35)' },
  grass: { label: 'GRASS', file: 'images/backgrounds/Cesped.avif', overlay: 'rgba(0,0,0,0.40)' },
  desert: { label: 'DESERT', file: 'images/backgrounds/Desierto.webp', overlay: 'rgba(0,0,0,0.38)' },
  ocean: { label: 'OCEAN', file: 'images/backgrounds/Oceano.webp', overlay: 'rgba(0,0,20,0.42)' },
  lava: { label: 'LAVA', file: 'images/backgrounds/Lava.jpg', overlay: 'rgba(0,0,0,0.50)' },
  forest: { label: 'FOREST', file: 'images/backgrounds/Bosque.avif', overlay: 'rgba(0,0,0,0.45)' },
  neon: { label: 'NEON', file: 'images/backgrounds/Neon.avif', overlay: 'rgba(0,0,0,0.40)' },
};

const _bgCache = {};
function _getBgImage(key) {
  if (!_bgCache[key]) {
    const img = new Image();
    img.src = BACKGROUNDS[key].file;
    _bgCache[key] = img;
  }
  return _bgCache[key];
}
Object.keys(BACKGROUNDS).forEach(_getBgImage);

function drawBackground(ctx, W, H) {
  const bg = BACKGROUNDS[State.background] || BACKGROUNDS.galaxy;
  const img = _getBgImage(State.background);
  if (img.complete && img.naturalWidth > 0) {
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const sw = img.naturalWidth * scale;
    const sh = img.naturalHeight * scale;
    ctx.drawImage(img, (W - sw) / 2, (H - sh) / 2, sw, sh);
  } else {
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, W, H);
  }
  ctx.fillStyle = bg.overlay;
  ctx.fillRect(0, 0, W, H);
}

const SNAKE_COLORS = [
  { name: 'Verde Neón', hex: '#00ff88' },
  { name: 'Cian', hex: '#00ffff' },
  { name: 'Azul', hex: '#4488ff' },
  { name: 'Lila', hex: '#cc88ff' },
  { name: 'Rosa', hex: '#ff44aa' },
  { name: 'Rojo', hex: '#ff4444' },
  { name: 'Naranja', hex: '#ff8800' },
  { name: 'Amarillo', hex: '#ffdd00' },
  { name: 'Blanco', hex: '#ffffff' },
  { name: 'Oro', hex: '#ffd700' },
  { name: 'Menta', hex: '#44ffbb' },
  { name: 'Coral', hex: '#ff6644' },
];

const FRUITS = [
  { emoji: '🍎', name: 'APPLE' },
  { emoji: '🍊', name: 'ORANGE' },
  { emoji: '🍇', name: 'GRAPE' },
  { emoji: '🍓', name: 'STRAWBERRY' },
  { emoji: '🍍', name: 'PIE' },
  { emoji: '🍒', name: 'CHERRY' },
  { emoji: '💎', name: 'GEM' },
  { emoji: '⭐', name: 'STAR' },
  { emoji: '🌕', name: 'MOON' },
];

const GAME_MODES = [
  { id: 'slow', icon: '🐢', name: 'LENTO', desc: 'Relajado', fps: 6, badge: '' },
  { id: 'normal', icon: '🐍', name: 'NORMAL', desc: 'Estándar', fps: 10, badge: '' },
  { id: 'fast', icon: '⚡', name: 'RÁPIDO', desc: 'Desafiante', fps: 15, badge: '' },
  { id: 'extreme', icon: '💀', name: 'EXTREMO', desc: 'Brutal', fps: 22, badge: 'HOT' },
  { id: 'infinite', icon: '∞', name: 'INFINITO', desc: 'Sin muros', fps: 10, badge: '' },
];

// ─── PANTALLAS ────────────────────────────────────────────────────────────────
const screens = {
  name: document.getElementById('screen-name'),
  menu: document.getElementById('screen-menu'),
  settings: document.getElementById('screen-settings'),
  game: document.getElementById('screen-game'),
  help: document.getElementById('screen-help'),
};

function showScreen(id) {
  document.getElementById('overlay-pause').classList.remove('active');
  document.getElementById('overlay-gameover').classList.remove('active');

  Object.entries(screens).forEach(([k, el]) => {
    el.classList.toggle('hidden', k !== id);
  });

  if (id === 'game') {
    playGameMusic();
  } else {
    playMenuMusic();
  }
}

// ─── CURSOR PERSONALIZADO ─────────────────────────────────────────────────────
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ─── PANTALLA DE NOMBRE ───────────────────────────────────────────────────────
const nameInput = document.getElementById('player-name-input');
const colorPreview = document.getElementById('color-preview-name');
const btnEnter = document.getElementById('btn-enter');

nameInput.addEventListener('input', () => {
  const val = nameInput.value.toUpperCase().slice(0, 12);
  nameInput.value = val;
  colorPreview.textContent = val || 'Your nickname here';
  colorPreview.style.color = State.snakeColor;
  nameInput.style.color = State.snakeColor;
});

btnEnter.addEventListener('click', () => {
  const val = nameInput.value.trim();
  if (!val) { nameInput.style.borderColor = 'var(--accent2)'; return; }
  State.playerName = val.toUpperCase();
  playClick();
  showScreen('menu');
  renderMenuPlayer();
});

nameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') btnEnter.click();
});

// ─── MENÚ PRINCIPAL ───────────────────────────────────────────────────────────
function renderMenuPlayer() {
  const el = document.getElementById('menu-player-name');
  el.textContent = State.playerName;
  el.style.color = State.snakeColor;
  document.getElementById('menu-highscore').textContent = State.highScore;
  drawSnakePreview();
}

document.getElementById('menu-new-game').addEventListener('click', () => { playClick(); startGame(); });
document.getElementById('menu-settings').addEventListener('click', () => { playClick(); showScreen('settings'); });
document.getElementById('menu-help').addEventListener('click', () => { playClick(); showScreen('help'); });
document.getElementById('menu-change-name').addEventListener('click', () => { playClick(); showScreen('name'); });

let previewAnim = null;
function drawSnakePreview() {
  const cvs = document.getElementById('snake-preview-canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width = 180, H = cvs.height = 180;
  const cs = 12;
  const previewSnake = [[7, 7], [7, 6], [7, 5], [7, 4], [6, 4], [5, 4]];

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // puntos de rejilla
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let x = 0; x < W; x += cs)
      for (let y = 0; y < H; y += cs)
        ctx.fillRect(x + cs / 2 - 1, y + cs / 2 - 1, 2, 2);
    // fruta
    ctx.font = `${cs - 2}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(State.fruitType, 5 * cs + cs / 2, 7 * cs + cs / 2);
    // serpiente
    previewSnake.forEach(([gx, gy], i) => {
      ctx.globalAlpha = 1 - (i / previewSnake.length) * 0.5;
      ctx.fillStyle = State.snakeColor;
      ctx.shadowColor = State.snakeColor;
      ctx.shadowBlur = i === 0 ? 8 : 0;
      const pad = i === 0 ? 1 : 2;
      ctx.fillRect(gx * cs + pad, gy * cs + pad, cs - pad * 2, cs - pad * 2);
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  if (previewAnim) clearInterval(previewAnim);
  draw();
  previewAnim = setInterval(draw, 100);
}

// ─── AJUSTES ──────────────────────────────────────────────────────────────────
document.getElementById('settings-back').addEventListener('click', () => {
  playClick(); showScreen('menu'); renderMenuPlayer();
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    playClick();
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

function buildBgGrid() {
  const grid = document.getElementById('bg-grid');
  grid.innerHTML = '';
  Object.entries(BACKGROUNDS).forEach(([key, bg]) => {
    const el = document.createElement('div');
    el.className = `bg-option bg-${key}${State.background === key ? ' selected' : ''}`;
    el.innerHTML = `<span>${bg.label}</span>`;
    el.addEventListener('click', () => {
      playClick();
      State.background = key;
      grid.querySelectorAll('.bg-option').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
    });
    grid.appendChild(el);
  });
}

function buildColorGrid() {
  const grid = document.getElementById('color-grid');
  grid.innerHTML = '';
  SNAKE_COLORS.forEach(({ name, hex }) => {
    const el = document.createElement('div');
    el.className = `color-swatch${State.snakeColor === hex ? ' selected' : ''}`;
    el.style.background = hex;
    el.title = name;
    el.addEventListener('click', () => {
      playClick();
      State.snakeColor = hex;
      document.documentElement.style.setProperty('--snake-color', hex);
      document.documentElement.style.setProperty('--accent', hex);
      grid.querySelectorAll('.color-swatch').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      colorPreview.style.color = hex;
      nameInput.style.color = hex;
      drawSnakePreview();
    });
    grid.appendChild(el);
  });
}

function buildFruitGrid() {
  const grid = document.getElementById('fruit-grid');
  grid.innerHTML = '';
  FRUITS.forEach(({ emoji, name }) => {
    const el = document.createElement('div');
    el.className = `fruit-option${State.fruitType === emoji ? ' selected' : ''}`;
    el.innerHTML = `<span class="fruit-emoji">${emoji}</span><span class="fruit-name">${name}</span>`;
    el.addEventListener('click', () => {
      playClick();
      State.fruitType = emoji;
      grid.querySelectorAll('.fruit-option').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      drawSnakePreview();
    });
    grid.appendChild(el);
  });
}

let fruitCountVal = State.fruitCount;
const numDisplay = document.getElementById('fruit-count-display');
document.getElementById('fruit-count-minus').addEventListener('click', () => {
  if (fruitCountVal > 1) { fruitCountVal--; State.fruitCount = fruitCountVal; numDisplay.textContent = fruitCountVal; playClick(); }
});
document.getElementById('fruit-count-plus').addEventListener('click', () => {
  if (fruitCountVal < 10) { fruitCountVal++; State.fruitCount = fruitCountVal; numDisplay.textContent = fruitCountVal; playClick(); }
});

function buildSpeedOptions() {
  const container = document.getElementById('speed-options');
  container.innerHTML = '';
  GAME_MODES.forEach(mode => {
    const el = document.createElement('div');
    el.className = `speed-option${State.gameMode === mode.id ? ' selected' : ''}`;
    el.innerHTML = `
      ${mode.badge ? `<div class="speed-badge">${mode.badge}</div>` : ''}
      <span class="speed-icon">${mode.icon}</span>
      <span class="speed-name">${mode.name}</span>
      <span class="speed-desc">${mode.desc}</span>
    `;
    el.addEventListener('click', () => {
      playClick();
      State.gameMode = mode.id;
      container.querySelectorAll('.speed-option').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
    });
    container.appendChild(el);
  });
}

const sfxSlider = document.getElementById('sfx-volume');
const musicSlider = document.getElementById('music-volume');
const sfxValEl = document.getElementById('sfx-val');
const musicValEl = document.getElementById('music-val');

sfxSlider.addEventListener('input', () => {
  State.sfxVolume = sfxSlider.value / 100;
  sfxValEl.textContent = sfxSlider.value + '%';
  playClick();
});
musicSlider.addEventListener('input', () => {
  State.musicVolume = musicSlider.value / 100;
  musicValEl.textContent = musicSlider.value + '%';
  updateMusicVolume();
});

buildBgGrid();
buildColorGrid();
buildFruitGrid();
buildSpeedOptions();

// ─── AYUDA ────────────────────────────────────────────────────────────────────
document.getElementById('help-back').addEventListener('click', () => {
  playClick(); showScreen('menu');
});

// ─── MOTOR DEL JUEGO ──────────────────────────────────────────────────────────
const canvas = document.getElementById('game-canvas');
const gCtx = canvas.getContext('2d');
const CELL = 20;
let COLS, ROWS;
let snake, direction, nextDir, fruits, gameLoop;

function initGame() {
  const maxW = Math.min(window.innerWidth - 80, 560);
  const maxH = Math.min(window.innerHeight - 200, 560);
  COLS = Math.floor(maxW / CELL);
  ROWS = Math.floor(maxH / CELL);
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;

  snake = [
    { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
    { x: Math.floor(COLS / 2) - 1, y: Math.floor(ROWS / 2) },
    { x: Math.floor(COLS / 2) - 2, y: Math.floor(ROWS / 2) },
  ];
  direction = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  fruits = [];
  for (let i = 0; i < State.fruitCount; i++) spawnFruit();
  State.score = 0;
  updateHUD();
}

function spawnFruit() {
  let pos, tries = 0;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    tries++;
  } while (tries < 100 && (
    snake.some(s => s.x === pos.x && s.y === pos.y) ||
    fruits.some(f => f.x === pos.x && f.y === pos.y)
  ));
  fruits.push(pos);
}

function updateHUD() {
  document.getElementById('hud-score').textContent = State.score;
  document.getElementById('hud-highscore').textContent = State.highScore;
  const pl = document.getElementById('hud-player');
  pl.textContent = State.playerName;
  pl.style.color = State.snakeColor;
}

function drawGame() {
  const W = canvas.width, H = canvas.height;

  drawBackground(gCtx, W, H);

  gCtx.strokeStyle = 'rgba(255,255,255,0.03)';
  gCtx.lineWidth = 0.5;
  for (let x = 0; x <= COLS; x++) { gCtx.beginPath(); gCtx.moveTo(x * CELL, 0); gCtx.lineTo(x * CELL, H); gCtx.stroke(); }
  for (let y = 0; y <= ROWS; y++) { gCtx.beginPath(); gCtx.moveTo(0, y * CELL); gCtx.lineTo(W, y * CELL); gCtx.stroke(); }

  gCtx.font = `${CELL + 2}px sans-serif`;
  gCtx.textAlign = 'center';
  gCtx.textBaseline = 'middle';
  fruits.forEach(f => {
    gCtx.fillText(State.fruitType, f.x * CELL + CELL / 2, f.y * CELL + CELL / 2 + 1);
  });

  snake.forEach((seg, i) => {
    const isHead = i === 0;
    gCtx.globalAlpha = isHead ? 1 : Math.max(0.3, 1 - (i / snake.length) * 0.6);
    gCtx.fillStyle = State.snakeColor;
    if (isHead) { gCtx.shadowColor = State.snakeColor; gCtx.shadowBlur = 12; }
    const pad = isHead ? 1 : 2;
    const x = seg.x * CELL + pad, y = seg.y * CELL + pad, w = CELL - pad * 2, h = CELL - pad * 2;
    gCtx.beginPath();
    gCtx.roundRect(x, y, w, h, isHead ? 4 : 2);
    gCtx.fill();
    if (isHead) {
      gCtx.shadowBlur = 0;
      const ex = direction.x === 1 ? x + w - 4 : direction.x === -1 ? x + 2 : x + w / 2 - 3;
      const ey = direction.y === 1 ? y + h - 4 : direction.y === -1 ? y + 2 : y + 3;
      gCtx.fillStyle = '#000';
      gCtx.globalAlpha = 0.8;
      gCtx.beginPath(); gCtx.arc(ex, ey, 1.5, 0, Math.PI * 2); gCtx.fill();
      gCtx.beginPath(); gCtx.arc(ex + (direction.y !== 0 ? 6 : 0), ey + (direction.x !== 0 ? 6 : 0), 1.5, 0, Math.PI * 2); gCtx.fill();
    }
    gCtx.shadowBlur = 0;
    gCtx.globalAlpha = 1;
  });
}

function gameStep() {
  direction = { ...nextDir };
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (State.gameMode === 'infinite') {
    head.x = (head.x + COLS) % COLS;
    head.y = (head.y + ROWS) % ROWS;
  } else {
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { endGame(); return; }
  }

  if (snake.some(s => s.x === head.x && s.y === head.y)) { endGame(); return; }

  snake.unshift(head);

  const fruitIdx = fruits.findIndex(f => f.x === head.x && f.y === head.y);
  if (fruitIdx !== -1) {
    fruits.splice(fruitIdx, 1);
    State.score++;
    if (State.score > State.highScore) {
      State.highScore = State.score;
      localStorage.setItem('snakeHS', State.highScore);
    }
    playEat();
    updateHUD();
    spawnFruit();
  } else {
    snake.pop();
  }

  drawGame();
}

function getFPS() {
  const mode = GAME_MODES.find(m => m.id === State.gameMode);
  return mode ? mode.fps : 10;
}

function startGame() {
  initGame();
  State.paused = false;
  State.running = true;
  if (gameLoop) clearInterval(gameLoop);
  showScreen('game');
  drawGame();
  gameLoop = setInterval(gameStep, 1000 / getFPS());
}

function togglePause() {
  if (!State.running) return;
  State.paused = !State.paused;
  if (State.paused) {
    clearInterval(gameLoop);
    document.getElementById('overlay-pause').classList.add('active');
    musicGame.pause();
  } else {
    document.getElementById('overlay-pause').classList.remove('active');
    gameLoop = setInterval(gameStep, 1000 / getFPS());
    musicGame.play().catch(() => { });
  }
}

function endGame() {
  clearInterval(gameLoop);
  State.running = false;
  playDie();
  document.getElementById('gameover-score').textContent = State.score;
  document.getElementById('gameover-hs').textContent = State.highScore;
  document.getElementById('overlay-gameover').classList.add('active');
  playMenuMusic();
}

// ─── CONTROLES DE TECLADO ─────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const k = e.key;

  if ((k === 'Escape' || k === 'p' || k === 'P') && !screens.game.classList.contains('hidden')) {
    if (State.running) togglePause();
    return;
  }

  if (State.paused || !State.running) return;

  if (k === 'ArrowUp' || k === 'w' || k === 'W') { if (direction.y === 0) nextDir = { x: 0, y: -1 }; }
  if (k === 'ArrowDown' || k === 's' || k === 'S') { if (direction.y === 0) nextDir = { x: 0, y: 1 }; }
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') { if (direction.x === 0) nextDir = { x: -1, y: 0 }; }
  if (k === 'ArrowRight' || k === 'd' || k === 'D') { if (direction.x === 0) nextDir = { x: 1, y: 0 }; }
});

// ─── BOTONES DE OVERLAYS ──────────────────────────────────────────────────────
document.getElementById('pause-resume').addEventListener('click', () => { playClick(); togglePause(); });

document.getElementById('pause-menu').addEventListener('click', () => {
  playClick();
  clearInterval(gameLoop);
  State.running = false;
  showScreen('menu');
  renderMenuPlayer();
});

document.getElementById('go-restart').addEventListener('click', () => { playClick(); startGame(); });

document.getElementById('go-menu').addEventListener('click', () => {
  playClick();
  showScreen('menu');
  renderMenuPlayer();
});

// ─── ARRANQUE ─────────────────────────────────────────────────────────────────
showScreen('name');
colorPreview.textContent = 'Your nickname here';
colorPreview.style.color = State.snakeColor;
nameInput.style.color = State.snakeColor;