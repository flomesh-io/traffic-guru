import MiniArea from "@/components/chart/MiniArea";
import RingStatus from "@/components/chart/RingStatus";
import TotalChart from "@/components/chart/TotalChart";

//fsm
import TopologyChart from "@/components/chart/fsm/TopologyChart";
import McsTopologyChart from "@/components/chart/fsm/McsTopologyChart";
import AreaChart from "@/components/chart/fsm/AreaChart";
import BpsChart from "@/components/chart/fsm/BpsChart";
import DelayChart from "@/components/chart/fsm/DelayChart";
import QoSSummaryChart from "@/components/chart/fsm/QoSSummaryChart";
import StatusChart from "@/components/chart/fsm/StatusChart";

import fsm_svc from "@/services/fsm.js";
import com_svc from "@/services/common.js";
import clickhouse_svc from "@/services/clickhouse.js";

const fsm = {
  dashboard: {
    SERVICE_TOTAL: {
      title: "Services",
      tag: TotalChart,
      col: 6,
      service: fsm_svc.getServicesSummary,
      className: "card nopd",
      data: (res) => {
        return {
          config: {
            icon: require("@/assets/img/service.png"),
            total: res.services.total,
            unit: "unitge",
          },
        };
      },
    },
    NAMESPACE_TOTAL: {
      title: "Namespace",
      tag: TotalChart,
      col: 6,
      service: fsm_svc.getNamespacesSummary,
      className: "card nopd",
      data: (res) => {
        return {
          config: {
            icon: require("@/assets/img/namespace.svg"),
            total: res.aggregate.totalCount,
            unit: "unitge",
          },
        };
      },
    },
    SERVICE_MESH_TOTAL: {
      title: "Mesh Services",
      tag: TotalChart,
      col: 6,
      service: com_svc.getCount("mesh", "services"),
      className: "card nopd",
      data: (res) => {
        return {
          config: {
            icon: require("@/assets/img/service.png"),
            total: res.aggregate.totalCount,
            unit: "unitge",
          },
        };
      },
    },
    NAMESPACE_MESH_TOTAL: {
      title: "Mesh Namespace",
      tag: TotalChart,
      col: 6,
      service: com_svc.getCount("mesh", "namespaces"),
      className: "card nopd",
      data: (res) => {
        return {
          config: {
            icon: require("@/assets/img/namespace.svg"),
            total: res.aggregate.totalCount,
            unit: "unitge",
          },
        };
      },
    },
    REGISTRY_TOTAL: {
      title: "Registry",
      tag: TotalChart,
      col: 6,
      service: fsm_svc.getRegistriesSummary,
      className: "card nopd",
      data: (res) => {
        return {
          config: {
            icon: require("@/assets/img/registry.svg"),
            total: res.registries.total,
            unit: "unitge",
          },
        };
      },
    },
    SERVICE_HEALTHCHECK: {
      title: "Service - Healthcheck",
      tag: MiniArea,
      col: process.env.VUE_APP_VERSION == "pro" ? 6 : -1,
      service: fsm_svc.getHealthchecksChart,
      className: "card nopd",
      data: (res) => {
        return {
          id: "SERVICE_HEALTHCHECK",
          colors: ["#8bd4a1", "#fb9690"],
          height: 240,
          padding: [0, 0, 0, 0],
          axis: false,
          unit: "个",
          showy: false,
          dv: res.healthchecks_timer,
        };
      },
    },
    SERVICE_STATUS: {
      title: "Service - Healthcheck",
      tag: RingStatus,
      col: process.env.VUE_APP_VERSION == "pro" ? 6 : -1,
      service: fsm_svc.getServicesHealthSummary,
      className: "card nopd",
      data: (res) => {
        return {
          id: "Service-Healthcheck",
          total: res.healthchecks.health * 1 + res.healthchecks.unhealthy * 1,
          unit: "个",
          vals: [res.healthchecks.health * 1, res.healthchecks.unhealthy * 1],
        };
      },
    },
    SIDECAR_STATUS: {
      title: "Sidecar - Healthcheck",
      tag: RingStatus,
      col: process.env.VUE_APP_VERSION == "pro" ? 6 : -1,
      service: fsm_svc.getIngressHealthSummary,
      className: "card nopd",
      data: (res) => {
        return {
          id: "Sidecar-Healthcheck",
          total: res.healthchecks.health * 1 + res.healthchecks.unhealthy * 1,
          unit: "个",
          vals: [res.healthchecks.health * 1, res.healthchecks.unhealthy * 1],
        };
      },
    },
    INGRESS_STATUS: {
      title: "Ingress - Healthcheck",
      tag: RingStatus,
      col: process.env.VUE_APP_VERSION == "pro" ? 6 : -1,
      service: fsm_svc.getIngressHealthSummary,
      className: "card nopd",
      data: (res) => {
        return {
          id: "Ingress-Healthcheck",
          total: res.healthchecks.health * 1 + res.healthchecks.unhealthy * 1,
          unit: "个",
          vals: [res.healthchecks.health * 1, res.healthchecks.unhealthy * 1],
        };
      },
    },
    TOPOLOGY: {
      title: "Topology",
      tag: TopologyChart,
      col: 18,
      timer: 10000,
      provide: "clickhouse",
      service: clickhouse_svc.getTopoData,
      className: "card nopd",
      data: clickhouse_svc.setTopoData(),
    },
    MCS_TOPOLOGY: {
      title: "MCS Topology",
      tag: McsTopologyChart,
      col: 24,
      timer: 10000,
      service: fsm_svc.getTopoSvc,
      className: "card nopd",
      data: fsm_svc.setTopoSvcData,
    },
    TPS_ERROR: {
      title: "TPS/Error",
      tag: AreaChart,
      provide: "clickhouse",
      col: 6,
      className: "card nopd",
      data: () => {
        return {
          where: "",
        };
      },
    },
    BPS: {
      title: "BPS",
      tag: BpsChart,
      provide: "clickhouse",
      col: 6,
      className: "card nopd",
      data: () => {
        return {
          where: "",
        };
      },
    },
    LATENCY: {
      title: "Latency",
      tag: DelayChart,
      provide: "clickhouse",
      col: 6,
      className: "card nopd",
      data: () => {
        return {
          where: "",
        };
      },
    },
    QOS: {
      title: "QoS Summary",
      tag: QoSSummaryChart,
      provide: "clickhouse",
      col: 6,
      className: "card nopd",
      data: () => {
        return {
          where: "",
        };
      },
    },
    LOAD_STATUS: {
      title: "Load Status",
      tag: StatusChart,
      provide: "clickhouse",
      col: 6,
      className: "card nopd",
      data: () => {
        return {
          where: "",
        };
      },
    },
  },
};

export default fsm;
