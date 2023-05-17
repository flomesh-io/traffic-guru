import BlankView from "@/layouts/BlankView";
import {
  MonitorOutlined,
  ReadOutlined,
  AlertOutlined,
  BuildOutlined,
  FileProtectOutlined,
} from "@ant-design/icons-vue";
import RegistrySvg from "@/assets/img/registry.svg";

const opscenter = {
  path: "ops-center",
  name: "Ops Center",
  component: BlankView,
  meta: {
    icon: MonitorOutlined,
  },
  children: [
    {
      path: "registry/list",
      name: "Registry",
      meta: {
        svg: RegistrySvg,
      },
      component: () => import("@/pages/opscenter/RegistryList"),
    },
    {
      path: "registry/create",
      name: "Registry Create",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/opscenter/RegistryDetail"),
    },
    {
      path: "registry/detail/:id",
      name: "Registry Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/opscenter/RegistryDetail"),
    },
    {
      path: "certificates",
      name: "Certificates",
      meta: {
        icon: FileProtectOutlined,
      },
      component: () => import("@/pages/opscenter/Certificates"),
    },
		{
			path: "components",
			name: "Components",
			meta: {
				icon: BuildOutlined,
			},
			component: () => import("@/pages/opscenter/Components"),
		},
		{
			path: "events",
			name: "Events",
			meta: {
				icon: AlertOutlined,
			},
			component: () => import("@/pages/opscenter/EventList"),
		},
		{
			path: "log",
			name: "Log",
			meta: {
				icon: ReadOutlined,
			},
			component: () => import("@/pages/opscenter/LogList"),
		},
  ],
};

export default opscenter;
