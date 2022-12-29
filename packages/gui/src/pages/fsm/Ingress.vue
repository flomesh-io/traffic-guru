<template>
  <div>
    <IngressList
      :has-search="true"
    />
  </div>
</template>

<script>
import IngressList from "@/pages/fsm/components/IngressList";

export default {
  name: "Ingresss",
  components: { IngressList },
  i18n: require("@/i18n"),
  data() {
    return {};
  },

  created() {},
};
</script>

<style lang="less" scoped></style>
