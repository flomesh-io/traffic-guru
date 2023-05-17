<template>
  <a-result
    class="mt-100"
    :title="title||$t('No data')"
    :sub-title="subTitle"
  >
    <template #icon>
      <img
        src="../../assets/img/empty.svg"
        :style="'width: '+(width||300)+'px'"
      >
    </template>
    <template
      v-if="$slots['extra']"
      #extra
    >
      <slot name="extra" />
    </template>
  </a-result>
</template>

<script>
export default {
  name: "EmptyResult",
  i18n: require("@/i18n"),
  props: ["title","subTitle","width"],
};
</script>
