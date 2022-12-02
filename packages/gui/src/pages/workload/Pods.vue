<template>
  <div>
    <PodList
      :url="$REST.KUBE.POD"
      :metric="true"
      :has-search="true"
    />
  </div>
</template>

<script>
import PodList from "./components/PodList";

export default {
  name: "Pods",
  components: { PodList },
  i18n: require("@/i18n"),
  data() {
    return {};
  },

  created() {},
};
</script>

<style lang="less" scoped></style>
