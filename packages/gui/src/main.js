import { createApp } from "vue";
import App from "./App.vue";
import { initRouter } from "./router";
import "./theme/index.less";
import Antd from "ant-design-vue";
import { message } from "ant-design-vue";
import store from "./store";
import "animate.css/source/animate.css";
import Plugins from "@/plugins";
import { initI18n } from "@/utils/i18n";
import bootstrap from "@/bootstrap";
import "moment/locale/zh-cn";
import { request, METHOD } from "@/utils/request";
import api from "@/services/api";
import { query, mutation } from "@/services/graphql";
import * as echarts from "echarts";
import permission from "@/directive/permission/permission";
import pro from "@/directive/version/pro";
import free from "@/directive/version/free";

import { createFromIconfontCN } from "@ant-design/icons-vue";

const IconFont = createFromIconfontCN({
  scriptUrl: require("@/utils/font.js"),
});
const i18n = initI18n("CN", "US");
const app = createApp(App);
app.use(store);
app.use(i18n);
app.config.productionTip = false;
app.use(Antd);
app.use(Plugins);
app.component("Iconfont", IconFont);
app.directive("permission", permission);
app.directive("pro", pro);
app.directive("free", free);
app.config.globalProperties.$isPro = process.env.VUE_APP_VERSION == "pro";
app.config.globalProperties.$request = request;
app.config.globalProperties.$METHOD = METHOD;
app.config.globalProperties.$DFT_LIMIT = 9999;
app.config.globalProperties.$REST = api;
app.config.globalProperties.$gql = {
  query,
  mutation,
};
app.config.globalProperties.$echarts = echarts;
async function setRouter() {
  const router = await initRouter(store.state.setting.asyncRoutes);
  app.use(router);
  app.mount("#app");
  bootstrap({ router, store, i18n, message });
}
setRouter();
