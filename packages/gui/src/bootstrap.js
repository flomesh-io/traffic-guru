import { loadRoutes, loadGuards, setAppOptions } from "@/utils/routerUtil";
import { loadInterceptors } from "@/utils/request";
import guards from "@/router/guards";
import interceptors from "@/utils/axios-interceptors";

function bootstrap({ router, store, i18n, message }) {
  setAppOptions({ router, store, i18n });
  loadInterceptors(interceptors, { router, store, i18n, message });
  loadRoutes();
  loadGuards(guards, { router, store, i18n, message });
}

export default bootstrap;
