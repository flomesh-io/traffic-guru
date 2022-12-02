const view = {
  tabs: () => import("@/layouts/tabs"),
  blank: () => import("@/layouts/BlankView"),
  page: () => import("@/layouts/PageView"),
};

const routerMap = {
  login: {
    authority: "*",
    path: "/login",
    component: () => import("@/pages/login"),
  },
  root: {
    path: "/",
    name: "Login",
    redirect: "/login",
    component: view.tabs,
  },
  workplace: {
    name: "Workplace",
    component: () => import("@/pages/workplace"),
  },
  result: {
    name: "Result",
    icon: "check-circle-o",
    component: view.page,
  },
  success: {
    name: "Success",
    component: () => import("@/pages/result/Success"),
  },
  error: {
    name: "Error",
    component: () => import("@/pages/result/Error"),
  },
  exception: {
    name: "Exception",
    icon: "warning",
    component: view.blank,
  },
  exp403: {
    authority: "*",
    name: "exp403",
    path: "403",
    component: () => import("@/pages/exception/403"),
  },
  exp404: {
    name: "exp404",
    path: "404",
    component: () => import("@/pages/exception/404"),
  },
  exp500: {
    name: "exp500",
    path: "500",
    component: () => import("@/pages/exception/500"),
  },
};

export default routerMap;
