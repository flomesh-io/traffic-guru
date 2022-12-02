<template>
  <div>
    <a-row
      v-if="layout != 'v'"
      class="cpu-layout"
      :gutter="[24, 0]"
    >
      <a-col
        v-if="cpu"
        :sm="24"
        :md="12"
        :xl="12"
      >
        <div class="cpu-body">
          <MiniArea
            :colors="['rgba(107,204,255,1)', 'rgba(127,214,247,0.4)']"
            :height="240"
            :padding="[0, 0, 0, 0]"
            :axis="false"
            unit="%"
            :showy="false"
            :id="'cpu-area' + Math.ceil(Math.random() * 1000)"
            :dv="cpu"
          />
        </div>
      </a-col>
      <a-col
        v-if="memory"
        :sm="24"
        :md="12"
        :xl="12"
      >
        <div class="cpu-body">
          <MiniArea
            :colors="['rgba(195,158,253,1)', 'rgba(195,158,253,0.4)']"
            :height="240"
            :padding="[0, 0, 0, 0]"
            unit="MB"
            :axis="false"
            :showy="false"
            :id="'memory-area' + Math.ceil(Math.random() * 1000)"
            :dv="memory"
          />
        </div>
      </a-col>
    </a-row>
    <div v-if="layout == 'v'">
      <ChartCard
        v-if="cpu"
        padding="20px 24px 28px"
        height="120px"
        :not-ft="true"
        :loading="loadingCPU"
        :title="$t('CPU Usage')"
        class="mb-20"
      >
        <a-tooltip :title="$t('introduce')">
          <template #action>
            <InfoCircleOutlined />
          </template>
        </a-tooltip>
        <div class="relative">
          <MiniArea
            :colors="['rgba(107,204,255,1)', 'rgba(127,214,247,0.4)']"
            :height="230"
            :padding="[55, 5, 5, 15]"
            :axis="true"
            unit="%"
            :id="'cpu-area' + Math.ceil(Math.random() * 1000)"
            :dv="cpu"
          />
        </div>
      </ChartCard>
      <ChartCard
        v-if="memory"
        padding="20px 24px 28px"
        height="120px"
        :not-ft="true"
        :loading="loadingMemory"
        :title="$t('Memory Usage')"
      >
        <a-tooltip :title="$t('introduce')">
          <template #action>
            <InfoCircleOutlined />
          </template>
        </a-tooltip>
        <div class="relative">
          <MiniArea
            :colors="['rgba(195,158,253,1)', 'rgba(195,158,253,0.4)']"
            :height="230"
            :padding="[55, 5, 5, 15]"
            :axis="true"
            unit="MB"
            :id="'memory-area' + Math.ceil(Math.random() * 1000)"
            :dv="memory"
          />
        </div>
      </ChartCard>
    </div>
  </div>
</template>

<script>
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import ChartCard from "@/components/card/ChartCard";
import MiniArea from "@/components/chart/MiniArea";
import { format } from "date-fns";
export default {
  name: "CPUMemory",
  components: { ChartCard, MiniArea, InfoCircleOutlined },
  i18n: require("@/i18n"),
  props: ["metrics", "loading", "layout"],
  data() {
    return {
      cpu: [],
      memory: [],
      loadingCPU: false,
      loadingMemory: false,
    };
  },

  watch: {
    loading() {
      this.loadingCPU = this.loading;
      this.loadingMemory = this.loading;
    },

    metrics(val) {
      this.renderData(val);
    },
  },

  mounted() {
    this.renderData(this.metrics);
    this.loadingCPU = this.loading;
    this.loadingMemory = this.loading;
  },

  methods: {
    renderData(val) {
      for (let i = 0; i < val.length; i++) {
        if (val[i].metricName == "cpu/usage_rate") {
          this.cpu = val[i].dataPoints;
          for (let j = 0; j < this.cpu.length; j++) {
            this.cpu[j].type = "CPU";
            this.cpu[j].date = format(
              new Date(this.cpu[j].x * 1000),
              "HH:mm",
            );
            this.cpu[j].value = this.cpu[j].y / 1000;
          }
        }
        if (val[i].metricName == "memory/usage") {
          this.memory = val[i].dataPoints;
          for (let j = 0; j < this.memory.length; j++) {
            this.memory[j].type = "Memory";
            this.memory[j].date = format(
              new Date(this.memory[j].x * 1000),
              "HH:mm",
            );
            this.memory[j].value = this.memory[j].y / 1000000;
          }
        }
      }
    },

    requestCPU() {
      this.loadingCPU = true;
      this.cpu = [];
      const beginDay = new Date().getTime();
      for (let i = 0; i < 10; i++) {
        let _template = {};
        _template.type = "CPU";
        _template.value = (i + 5) / 2;
        (_template.date = format(
          new Date(beginDay + 1000 * 60 * 60 * 24 * i),
          "HH:mm",
        )),
        this.cpu.push(_template);
      }
      this.loadingCPU = false;
    },

    requestMemory() {
      this.loadingMemory = true;
      this.memory = [];
      const beginDay = new Date().getTime();
      for (let i = 0; i < 10; i++) {
        let _template = {};
        _template.type = "Memory";
        _template.value = (i + 5) / 2;
        (_template.date = format(
          new Date(beginDay + 1000 * 60 * 60 * 24 * i),
          "yyyy-MM-dd HH:mm",
        )),
        this.memory.push(_template);
      }
      this.loadingMemory = false;
    },
  },
};
</script>

<style lang="less" scoped>
  .cpu-layout {
    margin-top: 0;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .cpu-body {
    background-color: #fff;
    overflow: hidden;
  }
</style>
