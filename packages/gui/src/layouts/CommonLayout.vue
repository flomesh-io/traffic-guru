<template>
  <div class="common-layout">
    <div class="content">
      <slot />
    </div>
    <PageFooter
      :link-list="footerLinks"
      :copyright="copyright"
    />
  </div>
</template>

<script>
import PageFooter from "@/layouts/footer/PageFooter";
import { mapState } from "vuex";

export default {
  name: "CommonLayout",
  components: { PageFooter },
  computed: {
    ...mapState("setting", ["footerLinks", "copyright"]),
  },
};
</script>

<style scoped lang="less">
  .common-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #fefefe;
    overflow: auto;
    .content {
      padding: 32px 0;
      flex: 1;
      @media (min-width: 768px) {
        padding: 100px 0 24px;
      }
    }
    .background {
    }
  }

  .common-layout::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.1;
    filter: blur(5px);
    pointer-events: none;
    background-image: url("../assets/img/back6.png");
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: 0px;
    background-size: cover;
  }
</style>
