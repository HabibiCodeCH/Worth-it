'use strict';

// ---------------------------------------------------------------------------
// i18n
// ---------------------------------------------------------------------------
const STRINGS = {
  fr: {
    logoSub: '— Paramètres',
    currencySection: 'Devise',
    currencyLabel: 'Dans quelle devise est ton salaire ?',
    rateSection: 'Mon taux horaire',
    modeHourly: 'Taux horaire direct',
    modeAnnual: 'Salaire annuel',
    hourlyLabel: 'Taux horaire',
    annualLabel: 'Salaire annuel brut',
    hoursLabel: 'Heures / semaine',
    hoursUnit: 'h/sem',
    annualUnit: '/an',
    save: 'Enregistrer',
    savedOk: 'Enregistré ✓',
    errorRate: 'Saisis un taux valide.',
    derivedTpl: (sym, rate) => `→ Taux horaire calculé : ${sym}${rate}/h`,
    privacyTitle: 'Ton salaire reste sur ton appareil.',
    privacyBody: 'Cette extension ne fait aucun appel réseau. Aucune donnée n\'est collectée ou transmise — tout est stocké localement dans chrome.storage.local.',
  },
  en: {
    logoSub: '— Settings',
    currencySection: 'Currency',
    currencyLabel: 'What currency is your salary in?',
    rateSection: 'My hourly rate',
    modeHourly: 'Direct hourly rate',
    modeAnnual: 'Annual salary',
    hourlyLabel: 'Hourly rate',
    annualLabel: 'Gross annual salary',
    hoursLabel: 'Hours / week',
    hoursUnit: 'h/wk',
    annualUnit: '/yr',
    save: 'Save',
    savedOk: 'Saved ✓',
    errorRate: 'Enter a valid rate.',
    derivedTpl: (sym, rate) => `→ Calculated rate: ${sym}${rate}/h`,
    privacyTitle: 'Your salary stays on your device.',
    privacyBody: 'This extension makes no network calls. No data is collected or transmitted — everything is stored locally in chrome.storage.local.',
  },
  de: {
    logoSub: '— Einstellungen',
    currencySection: 'Währung',
    currencyLabel: 'In welcher Währung ist dein Gehalt?',
    rateSection: 'Mein Stundenlohn',
    modeHourly: 'Direkt Stundenlohn',
    modeAnnual: 'Jahresgehalt',
    hourlyLabel: 'Stundenlohn',
    annualLabel: 'Brutto-Jahresgehalt',
    hoursLabel: 'Stunden / Woche',
    hoursUnit: 'h/Wo',
    annualUnit: '/J',
    save: 'Speichern',
    savedOk: 'Gespeichert ✓',
    errorRate: 'Gib einen gültigen Wert ein.',
    derivedTpl: (sym, rate) => `→ Stundenlohn: ${sym}${rate}/h`,
    privacyTitle: 'Dein Gehalt bleibt auf deinem Gerät.',
    privacyBody: 'Diese Erweiterung macht keine Netzwerkaufrufe. Es werden keine Daten gesammelt oder übertragen — alles wird lokal gespeichert.',
  },
  it: {
    logoSub: '— Impostazioni',
    currencySection: 'Valuta',
    currencyLabel: 'In quale valuta è il tuo stipendio?',
    rateSection: 'La mia tariffa oraria',
    modeHourly: 'Tariffa oraria diretta',
    modeAnnual: 'Stipendio annuale',
    hourlyLabel: 'Tariffa oraria',
    annualLabel: 'Stipendio annuale lordo',
    hoursLabel: 'Ore / settimana',
    hoursUnit: 'h/sett',
    annualUnit: '/anno',
    save: 'Salva',
    savedOk: 'Salvato ✓',
    errorRate: 'Inserisci una tariffa valida.',
    derivedTpl: (sym, rate) => `→ Tariffa calcolata: ${sym}${rate}/h`,
    privacyTitle: 'Il tuo stipendio rimane sul tuo dispositivo.',
    privacyBody: 'Questa estensione non fa chiamate di rete. Nessun dato viene raccolto o trasmesso — tutto è salvato localmente.',
  },
  es: {
    logoSub: '— Configuración',
    currencySection: 'Moneda',
    currencyLabel: '¿En qué moneda está tu salario?',
    rateSection: 'Mi tarifa por hora',
    modeHourly: 'Tarifa por hora directa',
    modeAnnual: 'Salario anual',
    hourlyLabel: 'Tarifa por hora',
    annualLabel: 'Salario anual bruto',
    hoursLabel: 'Horas / semana',
    hoursUnit: 'h/sem',
    annualUnit: '/año',
    save: 'Guardar',
    savedOk: 'Guardado ✓',
    errorRate: 'Introduce una tarifa válida.',
    derivedTpl: (sym, rate) => `→ Tarifa calculada: ${sym}${rate}/h`,
    privacyTitle: 'Tu salario se queda en tu dispositivo.',
    privacyBody: 'Esta extensión no hace llamadas de red. No se recopilan ni transmiten datos — todo se guarda localmente.',
  },
  pt: {
    logoSub: '— Configurações',
    currencySection: 'Moeda',
    currencyLabel: 'Em que moeda está o teu salário?',
    rateSection: 'A minha taxa horária',
    modeHourly: 'Taxa horária direta',
    modeAnnual: 'Salário anual',
    hourlyLabel: 'Taxa horária',
    annualLabel: 'Salário anual bruto',
    hoursLabel: 'Horas / semana',
    hoursUnit: 'h/sem',
    annualUnit: '/ano',
    save: 'Guardar',
    savedOk: 'Guardado ✓',
    errorRate: 'Introduz uma taxa válida.',
    derivedTpl: (sym, rate) => `→ Taxa calculada: ${sym}${rate}/h`,
    privacyTitle: 'O teu salário fica no teu dispositivo.',
    privacyBody: 'Esta extensão não faz chamadas de rede. Nenhum dado é recolhido ou transmitido — tudo é guardado localmente.',
  },
  nl: {
    logoSub: '— Instellingen',
    currencySection: 'Valuta',
    currencyLabel: 'In welke valuta is je salaris?',
    rateSection: 'Mijn uurtarief',
    modeHourly: 'Direct uurtarief',
    modeAnnual: 'Jaarsalaris',
    hourlyLabel: 'Uurtarief',
    annualLabel: 'Bruto jaarsalaris',
    hoursLabel: 'Uren / week',
    hoursUnit: 'h/wk',
    annualUnit: '/jr',
    save: 'Opslaan',
    savedOk: 'Opgeslagen ✓',
    errorRate: 'Voer een geldig tarief in.',
    derivedTpl: (sym, rate) => `→ Berekend uurtarief: ${sym}${rate}/h`,
    privacyTitle: 'Je salaris blijft op je apparaat.',
    privacyBody: 'Deze extensie maakt geen netwerkoproepen. Er worden geen gegevens verzameld of verzonden — alles wordt lokaal opgeslagen.',
  },
  sv: {
    logoSub: '— Inställningar',
    currencySection: 'Valuta',
    currencyLabel: 'I vilken valuta är din lön?',
    rateSection: 'Min timlön',
    modeHourly: 'Direkt timlön',
    modeAnnual: 'Årslön',
    hourlyLabel: 'Timlön',
    annualLabel: 'Brutto årslön',
    hoursLabel: 'Timmar / vecka',
    hoursUnit: 'h/v',
    annualUnit: '/år',
    save: 'Spara',
    savedOk: 'Sparat ✓',
    errorRate: 'Ange en giltig lön.',
    derivedTpl: (sym, rate) => `→ Beräknad timlön: ${sym}${rate}/h`,
    privacyTitle: 'Din lön stannar på din enhet.',
    privacyBody: 'Det här tillägget gör inga nätverksanrop. Inga data samlas in eller skickas — allt lagras lokalt.',
  },
  no: {
    logoSub: '— Innstillinger',
    currencySection: 'Valuta',
    currencyLabel: 'I hvilken valuta er lønnen din?',
    rateSection: 'Min timelønn',
    modeHourly: 'Direkte timelønn',
    modeAnnual: 'Årslønn',
    hourlyLabel: 'Timelønn',
    annualLabel: 'Brutto årslønn',
    hoursLabel: 'Timer / uke',
    hoursUnit: 'h/u',
    annualUnit: '/år',
    save: 'Lagre',
    savedOk: 'Lagret ✓',
    errorRate: 'Skriv inn en gyldig lønn.',
    derivedTpl: (sym, rate) => `→ Beregnet timelønn: ${sym}${rate}/h`,
    privacyTitle: 'Lønnen din forblir på enheten din.',
    privacyBody: 'Denne utvidelsen gjør ingen nettverkskall. Ingen data samles inn eller sendes — alt lagres lokalt.',
  },
  da: {
    logoSub: '— Indstillinger',
    currencySection: 'Valuta',
    currencyLabel: 'I hvilken valuta er din løn?',
    rateSection: 'Min timeløn',
    modeHourly: 'Direkte timeløn',
    modeAnnual: 'Årsløn',
    hourlyLabel: 'Timeløn',
    annualLabel: 'Brutto årsløn',
    hoursLabel: 'Timer / uge',
    hoursUnit: 'h/u',
    annualUnit: '/år',
    save: 'Gem',
    savedOk: 'Gemt ✓',
    errorRate: 'Indtast en gyldig løn.',
    derivedTpl: (sym, rate) => `→ Beregnet timeløn: ${sym}${rate}/h`,
    privacyTitle: 'Din løn forbliver på din enhed.',
    privacyBody: 'Denne udvidelse foretager ingen netværksopkald. Ingen data indsamles eller sendes — alt gemmes lokalt.',
  },
  fi: {
    logoSub: '— Asetukset',
    currencySection: 'Valuutta',
    currencyLabel: 'Missä valuutassa palkkasi on?',
    rateSection: 'Tuntipalkka',
    modeHourly: 'Suora tuntipalkka',
    modeAnnual: 'Vuosipalkka',
    hourlyLabel: 'Tuntipalkka',
    annualLabel: 'Brutto vuosipalkka',
    hoursLabel: 'Tuntia / viikko',
    hoursUnit: 'h/vk',
    annualUnit: '/v',
    save: 'Tallenna',
    savedOk: 'Tallennettu ✓',
    errorRate: 'Anna kelvollinen palkka.',
    derivedTpl: (sym, rate) => `→ Laskettu tuntipalkka: ${sym}${rate}/h`,
    privacyTitle: 'Palkkasi pysyy laitteellasi.',
    privacyBody: 'Tämä laajennus ei tee verkkopyyntöjä. Mitään tietoja ei kerätä tai lähetetä — kaikki tallennetaan paikallisesti.',
  },
  pl: {
    logoSub: '— Ustawienia',
    currencySection: 'Waluta',
    currencyLabel: 'W jakiej walucie jest Twoje wynagrodzenie?',
    rateSection: 'Moja stawka godzinowa',
    modeHourly: 'Bezpośrednia stawka',
    modeAnnual: 'Wynagrodzenie roczne',
    hourlyLabel: 'Stawka godzinowa',
    annualLabel: 'Wynagrodzenie roczne brutto',
    hoursLabel: 'Godziny / tydzień',
    hoursUnit: 'h/tydz',
    annualUnit: '/rok',
    save: 'Zapisz',
    savedOk: 'Zapisano ✓',
    errorRate: 'Wprowadź prawidłową stawkę.',
    derivedTpl: (sym, rate) => `→ Obliczona stawka: ${sym}${rate}/h`,
    privacyTitle: 'Twoje wynagrodzenie pozostaje na Twoim urządzeniu.',
    privacyBody: 'To rozszerzenie nie wykonuje żadnych wywołań sieciowych. Żadne dane nie są zbierane ani przesyłane — wszystko jest przechowywane lokalnie.',
  },
  cs: {
    logoSub: '— Nastavení',
    currencySection: 'Měna',
    currencyLabel: 'V jaké měně je tvůj plat?',
    rateSection: 'Moje hodinová sazba',
    modeHourly: 'Přímá hodinová sazba',
    modeAnnual: 'Roční plat',
    hourlyLabel: 'Hodinová sazba',
    annualLabel: 'Hrubý roční plat',
    hoursLabel: 'Hodin / týden',
    hoursUnit: 'h/týd',
    annualUnit: '/rok',
    save: 'Uložit',
    savedOk: 'Uloženo ✓',
    errorRate: 'Zadej platnou sazbu.',
    derivedTpl: (sym, rate) => `→ Vypočtená sazba: ${sym}${rate}/h`,
    privacyTitle: 'Tvůj plat zůstává na tvém zařízení.',
    privacyBody: 'Toto rozšíření neprovádí žádná síťová volání. Žádná data nejsou sbírána ani přenášena — vše je uloženo lokálně.',
  },
  ro: {
    logoSub: '— Setări',
    currencySection: 'Monedă',
    currencyLabel: 'În ce monedă este salariul tău?',
    rateSection: 'Rata mea orară',
    modeHourly: 'Rată orară directă',
    modeAnnual: 'Salariu anual',
    hourlyLabel: 'Rată orară',
    annualLabel: 'Salariu anual brut',
    hoursLabel: 'Ore / săptămână',
    hoursUnit: 'h/săpt',
    annualUnit: '/an',
    save: 'Salvează',
    savedOk: 'Salvat ✓',
    errorRate: 'Introdu o rată validă.',
    derivedTpl: (sym, rate) => `→ Rată calculată: ${sym}${rate}/h`,
    privacyTitle: 'Salariul tău rămâne pe dispozitivul tău.',
    privacyBody: 'Această extensie nu face apeluri de rețea. Nicio dată nu este colectată sau transmisă — totul este stocat local.',
  },
  hu: {
    logoSub: '— Beállítások',
    currencySection: 'Pénznem',
    currencyLabel: 'Milyen pénznemben van a fizetésed?',
    rateSection: 'Az órabérem',
    modeHourly: 'Közvetlen órabér',
    modeAnnual: 'Éves bér',
    hourlyLabel: 'Órabér',
    annualLabel: 'Bruttó éves bér',
    hoursLabel: 'Óra / hét',
    hoursUnit: 'ó/hét',
    annualUnit: '/év',
    save: 'Mentés',
    savedOk: 'Mentve ✓',
    errorRate: 'Adj meg érvényes bérezést.',
    derivedTpl: (sym, rate) => `→ Számított órabér: ${sym}${rate}/h`,
    privacyTitle: 'A fizetésed az eszközödön marad.',
    privacyBody: 'Ez a bővítmény nem végez hálózati hívásokat. Semmilyen adat nem gyűjt vagy küld — minden helyileg tárolódik.',
  },
  tr: {
    logoSub: '— Ayarlar',
    currencySection: 'Para Birimi',
    currencyLabel: 'Maaşın hangi para biriminde?',
    rateSection: 'Saatlik ücretim',
    modeHourly: 'Doğrudan saatlik ücret',
    modeAnnual: 'Yıllık maaş',
    hourlyLabel: 'Saatlik ücret',
    annualLabel: 'Brüt yıllık maaş',
    hoursLabel: 'Saat / hafta',
    hoursUnit: 'sa/hf',
    annualUnit: '/yıl',
    save: 'Kaydet',
    savedOk: 'Kaydedildi ✓',
    errorRate: 'Geçerli bir ücret girin.',
    derivedTpl: (sym, rate) => `→ Hesaplanan ücret: ${sym}${rate}/h`,
    privacyTitle: 'Maaşın cihazında kalır.',
    privacyBody: 'Bu uzantı ağ çağrısı yapmaz. Hiçbir veri toplanmaz veya iletilmez — her şey yerel olarak saklanır.',
  },
};
STRINGS.nb = STRINGS.no;

