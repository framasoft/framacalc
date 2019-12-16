export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, 'is', {
      value: {
        email(emailAddress) { // RegEx from https://emailregex.com/
          const pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
          return !!pattern.test(emailAddress);
        },
        before(date) {
          return new Date(new Date().toDateString()) < new Date(date);
        },
        after(date) {
          return new Date(new Date().toDateString()) > new Date(date);
        },
      },
    });
  },
};
