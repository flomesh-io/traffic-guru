<template>
  <div v-if="d">
    <a-tag
      :closable="false"
      v-if="d.running!=null"
    >
      {{ $t('Running') }}
      <a-badge
        :count="d.running"
        :show-zero="true"
      />
    </a-tag>
    <a-tag
      :closable="false"
      v-if="d.desired!=null"
    >
      {{ $t('Desired') }}
      <a-badge
        :count="d.desired"
        :show-zero="true"
      />
    </a-tag>
    <a-tag
      :closable="false"
      v-if="d.available!=null"
    >
      {{ $t('Available') }}
      <a-badge
        :count="d.available"
        :show-zero="true"
      />
    </a-tag>
    <a-tag
      :closable="false"
      v-if="d.updated!=null"
    >
      {{ $t('Updated') }}
      <a-badge
        :count="d.updated"
        :show-zero="true"
      />
    </a-tag>
    <a-tag
      :closable="false"
      v-if="d.replicas!=null"
    >
      {{ $t('total') }}:
      <a-badge
        :count="d.replicas"
        :show-zero="true"
      />
    </a-tag>
  </div>
</template>

<script>
export default {
  name: "PodStatusTags",
  props: ["d"],
  i18n: require("@/i18n"),
};
</script>