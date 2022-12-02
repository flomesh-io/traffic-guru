import BlankView from "@/layouts/BlankView";
import {
  RadarChartOutlined,
  DashboardOutlined,
  HddOutlined,
  SafetyOutlined,
  CloudSyncOutlined,
  BorderOutlined,
  BlockOutlined,
  ControlOutlined,
  FlagOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons-vue";

const workload = {
  path: "workload",
  name: "Workload",
  component: BlankView,
  meta: {
    invisible: localStorage.getItem("SCHEMA_TYPE") != "k8s",
    icon: RadarChartOutlined,
  },
  children: [
    {
      path: "dashboard",
      name: "Workload Dashboard",
      meta: {
        icon: DashboardOutlined,
        authority: "dashboard:find",
      },
      component: () => import("@/pages/workload/Dashboard"),
    },
    {
      path: "cronjob/list",
      name: "Cron Jobs",
      meta: {
        icon: HddOutlined,
      },
      component: () => import("@/pages/workload/CronJobs"),
    },
    {
      path: "cronjob/detail/:namespace/:id",
      name: "Cron Job Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/workload/CronJobsDetail"),
    },
    {
      path: "daemonset/list",
      name: "Daemon Sets",
      meta: {
        icon: SafetyOutlined,
      },
      component: () => import("@/pages/workload/DaemonSets"),
    },
    {
      path: "daemonset/detail/:namespace/:id",
      name: "Daemon Set Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/workload/DaemonSetsDetail"),
    },
    {
      path: "deployment/list",
      name: "Deployments",
      meta: {
        icon: CloudSyncOutlined,
      },
      component: () => import("@/pages/workload/Deployments"),
    },
    {
      path: "deployment/detail/:namespace/:id",
      name: "Deployment Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/workload/DeploymentsDetail"),
    },
    {
      path: "job/list",
      name: "Jobs",
      meta: {
        icon: HddOutlined,
      },
      component: () => import("@/pages/workload/Jobs"),
    },
    {
      path: "job/detail/:namespace/:id",
      name: "Job Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/workload/JobsDetail"),
    },
    {
      path: "pod/list",
      name: "Pods",
      meta: {
        icon: BorderOutlined,
      },
      component: () => import("@/pages/workload/Pods"),
    },
    {
      path: "pod/detail/:namespace/:id",
      name: "Pod Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/workload/PodsDetail"),
    },
    {
      path: "replicaset/list",
      name: "Replica Sets",
      meta: {
        icon: BlockOutlined,
      },
      component: () => import("@/pages/workload/ReplicaSets"),
    },
    {
      path: "replicaset/detail/:namespace/:id",
      name: "Replica Set Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/workload/ReplicaSetsDetail"),
    },
    {
      path: "replication-controller/list",
      name: "Replication Controllers",
      meta: {
        icon: ControlOutlined,
      },
      component: () => import("@/pages/workload/ReplicationControllers"),
    },
    {
      path: "replication-controller/detail/:namespace/:id",
      name: "Replication Controller Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/workload/ReplicationControllersDetail"),
    },
    {
      path: "statefulset/list",
      name: "Stateful Sets",
      meta: {
        icon: FlagOutlined,
      },
      component: () => import("@/pages/workload/StatefulSet"),
    },
    {
      path: "statefulset/detail/:namespace/:id",
      name: "Stateful Set Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/workload/StatefulSetDetail"),
    },
    {
      path: "secret/list",
      name: "Secrets",
      meta: {
        invisible: true,
        icon: SecurityScanOutlined,
      },
      component: () => import("@/pages/workload/Secrets"),
    },
    {
      path: "secret/detail/:namespace/:id",
      name: "Secret Detail",
      meta: {
        invisible: true,
      },
      component: () => import("@/pages/workload/SecretsDetail"),
    },
  ],
};

export default workload;
