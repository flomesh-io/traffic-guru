<template>
  <a-checkable-tag
    @change="$emit('click')"
    class="tag-default"
    v-model:value="checked"
  >
    <slot />
  </a-checkable-tag>
</template>

<script>
export default {
  name: "TagSelectOption",
  data() {
    return {
      checked: false,
      isTagSelectOption: true,
    };
  },
};
</script>

<style lang="less" scoped>
  .tag-default {
    font-size: 14px;
    padding: 0 8px;
    height: auto;
    margin-right: 24px;
  }
</style>
