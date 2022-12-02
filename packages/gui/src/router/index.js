import { createRouter, createWebHashHistory } from "vue-router";
import { formatRoutes } from "@/utils/routerUtil";

const loginIgnore = {
  names: ["404", "403"],
  paths: ["/login"],
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.path);
  },
};

async function initRouter() {
  let _append = process.env.VUE_APP_VERSION == "pro" ? ".pro" : "";
  const options = require(`@/router/config${_append}`).default;
  await formatRoutes(options.routes);
  options.history = createWebHashHistory();
  return createRouter(options);
}

export { loginIgnore, initRouter };
