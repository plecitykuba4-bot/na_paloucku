/**
 * Tři jazyky.
 *
 * Statický text nese `data-i18n` v HTML, text vyráběný skriptem se bere
 * přes `t()`. Volba se pamatuje a přepíná se bez načtení stránky —
 * dynamické sekce se překreslí, ne přepíšou přes sebe.
 */

const DICT = {
  cs: {
    'meta.title': 'Na paloučku — dřevěný domeček s vířivkou, Podkozí',
    'meta.desc':
      'Útulný dřevěný domeček až pro 4 osoby s venkovní vířivkou a privátní saunou. Podkozí u Křivoklátska, kousek od Berounky.',
    'a11y.skip': 'Přeskočit na obsah',
    'a11y.nav': 'Hlavní',
    'a11y.lang': 'Jazyk',

    'nav.about': 'O domečku',
    'nav.gallery': 'Galerie',
    'nav.kit': 'Vybavení',
    'nav.price': 'Ceník',
    'nav.book': 'Rezervace',
    'nav.contact': 'Kontakt',
    'nav.cta': 'Rezervovat',

    'hero.sub':
      'Dřevěný domeček pro čtyři uprostřed louky. Vířivka pod hvězdami, privátní sauna a ohniště na zahradě.',
    'hero.book': 'Rezervovat pobyt',
    'hero.gallery': 'Prohlédnout galerii',

    'about.eyebrow': 'O domečku',
    'about.title': 'Malý dům, velká louka',
    'about.p1':
      'Na paloučku je útulný dřevěný domeček až pro čtyři osoby s venkovní vířivkou a možností pronajmutí privátní sauny. Uvnitř kamna na dřevo, spaní v podkroví a okna do luk.',
    'about.p2':
      'V blízkosti najdete rodinnou restauraci Srub Podkozí. Na zahradě je ohniště a k dostání jsou dárkové poukazy.',
    'about.p3':
      'Jsme na dosah od CHKO Křivoklátsko a povodí Berounky, s turistickými i cyklistickými trasami hned za plotem.',

    'gallery.eyebrow': 'Galerie',
    'gallery.title': 'Jak to u nás vypadá',

    'kit.eyebrow': 'Vybavení',
    'kit.title': 'Co v domečku najdete',
    'kit.more': 'A k tomu',

    'price.eyebrow': 'Ceník',
    'price.title': 'Kolik to stojí',
    'price.stay': 'Pobyt',
    'price.extras': 'Příplatky',
    'price.deposit': 'Při rezervaci je nutné zaplatit zálohu.',
    'price.tax': 'Místní poplatek z pobytu',
    'price.taxNote': 'Za každý započatý den na osobu',

    'book.eyebrow': 'Rezervace',
    'book.title': 'Vyberte termín',
    'book.lede':
      'Klepnutím vyberte příjezd a odjezd. Cena se spočítá podle délky pobytu, hned jak rozsah označíte.',
    'book.pickIn': 'Vyberte příjezd',
    'book.pickOut': 'Vyberte odjezd',
    'book.picked': 'Termín vybrán',
    'book.prev': 'Předchozí měsíc',
    'book.next': 'Další měsíc',
    'book.from': 'Příjezd',
    'book.to': 'Odjezd',
    'book.empty': 'Vyberte příjezd a odjezd. Cena se dopočítá podle délky pobytu.',
    'book.stayRow': 'Pobyt',
    'book.taxRow': 'Poplatek z pobytu',
    'book.total': 'Celkem',
    'book.onRequest': 'Na dotaz',
    'book.overLimit':
      'Ceník uvádí cenu do {n} nocí. Delší pobyt rádi naceníme individuálně.',
    'book.depositNote': 'Při rezervaci se platí záloha.',
    'book.name': 'Jméno',
    'book.namePh': 'Jana Nováková',
    'book.guests': 'Osob',
    'book.email': 'E-mail',
    'book.emailPh': 'jana@email.cz',
    'book.note': 'Poznámka',
    'book.notePh': 'Sauna, pozdní příjezd, cokoliv…',
    'book.send': 'Odeslat poptávku',
    'book.disclaimer':
      'Odesláním se termín nerezervuje závazně. Ozveme se s potvrzením a konečnou cenou.',
    'book.mailOpened': 'Otevřeli jsme vám rozepsaný e-mail. Stačí odeslat.',
    'book.mailSubject': 'Poptávka pobytu',
    'book.mailTerm': 'Termín',
    'book.mailGuests': 'Osob',
    'book.mailTotal': 'Celkem',
    'book.mailName': 'Jméno',
    'book.mailNote': 'Poznámka',
    'book.persons': 'os.',

    'contact.eyebrow': 'Kontakt',
    'contact.title': 'Kde nás najdete',
    'contact.address': 'Adresa',
    'contact.phone': 'Telefon',
    'contact.email': 'E-mail',
    'contact.account': 'Číslo účtu',
    'contact.map': 'Mapa — Podkozí 398',

    'lb.title': 'Galerie',
    'lb.close': 'Zavřít galerii',
    'lb.prev': 'Předchozí fotka',
    'lb.next': 'Další fotka',
    'lb.zoom': 'Zvětšit',

    'foot.rights': '© 2026 Na paloučku',

    'feat.tub': 'Venkovní vířivka',
    'feat.tubNote': 'Na dřevo, večer i v zimě',
    'feat.stove': 'Kamna na dřevo',
    'feat.stoveNote': 'Dřevo je připravené',
    'feat.breakfast': 'Snídaně do postele',
    'feat.breakfastNote': 'Za příplatek, 250 Kč za osobu',
    'feat.sleep': 'Spaní pro čtyři',
    'feat.sleepNote': 'Ložnice a podkroví',

    'x.sauna': 'Privátní sauna',
    'x.saunaNote': 'Na objednání',
    'x.kitchen': 'Kuchyňský kout',
    'x.kitchenNote': 'Vaření, lednice, konvice',
    'x.terrace': 'Terasa s posezením',
    'x.terraceNote': 'Stůl a židle, výhled do luk',
    'x.bath': 'Koupelna',
    'x.bathNote': 'Sprchový kout, ručníky',
    'x.fire': 'Zahradní ohniště',
    'x.fireNote': 'Posezení pod širým nebem',
    'x.restaurant': 'Restaurace Srub Podkozí',
    'x.restaurantNote': 'Rodinná, kousek pěšky',
    'x.trails': 'Turistika a cyklo',
    'x.trailsNote': 'Trasy začínají za plotem',
    'x.vouchers': 'Dárkové poukazy',
    'x.vouchersNote': 'Na pobyt i na wellness',

    'paid.sauna': 'Privátní sauna',
    'paid.saunaNote': '2 hodiny',
    'paid.tub': 'Venkovní vířivka',
    'paid.tubNote': 'za den',
    'paid.breakfast': 'Snídaně',
    'paid.breakfastNote': 'za osobu a noc',

    'g.drone': 'Domeček z ptačí perspektivy za soumraku, vedle vířivka a ohniště',
    'g.bedWindows': 'Postel v rohu se dvěma velkými okny do luk',
    'g.shower': 'Koupelna se sprchovým koutem a dřevěnou podlahou',
    'g.living': 'Obývací kout s pohovkou a retro rádiem',
    'g.tubHorses': 'Vířivka na dřevěné terase, za plotem se pasou koně',
    'g.basket': 'Snídaňový koš a lucerny u vstupu na terasu',
    'g.tubSunset': 'Vířivka a ohniště na zahradě při západu slunce',
    'g.sink': 'Umyvadlo na dřevěné desce se zrcadlem',
    'g.stove': 'Litinová kamna na dřevo s košem polen',
    'g.stairs': 'Interiér s otevřeným krovem a schody do podkroví',
    'g.bedroom': 'Ložnice s dvojlůžkem, pohovkou a oknem do zahrady',
    'g.droneDay': 'Pohled shora na domeček, terasu a zahradu',
    'hero.alt': 'Dřevěný domeček Na paloučku s terasou, za plotem louka a stromy',

    months: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],
    dow: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
    /** 1 noc, 2 noci, 5 nocí — čeština má tři tvary. */
    nights: (n) => (n === 1 ? 'noc' : n < 5 ? 'noci' : 'nocí'),
    locale: 'cs-CZ',
  },

  de: {
    'meta.title': 'Na paloučku — Holzhaus mit Whirlpool, Podkozí',
    'meta.desc':
      'Gemütliches Holzhaus für bis zu 4 Personen mit Außen-Whirlpool und privater Sauna. Podkozí bei Křivoklátsko, unweit der Berounka.',
    'a11y.skip': 'Zum Inhalt springen',
    'a11y.nav': 'Hauptmenü',
    'a11y.lang': 'Sprache',

    'nav.about': 'Das Haus',
    'nav.gallery': 'Galerie',
    'nav.kit': 'Ausstattung',
    'nav.price': 'Preise',
    'nav.book': 'Buchung',
    'nav.contact': 'Kontakt',
    'nav.cta': 'Buchen',

    'hero.sub':
      'Ein Holzhaus für vier mitten auf der Wiese. Whirlpool unter Sternen, private Sauna und Feuerstelle im Garten.',
    'hero.book': 'Aufenthalt buchen',
    'hero.gallery': 'Galerie ansehen',

    'about.eyebrow': 'Das Haus',
    'about.title': 'Kleines Haus, große Wiese',
    'about.p1':
      'Na paloučku ist ein gemütliches Holzhaus für bis zu vier Personen mit Außen-Whirlpool und der Möglichkeit, eine private Sauna zu mieten. Drinnen ein Holzofen, Schlafplatz unter dem Dach und Fenster zur Wiese.',
    'about.p2':
      'In der Nähe finden Sie das Familienrestaurant Srub Podkozí. Im Garten gibt es eine Feuerstelle, Geschenkgutscheine sind erhältlich.',
    'about.p3':
      'Wir liegen nah am Landschaftsschutzgebiet Křivoklátsko und am Fluss Berounka, Wander- und Radwege beginnen direkt hinter dem Zaun.',

    'gallery.eyebrow': 'Galerie',
    'gallery.title': 'So sieht es bei uns aus',

    'kit.eyebrow': 'Ausstattung',
    'kit.title': 'Was Sie im Haus finden',
    'kit.more': 'Und dazu',

    'price.eyebrow': 'Preise',
    'price.title': 'Was es kostet',
    'price.stay': 'Aufenthalt',
    'price.extras': 'Zusatzleistungen',
    'price.deposit': 'Bei der Buchung ist eine Anzahlung zu leisten.',
    'price.tax': 'Kurtaxe',
    'price.taxNote': 'Pro angefangenen Tag und Person',

    'book.eyebrow': 'Buchung',
    'book.title': 'Termin wählen',
    'book.lede':
      'Wählen Sie An- und Abreise per Klick. Der Preis richtet sich nach der Dauer und wird sofort berechnet.',
    'book.pickIn': 'Anreise wählen',
    'book.pickOut': 'Abreise wählen',
    'book.picked': 'Termin gewählt',
    'book.prev': 'Voriger Monat',
    'book.next': 'Nächster Monat',
    'book.from': 'Anreise',
    'book.to': 'Abreise',
    'book.empty': 'Wählen Sie An- und Abreise. Der Preis wird nach der Dauer berechnet.',
    'book.stayRow': 'Aufenthalt',
    'book.taxRow': 'Kurtaxe',
    'book.total': 'Gesamt',
    'book.onRequest': 'Auf Anfrage',
    'book.overLimit':
      'Die Preisliste reicht bis {n} Nächte. Längere Aufenthalte kalkulieren wir gerne individuell.',
    'book.depositNote': 'Bei der Buchung wird eine Anzahlung fällig.',
    'book.name': 'Name',
    'book.namePh': 'Anna Müller',
    'book.guests': 'Personen',
    'book.email': 'E-Mail',
    'book.emailPh': 'anna@email.de',
    'book.note': 'Anmerkung',
    'book.notePh': 'Sauna, späte Anreise, was auch immer…',
    'book.send': 'Anfrage senden',
    'book.disclaimer':
      'Mit dem Absenden ist der Termin noch nicht verbindlich gebucht. Wir melden uns mit Bestätigung und Endpreis.',
    'book.mailOpened': 'Wir haben eine vorbereitete E-Mail geöffnet. Nur noch absenden.',
    'book.mailSubject': 'Anfrage Aufenthalt',
    'book.mailTerm': 'Termin',
    'book.mailGuests': 'Personen',
    'book.mailTotal': 'Gesamt',
    'book.mailName': 'Name',
    'book.mailNote': 'Anmerkung',
    'book.persons': 'Pers.',

    'contact.eyebrow': 'Kontakt',
    'contact.title': 'So finden Sie uns',
    'contact.address': 'Adresse',
    'contact.phone': 'Telefon',
    'contact.email': 'E-Mail',
    'contact.account': 'Kontonummer',
    'contact.map': 'Karte — Podkozí 398',

    'lb.title': 'Galerie',
    'lb.close': 'Galerie schließen',
    'lb.prev': 'Voriges Foto',
    'lb.next': 'Nächstes Foto',
    'lb.zoom': 'Vergrößern',

    'foot.rights': '© 2026 Na paloučku',

    'feat.tub': 'Außen-Whirlpool',
    'feat.tubNote': 'Holzbefeuert, auch abends und im Winter',
    'feat.stove': 'Holzofen',
    'feat.stoveNote': 'Holz liegt bereit',
    'feat.breakfast': 'Frühstück ans Bett',
    'feat.breakfastNote': 'Gegen Aufpreis, 250 Kč pro Person',
    'feat.sleep': 'Platz für vier',
    'feat.sleepNote': 'Schlafzimmer und Dachboden',

    'x.sauna': 'Private Sauna',
    'x.saunaNote': 'Auf Bestellung',
    'x.kitchen': 'Küchenzeile',
    'x.kitchenNote': 'Kochen, Kühlschrank, Wasserkocher',
    'x.terrace': 'Terrasse mit Sitzplatz',
    'x.terraceNote': 'Tisch und Stühle, Blick über die Wiesen',
    'x.bath': 'Badezimmer',
    'x.bathNote': 'Dusche, Handtücher',
    'x.fire': 'Feuerstelle im Garten',
    'x.fireNote': 'Sitzen unter freiem Himmel',
    'x.restaurant': 'Restaurant Srub Podkozí',
    'x.restaurantNote': 'Familiär, wenige Schritte entfernt',
    'x.trails': 'Wandern und Radfahren',
    'x.trailsNote': 'Wege beginnen hinter dem Zaun',
    'x.vouchers': 'Geschenkgutscheine',
    'x.vouchersNote': 'Für Aufenthalt und Wellness',

    'paid.sauna': 'Private Sauna',
    'paid.saunaNote': '2 Stunden',
    'paid.tub': 'Außen-Whirlpool',
    'paid.tubNote': 'pro Tag',
    'paid.breakfast': 'Frühstück',
    'paid.breakfastNote': 'pro Person und Nacht',

    'g.drone': 'Das Haus aus der Vogelperspektive in der Dämmerung, daneben Whirlpool und Feuerstelle',
    'g.bedWindows': 'Bett in der Ecke mit zwei großen Fenstern zur Wiese',
    'g.shower': 'Badezimmer mit Dusche und Holzboden',
    'g.living': 'Sitzecke mit Sofa und Retro-Radio',
    'g.tubHorses': 'Whirlpool auf der Holzterrasse, dahinter grasen Pferde',
    'g.basket': 'Frühstückskorb und Laternen am Eingang zur Terrasse',
    'g.tubSunset': 'Whirlpool und Feuerstelle im Garten bei Sonnenuntergang',
    'g.sink': 'Waschbecken auf Holzplatte mit Spiegel',
    'g.stove': 'Gusseiserner Holzofen mit Holzkorb',
    'g.stairs': 'Innenraum mit offenem Dachstuhl und Treppe zum Dachboden',
    'g.bedroom': 'Schlafzimmer mit Doppelbett, Sofa und Fenster zum Garten',
    'g.droneDay': 'Blick von oben auf Haus, Terrasse und Garten',
    'hero.alt': 'Holzhaus Na paloučku mit Terrasse, dahinter Wiese und Bäume',

    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    dow: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    nights: (n) => (n === 1 ? 'Nacht' : 'Nächte'),
    locale: 'de-DE',
  },

  en: {
    'meta.title': 'Na paloučku — wooden cabin with a hot tub, Podkozí',
    'meta.desc':
      'A snug wooden cabin for up to 4 guests with an outdoor hot tub and a private sauna. Podkozí near Křivoklátsko, a short way from the Berounka.',
    'a11y.skip': 'Skip to content',
    'a11y.nav': 'Main',
    'a11y.lang': 'Language',

    'nav.about': 'The cabin',
    'nav.gallery': 'Gallery',
    'nav.kit': 'What is inside',
    'nav.price': 'Prices',
    'nav.book': 'Booking',
    'nav.contact': 'Contact',
    'nav.cta': 'Book',

    'hero.sub':
      'A wooden cabin for four in the middle of a meadow. A hot tub under the stars, a private sauna and a fire pit in the garden.',
    'hero.book': 'Book a stay',
    'hero.gallery': 'See the gallery',

    'about.eyebrow': 'The cabin',
    'about.title': 'Small house, big meadow',
    'about.p1':
      'Na paloučku is a snug wooden cabin for up to four guests with an outdoor hot tub and the option of renting a private sauna. Inside there is a wood stove, a sleeping loft and windows onto the meadow.',
    'about.p2':
      'The family restaurant Srub Podkozí is nearby. There is a fire pit in the garden, and gift vouchers are available.',
    'about.p3':
      'We are close to the Křivoklátsko protected landscape and the Berounka river, with walking and cycling routes starting right behind the fence.',

    'gallery.eyebrow': 'Gallery',
    'gallery.title': 'What it looks like',

    'kit.eyebrow': 'What is inside',
    'kit.title': 'What you will find here',
    'kit.more': 'And also',

    'price.eyebrow': 'Prices',
    'price.title': 'What it costs',
    'price.stay': 'Stay',
    'price.extras': 'Extras',
    'price.deposit': 'A deposit is required when booking.',
    'price.tax': 'Local tourist tax',
    'price.taxNote': 'Per started day and person',

    'book.eyebrow': 'Booking',
    'book.title': 'Pick your dates',
    'book.lede':
      'Click to pick arrival and departure. The price is based on the length of the stay and is worked out straight away.',
    'book.pickIn': 'Pick arrival',
    'book.pickOut': 'Pick departure',
    'book.picked': 'Dates selected',
    'book.prev': 'Previous month',
    'book.next': 'Next month',
    'book.from': 'Arrival',
    'book.to': 'Departure',
    'book.empty': 'Pick arrival and departure. The price is based on the length of the stay.',
    'book.stayRow': 'Stay',
    'book.taxRow': 'Tourist tax',
    'book.total': 'Total',
    'book.onRequest': 'On request',
    'book.overLimit':
      'The price list covers up to {n} nights. We are happy to quote longer stays individually.',
    'book.depositNote': 'A deposit is payable at booking.',
    'book.name': 'Name',
    'book.namePh': 'Anna Smith',
    'book.guests': 'Guests',
    'book.email': 'Email',
    'book.emailPh': 'anna@email.com',
    'book.note': 'Note',
    'book.notePh': 'Sauna, late arrival, anything…',
    'book.send': 'Send enquiry',
    'book.disclaimer':
      'Sending this does not book the dates firmly. We will get back to you with a confirmation and the final price.',
    'book.mailOpened': 'We have opened a prepared email for you. Just send it.',
    'book.mailSubject': 'Stay enquiry',
    'book.mailTerm': 'Dates',
    'book.mailGuests': 'Guests',
    'book.mailTotal': 'Total',
    'book.mailName': 'Name',
    'book.mailNote': 'Note',
    'book.persons': 'ppl',

    'contact.eyebrow': 'Contact',
    'contact.title': 'Where to find us',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.account': 'Bank account',
    'contact.map': 'Map — Podkozí 398',

    'lb.title': 'Gallery',
    'lb.close': 'Close gallery',
    'lb.prev': 'Previous photo',
    'lb.next': 'Next photo',
    'lb.zoom': 'Enlarge',

    'foot.rights': '© 2026 Na paloučku',

    'feat.tub': 'Outdoor hot tub',
    'feat.tubNote': 'Wood-fired, evenings and winter too',
    'feat.stove': 'Wood stove',
    'feat.stoveNote': 'Firewood is ready',
    'feat.breakfast': 'Breakfast in bed',
    'feat.breakfastNote': 'Extra, 250 Kč per person',
    'feat.sleep': 'Sleeps four',
    'feat.sleepNote': 'Bedroom and loft',

    'x.sauna': 'Private sauna',
    'x.saunaNote': 'On request',
    'x.kitchen': 'Kitchenette',
    'x.kitchenNote': 'Hob, fridge, kettle',
    'x.terrace': 'Terrace with seating',
    'x.terraceNote': 'Table and chairs, view over the meadow',
    'x.bath': 'Bathroom',
    'x.bathNote': 'Shower, towels',
    'x.fire': 'Garden fire pit',
    'x.fireNote': 'Sitting out under the sky',
    'x.restaurant': 'Srub Podkozí restaurant',
    'x.restaurantNote': 'Family-run, a short walk',
    'x.trails': 'Walking and cycling',
    'x.trailsNote': 'Routes start behind the fence',
    'x.vouchers': 'Gift vouchers',
    'x.vouchersNote': 'For stays and wellness',

    'paid.sauna': 'Private sauna',
    'paid.saunaNote': '2 hours',
    'paid.tub': 'Outdoor hot tub',
    'paid.tubNote': 'per day',
    'paid.breakfast': 'Breakfast',
    'paid.breakfastNote': 'per person and night',

    'g.drone': 'The cabin from above at dusk, with the hot tub and fire pit beside it',
    'g.bedWindows': 'A bed in the corner with two large windows onto the meadow',
    'g.shower': 'Bathroom with a shower and a wooden floor',
    'g.living': 'Sitting corner with a sofa and a retro radio',
    'g.tubHorses': 'Hot tub on the wooden deck, horses grazing beyond the fence',
    'g.basket': 'Breakfast hamper and lanterns at the terrace door',
    'g.tubSunset': 'Hot tub and fire pit in the garden at sunset',
    'g.sink': 'Basin on a wooden top with a mirror',
    'g.stove': 'Cast-iron wood stove with a basket of logs',
    'g.stairs': 'Interior with an open roof truss and stairs to the loft',
    'g.bedroom': 'Bedroom with a double bed, a sofa and a window onto the garden',
    'g.droneDay': 'View from above of the cabin, deck and garden',
    'hero.alt': 'The wooden cabin Na paloučku with its deck, meadow and trees beyond the fence',

    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dow: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    nights: (n) => (n === 1 ? 'night' : 'nights'),
    locale: 'en-GB',
  },
};

