<template>
  <a-card
    class="card nopd"
    :title="$t('Ingress')"
    :loading="loading"
  >
    <template
      v-if="hasSearch"
      #extra
    >
      <div>
        <a-input-search
          v-model:value="key"
          @search="search()"
          class="right-search-input"
          :placeholder="$t('search')"
        />
        <a-divider
          type="vertical"
          v-permission="['ingress:create']"
        />
        <a-button
          type="link"
          shape="circle"
          @click="newItem"
          v-permission="['ingress:create']"
        >
          <template
            #icon
          >
            <PlusCircleTwoTone
              class="font-20 icon-menu-sm rotate-icon"
            />
          </template>
        </a-button>
        <a-divider
          type="vertical"
          v-permission="['ingress:create']"
        />
        <SyncBar
          :percent="syncLoading"
          @sync="sync(true)"
          v-permission="['ingress:create']"
        />
        <a-divider type="vertical" />
        <EnvSelector />
      </div>
    </template>
    <div>
      <a-table
        :pagination="{
          showSizeChanger: false,
          showQuickJumper: false,
          onShowSizeChange: search,
          onChange: search,
          current: pageNo,
          pageSize: pageSize,
          showTotal: (total, range) => `${$t('Total')} ${total}`,
          total: total,
        }"
        @change="sort"
        :columns="dataColumns"
        :data-source="list"
        class="bg-white"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <div>
              <a
                href="javascript:void(0)"
                @click="detail(record.id)"
              >{{
                record.name
              }}</a>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'labels'">
            <div
              v-if="record.content.metadata && record.content.metadata.labels"
            >
              <a-tag
                :key="index"
                v-for="(labelKey, index) in Object.keys(
                  record.content.metadata.labels,
                )"
                :closable="false"
              >
                {{ labelKey }}:{{ record.content.metadata.labels[labelKey] }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'hosts'">
            <div>
              <a-tag
                :key="index"
                v-show="rule.host"
                v-for="(rule, index) in record.content.spec.rules"
                :closable="false"
              >
                {{ rule.host }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <div>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a
                        v-permission="['ingress:update']"
                        @click="detail(record.id)"
                      >{{ $t("edit") }}</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm
                        placement="topLeft"
                        :ok-text="$t('Yes')"
                        :cancel-text="$t('No')"
                        @confirm="remove(record.id)"
                      >
                        <template #title>
                          <p>{{ $t("Tip") }}</p>
                          <p>{{ $t("Are you sure to delete this?") }}</p>
                        </template>
                        <a v-permission="['ingress:delete']">{{
                          $t("delete")
                        }}</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
                <a><MoreOutlined /></a>
              </a-dropdown>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import EnvSelector from "@/components/menu/EnvSelector";
import { MoreOutlined, PlusCircleTwoTone } from "@ant-design/icons-vue";
import SyncBar from "@/components/tool/SyncBar";
const columns = [
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Namespace",
    width: 130,
    dataIndex: "namespaceName",
  },
  {
    key: "Labels",
    dataIndex: "labels",
  },
  {
    key: "Hosts",
    dataIndex: "hosts",
  },
  {
    key: "Creation Timestamp",
    dataIndex: "created_at",
    sorter: true,
  },
  {
    key: "Action",
    width: 130,
    dataIndex: "action",
  },
];
export default {
  name: "IngressList",
  components: { EnvSelector, MoreOutlined, PlusCircleTwoTone, SyncBar },
  props: ["hasSearch"],
  i18n: require("@/i18n"),
  data() {
    return {
      pageNo: 1,
      syncLoading: -1,
      pageSize: 10,
      total: 0,
      key: "",
      columns,
      sorter: "name",
      sortOrder: "asc",
      loading: true,
      list: [],
    };
  },

  computed: {
    dataColumns() {
      return this.columns.map((column) => {
        column.title = this.$t(column.key);
        if (column.sorter && this.sorter == column.dataIndex) {
          column.sortOrder = this.sortOrder;
        }
        return column;
      });
    },

    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  created() {
    this.sync(true);
  },

  methods: {
    sync(init) {
      if (init) {
        this.syncLoading = 0;
        this.$gql.mutation(`fetchIngresses`).then(() => {
          this.syncLoading = 100;
          this.search();
          setTimeout(() => {
            this.syncLoading = -1;
          }, 1000);
        });
      }
      if (this.syncLoading < 90) {
        this.syncLoading += 10;
        setTimeout(() => {
          this.sync();
        }, 100);
      }
    },

    remove(id) {
      this.$gql
        .mutation(`deleteIngressSync(input:{where:{id:${id}}}){id}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    newItem() {
      this.$router.push({
        path: "/fsm/ingress/create",
      });
    },

    detail(id) {
      this.$router.push({
        path: `/fsm/ingress/detail/${id}`,
      });
    },

    sort(pagination, filters, sorter) {
      (this.sorter = sorter.field),
      (this.sortOrder = sorter.order),
      this.search();
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      this.loading = true;
      const where = { name_contains: this.key };
      let order = "name:asc";
      if (this.sorter && this.sortOrder) {
        order = this.sortOrder.replace(/end/g, "");
        order = order.replace(/\$/g, "");
        order = `${this.sorter}:${order}`;
      }
      this.$gql
        .query(
          `getIngresses(where: $where, start: ${this.start}, limit: ${this.pageSize}, sort: "${order}"){values{id,name,namespace{id,name,registry{id,name}},content,created_at},aggregate{totalCount}}`,
          { 
            where
          },
        )
        .then((res) => {
          this.list = this.reset(res.values);
          this.total = res.aggregate.totalCount;
          this.loading = false;
        });
    },

    reset(list) {
      for (let i = 0; i < list.length; i++) {
        let _content = list[i].content;
        list[i].namespaceName = list[i].namespace.name;
        list[i].labels = _content.metadata.labels
          ? _content.metadata.labels
          : {};
        list[i].hosts = _content.hosts;
        list[i].created_at = new Date(list[i].created_at).toLocaleString();
      }
      return list;
    },
  },
};
</script>

<style lang="less" scoped>
  .search {
    margin-bottom: 54px;
  }
  .fold {
    width: calc(100% - 216px);
    display: inline-block;
  }
  .operator {
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
