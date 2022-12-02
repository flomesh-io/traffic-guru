<template>
  <PageLayout :title="$t('Secrets')">
    <template #headerContent>
      <DetailList
        size="small"
        :col="1"
      >
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
    <template
      v-if="pid != ''"
      #extra
    >
      <HeadInfo
        :title="$t('UID')"
        :content="detail.objectMeta.uid"
      />
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
                :col="1"
              >
                <DetailListItem
                  :key="i"
                  v-for="(item, i) in Object.keys(detail.data)"
                  :term="$t(item)"
                >
                  <blockquote>
                    {{ detail.data[item] }}
                  </blockquote>
                </DetailListItem>
              </DetailList>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </PageLayout>
</template>

<script>
import JsonEditor from "@/components/editor/JsonEditor";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import { mapState } from "vuex";
import HeadInfo from "@/components/tool/HeadInfo";
import DetailListItem from "@/components/tool/DetailListItem";
export default {
  name: "SecretsDetail",
  i18n: require("@/i18n"),
  components: {
    HeadInfo,
    JsonEditor,
    DetailListItem,
    DetailList,
    PageLayout,
  },

  data() {
    return {
      detail: {
        data: {},
        objectMeta: { labels: {}, annotations: {} },
        typeMeta: {},
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
        data: "",
        objectMeta: { labels: {}, annotations: {} },
        typeMeta: {},
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
        Object.keys(this.detail.data).forEach((key) => {
          this.detail.data[key] = this.decodeBase64(this.detail.data[key]);
        });
        this.loading = false;
      });
    },

    URL() {
      let append = "/" + this.pid;
      return this.$REST.KUBE.encode(
        this.$REST.KUBE.SECRET,
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
    decodeBase64(d) {
      return decodeURIComponent(atob(d));
    },
  },
};
</script>

<style lang="less" scoped></style>
