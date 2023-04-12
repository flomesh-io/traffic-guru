<template>
  <div>
    <a-card
      :title="$t('Pipy Deploy History')"
      class="nopd"
      :loading="loading"
    >
      <template #extra>
        <div>
          <a-input-search
            v-model:value="key"
            @search="search()"
            class="right-search-input"
            style="width: 200px"
            :placeholder="$t('search') + ' ' + $t('Path')"
          />
        </div>
      </template>
      <div>
        <a-table
          :columns="dataColumns"
          :data-source="events"
          :pagination="{
            showSizeChanger: true,
            showQuickJumper: false,
            onShowSizeChange: search,
            onChange: search,
            current: pageNo,
            pageSize: pageSize,
            showTotal: (total, range) => `${$t('Total')} ${total}`,
            total: total,
          }"
          @change="sort"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'action'">
              <b
                class="mr-10"
                :key="idx"
                v-for="(action,idx) in record.actions"
              >{{ action }} </b>
              <div v-if="record.target">
                {{ record.target.name }} : [<b>{{
                  record.target.id
                }}</b>]
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'data'">
              <div>
                <a @click="detail(record.content)">
                  {{ $t('Data') }}
                </a>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'updatedAt'">
              <div>
                {{ new Date(record.updatedAt).toLocaleString() }}
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
    <a-drawer
      v-if="visible"
      :get-container="false"
      :title="$t('content')"
      placement="bottom"
      height="600"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <JsonEditor
        :is-readonly="true"
        :value="log"
      />
    </a-drawer>
  </div>
</template>

<script>
import JsonEditor from "@/components/editor/JsonEditor";
const columns = [
  {
    key: "Path",
    dataIndex: "path",
  },
  {
    key: "Type",
    dataIndex: "type",
  },
  {
    key: "Version",
    dataIndex: "version",
  },
  {
    key: "updTime",
    sorter: true,
    dataIndex: "updatedAt",
  },
  {
    key: "content",
    dataIndex: "data",
  },
];
export default {
  name: "EventList",
  components: {JsonEditor},
  i18n: require("@/i18n"),
  data() {
    return {
      key: "",
      visible:false,
      pageSize: 10,
      pageNo: 1,
      total: 0,
      loading: true,
      advanced: true,
      sorter: "updatedAt",
      sortOrder: "end$desc",
      columns,
      events: [],
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
    this.search();
  },

  methods: {
    sort(pagination, filters, sorter) {
      (this.sorter = sorter.field),
      (this.sortOrder = sorter.order),
      this.search();
    },

    onClose() {
      this.visible = false;
    },

    detail(content) {
      this.visible = true;
      this.log = JSON.stringify(content||{});;
    },

    detailInterface(content) {
      this.visible = true;
      this.log = content;
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
        path: { contains: this.key },
      };
      let order = "updatedAt:desc";
      if (this.sorter && this.sortOrder) {
        order = this.sortOrder.replace(/\$/g, "");
        order = order.replace(/end/g, "");
        order = `${this.sorter}:${order}`;
      }
      this.$gql
        .query(
          `deployHistories(filters: $filters, pagination: $pagination, sort: "${order}"){
						data{id,attributes{
							updatedAt,
							content,
							version,
							path,
							type
						}},
						meta{pagination{total}}
					}`,
          { 
            filters,pagination
          },{
            filters: "DeployHistoryFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.events = res.data;
          this.total = res.pagination.total;
          this.loading = false;
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
