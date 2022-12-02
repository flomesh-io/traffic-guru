<template>
  <PageLayout
    :desc="desc"
    :link-list="linkList"
  >
    <template
      v-if="extraImage && !isMobile"
      #extra
    >
      <div class="extraImg">
        <img :src="extraImage">
      </div>
    </template>
    <router-view ref="page" />
  </PageLayout>
</template>

<script>
import PageLayout from "./PageLayout";
import { mapState } from "vuex";

export default {
  name: "PageView",
  components: { PageLayout },
  data() {
    return {
      page: {},
    };
  },

  computed: {
    ...mapState("setting", ["isMobile", "multiPage", "animate"]),
    desc() {
      return this.page ? this.page.desc : "";
    },

    linkList() {
      return this.page ? this.page.linkList : [];
    },

    extraImage() {
      return this.page ? this.page.extraImage : null;
    },
  },

  mounted() {
    this.page = this.$refs.page;
  },

  updated() {
    this.page = this.$refs.page;
  },
};
</script>

<style lang="less" scoped>
  .extraImg {
    margin-top: -60px;
    text-align: center;
    width: 195px;
    img {
      width: 100%;
    }
  }
</style>
