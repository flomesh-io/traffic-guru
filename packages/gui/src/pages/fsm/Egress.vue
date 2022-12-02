<template>
  <div>
    <EgressList
      :url="$REST.KUBE.INGRESS"
      :metric="false"
      :has-search="true"
    />
  </div>
</template>

<script>
import EgressList from "@/pages/fsm/components/EgressList";

export default {
  name: "Egresss",
  components: { EgressList },
  i18n: require("@/i18n"),
  data() {
    return {};
  },

  created() {},
};
</script>

<style lang="less" scoped></style>
