<template>
  <a-card
    class="card nopd"
    :title="$t('Waterfall Detail')"
  >
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
                @click="showDrawer(record)"
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
              v-for="(tag, tagidx) in record.svcAry"
            >
              {{ tag }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'podName'">
            <a-tag
              :key="tagidx"
              v-for="(tag, tagidx) in record.podAry"
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
import {
  getTraceDetail,
} from "@/services/clickhouseGQL";
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
      list:[],
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

    showDrawer(span) {
      this.getLog(span);
      this.visible = true;
    },

    onClose() {
      this.visible = false;
    },

    getStep(val, duration) {
      return Math.ceil((val / duration) * 100);
    },

    getTime(val) {
      return val + "ms";
    },

    getLog(span) {
      this.log = span.message || JSON.stringify({});
    },

    getData() {
      this.loading = true;
      this.data = [];
      getTraceDetail(this.traceId)
        .then((res) => {
          this.loading = false;
          this.list = res.data;
          this.spans = this.findSpan(this.traceId, true);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    findSpan(spanId,isRoot,time,duration){
      let _spans = this.list.filter(item => item.traceParent == spanId);
      _spans.forEach((span)=>{
        let _time = isRoot?span.reqTime:time;
        let _duration = isRoot?span.duration:duration;
        this.buildSpan(span,_time,_duration);
        let children = this.findSpan(span.traceSpan,false,_time,_duration);
        if(children && children.length > 0){
          span.children = children;
        }
      });
      return _spans;
    },
		
    buildSpan(span, time, duration) {
      let _start = span.reqTime - time;
      span.key= span.traceSpan;
      span.spanId= span.traceSpan;
      span.cnt= 1;
      span.svcAry = (span.serviceName||"").split(",");
      span.podAty = (span.podName||"").split(",");
	
      //span.duration: node[5],
      //span.reqTime: node[6],
      //span.resTime: node[7],
      span.start= this.getStep(_start, duration),
      span.end= this.getStep(_start + span.duration * 1, duration),
      span.startTime= this.getTime(_start),
      span.endTime= this.getTime(_start + span.duration * 1),
      span.marks= {},
      span.marks[this.getStep(_start, duration)] = this.getTime(_start);
      span.marks[this.getStep(_start * 1 + span.duration * 1, duration)] = this.getTime(
        _start * 1 + span.duration * 1,
      );
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
