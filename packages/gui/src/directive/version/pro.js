function checkPro(el) {
  if (process.env.VUE_APP_VERSION != "pro") {
    el.parentNode && el.parentNode.removeChild(el);
  }
}

export default {
  mounted(el) {
    checkPro(el);
  },
  updated(el) {
    checkPro(el);
  },
};
