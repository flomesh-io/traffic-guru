<template>
  <div
    :class="computedClasses"
    class="material-input__component"
  >
    <div :class="{ iconClass: icon }">
      <iconfont
        v-if="icon"
        :type="'icon-' + icon"
        class="material-input__icon"
      />
      <input
        v-if="type === 'email'"
        ref="mdinput"
        v-model="currentValue"
        :name="name"
        :placeholder="fillPlaceHolder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        type="email"
        class="material-input"
        @focus="handleMdFocus"
        @blur="handleMdBlur"
        @input="handleModelInput"
      >
      <input
        v-if="type === 'url'"
        ref="mdinput"
        v-model="currentValue"
        :name="name"
        :placeholder="fillPlaceHolder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        type="url"
        class="material-input"
        @focus="handleMdFocus"
        @blur="handleMdBlur"
        @input="handleModelInput"
      >
      <input
        v-if="type === 'number'"
        ref="mdinput"
        v-model="currentValue"
        :name="name"
        :placeholder="fillPlaceHolder"
        :step="step"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :max="max"
        :min="min"
        :minlength="minlength"
        :maxlength="maxlength"
        :required="required"
        type="number"
        class="material-input"
        @focus="handleMdFocus"
        @blur="handleMdBlur"
        @input="handleModelInput"
      >
      <input
        v-if="type === 'password'"
        ref="mdinput"
        v-model="currentValue"
        :name="name"
        :placeholder="fillPlaceHolder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :max="max"
        :min="min"
        @keyup.enter="pressEnter"
        :required="required"
        type="password"
        class="material-input"
        @focus="handleMdFocus"
        @blur="handleMdBlur"
        @input="handleModelInput"
      >
      <input
        v-if="type === 'tel'"
        ref="mdinput"
        v-model="currentValue"
        :name="name"
        :placeholder="fillPlaceHolder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :required="required"
        type="tel"
        class="material-input"
        @focus="handleMdFocus"
        @blur="handleMdBlur"
        @input="handleModelInput"
      >
      <input
        v-if="type === 'text'"
        ref="mdinput"
        v-model="currentValue"
        :name="name"
        :placeholder="fillPlaceHolder"
        :readonly="readonly"
        :disabled="disabled"
        :autocomplete="autoComplete"
        :minlength="minlength"
        :maxlength="maxlength"
        :required="required"
        type="text"
        class="material-input"
        @keyup.enter="pressEnter"
        @focus="handleMdFocus"
        @blur="handleMdBlur"
        @input="handleModelInput"
      >
      <span class="material-input-bar" />
      <label class="material-label">
        <slot />
      </label>
    </div>
  </div>
</template>

<script>
import Icon from "@ant-design/icons-vue";

