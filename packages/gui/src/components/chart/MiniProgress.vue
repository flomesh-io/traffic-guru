<template>
  <div class="mini-progress">
    <a-tooltip :title="'Target：' + target + '%'">
      <div
        class="target"
        :style="{ left: target + '%' }"
      >
        <span :style="{ backgroundColor: color }" />
        <span :style="{ backgroundColor: color }" />
      </div>
    </a-tooltip>
    <div class="wrap">
      <div
        class="progress"
        :style="{
          backgroundColor: color,
          width: percent + '%',
          height: height,
        }"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MiniProgress",
  props: ["target", "color", "percent", "height"],
  computed: {
    ...mapState("setting", ["lang"]),
  },

  watch: {
    lang(newVal) {
      this.$i18n.locale = newVal;
    },
  },

  mounted() {
    this.$i18n.locale = this.lang;
  },
};
</script>

<style lang="less" scoped>
  .mini-progress {
    padding: 5px 0;
    position: relative;
    width: 100%;
    .wrap {
      background-color: @layout-bg-color;
      position: relative;
    }
    .progress {
      transition: all 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
      border-radius: 1px 0 0 1px;
      background-color: #13c2c2;
      width: 0;
      height: 100%;
    }
    .target {
      position: absolute;
      top: 0;
      bottom: 0;
      span {
        border-radius: 100px;
        position: absolute;
        top: 0;
        left: 0;
        height: 4px;
        width: 2px;
      }
      span:last-child {
        top: auto;
        bottom: 0;
      }
    }
  }
</style>
