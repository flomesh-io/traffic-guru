<template>
  <a-card
    class="card nopd"
    :title="$t('Events')"
    :loading="loading"
  >
    <template
      v-if="hasSearch"
      #extra
    >
      <div>
        <a-input-search
          v-model:value="params.key"
          @search="search()"
          class="right-search-input"
          :placeholder="$t('search')"
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
          current: params.pageNo,
          pageSize: params.pageSize,
          showTotal: (total, range) => `${$t('Total')} ${total}`,
          total: params.total,
        }"
        :columns="dataColumns"
        :data-source="events"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'count'">
            <a-badge :count="record.count" />
          </template>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
const columns = [
  {
    key: "Reason", 
    dataIndex: "reason",
  },
  {
    key: "Info", 
    dataIndex: "info",
  },
  {
    key: "Source", 
    dataIndex: "source",
  },
  {
    key: "Target", 
    dataIndex: "target",
  },
  {
    key: "Count", 
    dataIndex: "count",
  },
  {
    key: "First", 
    dataIndex: "first",
  },
  {
    key: "Lasted", 
    dataIndex: "lasted",
  },
];
export default {
  name: "EventList",
  props: ["url", "hasSearch", "namespace"],
  i18n: require("@/i18n"),
  data() {
    return {
      params: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        key: "",
      },

      columns,
      loading: false,
      events: [],
    };
  },

  computed: {
    dataColumns() {
      return this.columns.map((column) => {
        column.title = this.$t(column.key);
        return column;
      });
    },
  },

  created() {
    this.search();
  },

  methods: {
    MakeUrl() {
      let append = this.$REST.K8S.append(
        this.params.pageSize,
        this.params.pageNo,
        "d,creationTimestamp",
        this.params.key,
      );
      return this.$REST.K8S.encode(this.url, append, this.namespace);
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.params.pageNo = pageNo;
        this.params.pageSize = pageSize;
      }
      this.loading = true;
      this.$request(this.MakeUrl(), this.$METHOD.GET).then((res) => {
        let _data = res.data; 
        this.events = this.reset(_data.items); 
        this.params.total = _data.count;
        this.loading = false;
      });
    },

    reset(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].uid = list[i].metadata.uid;
        list[i].name = list[i].metadata.name;
        list[i].namespace = list[i].metadata.namespace;
        list[i].info = list[i].message;
        list[i].source = list[i].source&&list[i].source.component?(list[i].source?.component + "/" + list[i].source?.host):'-';
        list[i].target = list[i].involvedObject?.fieldPath;
        list[i].count = list[i].count;
        list[i].first = list[i].firstTimestamp?new Date(list[i].firstTimestamp).toLocaleString():'-';
        list[i].lasted = list[i].lastTimestamp?new Date(list[i].lastTimestamp).toLocaleString():'-';
        list[i].info = list[i].message;
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
  .svg {
    width: 30px;
    height: 30px;
    margin-top: 10px;
  }
</style>
