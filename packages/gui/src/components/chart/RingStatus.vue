<template>
  <div class="mini-chart">
    <div
      v-show="vals && vals.length > 0"
      :ref="id"
      class="chart-content"
      :id="id + id2"
      :style="{
        height: height ? '' + height + 'px' : '240px',
        width: '100%',
      }"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "RingStatus",
  props: ["vals", "id", "height", "unit", "ver", "total", "colors", "labels"],
  data() {
    return {
      id2: Math.ceil(Math.random() * 1000),
      isMounted: false,
    };
  },

  computed: {
    ...mapState("setting", ["lang"]),
  },

  watch: {
    lang(newVal) {
      this.$i18n.locale = newVal;
    },

    ver() {
      if (this.isMounted) {
        setTimeout(() => {
          this.renderChart();
        }, 100);
      }
    },

    vals: {
      handler: function () {
        if (this.isMounted) {
          setTimeout(() => {
            this.renderChart();
          }, 100);
        }
      },

      deep: true,
    },
  },

  created() {},
  mounted() {
    this.isMounted = true;
    this.$i18n.locale = this.lang;
    this.renderChart();
  },

  methods: {
    renderChart() {
      let chartDom = document.getElementById(this.id + this.id2);
      if (chartDom) {
        this.$echarts.dispose(chartDom);
      }
      if (!chartDom) {
        return;
      }
      let myChart = this.$echarts.init(chartDom);
      myChart.showLoading();

      const option = {
        series: [
          {
            type: "gauge",
            startAngle: 90,
            color: this.colors
              ? this.colors
              : ["#8bd4a1", "#fb9690", "#00adef"],

            endAngle: -270,
            pointer: {
              show: false,
            },

            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 0,
              },
            },

            axisLine: {
              lineStyle: {
                width: 20,
              },
            },

            splitLine: {
              show: false,
              distance: 0,
              length: 10,
            },

            axisTick: {
              show: false,
            },

            axisLabel: {
              show: false,
              distance: 50,
            },

            data: [
              {
                value: this.vals
                  ? (100 * this.vals[0]) / (this.total ? this.total : 1)
                  : 0,

                name: this.labels ? this.labels[0] : " healthy",
                title: {
                  offsetCenter: ["0%", "-40%"],
                },

                detail: {
                  offsetCenter: ["0%", "-20%"],
                },
              },
              {
                value: this.vals
                  ? (100 * this.vals[1]) / (this.total ? this.total : 1)
                  : 0,

                name: this.labels ? this.labels[1] : " unhealthy",
                title: {
                  offsetCenter: ["0%", "20%"],
                },

                detail: {
                  offsetCenter: ["0%", "40%"],
                },
              },
            ],

            title: {
              fontSize: 14,
            },

            detail: {
              width: 30,
              height: 8,
              fontSize: 10,
              color: "#fff",
              backgroundColor: "auto",
              borderColor: "auto",
              borderRadius: 20,
              borderWidth: 1,
              formatter: (item) => {
                return (item * this.total) / 100 + this.unit;
              },
            },
          },
        ],
      };

      option.series[0].pointer.show = false;

      myChart.setOption(option, {
        lazyUpdate: true,
      });
      myChart.hideLoading();
    },
  },
};
</script>

<style lang="less" scoped>
  .mini-chart {
    position: relative;
    width: 100%;
  }
  .mini-chart .chart-content {
    width: 100%;
  }
</style>
