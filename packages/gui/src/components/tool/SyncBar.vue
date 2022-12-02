<template>
  <a-progress
    v-if="percent > -1"
    size="small"
    class="title-progress"
    :stroke-color="{
      '0%': '#00adef',
      '100%': '#87d068',
    }"
    :percent="percent"
  />
  <a-button
    v-if="percent == -1"
    type="link"
    shape="circle"
    @click="sync"
  >
    <template
      #icon
    >
      <SyncOutlined
        class="font-20 icon-menu-sm rotate-icon"
      />
    </template>
  </a-button>
  <a-button
    v-if="percent > -1 && percent < 100"
    type="link"
    shape="circle"
  >
    <template
      #icon
    >
      <SyncOutlined
        v-if="percent > -1 && percent < 100"
        spin
        class="font-12"
      />
    </template>
  </a-button>
</template>

<script>
import { SyncOutlined } from "@ant-design/icons-vue";

export default {
  name: "SyncBar",
  components: { SyncOutlined },
  props: ["percent"],
  methods: {
    sync() {
      this.$emit("sync");
    },
  },
};
</script>

<style lang="less" scoped>
  .title-progress {
    margin-left: 10px;
    width: 150px;
  }
</style>
