<template>
  <div>
    <JobList
      :url="$REST.KUBE.JOB"
      :title="$t('Jobs')"
      :unactive="false"
      :has-search="true"
    />
  </div>
</template>

<script>
import JobList from "./components/JobList";
export default {
  name: "Jobs",
  components: { JobList },
  i18n: require("@/i18n"),
  data() {
    return {};
  },

  computed: {},
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped></style>
