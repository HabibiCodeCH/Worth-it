/*
 * Détecte les prix sur les pages web et affiche leur équivalent en heures
 * de travail au survol. Trois stratégies de détection, dans l'ordre :
 *   1. Schema.org [itemprop="price"] et attributs data-price
 *   2. Montants avec symbole devise dans le texte ($, CHF, €, £…)
 *   3. Format prix nu sur pages shopping (ex. "50.-" "89.90" "1'234.50")
 */

// ---------------------------------------------------------------------------
// Magnitudes
// ---------------------------------------------------------------------------
const MAGNITUDES = {
  trillion: 1e12, tn: 1e12,
  billion:  1e9,  bn: 1e9,  b: 1e9,
  million:  1e6,  m:  1e6,
  k:        1e3,
};

// ---------------------------------------------------------------------------
// Currency regex definitions (for symbol-prefixed amounts)
// ---------------------------------------------------------------------------
const CURRENCY_DEFS = {
  USD: {
    re: /(?:US\$|\$|USD\s*)(\d[\d,.]*)(?:\s*(?:billion|trillion|million|bn|tn|[BMTKk]))?(?:\s+(?:billion|trillion|million))?(?:\s*dollars?)?/gi,
    parse(raw) {
      const m = raw.match(/(?:US\$|\$|USD\s*)(\d[\d,.]*)(?:\s*(billion|trillion|million|bn|tn|[BMTKk]))?(?:\s+(billion|trillion|million))?/i);
      if (!m) return null;
      const num = parseFloat(m[1].replace(/,/g, ''));
      const suffix = ((m[3] || m[2]) ?? '').toLowerCase();
      return isNaN(num) || num <= 0 ? null : num * (MAGNITUDES[suffix] ?? 1);
    },
  },
  CHF: {
    // Prefix: "CHF 89.90"  "Fr. 1'234.50"  "CHF 89.–"
    // Suffix: "7 200 CHF"  "1'234.50 CHF"  (European luxury/CH format)
    re: /(?:(?:CHF|Fr\.?)\s*\d{1,3}(?:[\s'.]\d{3})*(?:[.,]\d{1,2})?(?:[.,][-–])?|\d{1,3}(?:[\s']\d{3})*(?:[.,]\d{1,2})?\s*(?:CHF|Fr\.?))/gi,
    parse(raw) {
      const n = raw
        .replace(/(?:CHF|Fr\.?)/gi, '')  // strip currency symbol
        .replace(/'/g, '')               // apostrophe thousands: 1'234 → 1234
        .replace(/(\d) (?=\d)/g, '$1')  // space thousands: 7 200 → 7200
        .replace(/[.,][-–]$/, '')        // Swiss dash: 50.- → 50
        .trim()
        .replace(',', '.');              // comma decimal: 89,90 → 89.90
      const num = parseFloat(n);
      return isNaN(num) || num <= 0 ? null : num;
    },
  },
  EUR: {
    re: /(?:€|EUR\s*)(\d[\d,.]*)(?:\s*(?:billion|million|[BMKk]))?/gi,
    parse(raw) {
      const n = raw.replace(/^(?:€|EUR\s*)/i, '').replace(/[.,](\d{3})/g, '$1').replace(',', '.');
      const num = parseFloat(n);
      return isNaN(num) || num <= 0 ? null : num;
    },
  },
  GBP: {
    re: /(?:£|GBP\s*)(\d[\d,.]*)(?:\s*(?:billion|million|[BMKk]))?/gi,
    parse(raw) {
      const n = raw.replace(/^(?:£|GBP\s*)/i, '').replace(/,/g, '');
      const num = parseFloat(n);
      return isNaN(num) || num <= 0 ? null : num;
    },
  },
  // Scandinavian crowns — "kr" suffix, space or dot as thousands separator
  SEK: {
    re: /\d{1,3}(?:[\s.]\d{3})*(?:[.,]\d{2})?\s*(?:kr|SEK)/gi,
    parse(raw) {
      const n = raw.replace(/(?:kr|SEK)/gi, '').replace(/\./g, '').replace(/\s/g, '').replace(',', '.').trim();
      const num = parseFloat(n);
      return isNaN(num) || num <= 0 ? null : num;
    },
  },
  NOK: {
    re: /\d{1,3}(?:[\s.]\d{3})*(?:[.,]\d{2})?\s*(?:kr|NOK)/gi,
    parse(raw) {
      const n = raw.replace(/(?:kr|NOK)/gi, '').replace(/\./g, '').replace(/\s/g, '').replace(',', '.').trim();
      const num = parseFloat(n);
      return isNaN(num) || num <= 0 ? null : num;
    },
  },
  DKK: {
    re: /\d{1,3}(?:[\s.]\d{3})*(?:[.,]\d{2})?\s*(?:kr\.?|DKK)/gi,
    parse(raw) {
      const n = raw.replace(/(?:kr\.?|DKK)/gi, '').replace(/\./g, '').replace(/\s/g, '').replace(',', '.').trim();
      const num = parseFloat(n);
      return isNaN(num) || num <= 0 ? null : num;
    },
  },
  // Hungarian Forint — "Ft" suffix, typically no decimals
  HUF: {
    re: /\d{1,3}(?:[\s.]\d{3})*(?:[.,]\d{1,2})?\s*(?:Ft|HUF)/gi,
    parse(raw) {
      const n = raw.replace(/(?:Ft|HUF)/gi, '').replace(/\./g, '').replace(/\s/g, '').replace(',', '.').trim();
      const num = parseFloat(n);
      return isNaN(num) || num <= 0 ? null : num;
    },
  },
  // Canadian & Australian dollars — explicit prefix to avoid ambiguity with USD $
  CAD: {
    re: /(?:CA\$|C\$|CAD\s*)\d[\d,.]*/gi,
    parse(raw) {
      const n = raw.replace(/(?:CA\$|C\$|CAD\s*)/i, '').replace(/,/g, '');
      const num = parseFloat(n);
      return isNaN(num) || num <= 0 ? null : num;
    },
  },
  AUD: {
    re: /(?:AU\$|A\$|AUD\s*)\d[\d,.]*/gi,
    parse(raw) {
      const n = raw.replace(/(?:AU\$|A\$|AUD\s*)/i, '').replace(/,/g, '');
      const num = parseFloat(n);
      return isNaN(num) || num <= 0 ? null : num;
    },
  },
};

// ---------------------------------------------------------------------------
// Bare price parsing (no currency symbol)
// Used for Schema.org content attrs and bare text prices on shopping pages.
// ---------------------------------------------------------------------------
function parseBarePrice(raw) {
  // Remove currency words/symbols, keep digits, separators
  const cleaned = String(raw)
    .replace(/[€$£]/g, '')
    .replace(/\b(?:CHF|USD|EUR|GBP|Fr\.?)\b/gi, '')
    .trim()
    // Swiss/FR apostrophe thousands: 1'234 → 1234
    .replace(/'/g, '')
    // German/CH dot-thousands: 1.234,50 → 1234.50
    .replace(/\.(\d{3})(?=[.,])/g, '$1')
    // Swiss dash for .00: 50.– or 50.- → 50
    .replace(/[.,][-–]$/, '')
    // Comma decimal: 89,90 → 89.90
    .replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) || num <= 0 ? null : num;
}

// Regex for bare "price-looking" numbers on shopping pages.
// Matches: 50.- 50.– 89.90 1'234.50 1234.50 but avoids short integers like "50"
// The trailing [.,][-–] (Swiss dash) or [.,]\d{2} (decimal) makes it specific enough.
// Negative lookahead: skip if followed by a physical unit so we don't
// annotate capacities (4.50 l), dimensions (24.00 cm), weights, etc.
// Currency codes (CHF, EUR, USD…) are intentionally absent from this list.
const BARE_PRICE_RE = /\b(\d{1,3}(?:['.]\d{3})*|\d+)(?:[.,]\d{2}|[.,][-–])(?!\s*(?:cl|dl|ml|litres?|liters?|kwh?|wh?|lbs?|oz|cm|mm|km|mg|kg|hz|rpm|°[cf]?|%|\/|l(?=\s|$)|g(?=\s|$)|m(?=\s|$)|w(?=\s|$)|v(?=\s|$)|x\s*\d))/gi;

// ---------------------------------------------------------------------------
// i18n — time unit labels per language
// ---------------------------------------------------------------------------
// Each entry: [min, h, day, week, month, year] — short badge abbreviations
const LANG_SHORT = {
  fr: ['min','h','j','sem','mois','ans'],
  en: ['min','h','d','wk','mo','yr'],
  de: ['Min','h','T','Wo','Mo','J'],
  it: ['min','h','g','sett','mese','anni'],
  es: ['min','h','d','sem','mes','años'],
  pt: ['min','h','d','sem','mês','anos'],
  nl: ['min','h','d','wk','mnd','jr'],
  sv: ['min','h','d','v','mån','år'],
  no: ['min','h','d','u','mnd','år'],
  nb: ['min','h','d','u','mnd','år'],
  da: ['min','h','d','u','mnd','år'],
  fi: ['min','h','pv','vk','kk','v'],
  pl: ['min','h','d','tyg','mies','rok'],
  cs: ['min','h','d','týd','měs','rok'],
  ro: ['min','h','z','săpt','lun','ani'],
  hu: ['perc','h','nap','hét','hó','év'],
  tr: ['dak','h','gün','hf','ay','yıl'],
};

// Each entry: [day_s, day_p, week_s, week_p, month_s, month_p, year_s, year_p, sfx_work, sfx_life]
const LANG_LONG = {
  fr: [['jour','jours'],['semaine','semaines'],['mois','mois'],['an','ans'],'de travail','de ta vie'],
  en: [['day','days'],['week','weeks'],['month','months'],['year','years'],'of work','of your life'],
  de: [['Tag','Tage'],['Woche','Wochen'],['Monat','Monate'],['Jahr','Jahre'],'Arbeit','deines Lebens'],
  it: [['giorno','giorni'],['settimana','settimane'],['mese','mesi'],['anno','anni'],'di lavoro','della tua vita'],
  es: [['día','días'],['semana','semanas'],['mes','meses'],['año','años'],'de trabajo','de tu vida'],
  pt: [['dia','dias'],['semana','semanas'],['mês','meses'],['ano','anos'],'de trabalho','da tua vida'],
  nl: [['dag','dagen'],['week','weken'],['maand','maanden'],['jaar','jaar'],'werk','van je leven'],
  sv: [['dag','dagar'],['vecka','veckor'],['månad','månader'],['år','år'],'arbete','av ditt liv'],
  no: [['dag','dager'],['uke','uker'],['måned','måneder'],['år','år'],'arbeid','av livet ditt'],
  nb: [['dag','dager'],['uke','uker'],['måned','måneder'],['år','år'],'arbeid','av livet ditt'],
  da: [['dag','dage'],['uge','uger'],['måned','måneder'],['år','år'],'arbejde','af dit liv'],
  fi: [['päivä','päivää'],['viikko','viikkoa'],['kuukausi','kuukautta'],['vuosi','vuotta'],'työtä','elämästäsi'],
  pl: [['dzień','dni'],['tydzień','tygodnie'],['miesiąc','miesięcy'],['rok','lat'],'pracy','twojego życia'],
  cs: [['den','dny'],['týden','týdny'],['měsíc','měsíce'],['rok','roky'],'práce','tvého života'],
  ro: [['zi','zile'],['săptămână','săptămâni'],['lună','luni'],['an','ani'],'de muncă','din viața ta'],
  hu: [['nap','nap'],['hét','hét'],['hónap','hónap'],['év','év'],'munkaidő','az életedből'],
  tr: [['gün','gün'],['hafta','hafta'],['ay','ay'],['yıl','yıl'],'iş','hayatından'],
};

function getLang() {
  const code = (navigator.languages?.[0] || navigator.language || 'en')
    .toLowerCase().slice(0, 2);
  return code in LANG_SHORT ? code : 'en';
}

// Modal strings (checkout interception)
const MODAL_STRINGS = {
  fr: { about: "Tu t'apprêtes à dépenser",    question: "Ça vaut vraiment le coup ?",  confirm: "Oui, continuer →", cancel: "← Attends..." },
  en: { about: "You're about to spend",        question: "Worth it?",                   confirm: "Yes, continue →",  cancel: "← Let me think" },
  de: { about: "Du gibst gleich aus",          question: "Wirklich sicher?",            confirm: "Ja, weiter →",     cancel: "← Überlegen..." },
  it: { about: "Stai per spendere",            question: "Ne vale la pena?",            confirm: "Sì, continua →",   cancel: "← Aspetta..." },
  es: { about: "Estás a punto de gastar",      question: "¿Vale la pena?",             confirm: "Sí, continuar →",  cancel: "← Espera..." },
  pt: { about: "Estás prestes a gastar",       question: "Vale a pena?",               confirm: "Sim, continuar →", cancel: "← Espera..." },
  nl: { about: "Je staat op het punt te kopen",question: "Is het het waard?",           confirm: "Ja, doorgaan →",   cancel: "← Wachten..." },
  sv: { about: "Du är på väg att spendera",    question: "Är det värt det?",            confirm: "Ja, fortsätt →",   cancel: "← Vänta..." },
  no: { about: "Du er i ferd med å bruke",     question: "Er det verdt det?",           confirm: "Ja, fortsett →",   cancel: "← Vent..." },
  da: { about: "Du er ved at bruge",           question: "Er det det værd?",            confirm: "Ja, fortsæt →",    cancel: "← Vent..." },
  fi: { about: "Olet aikeissa kuluttaa",       question: "Onko se sen arvoista?",       confirm: "Kyllä, jatka →",   cancel: "← Odota..." },
  pl: { about: "Zamierzasz wydać",             question: "Czy warto?",                  confirm: "Tak, kontynuuj →", cancel: "← Poczekaj..." },
  cs: { about: "Chystáš se utratit",           question: "Stojí to za to?",             confirm: "Ano, pokračovat →",cancel: "← Počkej..." },
  ro: { about: "Ești pe cale să cheltuiești",  question: "Merită?",                    confirm: "Da, continuă →",   cancel: "← Stai..." },
  hu: { about: "Hamarosan elköltsz",           question: "Megéri?",                    confirm: "Igen, folytatás →",cancel: "← Várj..." },
  tr: { about: "Harcamak üzeresin",            question: "Değer mi?",                  confirm: "Evet, devam →",    cancel: "← Dur..." },
};
MODAL_STRINGS.nb = MODAL_STRINGS.no;

function ms(key) {
  return (MODAL_STRINGS[getLang()] || MODAL_STRINGS.en)[key];
}

// ---------------------------------------------------------------------------
// Time formatting
// ---------------------------------------------------------------------------
function formatHours(hours) {
  const lang = getLang();
  const L = LANG_LONG[lang] || LANG_LONG.en;
  const [dayU, weekU, moU, yearU, sfxWork, sfxLife] = L;
  const pl = n => n >= 2 ? 1 : 0;
  if (hours < 1/60) return `< 1 min ${sfxLife}`;
  if (hours < 1)  return `≈ ${Math.round(hours*60)} min ${sfxLife}`;
  if (hours < 8)  return `≈ ${+hours.toPrecision(2)} h ${sfxWork}`;
  if (hours < 40)  { const d = +(hours/8).toPrecision(2);  return `≈ ${d} ${dayU[pl(d)]} ${sfxWork}`; }
  if (hours < 160) { const w = +(hours/40).toPrecision(2); return `≈ ${w} ${weekU[pl(w)]} ${sfxWork}`; }
  if (hours < 1920){ const mo = +(hours/160).toPrecision(2); return `≈ ${mo} ${moU[pl(mo)]} ${sfxWork}`; }
  const y = +(hours/1920).toPrecision(2);
  return `≈ ${y} ${yearU[pl(y)]} ${sfxLife}`;
}

function formatShort(hours) {
  const L = LANG_SHORT[getLang()] || LANG_SHORT.en;
  const [min, h, d, w, mo, y] = L;
  if (hours < 1)    return `≈ ${Math.round(hours*60)}${min}`;
  if (hours < 8)    return `≈ ${+hours.toPrecision(2)}${h}`;
  if (hours < 40)   return `≈ ${+(hours/8).toPrecision(2)}${d}`;
  if (hours < 160)  return `≈ ${+(hours/40).toPrecision(2)}${w}`;
  if (hours < 1920) return `≈ ${+(hours/160).toPrecision(2)}${mo}`;
  return `≈ ${+(hours/1920).toPrecision(2)}${y}`;
}

// ---------------------------------------------------------------------------
// Multilingual shopping detection
// ---------------------------------------------------------------------------

// Keywords that appear in URLs of checkout / cart pages.
const CHECKOUT_URL_TERMS = [
  // EN
  'checkout','cart','basket','order','payment','pay','purchase',
  // FR
  'panier','commande','caisse','paiement','valider',
  // DE
  'warenkorb','einkaufswagen','bestellung','kasse','zahlung','kaufabschluss',
  // ES
  'carrito','cesta','pedido','pago','compra',
  // IT
  'carrello','ordine','pagamento','cassa','acquisto',
  // NL
  'winkelwagen','bestelling','betaling','kassa','afrekenen',
  // PT
  'carrinho','pedido','pagamento','finalizar',
  // SV
  'varukorg','betalning','kassa','betalningssida',
  // NO
  'handlevogn','handlekurv','betaling','kasse',
  // DA
  'indkobskurv','betaling','kasse',
  // FI
  'ostoskori','maksaminen','kassa',
  // PL
  'koszyk','zamowienie','platnosc','kasa',
  // RO
  'cos','comanda','plata','finalizare',
  // HU
  'kosar','rendeles','fizetes','penztar',
  // CS
  'kosik','objednavka','platba','pokladna',
  // TR
  'sepet','siparis','odeme','kasa',
];
const CHECKOUT_URL_RE = new RegExp(CHECKOUT_URL_TERMS.join('|'), 'i');

// Button / CTA text that signals an add-to-cart action across European languages.
const CART_BTN_TERMS = [
  // EN
  'add to cart','add to bag','add to basket','add to trolley','buy now','purchase',
  // FR
  'ajouter au panier','ajouter au sac','acheter','commander','ajouter',
  // DE
  'in den warenkorb','in den einkaufswagen','jetzt kaufen','kaufen','bestellen','zum warenkorb',
  // ES
  'añadir al carrito','agregar al carrito','añadir a la cesta','comprar ahora','comprar',
  // IT
  'aggiungi al carrello','aggiungi alla borsa','acquista ora','acquista','compra ora',
  // PT
  'adicionar ao carrinho','adicionar ao cesto','comprar agora','comprar',
  // NL
  'in winkelwagen','in de winkelwagen','toevoegen aan winkelwagen','nu kopen','kopen',
  // PL
  'dodaj do koszyka','kup teraz','kupuję',
  // SV
  'lägg i varukorgen','lägg i varukorg','köp nu','köp',
  // NO
  'legg i handlekurv','legg i handlevogn','kjøp nå','kjøp',
  // DA
  'læg i kurv','læg i indkøbskurv','køb nu','køb',
  // FI
  'lisää ostoskoriin','lisää koriin','osta nyt','osta',
  // TR
  'sepete ekle','sepete at','satın al',
  // RO
  'adaugă în coș','adaugă în coș','cumpără',
  // HU
  'kosárba','kosárba teszem','vásárlás','megveszem',
  // CS
  'přidat do košíku','koupit','objednat',
  // EL
  'προσθήκη στο καλάθι','αγορά',
];
// Escape for regex, longest terms first to avoid partial-match priority issues.
const CART_BTN_RE = new RegExp(
  CART_BTN_TERMS
    .sort((a, b) => b.length - a.length)
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|'),
  'i'
);

// Final payment / confirm-order buttons — more specific than add-to-cart.
// Used to intercept the checkout confirmation step.
const CONFIRM_BTN_TERMS = [
  // EN
  'place order','complete order','confirm order','submit order',
  'pay now','confirm and pay','complete purchase','proceed to payment',
  // FR
  'passer commande','passer ma commande','valider ma commande',
  'confirmer ma commande','payer maintenant','valider la commande',
  // DE
  'bestellung aufgeben','kostenpflichtig bestellen','jetzt bezahlen',
  // IT
  'effettua ordine','paga ora','acquista ora',
  // ES
  'realizar pedido','pagar ahora','confirmar pedido',
  // NL
  'bestelling plaatsen','nu betalen','afrekenen',
  // SV
  'slutför köp','betala nu','bekräfta köp',
  // NO
  'bestill nå','betal nå','fullfør kjøp',
  // DA
  'afgiv ordre','betal nu','gennemfør køb',
  // PL
  'złóż zamówienie','zapłać teraz',
  // CS
  'objednat','zaplatit nyní',
  // RO
  'plasează comanda','plătește acum',
  // HU
  'megrendelés leadása','fizetés most',
  // TR
  'siparişi tamamla','şimdi öde',
];
const CONFIRM_BTN_RE = new RegExp(
  CONFIRM_BTN_TERMS
    .sort((a, b) => b.length - a.length)
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|'),
  'i'
);

// Shorter, generic payment verbs — only used when the URL already indicates a checkout page,
// to avoid false-positives on product "add to cart" buttons.
const CONFIRM_BTN_GENERIC_TERMS = [
  'pay','buy','order','purchase','confirm',      // EN
  'valider','confirmer','commander','payer',     // FR
  'kaufen','bestellen','bezahlen',               // DE
  'betalen','afrekenen',                         // NL
  'pagare','acquistare',                         // IT
  'pagar','comprar',                             // ES/PT
  'betala','köpa',                               // SV
  'betale','kjøpe',                              // NO
  'købe',                                        // DA
  'maksa','ostaa',                               // FI
  'platit','koupit',                             // CS
  'plăti','cumpăra',                             // RO
  'fizetni','vásárolni',                         // HU
  'ödemek','satın al',                           // TR
];
const CONFIRM_BTN_GENERIC_RE = new RegExp(
  '(?:^|\\s)(?:' +
  CONFIRM_BTN_GENERIC_TERMS
    .sort((a, b) => b.length - a.length)
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|') +
  ')(?:\\s|$)',
  'i'
);

// URL path segments that indicate a product or shopping page across languages.
// Covers: generic e-commerce, European fashion retail, Shopify, SFCC (/pd/), etc.
const SHOP_URL_RE = new RegExp(
  '\\/' + [
    // Generic product/shop paths (EN + multilingual)
    'product','products','produit','produits','produkt','produkte',
    'producto','productos','prodotto','prodotti','produkt',
    'article','articles','artikel','articolo','articoli','articolo',
    'item','items','listing','listings',
    'shop','boutique','tienda','negozio','winkel','sklep','bolt','magasin','butik',
    // Common platform patterns
    'dp\\/',         // Amazon
    'pd\\/',         // Salesforce Commerce Cloud (Hackett, many fashion brands)
    'p\\/[0-9]',     // short product path
    'collections\\/', // Shopify
    // Category paths — Men's (DE/FR/IT/ES/NL/DA/SV/FI)
    'herren','hommes','uomo','hombre','heren','herrar','maend','miehet',
    // Category paths — Women's
    'damen','femmes','donna','mujer','dames','kvinder','damer','naiset',
    // Category paths — product types (shoes, clothing, accessories…)
    'schuhe','chaussures','scarpe','zapatos','schoenen','sko','skor','kengat',
    'kleidung','vetements','abbigliamento','ropa','kleding','toj','klader','vaatteet',
    'accessoires','accessori','accesorios','zubehor',
    'sac','taschen','borse','bolsos','tassen',
    // Category containers
    'category','categories','categorie','kategorien','kategorier','categoria','kategorie',
    'kollektionen','collections','collezioni','colecciones','colleccions',
  ].join('|'),
  'i'
);

function getPageContext() {
  const url  = window.location.href.toLowerCase();
  const host = window.location.hostname.toLowerCase();

  // 1. Checkout: URL-based (multilingual)
  if (CHECKOUT_URL_RE.test(url)) return 'checkout';

  // 2. Known shopping domains (fast path)
  const shoppingDomains = [
    // Global
    'amazon.','ebay.','etsy.','aliexpress.','wish.com','shopify.','bigcartel.',
    // US
    'walmart.','target.','bestbuy.','newegg.','wayfair.','zappos.','nordstrom.',
    'macys.','gap.','asos.','shein.',
    // Fashion / lifestyle
    'zara.','hm.com','uniqlo.','aboutyou.','about.you.',
    // CH
    'galaxus.','digitec.','brack.','microspot.','tutti.','ricardo.',
    // FR
    'fnac.','cdiscount.','darty.','boulanger.','leclerc.',
    // DE / AT
    'mediamarkt.','saturn.','otto.','zalando.','idealo.','tchibo.','lidl.','aldi.',
    // IT
    'unieuro.','mediaworld.',
    // UK
    'argos.','currys.','johnlewis.','marksandspencer.',
    // NL / BE
    'bol.com','coolblue.','mediamarkt.',
    // Nordic
    'power.','elgiganten.','gigantti.',
    // ES / PT
    'pccomponentes.','elcorteingles.','worten.',
  ];
  if (shoppingDomains.some(d => host.includes(d))) return 'shopping';

  // 3. Shopping URL path patterns (multilingual)
  if (SHOP_URL_RE.test(url)) return 'shopping';

  // 4. DOM: multilingual add-to-cart / buy buttons
  const btns = document.querySelectorAll('button, [role="button"], input[type="submit"], a.btn, a.button');
  for (const btn of btns) {
    const label = (btn.textContent || btn.value || btn.getAttribute('aria-label') || '').trim();
    if (label && CART_BTN_RE.test(label)) return 'shopping';
  }

  // 5. Schema.org price markup = product page
  if (document.querySelector('[itemprop="price"]')) return 'shopping';

  // 6. Numeric product ID in URL path (e.g. /p/10001169214, /item/38291)
  //    5+ consecutive digits in a path segment = almost certainly a product detail page
  if (/\/\d{5,}(\/|$|\?|#)/.test(url)) return 'shopping';

  return 'other';
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Badge helper
// ---------------------------------------------------------------------------
function makeBadge(shortStr) {
  const badge = document.createElement('span');
  badge.dataset.homl = '1';
  badge.dataset.homlBadge = '1';
  badge.textContent = shortStr;
  Object.assign(badge.style, {
    fontSize: '0.75em', fontWeight: '700',
    color: '#f97316', marginLeft: '3px',
    verticalAlign: 'middle', opacity: '0.9',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  });
  return badge;
}

// ---------------------------------------------------------------------------
// Biggest price tracking (for checkout auto-show)
// ---------------------------------------------------------------------------
let biggestEl     = null;
let biggestAmount = 0;

function trackBiggest(el, value) {
  if (value > biggestAmount) {
    biggestAmount = value;
    biggestEl     = el;
  }
}

// ---------------------------------------------------------------------------
// Strategy 1 — Schema.org + data attributes
// ---------------------------------------------------------------------------
function processStructuredPrices(hourlyRate, _context) {
  const selectors = [
    '[itemprop="price"]',
    '[data-price]',
    '[data-product-price]',
    '[data-sale-price]',
    '[data-current-price]',
  ];
  const seen = new Set();

  document.querySelectorAll(selectors.join(',')).forEach(el => {
    if (el.hasAttribute('data-homl-done') || el.closest('[data-homl-done]')) return;

    const raw = el.getAttribute('content') ??
                el.getAttribute('data-price') ??
                el.getAttribute('data-product-price') ??
                el.getAttribute('data-sale-price') ??
                el.getAttribute('data-current-price') ??
                el.textContent;

    const value = parseBarePrice(raw);
    if (!value) return;

    // Avoid duplicating if the element text was already caught by text-node scan
    const key = `${Math.round(value * 100)}:${el.textContent.trim().slice(0, 20)}`;
    if (seen.has(key)) return;
    seen.add(key);

    el.setAttribute('data-homl-done', '1');

    const hours = value / hourlyRate;
    el.after(makeBadge(formatShort(hours)));

    trackBiggest(el, value);
  });
}

// ---------------------------------------------------------------------------
// Strategy 2 — Symbol-prefixed amounts in text nodes
// ---------------------------------------------------------------------------
const SKIP_TAGS = new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT','CODE','PRE','SVG','HEAD']);

function walkTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
      if (p.closest('[data-homl], [data-homl-done]')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  return nodes;
}

function highlightTextNode(textNode, hourlyRate, currencyDef, _context) {
  const text = textNode.nodeValue;
  currencyDef.re.lastIndex = 0;
  let match, lastIndex = 0;
  const frag = document.createDocumentFragment();
  let found = false;

  while ((match = currencyDef.re.exec(text)) !== null) {
    const value = currencyDef.parse(match[0]);
    if (!value) continue;

    const hours = value / hourlyRate;

    if (match.index > lastIndex) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }

    const span = document.createElement('span');
    span.dataset.homl = '1';
    span.textContent = match[0];
    Object.assign(span.style, {
      background: 'rgba(249,115,22,.18)',
      borderBottom: '1.5px dashed #f97316',
      borderRadius: '2px',
      transition: 'background .12s',
    });

    frag.appendChild(span);
    frag.appendChild(makeBadge(formatShort(hours)));
    trackBiggest(span, value);
    lastIndex = match.index + match[0].length;
    found = true;
  }

  if (!found) return;
  if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));
  if (textNode.parentNode) textNode.parentNode.replaceChild(frag, textNode);
}

// ---------------------------------------------------------------------------
// Strategy 3 — Bare price numbers on shopping/checkout pages
// ---------------------------------------------------------------------------
function highlightBareTextNode(textNode, hourlyRate, _context) {
  const text = textNode.nodeValue;
  // Quick pre-filter: must contain a digit followed by a decimal separator
  if (!/\d[.,]/.test(text)) return;

  BARE_PRICE_RE.lastIndex = 0;
  let match, lastIndex = 0;
  const frag = document.createDocumentFragment();
  let found = false;

  while ((match = BARE_PRICE_RE.exec(text)) !== null) {
    const value = parseBarePrice(match[0]);
    if (!value) continue;

    const hours   = value / hourlyRate;

    if (match.index > lastIndex) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }

    const span = document.createElement('span');
    span.dataset.homl = '1';
    span.textContent = match[0];
    Object.assign(span.style, {
      background: 'rgba(249,115,22,.18)',
      borderBottom: '1.5px dashed #f97316',
      borderRadius: '2px',
      transition: 'background .12s',
    });

    // Strategy 3 only runs on shopping/checkout — always inline, never hover tooltip
    frag.appendChild(span);
    frag.appendChild(makeBadge(formatShort(hours)));

    trackBiggest(span, value);
    lastIndex = match.index + match[0].length;
    found = true;
  }

  if (!found) return;
  if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));
  if (textNode.parentNode) textNode.parentNode.replaceChild(frag, textNode);
}

// ---------------------------------------------------------------------------
// Full page pass
// ---------------------------------------------------------------------------
function processPage(hourlyRate, currencyDef, context) {
  // 1. Structured prices (Schema.org, data attrs)
  processStructuredPrices(hourlyRate, context);

  // 2. Symbol-prefixed amounts in text
  for (const node of walkTextNodes(document.body)) {
    highlightTextNode(node, hourlyRate, currencyDef, context);
  }

  // 3. Bare price numbers — only on shopping/checkout to limit false positives
  if (context !== 'other') {
    for (const node of walkTextNodes(document.body)) {
      highlightBareTextNode(node, hourlyRate, context);
    }
  }
}

// ---------------------------------------------------------------------------
// MutationObserver for dynamic content
// ---------------------------------------------------------------------------
function observeDynamicContent(hourlyRate, currencyDef, context) {
  let timer = null;
  const queue = new Set();

  const observer = new MutationObserver((mutations) => {
    for (const { addedNodes } of mutations) {
      for (const node of addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && !node.dataset?.homl) {
          queue.add(node);
        }
      }
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      for (const root of queue) {
        processStructuredPrices(hourlyRate, context);  // re-scan whole doc for new itemprop
        for (const node of walkTextNodes(root)) {
          highlightTextNode(node, hourlyRate, currencyDef, context);
          if (context !== 'other') highlightBareTextNode(node, hourlyRate, context);
        }
      }
      queue.clear();
    }, 300);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// ---------------------------------------------------------------------------
// Price count — quick text scan without DOM annotation (used as fallback)
// ---------------------------------------------------------------------------
function countPricesOnPage(currencyDef) {
  const text = (document.body || document.documentElement).textContent;
  let count = 0;

  // Currency-prefixed prices
  const re = new RegExp(currencyDef.re.source, 'gi');
  let m;
  while ((m = re.exec(text)) !== null && count < 3) {
    if (currencyDef.parse(m[0]) !== null) count++;
  }

  // Bare prices (no symbol)
  if (count < 3) {
    const bareRe = new RegExp(BARE_PRICE_RE.source, BARE_PRICE_RE.flags);
    bareRe.lastIndex = 0;
    let bm;
    while ((bm = bareRe.exec(text)) !== null && count < 3) {
      if (parseBarePrice(bm[0]) !== null) count++;
    }
  }

  return count;
}

// ---------------------------------------------------------------------------
// Checkout interception modal
// ---------------------------------------------------------------------------
let bypassInterceptor = false;
let interceptorAttached = false;

function showConfirmModal(timeStr, originalBtn) {
  document.querySelectorAll('#homl-modal-host').forEach(el => el.remove());

  const host = document.createElement('div');
  host.id = 'homl-modal-host';
  Object.assign(host.style, { position: 'fixed', inset: '0', zIndex: '2147483647' });
  (document.body || document.documentElement).appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });
  shadow.innerHTML = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      #overlay {
        position: fixed; inset: 0;
        background: rgba(30,18,8,.62);
        display: flex; align-items: center; justify-content: center;
        animation: fi .15s ease;
      }
      @keyframes fi { from { opacity: 0 } to { opacity: 1 } }
      #card {
        background: #FFF9F6;
        border: 1.5px solid rgba(212,96,30,.3);
        border-radius: 12px;
        padding: 28px 28px 22px;
        max-width: 320px; width: 88vw;
        box-shadow: 0 16px 56px rgba(212,96,30,.18);
        text-align: center;
        font-family: system-ui, -apple-system, sans-serif;
        animation: su .18s ease;
      }
      @keyframes su { from { transform: translateY(10px); opacity: 0 } to { transform: none; opacity: 1 } }
      #icon { font-size: 28px; margin-bottom: 12px; }
      #about {
        font-size: 11px; font-weight: 700; text-transform: uppercase;
        letter-spacing: .08em; color: #7A5040; margin-bottom: 8px;
      }
      #amount { font-size: 22px; font-weight: 800; color: #1E1208; line-height: 1.25; margin-bottom: 12px; }
      #question { font-size: 18px; font-weight: 700; color: #D4601E; margin-bottom: 22px; }
      #actions { display: flex; gap: 10px; }
      .btn {
        flex: 1; padding: 10px 8px; border-radius: 8px;
        font: 600 13px/1 system-ui, sans-serif; cursor: pointer;
        transition: background .12s, border-color .12s;
      }
      #cancel { border: 1.5px solid rgba(212,96,30,.28); background: none; color: #7A5040; }
      #cancel:hover { background: rgba(212,96,30,.07); }
      #confirm { border: 1.5px solid #D4601E; background: #D4601E; color: #FFF9F6; }
      #confirm:hover { background: #BF5419; border-color: #BF5419; }
    </style>
    <div id="overlay">
      <div id="card">
        <div id="icon">⏱</div>
        <div id="about">${ms('about')}</div>
        <div id="amount">${timeStr}</div>
        <div id="question">${ms('question')}</div>
        <div id="actions">
          <button class="btn" id="cancel">${ms('cancel')}</button>
          <button class="btn" id="confirm">${ms('confirm')}</button>
        </div>
      </div>
    </div>`;

  const close = () => host.remove();

  shadow.getElementById('cancel').addEventListener('click', close);
  shadow.getElementById('overlay').addEventListener('click', e => {
    if (e.target === shadow.getElementById('overlay')) close();
  });
  shadow.getElementById('confirm').addEventListener('click', () => {
    close();
    bypassInterceptor = true;
    try { originalBtn.click(); } finally {
      setTimeout(() => { bypassInterceptor = false; }, 100);
    }
  });

  const onKey = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
}

function attachCheckoutInterceptor(hourlyRate) {
  if (interceptorAttached) return;
  interceptorAttached = true;

  document.addEventListener('click', e => {
    if (bypassInterceptor) return;
    if (!biggestAmount || biggestAmount <= 0) return;

    const btn = e.target.closest('button, a, input[type="submit"], input[type="button"], [role="button"]');
    if (!btn) return;

    // Normalize: collapse whitespace (nested icon elements add noise)
    const text = (
      (btn.textContent || '') + ' ' +
      (btn.value || '') + ' ' +
      (btn.getAttribute('aria-label') || '')
    ).replace(/\s+/g, ' ').trim();

    const strongMatch = CONFIRM_BTN_RE.test(text);
    // On confirmed checkout pages, also accept shorter generic payment verbs
    const onCheckout = CHECKOUT_URL_RE.test(window.location.href);
    const genericMatch = onCheckout && CONFIRM_BTN_GENERIC_RE.test(' ' + text + ' ');

    if (!strongMatch && !genericMatch) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    showConfirmModal(formatHours(biggestAmount / hourlyRate), btn);
  }, true); // capture phase — intercepts before site handlers
}

// ---------------------------------------------------------------------------
// Toggle on/off listener (responds to popup without page reload)
// ---------------------------------------------------------------------------
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action !== 'setEnabled') return;
  document.querySelectorAll('[data-homl-badge]').forEach(el => {
    el.style.display = msg.enabled ? '' : 'none';
  });
  document.querySelectorAll('[data-homl]').forEach(el => {
    if (!el.dataset.homlBadge) {
      el.style.background = msg.enabled ? 'rgba(249,115,22,.15)' : 'transparent';
    }
  });
});

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
chrome.storage.local.get(['hourlyRate', 'currency', 'enabled'], (result) => {
  if (result.enabled === false) return;

  const hourlyRate  = result.hourlyRate;
  const currency    = result.currency || 'USD';
  const currencyDef = CURRENCY_DEFS[currency] ?? CURRENCY_DEFS.USD;

  if (!hourlyRate || hourlyRate <= 0) return;

  let context = getPageContext();

  // Fallback: if not detected as shopping yet, count prices on the page.
  // 3+ prices = almost certainly a product listing or detail page, not an article.
  if (context === 'other' && countPricesOnPage(currencyDef) >= 3) {
    context = 'shopping';
  }

  if (context === 'other') return;

  processPage(hourlyRate, currencyDef, context);
  observeDynamicContent(hourlyRate, currencyDef, context);

  // Attach on shopping pages too: SPAs navigate product→cart→checkout without
  // a full page reload, so we can't wait until context==='checkout' at load time.
  if (context !== 'other') attachCheckoutInterceptor(hourlyRate);

});
