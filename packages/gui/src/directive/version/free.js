function checkFree(el) {
  if (process.env.VUE_APP_VERSION != "free") {
    el.parentNode && el.parentNode.removeChild(el);
  }
}

export default {
  mounted(el) {
    checkFree(el);
  },
  updated(el) {
    checkFree(el);
  },
};
