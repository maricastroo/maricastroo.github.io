const card  = document.getElementById('projHoverCard');
const title = document.getElementById('phcTitle');
const meta  = document.getElementById('phcMeta');
const desc  = document.getElementById('phcDesc');
const link  = document.getElementById('phcLink');
const phcImg         = document.querySelector('#projHoverCard .phc-img');
const phcPlaceholder = document.querySelector('#projHoverCard .phc-img-placeholder');

document.querySelectorAll('.proj-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    title.textContent = row.dataset.name || '';
    meta.textContent  = row.dataset.meta || '';
    desc.textContent  = row.dataset.desc || '';
    link.href         = row.dataset.link || '#';
    if (row.dataset.img) {
      phcImg.style.backgroundImage    = `url('${row.dataset.img}')`;
      phcImg.style.backgroundSize     = 'cover';
      phcImg.style.backgroundPosition = 'center';
      phcPlaceholder.style.display    = 'none';
    } else {
      phcImg.style.backgroundImage = '';
      phcPlaceholder.style.display = '';
    }
    card.classList.add('visible');
  });

  row.addEventListener('mousemove', e => {
    const cw = 280, ch = 320;
    let x = e.clientX + 28;
    let y = e.clientY - ch / 2;
    if (x + cw > window.innerWidth)  x = e.clientX - cw - 20;
    if (y < 10)                       y = 10;
    if (y + ch > window.innerHeight)  y = window.innerHeight - ch - 10;
    card.style.left = x + 'px';
    card.style.top  = y + 'px';
  });

  row.addEventListener('mouseleave', () => card.classList.remove('visible'));
});

const modal      = document.getElementById('projModal');
const modalClose = document.getElementById('projModalClose');
const mTitle     = document.getElementById('projModalTitle');
const mMeta      = document.getElementById('projModalMeta');
const mDesc      = document.getElementById('projModalDesc');
const mLink      = document.getElementById('projModalLink');
const mTag       = document.getElementById('projModalTag');
const mImg       = document.getElementById('projModalImg');
const mImgSvg    = mImg.querySelector('svg');

function openModal(row) {
  mTitle.textContent = row.dataset.name || '';
  mMeta.textContent  = row.dataset.meta || '';
  mDesc.textContent  = row.dataset.desc || '';
  mTag.textContent   = row.dataset.meta || '';
  mLink.href         = row.dataset.link || '#';
  if (row.dataset.img) {
    mImg.style.backgroundImage    = `url('${row.dataset.img}')`;
    mImg.style.backgroundSize     = 'cover';
    mImg.style.backgroundPosition = 'center';
    if (mImgSvg) mImgSvg.style.display = 'none';
  } else {
    mImg.style.backgroundImage = '';
    if (mImgSvg) mImgSvg.style.display = '';
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

const mLink2 = document.getElementById('projModalLink2');
if (mLink2) {
  if (row.dataset.link2) {
    mLink2.href = row.dataset.link2;
    mLink2.style.display = '';
  } else {
    mLink2.style.display = 'none';
  }
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.proj-badge').forEach(badge => {
  badge.addEventListener('click', e => {
    e.preventDefault();
    const row = badge.closest('.proj-row');
    if (row) openModal(row);
  });
});


document.querySelectorAll('.proj-row').forEach(row => {
  if (row.dataset.img) {
    const thumb = row.querySelector('.proj-thumb-mini');
    if (thumb) {
      thumb.style.backgroundImage    = `url('${row.dataset.img}')`;
      thumb.style.backgroundSize     = 'cover';
      thumb.style.backgroundPosition = 'center';
    }
  }
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });