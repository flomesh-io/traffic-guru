<template>
  <div>
    <div
      ref="areaChart"
      class="full height-240"
    />
  </div>
</template>

<script>
import { getTimeline, getTimeLabel, getTimeUnit } from "@/utils/util";
import { getServiceWhere } from "@/services/clickhouse";
export default {
  name: "AreaChart",
  props: {
    pid: {
      type: String,
      default: ""
    },

    apply: {
      type: String,
      default: ""
    },

    params: {
      type: Object,
      default() {
        return {}
      }
    },

    where: {
      type: String,
      default: ""
    },

    date: {
      type: String,
      default: ""
    },
  },

  i18n: require("@/i18n"),
  data() {
    return {
      name: "",
      type: "",
      areaData: {
        day: "",
        success: [],
        failed: [],
        xaxis: [],
      },
    };
  },

  watch: {
    where: {
      handler() {
        this.loadData();
      },

      deep: true,
    },
  },

  mounted() {
    this.loadData();
  },

  methods: {
    renderChart() {
      let interval = getTimeUnit(this.date);
      let dom = this.$refs.areaChart;
      this.$echarts.dispose(dom);
      let myChart = this.$echarts.init(dom);
      let option = {
        title: {},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },

        color: ["#8bd4a1", "#fb9690"],
        grid: {
          top: "0",
          left: "0px",
          right: "0px",
          bottom: "0px",
          containLabel: true,
        },

        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.areaData.xaxis,
            nameGap: 30,
            minorSplitLine: {
              show: true,
            },

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

            axisTick: {
              show: false,
            },

            axisLine: {
              show: false,
            },

            z: 10,
          },
        ],

        yAxis: {
          axisLine: {
            show: false,
          },

          axisTick: {
            show: false,
          },

          z: 10,
          splitLine: {
            show: false,
          },

          minInterval: 1,
          axisLabel: {
            margin: 0,
            formatter: "{value} Req/"+interval,
            showMinLabel: false,
            showMaxLabel: false,
            inside: true,
            backgroundColor: "rgba(240,240,240,0.7)",
            padding: [2, 3, 2, 3],
            textStyle: {
              color: "#6a7985",
            },

            textStyle: {
              color: "#999",
            },
          },
        },

        series: [
          {
            name: "Success",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },

            lineStyle: {
              width: 0,
            },

            showSymbol: false,
            data: this.areaData.success,
          },
          {
            name: "Failed",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },

            lineStyle: {
              width: 0,
            },

            showSymbol: false,
            data: this.areaData.failed,
          },
        ],
      };
      myChart.setOption(option, {
        lazyUpdate: true,
      });
      myChart.hideLoading();
    },

    loadData() {
      let dom = this.$refs.areaChart;
      let myChart = this.$echarts.init(dom);
      myChart.showLoading();
      let interval = getTimeline(this.date);
      let pidFilter = "";
      if (this.pid) {
        if (this.apply == "openapi") {
          pidFilter += ` AND x_parameters.aid = '${this.pid}'`;
        } else if (this.apply == "project") {
          pidFilter += ` AND x_parameters.pid = '${this.pid}'`;
        } else if (this.apply == "mesh") {
          pidFilter += ` AND meshName = '${this.params.name}'`;
        } else if (this.apply == "service") {
          pidFilter += getServiceWhere(
            "and",
            this.params.name,
            this.params.namespace,
            this.params.domain,
          );
        }
      }
      let SQL = `select count() as count ,count(CASE WHEN res.status<'400' THEN 1 END) as succss_count ,count(CASE WHEN res.status>='400' THEN 1 END) as error_count ,${interval} as min from log where 1=1 AND bondType != 'outbound' ${this.where} ${pidFilter} group by min order by min;`;
      this.categories = [];
      this.links = [];
      this.$request(this.$REST.CLICKHOUSE.QUERY(SQL), this.$METHOD.GET)
        .then((res) => {
          this.areaData = {
            day: "",
            success: [],
            failed: [],
            xaxis: [],
          };
          let nodes = res.data.split("\n");
          let index = 0;
          nodes.map((nodeStr) => {
            let node = nodeStr.split("\t");
            index++;
            if (node[3]) {
              let dateAry = new Date(node[3]);
              let _ts = dateAry.getTime();
              this.areaData.success.push(node[1]);
              this.areaData.failed.push(node[2]);
              this.areaData.xaxis.push(getTimeLabel(_ts, this.date));
              if (index == 1) {
                this.areaData.day = getTimeLabel(_ts, this.date);
              } else if (
                index + 1 == nodes.length &&
                this.areaData.day != getTimeLabel(_ts, this.date)
              ) {
                this.areaData.day += " ~ " + getTimeLabel(_ts, this.date);
              }
            }
            return nodeStr;
          });
          if (this.areaData.success.length == 0) {
            this.areaData.success.push(0);
          }
          if (this.areaData.failed.length == 0) {
            this.areaData.failed.push(0);
          }
          if (this.areaData.xaxis.length == 0) {
            this.areaData.xaxis.push(
              getTimeLabel(new Date().getTime(), this.date),
            );
          }
          this.renderChart();
        })
        .catch((err) => {
          console.log(err);
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
  }
  a {
    color: #42b983;
  }
</style>
