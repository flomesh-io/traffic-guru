<template>
  <!--
    <page-toggle-transition
    :disabled="animate.disabled"
    :animate="animate.name"
    :direction="animate.direction"
    > 
  -->
  <router-view />
  <!-- </page-toggle-transition> -->
</template>

<script>
// import PageToggleTransition from "../components/transition/PageToggleTransition";
import { mapState } from "vuex";

export default {
  name: "BlankView",
  computed: {
    ...mapState("setting", ["multiPage", "animate"]),
  },
};
</script>

<style lang="less" scoped></style>
