<template>
  <a-form-item
    v-if="rules"
    :label="label"
    :name="name"
    :rules="getRules"
  >
    <slot />
  </a-form-item>
  <a-form-item
    v-else
    :label="label"
  >
    <slot />
  </a-form-item>
</template>

<script>
export default {
  name: "FormItem",
  i18n: require("@/i18n_message"),
  props: {
    label: {
      type: String,
      required: false,
      default: ''
    },

    name: {
      type: String,
      required: false,
      default: ''
    },

    rules: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
  },

  data() {
    return {};
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

  created() {},

  methods: {},
};
</script>

<style lang="less"></style>
