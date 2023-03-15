<template>
  <div class="Echarts relative">
    <a-skeleton
      v-show="loading"
      avatar
      active
      :paragraph="{ rows: 6 }"
      style="padding: 100px 50px"
    />
    <a-result
      v-if="!loading && state == 0"
      class="relative result"
      style="margin-bottom: 100px"
      :title="$t('No data')"
      :sub-title="$t('Check other time periods.')"
    >
      <template #icon>
        <img
          src="../../../assets/img/empty.svg"
          style="width: 300px"
        >
      </template>
    </a-result>
    <div class="iconfont-btn-group">
      <PartitionOutlined
        @click="changeLayout('none')"
        class="iconfont-btn"
        :class="layout == 'none' ? 'active' : ''"
      />
      <DeploymentUnitOutlined
        @click="changeLayout('circular')"
        class="iconfont-btn"
        :class="layout == 'circular' ? 'active' : ''"
      />
      <ForkOutlined
        @click="changeLayout('force')"
        class="iconfont-btn"
        :class="layout == 'force' ? 'active' : ''"
      />
    </div>
    <div
      v-show="!loading && state > 0"
      ref="main"
      class="topology-main"
      :style="height ? 'height:' + height : ''"
    />
  </div>
</template>

<script>
import _ from "lodash";
import { Empty } from "ant-design-vue";
import {
  DeploymentUnitOutlined,
  PartitionOutlined,
  ForkOutlined,
} from "@ant-design/icons-vue";
export default {
  name: "TopologyChart",
  i18n: require("@/i18n"),
  components: { DeploymentUnitOutlined, PartitionOutlined, ForkOutlined },
  props: {
    where: {
      type: String,
      default: ""
    },

    height: {
      type: String,
      default: "",
    },

    categories: {
      type: Array,
      default() {
        return []
      }
    },

    nodes: {
      type: Array,
      default() {
        return []
      }
    },

    state: {
      type: Number,
      default: 0
    },

    loading: {
      type: Boolean
    },

    links: {
      type: Array,
      default() {
        return []
      }
    },

    nodePos: {
      type: Object,
      default() {
        return {}
      }
    },
  },

  data() {
    return {
      isMounted: false,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      layout: "none",
    };
  },

  watch: {
    where: {
      handler() {
        this.loadData();
      },

      deep: true,
    },

    nodes: {
      handler() {
        if (this.isMounted) {
          setTimeout(() => {
            this.renderEcharts();
          }, 100);
        }
      },

      deep: true,
    },
  },

  mounted() {
    this.isMounted = true;
    let dom = this.$refs.main;
    let myChart = this.$echarts.init(dom);
    myChart.showLoading();
    this.renderEcharts();
    myChart.on("click", "series.graph", (params) => {
      if (params.data.name) {
        this.$emit("destChange", {
          name: params.data.name,
          type: params.data.parent ? "pod" : "service",
        });
      }
    });
  },

  methods: {
    loadData() {
      let dom = this.$refs.main;
      let myChart = this.$echarts.init(dom);
      myChart.showLoading();
      this.renderEcharts();
    },

    changeLayout(layout) {
      this.layout = layout;
      let dom = this.$refs.main;
      let myChart = this.$echarts.init(dom);
      myChart.showLoading();
      this.renderEcharts();
    },

    setPos(_data) {
      let services = [];
      (_data || []).forEach((node) => {
        if (this.nodePos[node.id].type == "service") {
          services.push(node.id);
        }
      });
      this.setPos2(services, -1, 1);
    },

    setPos2(ids, _yIndex, level) {
      let yIndex = _yIndex;
      if (ids) {
        ids.forEach((id) => {
          if ((level == 2 && this.nodePos[id].parent == null) || level != 2) {
            this.nodePos[id].y = yIndex;
            this.nodePos[id].x = level;
            yIndex = this.setPos2(
              this.nodePos[id].children,
              yIndex,
              level + 1,
            );
            yIndex++;
            if (level == 1) {
              yIndex++;
            }
          }
        });
      }
      return yIndex;
    },

    renderEcharts() {
      let dom = this.$refs.main;
      let myChart = this.$echarts.init(dom);

      myChart.hideLoading();
      let _data = _.cloneDeep(this.nodes);
      this.setPos(_data);
      (_data || []).forEach((node) => {
        if (this.layout == "none") {
          node.x =
            (this.nodePos[node.id].x ? this.nodePos[node.id].x : 1) * 350;
          node.y =
            (this.nodePos[node.id].y ? this.nodePos[node.id].y : 1) * 80;
        }
        node.label = {
          normal: {
            show: this.layout == "none" ? true : node.symbolSize > 30,
            width: 100,
            overflow: "truncate",
            ellipsis: "...",
            position: "bottom",
          },
        };
      });
      let option = {
        title: {
          text: "",
          subtext: "",
          top: "bottom",
          left: "right",
        },

        tooltip: {
          triggerOn: "mousemove|click",
        },

        legend: [
          {
            type: "scroll",
            orient: "vertical",
            right: "30px",
            // selectedMode: 'single',
            data: (this.categories || []).map(function (a) {
              return a.name;
            }),

            formatter: function (name) {
              return name.length > 18 ? name.substr(0, 18) + "..." : name;
            },
          },
        ],

        animationDuration: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            name: "Les Miserables",
            type: "graph",
            layout: this.layout,
            data: _data,
            circular: {
              rotateLabel: true,
            },

            force: {
              initLayout: "circular",
              repulsion: 300,
              gravity: "0.1",
              edgeLength: [10, 300],
            },

            links: this.links,
            categories: this.categories,
            roam: true,
            focusNodeAdjacency: true,
            edgeSymbol: ["circle", "arrow"],
            draggabled: true,
            label: {
              position: "inside",
              formatter: "{b}",
              borderRadius: [10,10,10,10],
              textStyle: {
                color: "#6a7985",
              },
            },

            itemStyle: {
              normal: {
                borderColor: "#fff",
                borderWidth: 1,
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.3)",
              },
            },

            tooltip: {
              formatter: function (params) {
                return "" + params.name + " " + params.value;
              },
            },

            lineStyle: {
              type: "solid",
              color: "source",
              curveness: this.layout == "none" ? 0 : 0.3,
            },

            emphasis: {
              focus: "adjacency",
              lineStyle: {
                width: 10,
              },
            },
          },
        ],
      };

      myChart.setOption(option, {
        lazyUpdate: true,
      });
    },
  },
};
</script>

<style lang="less" scoped>
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
  a {
    color: #42b983;
  }

  .iconfont-btn-group {
    background-color: #fff;
    border: 0px solid #00a2e6;
    box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 1000;
  }
  .iconfont-btn-group :not(:first-child) {
    border-left: 1px dashed #ddd;
  }
  .iconfont-btn {
    padding: 2px 10px 0 10px;
    line-height: 36px;
    color: #bbbbbb;
    font-size: 24px;
    cursor: pointer;
    text-align: center;
  }
  .iconfont-btn.active {
    color: #00a2e6;
  }
  .result {
    top: 80px;
  }
  .topology-main {
    height: calc(100vh - 200px);
    width: calc(100vw - 450px);
  }
</style>
