/*
  merge() need to be called in index.js and in components
  TODO:
  - avoid duplicate recursive() code
  - remove merge.$() alias (used in index.js)
*/
const merge = {
  recursive(o1, o2) {
    const o3 = o1;
    Object.keys(o2).forEach((p) => {
      try {
        if (o2[p].constructor === Object) {
          o3[p] = this.recursive(o3[p], o2[p]);
        } else if (o2[p].constructor === Array) {
          for (let i = 0; i < o2[p].length; i += 1) {
            o3[p][i] = o2[p][i];
          }
        } else {
          o3[p] = o2[p];
        }
      } catch (e) {
        o3[p] = o2[p];
      }
    });
    return o3;
  },
  $(a, b) {
    const recursive = (o1, o2) => {
      const o3 = o1;
      Object.keys(o2).forEach((p) => {
        try {
          if (o2[p].constructor === Object) {
            o3[p] = this.recursive(o3[p], o2[p]);
          } else if (o2[p].constructor === Array) {
            for (let i = 0; i < o2[p].length; i += 1) {
              o3[p][i] = o2[p][i];
            }
          } else {
            o3[p] = o2[p];
          }
        } catch (e) {
          o3[p] = o2[p];
        }
      });
      return o3;
    };

    const A = a === undefined ? {} : a;
    const B = b === undefined ? {} : b;

    // Copy String
    if (typeof B === 'string') {
      return B;
    }
    // Merge Arrays
    if (A.constructor === Array && B.constructor === Array) {
      return [...new Set([].concat(...[A, B]))];
    }
    // Merge Objects
    const o1 = Object.assign({}, A);
    const o2 = Object.assign({}, B);
    recursive(o1, o2);
    return o1;
  },
  install(Vue) {
    Object.defineProperty(Vue.prototype, 'merge', { value: this.$ });
  },
};
export default merge;
