<template>
  <div class="DashboardCore">
    <DashboardCore
      :hide-add="hideAdd"
      :init="init"
      :hide-head="true"
      :page-id="pageId"
      :params="params"
      :kind="apply"
      v-model:prometheus="prometheusVal"
      @prometheusChange="prometheusChange"
      :apply="apply + '.' + pageId"
      :embed="true"
      :default-widget="defaultWidget"
    />
  </div>
</template>

<script>
import DashboardCore from "@/components/page/Dashboard";
export default {
  name: "Dashboard",
  i18n: require("@/i18n"),
  components: {
    DashboardCore,
  },

  props: ["pageId", "prometheus", "apply", "params", "hideAdd", "init", "defaultWidget"],
  data() {
    return { prometheusVal: null };
  },

  computed: {},

  watch: {
    prometheus(id) {
      this.prometheusVal = id;
    }
  },

  created() {},
  mounted() {
    this.prometheusVal = this.prometheus;
  },

  methods: {
    prometheusChange(){
      this.$emit("update:prometheus",this.prometheusVal);
      this.$emit("prometheusChange",this.prometheusVal);
    },
  },
};
</script>

<style lang="less">
  .DashboardCore {
    margin-top: -20px;
  }
</style>
