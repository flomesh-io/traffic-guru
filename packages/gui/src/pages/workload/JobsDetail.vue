<template>
  <PageLayout :title="$t('Jobs')">
    <template #headerContent>
      <DetailHeader :d="detail" />
    </template>
    <template #action />

    <a-row class="row-mg">
      <a-col
        class="col-pd"
        :xl="24"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <a-tabs type="card">
          <a-tab-pane
            key="1"
            :tab="$t('Overview')"
          >
            <ResourceInfoCard
              :loading="loading"
              :d="detail"
            />
            <RollingUpdateCard
              :loading="loading"
              :d="detail.spec?.updateStrategy"
            />
            <PodStatusCard
              :loading="loading"
              :d="detail.podInfo"
            />
          </a-tab-pane>
          <a-tab-pane
            v-if="detail.status"
            key="2"
            :tab="$t('Status')"
          >
            <a-card
              class="card nopd"
              :bordered="false"
              :loading="loading"
            >
              <StatusList :d="detail.status.conditions || []" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="3"
            :tab="$t('Pods')"
          >
            <a-card
              class="card nopd"
              :bordered="false"
              :loading="loading"
            >
              <PodList
                :embed="true"
                :d="detail.pods"
                :has-search="false"
              />
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="4"
            :tab="$t('Events')"
          >
            <a-card
              class="card nopd"
              :bordered="false"
              :loading="loading"
            >
              <EventList
                :namespace="namespace"
                :has-search="false"
                :url="$REST.K8S.JOB + '/' + pid + '/event'"
              />
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </PageLayout>
</template>

<script>
import EventList from "./components/EventList";
import StatusList from "./components/StatusList";
import PodList from "./components/PodList";
import PageLayout from "@/layouts/PageLayout";
import { mapState } from "vuex";
import RollingUpdateCard from "./components/RollingUpdateCard";
import PodStatusCard from "./components/PodStatusCard";
import DetailHeader from "./components/DetailHeader";
import ResourceInfoCard from "./components/ResourceInfoCard";

export default {
  name: "JobsDetail",
  i18n: require("@/i18n"),
  components: {
    PageLayout,
    EventList,
    StatusList,
    PodList,
    RollingUpdateCard,
    PodStatusCard,
    DetailHeader,
    ResourceInfoCard,
  },

  data() {
    return {
      detail: {
        metadata: { labels: {}, annotations: {} },
        typeMeta: {},
        jobStatus: {},
        podInfo: {},
        selector: {},
        statusInfo: {},
        conditions: [],
        rollingUpdateStrategy: {},
      },

      loading: true,
      pid: "",
      namespace: "",
      isMounted: false,
      metrics: [],
      params: {
        key: "",
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },

  computed: {
    ...mapState("setting", ["isMobile"]),
  },

  created() {
    this.pid = this.$route.params.id || "";
    this.namespace =
      this.$route.params.namespace || localStorage.getItem("NAMESPACE");
  },

  mounted() {
    this.isMounted = true;

    if (this.pid != "") {
      this.search();
    } else {
      this.detail = {
        metadata: { labels: {}, annotations: {} },
        typeMeta: {},
        jobStatus: {},
        podInfo: {},
        selector: {},
        statusInfo: {},
        conditions: [],
        rollingUpdateStrategy: {},
      };
      this.loading = false;
    }
  },

  methods: {
    onTabChange(key) {
      console.log(key);
    },

    search() {
      this.loading = true;
      this.$request(this.URL(), this.$METHOD.GET).then((res) => {
        this.detail = res.data;
        this.loading = false;
      });
    },

    URL() {
      let append = "/" + this.pid;
      return this.$REST.K8S.encode(
        this.$REST.K8S.JOB,
        append,
        this.namespace,
      );
    },

    valid() {
      return true;
    },

    save() {
      if (!this.valid()) {
        return;
      }
      if (this.pid != "") {
        this.$message.success(this.$t("Save successfully"), 3);
        this.$closePage(this.$route);
      } else {
        this.$message.success(this.$t("Created successfully"), 3);
        this.$closePage(this.$route);
      }
    },

    handleChange() {},
  },
};
</script>

<style lang="less" scoped></style>
