export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, 'cookie', {
      value: (action, name, value, time) => {
        if (action === 'w') {
          const t = typeof time !== 'undefined' ? time : 31536000000; // 365 * 24 * 60 * 60 * 1000
          const today = new Date();
          const expires = new Date();
          expires.setTime(today.getTime() + t);
          document.cookie = [name, '=', encodeURIComponent(value), ';expires=', expires.toGMTString()].join('');
        } else {
          const oRegex = new RegExp(['(?:; )?', name, '=([^;]*);?'].join(''));
          if (oRegex.test(document.cookie)) {
            return decodeURIComponent(RegExp.$1);
          }
        }
        return null;
      },
    });
  },
};
