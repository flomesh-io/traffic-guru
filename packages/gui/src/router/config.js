import _ from "lodash";
import TabsView from "@/layouts/tabs/TabsView";
import workplace from "./modules/workplace";
import fsm from "./modules/fsm";
import system from "./modules/system";
import workload from "./modules/workload";
import usercenter from "./modules/usercenter";
import opscenter from "./modules/opscenter";
import web from "./modules/web";
import routersetting from "./modules/routersetting";

const options = {
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/pages/login"),
    },
    {
      path: "/:pathMatch(.*)",
      name: "404",
      component: () => import("@/pages/exception/404"),
    },
    {
      path: "/403",
      name: "403",
      component: () => import("@/pages/exception/403"),
    },
    {
      path: "/",
      name: "Home",
      component: TabsView,
      redirect: "/workplace",
      children: [
        { ...workplace },
        { ...fsm },
        { ...workload },
        { ...opscenter },
        { ...usercenter },
				{ ...web },
        { ...system },
        { ...routersetting },
      ],
    },
  ],
};

options.initRoutes = _.cloneDeep(options.routes);
export default options;
