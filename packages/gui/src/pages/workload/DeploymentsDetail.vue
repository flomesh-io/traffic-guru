<template>
  <PageLayout :title="$t('Deployments')">
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
            <RollingUpdateCard
              :title="$t('Strategy')"
              :loading="loading"
              :d="detail.spec?.strategy"
            />
            <PodStatusCard
              :loading="loading"
              :d="detail.statusInfo"
            />
            
            <a-card
              class="card mb-20"
              v-if="detail.newreplicaset && detail.newreplicaset.metadata"
              :bordered="false"
              :loading="loading"
              :title="$t('New Replica Set')"
            >
              <DetailList
                size="small"
                :col="4"
              >
                <DetailListItem
                  :term="$t('as')"
                >
                  <a
                    href="javascript:void(0)"
                    @click="newreplicasetDetail(detail.newreplicaset.metadata.name, detail.newreplicaset.metadata.namespace)"
                  >{{ detail.newreplicaset.metadata.name }}</a>
                </DetailListItem>
                <DetailListItem :term="$t('Namespace')">
                  {{
                    detail.newreplicaset.metadata.namespace
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Creation Timestamp')">
                  {{
                    new Date(
                      detail.newreplicaset.metadata.creationTimestamp,
                    ).toLocaleString()
                  }}
                </DetailListItem>
                <DetailListItem
                  v-if="detail.newreplicaset.podInfo"
                  :term="$t('Pods')"
                >
                  <PodStatusTags :d="detail.newreplicaset.podInfo" />
                </DetailListItem>
              </DetailList>
              <DetailList
                size="small"
                :col="1"
              >
                <DetailListItem
                  v-if="detail.newreplicaset.metadata.labels"
                  :term="$t('Labels')"
                >
                  <a-tag
                    :key="index"
                    v-for="(key, index) in Object.keys(
                      detail.newreplicaset.metadata.labels || [],
                    )"
                    :closable="false"
                  >
                    {{ key }}:{{ detail.newreplicaset.metadata.labels[key] }}
                  </a-tag>
                </DetailListItem>
                <DetailListItem
                  v-if="detail.newreplicaset"
                  :term="$t('Container Images')"
                >
                  <ImageTags :d="detail.newreplicaset" />
                </DetailListItem>
              </DetailList>
            </a-card>
            <ReplicaSetList
              v-if="!loading"
              :namespace="namespace"
              class="mb-20"
              :d="detail.oldreplicaset || []"
              :embed="true"
              :title="$t('Old Replica Sets')"
              :metric="false"
              :has-search="false"
            />
            <HozScalerList
              v-if="!loading"
              :embed="true"
              :namespace="namespace"
              :d="detail.horizontalpodautoscaler || []"
            />
          </a-tab-pane>
          <a-tab-pane
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
                :url="$REST.K8S.DEPLOYMENT + '/' + pid + '/event'"
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
import ReplicaSetList from "./components/ReplicaSetList";
import HozScalerList from "./components/HozScalerList";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import { mapState } from "vuex";
import DetailListItem from "@/components/tool/DetailListItem";
import RollingUpdateCard from "./components/RollingUpdateCard";
import PodStatusCard from "./components/PodStatusCard";
import ImageTags from "./components/ImageTags";
import DetailHeader from "./components/DetailHeader";
import ResourceInfoCard from "./components/ResourceInfoCard";
import PodStatusTags from "./components/PodStatusTags";

export default {
  name: "DeploymentsDetail",
  i18n: require("@/i18n"),
  components: {
    DetailListItem,
    DetailList,
    PageLayout,
    StatusList,
    EventList,
    HozScalerList,
    ReplicaSetList,
    RollingUpdateCard,
    PodStatusCard,
    ImageTags,
    DetailHeader,
    PodStatusTags,
    ResourceInfoCard,
  },

  data() {
    return {
      detail: {
        metadata: { labels: {}, annotations: {} },
        typeMeta: {},
        pods: {},
        containerImages: [],
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
        pods: {},
        containerImages: [],
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
        this.$REST.K8S.DEPLOYMENT,
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
    newreplicasetDetail(id, namespace) {
      this.$router.push({
        path: `/workload/replicaset/detail/${namespace}/${id}`,
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
