<template>
  <PageLayout :title="$t('Deployments')">
    <template #headerContent>
      <DetailList
        size="small"
        :col="1"
      >
        <DetailListItem
          v-if="pid != ''"
          :term="$t('UID')"
        >
          {{
            detail.objectMeta.uid
          }}
        </DetailListItem>
        <DetailListItem
          :term="$t('as')"
        >
          <a-input
            read-only
            :placeholder="$t('unset')"
            v-model:value="detail.objectMeta.name"
            class="bold width-300"
          />
        </DetailListItem>
        <DetailListItem
          :term="$t('Namespace')"
        >
          <a-input
            read-only
            :placeholder="$t('unset')"
            v-model:value="detail.objectMeta.namespace"
            class="width-200"
          />
        </DetailListItem>
        <DetailListItem :term="$t('Creation Timestamp')">
          {{
            new Date(detail.objectMeta.creationTimestamp).toLocaleString()
          }}
        </DetailListItem>
      </DetailList>
      <DetailList
        size="small"
        :col="1"
      >
        <DetailListItem :term="$t('Labels')">
          <a-tag
            :key="index"
            v-for="(key, index) in Object.keys(detail.objectMeta.labels || [])"
            :closable="false"
          >
            {{ key }}:{{ detail.objectMeta.labels[key] }}
          </a-tag>
        </DetailListItem>
        <DetailListItem :term="$t('Annotations')">
          <a-tag
            :key="index"
            v-for="(key, index) in Object.keys(
              detail.objectMeta.annotations || [],
            )"
            :closable="false"
            class="mb-5"
          >
            <span v-if="key == 'objectset.rio.cattle.io/applied'">
              <a-tooltip
                placement="topLeft"
                :title="detail.objectMeta.annotations[key]"
              >
                <a
                  class="font-primary"
                  href="javascript:void(0)"
                >{{ key }}</a>
              </a-tooltip>
            </span>
            <span
              v-else-if="
                key == 'kubectl.kubernetes.io/last-applied-configuration'
              "
            >
              <a-popover
                trigger="click"
                :title="key"
              >
                <template #content>
                  <JsonEditor
                    :is-j-s-o-n="true"
                    :value="detail.objectMeta.annotations[key]"
                  />
                </template>
                <a
                  class="font-primary"
                  href="javascript:void(0)"
                >{{ key }}</a>
              </a-popover>
            </span>
            <span
              v-else
            >{{ key }}:{{ detail.objectMeta.annotations[key] }}</span>
          </a-tag>
        </DetailListItem>
      </DetailList>
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
            <a-card
              class="card mb-20"
              :bordered="false"
              :loading="loading"
              :title="$t('Resource Info')"
            >
              <DetailList
                size="small"
                :col="3"
              >
                <DetailListItem
                  v-if="detail.strategy"
                  :term="$t('Strategy')"
                >
                  {{ detail.strategy }}
                </DetailListItem>
                <DetailListItem :term="$t('Minimum Preparation Seconds')">
                  {{
                    detail.minReadySeconds
                  }}
                </DetailListItem>
                <DetailListItem
                  v-if="detail.revisionHistoryLimit"
                  :term="$t('Modify History Restrictions')"
                >
                  {{ detail.revisionHistoryLimit }}
                </DetailListItem>
              </DetailList>
              <DetailList
                size="small"
                :col="1"
              >
                <DetailListItem
                  v-if="
                    detail.labelSelector && detail.labelSelector.matchLabels
                  "
                  :term="$t('Selector')"
                >
                  <a-tag
                    :key="index"
                    v-for="(key, index) in Object.keys(
                      detail.labelSelector.matchLabels,
                    )"
                    :closable="false"
                  >
                    {{ key }}:{{ detail.labelSelector.matchLabels[key] }}
                  </a-tag>
                </DetailListItem>
                <DetailListItem
                  v-if="detail.containerImages"
                  :term="$t('Container Images')"
                >
                  <a-tag
                    :key="index"
                    v-for="(item, index) in detail.containerImages"
                    :closable="false"
                  >
                    {{ item }}
                  </a-tag>
                </DetailListItem>
                <DetailListItem
                  :term="$t('Selector')"
                  v-if="detail.selector"
                >
                  <a-tag
                    :key="index"
                    v-for="(key, index) in Object.keys(detail.selector)"
                    :closable="false"
                  >
                    {{ key }}:{{ detail.selector[key] }}
                  </a-tag>
                </DetailListItem>
              </DetailList>
            </a-card>
            <a-card
              v-if="detail.rollingUpdateStrategy"
              class="card mb-20"
              :bordered="false"
              :loading="loading"
              :title="$t('Rolling Update Strategy')"
            >
              <DetailList
                size="small"
                :col="3"
              >
                <DetailListItem :term="$t('Max Surge')">
                  {{
                    detail.rollingUpdateStrategy.maxSurge
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Max Unavailable')">
                  {{
                    detail.rollingUpdateStrategy.maxUnavailable
                  }}
                </DetailListItem>
              </DetailList>
            </a-card>
            <a-card
              class="card mb-20"
              v-if="detail.statusInfo"
              :bordered="false"
              :loading="loading"
              :title="$t('Pod Status')"
            >
              <DetailList
                size="small"
                :col="3"
              >
                <DetailListItem :term="$t('total')">
                  {{
                    detail.statusInfo.replicas
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Available')">
                  {{
                    detail.statusInfo.available
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Updated')">
                  {{
                    detail.statusInfo.updated
                  }}
                </DetailListItem>
              </DetailList>
            </a-card>
            <a-card
              class="card mb-20"
              v-if="newreplicaset && newreplicaset.objectMeta"
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
                    @click="newreplicasetDetail(newreplicaset.objectMeta.name, newreplicaset.objectMeta.namespace)"
                  >{{ newreplicaset.objectMeta.name }}</a>
                </DetailListItem>
                <DetailListItem :term="$t('Namespace')">
                  {{
                    newreplicaset.objectMeta.namespace
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Creation Timestamp')">
                  {{
                    new Date(
                      newreplicaset.objectMeta.creationTimestamp,
                    ).toLocaleString()
                  }}
                </DetailListItem>
                <DetailListItem
                  :term="$t('Pods')"
                >
                  {{ newreplicaset.podInfo.running }}/{{
                    newreplicaset.podInfo.desired
                  }}
                </DetailListItem>
              </DetailList>
              <DetailList
                size="small"
                :col="1"
              >
                <DetailListItem
                  v-if="newreplicaset.objectMeta.labels"
                  :term="$t('Labels')"
                >
                  <a-tag
                    :key="index"
                    v-for="(key, index) in Object.keys(
                      newreplicaset.objectMeta.labels || [],
                    )"
                    :closable="false"
                  >
                    {{ key }}:{{ newreplicaset.objectMeta.labels[key] }}
                  </a-tag>
                </DetailListItem>
                <DetailListItem
                  v-if="newreplicaset.containerImages"
                  :term="$t('Container Images')"
                >
                  <a-tag
                    :key="index"
                    v-for="(item, index) in newreplicaset.containerImages"
                    :closable="false"
                  >
                    {{ item }}
                  </a-tag>
                </DetailListItem>
              </DetailList>
            </a-card>
            <ReplicaSetList
              :namespace="namespace"
              class="mb-20"
              v-if="isMounted"
              :url="$REST.KUBE.DEPLOYMENT + '/' + pid + '/oldreplicaset'"
              :title="$t('Old Replica Sets')"
              :metric="false"
              :has-search="false"
            />
            <HozScalerList
              :namespace="namespace"
              v-if="isMounted"
              :url="
                $REST.KUBE.DEPLOYMENT + '/' + pid + '/horizontalpodautoscaler'
              "
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
              <StatusList :d="detail.conditions || []" />
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
                :url="$REST.KUBE.DEPLOYMENT + '/' + pid + '/event'"
              />
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </PageLayout>
</template>

<script>
import JsonEditor from "@/components/editor/JsonEditor";
import EventList from "./components/EventList";
import StatusList from "./components/StatusList";
import ReplicaSetList from "./components/ReplicaSetList";
import HozScalerList from "./components/HozScalerList";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import { mapState } from "vuex";
import DetailListItem from "@/components/tool/DetailListItem";
export default {
  name: "DeploymentsDetail",
  i18n: require("@/i18n"),
  components: {
    JsonEditor,
    DetailListItem,
    DetailList,
    PageLayout,
    StatusList,
    EventList,
    HozScalerList,
    ReplicaSetList,
  },

  data() {
    return {
      detail: {
        objectMeta: { labels: {}, annotations: {} },
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
      newreplicaset: {},
      cumulativeMetrics: [],
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
        objectMeta: { labels: {}, annotations: {} },
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
      this.$request(this.newreplicasetURL(), this.$METHOD.GET).then((res) => {
        this.newreplicaset = res.data;
      });
    },

    URL() {
      let append = "/" + this.pid;
      return this.$REST.KUBE.encode(
        this.$REST.KUBE.DEPLOYMENT,
        append,
        this.namespace,
      );
    },

    newreplicasetURL() {
      let append = "/" + this.pid + "/newreplicaset";
      return this.$REST.KUBE.encode(
        this.$REST.KUBE.DEPLOYMENT,
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
