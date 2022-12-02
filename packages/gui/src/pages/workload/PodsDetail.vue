<template>
  <PageLayout :title="$t('Pods')">
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
            v-for="(key, index) in Object.keys(detail.objectMeta.labels || [])"
            :key="index"
            :closable="false"
          >
            {{ key }}:{{ detail.objectMeta.labels[key] }}
          </a-tag>
        </DetailListItem>
        <DetailListItem :term="$t('Annotations')">
          <a-tag
            v-for="(key, index) in Object.keys(
              detail.objectMeta.annotations || [],
            )"
            :key="index"
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
            <span v-else-if="key == proxyProfileKey">
              <a-popover
                trigger="click"
                :title="key"
              >
                <template #content>
                  <Json2YamlCard
                    :is-create="false"
                    :is-readonly="true"
                    :is-pop="true"
                    v-if="proxyProfile"
                    :json-val="proxyProfile"
                  />
                </template>
                <a
                  class="font-primary"
                  href="javascript:void(0)"
                >{{ key }}</a>
              </a-popover>
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
                  :term="$t('node')"
                >
                  <a
                    class="font-primary"
                    href="javascript:void(0)"
                  >{{
                    detail.nodeName
                  }}</a>
                </DetailListItem>
                <DetailListItem :term="$t('Status')">
                  {{
                    detail.podPhase
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('IP')">
                  {{
                    detail.podIP
                  }}
                </DetailListItem>
              </DetailList>
              <DetailList
                size="small"
                :col="3"
              >
                <DetailListItem :term="$t('Qos Class')">
                  {{
                    detail.qosClass
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Restart')">
                  {{
                    detail.restartCount
                  }}
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
              v-if="detail.controller"
              class="card mb-20"
              :bordered="false"
              :loading="loading"
              :title="$t('Pod Status')"
            >
              <DetailList
                size="small"
                :col="3"
              >
                <DetailListItem :term="$t('Running')">
                  {{
                    detail.controller.pods.running
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Desired')">
                  {{
                    detail.controller.pods.desired
                  }}
                </DetailListItem>
              </DetailList>
            </a-card>
            <a-card
              class="card mb-20"
              v-if="detail.controller && detail.controller.objectMeta"
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
                    detail.controller.objectMeta.name
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
                      detail.controller.objectMeta.creationTimestamp,
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
                  v-if="detail.controller.objectMeta.labels"
                  :term="$t('Labels')"
                >
                  <a-tag
                    v-for="(key, index) in Object.keys(
                      detail.controller.objectMeta.labels || [],
                    )"
                    :key="index"
                    :closable="false"
                  >
                    {{ key }}:{{ detail.controller.objectMeta.labels[key] }}
                  </a-tag>
                </DetailListItem>
                <DetailListItem
                  v-if="detail.controller.containerImages"
                  :term="$t('Container Images')"
                >
                  <a-tag
                    v-for="(item, index) in detail.controller.containerImages"
                    :key="index"
                    :closable="false"
                  >
                    {{ item }}
                  </a-tag>
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
              <StatusList :d="detail.conditions || []" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="3"
            :tab="$t('Containers')"
          >
            <a-card
              class="card mb-20"
              v-if="detail.containers"
              :bordered="false"
              :loading="loading"
              :title="$t('Containers')"
            >
              <DetailList
                v-for="(container, index2) in detail.containers"
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
                            record.volume.name
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
                :url="$REST.KUBE.POD + '/' + pid + '/event'"
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
import Json2YamlCard from "@/components/card/Json2YamlCard";

import EventList from "./components/EventList";
import StatusList from "./components/StatusList";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import { mapState } from "vuex";
import DetailListItem from "@/components/tool/DetailListItem";

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
    JsonEditor,
    DetailListItem,
    DetailList,
    PageLayout,
    EventList,
    StatusList,
    Json2YamlCard,
  },

  data() {
    return {
      detail: {
        objectMeta: { labels: {}, annotations: {} },
        typeMeta: {},
        jobStatus: {},
        controller: { pods: {} },
        containerImages: [],
        selector: {},
        statusInfo: {},
        conditions: [],
        rollingUpdateStrategy: {},
      },

      loading: true,
      pid: "",
      namespace: "",
      proxyProfile: null,
      proxyProfileKey: "flomesh.io/proxy-profile",
      isMounted: false,
      cumulativeMetrics: [],
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
        objectMeta: { labels: {}, annotations: {} },
        typeMeta: {},
        jobStatus: {},
        controller: { pods: {} },
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
      this.proxyProfile = null;
      this.$request(this.URL(), this.$METHOD.GET).then((res) => {
        this.detail = res.data;
        if (
          this.detail.objectMeta.annotations &&
          this.detail.objectMeta.annotations[this.proxyProfileKey]
        ) {
          this.searchProfile(
            this.detail.objectMeta.annotations[this.proxyProfileKey],
          );
        }

        this.loading = false;
      });
    },

    URL() {
      let append = "/" + this.pid;
      return this.$REST.KUBE.encode(
        this.$REST.KUBE.POD,
        append,
        this.namespace,
      );
    },

    searchProfile(name) {
      this.loading = true;
      this.$request(this.URLProfile(name), this.$METHOD.GET).then((res) => {
        this.proxyProfile = JSON.stringify(res.data);
      });
    },

    URLProfile(name) {
      let append = "/name/" + name;
      return this.$REST.KUBE.encode(this.$REST.KUBE.SIDECAR_DETAIL, append);
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
