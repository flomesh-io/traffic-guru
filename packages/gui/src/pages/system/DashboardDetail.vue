<template>
  <Dashboard
    :editable="true"
    :dashboard-id="pid"
  />
</template>

<script>
import Dashboard from "@/components/page/Dashboard";
export default {
  name: "DashboardDetail",
  i18n: require("@/i18n"),
  components: {
    Dashboard,
  },

  data() {
    return {
      pid: "",
    };
  },

  computed: {},

  watch: {},
  created() {
    this.pid = this.$route.params.id || "";
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="less"></style>
