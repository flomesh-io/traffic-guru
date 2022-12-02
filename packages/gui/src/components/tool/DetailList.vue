<template>
  <div
    :class="[
      'detail-list',
      size === 'small' ? 'small' : 'large',
      layout === 'vertical' ? 'vertical' : 'horizontal',
    ]"
    :style="'flex-' + col"
  >
    <div
      v-if="title"
      class="title"
    >
      {{ title }}
    </div>
    <a-row>
      <slot />
    </a-row>
  </div>
</template>

<script>
export default {
  name: "DetailList",
  props: {
    title: {
      type: String,
      required: false,
      default: "",
    },

    col: {
      type: Number,
      required: false,
      default: 3,
    },

    size: {
      type: String,
      required: false,
      default: "large",
    },

    layout: {
      type: String,
      required: false,
      default: "horizontal",
    },
  },
};
</script>

<style lang="less">
  .detail-list {
    .title {
      font-size: 16px;
      color: @title-color;
      font-weight: bolder;
      margin-bottom: 16px;
    }
    .term {
      // Line-height is 22px IE dom height will calculate error
      line-height: 20px;
      padding-bottom: 16px;
      margin-right: 8px;
      color: @title-color;
      white-space: nowrap;
      display: table-cell;
      &:after {
        content: ":";
        margin: 0 8px 0 2px;
        position: relative;
        top: -0.5px;
      }
    }
    .term.top {
      vertical-align: top;
      padding-top: 5px;
    }
    .content {
      line-height: 22px;
      width: 100%;
      padding-bottom: 16px;
      color: @text-color;
      display: table-cell;
    }
    &.small {
      .title {
        font-size: 14px;
        color: @text-color;
        font-weight: normal;
        margin-bottom: 12px;
      }
      .term,
      .content {
        padding-bottom: 8px;
      }
    }
    &.large {
      .term,
      .content {
        padding-bottom: 16px;
      }
    }
    &.vertical {
      .term {
        padding-bottom: 8px;
      }
      .term,
      .content {
        display: block;
      }
    }
  }
</style>
