<template>
  <PageLayout
    :avatar="LayoutOutlined"
    :title="$t('Custom Dashboards')"
  >
    <template #headerContent>
      <div />
    </template>
    <template #extra>
      <div v-permission="['dashboard:create']">
        <HeadInfo
          class="split-right"
          :title="$t('New Dashboard')"
        >
          <template #body>
            <div>
              <PlusCircleTwoTone
                @click="add"
                class="font-primary icon-menu rotate-icon"
              />
            </div>
          </template>
        </HeadInfo>
      </div>
    </template>
    <div class="search-content">
      <DashboardListResults
        ref="result"
        :loading="loading"
        :dashboards="dashboards"
        @search="search"
      />
    </div>
    <LayoutOutlined v-if="false" />
  </PageLayout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import { addDashboard } from "@/services/dashboard";
import { PlusCircleTwoTone, LayoutOutlined } from "@ant-design/icons-vue";
import { mapState } from "vuex";
import DashboardListResults from "@/components/result/DashboardListResults";
export default {
  name: "DashboardList",
  i18n: require("@/i18n"),

  components: {
    PageLayout,
    DashboardListResults,
    PlusCircleTwoTone,
    LayoutOutlined,
    HeadInfo,
  },
	
  data() {
    return {
      dashboards: [],
      loading: true,
    };
  },

  computed: {
    ...mapState("setting", ["layout", "pageWidth"]),
  },

  mounted() {
    this.search();
  },

  methods: {
    add() {
      addDashboard({ name: "New Dashboard", widget: "", apply: "" }).then(
        (res) => {
          this.$router.push({
            path: "/system/dashboard/detail/" + res.dashboard.id,
          });
        },
      );
    },

    search() {
      this.loading = true;
      this.$gql
        .query(`dashboards{data{id,attributes{name,apply,content,updatedAt}}}`)
        .then((res) => {
          this.dashboards = res.data;
          this.dashboards.forEach((item) => {
            item.widgets = [];
            if (item.content.widget) {
              item.widgets = item.content.widget
                .replace(/^,/g, "")
                .split(",");
            }
          });
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
