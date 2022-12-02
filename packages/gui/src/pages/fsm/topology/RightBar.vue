<template>
  <a-space
    direction="vertical"
    class="full pd-15 relative"
  >
    <a-card
      class="nopd"
      :title="$t('QoS Summary')"
    >
      <QoSSummaryChart
        :msg="msg"
        :where="where"
      />
    </a-card>
    <a-card
      class="nopd"
      :title="$t('Latency')"
    >
      <DelayChart
        :msg="msg"
        :where="where"
      />
    </a-card>
    <a-card
      class="nopd"
      :title="$t('Load Status')"
    >
      <StatusChart
        :msg="msg"
        :where="where"
      />
    </a-card>
    <a-card
      class="nopd"
      :title="$t('TPS/Error')"
    >
      <AreaChart
        :msg="msg"
        :where="where"
      />
    </a-card>
    <a-card
      class="nopd"
      :title="$t('BPS')"
    >
      <BpsChart
        :msg="msg"
        :where="where"
      />
    </a-card>
  </a-space>
</template>

<script>
import AreaChart from "@/components/chart/fsm/AreaChart";
import BpsChart from "@/components/chart/fsm/BpsChart";
import DelayChart from "@/components/chart/fsm/DelayChart";
import QoSSummaryChart from "@/components/chart/fsm/QoSSummaryChart";
import StatusChart from "@/components/chart/fsm/StatusChart";
export default {
  name: "RightBar",
  i18n: require("@/i18n"),
  components: {
    AreaChart,
    BpsChart,
    DelayChart,
    QoSSummaryChart,
    StatusChart,
  },

  props: ["where", "msg"],

  data() {},
  mounted() {},
  methods: {},
};
</script>
