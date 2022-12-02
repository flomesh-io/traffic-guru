<template>
  <div>
    <div
      ref="statusChart"
      class="full height-240"
    />
  </div>
</template>

<script>
import { getServiceWhere } from "@/services/clickhouse";
export default {
  name: "StatusChart",
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
      maxCnt: 0,
      statusData: {
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
      let dom = this.$refs.statusChart;
      this.$echarts.dispose(dom);
      let myChart = this.$echarts.init(dom);

      let option = {
        title: {},
        xAxis: {
          data: this.statusData.xaxis,
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
          bottom: "0px",
          right: "10px",
          top: "0px",
          left: "40px",
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
            margin: -40,
            backgroundColor: "rgba(240,240,240,0.7)",
            padding: [2, 3, 2, 3],
            textStyle: {
              color: "#6a7985",
            },

            formatter: "{value} "+(this.maxCnt>1000?'k':''),
          },
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
            data: this.statusData.data,
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
      let dom = this.$refs.statusChart;
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
      let SQL = `select count() as count,res.status from log where res.status>'0' AND bondType != 'outbound' ${this.where} ${pidFilter} group by res.status order by res.status`;
      this.categories = [];
      this.maxCnt = 0;
      this.links = [];
      this.$request(this.$REST.CLICKHOUSE.QUERY(SQL), this.$METHOD.GET)
        .then((res) => {
          this.statusData = {
            data: [],
            xaxis: [],
          };
          let nodes = res.data.split("\n");
          nodes.map((nodeStr) => {
            let node = nodeStr.split("\t");
            if (node[1]) {
              let _color = "";
              if (node[1] < 300) {
                _color = "#8bd4a1";
              } else if (node[1] < 400) {
                _color = "#fac858";
              } else {
                _color = "#fb9690";
              }
              this.maxCnt = node[0]*1 > this.maxCnt ? node[0]*1 : this.maxCnt;
              this.statusData.data.push({
                value: node[0]*1,
                itemStyle: {
                  color: _color,
                },
              });
              this.statusData.xaxis.push(node[1]);
            }
            return nodeStr;
          });
          if (this.statusData.data.length == 0) {
            this.statusData.data.push({ value: 0 });
          } else {
            if(this.maxCnt>1000){
              this.statusData.data.forEach((item)=>{
                item.value = item.value/1000;
              })
            }
          }
          if (this.statusData.xaxis.length == 0) {
            this.statusData.xaxis.push("-");
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
