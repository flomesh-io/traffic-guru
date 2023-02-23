import { hasAuthority } from "@/utils/authority-utils";
import { loginIgnore } from "@/router/index";
import { checkAuthorization } from "@/utils/request";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getRegistries } from "@/services/common";

NProgress.configure({ showSpinner: true });

/**
 * Progress Start
 * @param to
 * @param form
 * @param next
 */
const progressStart = (to, from, next) => {
  // start progress bar
  if (!NProgress.isStarted()) {
    NProgress.start();
  }
  next();
};

/**
 * K8S Guard
 * @param to
 * @param form
 * @param next
 * @param options
 */
const k8sGuard = (to, from, next) => {
  if (to.fullPath != "/login") {
    if (
      !localStorage.getItem("SCHEMA_ID") ||
      !localStorage.getItem("NAMESPACE")
    ) {
      getRegistries().then((regs) => {
        let k8soptions = regs?.data;
        if (k8soptions.length == 0) {
          next();
        }
        k8soptions.forEach((opt, index) => {
          if (index == 0) {
            localStorage.setItem("SCHEMA_ID", opt.id);
            localStorage.setItem("SCHEMA_TYPE", opt.type);
						localStorage.setItem("NAMESPACE_ID", "");
						localStorage.setItem("NAMESPACE", "_all");
            next();
						// Before use 'default' namespace
            // getK8sNamespaces(opt.id).then((res2) => {
            //   let _data = res2.data || [];
            //   _data.forEach((np, index) => {
            //     if (index == 0) {
            //     }
            //   });
            // });
          }
        });
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

/**
 * Login Guard
 * @param to
 * @param form
 * @param next
 * @param options
 */
const loginGuard = (to, from, next, options) => {
  const { message } = options;
  if (!loginIgnore.includes(to) && !checkAuthorization()) {
    message.warning("Login is invalid, please login again");
    next({ path: "/login" });
  } else {
    next();
  }
};

/**
 * Authority Guard
 * @param to
 * @param form
 * @param next
 * @param options
 */
const authorityGuard = (to, from, next, options) => {
  const { store, message } = options;
  const permissions = store.getters["account/permissions"];
  const role = store.getters["account/roles"];
  if (!hasAuthority(to, permissions, role)) {
    message.warning(
      `Sorry, you have no right to access the page: ${to.fullPath},  please contact the administrator`,
    );
    next({ path: "/403" });
  } else {
    next();
  }
};

/**
 * Redirect Guard
 * @param to
 * @param from
 * @param next
 * @param options
 * @returns {*}
 */
const redirectGuard = (to, from, next, options) => {
  const { store } = options;
  const getFirstChild = (routes) => {
    const route = routes[0];
    if (!route.children || route.children.length === 0) {
      return route;
    }
    return getFirstChild(route.children);
  };
  if (store.state.setting.layout === "mix") {
    const firstMenu = store.getters["setting/firstMenu"];
    if (firstMenu.find((item) => item.fullPath === to.fullPath)) {
      store.commit("setting/setActivatedFirst", to.fullPath);
      const subMenu = store.getters["setting/subMenu"];
      if (subMenu.length > 0) {
        const redirect = getFirstChild(subMenu);
        return next({ path: redirect.fullPath });
      }
    }
  }
  next();
};

/**
 * Progress Done
 * @param to
 * @param form
 * @param options
 */
const progressDone = () => {
  // finish progress bar
  NProgress.done();
};

export default {
  beforeEach: [
    progressStart,
    loginGuard,
    authorityGuard,
    k8sGuard,
    redirectGuard,
  ],
  afterEach: [progressDone],
};