export default {
  name: "MdInput",
  props: {
    /* eslint-disable */
      icon: String,
      name: String,
      type: {
        type: String,
        default: "text",
      },
      value: [String, Number],
      placeholder: String,
      readonly: Boolean,
      disabled: Boolean,
      min: String,
      max: String,
      step: String,
      minlength: Number,
      maxlength: Number,
      required: {
        type: Boolean,
        default: true,
      },
      autoComplete: {
        type: String,
        default: "off",
      },
      validateEvent: {
        type: Boolean,
        default: true,
      },
    },
    components: { Icon },
    data() {
      return {
        currentValue: this.value,
        focus: false,
        fillPlaceHolder: null,
      };
    },
    computed: {
      computedClasses() {
        return {
          "material--active": this.focus,
          "material--disabled": this.disabled,
          "material--raised": Boolean(this.focus || this.currentValue), // has value
        };
      },
    },
    watch: {
      value(newValue) {
        this.currentValue = newValue;
      },
    },
    methods: {
      getfocus() {
        if (this.$refs.mdinput) {
          this.$refs.mdinput.focus();
        }
      },
      handleModelInput(event) {
        const value = event.target.value;
        this.$emit("input", value);
        this.$emit("write", value);
        if (this.$parent.$options.componentName === "ElFormItem") {
          if (this.validateEvent) {
            this.$parent.$emit("el.form.change", [value]);
          }
        }
        this.$emit("update:value", value);
      },
      handleMdFocus(event) {
        this.focus = true;
        this.$emit("focus", event);
        if (this.placeholder && this.placeholder !== "") {
          this.fillPlaceHolder = this.placeholder;
        }
      },
      pressEnter() {
        this.$emit("pressEnter", {});
      },
      handleMdBlur(event) {
        this.focus = false;
        this.$emit("blur", event);
        this.fillPlaceHolder = null;
        if (this.$parent.$options.componentName === "ElFormItem") {
          if (this.validateEvent) {
            this.$parent.$emit("el.form.blur", [this.currentValue]);
          }
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  // Fonts:
  @font-size-base: 16px;
  @font-size-small: 16px;
  @font-size-smallest: 12px;
  @font-weight-normal: normal;
  @font-weight-bold: bold;
  @apixel: 1px;
  // Utils
  @spacer: 12px;
  @transition: 0.2s ease all;
  @index: 0px;
  @index-has-icon: 30px;
  // Theme:
  @color-white: white;
  @color-grey: #9e9e9e;
  @color-grey-light: #e0e0e0;
  @color-blue: #00adef;
  @color-red: #f44336;
  @color-black: black;
  // Mixins:

  // Component:
  .material-input__component {
    margin-top: 0px;
    position: relative;
    * {
      box-sizing: border-box;
    }
    .iconClass {
      .material-input__icon {
        position: absolute;
        left: 0;
        line-height: @font-size-base;
        color: @color-blue;
        top: @spacer;
        width: @index-has-icon;
        height: @font-size-base;
        font-size: @font-size-base;
        font-weight: @font-weight-normal;
        pointer-events: none;
      }
      .material-label {
        left: @index-has-icon;
      }
      .material-input {
        text-indent: @index-has-icon;
      }
    }
    .material-input {
      font-size: @font-size-base;
      padding: @spacer - @apixel * 5 @spacer @spacer - @apixel * 5 @spacer / 2;
      display: block;
      width: 100%;
      border: none;
      line-height: 1;
      border-radius: 0;
      &:focus {
        outline: none;
        border: none;
        border-bottom: 1px solid transparent; // fixes the height issue
      }
    }
    .material-label {
      font-weight: @font-weight-normal;
      position: absolute;
      pointer-events: none;
      left: @index;
      top: 6px;
      transition: @transition;
      font-size: @font-size-small;
    }
    .material-input-bar {
      position: relative;
      display: block;
      width: 100%;
      &:before {
        content: "";
        height: 2px;
        width: 0;
        bottom: 0;
        position: absolute;
        transition: @transition;
        left: 50%;
      }
      &:after {
        content: "";
        height: 2px;
        width: 0;
        bottom: 0;
        position: absolute;
        transition: @transition;
        right: 50%;
      }
    }
    // Disabled state:
    &.material--disabled {
      .material-input {
        border-bottom-style: dashed;
      }
    }
    // Raised state:
    &.material--raised {
      margin-top: 10px;
      .material-label {
        top: -(@font-size-base + @spacer - 12);
        left: 0;
        font-size: 10pt;
        font-weight: @font-weight-bold;
      }
    }
    // Active state:
    &.material--active {
      margin-top: 10px;
      .material-input-bar {
        &:before,
        &:after {
          width: 50%;
        }
      }
    }
  }

  .material-input__component {
    background: transparent;
    .material-input {
      background: none;
      color: @color-black;
      text-indent: @index;
      border-bottom: 1px solid @color-grey-light;
    }
    .material-label {
      color: @color-grey;
    }
    .material-input-bar {
      &:before,
      &:after {
        background: @color-blue;
      }
    }
    // Active state:
    &.material--active {
      .material-label {
        color: @color-blue;
      }
    }
    // Errors:
    &.material--has-errors {
      &.material--active .material-label {
        color: @color-red;
      }
      .material-input-bar {
        &:before,
        &:after {
          background: transparent;
        }
      }
    }
  }
</style>
