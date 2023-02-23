<template>
  <a-tooltip
    :title="title"
    :overlay-style="{ zIndex: 2001 }"
  >
    <div
      class="img-check-box"
      @click="toggle"
    >
      <img :src="img">
      <div
        v-if="sChecked"
        class="check-item"
      >
        <CheckOutlined />
      </div>
    </div>
  </a-tooltip>
</template>

<script>
import { h } from "vue";
import { CheckOutlined } from "@ant-design/icons-vue";
const Group = {
  name: "ImgCheckboxGroup",
  components: { CheckOutlined },
  props: {
    multiple: {
      type: Boolean,
      required: false,
    },
    defaultValues: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      values: [],
      options: [],
    };
  },
  provide() {
    return {
      groupContext: this,
    };
  },
  watch: {
    values: function (value) {
      this.$emit("change", value);
    },
  },
  methods: {
    handleChange(option) {
      if (!option.checked) {
        if (this.values.indexOf(option.value) > -1) {
          this.values = this.values.filter((item) => item != option.value);
        }
      } else {
        if (!this.multiple) {
          this.values = [option.value];
          this.options.forEach((item) => {
            if (item.value != option.value) {
              item.sChecked = false;
            }
          });
        } else {
          this.values.push(option.value);
        }
      }
    },
  },
  render() {
    return h(
      "div",
      {
        attrs: { style: "display: flex" },
      },
      [this.$slots.default],
    );
  },
};

export default {
  name: "ImgCheckbox",
  Group,
  components: { CheckOutlined },
  inject: ["groupContext"],
  props: {
    checked: {
      type: Boolean,
      required: false,
    },

    img: {
      type: String,
      required: true,
      default: ''
    },

    value: {
      required: true,
    },

    title: {
      type: String,
      default: ''
    },
  },

  data() {
    return {
      sChecked: this.initChecked(),
    };
  },

  watch: {
    sChecked: function () {
      const option = {
        value: this.value,
        checked: this.sChecked,
      };
      this.$emit("change", option);
      const groupContext = this.groupContext;
      if (groupContext) {
        groupContext.handleChange(option);
      }
    },
  },

  created() {
    const groupContext = this.groupContext;
    if (groupContext) {
      this.sChecked =
        groupContext.defaultValues.length > 0
          ? groupContext.defaultValues.indexOf(this.value) >= 0
          : this.sChecked;
      groupContext.options.push(this);
    }
  },

  methods: {
    toggle() {
      if (this.groupContext.multiple || !this.sChecked) {
        this.sChecked = !this.sChecked;
      }
    },

    initChecked() {
      let groupContext = this.groupContext;
      if (!groupContext) {
        return this.checked;
      } else if (groupContext.multiple) {
        return groupContext.defaultValues.indexOf(this.value) > -1;
      } else {
        return groupContext.defaultValues[0] == this.value;
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .img-check-box {
    margin-right: 16px;
    position: relative;
    border-radius: 4px;
    cursor: pointer;
    .check-item {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      padding-top: 15px;
      padding-left: 24px;
      height: 100%;
      color: @primary-color;
      font-size: 14px;
      font-weight: bold;
    }
  }
</style>
