/**
 * Na paloučku — chování stránky.
 *
 * Pohyb jede přes vlastní motor (engine.js): jeden rAF pro celou stránku,
 * pružiny místo CSS přechodů, scroll triggery čtené v tom jednom ticku.
 */

import {
  SPRING,
  Spring,
  SpringGroup,
  inView,
  reducedMotion,
  riseIn,
  scrollTrigger,
  subscribe,
} from './engine.js';
import { LANGS, dict, initLang, onLangChange, setLang, t } from './lang.js';

const still = reducedMotion();
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
};

/* ============================================================
   OBSAH
   ============================================================ */

/* [soubor, popis, poměr stran]. Poměr je tu napsaný, ne dopočítaný z
   načteného obrázku — sazba řádků ho potřebuje hned, jinak by stránka
   při načítání poskakovala. */
/* [soubor, klíč popisu, poměr stran]. Poměr je tu napsaný, ne dopočítaný
   z načteného obrázku — sazba řádků ho potřebuje hned, jinak by stránka
   při načítání poskakovala. */
const GALLERY = [
  ['assets/img/dron-vecer.webp', 'g.drone', 1.464],
  ['assets/img/loznice-okna.webp', 'g.bedWindows', 1.482],
  ['assets/img/koupelna-sprcha.webp', 'g.shower', 0.769],
  ['assets/img/obyvak-radio.webp', 'g.living', 1.437],
  ['assets/img/virivka-kone.webp', 'g.tubHorses', 0.808],
  ['assets/img/terasa-kos.webp', 'g.basket', 0.8],
  ['assets/img/virivka-zapad.webp', 'g.tubSunset', 1.493],
  ['assets/img/koupelna-umyvadlo.webp', 'g.sink', 0.764],
  ['assets/img/kamna.webp', 'g.stove', 0.79],
  ['assets/img/interier-schody.webp', 'g.stairs', 1.369],
  ['assets/img/loznice.webp', 'g.bedroom', 1.49],
  ['assets/img/dron-shora.webp', 'g.droneDay', 1.495],
];

const FEAT = [
  ['assets/img/virivka-zapad.webp', 'feat.tub', 'feat.tubNote', 'wide'],
  ['assets/img/kamna.webp', 'feat.stove', 'feat.stoveNote', 'tall'],
  ['assets/img/terasa-kos.webp', 'feat.breakfast', 'feat.breakfastNote', 'tall'],
  ['assets/img/loznice-okna.webp', 'feat.sleep', 'feat.sleepNote', 'wide'],
];

/* Zbytek. Patří sem, protože to pobyt doplňuje, ne prodává. */
const EXTRAS = [
  ['x.sauna', 'x.saunaNote'],
  ['x.kitchen', 'x.kitchenNote'],
  ['x.terrace', 'x.terraceNote'],
  ['x.bath', 'x.bathNote'],
  ['x.fire', 'x.fireNote'],
  ['x.restaurant', 'x.restaurantNote'],
  ['x.trails', 'x.trailsNote'],
  ['x.vouchers', 'x.vouchersNote'],
];

/**
 * Ceník. Skutečná čísla z ceníku majitele, v korunách.
 *
 * Neúčtuje se po nocích ani po sezónách: cena je za celou délku pobytu
 * a s každou další nocí roste pomaleji. Proto tabulka, ne násobení.
 */
const STAY = { 1: 3900, 2: 6500, 3: 9000, 4: 10500, 5: 11500 };

/** Nejdelší pobyt, na který ceník cenu dává. Delší se domlouvá. */
const MAX_NIGHTS = 5;

const EXTRAS_PAID = [
  ['sauna', 'paid.sauna', 'paid.saunaNote', 1400, 'once'],
  ['virivka', 'paid.tub', 'paid.tubNote', 700, 'night'],
  ['snidane', 'paid.breakfast', 'paid.breakfastNote', 250, 'person'],
];

/** Místní poplatek z pobytu, za každý započatý den na osobu. */
const CITY_TAX = 20;

const CURRENCY = 'CZK';

/* ============================================================
   DATUM
   ============================================================ */

const MONTHS = () => dict().months;
const DOW = () => dict().dow;

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a, b) => a && b && iso(a) === iso(b);

const human = (d) =>
  `${d.getDate()}. ${MONTHS()[d.getMonth()]} ${d.getFullYear()}`;

const money = (n) =>
  new Intl.NumberFormat(dict().locale, { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 }).format(n);

