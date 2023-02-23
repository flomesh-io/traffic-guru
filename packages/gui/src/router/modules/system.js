import BlankView from "@/layouts/BlankView";
import {
  SettingOutlined,
  LayoutOutlined,
  PartitionOutlined,
  ProjectOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  BuildOutlined,
} from "@ant-design/icons-vue";

const system = {
  path: "system",
  name: "System",
  component: BlankView,
  meta: {
    icon: SettingOutlined,
  },
  children: [
    {
      path: "dashboard/list",
      name: "Dashboard Setting",
      meta: {
        authority: "dashboard:find",
        icon: LayoutOutlined,
      },
      component: () => import("@/pages/system/DashboardList"),
    },
    {
      path: "dashboard/detail/:id",
      name: "Dashboard Detail",
      meta: {
        authority: "dashboard:find",
        invisible: true,
      },
      component: () => import("@/pages/system/DashboardDetail"),
    },
    {
      path: "dashboard/create",
      name: "Dashboard Create",
      meta: {
        authority: "dashboard:create",
        invisible: true,
      },
      component: () => import("@/pages/system/DashboardDetail"),
    },
    {
      path: "organizations/list",
      name: "Organizations",
      meta: {
        authority: "organization:find",
        icon: PartitionOutlined,
      },
      component: () => import("@/pages/system/Organizations"),
    },
    {
      path: "organizations/detail/:id",
      name: "Organization Detail",
      meta: {
        authority: "organization:find",
        invisible: true,
      },
      component: () => import("@/pages/system/OrganizationDetail"),
    },
    {
      path: "projects/list",
      name: "Projects",
      meta: {
        icon: ProjectOutlined,
        authority: "project:find",
      },
      component: () => import("@/pages/system/Projects"),
    },
    {
      path: "projects/detail/:id",
      name: "Project Detail",
      meta: {
        authority: "project:find",
        invisible: true,
      },
      component: () => import("@/pages/system/ProjectDetail"),
    },
    {
      path: "projects/create",
      name: "Project Create",
      meta: {
        authority: "project:find",
        invisible: true,
      },
      component: () => import("@/pages/system/ProjectDetail"),
    },
    {
      path: "roles",
      name: "Roles",
      meta: {
        icon: CustomerServiceOutlined,
        authority: "role:find",
      },
      component: () => import("@/pages/system/Roles"),
    },
    {
      path: "users",
      name: "Users",
      meta: {
        icon: TeamOutlined,
        authority: "user:find",
      },
      component: () => import("@/pages/system/Users"),
    },
    {
      path: "widget/list",
      name: "UI Widgets",
      meta: {
        authority: "widget:find",
        icon: BuildOutlined,
      },
      component: () => import("@/pages/system/Widgets"),
    },
    {
      path: "widget/creator",
      name: "UI Widget Creator",
      meta: {
        authority: "widget:find",
        invisible: true,
      },
      component: () => import("@/pages/system/WidgetEditor"),
    },
    {
      path: "widget/editor/:id",
      name: "UI Widget Editor",
      meta: {
        authority: "widget:find",
        invisible: true,
      },
      component: () => import("@/pages/system/WidgetEditor"),
    },
    {
      path: "widget/preview/:name",
      name: "UI Widget Preview",
      meta: {
        authority: "widget:find",
        invisible: true,
      },
      component: () => import("@/pages/system/WidgetEditor"),
    },
  ],
};

export default system;
