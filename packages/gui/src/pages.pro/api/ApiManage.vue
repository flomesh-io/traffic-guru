<template>
  <ApiList :modefilter="1" />
</template>

<script>
import ApiList from "./ApiList";
export default {
  name: "ApiManage",
  components: {
    ApiList
  },
};
</script>