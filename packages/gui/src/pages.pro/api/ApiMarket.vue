<template>
  <ApiList :modefilter="0" />
</template>

<script>
import ApiList from "./ApiList";
export default {
  name: "ApiMarket",
  components: {
    ApiList
  },
};
</script>