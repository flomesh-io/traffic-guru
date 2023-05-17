<template>
  <DashboardCore
    :hide-head="true"
    :apply="apply"
    :default-widget="DEFAULT_WEB"
  />
</template>

<script>
import DashboardCore from "@/components/page/Dashboard";
import { DEFAULT_WEB } from "@/services/dashboard";
export default {
  name: "Dashboard",
  i18n: require("@/i18n"),
  components: {
    DashboardCore,
  },

  data() {
    return {
      DEFAULT_WEB,
      apply: "web",
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