function getLang() {
  const code = (navigator.languages?.[0] || navigator.language || 'en')
    .toLowerCase().slice(0, 2);
  return STRINGS[code] ? code : 'en';
}

function T(key) {
  const lang = getLang();
  return (STRINGS[lang] || STRINGS.en)[key];
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = T(el.dataset.i18n) || '';
  });
  const pc = document.getElementById('privacy-content');
  if (pc) {
    pc.innerHTML = `<strong>${T('privacyTitle')}</strong> ${T('privacyBody')}`;
  }
  document.title = 'Worth It? ' + (T('logoSub') || '');
  // Update hours/week unit label (not currency-dependent)
  document.querySelectorAll('[data-role="hours"]').forEach(el => {
    el.textContent = T('hoursUnit') || 'h';
  });
}

// ---------------------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------------------
const currencyEl     = document.getElementById('currency');
const modeHourlyBtn  = document.getElementById('mode-hourly');
const modeAnnualBtn  = document.getElementById('mode-annual');
const panelHourly    = document.getElementById('panel-hourly');
const panelAnnual    = document.getElementById('panel-annual');
const hourlyRateEl   = document.getElementById('hourly-rate');
const annualSalaryEl = document.getElementById('annual-salary');
const hoursPerWeekEl = document.getElementById('hours-per-week');
const derivedEl      = document.getElementById('derived-rate');
const saveBtn        = document.getElementById('save-btn');
const statusEl       = document.getElementById('status');

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', CHF: 'Fr.', GBP: '£', CAD: 'C$', AUD: 'A$', SEK: 'kr', NOK: 'kr', DKK: 'kr', HUF: 'Ft' };

