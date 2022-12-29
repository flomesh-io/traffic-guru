<template>
  <div v-if="d.spec?.template?.spec?.containers">
    <a-tag
      :key="index"
      v-for="(item, index) in d.spec.template.spec.containers"
      :closable="false"
    >
      {{ item.image }}
    </a-tag>
  </div>
</template>

<script>
export default {
  name: "ImageTags",
  props: ["d"],
  i18n: require("@/i18n"),
};
</script>