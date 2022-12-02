<template>
  <PageLayout :title="$t('Cron Jobs')">
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
                  v-if="detail.schedule"
                  :term="$t('Schedule')"
                >
                  {{ detail.schedule }}
                </DetailListItem>
                <DetailListItem :term="$t('Active Jobs')">
                  {{
                    detail.active
                  }}
                </DetailListItem>
                <DetailListItem :term="$t('Suspend')">
                  {{
                    detail.suspend
                  }}
                </DetailListItem>
              </DetailList>

              <DetailList
                size="small"
                :col="3"
              >
                <DetailListItem
                  v-if="detail.lastSchedule"
                  :term="$t('Last Schedule')"
                >
                  {{ detail.lastSchedule }}
                </DetailListItem>
                <DetailListItem
                  v-if="detail.concurrencyPolicy"
                  :term="$t('Concurrency Policy')"
                >
                  {{ detail.concurrencyPolicy }}
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
            <!--
              <a-card class="card mb-20" :bordered="false" :loading="loading" :title="$t('Pod Status')">
              <detail-list size="small" :col="3" >
              <detail-list-item :term="$t('Running')">{{detail.podInfo.running}}</detail-list-item>
              <detail-list-item :term="$t('Desired')">{{detail.podInfo.desired}}</detail-list-item>
              </detail-list>
              </a-card> 
            -->
          </a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="$t('Jobs')"
          >
            <a-card
              class="card nopd"
              :bordered="false"
              :loading="loading"
            >
              <JobList
                :namespace="namespace"
                :url="$REST.KUBE.CRONJOB + '/' + pid + '/job'"
                :title="$t('Active Jobs')"
                :unactive="false"
                :has-search="false"
              />
            </a-card>
            <a-card
              class="card mt-10 nopd"
              :bordered="false"
              :loading="loading"
            >
              <JobList
                :namespace="namespace"
                :url="$REST.KUBE.CRONJOB + '/' + pid + '/job'"
                :title="$t('Not Working Jobs')"
                :unactive="true"
                :has-search="false"
              />
            </a-card>
          </a-tab-pane>

          <a-tab-pane
            v-if="detail.jobStatus"
            key="3"
            :tab="$t('Status')"
          >
            <a-card
              class="card nopd"
              :bordered="false"
              :loading="loading"
            >
              <StatusList :d="detail.jobStatus.conditions || []" />
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
                :url="$REST.KUBE.CRONJOB + '/' + pid + '/event'"
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
import JobList from "./components/JobList";
import PageLayout from "@/layouts/PageLayout";
import { mapState } from "vuex";
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
export default {
  name: "CronJobsDetail",
  i18n: require("@/i18n"),
  components: {
    JsonEditor,
    DetailListItem,
    DetailList,
    PageLayout,
    EventList,
    StatusList,
    JobList,
  },

  data() {
    return {
      detail: {
        objectMeta: { labels: {}, annotations: {} },
        typeMeta: {},
        jobStatus: {},
        podInfo: {},
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
        jobStatus: {},
        podInfo: {},
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
      return this.$REST.KUBE.encode(
        this.$REST.KUBE.CRONJOB,
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