/** Čeština má tři tvary, ne dva: 1 noc, 2 noci, 5 nocí. */
const nociStr = (n) => dict().nights(n);

/* ============================================================
   HERO. Fotka se po načtení sama přiblíží a doklouže do klidu,
   při scrollu se vrací zpět — dva pohyby na jedné hodnotě.
   ============================================================ */

function mountHero() {
  const img = $('[data-hero-img]');
  const hero = $('.hero');
  if (!img || !hero || still) return;

  // Dýchání ve smyčce: scale jde 1.0 -> 1.09 -> 1.0 pořád dokola. Sinus
  // místo pružiny proto, že pružina má cíl a jednou dojede; tohle nemá.
  const PERIOD = 19000;
  const DEPTH = 0.09;
  let scrolled = 0;
  let visible = true;
  let grace = 0;

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) grace = 12;
  }).observe(hero);

  subscribe((time) => {
    if (!visible) {
      if (grace <= 0) return;
      grace -= 1;
    }
    // (1 - cos) / 2 jde hladce z 0 do 1 a zpět, bez zlomu na obrátce.
    const wave = (1 - Math.cos((time / PERIOD) * Math.PI * 2)) / 2;
    const scale = 1 + DEPTH * wave - scrolled * 0.03;
    // Samotné přibližování působí mrtvě. Předloha k němu přidává pomalý
    // úhlopříčný posun — teprve tím to začne dýchat.
    const dx = -1.5 * wave;
    const dy = -1 * wave - scrolled * 2.6;
    img.style.transform = `scale(${scale}) translate3d(${dx}%, ${dy}%, 0)`;
  }, () => 0);

  scrollTrigger(hero, {
    start: 'top_top',
    end: 'bottom_top',
    onProgress: (p) => {
      scrolled = p;
    },
  });
}

/**
 * Prach nad loukou. Čtrnáct teček, každá s vlastní velikostí, dráhou,
 * délkou i zpožděním — pravidelná mřížka by se prozradila na první pohled.
 * Sype je JS, protože náhoda patří sem, ne do dvaceti řádků CSS tříd.
 */
