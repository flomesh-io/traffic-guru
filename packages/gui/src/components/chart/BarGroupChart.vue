<template>
  <ChartCard
    class="card nopd"
    v-if="group"
  >
    <a-tooltip :title="$t('introduce')">
      <template #action>
        <InfoCircleOutlined />
      </template>
    </a-tooltip>
    <div>
      <MiniBar
        v-if="groupdata && groupdata.length > 0"
        :colors="['rgba(148, 221, 248,1)', 'rgba(150, 150, 150,0.5)']"
        id="poolbar"
        :dv="groupdata"
        stack="Total"
      />
    </div>
    <template #footer>
      <div class="flex">
        <span class="pr-20">{{ $t("totalu") }}</span>
        <span class="flex-item">
          <MiniProgress
            :target="90"
            :percent="
              Math.ceil((group.total_used_amount / group.total_amount) * 100)
            "
            color="#4cc5f4"
            height="8px"
          />
        </span>
      </div>
    </template>
  </ChartCard>
</template>

<script>
import { mapState } from "vuex";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import MiniBar from "@/components/chart/MiniBar";
import MiniProgress from "@/components/chart/MiniProgress";
import ChartCard from "@/components/card/ChartCard";
export default {
  name: "BarGroupChart",
  components: {
    ChartCard,
    MiniBar,
    MiniProgress,
    InfoCircleOutlined,
  },

  props: ["group"],
  i18n: require("@/i18n"),

  data() {
    return {
      groupdata: [],
    };
  },

  computed: {
    ...mapState("setting", ["lang"]),
  },

  watch: {
    lang(newVal) {
      this.$i18n.locale = newVal;
    },
  },

  created() {
    if (this.group) {
      let groupdata = [];

      let _pools = this.group.pool_usages
        ? this.group.pool_usages
        : [{ pool_name: "empty", amount: 0, used_amount: 0 }];
      _pools.map((node) => {
        groupdata.push({
          type: "Active Count",
          date: node.pool_name,
          value: node.used_amount,
        });
        groupdata.push({
          type: "Free Count",
          date: node.pool_name,
          value: node.amount - node.used_amount,
        });
        return node;
      });
      this.groupdata = groupdata;
    }
  },

  mounted() {
    this.$i18n.locale = this.lang;
  },

  methods: {},
};
</script>

<style lang="less" scoped></style>
