'use strict';

const STRINGS = {
  fr: {
    rateHeader: 'Ton taux horaire',
    notConfiguredLabel: 'Non configuré',
    notConfiguredText: 'Configure ton taux horaire pour voir ton temps de vie sur les sites marchands.',
    optionsBtn: '⚙ Paramètres',
    setupBtn: 'Configurer →',
    toggleOn: 'Actif sur les sites marchands',
    toggleOff: 'En pause',
  },
  en: {
    rateHeader: 'Your hourly rate',
    notConfiguredLabel: 'Not configured',
    notConfiguredText: 'Configure your hourly rate to see your work time on shopping sites.',
    optionsBtn: '⚙ Settings',
    setupBtn: 'Configure →',
    toggleOn: 'Active on shopping sites',
    toggleOff: 'Paused',
  },
  de: {
    rateHeader: 'Dein Stundenlohn',
    notConfiguredLabel: 'Nicht konfiguriert',
    notConfiguredText: 'Konfiguriere deinen Stundenlohn, um deine Arbeitszeit auf Shopping-Seiten zu sehen.',
    optionsBtn: '⚙ Einstellungen',
    setupBtn: 'Einrichten →',
    toggleOn: 'Aktiv auf Shopping-Seiten',
    toggleOff: 'Pausiert',
  },
  it: {
    rateHeader: 'La mia tariffa oraria',
    notConfiguredLabel: 'Non configurato',
    notConfiguredText: 'Configura la tua tariffa oraria per vedere il tuo tempo di lavoro sui siti di shopping.',
    optionsBtn: '⚙ Impostazioni',
    setupBtn: 'Configura →',
    toggleOn: 'Attivo sui siti di shopping',
    toggleOff: 'In pausa',
  },
  es: {
    rateHeader: 'Mi tarifa por hora',
    notConfiguredLabel: 'No configurado',
    notConfiguredText: 'Configura tu tarifa por hora para ver tu tiempo de trabajo en sitios de compras.',
    optionsBtn: '⚙ Configuración',
    setupBtn: 'Configurar →',
    toggleOn: 'Activo en sitios de compras',
    toggleOff: 'En pausa',
  },
  pt: {
    rateHeader: 'A minha taxa horária',
    notConfiguredLabel: 'Não configurado',
    notConfiguredText: 'Configura a tua taxa horária para ver o teu tempo de trabalho nos sites de compras.',
    optionsBtn: '⚙ Definições',
    setupBtn: 'Configurar →',
    toggleOn: 'Ativo nos sites de compras',
    toggleOff: 'Em pausa',
  },
  nl: {
    rateHeader: 'Mijn uurtarief',
    notConfiguredLabel: 'Niet geconfigureerd',
    notConfiguredText: 'Stel je uurtarief in om je werktijd op shopping-sites te zien.',
    optionsBtn: '⚙ Instellingen',
    setupBtn: 'Instellen →',
    toggleOn: 'Actief op winkelsites',
    toggleOff: 'Gepauzeerd',
  },
  sv: {
    rateHeader: 'Min timlön',
    notConfiguredLabel: 'Inte konfigurerat',
    notConfiguredText: 'Konfigurera din timlön för att se din arbetstid på shoppingsajter.',
    optionsBtn: '⚙ Inställningar',
    setupBtn: 'Konfigurera →',
    toggleOn: 'Aktiv på shoppingsajter',
    toggleOff: 'Pausad',
  },
  no: {
    rateHeader: 'Min timelønn',
    notConfiguredLabel: 'Ikke konfigurert',
    notConfiguredText: 'Konfigurer timelønn for å se arbeidstiden din på shoppingsider.',
    optionsBtn: '⚙ Innstillinger',
    setupBtn: 'Konfigurer →',
    toggleOn: 'Aktiv på shoppingsider',
    toggleOff: 'Pauset',
  },
  da: {
    rateHeader: 'Min timeløn',
    notConfiguredLabel: 'Ikke konfigureret',
    notConfiguredText: 'Konfigurer din timeløn for at se din arbejdstid på shopping-sider.',
    optionsBtn: '⚙ Indstillinger',
    setupBtn: 'Konfigurér →',
    toggleOn: 'Aktiv på shopping-sider',
    toggleOff: 'Sat på pause',
  },
  fi: {
    rateHeader: 'Tuntipalkkani',
    notConfiguredLabel: 'Ei määritetty',
    notConfiguredText: 'Määritä tuntipalkka nähdäksesi työaikasi ostossivustoilla.',
    optionsBtn: '⚙ Asetukset',
    setupBtn: 'Määritä →',
    toggleOn: 'Aktiivinen ostossivustoilla',
    toggleOff: 'Tauolla',
  },
  pl: {
    rateHeader: 'Moja stawka godzinowa',
    notConfiguredLabel: 'Nie skonfigurowano',
    notConfiguredText: 'Skonfiguruj stawkę godzinową, aby widzieć czas pracy na stronach zakupowych.',
    optionsBtn: '⚙ Ustawienia',
    setupBtn: 'Skonfiguruj →',
    toggleOn: 'Aktywny na stronach zakupowych',
    toggleOff: 'Wstrzymany',
  },
  cs: {
    rateHeader: 'Moje hodinová sazba',
    notConfiguredLabel: 'Není nastaveno',
    notConfiguredText: 'Nastav hodinovou sazbu, aby se zobrazoval tvůj pracovní čas na nákupních stránkách.',
    optionsBtn: '⚙ Nastavení',
    setupBtn: 'Nastavit →',
    toggleOn: 'Aktivní na nákupních stránkách',
    toggleOff: 'Pozastaveno',
  },
  ro: {
    rateHeader: 'Rata mea orară',
    notConfiguredLabel: 'Neconfigurat',
    notConfiguredText: 'Configurează rata orară pentru a vedea timpul tău de muncă pe site-urile de cumpărături.',
    optionsBtn: '⚙ Setări',
    setupBtn: 'Configurează →',
    toggleOn: 'Activ pe site-uri de cumpărături',
    toggleOff: 'În pauză',
  },
  hu: {
    rateHeader: 'Az órabérem',
    notConfiguredLabel: 'Nincs konfigurálva',
    notConfiguredText: 'Állítsd be az órabéredet, hogy lásd a munkaidődet a vásárlási oldalakon.',
    optionsBtn: '⚙ Beállítások',
    setupBtn: 'Beállítás →',
    toggleOn: 'Aktív a vásárlási oldalakon',
    toggleOff: 'Szüneteltetve',
  },
  tr: {
    rateHeader: 'Saatlik ücretim',
    notConfiguredLabel: 'Yapılandırılmamış',
    notConfiguredText: 'Alışveriş sitelerinde çalışma sürenizi görmek için saatlik ücretinizi ayarlayın.',
    optionsBtn: '⚙ Ayarlar',
    setupBtn: 'Ayarla →',
    toggleOn: 'Alışveriş sitelerinde aktif',
    toggleOff: 'Duraklatıldı',
  },
};
STRINGS.nb = STRINGS.no;