let currentMode = 'hourly';

// ---------------------------------------------------------------------------
// Currency — update unit labels
// ---------------------------------------------------------------------------
function updateUnitLabels() {
  const sym = CURRENCY_SYMBOLS[currencyEl.value] || currencyEl.value;
  document.querySelectorAll('.unit[data-role="rate"]').forEach(el => {
    el.textContent = `${sym}/h`;
  });
  document.querySelectorAll('.unit[data-role="annual"]').forEach(el => {
    el.textContent = `${sym}${T('annualUnit') || '/an'}`;
  });
  updateDerived();
}

currencyEl.addEventListener('change', updateUnitLabels);

// ---------------------------------------------------------------------------
// Mode switch
// ---------------------------------------------------------------------------
modeHourlyBtn.addEventListener('click', () => setMode('hourly'));
modeAnnualBtn.addEventListener('click', () => setMode('annual'));

function setMode(mode) {
  currentMode = mode;
  modeHourlyBtn.classList.toggle('active', mode === 'hourly');
  modeAnnualBtn.classList.toggle('active', mode === 'annual');
  panelHourly.style.display = mode === 'hourly' ? '' : 'none';
  panelAnnual.style.display = mode === 'annual' ? '' : 'none';
  clearStatus();
}

// ---------------------------------------------------------------------------
// Derived rate display
// ---------------------------------------------------------------------------
function updateDerived() {
  const annual = parseFloat(annualSalaryEl.value);
  const hours  = parseFloat(hoursPerWeekEl.value) || 40;
  const sym    = CURRENCY_SYMBOLS[currencyEl.value] || currencyEl.value;
  if (annual > 0 && hours > 0) {
    const rate = annual / (hours * 52);
    derivedEl.textContent = T('derivedTpl')(sym, rate.toFixed(2));
    derivedEl.classList.add('visible');
  } else {
    derivedEl.classList.remove('visible');
  }
}

