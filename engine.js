/**
 * MOTION ENGINE.
 *
 * Jeden rAF pro celou stránku, pružinový solver místo CSS přechodů, scroll
 * triggery čtené uvnitř toho jednoho ticku a text, který se skládá po slovech
 * nebo po písmenech. Nic z toho nejsou keyframy — každá hodnota na stránce je
 * pružina hnaná k cíli.
 *
 * Převzato z předlohy (GRIDO1 / Kimi Antonelli) a přepsáno do vanilla JS.
 */

/* ============================================================
   TICKER. Jedna smyčka, počítaná podle odběratelů.
   ============================================================ */

const subscribers = new Set();
let frame = 0;

function loop(time) {
  frame = requestAnimationFrame(loop);
  // Kopie setu: odběratel se smí odhlásit uprostřed vlastního callbacku.
  for (const entry of [...subscribers]) {
    const budget = entry.getFramerate();
    if (time - entry.last > budget) {
      entry.last = time;
      entry.callback(time);
    }
  }
}

/** Framerate 0 = každý tick. 1000/60 - 2 = 60 fps i na 120Hz panelu. */
export function subscribe(callback, getFramerate = () => 0) {
  const entry = { callback, getFramerate, last: 0 };
  subscribers.add(entry);
  if (!frame) frame = requestAnimationFrame(loop);
  return () => {
    subscribers.delete(entry);
    if (!subscribers.size && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

export const CAP_60 = 1000 / 60 - 2;
export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   PRUŽINA. Tlumený oscilátor, krokovaný po 1 ms.
   ============================================================ */

export const SPRING = {
  REVEAL: { tension: 90, friction: 26 },
  ROW: { tension: 170, friction: 24 },
  ITEM: { tension: 170, friction: 24 },
  SHEET: { tension: 190, friction: 26 },
  FIGURE: { tension: 200, friction: 24 },
  TYPE: { tension: 210, friction: 24 },
  YEAR: { tension: 190, friction: 24 },
  COPY: { tension: 110, friction: 26 },
  NAME: { tension: 190, friction: 24 },
  VEIL: { tension: 70, friction: 24 },
  CLEAR: { tension: 140, friction: 26 },
  LABEL: { tension: 110, friction: 26 },
  PROGRESS_WAIT: { tension: 10, friction: 30 },
  PROGRESS_READY: { tension: 170, friction: 26 },
  YEAR_SETTLE: { tension: 32, friction: 26 },
  TRIGGER: { tension: 140, friction: 30 },
};

export class Spring {
  constructor(value = 0, config = SPRING.REVEAL) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.config = config;
    this.precision = 0.01;
  }

  set(target) {
    this.target = target;
  }

  jump(value) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
  }

  get resting() {
    return (
      Math.abs(this.velocity) < this.precision &&
      Math.abs(this.target - this.value) < this.precision
    );
  }

  /** Vrací true, dokud se hýbe — volající podle toho ví, jestli překreslit. */
  step(deltaMs) {
    if (this.resting) {
      this.value = this.target;
      this.velocity = 0;
      return false;
    }
    // Strop 64 ms: po přepnutí záložky nesmí jeden snímek pružinu vystřelit.
    let remaining = Math.min(deltaMs, 64);
    const { tension, friction } = this.config;
    while (remaining > 0) {
      const dt = Math.min(remaining, 1) / 1000;
      remaining -= 1;
      const force = -tension * (this.value - this.target);
      const damping = -friction * this.velocity;
      this.velocity += (force + damping) * dt;
      this.value += this.velocity * dt;
    }
    return true;
  }
}

/**
 * Skupina pružin pod jedním tickem. Odhlásí se, jakmile všechny stojí, takže
 * doběhlá animace nestojí ani jeden snímek.
 */
export class SpringGroup {
  constructor(onFrame, framerate = () => 0) {
    this.springs = new Set();
    this.onFrame = onFrame;
    this.framerate = framerate;
    this.unsubscribe = null;
    this.last = 0;
  }

  add(spring) {
    this.springs.add(spring);
    return spring;
  }

  wake() {
    if (this.unsubscribe) return;
    this.last = performance.now();
    this.unsubscribe = subscribe((time) => {
      const delta = time - this.last;
      this.last = time;
      let moving = false;
      for (const spring of this.springs) {
        if (spring.step(delta)) moving = true;
      }
      this.onFrame();
      if (!moving) this.sleep();
    }, this.framerate);
  }

  sleep() {
    if (!this.unsubscribe) return;
    this.unsubscribe();
    this.unsubscribe = null;
  }
}

/* ============================================================
   SCROLL TRIGGER. Pozice elementu vůči oknu, čtená v tickeru.
   ============================================================ */

/** Devět kotev, přesně jak je má předloha. */
function poses(rect, vh) {
  return {
    top_top: rect.top,
    center_top: rect.top + rect.height / 2,
    bottom_top: rect.bottom,
    top_bottom: rect.top - vh,
    center_bottom: rect.top + rect.height / 2 - vh,
    bottom_bottom: rect.bottom - vh,
    top_center: rect.top - vh / 2,
    center_center: rect.top + rect.height / 2 - vh / 2,
    bottom_center: rect.bottom - vh / 2,
  };
}

/**
 * Čte postup elementu mezi dvěma kotvami. Počítá jen dokud je element v
 * dohledu (plus deset snímků navíc, ať doběhne odjezd) — to je pravidlo
 * "loop in view", které v předloze používá každý canvas.
 */
export function scrollTrigger(element, { start, end, onProgress, framerate = () => 10 }) {
  let inView = false;
  let grace = 0;

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView) grace = 10;
    },
    { rootMargin: '0px' },
  );
  observer.observe(element);

  const unsubscribe = subscribe(() => {
    if (!inView) {
      if (grace <= 0) return;
      grace -= 1;
    }
    const rect = element.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const p = poses(rect, vh);
    const from = p[start];
    const to = p[end];
    const length = Math.abs(from - to) || 1;
    const progress = Math.min(Math.max(0, 1 - (from + length) / length), 1);
    onProgress(progress);
  }, framerate);

  return () => {
    observer.disconnect();
    unsubscribe();
  };
}

