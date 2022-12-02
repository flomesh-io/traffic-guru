<template>
  <div :title="$t('Latency')">
    <div
      ref="delayChart"
      class="full height-240"
    />
  </div>
</template>

<script>
import { getServiceWhere } from "@/services/clickhouse";
export default {
  name: "DelayChart",
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
  },

  i18n: require("@/i18n"),
	
  data() {
    return {
      name: "",
      type: "",
      latency: [],
      maxCnt: 0,
      delayData: {
        data: [],
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
      let dom = this.$refs.delayChart;
      this.$echarts.dispose(dom);
      let myChart = this.$echarts.init(dom);

      let option = {
        title: {},
        xAxis: {
          data: this.delayData.xaxis,
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

        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },

        grid: {
          top: "0px",
          right: "10px",
          left: "30px",
          bottom: "0px",
        },

        yAxis: {
          splitLine: {
            show: false,
          },

          axisTick: {
            show: false,
          },

          axisLine: {
            show: false,
          },

          axisLabel: {
            showMinLabel: false,
            showMaxLabel: false,
            inside: true,
            margin: -30,
            backgroundColor: "rgba(240,240,240,0.7)",
            padding: [2, 3, 2, 3],
            textStyle: {
              color: "#6a7985",
            },

            formatter: "{value} "+(this.maxCnt>1000?'k':''),
          },

          z: 10,
        },

        dataZoom: [
          {
            type: "inside",
          },
        ],

        series: [
          {
            type: "bar",
            showBackground: true,
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#73bdef" },
                { offset: 0.5, color: "#73bdef" },
                { offset: 1, color: "#73bdef" },
              ]),
            },

            emphasis: {
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#73bdef" },
                  { offset: 0.7, color: "#73bdef" },
                  { offset: 1, color: "#73bdef" },
                ]),
              },
            },

            data: this.delayData.data,
          },
        ],
      };

      // Enable data zoom when user click bar.
      let zoomSize = 6;
      myChart.on("click", function (params) {
        myChart.dispatchAction({
          type: "dataZoom",
          startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue:
            dataAxis[
              Math.min(params.dataIndex + zoomSize / 2, data.length - 1)
            ],
        });
      });

      myChart.setOption(option, {
        lazyUpdate: true,
      });
      myChart.hideLoading();
    },

    loadData() {
      let dom = this.$refs.delayChart;
      let myChart = this.$echarts.init(dom);
      myChart.showLoading();
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
      let SQL = `select (ceil((resTime - reqTime)/10)) as latency ,count() as count from log where resTime > 0 and (resTime - reqTime) > 0 AND bondType != 'outbound' ${this.where} ${pidFilter} group by latency order by latency;`;
      this.categories = [];
      this.maxCnt = 0;
      this.links = [];
      this.$request(this.$REST.CLICKHOUSE.QUERY(SQL), this.$METHOD.GET)
        .then((res) => {
          this.delayData = {
            data: [],
            xaxis: [],
          };
          let nodes = res.data.split("\n");
          nodes.map((nodeStr) => {
            let node = nodeStr.split("\t");
            if (node[1]) {
              this.maxCnt = node[1]*1 > this.maxCnt ? node[1]*1 : this.maxCnt;
              this.delayData.data.push(node[1]*1);
              this.delayData.xaxis.push(node[0] * 10 + "ms");
            }
            return nodeStr;
          });
          if (this.delayData.data.length == 0) {
            this.delayData.data.push(0);
          } else {
            if(this.maxCnt>1000){
              this.delayData.data.forEach((item,index)=>{
                this.delayData.data[index] = item/1000;
              })
            }
          }
          if (this.delayData.xaxis.length == 0) {
            this.delayData.xaxis.push("0ms");
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
