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
        :disabled="disabled"
        v-if="addText && type == 'service'"
        v-permission="['service:update']"
        type="primary"
        @click="add"
      >
        {{ $t(addText) }}
      </a-button>
      <a-button
        v-else-if="addText"
        :disabled="disabled"
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
    :class="plugin.content.tabVal=='Script'?'nopd':''"
    :tab-list="tabList"
    :active-tab-key="plugin.content.tabVal"
    @tabChange=" val => onTabChange(val,index)"
    :bordered="false"
    :loading="loading"
  >
    <template #customTab="item">
      {{ $t(item.key) }}
    </template>
    <template #title>
      <img
        v-if="plugin.icon"
        :src="DEFAULT_BASE_URL + plugin.icon.url"
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
      <a-switch
        v-model:checked="plugin.enable"
        :disabled="disabled"
      >
        <template #checkedChildren>
          <CheckOutlined />
        </template>
        <template #unCheckedChildren />
      </a-switch>
      <CloseOutlined
        :class="disabled?'disabled':''"
        class="gray"
        @click="remove(index)"
      />
    </template>
    <div
      :class="disabled?'disabled':''"
      v-if="plugin.content.tabVal == 'Config'"
    >
      <AutoForm
        :fields="[plugin.content.fields]"
        :col="3"
      />
    </div>
    <JsEditor
      v-else
      :is-readonly="disabled"
      :id="'pluginScript'+index"
      v-model:value="plugin.content.script"
    />
  </a-card>
</template>

<script>
import {
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import AutoForm from "@/components/form/AutoForm";
import { DEFAULT_BASE_URL } from "@/services/api";
import JsEditor from "@/components/editor/JsEditor";

export default {
  name: "PluginConfig",
  i18n: require("@/i18n"),
  components: {
    AutoForm,
    CheckOutlined,
    CloseOutlined,
    JsEditor
  },

  props: ["type", "addText", "plugins",'disabled'],

  data() {
    return {
      DEFAULT_BASE_URL,
      tabList: [
        {
          key: 'Config',
          tab: 'Config',
        },
        {
          key: 'Script',
          tab: 'Script',
        },
      ],

      loading: true,
    };
  },

  computed: {},
  watch: {
    plugins: {
      handler() {
        if (this.plugins) {
          this.plugins.forEach((plugin) => {
            if(!plugin.content.tabVal){
              plugin.content.tabVal = "Config";
            }
          });
        }
      },

      immediate: true,
      deep: true,
    },
  },

  mounted() {},
  created() {
    this.loading = false;
  },

  methods: {
    onTabChange(v, i){
      this.plugins[i].content.tabVal = v;
    },

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
	.disabled{
		pointer-events: none;
		opacity:0.5;
	}
</style>
