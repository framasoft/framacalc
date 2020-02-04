import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import vueHeadful from 'vue-headful';
import BootstrapVue from 'bootstrap-vue';
import marked from 'marked';
import deburr from 'lodash/deburr';

import is from 'vuefs-commons/app/plugins/is';
import cookie from 'vuefs-commons/app/plugins/cookie';
import merge from 'vuefs-commons/app/plugins/merge';
import icon from 'vuefs-commons/app/components/commons/Icon.vue';

import App from './App.vue';

import './assets/scss/main.scss';

Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.component('vue-headful', vueHeadful);

Vue.use(is);
Vue.use(cookie);
Vue.use(merge);
Vue.component('icon', icon);

const defaultLocale = 'fr';
const locales = {};
const pages = [];
let commons = [];

// Import locales list
// in locales/[lg]/[file].yml
let req = require.context('./locales/', true, /\.\/.*\/.*\.yml$/);
req.keys().forEach((key) => {
  const lg = key.split('/')[1];
  const file = key.split('/')[2].replace(/\.yml/, '');
  if (locales[lg] === undefined) {
    locales[lg] = [];
  }
  if (!locales[lg].includes(file)) {
    locales[lg].push(file);
  }
});

// Import pages list
req = require.context('./components/pages', false, /\.vue$/);
req.keys().forEach((key) => {
  pages.push(key.replace(/\.\/(.*)\.vue/, '$1'));
});

// Import commons data list
req = require.context('../node_modules/vuefs-commons/app/data/commons/', false, /\.yml$/);
req.keys().forEach((key) => {
  commons.push(key.replace(/\.\/(.*)\.yml/, '$1'));
});

