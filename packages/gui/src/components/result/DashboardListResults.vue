<template>
  <div class="search-content">
    <CardList
      :result-empty="{ status: 404, title: $t('No data') }"
      :loading="loading"
      :data-source="dashboards || []"
      :hide-action-title="true"
      type="component"
      :actions="[
        {
          icon: 'EditOutlined',
          text: $t('edit'),
          call: detail,
          permission: ['dashboard:update'],
        },
        {
          icon: 'DeleteOutlined',
          text: $t('delete'),
          call: remove,
          hide: true,
          permission: ['dashboard:delete'],
        },
      ]"
    >
      <template #default="{ item }">
        <a-card-meta>
          <template #title>
            <div class="mb-3">
              {{ item.name }}
            </div>
          </template>
          <template #avatar>
            <LayoutOutlined class="LayoutOutlined primary" />
          </template>
          <template #description />
        </a-card-meta>
        <div class="content">
          <div>
            <p>{{ $t("Usage") }}</p>
            <p>{{ item.apply ? item.apply : "-" }}</p>
          </div>
          <div>
            <p>{{ $t("Widgets") }}</p>
            <p>{{ item.widgets ? item.widgets.length : 0 }}</p>
          </div>
        </div>
      </template>
    </CardList>
  </div>
</template>

<script>
import { LayoutOutlined } from "@ant-design/icons-vue";
import { mapState } from "vuex";
import CardList from "@/components/card/CardList";
export default {
  name: "DashboardListResults",
  i18n: require("@/i18n"),
  components: {
    CardList,
    LayoutOutlined,
  },

  props: ["dashboards", "loading"],
  data() {
    return {
      key: "",
      projects: [],
      categray: [
        { value: true, label: "All" },
        { value: false, label: "Success" },
        { value: false, label: "Pending" },
        { value: false, label: "Error" },
      ],
    };
  },

  computed: {
    ...mapState("setting", ["layout", "pageWidth"]),
  },

  mounted() {},

  methods: {
    detail(index, type, item) {
      this.$router.push({
        path: "/system/dashboard/detail/" + item.id,
      });
    },

    remove(index, type, item) {
      this.$gql
        .mutation(
          `deleteDashboard(input:{where:{id:${item.id}}}){dashboard{id}}`,
        )
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    search() {
      this.$emit("search");
    },
  },
};
</script>

<style lang="less" scoped>
  :deep(.page-header) {
    padding-bottom: 0;
  }
  .search-content {
    .clearfix() {
      zoom: 1;
      &:before,
      &:after {
        content: " ";
        display: table;
      }
      &:after {
        clear: both;
        visibility: hidden;
        font-size: 0;
        height: 0;
      }
    }
    .content {
      .clearfix();
      margin-top: 16px;
      & > div {
        position: relative;
        text-align: left;
        float: left;
        width: 50%;
        p {
          line-height: 32px;
          font-size: 24px;
          text-align: center;
          margin: 0;
        }
        p:first-child {
          color: @text-color-second;
          font-size: 12px;
          line-height: 20px;
          margin-bottom: 4px;
        }
      }
    }
  }
  .LayoutOutlined {
    font-size: 20px;
  }
</style>
