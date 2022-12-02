<template>
  <div class="sankey">
    <div class="indicators">
      <div
        class="indicator"
        v-for="(field, index) in fields"
        :key="index"
      >
        <div class="title">
          {{ $t(field.title) }}
        </div>
        <div class="measure">
          <div class="value">
            {{ field.value }}
          </div>
          <div class="unit">
            {{ $t(field.unit) }}
          </div>
        </div>
      </div>
    </div>
    <div
      :id="id"
      class="full height-400"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Sankey",
  i18n: require("@/i18n"),
  props: ["fields", "ver"],
  data() {
    return {
      id: "sankey" + Math.ceil(Math.random() * 1000),
      DATA: {
        nodes: [
          {
            name: "Edge SH",
          },
          {
            name: "Edge BJ",
          },
          {
            name: "DMZ1",
          },
          {
            name: "DMZ2",
          },
          {
            name: "DMZ3",
          },
          {
            name: "DMZ4",
          },
          {
            name: "Ingress1",
          },
          {
            name: "Ingress2",
          },
          {
            name: "Ingress3",
          },
          {
            name: "Ingress4",
          },
          {
            name: "Ingress5",
          },
        ],

        links: [
          {
            source: 0,
            target: 2,
            value: 200,
          },
          {
            source: 0,
            target: 3,
            value: 200,
          },
          {
            source: 1,
            target: 4,
            value: 200,
          },
          {
            source: 1,
            target: 5,
            value: 200,
          },
          {
            source: 2,
            target: 6,
            value: 200,
          },
          {
            source: 3,
            target: 7,
            value: 200,
          },
          {
            source: 4,
            target: 8,
            value: 100,
          },
          {
            source: 4,
            target: 9,
            value: 100,
          },
          {
            source: 5,
            target: 10,
            value: 200,
          },
        ],
      },
    };
  },

  computed: {
    ...mapState("setting", ["lang"]),
  },

  watch: {
    lang(newVal) {
      this.$i18n.locale = newVal;
    },

    fields: {
      handler: function () {
        setTimeout(() => {
          this.renderChart();
        }, 100);
      },

      deep: true,
    },

    ver() {
      setTimeout(() => {
        this.renderChart();
      }, 100);
    },
  },

  mounted() {
    this.$i18n.locale = this.lang;
    this.init();
  },

  methods: {
    renderChart() {
      let dom = document.getElementById(this.id);
      if (dom) {
        this.$echarts.dispose(dom);
      }
      let myChart = this.$echarts.init(dom);
      myChart.showLoading();
      myChart.hideLoading();
      myChart.setOption(
        {
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove",
          },
          series: [
            {
              type: "sankey",
              data: this.DATA.nodes,
              links: this.DATA.links,
              emphasis: {
                focus: "adjacency",
              },
              levels: [
                {
                  depth: 0,
                  itemStyle: {
                    color: "rgba(0, 173, 239,0.7)",
                  },
                  lineStyle: {
                    color: "source",
                    opacity: 0.6,
                  },
                },
                {
                  depth: 1,
                  itemStyle: {
                    color: "rgba(255, 157, 77,0.7)",
                  },
                  lineStyle: {
                    color: "source",
                    opacity: 0.6,
                  },
                },
                {
                  depth: 2,
                  itemStyle: {
                    color: "rgba(90, 216, 166,0.7)",
                  },
                  lineStyle: {
                    color: "source",
                    opacity: 0.6,
                  },
                },
                {
                  depth: 3,
                  itemStyle: {
                    color: "rgba(227, 137, 163,0.7)",
                  },
                  lineStyle: {
                    color: "source",
                    opacity: 0.6,
                  },
                },
              ],
              lineStyle: {
                curveness: 0.5,
              },
            },
          ],
        },
        {
          lazyUpdate: true,
        },
      );
    },

    resetLink() {},
    init() {
      let total = this.DATA.nodes.length - 1;
      let maxval = 800,
          targetscal = 50;
      for (let i = 0; i < maxval / targetscal; i++) {
        this.DATA.nodes.push({
          name: "Target" + (i + 1),
        });
      }
      let ingress = [
        [6, 200],
        [7, 200],
        [8, 100],
        [9, 100],
        [10, 200],
      ];
      for (let i = 0; i < ingress.length; i++) {
        for (let x = 0; x < ingress[i][1] / targetscal; x++) {
          total++;
          this.DATA.links.push({
            source: ingress[i][0],
            target: total,
            value: targetscal,
          });
        }
      }

      this.resetLink();

      setTimeout(() => {
        this.renderChart();
      }, 100);
    },
  },
};
</script>

<style lang="less" scoped>
  .sankey {
    width: 100%;
    padding-bottom: 30px;
  }
  .sankey .indicators {
    font-family: PingFangSC-Regular;
    display: flex;
  }
  .sankey .indicators .indicator {
    padding: 16px;
  }
  .sankey .indicators .indicator .title {
    font-size: 12px;
    color: #000000;
    opacity: 0.65;
  }
  .sankey .indicators .indicator .measure {
    margin-top: 4px;
    display: flex;
    align-items: baseline;
  }
  .sankey .indicators .indicator .measure .value {
    margin-right: 12px;
    opacity: 0.85;
    font-family: Helvetica;
    font-size: 24px;
    color: #000000;
  }
  .indicators .indicator .measure .unit {
    font-size: 12px;
    color: #333;
    opacity: 0.65;
  }
  .sankey .indicators .indicator .compare {
    display: flex;
    align-items: baseline;
  }
  .sankey .indicators .indicator .compare .name {
    color: #666;
    margin-right: 4px;
  }
  .sankey .indicators .indicator .compare .icon {
    width: 0;
    height: 0;
    border-left: 3.5px solid transparent;
    border-right: 3.5px solid transparent;
    border-bottom: 9px solid #000;
    margin-right: 4px;
  }
  .sankey .indicators .indicator .compare .icon.up {
    transform: rotate(0deg);
    color: #f5684a;
    border-bottom-color: #f5684a;
  }
  .sankey .indicators .indicator .compare .icon.down {
    transform: rotate(180deg);
    color: #28a995;
    border-bottom-color: #28a995;
  }
  .sankey .indicators .indicator .compare .value.up {
    color: #f5684a;
  }
  .sankey .indicators .indicator .compare .value.down {
    color: #28a995;
  }
</style>
