const rows = document.querySelectorAll('.proj-row');

// pinta a imagem do projeto num elemento; data-fit="contain" mostra a imagem inteira (ex.: cartazes verticais)
function paintImage(el, row, img) {
  const contain = row.dataset.fit === 'contain';
  el.style.backgroundImage = img ? `url('${img}')` : '';
  el.style.backgroundSize  = contain ? 'contain' : '';
  el.style.backgroundColor = contain ? (row.dataset.bg || '') : '';
}

// miniatura de cada projeto (sempre preenchida; cartazes verticais mostram o topo)
rows.forEach(row => {
  const thumb = row.querySelector('.proj-thumb-mini');
  if (!thumb || !row.dataset.img) return;
  thumb.style.backgroundImage = `url('${row.dataset.img}')`;
  if (row.dataset.fit === 'contain') thumb.style.backgroundPosition = 'center top';
});


/* hover card: só em telas com mouse (no celular o toque abre o modal direto) */

const card        = document.getElementById('projHoverCard');
const title       = document.getElementById('phcTitle');
const meta        = document.getElementById('phcMeta');
const desc        = document.getElementById('phcDesc');
const videoBadge  = document.getElementById('phcVideoBadge');
const phcImg         = card.querySelector('.phc-img');
const phcPlaceholder = card.querySelector('.phc-img-placeholder');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

const target = { x: 0, y: 0 };
const pos    = { x: 0, y: 0 };
let rafId = null;

function setTarget(e) {
  const cw = card.offsetWidth, ch = card.offsetHeight, gap = 24, margin = 12;
  let x = e.clientX + gap;
  let y = e.clientY - ch / 2;
  if (x + cw > window.innerWidth - margin) x = e.clientX - cw - gap;
  y = Math.max(margin, Math.min(y, window.innerHeight - ch - margin));
  target.x = x;
  target.y = y;
}

function render() {
  pos.x += (target.x - pos.x) * 0.22;
  pos.y += (target.y - pos.y) * 0.22;
  card.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
  rafId = card.classList.contains('visible') ? requestAnimationFrame(render) : null;
}

function showCard(row, e) {
  title.textContent = row.dataset.name  || '';
  meta.textContent  = row.dataset.meta  || '';
  desc.textContent  = row.dataset.short || '';
  const img = row.dataset.preview || row.dataset.img;
  paintImage(phcImg, row, img);
  phcPlaceholder.style.display = img ? 'none' : '';
  videoBadge.classList.toggle('show', !!row.dataset.video);
  videoBadge.textContent = row.dataset.videoLabel ? '▶ protótipo' : '▶ vídeo';

  const wasVisible = card.classList.contains('visible');
  card.classList.add('visible');
  setTarget(e);
  // aparece já no lugar certo, sem "pular" do canto da tela
  if (!wasVisible) { pos.x = target.x; pos.y = target.y; }
  if (!rafId) render();
}

function hideCard() {
  card.classList.remove('visible');
}

rows.forEach(row => {
  row.addEventListener('mouseenter', e => { if (canHover.matches) showCard(row, e); });
  row.addEventListener('mousemove',  e => { if (canHover.matches) setTarget(e); });
  row.addEventListener('mouseleave', hideCard);
});


/* modal */

const modal      = document.getElementById('projModal');
const modalClose = document.getElementById('projModalClose');
const mScroll    = document.getElementById('projModalScroll');
const mTitle     = document.getElementById('projModalTitle');
const mShort     = document.getElementById('projModalShort');
const mDesc      = document.getElementById('projModalDesc');
const mStack     = document.getElementById('projModalStack');
const mLink      = document.getElementById('projModalLink');
const mLink2     = document.getElementById('projModalLink2');
const mLink3     = document.getElementById('projModalLink3');
const mTag       = document.getElementById('projModalTag');
const mMedia     = document.getElementById('projModalMedia');
const mVideo     = document.getElementById('projModalVideo');
const mVideoTag  = document.getElementById('projModalVideoTag');
let lastRow = null;

function setLink(el, href, label, fallback) {
  el.style.display = href ? '' : 'none';
  if (href) {
    el.href = href;
    el.textContent = (label || fallback) + ' ↗';
  }
}

