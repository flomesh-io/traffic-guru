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
import AreaChart from "@/components/chart/topo/AreaChart";
import BpsChart from "@/components/chart/topo/BpsChart";
import DelayChart from "@/components/chart/topo/DelayChart";
import QoSSummaryChart from "@/components/chart/topo/QoSSummaryChart";
import StatusChart from "@/components/chart/topo/StatusChart";
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
