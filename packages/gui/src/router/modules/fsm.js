import BlankView from "@/layouts/BlankView";
import {
  NumberOutlined,
  DeploymentUnitOutlined,
  HistoryOutlined,
	DashboardOutlined,
  LoginOutlined,
  LogoutOutlined,
	CloudDownloadOutlined,
} from "@ant-design/icons-vue";
import OsmSvg from "@/assets/img/osm.svg";
import ServiceSvg from "@/assets/img/service.png";

const fsm = {
  path: "fsm",
  name: "Service Mesh",
  component: BlankView,
  meta: {
    icon: NumberOutlined,
  },
  children: [
    {
      path: "dashboard",
      name: "FSM Dashboard",
      meta: {
        icon: DashboardOutlined,
      },
      component: () => import("@/pages/fsm/dashboard/Dashboard"),
    },
    {
      path: "topology",
      name: "FSM Topology",
      meta: {
        icon: DeploymentUnitOutlined,
      },
      component: () => import("@/pages/fsm/topology/Topology"),
    },
    {
      path: "waterfall/list",
      name: "Waterfall",
      meta: {
        icon: HistoryOutlined,
      },
      component: () => import("@/pages/fsm/network/NetworkView"),
    },
    {
      path: "waterfall/detail/:id",
      name: "Waterfall Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/fsm/network/NetworkDetail"),
    },
    {
      path: "service/list",
      name: "Services",
      meta: {
        svg: ServiceSvg,
      },
      component: () => import("@/pages/fsm/Services"),
    },
    {
      path: "service/detail/:namespace/:id",
      name: "Service Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/fsm/ServiceDetail"),
    },
    {
      path: "service/imports",
      name: "Service Imports",
      meta: {
        icon: CloudDownloadOutlined,
      },
      component: () => import("@/pages/fsm/ServiceImports"),
    },
    {
      path: "service/create",
      name: "Service Create",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/fsm/ServiceDetail"),
    },
    {
      path: "ingress/list",
      name: "Ingress",
      meta: {
        icon: LoginOutlined,
      },
      component: () => import("@/pages/fsm/Ingress"),
    },
    {
      path: "ingress/detail/:id",
      name: "Ingress Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/fsm/IngressDetail"),
    },
    {
      path: "ingress/create",
      name: "Ingress Create",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/fsm/IngressDetail"),
    },
    {
      path: "egress/list",
      name: "Egress",
      meta: {
        icon: LogoutOutlined,
        invisible: true,
      },
      component: () => import("@/pages/fsm/Egress"),
    },
    {
      path: "egress/detail/:namespace/:id",
      name: "Egress Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/fsm/EgressDetail"),
    },
    {
      path: "egress/create",
      name: "Egress Create",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/fsm/EgressDetail"),
    },
    {
      path: "mesh/list",
      name: "Meshes",
      meta: {
        invisible: localStorage.getItem("SCHEMA_TYPE") != "k8s",
        svg: OsmSvg,
      },
      component: () => import("@/pages/fsm/Meshs"),
    },
    {
      path: "mesh/detail/:id",
      name: "Mesh Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/fsm/MeshDetail"),
    },
  ],
};

export default fsm;
