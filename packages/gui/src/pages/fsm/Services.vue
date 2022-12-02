<template>
  <div>
    <ServiceList
      :metric="false"
      :has-search="true"
    />
  </div>
</template>

<script>
import ServiceList from "@/pages/fsm/components/ServiceList";

export default {
  name: "Services",
  components: { ServiceList },
  i18n: require("@/i18n"),
  data() {
    return {};
  },

  created() {},
};
</script>

<style lang="less" scoped></style>
