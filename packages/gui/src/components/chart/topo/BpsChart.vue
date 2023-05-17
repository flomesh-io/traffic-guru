<template>
  <div>
    <div
      ref="bpsChart"
      class="full height-240"
    />
  </div>
</template>

<script>
import { getTimeline, getTimeLabel } from "@/utils/timeline";
import { getServiceWhere } from "@/services/clickhouse";
export default {
  name: "BpsChart",
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
      maxCnt: 0,
      unit: "B",
      bpsData: {
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
      let dom = this.$refs.bpsChart;
      this.$echarts.dispose(dom);
      let myChart = this.$echarts.init(dom);

      let option = {
        title: {},
        tooltip: {
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },

        color: ["#8bd4a1"],
        legend: {
          data: ["Success"],
          bottom: 0,
        },

        grid: {
          top: "0px",
          left: "0px",
          right: "0px",
          bottom: "0px",
          containLabel: true,
        },

        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            // data: this.bpsData.xaxis,
            nameGap: 30,
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

            formatter: "{value} " + this.unit,
          },
        },

        series: [
          {
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },

            lineStyle: {
              width: 0,
            },

            data: this.bpsData.success,
          },
        ],
      };
      myChart.setOption(option, {
        lazyUpdate: true,
      });
      myChart.hideLoading();
    },

    loadData() {
      let dom = this.$refs.bpsChart;
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
      } else {
        pidFilter += ` AND timestamp > subtractWeeks(now(),1)`;
      }
      let SQL = `select sum(reqSize+resSize) as bps,${interval} as time from log where 1=1 AND bondType != 'outbound' ${this.where} ${pidFilter} group by time order by time;`;
      this.categories = [];
      this.links = [];
      this.maxCnt = 0;
      this.$request(this.$REST.CLICKHOUSE.QUERY(SQL), this.$METHOD.GET)
        .then((res) => {
          this.bpsData = {
            day: "",
            success: [],
            xaxis: [],
          };
          let nodes = res.data.split("\n");
          let index = 0;
          nodes.map((nodeStr) => {
            let node = nodeStr.split("\t");
            index++;
            if (node[1]) {
              let dateAry = new Date(node[1]);
              let _ts = dateAry.getTime();
              this.maxCnt = node[0]*1 > this.maxCnt ? node[0]*1 : this.maxCnt;
              let xaxiVal = getTimeLabel(_ts, this.date);
              this.bpsData.success.push([xaxiVal,node[0]*1]);
              this.bpsData.xaxis.push(xaxiVal);
              if (index == 1) {
                this.bpsData.day = xaxiVal;
              } else if (
                index + 1 == nodes.length &&
                this.bpsData.day != xaxiVal
              ) {
                this.bpsData.day += " ~ " + xaxiVal;
              }
            }
            return nodeStr;
          });
          if (this.bpsData.success.length == 0) {
            this.bpsData.success.push(0);
          } else {
            if(this.maxCnt>(1024 * 1024 * 1024)){
              this.bpsData.success.forEach((item,index)=>{
                this.bpsData.success[index] = item/(1024 * 1024 * 1024);
              })
              this.unit = "GB";
            } else if(this.maxCnt>(1024 * 1024)){
              this.bpsData.success.forEach((item,index)=>{
                this.bpsData.success[index] = item/(1024 * 1024);
              })
              this.unit = "MB";
            } else if(this.maxCnt>1024){
              this.bpsData.success.forEach((item,index)=>{
                this.bpsData.success[index] = item/1024;
              })
              this.unit = "KB";
            } else {
              this.unit = "B";
            }
          }
          if (this.bpsData.xaxis.length == 0) {
            this.bpsData.xaxis.push(
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
