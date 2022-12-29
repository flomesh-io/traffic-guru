<template>
  <a-card
    class="card mb-20"
    :bordered="false"
    :loading="loading"
    :title="$t('Resource Info')"
  >
    <DetailList
      size="small"
      :col="3"
    >
      <DetailListItem
        v-if="d.spec.schedule"
        :term="$t('Schedule')"
      >
        {{ d.spec.schedule }}
      </DetailListItem>
      <DetailListItem
        v-if="d.active"
        :term="$t('Active Jobs')"
      >
        <a-badge
          :count="d.active.length"
          :show-zero="true"
        />
      </DetailListItem>
      <DetailListItem
        v-if="d.spec.suspend"
        :term="$t('Suspend')"
      >
        <a-badge
          :count="d.spec.suspend"
          :show-zero="true"
        />
      </DetailListItem>
    </DetailList>

    <DetailList
      size="small"
      :col="3"
    >
      <DetailListItem
        v-if="d.status.lastScheduleTime"
        :term="$t('Last Schedule')"
      >
        {{ new Date(d.status.lastScheduleTime).toLocaleString() }}
      </DetailListItem>
      <DetailListItem
        v-if="d.spec.concurrencyPolicy"
        :term="$t('Concurrency Policy')"
      >
        {{ d.spec.concurrencyPolicy }}
      </DetailListItem>
    </DetailList>
    <DetailList
      size="small"
      :col="3"
    >
      <DetailListItem
        v-if="d.spec.minReadySeconds"
        :term="$t('Minimum Preparation Seconds')"
      >
        {{ d.spec.minReadySeconds }}
      </DetailListItem>
      <DetailListItem
        v-if="d.spec.revisionHistoryLimit"
        :term="$t('Modify History Restrictions')"
      >
        {{ d.spec.revisionHistoryLimit }}
      </DetailListItem>
    </DetailList>
    <DetailList
      size="small"
      :col="1"
    >
      <DetailListItem
        v-if="
          d.spec.labelSelector && d.spec.labelSelector.matchLabels
        "
        :term="$t('Selector')"
      >
        <a-tag
          :key="index"
          v-for="(key, index) in Object.keys(
            d.spec.labelSelector.matchLabels,
          )"
          :closable="false"
        >
          {{ key }}:{{ d.spec.labelSelector.matchLabels[key] }}
        </a-tag>
      </DetailListItem>
      <DetailListItem
        v-if="d.spec?.template?.spec?.containers"
        :term="$t('Container Images')"
      >
        <ImageTags :d="d" />
      </DetailListItem>
      <DetailListItem
        :term="$t('Selector')"
        v-if="d.spec.selector?.matchLabels"
      >
        <a-tag
          :key="index"
          v-for="(key, index) in Object.keys(d.spec.selector.matchLabels)"
          :closable="false"
        >
          {{ key }}:{{ d.spec.selector.matchLabels[key] }}
        </a-tag>
      </DetailListItem>
    </DetailList>
    <DetailList
      size="small"
      :col="3"
    >
      <DetailListItem
        v-if="d.spec.completions"
        :term="$t('Completions')"
      >
        <a-badge
          :count="d.spec.completions"
          :show-zero="true"
        />
      </DetailListItem>
      <DetailListItem
        v-if="d.spec.parallelism"
        :term="$t('Parallelism')"
      >
        <a-badge
          :count="d.spec.parallelism"
          :show-zero="true"
        />
      </DetailListItem>
    </DetailList>
  </a-card>
</template>

<script>
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
import ImageTags from "./ImageTags";
export default {
  name: "ResourceInfoCard",
  components: {DetailList,DetailListItem,ImageTags},
  props: ["d","loading"],
  i18n: require("@/i18n"),
  data() {
    return {
    };
  },
};
</script>