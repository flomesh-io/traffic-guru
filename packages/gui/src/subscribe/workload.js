import Gauge from "@/components/chart/Gauge";
import workload_svc from "@/services/workload.js";

const workload = {
  dashboard: {
    CRONJOB: {
      title: "Cron Jobs",
      tag: Gauge,
      provide: "k8s",
      service: workload_svc.CRONJOB,
      className: "card nopd",
      col: 6,
      data: (res) => {
        let _data = res.data;
        return {
          id: "WP-CRONJOB",
          format: "{value}",
          vals: [
            { title: "Running", value: _data.status.running, color: "#00adef" },
            {
              title: "Completed",
              value: _data.status.succeeded,
              color: "#8bd4a1",
            },
            { title: "Failed", value: _data.status.failed, color: "#fb9690" },
          ],
        };
      },
    },
    DAEMONSET: {
      title: "Daemon Sets",
      tag: Gauge,
      provide: "k8s",
      service: workload_svc.DAEMONSET,
      className: "card nopd",
      col: 6,
      data: (res) => {
        let _data = res.data;
        return {
          id: "WP-DAEMONSET",
          format: "{value}",
          vals: [
            { title: "Running", value: _data.status.running, color: "#00adef" },
            {
              title: "Completed",
              value: _data.status.succeeded,
              color: "#8bd4a1",
            },
            { title: "Failed", value: _data.status.failed, color: "#fb9690" },
          ],
        };
      },
    },
    DEPLOYMENT: {
      title: "Deployments",
      tag: Gauge,
      provide: "k8s",
      service: workload_svc.DEPLOYMENT,
      className: "card nopd",
      col: 6,
      data: (res) => {
        let _data = res.data;
        return {
          id: "WP-DEPLOYMENT",
          format: "{value}",
          vals: [
            { title: "Running", value: _data.status.running, color: "#00adef" },
            {
              title: "Completed",
              value: _data.status.succeeded,
              color: "#8bd4a1",
            },
            { title: "Failed", value: _data.status.failed, color: "#fb9690" },
          ],
        };
      },
    },
    JOB: {
      title: "Jobs",
      tag: Gauge,
      provide: "k8s",
      service: workload_svc.JOB,
      className: "card nopd",
      col: 6,
      data: (res) => {
        let _data = res.data;
        return {
          id: "WP-JOB",
          format: "{value}",
          vals: [
            { title: "Running", value: _data.status.running, color: "#00adef" },
            {
              title: "Completed",
              value: _data.status.succeeded,
              color: "#8bd4a1",
            },
            { title: "Failed", value: _data.status.failed, color: "#fb9690" },
          ],
        };
      },
    },
    POD: {
      title: "Pods",
      tag: Gauge,
      provide: "k8s",
      service: workload_svc.POD,
      className: "card nopd",
      col: 6,
      data: (res) => {
        let _data = res.data;
        return {
          id: "WP-POD",
          format: "{value}",
          vals: [
            { title: "Running", value: _data.status.running, color: "#00adef" },
            {
              title: "Completed",
              value: _data.status.succeeded,
              color: "#8bd4a1",
            },
            { title: "Failed", value: _data.status.failed, color: "#fb9690" },
          ],
        };
      },
    },
    REPLICASET: {
      title: "Replica Sets",
      tag: Gauge,
      provide: "k8s",
      service: workload_svc.REPLICASET,
      className: "card nopd",
      col: 6,
      data: (res) => {
        let _data = res.data;
        return {
          id: "WP-REPLICASET",
          format: "{value}",
          vals: [
            { title: "Running", value: _data.status.running, color: "#00adef" },
            {
              title: "Completed",
              value: _data.status.succeeded,
              color: "#8bd4a1",
            },
            { title: "Failed", value: _data.status.failed, color: "#fb9690" },
          ],
        };
      },
    },
    REPLICATIONCONTROLLER: {
      title: "Replication Controllers",
      tag: Gauge,
      provide: "k8s",
      service: workload_svc.REPLICATIONCONTROLLER,
      className: "card nopd",
      col: 6,
      data: (res) => {
        let _data = res.data;
        return {
          id: "WP-REPLICATIONCONTROLLER",
          format: "{value}",
          vals: [
            { title: "Running", value: _data.status.running, color: "#00adef" },
            {
              title: "Completed",
              value: _data.status.succeeded,
              color: "#8bd4a1",
            },
            { title: "Failed", value: _data.status.failed, color: "#fb9690" },
          ],
        };
      },
    },
    STATEFULSET: {
      title: "Stateful Sets",
      tag: Gauge,
      provide: "k8s",
      service: workload_svc.STATEFULSET,
      className: "card nopd",
      col: 6,
      data: (res) => {
        let _data = res.data;
        return {
          id: "WP-STATEFULSET",
          format: "{value}",
          vals: [
            { title: "Running", value: _data.status.running, color: "#00adef" },
            {
              title: "Completed",
              value: _data.status.succeeded,
              color: "#8bd4a1",
            },
            { title: "Failed", value: _data.status.failed, color: "#fb9690" },
          ],
        };
      },
    },
  },
};

export default workload;
