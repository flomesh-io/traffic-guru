<template>
  <div>
    <ReplicaSetList
      :url="$REST.K8S.REPLICASET"
      :title="$t('Replica Sets')"
      :metric="true"
      :has-search="true"
    />
  </div>
</template>

<script>
import ReplicaSetList from "./components/ReplicaSetList";
export default {
  name: "ReplicaSets",
  components: { ReplicaSetList },
  i18n: require("@/i18n"),
  data() {
    return {
      loading: false,
    };
  },

  computed: {},
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
  .search {
    margin-bottom: 54px;
  }
  .fold {
    width: calc(100% - 216px);
    display: inline-block;
  }
  .operator {
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
