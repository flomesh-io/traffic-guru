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
import { getTimeLabel } from "@/utils/util";
export default {
  name: "Scatter",
  props: [
    "dv",
    "noEmpty",
    "id",
    "unit",
    "height",
    "colors",
    "min",
    "hideY",
    "formatter",
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
          seriesData.push([new Date(j).getTime(),_data[j][n] || 0,n]);
        });
        series.push({
          name: n,
          type: "effectScatter",
          stack: "Total",
          smooth: true,
          lineStyle: {
            width: 0,
          },
          label:{
            show:true,
            formatter:'{@[2]}',
          },
          showSymbol: true,
          symbolSize: 20,
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
      let myChart = this.$echarts.init(chartDom);
      let _unit = this.$t && this.$t(this.unit||"") || "";
      let option = {
        title: {},
        color: this.colors
          ? this.colors
          : [
            "rgba(0, 137, 237,0.7)",
            "rgba(255, 157, 77,0.7)",
            "rgba(90, 216, 166,0.7)",
            "rgba(227, 137, 163,0.7)",
            "rgba(146, 112, 202,0.7)",
          ],

        grid: {
          left: "0px",
          right: "0px",
          top: "45px",
          bottom: "0px",
        },

        tooltip: {
          // trigger: 'axis',
          showDelay: 0,
          formatter: (value) => {
            if(this.formatter) {
              return this.formatter(value)
            }else if (value.color) {
              return (
                `<span style="background:${value.color};width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:10px"></span>` +
                Math.ceil(value.data[1]) +
                _unit
              );
            } else {
              return `${value.name}: ${Math.ceil(value.value)}${_unit}`;
            }
          },

          axisPointer: {
            show: true,
            type: "cross",
            lineStyle: {
              type: "dashed",
              width: 1,
            },
          },
        },

        toolbox: {
          feature: {
            dataZoom: {},
            brush: {
              type: ["rect", "polygon", "clear"],
            },
          },
        },

        brush: {},
        xAxis: [
          {
            type: "category",
            scale: true,
            nameGap: 30,
            axisPointer: {
              label: {
                formatter: (value) => {
                  return getTimeLabel(value.value, this.date);
                },
              },
            },

            axisLabel: {
              showMinLabel: true,
              showMaxLabel: true,
              borderRadius: 2,
              margin: 0,
              minInterval: 20,
              inside: true,
              backgroundColor: "rgba(240,240,240,0.7)",
              padding: [2, 3, 2, 3],
              textStyle: {
                color: "#6a7985",
              },

              hideOverlap: true,
              interval: "auto",
              borderRadius: 2,
              inside: true,
              formatter: (value) => {
                return getTimeLabel(value, this.date);
              },
            },

            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
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
            scale: true,
            min: this.min?this.min:0,
            z: 10,
            show:this.hideY?false:true,
            axisLabel: {
              showMinLabel: false,
              showMaxLabel: false,
              inside: true,
              margin: 0,
              backgroundColor: "rgba(240,240,240,0.7)",
              padding: [2, 3, 2, 3],
              textStyle: {
                color: "#6a7985",
              },

              formatter: ("{value} "+ _unit),
            },

            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },

            axisTick: {
              show: false,
            },

            axisLine: {
              show: false,
            },
          },
        ],

        series: series.concat([
          {
            name: 'line',
            type: 'line',
            datasetIndex: 1,
            symbolSize: 0.1,
            symbol: 'circle',
            label: { show: true, fontSize: 16 },
            labelLayout: { dx: -20 },
            encode: { label: 2, tooltip: 1 }
          }
        ]),
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
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
  }
  a {
    color: #42b983;
  }
</style>
