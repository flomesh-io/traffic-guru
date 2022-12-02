<template>
  <DashboardCore
    :avatar="require('@/assets/img/usericon.png')"
    :title="$t('Hello') + ' ' + user.name + ' ' + $t(welcome.message)"
    :desc="$t('Last Login') + ' ' + welcome.timeFix"
    :apply="apply"
    :default-widget="DEFAULT_WORKPLACE"
  />
</template>

<script>
import { mapGetters } from "vuex";
import DashboardCore from "@/components/page/Dashboard";
import { DEFAULT_WORKPLACE } from "@/services/dashboard";
export default {
  name: "WorkPlace",
  i18n: require("@/i18n"),
  components: {
    DashboardCore,
  },

  data() {
    return {
      DEFAULT_WORKPLACE,
      apply: "workplace",
      welcome: {
        timeFix: new Date().toLocaleString(),
        message: "Welcome Flomesh",
      },
    };
  },

  computed: {
    ...mapGetters("account", ["user"]),
  },
};
</script>

<style lang="less"></style>
