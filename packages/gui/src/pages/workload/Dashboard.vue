<template>
  <DashboardCore
    :hide-head="true"
    :apply="apply"
    :default-widget="DEFAULT_WORKLOAD"
  />
</template>

<script>
import DashboardCore from "@/components/page/Dashboard";
import { DEFAULT_WORKLOAD } from "@/services/dashboard";
export default {
  name: "Dashboard",
  i18n: require("@/i18n"),
  components: {
    DashboardCore,
  },

  data() {
    return {
      DEFAULT_WORKLOAD,
      loading: true,
      apply: "workload",
    };
  },

  computed: {},

  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="less"></style>
