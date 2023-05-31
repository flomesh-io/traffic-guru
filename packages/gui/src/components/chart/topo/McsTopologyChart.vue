<template>
  <div class="Echarts relative">
    <a-skeleton
      v-show="loading"
      avatar
      active
      :paragraph="{ rows: 6 }"
      style="padding: 100px 50px"
    />
		
    <EmptyResult 
      v-if="!loading && state == 0"
      class="relative result"
      style="margin-bottom: 100px"
      :sub-title="$t('Check other time periods.')"
    />
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
import EmptyResult from "@/components/tag/EmptyResult";
export default {
  name: "McsTopologyChart",
  i18n: require("@/i18n"),
  components: { EmptyResult },
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
  },

  data() {
    return {
      isMounted: false,
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
          type: params.data.type,
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

    renderEcharts() {
      let dom = this.$refs.main;
      let myChart = this.$echarts.init(dom);
      myChart.hideLoading();
      let _data = _.cloneDeep(this.nodes);
      let legends = this.categories.splice(0,5);
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
            itemHeight: 15,
            itemWidth: 15,
            top: "10px",
            right: "20px",
            // selectedMode: 'single',
            data: legends,

            formatter: function (name) {
              return name.length > 18 ? name.substr(0, 18) + "..." : name;
            },
          },
          {
            type: "scroll",
            orient: "vertical",
            itemHeight: 15,
            itemWidth: 15,
            top: "10px",
            right: "140px",
            // selectedMode: 'single',
            data: this.categories,

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
            layout: 'none',
            data: _data,
            circular: {
              rotateLabel: false,
            },

            force: {
              initLayout: "circular",
              repulsion: 300,
              gravity: "0.1",
              edgeLength: [10, 300],
            },

            links: this.links,
            categories: legends.concat(this.categories),
            roam: true,
            focusNodeAdjacency: true,
            edgeSymbol: ["circle", "arrow"],
            draggabled: true,
            label: {
              position: "right",
              formatter: "{b}",
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
                return params.data && params.data.name || params.name;
              },
            },

            lineStyle: {
              type: "solid",
              color: "source",
              // curveness: 0.3,
            },

            emphasis: {
              focus: "adjacency",
              lineStyle: {
                opacity: 1,
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
    height: calc(100vh - 100px);
  }
</style>
