<template>
  <div
    class="flex"
    style="min-width: 550px"
  >
    <div class="pl-10">
      <FieldTimeOutlined class="FieldTimeOutlined" />
    </div>
    <div class="flex-item2 pr-20">
      <a-slider
        range
        class="slider-dot"
        @change="onDateChange"
        :tooltip-visible="false"
        :marks="datamarks"
        :step="null"
        :default-value="dateVal"
      />
    </div>
  </div>
</template>

<script>
import { FieldTimeOutlined } from "@ant-design/icons-vue";
import { timelineMap } from "@/utils/timeline";
export default {
  name: "Timeline",
  components: { FieldTimeOutlined },
  i18n: require("@/i18n"),
  props: ["dateVal"],
  data() {
    return {
      sqlDateMap: timelineMap,
      marks: {},
    };
  },

  computed: {
    datamarks() {
      this.marks = {
        0: "1" + this.$t(" Mths"),
        10: "15" + this.$t(" d"),
        20: "7" + this.$t(" d"),
        30: "3" + this.$t(" d"),
        40: "1" + this.$t(" d"),
        50: "12" + this.$t(" h"),
        60: "6" + this.$t(" h"),
        70: "1" + this.$t(" h"),
        80: "30" + this.$t(" m"),
        90: "5" + this.$t(" m"),
        100: this.$t(" Just"),
      };
      return this.marks;
    },
  },

  watch: {},
  mounted() {},
  methods: {
    onDateChange(value) {
      this.$emit("update:dateVal", value);
      this.$emit("dateChange", {
        value,
        from: this.sqlDateMap[value[0]],
        to: this.sqlDateMap[value[1]],
      });
    },
  },
};
</script>

<style lang="less" scoped>
  .slider-dot &:deep(.ant-slider-dot) {
    border-radius: 2px;
    width: 12px;
    height: 12px;
    top: -5px;
  }
  .slider-dot &:deep(.ant-slider-handle) {
    border-radius: 2px;
    width: 12px;
    height: 12px;
    background: #00a2e6;
    margin-left: 2px;
  }
  .slider-dot &:deep(.ant-slider-rail) {
    height: 12px;
    top: -1px;
  }
  .slider-dot &:deep(.ant-slider-mark-text) {
    min-width: 50px;
  }
  .log-filter-title {
    position: relative;
    top: -4px;
    margin-right: 10px;
  }
  .FieldTimeOutlined {
    position: relative;
    left: -15px;
    top: 5px;
    font-size: 30px;
    color: #00a2e6;
  }
</style>
