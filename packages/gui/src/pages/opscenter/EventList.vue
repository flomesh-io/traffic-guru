<template>
  <div>
    <a-card
      :title="$t('Operating record')"
      class="nopd"
      :loading="loading"
    >
      <template #extra>
        <div>
          <a-input-search
            v-model:value="key"
            @search="search()"
            class="right-search-input"
            :placeholder="$t('search') + ' IP'"
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
              <div v-if="record.target">
                <b>{{ record.action }}</b> {{ record.target.name }} : [<b>{{
                  record.target.id
                }}</b>]
              </div>
              <div v-else>
                <b>{{ record.action }}</b>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'createdAt'">
              <div>
                {{ new Date(record.createdAt).toLocaleString() }}
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
const columns = [
  {
    key: "user",
    dataIndex: ["user", "username"],
  },
  {
    key: "IP",
    dataIndex: "loginIp",
  },
  {
    key: "content",
    dataIndex: "action",
  },
  {
    key: "updatedAt",
    sorter: true,
    dataIndex: "updatedAt",
  },
];
export default {
  name: "EventList",
  components: {},
  i18n: require("@/i18n"),
  data() {
    return {
      key: "",
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
        loginIp: { contains: this.key }
      };
      let order = "updatedAt:desc";
      if (this.sorter && this.sortOrder) {
        order = this.sortOrder.replace(/\$/g, "");
        order = order.replace(/end/g, "");
        order = `${this.sorter}:${order}`;
      }
      this.$gql
        .query(
          `events(filters: $filters, pagination: $pagination, sort: "${order}"){
						data{id,attributes{
							updatedAt,
							action,
							loginIp,
							user{data{id,attributes{username}}}
						}},
						meta{pagination{total}}
					}`,
          { 
            filters,pagination
          },{
            filters: "EventFiltersInput",
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
