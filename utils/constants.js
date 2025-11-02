module.exports = {
  TIMEOUTS: {
    SHORT: 300,
    MEDIUM: 500,
    LONG: 1000,
    EXTRA_LONG: 2000,
    ALERT_TIMER: 6000,
    ELEMENT_WAIT: 5000,
    DEFAULT: 10000,
  },

  SELECTORS: {
    DROPDOWN_MENU: '.css-26l3qy-menu',
    MODAL: '.modal',
    TOOLTIP: '.tooltip-inner',
  },

  ROUTE_PATTERNS: {
    GOOGLE_ADS: [
      'googlesyndication.com',
      'google-analytics.com',
      'doubleclick.net',
      'googletagmanager.com',
    ],
  },
};
