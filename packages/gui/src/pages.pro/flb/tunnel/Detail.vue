<template>
  <TunnelDetail :rid="rid" />
</template>

<script>
import TunnelDetail from "../components/TunnelDetail";

export default {
  name: "Detail",
  components: {
    TunnelDetail,
  },

  data() {
    return {
      rid: "",
    };
  },

  created() {
    this.rid = this.$route.params.id || "";
  },
};
</script>

<style lang="less" scoped></style>
