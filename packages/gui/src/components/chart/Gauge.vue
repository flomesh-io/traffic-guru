<template>
  <div class="mini-chart">
    <div
      v-show="vals && vals.length == 3"
      :ref="id"
      class="chart-content full"
      :id="id + id2"
      :style="{ height: height ? '' + height + 'px' : '240px' }"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "Gauge",
  props: ["vals", "id", "height", "format", "ver", "offset"],
  i18n: require("@/i18n"),
  data() {
    return {
      id2: Math.ceil(Math.random() * 1000),
      isMounted: false,
    };
  },

  computed: {
    ...mapGetters("setting", ["themeColors"]),
    ...mapState("setting", ["lang"]),
  },

  watch: {
    themeColors() {
      setTimeout(() => {
        this.renderChart();
      }, 500);
    },

    lang(newVal) {
      this.$i18n.locale = newVal;
    },

    ver() {
      if (this.isMounted) {
        setTimeout(() => {
          this.renderChart();
        }, 500);
      }
    },

    vals: {
      handler: function () {
        if (this.isMounted) {
          setTimeout(() => {
            this.renderChart();
          }, 500);
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
    getPercentage(current, per) {
      return per == 0 ? 0 : Math.round((current * 100) / per);
    },

    renderChart() {
      let chartDom = document.getElementById(this.id + this.id2);
      if (chartDom) {
        // this.$echarts.dispose(chartDom);
      }
      let myChart = this.$echarts.init(chartDom);
      myChart.showLoading();
      let offsetCenter = this.offset
        ? this.offset
        : [
          {
            title: ["-60%", "90%"],
            detail: ["-60%", "110%"],
          },
          {
            title: ["0%", "90%"],
            detail: ["0%", "110%"],
          },
          {
            title: ["60%", "90%"],
            detail: ["60%", "110%"],
          },
        ];
      let _data = [];
      let total = 0;
      this.vals.forEach((_val) => {
        total += _val.value;
      });
      this.vals.forEach((_val, index) => {
        _data.push({
          value: _val.value,
          count: _val.value,
          name: _val.title ? this.$t(_val.title) : index,
          itemStyle: { color: _val.color },
          title: {
            offsetCenter: offsetCenter[index].title,
            color:this.themeColors.text[0]
          },
          detail: {
            offsetCenter: offsetCenter[index].detail,
          },
        });
      });
      let option = {
        series: [
          {
            type: "gauge",
            itemStyle: {
              shadowColor: "rgba(0,0,0,0.2)",
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },

            anchor: {
              show: true,
              showAbove: true,
              size: 18,
              itemStyle: {
                color: "#FAC858",
              },
            },

            pointer: {
              width: 10,
              length: "80%",
              offsetCenter: [0, "8%"],
            },

            axisLabel: {
              distance: 20,
              color: this.themeColors.text[0],
              fontSize: 10,
            },

            min: 0,
            max: total > 0 ? total : 1,
            splitNumber: 2,
            splitLine: {
              length: 8,
              lineStyle: {
                width: 3,
                color: this.themeColors.text[0],
              },
            },

            progress: {
              width: 16,
              show: true,
              overlap: true,
              roundCap: true,
            },

            axisLine: {
              lineStyle: {
                width: 16,
              },

              roundCap: true,
            },

            data: _data,
            title: {
              fontSize: 10,
            },

            detail: {
              width: 16,
              height: 10,
              fontSize: 10,
              color: "#fff",
              backgroundColor: "auto",
              borderRadius: 10,
              formatter: this.format ? this.format : "{value}%",
            },
          },
        ],
      };
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
    position: relative;
    top: -10px;
  }
</style>
