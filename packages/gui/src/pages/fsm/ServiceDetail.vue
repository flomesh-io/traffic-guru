<template>
  <ServiceBaseDetail
    v-model:loading="loading"
    v-model:namespace="namespace"
    v-model:pid="pid"
    v-model:contentString="contentString"
    v-model:detail="detail"
    v-model:registry="registry"
    v-model:ns="ns"
    v-model:extend="extend"
    v-model:blacklistServices="blacklistServices"
    v-model:whitelistServices="whitelistServices"
    v-model:subscribeServices="subscribeServices"
    v-model:subscribeServicesTo="subscribeServicesTo"
    v-model:subscribeServicesAll="subscribeServicesAll"
    ref="ServiceBaseDetail"
  >
    <template #tabs>
      <a-tabs
        type="card"
        v-model:activeKey="activeKey"
      >
        <a-tab-pane
          key="1"
          :tab="$t('Overview')"
        >
          <ServiceOverview
            :pid="pid"
            v-model:detail="detail"
            :registry="registry"
          />
        </a-tab-pane>
        <a-tab-pane
          key="3"
          v-if="pid != '' && registry.type == 'k8s'"
          :tab="$t('Pods')"
        >
          <a-card
            class="card nopd"
            :bordered="false"
            :loading="loading"
          >
            <PodList
              :namespace="namespace"
              :has-search="false"
              :url="$REST.KUBE.SERVICE + '/' + detail.metadata.name + '/pod'"
            />
          </a-card>
        </a-tab-pane>
        <a-tab-pane
          key="11"
          :tab="$t('config')"
          @click="getSaveData"
        >
          <Json2YamlCard
            class="card full nopd"
            :is-readonly="false"
            :is-create="false"
            v-model:jsonVal="contentString"
            @change="setSaveData"
          />
        </a-tab-pane>
        <a-tab-pane
          key="13"
          v-if="pid != ''"
          :tab="$t('log')"
        >
          <LogViewer
            :uid="pid"
            :params="{
              name: detail.metadata?.name,
              namespace: detail.metadata?.namespace,
              domain: registry.content?.domain,
            }"
            type="service"
            :log-level="extend.log.level"
            @save="saveLogLevel"
          />
        </a-tab-pane>
        <a-tab-pane
          key="14"
          v-if="pid != ''"
          :tab="$t('Dashboard')"
        >
          <EmbedDashboard
            :page-id="pid"
            :params="{
              name: detail.metadata?.name,
              namespace: ns?.name,
              namespaceId: ns?.id,
              domain: registry.content?.domain,
            }"
            apply="service"
            :default-widget="DEFAULT_SERVICE_DETAIL"
            :hide-add="activeKey != '14'"
          />
        </a-tab-pane>
      </a-tabs>
    </template>
  </ServiceBaseDetail>
</template>

<script>
import ServiceBaseDetail from "@/pages/fsm/components/ServiceBaseDetail";
import ServiceOverview from "@/pages/fsm/components/ServiceOverview";
import PodList from "@/pages/workload/components/PodList";
import Json2YamlCard from "@/components/card/Json2YamlCard";
import LogViewer from "@/components/table/LogViewer";
import { DEFAULT_SERVICE_DETAIL } from "@/services/dashboard";
import EmbedDashboard from "@/components/page/EmbedDashboard";

export default {
  name: "ServicesDetail",
  i18n: require("@/i18n"),
  components: {
    ServiceBaseDetail,
    ServiceOverview,
    PodList,
    Json2YamlCard,
    EmbedDashboard,
    LogViewer,
  },

  data() {
    return {
      DEFAULT_SERVICE_DETAIL,
      activeKey: "1",
      external: {
        url: "",
        type: "Http://",
        token: "",
      },

      visibleAP: false,
      dialTestings: [],
      visible: false,
      aclKey: "2",
      extend: {
        plugins: [],
        certificates: [],
        identitys: {},
        log: { level: "All" },
      },

      registry: { type: "", name: "", content: {} },
      ns: {id:"",name:""},
      detail: {
        endpoints: [],
        spec: { type: "", clusterIP: "", sessionAffinity: "", ports: [] },
        metadata: { name: "", namespace: "", labels: {}, annotations: {} },
        typeMeta: {},
        podInfo: {},
        containerImages: [],
        selector: {},
        statusInfo: {},
        conditions: [],
        rollingUpdateStrategy: { maxUnavailable: "", maxSurge: "" },
        whiteExcludedPath: {},
        blackExcludedPath: {},
      },

      pjsConfig: "",
      contentString: "",
      loading: true,
      pid: "",
      namespace: "",
      isMounted: false,
      cumulativeMetrics: [],
      subscribeServices: [],
      subscribeServicesTo: [],
      subscribeServicesAll: [],
      whitelistServices: [],
      blacklistServices: [],
    };
  },

  created() {
    this.pid = this.$route.params.id || "";
    this.namespace =
      this.$route.params.namespace || localStorage.getItem("NAMESPACE");
  },

  mounted() {},

  methods: {
    saveLogLevel(data) {
      this.$refs.ServiceBaseDetail.saveLogLevel(data);
    },

    getSaveData() {
      this.$refs.ServiceBaseDetail.getSaveData();
    },

    setSaveData() {
      this.$refs.ServiceBaseDetail.setSaveData();
    },
  },
};
</script>

<style lang="less" scoped>
  .divider {
    height: 120px;
    position: relative;
    top: 60px;
  }
  .external-url {
    position: relative;
    top: 10px;
    left: 10px;
  }
  .external-btn {
    position: relative;
    left: 50px;
  }
</style>