function mountDust() {
  const box = $('[data-dust]');
  if (!box || still) return;
  const rnd = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < 14; i += 1) {
    const dot = document.createElement('i');
    const size = rnd(2, 5);
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${rnd(2, 98)}%`;
    dot.style.setProperty('--drift', `${rnd(-60, 60)}px`);
    dot.style.animationDuration = `${rnd(11, 19)}s`;
    // Záporné zpoždění: část teček je na obloze hned, ne až za deset vteřin.
    dot.style.animationDelay = `${rnd(-18, 2)}s`;
    dot.style.opacity = String(rnd(0.35, 0.8));
    box.appendChild(dot);
  }
}

/** Hlavička ztmavne, jakmile hero odjede. */
function mountTop() {
  const top = $('[data-top]');
  const hero = $('.hero');
  if (!top || !hero) return;
  const sync = () => {
    top.dataset.solid = String(window.scrollY > hero.offsetHeight * 0.72);
  };
  sync();
  window.addEventListener('scroll', sync, { passive: true });
}


/**
 * Pomalý posun obrazu uvnitř dlaždic. Jeden scroll trigger na celou sekci,
 * ne jeden na každý obrázek — dvacet triggerů by četlo dvacet rectů
 * v každém ticku. Sekce zapíše --drift, dlaždice si ho přečtou v CSS.
 */
function mountDrift() {
  if (still) return;
  for (const sel of ['#galerie', '#vybaveni']) {
    const section = $(sel);
    if (!section) continue;
    scrollTrigger(section, {
      start: 'top_bottom',
      end: 'bottom_top',
      onProgress: (p) => {
        section.style.setProperty('--drift', `${(0.5 - p) * 34}px`);
      },
    });
  }
}

/** Nástup bloků: co má data-rise, počká a pustí se v okně. */
/**
 * Pozorovatel má spodní okraj stažený o 12 %, aby se bloky nespouštěly
 * hned u kraje obrazovky. Jenže co při startu leží v tom pásu pod hranicí,
 * by se nespustilo nikdy a zůstalo by neviditelné — proto se to pustí rovnou.
 */
function revealOnce(node, play) {
  const r = node.getBoundingClientRect();
  if (r.top < window.innerHeight && r.bottom > 0) play();
  else inView(node, play, '0% 0% -12% 0%');
}

function mountReveals() {
  for (const node of $$('[data-rise]')) {
    const rise = riseIn(node, { y: 1.1, config: SPRING.REVEAL });
    revealOnce(node, () => rise.play());
  }
  for (const group of $$('[data-stagger]')) {
    [...group.children].forEach((child, i) => {
      const rise = riseIn(child, { y: 0.9, config: SPRING.ITEM, delayIn: i * 90 });
      inView(group, () => rise.play(), '0% 0% -10% 0%');
    });
  }
  const shot = $('[data-parallax]');
  if (shot && !still) {
    scrollTrigger(shot, {
      start: 'top_bottom',
      end: 'bottom_top',
      onProgress: (p) => {
        shot.style.transform = `scale(1.08) translate3d(0, ${(0.5 - p) * 40}px, 0)`;
      },
    });
  }
}

/* ============================================================
   GALERIE A LIGHTBOX
   ============================================================ */

/* Háčky na překreslení sekcí, které si drží vlastní stav. Přepínač jazyka
   je zavolá; mimo něj se jich nikdo nedotýká. */
let renderGallery = () => {};
let redrawBooking = () => {};

function mountGallery() {
  const grid = $('[data-gallery]');
  const box = $('[data-lb]');
  if (!grid || !box) return;

  // Obrázek lightboxu vzniká až při prvním otevření — <img> bez src
  // visící v DOM je rozbitý obrázek, i když ho nikdo nevidí.
  const shot = el('img');
  shot.decoding = 'async';
  const count = $('[data-lb-count]', box);
  let index = 0;

  const items = GALLERY.map(([src, altKey, ratio], i) => {
    const alt = t(altKey);
    const item = el('button', 'gallery__item');
    item.type = 'button';
    item.setAttribute('aria-label', `${t('lb.zoom')}: ${alt}`);
    const img = el('img');
    img.src = src;
    img.alt = alt;
    img.loading = i < 4 ? 'eager' : 'lazy';
    img.decoding = 'async';
    item.appendChild(img);
    item.addEventListener('click', () => open(i));
    return { item, ratio };
  });

  /**
   * Rozdělí fotky do řádků a každému dopočítá výšku tak, aby řádek zabral
   * přesně šířku kontejneru. Bere se cílová výška; jakmile by řádek při ní
   * přetekl, uzavře se a výška se dopočítá zpětně.
   */
  const layout = () => {
    const width = grid.clientWidth;
    if (!width) return;
    const gap = parseFloat(getComputedStyle(grid).getPropertyValue('--gap')) || 14;
    // Na úzké obrazovce se do řádku vejdou nanejvýš dvě fotky.
    const target = width < 560 ? width * 0.62 : width < 1000 ? 240 : 290;

    grid.textContent = '';
    let row = [];
    let sum = 0;

    const flush = (last) => {
      if (!row.length) return;
      const free = width - gap * (row.length - 1);
      // Poslední řádek se neroztahuje na sílu — jinak by pár fotek
      // vyrostlo přes celou obrazovku.
      let h = free / sum;
      if (last && h > target * 1.35) h = target;
      const el_row = el('div', 'gallery__row');
      for (const r of row) {
        r.item.style.width = `${r.ratio * h}px`;
        r.item.style.height = `${h}px`;
        el_row.appendChild(r.item);
      }
      grid.appendChild(el_row);
      row = [];
      sum = 0;
    };

    for (const r of items) {
      row.push(r);
      sum += r.ratio;
      if (sum * target >= width - gap * (row.length - 1)) flush(false);
    }
    flush(true);
  };

  layout();
  new ResizeObserver(layout).observe(grid);

  renderGallery = () => {
    for (const { item, ratio } of items) {
      const i = items.findIndex((x) => x.item === item);
      item.setAttribute('aria-label', `${t('lb.zoom')}: ${t(GALLERY[i][1])}`);
      item.querySelector('img').alt = t(GALLERY[i][1]);
      void ratio;
    }
    layout();
  };

  for (const { item } of items) {
    const rise = riseIn(item, { y: 1, config: SPRING.ITEM });
    revealOnce(item, () => rise.play());
  }

  function show(i) {
    index = (i + GALLERY.length) % GALLERY.length;
    const [src, altKey] = GALLERY[index];
    const alt = t(altKey);
    if (!shot.isConnected) box.insertBefore(shot, box.querySelector('.lb__bar'));
    shot.src = src;
    shot.alt = alt;
    count.textContent = `${index + 1} / ${GALLERY.length}`;
  }

  function open(i) {
    show(i);
    box.hidden = false;
    requestAnimationFrame(() => {
      box.dataset.open = 'true';
      $('[data-lb-close]', box).focus();
    });
    document.documentElement.style.overflow = 'hidden';
  }

  function close() {
    box.dataset.open = 'false';
    document.documentElement.style.overflow = '';
    window.setTimeout(() => {
      box.hidden = true;
    }, 350);
  }

  $('[data-lb-close]', box).addEventListener('click', close);
  $('[data-lb-prev]', box).addEventListener('click', () => show(index - 1));
  $('[data-lb-next]', box).addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (e) => {
    if (e.target === box) close();
  });
  window.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
}

function mountKit() {
  const feat = $('[data-feat]');
  const extras = $('[data-extras]');
  if (!feat || !extras) return;

  feat.textContent = '';
  extras.textContent = '';
  FEAT.forEach(([src, nameKey, noteKey, shape], i) => {
    const name = t(nameKey);
    const note = t(noteKey);
    const item = el('figure', `feat__item feat__item--${shape}`);
    const img = el('img');
    img.src = src;
    img.alt = name;
    img.loading = 'lazy';
    img.decoding = 'async';
    const cap = el('figcaption', 'feat__cap');
    cap.append(el('b', null, name), el('span', null, note));
    item.append(img, cap);
    feat.appendChild(item);
    const rise = riseIn(item, { y: 1, config: SPRING.ITEM, delayIn: i * 90 });
    revealOnce(item, () => rise.play());
  });

  EXTRAS.forEach(([nameKey, noteKey], i) => {
    const name = t(nameKey);
    const note = t(noteKey);
    const row = el('div', 'extras__row');
    row.append(el('dt', null, name), el('dd', null, note));
    extras.appendChild(row);
    const rise = riseIn(row, { y: 0.7, config: SPRING.ITEM, delayIn: (i % 4) * 60 });
    revealOnce(row, () => rise.play());
  });
}


/** Ceník jako tabulka — stejná data, ze kterých počítá rezervace. */
function mountPrice() {
  const stay = $('[data-price-stay]');
  const extra = $('[data-price-extra]');
  if (!stay || !extra) return;

  const row = (name, note, price) => {
    const r = el('div', 'price__row');
    const dt = el('dt', null, name);
    if (note) dt.appendChild(el('small', null, note));
    r.append(dt, el('dd', null, money(price)));
    return r;
  };

  stay.textContent = '';
  extra.textContent = '';
  for (const [n, price] of Object.entries(STAY)) {
    stay.appendChild(row(`${n} ${nociStr(Number(n))}`, null, price));
  }
  for (const [, label, note, price] of EXTRAS_PAID) {
    extra.appendChild(row(t(label), t(note), price));
  }
  extra.appendChild(row(t('price.tax'), t('price.taxNote'), CITY_TAX));

  for (const r of [...stay.children, ...extra.children]) {
    const rise = riseIn(r, { y: 0.7, config: SPRING.ITEM });
    revealOnce(r, () => rise.play());
  }
}

/* ============================================================
   REZERVACE
   ============================================================ */

function mountBooking() {
  const wrap = $('[data-cal]');
  if (!wrap) return;

  const today = midnight(new Date());
  let cursor = new Date(today.getFullYear(), today.getMonth(), 1);
  let from = null;
  let to = null;
  let hover = null;
  const picked = new Set();

  const label = $('[data-cal-label]');
  const sumFrom = $('[data-sum-from]');
  const sumTo = $('[data-sum-to]');
  const body = $('[data-sum-body]');
  const form = $('[data-form]');

  /** Noci v rozsahu, seskupené po sezónách. */
  function nights(a, b) {
    const out = [];
    for (let d = new Date(a); d < b; d = addDays(d, 1)) out.push(new Date(d));
    return out;
  }

  /**
   * Rozpis ceny. Základ je z tabulky podle počtu nocí; příplatky se počítají
   * každý jinak (jednorázově, za den, za osobu a noc) a poplatek z pobytu
   * jde za každou započatou noc a osobu.
   */
  function breakdown() {
    if (!from || !to) return null;
    const count = nights(from, to).length;
    const guests = Number($('[data-guests]')?.value || 2);
    const base = STAY[count] ?? null;

    const rows = [];
    if (base !== null) rows.push({ label: `${t('book.stayRow')} ${count} ${nociStr(count)}`, sum: base });

    for (const [id, label, note, price, per] of EXTRAS_PAID) {
      if (!picked.has(id)) continue;
      // 'once' = jednou za pobyt, 'night' = za každou noc,
      // 'person' = za každou osobu (ne za osobu a noc — snídaně se platí
      // jednou na hlavu, ne každé ráno zvlášť).
      const qty = per === 'once' ? 1 : per === 'night' ? count : guests;
      rows.push({
        label: qty > 1 ? `${t(label)} · ${qty} × ${money(price)}` : t(label),
        sum: price * qty,
        qty,
      });
    }

    const tax = CITY_TAX * count * guests;
    rows.push({ label: `${t('book.taxRow')} (${count} × ${guests} ${t('book.persons')})`, sum: tax });

    const total = base === null ? null : rows.reduce((a, r) => a + r.sum, 0);
    return { rows, total, count, guests, overLimit: base === null };
  }

  function renderMonth(base) {
    const box = el('div');
    box.appendChild(el('p', 'cal__name', `${MONTHS()[base.getMonth()]} ${base.getFullYear()}`));

    const dow = el('div', 'cal__dow');
    for (const d of DOW()) dow.appendChild(el('span', null, d));
    box.appendChild(dow);

    const grid = el('div', 'cal__grid');
    // Pondělí jako první den týdne: JS má neděli 0, proto ten posun.
    const lead = (new Date(base.getFullYear(), base.getMonth(), 1).getDay() + 6) % 7;
    for (let i = 0; i < lead; i += 1) grid.appendChild(el('div', 'cal__cell'));

    const days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    for (let n = 1; n <= days; n += 1) {
      const date = new Date(base.getFullYear(), base.getMonth(), n);
      const cell = el('div', 'cal__cell');
      const past = date < today;

      const edgeStart = sameDay(date, from);
      const end = to ?? (from && hover && hover > from ? hover : null);
      const edgeEnd = sameDay(date, end);
      const inside = from && end && date > from && date < end;

      if (edgeStart && edgeEnd) cell.dataset.edge = 'both';
      else if (edgeStart) cell.dataset.edge = 'start';
      else if (edgeEnd) cell.dataset.edge = 'end';
      if (inside) cell.dataset.in = 'true';

      const btn = el('button', 'cal__day', String(n));
      btn.type = 'button';
      if (past) btn.disabled = true;
      btn.setAttribute('aria-label', human(date));

      btn.addEventListener('click', () => pick(date));
      btn.addEventListener('mouseenter', () => {
        if (!from || to) return;
        // Bez téhle pojistky se kalendář zacyklí: draw() vymění tlačítka,
        // pod kurzorem vznikne nové, to znovu vyvolá mouseenter a tak pořád.
        // Překresluje se jen při skutečné změně dne.
        if (hover && sameDay(hover, date)) return;
        hover = date;
        draw();
      });

      cell.appendChild(btn);
      grid.appendChild(cell);
    }

    box.appendChild(grid);
    return box;
  }

  function pick(date) {
    if (!from || (from && to)) {
      from = date;
      to = null;
      hover = null;
    } else if (date <= from) {
      // Klepnutí před příjezdem se bere jako nový začátek, ne jako chyba.
      from = date;
    } else {
      to = date;
      hover = null;
    }
    draw();
  }

  function draw() {
    wrap.textContent = '';
    wrap.appendChild(renderMonth(cursor));
    wrap.appendChild(renderMonth(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)));

    label.textContent = from && !to ? t('book.pickOut') : from && to ? t('book.picked') : t('book.pickIn');
    sumFrom.textContent = from ? human(from) : '—';
    sumTo.textContent = to ? human(to) : '—';

    const data = breakdown();
    body.textContent = '';

    if (!data) {
      body.appendChild(
        el('p', 'sum__empty', t('book.empty')),
      );
      form.hidden = true;
      return;
    }

    // Příplatky jako přepínače — ať je vidět, co cenu zvedá, ještě než se odešle.
    const opts = el('div', 'sum__opts');
    for (const [id, label, note, price] of EXTRAS_PAID) {
      const row = el('label', 'sum__opt');
      const cb = el('input');
      cb.type = 'checkbox';
      cb.checked = picked.has(id);
      cb.addEventListener('change', () => {
        if (cb.checked) picked.add(id);
        else picked.delete(id);
        draw();
      });
      const txt = el('span');
      txt.append(el('b', null, t(label)), el('i', null, ` ${t(note)}`));
      row.append(cb, txt, el('em', null, money(price)));
      opts.appendChild(row);
    }
    body.appendChild(opts);

    const rows = el('div', 'sum__rows');
    for (const r of data.rows) {
      const row = el('div', 'sum__row');
      row.append(el('span', null, r.label), el('b', null, money(r.sum)));
      rows.appendChild(row);
    }
    body.appendChild(rows);

    const total = el('div', 'sum__total');
    if (data.overLimit) {
      total.append(
        el('span', null, `${data.count} ${nociStr(data.count)}`),
        el('b', null, t('book.onRequest')),
      );
      body.appendChild(total);
      body.appendChild(
        el(
          'p',
          'sum__note',
          t('book.overLimit', { n: MAX_NIGHTS }),
        ),
      );
    } else {
      total.append(el('span', null, t('book.total')), el('b', null, money(data.total)));
      body.appendChild(total);
    }

    form.hidden = false;
  }

  $('[data-cal-prev]').addEventListener('click', () => {
    const back = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
    // Zpátky jen do aktuálního měsíce; minulé termíny se rezervovat nedají.
    if (back < new Date(today.getFullYear(), today.getMonth(), 1)) return;
    cursor = back;
    draw();
  });
  $('[data-cal-next]').addEventListener('click', () => {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    draw();
  });

  // Počet osob mění poplatek i snídaně, takže se souhrn musí přepočítat.
  $('[data-guests]').addEventListener('change', draw);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = breakdown();
    if (!data) return;
    const subject = `${t('book.mailSubject')} ${human(from)} – ${human(to)}`;
    const lines = [
      `${t('book.mailTerm')}: ${human(from)} – ${human(to)} (${data.count} ${nociStr(data.count)})`,
      `${t('book.mailGuests')}: ${data.guests}`,
      ...data.rows.map((r) => `${r.label}: ${money(r.sum)}`),
      `${t('book.mailTotal')}: ${data.overLimit ? t('book.onRequest') : money(data.total)}`,
      '',
      `${t('book.mailName')}: ${form.jmeno.value}`,
      `${t('contact.email')}: ${form.email.value}`,
      form.zprava.value ? `${t('book.mailNote')}: ${form.zprava.value}` : '',
    ].filter(Boolean);

    window.location.href =
      `mailto:paloucekpodkozi@gmail.com?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(lines.join('\n'))}`;

    const note = el('p', 'form__msg', t('book.mailOpened'));
    form.appendChild(note);
    window.setTimeout(() => note.remove(), 6000);
  });

  redrawBooking = draw;
  draw();
}


/**
 * Přepínač jazyka. Jezdec se posouvá pod aktivní tlačítko, takže se měří
 * až po layoutu; při změně šířky se přeměří.
 */
function mountLangs() {
  const box = $('.langs');
  const pill = $('[data-lang-pill]');
  if (!box || !pill) return;

  // Jeden jazyk = není co přepínat. Tlačítka zůstávají v HTML, jen se
  // neukazují, takže zapnutí dalšího jazyka nevyžaduje sahat do sazby.
  if (LANGS.length < 2) {
    box.remove();
    return;
  }

  for (const btn of [...box.querySelectorAll('[data-lang-btn]')]) {
    if (!LANGS.includes(btn.dataset.langBtn)) btn.remove();
  }

  const place = () => {
    const on = box.querySelector('[aria-pressed="true"]');
    if (!on) return;
    pill.style.width = `${on.offsetWidth}px`;
    pill.style.transform = `translateX(${on.offsetLeft - 3}px)`;
  };

  for (const btn of box.querySelectorAll('[data-lang-btn]')) {
    btn.addEventListener('click', () => setLang(btn.dataset.langBtn));
  }

  onLangChange(() => {
    place();
    // Sekce vyráběné skriptem se překreslí; statický text řeší slovník sám.
    mountKit();
    mountPrice();
    renderGallery();
    redrawBooking();
  });

  place();
  new ResizeObserver(place).observe(box);
}

/* ============================================================ */

initLang();
mountHero();
mountDust();
mountTop();
mountReveals();
mountDrift();
mountGallery();
mountKit();
mountPrice();
mountBooking();
mountLangs();
