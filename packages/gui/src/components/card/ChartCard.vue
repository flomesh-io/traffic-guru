<template>
  <a-card
    :loading="loading"
    :body-style="{ padding: padding ? padding : '8px 24px 8px' }"
    :bordered="false"
  >
    <div class="chart-card-header">
      <div class="meta">
        <span class="chart-card-title">{{ title }}</span>
        <span class="chart-card-action">
          <slot name="action" />
        </span>
      </div>
      <div
        v-if="!hideTotal"
        class="total"
      >
        <slot name="total" />
      </div>
    </div>
    <div
      class="chart-card-content"
      :style="{ height: height ? height : '46px' }"
      :class="hideTotal ? 'hideTotal' : ''"
    >
      <div class="content-fix">
        <slot />
      </div>
    </div>
    <div
      v-if="!notFt"
      class="chart-card-footer"
    >
      <slot name="footer" />
    </div>
  </a-card>
</template>

<script>
export default {
  name: "ChartCard",
  props: ["title", "hideTotal", "loading", "notFt", "height", "padding"],
};
</script>

<style scoped lang="less">
  .chart-card-header {
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  .chart-card-header .meta {
    position: relative;
    overflow: hidden;
    width: 100%;
    color: @text-color-second;
    font-size: 14px;
    line-height: 22px;
  }
  .chart-card-action {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }
  .total {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 30px;
    line-height: 38px;
    height: 38px;
  }
  .chart-card-footer {
    border-top: 1px solid @border-color-base;
    padding-top: 9px;
    margin-top: 8px;
  }
  .chart-card-content {
    margin-bottom: 12px;
    position: relative;
    width: 100%;
  }
  .chart-card-content.hideTotal {
    height: 68px;
    margin-bottom: 32px;
  }
  .chart-card-content .content-fix {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
</style>