/** Jednorázová brána: spustí se, jakmile element vjede do okna. */
export function inView(element, onEnter, rootMargin = '0% 0% -25% 0%') {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      onEnter();
    },
    { rootMargin },
  );
  observer.observe(element);
  return () => observer.disconnect();
}

/* ============================================================
   TEXT. Slova nebo písmena, každé na vlastní pružině.
   ============================================================ */

const UNIT = {
  word: { from: { opacity: 0, y: 0.35 }, to: { opacity: 1, y: 0 } },
  letter: { from: { opacity: 0, y: 0.3 }, to: { opacity: 1, y: 0 } },
};

/**
 * Rozseká text na jednotky a vrátí ovladač. Čitelná kopie zůstává pro
 * odečítače obrazovky; animované části jsou před nimi schované.
 *
 * Bez `overflow: hidden` — display leading 0.95 by uřízl dolní dotahy.
 */
export function splitText(element, { by = 'word', stagger = 110, config = SPRING.REVEAL, gap = 0.3 } = {}) {
  const source = element.textContent.trim();
  element.textContent = '';
  // inline-flex, ne flex: blokový split by odsunul sourozence (tečku za
  // nadpisem) na vlastní řádek. Písmena se navíc nesmí zalamovat — číslo
  // rozlámané na dva řádky přestane být číslo.
  element.style.display = 'inline-flex';
  element.style.flexWrap = by === 'letter' ? 'nowrap' : 'wrap';
  element.style.columnGap = `${gap}em`;
  element.style.verticalAlign = 'baseline';

  const label = document.createElement('span');
  label.className = 'sr-only';
  label.textContent = source;
  element.appendChild(label);

  const holder = document.createElement('span');
  holder.setAttribute('aria-hidden', 'true');
  holder.style.display = 'contents';
  element.appendChild(holder);

  const pieces = by === 'letter' ? [...source] : source.split(/\s+/);
  const shape = UNIT[by === 'letter' ? 'letter' : 'word'];
  const still = reducedMotion();

  const units = pieces.map((piece) => {
    const span = document.createElement('span');
    span.textContent = piece;
    span.style.display = 'inline-block';
    span.style.whiteSpace = 'pre';
    span.style.opacity = still ? '1' : String(shape.from.opacity);
    span.style.translate = still ? '0 0' : `0 ${shape.from.y}em`;
    holder.appendChild(span);
    return { span, spring: new Spring(0, config), delay: 0, elapsed: 0 };
  });

  const group = new SpringGroup(() => {
    for (const unit of units) {
      const t = unit.spring.value;
      unit.span.style.opacity = String(shape.from.opacity + (shape.to.opacity - shape.from.opacity) * t);
      unit.span.style.translate = `0 ${shape.from.y + (shape.to.y - shape.from.y) * t}em`;
    }
  });
  for (const unit of units) group.add(unit.spring);

  return {
    element,
    play(delayIn = 0) {
      if (still) return;
      units.forEach((unit, i) => {
        window.setTimeout(() => {
          unit.spring.set(1);
          group.wake();
        }, delayIn + i * stagger);
      });
    },
  };
}

/** Prostý náběh jednoho bloku: opacita a posun, jedna pružina. */
export function riseIn(element, { y = 0.75, config = SPRING.REVEAL, delayIn = 0 } = {}) {
  const still = reducedMotion();
  if (still) {
    element.style.opacity = '1';
    element.style.translate = '0 0';
    return { play() {} };
  }
  element.style.opacity = '0';
  element.style.translate = `0 ${y}rem`;
  const spring = new Spring(0, config);
  const group = new SpringGroup(() => {
    element.style.opacity = String(spring.value);
    element.style.translate = `0 ${y * (1 - spring.value)}rem`;
  });
  group.add(spring);
  return {
    play() {
      window.setTimeout(() => {
        spring.set(1);
        group.wake();
      }, delayIn);
    },
  };
}
