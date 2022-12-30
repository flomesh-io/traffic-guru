<template>
  <div class="mini-chart">
    <div
      class="absolute full mt-10"
      style="top: 20%"
    >
      <a-empty
        v-if="(!dv || dv.length == 0) && !noEmpty"
        :image="simpleImage"
        description=""
      />
    </div>
    <div
      :ref="id"
      class="chart-content full"
      :id="id + id2"
      :style="{ height: height ? '' + height + 'px' : '160px' }"
    />
  </div>
</template>

<script>
import { Empty } from "ant-design-vue";
import { mapState } from "vuex";
export default {
  name: "MiniArea",
  props: [
    "dv",
    "noEmpty",
    "id",
    "axis",
    "unit",
    "height",
    "padding",
    "colors",
    "hideLegend",
    "ver",
    "isGradient",
  ],

  i18n: require("@/i18n"),
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
    setTimeout(() => {
      this.renderChart();
    }, 100);
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
        _data[n.date][n.type] = n.value;
      });
      return _data;
    },

    getSeries(legend, xAxis) {
      let _data = this.getSeriesValue();
      let gradient = {
        opacity: 0.8,
        color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(128, 255, 165)",
          },
          {
            offset: 1,
            color: "rgba(1, 191, 236)",
          },
        ]),
      };
      if (this.colors && this.colors.length > 0) {
        gradient = {
          opacity: 1,
          color: this.isGradient
            ? this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: this.colors[0],
              },
              {
                offset: 1,
                color: this.colors[1],
              },
            ])
            : this.colors,
        };
      }
      let series = [];
      legend.forEach((n) => {
        let seriesData = [];
        xAxis.forEach((j) => {
          seriesData.push([j,_data[j][n] || 0]);
        });
        series.push({
          name: n,
          type: "line",
          stack: "Total",
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: this.isGradient ? gradient : {},
          emphasis: {
            focus: "series",
          },
          data: seriesData,
        });
      });
      return series;
    },

    renderChart() {
      let legend = this.getLegend();
      let xAxis = this.getXAxis();
      let series = this.getSeries(legend, xAxis);
      let chartDom = document.getElementById(this.id + this.id2);
      if (chartDom) {
        // this.$echarts.dispose(chartDom);
      }
      let _unit = this.$t && this.$t(this.unit||"") || "";
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
          show: !this.hideLegend,
          orient: "vertical",
          right: "right",
          formatter: function (name) {
            return name.length > 18 ? name.substr(0, 18) + "..." : name;
          },
        },

        toolbox: {},
        grid: {
          left: this.padding ? this.padding[3] : "0%",
          right: this.padding ? this.padding[1] : "0%",
          bottom: this.padding ? this.padding[2] : "0",
          top: this.padding ? this.padding[0] : "",
          containLabel: true,
        },

        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            minorSplitLine: {
              show: true,
            },

            // data: xAxis,
            axisLabel: this.axis
              ? {
                minInterval: 20,
              }
              : {
                showMinLabel: false,
                showMaxLabel: false,
                borderRadius: [3,3,0,0],
                margin: 0,
                minInterval: 20,
                inside: true,
                formatter: (value) => {
                  let _temp = value.split(" ");
                  if (_temp.length == 2) {
                    return _temp[1];
                  } else {
                    return value;
                  }
                },

                backgroundColor: "rgba(240,240,240,0.7)",
                padding: [2, 3, 2, 3],
                textStyle: {
                  color: "#6a7985",
                },
              },

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
            type: "value",
            axisLine: {
              show: false,
            },

            axisTick: {
              show: false,
            },

            z: 10,
            splitLine: {
              show: false,
              lineStyle: { type: "dashed", opacity: 0.4 },
            },

            minInterval: 0.1,
            axisLabel: this.axis
              ? {
                formatter: (value) => {
                  return "" + value + _unit;
                },
              }
              : {
                showMinLabel: false,
                showMaxLabel: false,
                formatter: (value) => {
                  return "" + value + _unit;
                },

                inside: true,
                borderRadius: [0,3,3,0],
                margin: 0,
                backgroundColor: "rgba(240,240,240,0.7)",
                padding: [2, 3, 2, 3],
                textStyle: {
                  color: "#6a7985",
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
    margin-left: 0px;
    width: auto;
  }
  .mini-chart .chart-content {
    position: relative;
    top: 0px;
    right: 0px;
    width: 100%;
  }
</style>
