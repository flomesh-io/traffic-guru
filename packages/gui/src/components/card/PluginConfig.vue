<template>
  <a-result
    v-if="plugins.length == 0"
    :title="$t('No data')"
  >
    <template #icon>
      <img
        src="../../assets/img/empty.svg"
        style="width: 300px"
      >
    </template>
    <template #extra>
      <a-button
        v-if="addText && type == 'service'"
        v-permission="['service:update']"
        type="primary"
        @click="add"
      >
        {{ $t(addText) }}
      </a-button>
      <a-button
        v-else-if="addText"
        type="primary"
        @click="add"
      >
        {{
          $t(addText)
        }}
      </a-button>
    </template>
  </a-result>
  <a-card
    v-for="(plugin, index) in plugins"
    :key="index"
    class="card mb-24"
    :bordered="false"
    :loading="loading"
  >
    <template #title>
      <img
        v-if="plugin.icon"
        :src="BASE_URL + plugin.icon.url"
        alt="avatar"
        class="card-img"
      >
      {{ plugin.name }}
      <span
        v-if="
          plugin.content.displayName &&
            plugin.name != plugin.content.displayName
        "
      >
        ( {{ plugin.content.displayName }} )
      </span>
    </template>
    <template #extra>
      <a-switch v-model:checked="plugin.enable">
        <template #checkedChildren>
          <CheckOutlined />
        </template>
        <template #unCheckedChildren />
      </a-switch>
      <CloseOutlined
        class="gray"
        @click="remove(index)"
      />
    </template>
    <AutoForm :fields="[plugin.content.fields]" />
  </a-card>
</template>

<script>
import {
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import AutoForm from "@/components/form/AutoForm";
import { BASE_URL } from "@/services/api";

export default {
  name: "PluginConfig",
  i18n: require("@/i18n"),
  components: {
    AutoForm,
    CheckOutlined,
    CloseOutlined,
  },

  props: ["type", "addText", "plugins"],

  data() {
    return {
      BASE_URL,
      loading: true,
    };
  },

  computed: {},
  mounted() {},
  created() {
    this.loading = false;
  },

  methods: {
    remove(i) {
      this.plugins.splice(i, 1);
    },

    add() {
      this.$emit("add", {});
    },
  },
};
</script>

<style lang="less" scoped>
  .card-img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
</style>
