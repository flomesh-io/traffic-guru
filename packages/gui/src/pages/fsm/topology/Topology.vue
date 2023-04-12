<template>
  <a-card
    :title="$t('Dashboard')"
    class="bg-white card nopd"
  >
    <template #extra>
      <Timeline
        v-model:dateVal="dateVal"
        @dateChange="dateChange"
      />
    </template>
    <div class="flex">
      <div class="flex-item topology-warpper">
        <TopologyChart
          height="600px"
          :where="topoWhere"
          :loading="loading"
          v-bind="{ ...topoData }"
          @destChange="destChange"
        />
      </div>
      <div class="noborder scrollbar scrollbar-div">
        <a-page-header
          :title="name"
          :sub-title="$t(type)"
          @back="clearName"
          v-if="name != ''"
        />
        <a-page-header
          title=""
          :sub-title="$t('Overview')"
          v-if="name == ''"
        />
        <RightBar
          :where="where"
          @destChange="destChange"
        />
      </div>
    </div>
  </a-card>
</template>

<script>
import Timeline from "@/components/tool/Timeline";
import TopologyChart from "@/components/chart/topo/TopologyChart";
import RightBar from "./RightBar.vue";
import { getSQLWhere, getTopoWhere } from "@/services/clickhouse";
import clickhouse_svc from "@/services/clickhouse.js";
export default {
  name: "Topology",
  components: {
    TopologyChart,
    RightBar,
    Timeline,
  },

  i18n: require("@/i18n"),
  props: {},
  data() {
    return {
      dateVal: [60, 100],
      topoData: {},
      marks: {},
      loading: true,
      topoWhere: "",
      name: "",
      type: "",
    };
  },

  computed: {
    where() {
      return (
        getSQLWhere(this.type, this.name, this.dateVal[0], this.dateVal[1]) ||
        ""
      );
    },
  },

  mounted() {
    this.loaddata();
  },

  methods: {
    clearName() {
      this.name = "";
      this.type = "";
    },

    destChange(d) {
      this.name = d.name;
      this.type = d.type;
    },

    loaddata() {
      this.loading = true;
      this.setTopoWhere();
      clickhouse_svc.getTopoData({ where: this.topoWhere }).then((res) => {
        this.loading = false;
        let _topoData = clickhouse_svc.setTopoData()(res);
        this.topoData = _topoData;
      });
    },

    setTopoWhere() {
      this.topoWhere = getTopoWhere(this.dateVal[0], this.dateVal[1]) || "";
    },

    dateChange() {
      this.loaddata();
    },
  },
};
</script>

<style lang="less" scoped>
  #components-slider-demo-mark {
    position: absolute;
    right: 40px;
    top: 2px;
    width: 500px;
  }
  #components-slider-demo-mark h4 {
    margin: 0 0 16px;
  }
  #components-slider-demo-mark .ant-slider-with-marks {
    margin-bottom: 44px;
  }
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  .ant-page-header {
    padding-bottom: 0;
  }
  .slider-dot &:deep(.ant-slider-dot) {
    border-radius: 2px;
    width: 12px;
    height: 12px;
    top: -5px;
  }
  .slider-dot &:deep(.ant-slider-handle) {
    border-radius: 2px;
    width: 12px;
    height: 12px;
    background: #00a2e6;
    margin-left: 2px;
  }
  .slider-dot &:deep(.ant-slider-rail) {
    height: 12px;
    top: -1px;
  }
  .slider-dot &:deep(.ant-slider-mark-text) {
    min-width: 50px;
  }
  .setting {
    position: relative;
    left: -15px;
    top: 5px;
    font-size: 30px;
    color: #00a2e6;
  }
  .scrollbar-div {
    width: 400px;
    border-left: 1px solid rgb(235, 237, 240);
  }
  .topology-warpper {
    height: calc(100vh - 190px);
    overflow: hidden;
  }
</style>
