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
        icon: LayoutOutlined,
      },
      component: () => import("@/pages/system/DashboardList"),
    },
    {
      path: "dashboard/detail/:id",
      name: "Dashboard Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/system/DashboardDetail"),
    },
    {
      path: "dashboard/create",
      name: "Dashboard Create",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/system/DashboardDetail"),
    },
    {
      path: "organizations/list",
      name: "Organizations",
      meta: {
        icon: PartitionOutlined,
      },
      component: () => import("@/pages/system/Organizations"),
    },
    {
      path: "organizations/detail/:id",
      name: "Organization Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/system/OrganizationDetail"),
    },
    {
      path: "projects/list",
      name: "Projects",
      meta: {
        icon: ProjectOutlined,
      },
      component: () => import("@/pages/system/Projects"),
    },
    {
      path: "projects/detail/:id",
      name: "Project Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/system/ProjectDetail"),
    },
    {
      path: "projects/create",
      name: "Project Create",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/system/ProjectDetail"),
    },
    {
      path: "roles/list",
      name: "Roles",
      meta: {
        icon: CustomerServiceOutlined,
      },
      component: () => import("@/pages/system/Roles"),
    },
    {
      path: "roles/detail/:id",
      name: "Role Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/system/RoleDetail"),
    },
    {
      path: "roles/create",
      name: "Role Create",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/system/RoleDetail"),
    },
    {
      path: "users",
      name: "Users",
      meta: {
        icon: TeamOutlined,
      },
      component: () => import("@/pages/system/Users"),
    },
    {
      path: "widget/list",
      name: "UI Widgets",
      meta: {
        icon: BuildOutlined,
      },
      component: () => import("@/pages/system/Widgets"),
    },
    {
      path: "widget/creator",
      name: "UI Widget Creator",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/system/WidgetEditor"),
    },
    {
      path: "widget/editor/:id",
      name: "UI Widget Editor",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/system/WidgetEditor"),
    },
    {
      path: "widget/preview/:name",
      name: "UI Widget Preview",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/system/WidgetEditor"),
    },
  ],
};

export default system;
