<template>
  <DashboardCore
    :hide-head="true"
    :apply="apply"
    :default-widget="DEFAULT_FSM"
  />
</template>

<script>
import DashboardCore from "@/components/page/Dashboard";
import { DEFAULT_FSM } from "@/services/dashboard";
export default {
  name: "Dashboard",
  i18n: require("@/i18n"),
  components: {
    DashboardCore,
  },

  data() {
    return {
      DEFAULT_FSM,
      loading: true,
      apply: "fsm",
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
