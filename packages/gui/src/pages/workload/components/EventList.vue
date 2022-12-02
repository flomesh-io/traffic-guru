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
          <template v-if="column.dataIndex === 't'">
            <div>
              <a-tooltip
                placement="topLeft"
                :title="record.t"
              >
                <a href="javascript:void(0)">
                  <svg
                    class="icon svg"
                    aria-hidden="true"
                  >
                    <use
                      :xlink:href="$REST.KUBE.iconStatus[record.t]"
                    />
                  </svg>
                </a>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
const columns = [
  {
    key: " ", 
    dataIndex: "t",
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
  components: {},
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
      let append = this.$REST.KUBE.append(
        this.params.pageSize,
        this.params.pageNo,
        "d,creationTimestamp",
        this.params.key,
      );
      return this.$REST.KUBE.encode(this.url, append, this.namespace);
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.params.pageNo = pageNo;
        this.params.pageSize = pageSize;
      }
      this.loading = true;
      this.$request(this.MakeUrl(), this.$METHOD.GET).then((res) => {
        let _data = res.data;
        this.events = this.reset(_data.events);
        this.params.total = _data.listMeta.totalItems;
        this.loading = false;
      });
    },

    reset(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].uid = list[i].objectMeta.uid;
        list[i].name = list[i].objectMeta.name;
        list[i].namespace = list[i].objectMeta.namespace;
        list[i].info = list[i].message;
        list[i].source = list[i].sourceComponent + " " + list[i].sourceHost;
        list[i].target = list[i].object;
        list[i].count = list[i].count;
        list[i].first = new Date(list[i].firstSeen).toLocaleString();
        list[i].lasted = new Date(list[i].lastSeen).toLocaleString();
        list[i].info = list[i].message;
        list[i].t = list[i].type;
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
