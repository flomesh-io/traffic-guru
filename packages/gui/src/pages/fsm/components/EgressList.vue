<template>
  <a-card
    class="card nopd"
    :title="$t('Egress')"
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
          v-permission="['egress:create']"
        />
        <a-button
          type="link"
          shape="circle"
          @click="newEgress"
          v-permission="['egress:create']"
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
          v-permission="['egress:create']"
        />
        <SyncBar
          :percent="syncLoading"
          @sync="sync(true)"
          v-permission="['egress:create']"
        />
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
        :columns="dataColumns"
        :data-source="list"
        class="bg-white"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <div>
              <a
                href="javascript:void(0)"
                @click="detail(record.id, record.namespace)"
              >{{ record.name }}</a>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'labels'">
            <div>
              <a-tag
                :key="index"
                v-for="(node, index) in Object.keys(record.labels)"
                :closable="false"
              >
                {{ node }}:{{ record.labels[node] }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <div>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item
                      v-permission="['egress:find']"
                    >
                      <a @click="detail(record.id, record.namespace)">{{
                        $t("edit")
                      }}</a>
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
                        <a v-permission="['egress:delete']">{{
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
import {
  MoreOutlined,
  PlusCircleTwoTone,
} from "@ant-design/icons-vue";
import SyncBar from "@/components/tool/SyncBar";
const columns = [
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Namespace",
    width: 130,
    dataIndex: "namespace",
  },
  {
    key: "protocol",
    dataIndex: "protocol",
  },
  {
    key: "Creation Timestamp",
    dataIndex: "creationTimestamp",
    sorter: true,
  },
  {
    key: "Action",
    width: 130,
    dataIndex: "action",
  },
];
export default {
  name: "EgressList",
  components: { MoreOutlined, PlusCircleTwoTone, SyncBar },
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
      loading: true,
      list: [],
    };
  },

  computed: {
    dataColumns() {
      return this.columns.map((column) => {
        column.title = this.$t(column.key);
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
        this.$gql.mutation(`fetchEgresses`).then(() => {
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
        .mutation(`deleteEgressSync(id:${id}){data{id}}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    detail(id, namespace) {
      this.$router.push({
        path: `/fsm/egress/detail/${namespace}/${id}`,
      });
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      let pagination = {
        start: this.start, 
        limit: this.pageSize
      };
      this.loading = true;
      let filters = {
        name: { contains: this.key }
      };
      this.$gql
        .query(
          `getEgresses(filters: $filters, pagination: $pagination){
						data{id,attributes{name,content,createdAt}},
						meta{pagination{total}}
					}`,
          { 
            filters,pagination
          },{
            filters: "EgressFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.list = this.reset(res.data);
          this.total = res.pagination.total;
          this.loading = false;
        });
    },

    reset(list) {
      for (let i = 0; i < list.length; i++) {
        let _content = list[i].content;
        list[i].name = _content.metadata.name;
        list[i].namespace = _content.metadata.namespace;
        list[i].protocol = _content.metadata.protocol;
        list[i].labels = _content.metadata.labels
          ? _content.metadata.labels
          : {};
        list[i].hosts = _content.hosts;
        list[i].creationTimestamp = new Date(
          list[i].createdAt,
        ).toLocaleString();
      }
      return list;
    },

    newEgress() {
      this.$router.push({
        path: "/fsm/egress/create",
      });
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
