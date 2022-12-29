<template>
  <a-card
    class="card nopd"
    :title="$t('Status')"
    :loading="loading"
  >
    <div>
      <a-table
        :columns="dataColumns"
        :data-source="list"
      />
    </div>
  </a-card>
</template>

<script>
const columns = [
  {
    key: "Type", 
    dataIndex: "type",
  },
  {
    key: "Status", 
    dataIndex: "status",
  },
  {
    key: "Last Probe Time", 
    dataIndex: "lastProbeTime",
  },
  {
    key: "Last Transition Time", 
    dataIndex: "lastTransitionTime",
  },
  {
    key: "Reason", 
    dataIndex: "reason",
  },
  {
    key: "Message", 
    dataIndex: "message",
  },
];
export default {
  name: "StatusList",
  components: {},
  props: ["d"],
  i18n: require("@/i18n"),
  data() {
    return {
      columns,
      loading: false,
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
  },

  created() {
    this.search();
  },

  methods: {
    search() {
      this.list = this.reset(this.d);
    },

    reset(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].lastProbeTime = new Date(
          list[i].lastProbeTime,
        ).toLocaleString();
        list[i].lastTransitionTime = new Date(
          list[i].lastTransitionTime,
        ).toLocaleString();
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
  .tooltip {
    width: 30px;
    height: 30px;
    margin-top: 10px;
  }
</style>
