<template>
  <PageLayout
    :title="$t('log')"
    :hide-head="true"
  >
    <a-result
      v-if="!loading && data.length == 0"
      class="mt-100"
      :title="$t('Global search')"
      :sub-title="$t('No matching data found')"
    >
      <template #icon>
        <img
          src="../../assets/img/empty.svg"
          style="width: 300px"
        >
      </template>
    </a-result>
    <a-card
      class="nopd search-content transparent"
      :bordered="false"
      :loading="loading"
      v-if="loading || data.length > 0"
    >
      <a-list
        item-layout="vertical"
        :pagination="{
          showSizeChanger: false,
          showQuickJumper: false,
          onShowSizeChange: getData,
          onChange: getData,
          current: pageNo,
          pageSize: pageSize,
          showTotal: (total, range) => `${$t('Total')} ${total}`,
          total: total,
        }"
      >
        <a-list-item
          v-for="(record, index) in data"
          :key="index"
        >
          <a-list-item-meta class="uni-search-list-meta">
            <template #avatar>
              <svg
                v-if="record.type.indexOf('component.') >= 0"
                class="card-avatar icon"
                aria-hidden="true"
              >
                <use
                  :xlink:href="
                    '#' + icons[record.type.replace('component.', '')]
                  "
                />
              </svg>
              <div
                v-else-if="
                  svgs[record.type] &&
                    (svgs[record.type].default ||
                      typeof svgs[record.type] == 'string')
                "
                class="avatar"
              >
                <img
                  :src="svgs[record.type]"
                  width="50"
                  height="50"
                >
              </div>
              <component
                class="avatar avatar-component"
                v-else
                :is="svgs[record.type]"
              />
            </template>
            <template #title>
              <div>
                {{ $t("as") }}&nbsp;:&nbsp;
                <a
                  href="javascript:void(0)"
                  @click="detail(record)"
                >{{
                  record.name
                }}</a>
              </div>
              <div>
                {{ $t("ID") }}&nbsp;:&nbsp;
                <a
                  href="javascript:void(0)"
                  @click="detail(record)"
                >{{
                  record.target_id
                }}</a>
              </div>
            </template>
          </a-list-item-meta>
          <template #actions>
            <span><FieldTimeOutlined />
              {{ new Date(record.updated_at).toLocaleString() }}</span>
            <span
              v-if="record.namespace"
            >{{ $t("Namespace") }} : {{ record.namespace }}</span>
            <span v-if="record.uid">{{ $t("UID") }}: {{ record.uid }}</span>
          </template>
        </a-list-item>
      </a-list>
    </a-card>
  </PageLayout>
</template>

<script>
import {
  select_keys,
} from "@/services/clickhouse";
import JsonEditor from "@/components/editor/JsonEditor";
import {
  DownOutlined,
  LinkOutlined,
  FieldTimeOutlined,
  NodeIndexOutlined,
  EditOutlined,
  MoreOutlined,
  SearchOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";
import { mapState } from "vuex";
import CardList from "@/components/card/CardList";
import PageLayout from "@/layouts/PageLayout";
export default {
  name: "UniSearch",
  i18n: require("@/i18n"),
  components: {
    DownOutlined,
    PageLayout,
    LinkOutlined,
    NodeIndexOutlined,
    FieldTimeOutlined,
    EditOutlined,
    MoreOutlined,
    SearchOutlined,
    CardList,
    JsonEditor,
  },

  props: ["keyword"],
  data() {
    return {
      svgs: {
        service: require("@/assets/img/service.png"),
        ingress: LoginOutlined,
        egress: LogoutOutlined,
      },

      icons: {
        pipy: "icon-pipy",
        aiur: "icon-component",
        clickhouse: "icon-clickhouse",
        mysql: "icon-mysql",
        ingress: "icon-ingress",
        cluster: "icon-lbtotal",
        checkpoint: "icon-checkpoint",
        sidecar: "icon-car",
        kubernetes: "icon-KS",
      },

      date: "",
      log: "{}",
      arrow: "desc",
      visible: false,
      select_keys,
      endDate: "",
      sortBy: "timestamp",
      prefix: " ",
      loading: true,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      data: [],
    };
  },

  computed: {
    ...mapState("setting", ["layout", "pageWidth"]),
    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  created() {
    this.getData();
  },

  methods: {
    getData(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      this.loading = true;
      this.$gql.query(`uniSearch(where: $where, start: ${this.start}, limit: ${this.pageSize})`,{
        where: {
          type: [
            "service",
            "ingress",
            "engress",
            "component.aiur",
            "component.clickhouse",
            "component.mysql",
            "component.ingress",
            "component.cluster",
            "component.checkpoint",
            "component.sidecar",
            "component.pipy",
            "component.prometheus",
          ],
          name: this.keyword,
        }
      }).then((res) => {
        this.data = res.values;
        this.total = res.aggregate.totalCount;
        this.loading = false;
      });
    },

    detail(item) {
      this.visible = false;
      this.$emit("open", {});
      if (item.type == "service") {
        this.$router.push({
          path: `/fsm/service/detail/${item.namespace}/${item.target_id}`,
        });
      } else if (item.type == "ingress") {
        this.$router.push({
          path: `/fsm/ingress/detail/${item.namespace}/${item.target_id}`,
        });
      } else if (item.type == "egress") {
        this.$router.push({
          path: `/fsm/egress/detail/${item.namespace}/${item.target_id}`,
        });
      } else if (item.type.indexOf("component.") >= 0) {
        this.$router.push({
          path: `/ops-center/components`,
        });
      }
    },

    orderBy(key, arrow) {
      this.sortBy = key.replace(/\./g, "_");
      this.arrow = arrow;
      this.getData();
    },

    onClose() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
  :deep(.page-header) {
    padding-bottom: 0;
  }
  :deep(.ant-list-vertical .ant-list-item-action) {
    margin-top: 8px;
  }
  .uni-search-list-meta {
    margin-bottom: 0;
  }
</style>
