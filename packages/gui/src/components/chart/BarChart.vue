<template>
  <ChartCard
    class="card nopd"
    v-if="barData"
  >
    <template #action>
      <a-tooltip :title="$t('introduce')">
        <InfoCircleOutlined />
      </a-tooltip>
    </template>
    <div>
      <MiniBar
        id="barChart"
        :dv="barData"
        stack="Total"
      />
    </div>
    <template #footer>
      <div>
        {{ $t(label) }}
        <span
          v-if="cnt && cnt[0]"
        >{{ Math.ceil((cnt[0][2] * 100) / cnt[0][0]) }}%</span>
      </div>
    </template>
  </ChartCard>
</template>

<script>
import { mapState } from "vuex";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import MiniBar from "@/components/chart/MiniBar";
import ChartCard from "@/components/card/ChartCard";
export default {
  name: "BarChart",
  components: {
    ChartCard,
    MiniBar,
    InfoCircleOutlined,
  },

  props: ["barData", "cnt", "label"],
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

  created() {},
  mounted() {
    this.$i18n.locale = this.lang;
  },

  methods: {},
};
</script>

<style lang="less" scoped></style>
