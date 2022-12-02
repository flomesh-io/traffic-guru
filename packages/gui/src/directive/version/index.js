import pro from "./pro";
import free from "./free";

const proInstall = function (Vue) {
  Vue.directive("pro", pro);
};

const freeInstall = function (Vue) {
  Vue.directive("free", free);
};

if (window.Vue) {
  window["pro"] = pro;
  window["free"] = free;
  Vue.use(proInstall);
  Vue.use(freeInstall);
}

pro.install = proInstall;
free.install = freeInstall;
export default { pro, free };
