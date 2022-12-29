<template>
  <a-card
    v-if="d && d.rollingUpdate"
    class="card mb-20"
    :bordered="false"
    :loading="loading"
    :title="title||$t('Rolling Update Strategy')"
  >
    <DetailList
      size="small"
      :col="3"
    >
      <DetailListItem
        v-if="d.rollingUpdate.maxSurge!=null"
        :term="$t('Max Surge')"
      >
        <a-badge
          :count="d.rollingUpdate.maxSurge"
          :show-zero="true"
        />
      </DetailListItem>
      <DetailListItem
        v-if="d.rollingUpdate.maxUnavailable!=null"
        :term="$t('Max Unavailable')"
      >
        <a-badge
          :count="d.rollingUpdate.maxUnavailable"
          :show-zero="true"
        />
      </DetailListItem>
      <DetailListItem
        v-if="d.rollingUpdate.partition!=null"
        :term="$t('Partition')"
      >
        {{
          d.rollingUpdate.partition
        }}
      </DetailListItem>
    </DetailList>
  </a-card>
</template>

<script>
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
export default {
  name: "RollingUpdateCard",
  components: {DetailList,DetailListItem},
  props: ["d","loading","title"],
  i18n: require("@/i18n"),
  data() {
    return {
    };
  },
};
</script>