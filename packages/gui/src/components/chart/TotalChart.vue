<template>
  <div class="total-chart">
    <div class="flex">
      <div class="flex-item total-chart-item">
        <b class="total-chart-count">{{ config.total }}</b>
        {{ $t(config.unit) }}
      </div>
      <div class="total-chart-item">
        <a-avatar
          v-if="
            config.icon &&
              (config.icon.default || typeof config.icon == 'string')
          "
          class="avatar-img"
          size="middle"
          shape="square"
          :src="config.icon"
        />
        <component
          class="avatar total-chart-count"
          v-else
          :is="config.icon"
          two-tone-color="#00adef"
        />
      </div>
    </div>
    <div class="pd-x-20">
      <span
        v-for="(item, index) in config.body"
        :key="index"
        class="mr-16"
      >{{ $t(item.label) }} <a-badge
        :count="item.value"
        :show-zero="true"
      /> {{ $t(item.unit) }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import ChartCard from "@/components/card/ChartCard";
export default {
  name: "TotalChart",
  components: { InfoCircleOutlined, ChartCard },
  props: ["config"],
  i18n: require("@/i18n"),
  data() {
    return {};
  },

  computed: {},
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

<style lang="less" scoped>
  .total-chart {
    padding: 10px 0;
    position: relative;
    top: -1px;
    background-color: #fff;
  }
  .total-chart-item {
    padding: 0 20px;
    line-height: 50px;
  }
  .total-chart-count {
    font-size: 30px;
  }
  .total-chart-item .avatar {
    color: @primary-color;
  }
  .avatar-img {
    position: relative;
    top: -3px;
  }
</style>