annualSalaryEl.addEventListener('input', updateDerived);
hoursPerWeekEl.addEventListener('input', updateDerived);

// ---------------------------------------------------------------------------
// Save
// ---------------------------------------------------------------------------
saveBtn.addEventListener('click', save);

function computeHourlyRate() {
  if (currentMode === 'hourly') return parseFloat(hourlyRateEl.value);
  const annual = parseFloat(annualSalaryEl.value);
  const hours  = parseFloat(hoursPerWeekEl.value) || 40;
  if (!annual || !hours) return NaN;
  return annual / (hours * 52);
}

function save() {
  const rate = computeHourlyRate();
  if (!rate || rate <= 0 || isNaN(rate)) {
    showStatus(T('errorRate'), 'error');
    return;
  }
  const dataToSave = { hourlyRate: rate, currency: currencyEl.value };
  if (currentMode === 'annual') {
    dataToSave.annualSalary = parseFloat(annualSalaryEl.value);
    dataToSave.hoursPerWeek = parseFloat(hoursPerWeekEl.value) || 40;
    dataToSave.inputMode    = 'annual';
  } else {
    dataToSave.inputMode = 'hourly';
  }
  chrome.storage.local.set(dataToSave, () => {
    showStatus(T('savedOk'), 'success');
  });
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------
function showStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = `status ${type}`;
  if (type === 'success') setTimeout(clearStatus, 2500);
}

function clearStatus() {
  statusEl.textContent = '';
  statusEl.className = 'status';
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
applyI18n();

chrome.storage.local.get(['hourlyRate', 'annualSalary', 'hoursPerWeek', 'inputMode', 'currency'], (res) => {
  if (res.currency) currencyEl.value = res.currency;
  updateUnitLabels();

  if (res.inputMode === 'annual' && res.annualSalary) {
    setMode('annual');
    annualSalaryEl.value = res.annualSalary;
    hoursPerWeekEl.value = res.hoursPerWeek ?? 40;
    updateDerived();
  } else if (res.hourlyRate) {
    setMode('hourly');
    hourlyRateEl.value = res.hourlyRate;
  }
});
