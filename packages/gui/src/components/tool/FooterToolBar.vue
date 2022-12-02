<template>
  <div class="toolbar">
    <div class="float-left">
      <slot name="extra" />
    </div>
    <div class="float-right">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterToolBar",
};
</script>

<style lang="less" scoped>
  .toolbar {
    position: fixed;
    width: 100%;
    bottom: 0;
    right: 0;
    box-shadow: 0 -1px 2px @shadow-color;
    background: @base-bg-color;
    border-top: 1px solid @border-color-split;
    padding: 12px 24px;
    z-index: 9;
  }
</style>