const lang = window.location.href
  .split('/')[(process.env.BASE_URL === '' || (window.location.href.match(/\//g)).length === 3) ? 3 : 4]
  .substr(0, 2)
  .toLowerCase() || '';
document.getElementsByTagName('html')[0].setAttribute('lang', lang);
const userLang = navigator.languages
  || [navigator.language || navigator.userLanguage];
let defaultRouteLang = '';

const messages = {};
const numberFormats = {};
messages.locales = require('../node_modules/vuefs-commons/app/locales/lang.yml'); // eslint-disable-line
messages.locales.available = Object
  .keys(messages.locales)
  .filter(n => Object.keys(locales).includes(n)
    && (locales[n].includes('main') || locales[n].includes('_main')));
messages.locales.visible = Object
  .keys(messages.locales)
  .filter(n => Object.keys(locales).includes(n) && (locales[n].includes('_main')));

// Data import
let data = {};
let project = {};
const scripts = document.getElementsByTagName('script');
project = require('./data/project.yml') || {}; // eslint-disable-line
if (Array.isArray(project.commons) && project.commons.length > 0) {
  [commons] = [project.commons];
}
for (let i = 0; i < commons.length; i += 1) {
  req = require(`../node_modules/vuefs-commons/app/data/commons/${commons[i]}.yml`) || {}; // eslint-disable-line
  data[commons[i]] = merge.$(data[commons[i]], JSON.parse(JSON.stringify(req)));
}
data = merge.$(data, JSON.parse(JSON.stringify(project)));

Object.assign(data, {
  host: window.location.host,
  url: window.location.href,
  '/': `/${process.env.BASE_URL.replace(/(.+)/, '$1/')}`,
  inframe: window.top.location !== window.self.document.location ? 'true' : 'false',
  hash: window.location.hash.replace('#', ''),
  date: process.env.DATE,
  year: {
    current: (new Date().getFullYear()).toString(),
    next: (new Date().getFullYear() + 1).toString(),
  },
});
data.self = new URL(scripts[scripts.length - 1].src, data.url).href;
if (process.env.NODE_ENV === 'production'
  && data.meta.canonical !== undefined
  && /^http/.test(data.meta.canonical)) {
  data.baseurl = data.meta.canonical.replace(/(.+?)\/?$/, '$1/');
} else {
  data.baseurl = `${data.self.split('/').slice(0, -1).join('/')}/`;
}

const routes = [];
let msg = {};
// Import locales
messages.locales.available.forEach((k) => {
  /* eslint-disable */
  messages[k] = {};
  messages[k].lang = k;

  numberFormats[k] = {};
  numberFormats[k].eur = {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  };

  // Import data
  msg = {txt: {}, html: {}};
  msg = merge.$(msg, JSON.parse(JSON.stringify(data)));

  const mainFile = locales[k].filter(filename => /^_?main$/.test(filename));
  if (mainFile.length > 0) {
    // Init with ../node_modules/vuefs-commons/app/locales/lg/_commons.yml
    req = require(`../node_modules/vuefs-commons/app/locales/${k}/_commons.yml`) || {};
    msg = merge.$(msg, JSON.parse(JSON.stringify(req)));
    // then import locales/lg/_main.yml (active and visible)
    // or locales/lg/main.yml (active and hidden)
    req = require(`./locales/${k}/${mainFile[0]}.yml`) || {};
    msg = merge.$(msg, JSON.parse(JSON.stringify(req)));
  }

  // locales/lg/*.yml
  for (let i = 0; i < locales[k].length; i += 1) {
    const file = locales[k][i];
    if (!/^_?main$/.test(file)) {
      msg[file] = msg[file] || {};
      req = require(`./locales/${k}/${file}.yml`) || {};
      msg[file] = merge.$(msg[file], JSON.parse(JSON.stringify(req)));
    }
  }

  Object.keys(msg.color).forEach((j) => {
    if (msg.txt[j] === undefined) {
      const tmp = document.createElement('div');
      tmp.innerHTML = msg.color[j];
      msg.txt[j] = tmp.textContent || tmp.innerText;
    }
  });
  Object.keys(msg.link).forEach((j) => {
    if (msg.html[j] === undefined) {
      if (msg.color[j] !== undefined) {
        msg.html[j] = `<a href="@:link.${j}">@:color.${j}</a>`;
      } else if (msg.txt[j] !== undefined) {
        msg.html[j] = `<a href="@:link.${j}">@:txt.${j}</a>`;
      }
    }
  });
  messages[k] = merge.$(messages[k], msg);
  /* eslint-enable */

  // Localized routes
  for (let j = 0; j < pages.length; j += 1) {
    const component = require(`./components/pages/${pages[j]}.vue`); // eslint-disable-line
    routes.push({
      path: `/${k}${pages[j].toLowerCase().replace(/^/, '/').replace('/home', '')}`,
      component: component.default,
      meta: { id: pages[j].toLowerCase(), lang: k },
    });
  }
});

// define defaultRouteLang
for (let j = 0; j < userLang.length; j += 1) { // check if user locales
  const lg = userLang[j].substring(0, 2).toLowerCase();
  if (defaultRouteLang === '' && Object.keys(locales).includes(lg)) { // matches with app locales
    defaultRouteLang = lg;
  }
}

// Redirections
for (let i = 0; i < pages.length; i += 1) {
  if (!window.vuefsPrerender) {
    routes.push({
      path: `/${pages[i].toLowerCase().replace('home', '')}`,
      redirect: `/${defaultRouteLang}/${pages[i].toLowerCase().replace('home', '')}`,
    });
  } else {
    // Component needed for SEO
    const component = require(`./components/pages/${pages[i]}.vue`); // eslint-disable-line
    routes.push({
      path: `/${pages[i].toLowerCase().replace('home', '')}`,
      component: component.default,
    });
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: lang === '' ? defaultRouteLang : lang,
  fallbackLocale: defaultLocale,
  messages,
  numberFormats,
  silentTranslationWarn: true,
});

// Override $t() for markdown and formatting
Vue.prototype.$t = (key, locale, values) => {
  let translated = '';
  let trueLocale = '';
  let options = '';

  if (typeof locale === 'string') {
    // Split locale and options
    if (i18n.messages.locales.available.indexOf(locale.split(' ')[0]) > 0) {
      // locale = 'en_GB -t', 'fr_FR latin'…
      [trueLocale] = [locale.split(' ')[0]];
      options = locale.substring(locale.indexOf(' ') + 1);
    } else {
      // locale = '-t', 'latin'…
      trueLocale = i18n.locale;
      options = locale;
    }

    if (/^-.*?k.*?$/.test(options)) {
      // -k means we only want to keep the key or text/html to format
      translated = key;
    } else {
      // we want to format the translation
      translated = i18n.t(key, trueLocale, values);
    }
  } else {
    // "locale" is missing so, in fact, it is a "value"
    translated = (Array.isArray(values) || typeof values === 'object')
      ? i18n.t(key, undefined, values)
      : i18n.t(key, undefined, locale);
  }

  let formatted = typeof translated === 'string'
    ? translated
      // Translate :emoji:
      .replace(/:((?!.*--.*|.*__.*)[a-z0-9_-]+?):/g, (c, $1) => {
        if (i18n.te(`emoji['${$1}']`)) {
          return i18n.t(`emoji['${$1}']`);
        }
        return `:${$1}:`;
      })
      // Translate linked @:key or @:(key)
      // (cf linkKeyMatcher in vue-i18n/src/index.js)
      .replace(/@:\(?([\w\-_|.]+[\w\-_|]+)\)?/g, (c, $1) => i18n.t($1))
      // Line break for md (maybe not very useful)
      .replace(/  \n/g, '  \n') // eslint-disable-line no-irregular-whitespace
      .replace(`${data.baseurl}/`, data.baseurl)
    : translated;

  // Convert to Markdown
  if (typeof formatted === 'string' && !/^https?:\/\//.test(formatted)) {
    formatted = (/\n\n/.test(formatted))
      ? marked(formatted)
      // marked convert single string to paragraphs
      // or to ordered list
      // so cleaning is needed
      : marked(formatted)
        .replace(/^<p>(.*?)<\/p>\n?$/sm, '$1')
        .replace(/^<ol(.*?)>\n<li>(.*?)<\/li>\n<\/ol>\n?$/sm,
          (c, $1, $2) => `${$1 ? $1.replace(/[^0-9]/g, '') : '1'}. ${$2}`);
  }

  // Formatting options
  if (options !== '') {
    // -t or text (html cleanup)
    if (/text/.test(options) || /^-.*?t.*?$/.test(options)) {
      const tmp = new DOMParser().parseFromString(formatted, 'text/html');
      formatted = tmp.body.textContent || '';
    }
    // -L or latin (remove diacritics)
    if (/latin/.test(options) || /^-.*?L.*?$/.test(options)) {
      formatted = deburr(formatted);
    }
    // -l (lowercase)
    if (/^-.*?l.*?$/.test(options)) {
      formatted = formatted.toLowerCase();
    }
    // -U (uppercase)
    if (/^-.*?U.*?$/.test(options)) {
      formatted = formatted.toUpperCase();
    }
    // -K (capitalize)
    if (/^-.*?K.*?$/.test(options)) {
      formatted = formatted.replace(/^./, v => v.toUpperCase());
    }
    if (/sanitize/.test(options) || /^-.*?@.*?$/.test(options)) {
      formatted = formatted.toLowerCase().trim()
        .replace(/@:[.a-z]+ /g, '') // remove vue-i18n var
        .replace(/[ '’]/g, '-')
        .replace(/[^a-zA-Z0-9-_.]/g, '');
    }
    if (/noframa/.test(options) || /^-.*?~.*?$/.test(options)) {
      formatted = formatted.replace('framand', 'and')
        .replace('framage', 'age')
        .replace('framae', 'mae')
        .replace('framin', 'min')
        .replace('frame', 'me')
        .replace('frama', '')
        .replace('.', '')
        .replace('my', 'myframa');
    }
  }
  return formatted;
};

// Framanav
if (!window.vuefsPrerender
  && document.querySelectorAll('script[src$="nav.js"]').length < 1
  && process.env.NODE_ENV !== 'development') {
  const nav = document.createElement('script');
  nav.src = 'https://framasoft.org/nav/nav.js';
  document.getElementsByTagName('head')[0].appendChild(nav);
}

// Routes
const router = new VueRouter({
  base: `${__dirname}${process.env.BASE_URL}`,
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        offset: { x: 0, y: 60 },
      };
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  i18n,
  mounted() {
    // You'll need this for renderAfterDocumentEvent.
    document.dispatchEvent(new Event('render-event'));
  },
  render: h => h(App),
});