export const LANGS = ['cs', 'de', 'en'];

let current = 'cs';
const listeners = new Set();

export const lang = () => current;
export const dict = () => DICT[current];

/** Klíč, případně s doplněním {n}. Chybějící klíč vrátí sám sebe, ať je vidět. */
export function t(key, vars) {
  const raw = DICT[current][key] ?? DICT.cs[key] ?? key;
  if (!vars) return raw;
  return String(raw).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

export const onLangChange = (fn) => listeners.add(fn);

export function setLang(next, { silent = false } = {}) {
  if (!LANGS.includes(next)) return;
  current = next;
  document.documentElement.lang = next;
  try {
    localStorage.setItem('paloucek-lang', next);
  } catch {
    /* soukromé okno: volba prostě nepřežije načtení, nic víc */
  }

  document.title = t('meta.title');
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = t('meta.desc');

  for (const node of document.querySelectorAll('[data-i18n]')) {
    node.textContent = t(node.dataset.i18n);
  }
  // Atributy se píšou jako "aria-label:klíč, placeholder:jiný".
  for (const node of document.querySelectorAll('[data-i18n-attr]')) {
    for (const pair of node.dataset.i18nAttr.split(',')) {
      const [attr, key] = pair.split(':').map((x) => x.trim());
      if (attr && key) node.setAttribute(attr, t(key));
    }
  }

  for (const el of document.querySelectorAll('[data-lang-btn]')) {
    el.setAttribute('aria-pressed', String(el.dataset.langBtn === next));
  }

  if (!silent) for (const fn of listeners) fn(next);
}

/** Uložená volba, jinak jazyk prohlížeče, jinak čeština. */
export function initLang() {
  let saved = null;
  try {
    saved = localStorage.getItem('paloucek-lang');
  } catch {
    /* viz výše */
  }
  const guess = (navigator.language || 'cs').slice(0, 2).toLowerCase();
  setLang(LANGS.includes(saved) ? saved : LANGS.includes(guess) ? guess : 'cs', { silent: true });
}
