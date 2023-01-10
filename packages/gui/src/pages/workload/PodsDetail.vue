<template>
  <PageLayout :title="$t('Pods')">
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
        <a-tabs
          type="card"
          :destroy-inactive-tab-pane="true"
        >
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
                  :term="$t('node')"
                  v-if="detail.spec"
                >
                  <a
                    class="font-primary"
                    href="javascript:void(0)"
                  >{{
                    detail.spec.nodeName
                  }}</a>
                </DetailListItem>
                <DetailListItem
                  v-if="detail.status"
                  :term="$t('Status')"
                >
                  {{
                    detail.status.phase
                  }}
                </DetailListItem>
                <DetailListItem
                  v-if="detail.status"
                  :term="$t('IP')"
                >
                  {{
                    detail.status.podIP
                  }}
                </DetailListItem>
              </DetailList>
              <DetailList
                size="small"
                v-if="detail.status"
                :col="3"
              >
                <DetailListItem :term="$t('Qos Class')">
                  {{
                    detail.status.qosClass
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Restart')">
                  {{
                    detail.status.containerStatuses?detail.status.containerStatuses[0].restartCount:0
                  }}
                </DetailListItem>
              </DetailList>
            </a-card>
            <RollingUpdateCard
              :loading="loading"
              :d="detail.spec?.updateStrategy"
            />
            <PodStatusCard
              :loading="loading"
              :d="detail.controller?.pods"
            />
            <a-card
              class="card mb-20"
              v-if="detail.controller && detail.controller.metadata"
              :bordered="false"
              :loading="loading"
              :title="$t('Controller')"
            >
              <DetailList
                size="small"
                :col="4"
              >
                <DetailListItem
                  :term="$t('as')"
                >
                  <a href="javascript:void(0)">{{
                    detail.controller.metadata.name
                  }}</a>
                </DetailListItem>
                <DetailListItem :term="$t('Kind')">
                  {{
                    detail.controller.typeMeta.kind
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Creation Timestamp')">
                  {{
                    new Date(
                      detail.controller.metadata.creationTimestamp,
                    ).toLocaleString()
                  }}
                </DetailListItem>
                <DetailListItem
                  :term="$t('Pods')"
                >
                  {{ detail.controller.pods.running }}/{{
                    detail.controller.pods.desired
                  }}
                </DetailListItem>
              </DetailList>
              <DetailList
                size="small"
                :col="1"
              >
                <DetailListItem
                  v-if="detail.controller.metadata.labels"
                  :term="$t('Labels')"
                >
                  <a-tag
                    v-for="(key, index) in Object.keys(
                      detail.controller.metadata.labels || [],
                    )"
                    :key="index"
                    :closable="false"
                  >
                    {{ key }}:{{ detail.controller.metadata.labels[key] }}
                  </a-tag>
                </DetailListItem>
                <DetailListItem
                  v-if="detail.controller"
                  :term="$t('Container Images')"
                >
                  <ImageTags :d="detail.controller" />
                </DetailListItem>
              </DetailList>
            </a-card>
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
            key="3"
            :tab="$t('Containers')"
          >
            <a-card
              class="card mb-20"
              v-if="detail.spec.containers"
              :bordered="false"
              :loading="loading"
              :title="$t('Containers')"
            >
              <DetailList
                v-for="(container, index2) in detail.spec.containers"
                :key="index2"
                size="small"
                :col="1"
              >
                <DetailListItem :term="$t('as')">
                  {{
                    container.name
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Image')">
                  {{
                    container.image
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Commands')">
                  <blockquote>
                    <div
                      v-for="(command, index3) in container.commands"
                      :key="index3"
                    >
                      {{ command }}
                    </div>
                  </blockquote>
                </DetailListItem>
                <DetailListItem :term="$t('Volumes')">
                  <a-table
                    :pagination="false"
                    :columns="dataColumns"
                    :data-source="container.volumeMounts"
                    :loading="loading"
                    class="bg-white"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'Source Type'">
                        <div>Secret</div>
                      </template>
                      <template v-else-if="column.dataIndex === 'volume'">
                        <div>
                          <a href="javascript:void(0)">{{
                            record.volume?.name
                          }}</a>
                        </div>
                      </template>
                    </template>
                  </a-table>
                </DetailListItem>
              </DetailList>
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="5"
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
                :url="$REST.K8S.POD + '/' + pid +'/event'"
              />
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="6"
            :tab="$t('Log')"
            v-if="selectContainer"
          >
            <a-card
              class="card nopd"
              :bordered="false"
              :loading="loading"
            >
              <LogList
                :namespace="namespace"
                :has-search="true"
                :url="$REST.K8S.POD + '/' + pid + '/' + selectContainer + '/log'"
              >
                <template #extra>
                  <a-select v-model:value="selectContainer">
                    <a-select-option 
                      v-for="(container, index3) in detail.spec.containers" 
                      :key="index3" 
                      :value="container.name"
                    >
                      {{ container.name }}
                    </a-select-option>
                  </a-select>
                </template>
              </LogList>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </PageLayout>
</template>

<script>
import EventList from "./components/EventList";
import LogList from "./components/LogList";
import StatusList from "./components/StatusList";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import { mapState } from "vuex";
import DetailListItem from "@/components/tool/DetailListItem";
import ImageTags from "./components/ImageTags";
import DetailHeader from "./components/DetailHeader";
import RollingUpdateCard from "./components/RollingUpdateCard";
import PodStatusCard from "./components/PodStatusCard";

const columns = [
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Read Only",
    dataIndex: "readOnly",
  },
  {
    key: "Mount Path",
    dataIndex: "mountPath",
  },
  {
    key: "Sub Path",
    dataIndex: "subPath",
  },
  {
    key: "Source Type",
    dataIndex: "volume",
  },
  {
    key: "Source Name",
    dataIndex: "volume",
  },
];
export default {
  name: "PodsDetail",
  i18n: require("@/i18n"),
  components: {
    DetailListItem,
    DetailList,
    PageLayout,
    EventList,
    LogList,
    StatusList,
    ImageTags,
    DetailHeader,
    RollingUpdateCard,
    PodStatusCard,
  },

  data() {
    return {
      selectContainer: null,
      detail: {
        metadata: { labels: {}, annotations: {} },
        typeMeta: {},
        jobStatus: {},
        controller: { pods: {} },
        containerImages: [],
        selector: {},
        statusInfo: {},
        conditions: [],
        spec:{updateStrategy:{rollingUpdate:{}}}
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

      columns,
    };
  },

  computed: {
    ...mapState("setting", ["isMobile"]),
    dataColumns() {
      return this.columns.map((column) => {
        column.title = this.$t(column.key);
        return column;
      });
    },
  },

  mounted() {
    this.isMounted = true;
    this.pid = this.$route.params.id || "";
    this.namespace =
      this.$route.params.namespace || localStorage.getItem("NAMESPACE");

    if (this.pid != "") {
      this.search();
    } else {
      this.detail = {
        metadata: { labels: {}, annotations: {} },
        typeMeta: {},
        jobStatus: {},
        controller: { pods: {} },
        containerImages: [],
        selector: {},
        statusInfo: {},
        conditions: [],
        spec:{updateStrategy:{rollingUpdate:{}}}
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
        if(this.detail.spec.containers.length >0){
          this.selectContainer = this.detail.spec.containers[0].name;
        }
        this.loading = false;
      });
    },

    URL() {
      let append = "/" + this.pid;
      return this.$REST.K8S.encode(
        this.$REST.K8S.POD,
        append,
        this.namespace,
      );
    },

    valid() {
      return true;
    },

    jobDetail(id) {
      this.$router.push({
        path: "/workload/job/detail/" + id,
      });
    },

    secretDetail(id) {
      this.$router.push({
        path: "/workload/secret/detail/" + id,
      });
    },

    handleChange() {},
  },
};
</script>

<style lang="less" scoped></style>