function getLang() {
  const code = (navigator.languages?.[0] || navigator.language || 'en')
    .toLowerCase().slice(0, 2);
  return STRINGS[code] ? code : 'en';
}

function T(key) {
  return (STRINGS[getLang()] || STRINGS.en)[key];
}

// ---------------------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------------------
const stateOk             = document.getElementById('state-ok');
const stateMissing        = document.getElementById('state-missing');
const rateHeaderEl        = document.getElementById('rate-header');
const rateLabel           = document.getElementById('rate-label');
const notConfiguredLabel  = document.getElementById('not-configured-label');
const notConfiguredText   = document.getElementById('not-configured-text');
const optionsBtn          = document.getElementById('options-btn');
const setupBtn            = document.getElementById('setup-btn');
const toggleEl            = document.getElementById('toggle');
const toggleLabel         = document.getElementById('toggle-label');

function openOptions() { chrome.runtime.openOptionsPage(); }
optionsBtn.addEventListener('click', openOptions);
setupBtn.addEventListener('click', openOptions);

// Apply static translations
notConfiguredLabel.textContent = T('notConfiguredLabel');
notConfiguredText.textContent  = T('notConfiguredText');
optionsBtn.textContent         = T('optionsBtn');
setupBtn.textContent           = T('setupBtn');

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------
function setToggleUI(on) {
  toggleEl.checked       = on;
  toggleLabel.textContent = T(on ? 'toggleOn' : 'toggleOff');
}

function sendToggleToTab(on) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'setEnabled', enabled: on })
        .catch(() => {});
    }
  });
}

toggleEl.addEventListener('change', () => {
  const on = toggleEl.checked;
  chrome.storage.local.set({ enabled: on });
  setToggleUI(on);
  sendToggleToTab(on);
});

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
chrome.storage.local.get(['hourlyRate', 'currency', 'enabled'], (res) => {
  const rate = res.hourlyRate;
  const code = res.currency || 'USD';
  const on   = res.enabled !== false;

  setToggleUI(on);

  if (rate && rate > 0) {
    stateOk.style.display = 'block';
    rateHeaderEl.textContent = T('rateHeader');
    rateLabel.textContent    = `${code} ${rate.toFixed(2)} / h`;
    optionsBtn.style.display = 'block';
  } else {
    stateMissing.style.display = 'block';
    setupBtn.style.display = 'block';
  }
});
