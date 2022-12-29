<template>
  <PageLayout :title="$t('Secrets')">
    <template #headerContent>
      <DetailHeader :d="detail" />
    </template>
    <template
      v-if="pid != ''"
      #extra
    >
      <HeadInfo
        :title="$t('UID')"
        :content="detail.metadata.uid"
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
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import { mapState } from "vuex";
import HeadInfo from "@/components/tool/HeadInfo";
import DetailListItem from "@/components/tool/DetailListItem";
import DetailHeader from "./components/DetailHeader";
export default {
  name: "SecretsDetail",
  i18n: require("@/i18n"),
  components: {
    HeadInfo,
    DetailListItem,
    DetailList,
    PageLayout,
    DetailHeader,
  },

  data() {
    return {
      detail: {
        data: {},
        metadata: { labels: {}, annotations: {} },
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
      metrics: [],
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
        metadata: { labels: {}, annotations: {} },
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
      return this.$REST.K8S.encode(
        this.$REST.K8S.SECRET,
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
