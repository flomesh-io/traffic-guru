<template>
  <a-card
    v-if="d"
    class="card mb-20"
    :bordered="false"
    :loading="loading"
    :title="$t('Pod Status')"
  >
    <DetailList
      size="small"
      :col="3"
    >
      <DetailListItem
        v-if="d.running!=null"
        :term="$t('Running')"
      >
        <a-badge
          :count="d.running"
          :show-zero="true"
        />
      </DetailListItem>
      <DetailListItem
        v-if="d.desired!=null"
        :term="$t('Desired')"
      >
        <a-badge
          :count="d.desired"
          :show-zero="true"
        />
      </DetailListItem>
      <DetailListItem
        v-if="d.available!=null"
        :term="$t('Available')"
      >
        <a-badge
          :count="d.available"
          :show-zero="true"
        />
      </DetailListItem>
      <DetailListItem
        v-if="d.updated!=null"
        :term="$t('Updated')"
      >
        <a-badge
          :count="d.updated"
          :show-zero="true"
        />
      </DetailListItem>
      <DetailListItem
        v-if="d.replicas!=null"
        :term="$t('total')"
      >
        <a-badge
          :count="d.replicas"
          :show-zero="true"
        />
      </DetailListItem>
    </DetailList>
  </a-card>
</template>

<script>
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
export default {
  name: "PodStatusCard",
  components: {DetailList,DetailListItem},
  props: ["d","loading"],
  i18n: require("@/i18n"),
  data() {
    return {
    };
  },
};
</script>