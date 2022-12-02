<template>
  <a-tabs
    v-if="tops"
    default-active-key="1"
    size="large"
    class="pb-24"
    :tab-bar-style="{ paddingLeft: '16px' }"
  >
    <a-tab-pane
      v-for="(top, index) in tops"
      :tab="$t(top.title)"
      :key="index"
    >
      <a-row :gutter="[24, 24]">
        <a-col
          :sm="24"
          :md="24 / top.items.length"
          :xl="24 / top.items.length"
          v-for="(item, index2) in top.items"
          :key="index2"
        >
          <RankingList
            :title="item.title ? $t(item.title) : null"
            :list="item.list"
            class="pd-x-26"
          />
        </a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { mapState } from "vuex";
import RankingList from "@/components/chart/RankingList";
export default {
  name: "RankingGroup",
  components: {
    RankingList,
  },

  props: ["tops"],
  i18n: require("@/i18n"),

  data() {
    return {};
  },

  computed: {
    ...mapState("setting", ["lang"]),
  },

  watch: {
    lang(newVal) {
      this.$i18n.locale = newVal;
    },
  },

  mounted() {
    this.$i18n.locale = this.lang;
  },

  created() {},
};
</script>

<style lang="less" scoped></style>
