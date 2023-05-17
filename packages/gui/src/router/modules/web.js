import BlankView from "@/layouts/BlankView";
import {
  IeOutlined,
	DashboardOutlined,
} from "@ant-design/icons-vue";
const web = {
  path: "web",
  name: "Website",
  component: BlankView,
  meta: {
    icon: IeOutlined,
  },
  children: [
    {
      path: "dashboard",
      name: "Web Dashboard",
      meta: {
        icon: DashboardOutlined,
      },
      component: () => import("@/pages/web/Dashboard"),
    },
    {
      path: "website/list",
      name: "Website List",
      meta: {
        disabled: false,
        icon: IeOutlined,
      },
      component: () => import("@/pages/web/WebsiteList"),
    },
    {
      path: "website/detail/:id",
      name: "Website Detail",
      meta: {
        disabled: false,
        invisible: true,
      },
      component: () => import("@/pages/web/WebsiteDetail"),
    },
    {
      path: "website/create",
      name: "Website Create",
      meta: {
        disabled: false,
        invisible: true,
      },
      component: () => import("@/pages/web/WebsiteDetail"),
    },
  ],
};

export default web;
