<template>
  <template v-if="cond">
    <a-form-item
      :name="name"
      :rules="getRules"
    >
      <slot />
    </a-form-item>
  </template>
  <template v-else>
    <slot />
  </template>
</template>

<script>
export default {
  name: "DetailListItem",
  i18n: require("@/i18n_message"),
  props: {
    cond: {
      type: [Boolean],
      default: true,
    },

    name: {
      type: String,
      required: false,
      default: ""
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
      (this.rules || []).map((rule) => {
        if (rule.message) {
          rule.message = this.$t(rule.message);
        }
        return rule;
      });
      return this.rules;
    },
  },

  created() {},

  methods: {},
};
</script>
