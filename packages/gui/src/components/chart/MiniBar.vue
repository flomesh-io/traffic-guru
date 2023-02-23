<template>
  <div class="mini-chart">
    <a-empty
      v-if="!dv || dv.length == 0"
      :image="simpleImage"
      description=""
    />
    <div
      :ref="id"
      class="chart-content full"
      :id="id + id2"
      :style="{ height: height ? '' + height + 'px' : '100px' }"
    />
  </div>
</template>

<script>
import { Empty } from "ant-design-vue";
import { mapState } from "vuex";
export default {
  name: "MiniBar",
  props: [
    "dv",
    "id",
    "axis",
    "height",
    "colors",
    "stack",
    "ver",
    "unit",
  ],

  data() {
    return {
      id2: Math.ceil(Math.random() * 1000),
      isMounted: false,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },

  computed: {
    ...mapState("setting", ["lang"]),
  },

  watch: {
    lang(newVal) {
      this.$i18n.locale = newVal;
    },

    dv() {
      if (this.isMounted) {
        setTimeout(() => {
          this.renderChart();
        }, 100);
      }
    },

    ver() {
      if (this.isMounted) {
        setTimeout(() => {
          this.renderChart();
        }, 100);
      }
    },
  },

  mounted() {
    this.isMounted = true;
    this.$i18n.locale = this.lang;
    this.renderChart();
  },

  methods: {
    getLegend() {
      let legendMap = {};
      this.dv.forEach((n) => {
        legendMap[n.type] = n.type;
      });
      return Object.keys(legendMap);
    },

    getXAxis() {
      let XAxisMap = {};
      this.dv.forEach((n) => {
        XAxisMap[n.date] = n.date;
      });
      return Object.keys(XAxisMap).sort();
    },

    getSeriesValue() {
      let _data = {};
      this.dv.forEach((n) => {
        if (!_data[n.date]) {
          _data[n.date] = {};
        }
        if (n.itemStyle) {
          _data[n.date][n.type] = {
            value: n.value,
            itemStyle: n.itemStyle,
          };
        } else {
          _data[n.date][n.type] = n.value;
        }
      });
      return _data;
    },

    getSeries(legend, xAxis) {
      let _data = this.getSeriesValue();
      let series = [];
      legend.forEach((n) => {
        let seriesData = [];
        xAxis.forEach((j) => {
          seriesData.push(_data[j][n] || 0);
        });
        let _serie = {
          name: n,
          type: "bar",
          smooth: true,
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: seriesData,
        };
        if (this.stack) {
          _serie.stack = this.stack;
        }
        series.push(_serie);
      });
      return series;
    },

    renderChart() {
      let legend = this.getLegend();
      let xAxis = this.getXAxis();
      let series = this.getSeries(legend, xAxis);
      let chartDom = document.getElementById(this.id + this.id2);
      if (chartDom) {
        this.$echarts.dispose(chartDom);
      }
      let myChart = this.$echarts.init(chartDom);
      myChart.showLoading();
      let option = {
        color: this.colors
          ? this.colors
          : [
            "rgba(0, 137, 237,0.7)",
            "rgba(255, 157, 77,0.7)",
            "rgba(90, 216, 166,0.7)",
            "rgba(227, 137, 163,0.7)",
            "rgba(146, 112, 202,0.7)",
          ],

        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },

        legend: {
          data: legend,
          show: false,
        },

        toolbox: {},
        grid: {
          top: "0px",
          right: "10px",
          left: "30px",
          bottom: "0px",
        },

        xAxis: [
          {
            axisLabel: {
              backgroundColor: "rgba(240,240,240,0.7)",
              padding: [2, 3, 2, 3],
              textStyle: {
                color: "#6a7985",
              },

              inside: true,
              borderRadius: 2,
              minInterval: 20,
            },

            data: xAxis,
            axisTick: {
              show: false,
            },

            axisLine: {
              show: false,
            },

            z: 10,
          },
        ],

        yAxis: [
          {
            show: this.axis ? true : false,
            type: "value",
            axisLabel: this.axis
              ? {
                formatter: (value) => {
                  return "" + value + (this.unit ? this.unit : "");
                },
              }
              : {
                showMinLabel: false,
                showMaxLabel: false,
                inside: true,
                margin: -30,
                backgroundColor: "rgba(240,240,240,0.7)",
                padding: [2, 3, 2, 3],
                textStyle: {
                  color: "#6a7985",
                },

                formatter: (value) => {
                  return "" + value + (this.unit ? this.unit : "");
                },
              },
          },
        ],

        series: series,
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
    position: relative;
    top: 0px;
    right: 10px;
    width: 100%;
  }
</style>
