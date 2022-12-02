<template>
  <div class="mini-chart">
    <div class="absolute full mt-10">
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
      :style="{ height: height ? '' + height + 'px' : '200px' }"
    />
  </div>
</template>

<script>
import { Empty } from "ant-design-vue";
import { mapState } from "vuex";
export default {
  name: "MiniSector",
  props: [
    "dv",
    "noEmpty",
    "id",
    "height",
    "padding",
    "colors",
    "ver",
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
    setTimeout(() => {
      this.renderChart();
    }, 100);
  },

  methods: {
    getSeries() {
      let series = [];
      series.push({
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "40",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: this.dv,
      });
      return series;
    },

    renderChart() {
      let series = this.getSeries();
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
          trigger: "item",
        },

        legend: {
          show: true,
          orient: "vertical",
          right: "right",
          formatter: function (name) {
            return name.length > 10 ? name.substr(0, 10) + "..." : name;
          },
        },

        toolbox: {},
        grid: {
          left: this.padding ? this.padding[3] : 0,
          right: this.padding ? this.padding[1] : 0,
          bottom: this.padding ? this.padding[2] : 0,
          top: this.padding ? this.padding[0] : 0,
          containLabel: true,
        },

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
    margin-right: -10px;
  }
  .mini-chart .chart-content {
    position: relative;
    top: 0px;
    right: 10px;
    width: 100%;
  }
</style>
