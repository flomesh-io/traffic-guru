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
            unit="cores"
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
            :unit="memortUnit"
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
            unit="cores"
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
            :unit="memortUnit"
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
      memortUnit: "Ki",
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
      this.cpu = [];
      this.memory = [];
      let maxMemory = 0;
      for (let i = 0; i < val.length; i++) {
        if(val[i].memory>maxMemory){
          maxMemory = val[i].memory;
        }
      }
      if(maxMemory>1000000){
        this.memortUnit = "Gi";
      }else if(maxMemory>1000){
        this.memortUnit = "Mi";
      }else{
        this.memortUnit = "Ki";
      }
      let setMemory = { "Ki":1,"Mi":1000,"Gi":1000000 }
      for (let i = 0; i < val.length; i++) {
        this.cpu.push({
          type: "CPU",
          value: val[i].cpu / 1000000000,
          date: format(
            new Date(val[i].time * 1000),
            "HH:mm",
          )
        });
        this.memory.push({
          type: "Memory",
          value: val[i].memory / setMemory[this.memortUnit],
          date: format(
            new Date(val[i].time * 1000),
            "HH:mm",
          )
        });
      }
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
