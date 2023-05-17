<template>
  <div>
    <div
      ref="streamChart"
      class="full height-240"
    />
  </div>
</template>

<script>
import { getSteamTimeline, getTimeLabel } from "@/utils/timeline";
import { getServiceWhere } from "@/services/clickhouse";
export default {
  name: "QoSSummaryChart",
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
      streamData: {
        day: "",
        error: [],
        success: [],
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
      let dom = this.$refs.streamChart;
      this.$echarts.dispose(dom);
      let myChart = this.$echarts.init(dom);

      let option = {
        title: {},
        color: ["#fb9690", "#8bd4a1"],
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
            if (value.color) {
              return (
                `<span style="background:${value.color};width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:10px"></span>` +
                getTimeLabel(value.data[0], this.date) +
                " / " +
                Math.ceil(value.data[1]) +
                "ms"
              );
            } else {
              return `${value.name}: ${Math.ceil(value.value)}ms`;
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
              showMinLabel: false,
              showMaxLabel: false,
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
              show: false,
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
            min: 0,
            z: 10,
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

              formatter: "{value} ms",
            },

            splitLine: {
              show: false,
            },

            axisTick: {
              show: false,
            },

            axisLine: {
              show: false,
            },
          },
        ],

        series: [
          {
            name: "Failed",
            type: "scatter",
            emphasis: {
              focus: "series",
            },

            data: this.streamData.error,
            markArea: {
              silent: true,
              itemStyle: {
                color: "transparent",
                borderWidth: 1,
                borderType: "dashed",
              },

              data: [
                [
                  {
                    xAxis: "min",
                    yAxis: "min",
                  },
                  {
                    xAxis: "max",
                    yAxis: "max",
                  },
                ],
              ],
            },

            markLine: {
              lineStyle: {
                type: "solid",
              },

              data: [{ type: "average", name: "Average" }],
            },
          },
          {
            name: "Success",
            type: "scatter",
            emphasis: {
              focus: "series",
            },

            data: this.streamData.success,
            markArea: {
              silent: true,
              itemStyle: {
                color: "transparent",
                borderWidth: 1,
                borderType: "dashed",
              },

              data: [
                [
                  {
                    xAxis: "min",
                    yAxis: "min",
                  },
                  {
                    xAxis: "max",
                    yAxis: "max",
                  },
                ],
              ],
            },

            markLine: {
              lineStyle: {
                type: "solid",
              },

              data: [{ type: "average", name: "Average" }],
            },
          },
        ],
      };
      myChart.setOption(option, {
        lazyUpdate: true,
      });
      myChart.hideLoading();
    },

    loadData() {
      let dom = this.$refs.streamChart;
      let myChart = this.$echarts.init(dom);
      myChart.showLoading();
      let interval = getSteamTimeline(this.date);
      let pidFilter = "";
      console.log(this.pid);
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
      } else {
        pidFilter += ` AND timestamp > subtractWeeks(now(),1)`;
      }
      let SQL = `select ${interval} as x,avg(resTime - reqTime) as latency,res.status as status from log where resTime > 0 AND bondType != 'outbound' ${this.where} ${pidFilter} group by x,status order by x;`;
      this.categories = [];

      this.links = [];
      this.$request(this.$REST.CLICKHOUSE.QUERY(SQL), this.$METHOD.GET)
        .then((res) => {
          this.streamData = {
            day: "",
            error: [],
            success: [],
          };
          let nodes = res.data.split("\n");
          let index = 0;
          nodes.map((nodeStr) => {
            let node = nodeStr.split("\t");
            index++;
            if (node[2]) {
              let dateAry = new Date(node[0]);
              let _ts = dateAry.getTime();
              if (node[2] < 400) {
                this.streamData.success.push([_ts, node[1] * 1]);
              } else if (node[2] >= 400) {
                this.streamData.error.push([_ts, node[1] * 1]);
              }
              if (index == 1) {
                this.streamData.day = getTimeLabel(_ts, this.date);
              } else if (
                index + 1 == nodes.length &&
                this.streamData.day != getTimeLabel(_ts, this.date)
              ) {
                this.streamData.day += " ~ " + getTimeLabel(_ts, this.date);
              }
            }
            return nodeStr;
          });

          if (this.streamData.success.length == 0) {
            this.streamData.success.push([new Date().getTime(), 0]);
          }
          if (this.streamData.error.length == 0) {
            this.streamData.error.push([new Date().getTime(), 0]);
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
