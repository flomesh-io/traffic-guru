<template>
  <a-col
    class="detail-list-content flex"
    v-bind="responsive[col]"
  >
    <div :class="termTop ? 'term top' : 'term'">
      {{ term }}
    </div>
    <div class="detail-content">
      <a-form-item
        v-if="rules"
        :name="name"
        :rules="getRules"
      >
        <slot />
      </a-form-item>
      <slot v-else />
    </div>
  </a-col>
</template>

<script>
const responsive = {
  1: { xs: 24 },
  2: { xs: 24, sm: 12 },
  3: { xs: 24, sm: 12, md: 8 },
  4: { xs: 24, sm: 12, md: 6 },
};
export default {
  name: "DetailListItem",
  i18n: require("@/i18n_message"),
  props: {
    name: {
      type: String,
      required: false,
      default: "",
    },

    rules: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },

    term: {
      type: String,
      required: false,
      default: "",
    },

    termTop: {
      type: Boolean,
    },
  },

  data() {
    return {
      col: 2,
      responsive,
    };
  },

  computed: {
    getRules() {
      this.rules.map((rule) => {
        rule.message = this.$t(rule.message);
        return rule;
      });
      return this.rules;
    },
  },

  created() {
    if (
      this.$parent &&
      this.$parent.$parent &&
      this.$parent.$parent.col > 0
    ) {
      this.col = this.$parent.$parent.col;
    }
  },

  methods: {},
};
</script>

<style lang="less">
  .detail-list-content {
    .term {
      // Line-height is 22px IE dom height will calculate error
      line-height: 31px;
      padding-bottom: 8px;
      margin-right: 8px;
      color: @title-color;
      white-space: nowrap;
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
    .detail-content {
      line-height: 31px;
      width: 100%;
      padding-bottom: 8px;
      color: @text-color;
      flex: 1;
    }
    &.small {
      .title {
        font-size: 14px;
        color: @text-color;
        font-weight: normal;
        margin-bottom: 12px;
      }
      .term,
      .detail-content {
        padding-bottom: 8px;
      }
    }
    &.large {
      .term,
      .detail-content {
        padding-bottom: 8px;
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