function openModal(row) {
  lastRow = row;
  hideCard();

  mTitle.textContent = row.dataset.name  || '';
  mShort.textContent = row.dataset.short || '';
  mTag.textContent   = row.dataset.meta  || '';

  const details = row.querySelector('.proj-details');
  mDesc.replaceChildren(details ? details.content.cloneNode(true) : '');

  mStack.replaceChildren(...(row.dataset.stack || '').split(',').filter(s => s.trim()).map(s => {
    const chip = document.createElement('span');
    chip.textContent = s.trim();
    return chip;
  }));

  setLink(mLink,  row.dataset.link,  row.dataset.label,  'Ver Projeto');
  setLink(mLink2, row.dataset.link2, row.dataset.label2, 'GitHub');
  setLink(mLink3, row.dataset.link3, row.dataset.label3, 'Ver vídeo');

  const img = row.dataset.preview || row.dataset.img;
  mMedia.classList.toggle('has-video', !!row.dataset.video);
  mMedia.classList.toggle('has-video-tag', !!row.dataset.videoLabel);
  mVideoTag.textContent = row.dataset.videoLabel || '';
  mMedia.classList.toggle('has-img', !!img);
  paintImage(mMedia, row, img);
  if (row.dataset.video) {
    if (mVideo.getAttribute('src') !== row.dataset.video) mVideo.src = row.dataset.video;
    mVideo.poster = row.dataset.poster || row.dataset.preview || '';
  } else {
    mVideo.removeAttribute('src');
    mVideo.load();
  }

  mScroll.scrollTop = 0;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose.focus({ preventScroll: true });
}

function closeModal() {
  if (!modal.classList.contains('open')) return;
  mVideo.pause();
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastRow) lastRow.focus({ preventScroll: true });
}

rows.forEach(row => {
  row.addEventListener('click', () => openModal(row));
  row.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(row);
    }
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* hero: estrela e título seguem levemente o mouse */

const hero       = document.getElementById('hero');
const heroStar   = document.getElementById('heroStar');
const heroTitle  = document.getElementById('heroTitle');
const calmMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const heroTarget = { x: 0, y: 0 };
const heroPos    = { x: 0, y: 0 };
let heroRaf = null;

function renderHero() {
  heroPos.x += (heroTarget.x - heroPos.x) * 0.08;
  heroPos.y += (heroTarget.y - heroPos.y) * 0.08;
  heroStar.style.transform  = `translate3d(${heroPos.x * 18}px, ${heroPos.y * 18}px, 0)`;
  heroTitle.style.transform = `translate3d(${heroPos.x * -8}px, ${heroPos.y * -8}px, 0)`;
  const settled = Math.abs(heroTarget.x - heroPos.x) < 0.001 && Math.abs(heroTarget.y - heroPos.y) < 0.001;
  heroRaf = settled ? null : requestAnimationFrame(renderHero);
}

hero.addEventListener('mousemove', e => {
  if (!canHover.matches || calmMotion.matches) return;
  const r = hero.getBoundingClientRect();
  heroTarget.x = (e.clientX - r.left) / r.width  - 0.5;
  heroTarget.y = (e.clientY - r.top)  / r.height - 0.5;
  if (!heroRaf) heroRaf = requestAnimationFrame(renderHero);
});

hero.addEventListener('mouseleave', () => {
  heroTarget.x = 0;
  heroTarget.y = 0;
  if (!heroRaf) heroRaf = requestAnimationFrame(renderHero);
});


/* menu fixo: aparece depois da capa e marca a seção atual */

const topnav   = document.getElementById('topnav');
const navLinks = [...topnav.querySelectorAll('.topnav-links a')];

new IntersectionObserver(([entry]) => {
  topnav.classList.toggle('show', !entry.isIntersecting);
}, { threshold: 0.25 }).observe(hero);

const secaoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('ativo', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });

navLinks.forEach(a => {
  const secao = document.querySelector(a.getAttribute('href'));
  if (secao) secaoObserver.observe(secao);
});


/* botões "Ver projeto" da Experiência: rolam até o projeto e abrem o modal */

document.querySelectorAll('[data-abrir-projeto]').forEach(btn => {
  btn.addEventListener('click', e => {
    const row = [...rows].find(r => r.dataset.name === btn.dataset.abrirProjeto);
    if (!row) return;
    e.preventDefault();
    row.scrollIntoView({ behavior: calmMotion.matches ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => openModal(row), calmMotion.matches ? 0 : 550);
  });
});
