<template>
  <div>
    <a-card
      class="nopd"
      :title="mode?$t('healthcheck'):null"
      :tab-list="mode?null:typeOptions"
      :active-tab-key="type"
      :loading="loading"
      @tabChange="key => onTabChange(key)"
    >
      <template #customTab="item">
        <span> {{ $t(item.tab) }} {{ $t('Log') }} </span>
      </template>
      <template
        v-if="mode"
        #extra
      >
        <div>
          <a-date-picker
            v-model:value="date"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('Start Date')"
            @change="search()"
          />
          <em> ~ </em>
          <a-date-picker
            v-model:value="endDate"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('End Date')"
            @change="search()"
          />
          <a-input-search
            v-model:value="keyAction"
            @search="search()"
            class="right-search-input"
            style="width: 200px"
            :placeholder="$t('search')"
          />
        </div>
      </template>
      <template
        v-else
        #tabBarExtraContent
      >
        <div>
          <a-date-picker
            v-model:value="date"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('Start Date')"
            @change="search()"
          />
          <em> ~ </em>
          <a-date-picker
            v-model:value="endDate"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('End Date')"
            @change="search()"
          />
          <a-input-search
            v-model:value="keyAction"
            @search="search()"
            class="right-search-input"
            style="width: 200px"
            :placeholder="$t('search')"
          />
        </div>
      </template>
      <div>
        <a-table
          :columns="dataColumns"
          :data-source="list"
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
            <template v-if="column.dataIndex === 't'">
              <Status :d="{status:type=='bgp'? record.errorCode ? 'failed' : '' : record.state=='unhealthy' ? 'failed' : ''}" />
            </template>

            <template v-else-if="column.dataIndex === 'errorCode'">
              <div>
                {{ record.errorCode ? record.errorCode : "-" }}
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'content'">
              <div>
                <a @click="detail(record.message)">
                  {{ $t('detail') }}
                </a>
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
import Status from "@/components/tag/Status";
import {
  clickhouseCount,
  clickhouseQuery,
  clickhouseFormat,
} from "@/services/clickhouseCommon";

const columns = [
  {
    key: " ", 
    dataIndex: "t",
    width:30,
  },
  {
    key: "4LB",
    dataIndex: "serviceName",
  },
  {
    key: "Endpoint",
    dataIndex: "upstream",
  },
  {
    key: "Target",
    dataIndex: "target",
  },
  {
    key: "State",
    dataIndex: "state",
  },
  {
    key: "Time",
    dataIndex: "timestamp",
  },
  {
    key: "content",
    dataIndex: "content",
  },
];
const embedColumns = [
  {
    key: " ", 
    dataIndex: "t",
    width:30,
  },
  {
    key: "as",
    dataIndex: "clusterName",
  },
  {
    key: "method",
    dataIndex: "direction",
  },
  {
    key: "Error Code",
    dataIndex: "errorCode",
  },
  {
    key: "Type",
    dataIndex: "type",
  },
  {
    key: "Time",
    dataIndex: "timestamp",
  },
  {
    key: "content",
    dataIndex: "content",
  },
];
export default {
  name: "EventList",
  components: {JsonEditor,Status},
  props: [
    "mode",
    "serviceId"
  ],

  i18n: require("@/i18n"),
  data() {
    return {
      date: "",
      endDate: "",
      visible:false,
      pageSize: 10,
      pageNo: 1,
      total: 0,
      loading: true,
      advanced: true,
      sorter: "updatedAt",
      sortOrder: "end$desc",
      type:'healthcheck',
      typeOptions: [{tab:"Healthcheck",key:"healthcheck"},{tab:"BGP",key:"bgp"}],
      columns,
      embedColumns,
      list: [],
      keyAction: "",
    };
  },

  computed: {
    dataColumns() {
      console.log(this.type)
      let _columns = this.type=="bgp"?this.embedColumns:this.columns;
      console.log(_columns)
      return _columns.map((column) => {
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
    if(this.mode){
      this.type = this.mode;
    }
    this.search();
  },

  methods: {
    onTabChange(value) {
      this.type = value;
      this.search();
    },

    sort(pagination, filters, sorter) {
      (this.sorter = sorter.field),
      (this.sortOrder = sorter.order),
      this.search();
    },

    onClose() {
      this.visible = false;
    },
		
    goTarget(id,type){
      if(type == "l4Lb"){
        this.$router.push({
          path: "/flb/4lb/detail/" + id,
        });
      } else if(type == "upstream"){
      }
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
      this.loading = true;

      let where = ""
      if (this.endDate) {
        where += ` and timestamp < '${new Date(this.endDate).getTime()}'`
      }
      if (this.date) {
        where += ` and timestamp > '${new Date(this.date).getTime()}'`
      }
      
      let fields = "timestamp,upstream,target,state,serviceName,message"
      let table = "healthcheckLog"

      if (this.serviceId) {
        where += ` and serviceId ='${this.serviceId}'`
      }
      if (this.type == "bgp") {
        fields = "timestamp,clusterName,direction,payload,type,body,errorCode,message"
        table = "bgpLog"
        if (this.keyAction) {
          where += ` and (clusterName like '%${this.keyAction}%' or direction like '%${this.keyAction}%' or type like '%${this.keyAction}%') `
        }
      } else {
        if (this.keyAction) {
          where += ` and (upstream like '%${this.keyAction}%' or target like '%${this.keyAction}%' or state like '%${this.keyAction}%') `
        }
      }
      clickhouseCount(table,where).then((res) => {
        this.total = res.data;
      });
      clickhouseQuery(table, fields, where, this.pageNo, this.pageSize).then((res) => {
        clickhouseFormat(res,fields)
        console.log(res)
        this.list = res.data;
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
