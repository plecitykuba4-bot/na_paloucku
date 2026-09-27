# Na paloučku

Web dřevěného domečku s vířivkou v Podkozí. Statická stránka bez buildu —
čisté HTML, CSS a ES moduly.

## Spuštění

```bash
node serve.mjs 3240
```

Vlastní server, protože `python -m http.server` pod paralelním načítáním
fotek shazoval spojení a část obrázků se nenačetla.

## Struktura

| Soubor | Role |
| --- | --- |
| `index.html` | Celá stránka; překládaný text nese `data-i18n` |
| `styles.css` | Tokeny a sazba |
| `engine.js` | Pohyb: jeden rAF ticker, pružinový solver, scroll triggery |
| `app.js` | Obsah, galerie, kalendář rezervací |
| `lang.js` | Slovníky CS / DE / EN |
| `assets/` | Fotky (WebP) a písma (Spectral, Manrope) |

## Kde se sahá do obsahu

- **Ceník** — `STAY`, `EXTRAS_PAID` a `CITY_TAX` v `app.js`
- **Fotky galerie** — `GALLERY` v `app.js`, u každé je i poměr stran
- **Překlady** — `lang.js`

## Co ještě není hotové

- Poptávka z formuláře otevírá rozepsaný e-mail, neodesílá se na server
- Německý a anglický text psala AI, chce projít rodilým mluvčím
- Chybí fotka sauny
