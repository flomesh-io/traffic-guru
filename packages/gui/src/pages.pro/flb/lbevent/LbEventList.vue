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
            v-model:value="keyAction"
            @search="search()"
            class="right-search-input"
            style="width: 200px"
            :placeholder="$t('search') + ' ' + $t('Action')"
          />
          <a-input-search
            v-model:value="key"
            @search="search()"
            class="right-search-input"
            style="width: 200px"
            :placeholder="$t('search') + ' ' + $t('User')"
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
                <a @click="detailInterface(record.content)">
                  {{ $t('Interface') }}
                </a>
              </div>
              <div>
                <a @click="detail(record.data)">
                  {{ $t('Data') }}
                </a>
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
    key: "user",
    dataIndex: ["user", "username"],
  },
  {
    key: "IP",
    dataIndex: "loginIp",
  },
  {
    key: "Action",
    dataIndex: "action",
  },
  {
    key: "as",
    dataIndex: "name",
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
      keyAction: "",
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
      const keyAction = this.keyAction.replace(/\s*/g,"")
      let filters = {
        //loginIp: { contains: this.key },
        user: {username: { contains: this.key }},
        action: { contains: keyAction }
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
							name,
							action,
							data,
							loginIp,
              content,
              from,
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
          res.data.forEach((evt)=>{
            evt.actions = [];
            if(evt.action.indexOf("create") == 0){
              evt.actions.push("create");
              evt.actions.push(evt.action.replace(/^create/,""));
            }else if(evt.action.indexOf("update") == 0){
              evt.actions.push("update");
              evt.actions.push(evt.action.replace(/^update/,""));
            }else if(evt.action.indexOf("delete") == 0){
              evt.actions.push("delete");
              evt.actions.push(evt.action.replace(/^delete/,""));
            }else{
              evt.actions.push(evt.action);
            }
          })
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
