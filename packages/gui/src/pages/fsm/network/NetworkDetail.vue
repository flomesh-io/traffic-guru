<template>
  <a-card
    class="card nopd"
    :title="$t('Waterfall Detail')"
  >
    <div class="network-card-header">
      <h2>Trace ID : {{ traceId }}</h2>
    </div>
    <div class="network-card-body">
      <a-drawer
        v-if="visible"
        :get-container="false"
        :title="$t('log')"
        placement="right"
        width="700"
        :closable="false"
        :visible="visible"
        :wrap-style="{ position: 'absolute' }"
        :after-visible-change="afterVisibleChange"
        @close="onClose"
      >
        <JsonEditor
          :is-readonly="true"
          :value="log"
        />
      </a-drawer>
      <a-table
        :columns="dataColumns"
        :data-source="spans"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'spanId'">
            <div class="inline-block">
              <a
                href="javascript:void(0)"
                @click="showDrawer(record.spanId)"
              >{{
                record.spanId
              }}</a>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'duration'">
            <div>{{ record.duration }} ms</div>
          </template>
          <template v-else-if="column.dataIndex === 'svcName'">
            <a-tag
              :key="tagidx"
              v-for="(tag, tagidx) in record.svcName"
            >
              {{ tag }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'podName'">
            <a-tag
              :key="tagidx"
              v-for="(tag, tagidx) in record.podName"
            >
              {{ tag }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'waterfall'">
            <div class="waterfall-panel">
              <div class="pr-15">
                <a-slider
                  :marks="record.marks"
                  class="waterfall"
                  range
                  :default-value="[record.start, record.end]"
                />
              </div>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import _ from "lodash";
import JsonEditor from "@/components/editor/JsonEditor";
const columns = [
  {
    key: "Span Id",
    dataIndex: "spanId",
    width: 150,
  },
  {
    key: "Service",
    dataIndex: "svcName",
    width: 150,
  },
  {
    key: "Pod",
    dataIndex: "podName",
    width: 150,
  },
  {
    key: "Count",
    dataIndex: "cnt",
    width: 70,
  },
  {
    key: "Duration",
    dataIndex: "duration",
    width: 150,
  },
  {
    key: "Waterfall",
    dataIndex: "waterfall",
  },
];

export default {
  name: "NetworkDetail",
  i18n: require("@/i18n"),
  components: { JsonEditor },
  props: {},
  data() {
    return {
      traceId: "",
      loading: true,
      log: "{}",
      visible: false,
      duration: 0,
      time: "",
      spans: [],
      columns,
    };
  },

  computed: {
    dataColumns() {
      return this.columns.map((column) => {
        column.title = this.$t(column.key);
        return column;
      });
    },
  },

  created() {
    this.traceId = this.$route.params.id || "";
    if (this.traceId) {
      this.loading = true;
      this.getData();
    } else {
      this.loading = false;
    }
  },

  methods: {
    afterVisibleChange(val) {
      console.log("visible", val);
    },

    showDrawer(spanid) {
      this.getLog(spanid);
      this.visible = true;
    },

    onClose() {
      this.visible = false;
    },

    getStep(val) {
      return Math.ceil((val / this.duration) * 100);
    },

    getTime(val) {
      return val + "ms";
    },

    buildSpan(lastduration, node, nodes, ending) {
      let _start = node[6] - this.time;
      let _n = {
        key: node[0],
        spanId: node[0],
        cnt: node[2],
        svcName:
          node[3].indexOf("[") >= 0 ? _.uniq(eval(node[3])) : [node[3]],

        podName:
          node[4].indexOf("[") >= 0 ? _.uniq(eval(node[4])) : [node[4]],

        duration: node[5],
        reqTime: node[6],
        resTime: node[7],
        start: this.getStep(_start),
        end: this.getStep(_start + node[5] * 1),
        startTime: this.getTime(_start),
        endTime: this.getTime(_start + node[5] * 1),
        marks: {},
      };
      _n.marks[this.getStep(_start)] = this.getTime(_start);
      _n.marks[this.getStep(_start * 1 + node[5] * 1)] = this.getTime(
        _start * 1 + node[5] * 1,
      );
      if (!ending) {
        let _child = this.getChild({ start: _start }, node[0], nodes);
        if (_child && _child.length > 0) {
          _n.children = _child;
        } else {
          this.getChildSpan({ start: _start }, _n);
        }
      }
      lastduration.start = node[5];
      return _n;
    },

    getChild(lastduration, parent, nodes) {
      let child = [];
      if (!nodes) {
        return [];
      }
      nodes.forEach((nodeStr) => {
        let node = nodeStr.split("\t");
        if (node[0] && parent != "" && parent == node[1]) {
          child.push(this.buildSpan(lastduration, node));
        }
      });
      return child;
    },

    getEndChild(lastduration, nodes) {
      let child = [];
      nodes.forEach((nodeStr) => {
        let node = nodeStr.split("\t");
        if (node[0]) {
          child.push(this.buildSpan(lastduration, node, null, true));
        }
      });
      return child;
    },

    setSpan(nodes) {
      let lastduration = { start: 0 };
      nodes.forEach((nodeStr) => {
        let node = nodeStr.split("\t");
        if ((node[0] && !node[1]) || node[1] == "") {
          this.spans.push(this.buildSpan(lastduration, node, nodes));
        }
      });
    },

    getLog(spanid) {
      let SQL = `select message from log where trace.span='${spanid}';`;
      this.$request(this.$REST.CLICKHOUSE.QUERY(SQL), this.$METHOD.GET)
        .then((res) => {
          if (typeof res.data == "object") {
            this.log = JSON.stringify(res.data);
          } else {
            let _nodes = [];
            let nodes = res.data.split("\n");
            nodes.map((nodeStr) => {
              if (nodeStr && nodeStr != "") {
                _nodes.push(JSON.parse(nodeStr.replaceAll('\\"', '"')));
              }
              return nodeStr;
            });
            this.log = JSON.stringify(_nodes);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getData() {
      let SQL = `select trace.id,count(),(max(resTime) - min(reqTime)) as duration,min(reqTime) from log where trace.id='${this.traceId}' group by trace.id;`;
      this.$request(this.$REST.CLICKHOUSE.QUERY(SQL), this.$METHOD.GET)
        .then((res) => {
          let nodes = res.data.split("\n");
          nodes.map((nodeStr) => {
            let node = nodeStr.split("\t");
            if (node[0]) {
              this.duration = node[2];
              this.time = node[3];
            }
            return nodeStr;
          });
          this.getSpan();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getSpan() {
      let SQL = `select trace.span,max(trace.parent),count(),groupArray(service.name),groupArray(pod.name),(max(resTime) - min(reqTime)) as duration,min(reqTime) as minreqTime,max(resTime) from log where trace.id='${this.traceId}' group by trace.span  order by minreqTime asc;`;
      this.$request(this.$REST.CLICKHOUSE.QUERY(SQL), this.$METHOD.GET)
        .then((res) => {
          let nodes = res.data.split("\n");
          this.setSpan(nodes);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getChildSpan(lastduration, _n) {
      let SQL = `select trace.span,trace.parent,1,service.name,pod.name,(resTime - reqTime) as duration,reqTime,resTime from log where trace.id='${this.traceId}' and trace.span='${_n.spanId}' order by reqTime asc;`;
      this.$request(this.$REST.CLICKHOUSE.QUERY(SQL), this.$METHOD.GET)
        .then((res) => {
          let total = 0;
          let nodes = res.data.split("\n");
          nodes.forEach((nodeStr) => {
            let node = nodeStr.split("\t");
            if (node[0]) {
              total++;
            }
          });
          if (total > 1) {
            _n.children = [];
            let _child = this.getEndChild(lastduration, nodes);
            _child.forEach((node) => {
              _n.children.push(node);
            });
            this.spans = _.cloneDeep(this.spans);
          }
          console.log(this.spans);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
  .waterfall {
  }
  .waterfall {
    height: 40px;
    pointer-events: none;
    margin: 2px 0 0 0 !important;
    padding: 0;
  }

  &:deep(.ant-slider-dot) {
    border-radius: 2px;
    width: 8px;
    height: 40px;
    margin-top: 1px;
  }
  &:deep(.ant-slider-handle) {
    border-radius: 10px;
    width: 8px;
    height: 40px;
    background: #00adef;
    margin-top: -1px;
  }
  &:deep(.ant-slider-rail) {
    height: 40px;
    top: -1px;
  }
  &:deep(.ant-slider-track) {
    height: 40px;
    top: -1px;
  }
  &:deep(.ant-slider-mark) {
  }
  &:deep(.ant-slider-mark .ant-slider-mark-text:first-child) {
    top: -15px;
    transform: translateX(-10%) !important;
    font-size: 8pt;
    color: #0099d4;
    margin-left: 10px;
  }
  &:deep(.ant-slider-mark .ant-slider-mark-text:last-child) {
    transform: translateX(-90%) !important;
    top: 5px;
    margin-left: -10px;
    font-size: 8pt;
    color: #0099d4;
  }
  .network-card-header {
    padding: 20px 20px 10px;
    opacity: 0.6;
  }
  .network-card-body {
    position: relative;
    min-height: 600px;
  }
  .waterfall-panel {
    margin: -16px;
  }
</style>
