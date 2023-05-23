<template>
  <a-tag
    v-for="(key, index) in Object.keys(map || [])"
    :key="index"
    @close="handleClose(key)"
    :closable="true"
  >
    <span v-if="key == 'objectset.rio.cattle.io/applied'">
      <a-tooltip
        placement="topLeft"
        :title="map[key]"
      >
        <a
          class="font-primary"
          href="javascript:void(0)"
        >{{ key }}</a>
      </a-tooltip>
    </span>
    <span
      v-else-if="
        key == 'kubectl.kubernetes.io/last-applied-configuration'
      "
    >
      <a-popover
        trigger="click"
        :title="key"
      >
        <template #content>
          <JsonEditor
            :is-json="true"
            :value="map[key]"
          />
        </template>
        <a
          class="font-primary"
          href="javascript:void(0)"
        >{{ key }}</a>
      </a-popover>
    </span>
    <span
      v-else
    >{{ key }}: {{ map[key] }}</span>
  </a-tag>
  <a-input
    v-show="visible"
    ref="key"
    type="text"
    size="small"
    class="width-60"
    :placeholder="$t('Key')"
    @keyup.enter="next"
    v-model:value="keyInput"
  />
  <span v-show="visible"> : </span>
  <a-input
    v-show="visible"
    ref="val"
    type="text"
    size="small"
    class="width-60"
    :placeholder="$t('Value')"
    v-model:value="valInput"
    @keyup.enter="inputConfirm"
  />
  <a-tag
    v-if="!visible"
    @click="showInput"
    class="dashed-tag"
  >
    <PlusOutlined />
    {{ $t("add") }}
  </a-tag>
</template>

<script>
import { PlusOutlined } from "@ant-design/icons-vue";
import JsonEditor from "@/components/editor/JsonEditor";

export default {
  name: "TagMap",
  components: { PlusOutlined, JsonEditor },
  props: ["map"],
  i18n: require("@/i18n"),
  data() {
    return {
      keyInput: "",
      valInput: "",
      visible: false,
    };
  },

  methods: {
    next() {
      this.$refs['val'].focus();
    },

    showInput() {
      this.visible = true;
      this.$nextTick().then(() => {
        this.$refs['key'].focus();
      });
    },

    handleClose(key) {
      let map = this.map;
      delete map[key];
      this.$emit("update:map", map);
      this.$emit("change", map);
    },

    inputConfirm() {
      if (this.keyInput == "" && this.valInput == "") {
        this.visible = false;
        return;
      } else if (this.keyInput == "" || this.valInput == "") {
        this.$message.error({
          content: this.$t("Please enter the format of [key]:[value]"),
        });
      } else {
        let map = this.map || {};
        map[this.keyInput] = this.valInput;
        this.keyInput = ""; 
        this.valInput = "";
        this.visible = false;
        this.$emit("update:map", map);
        this.$emit("change", map);
      }
    },
  },
};
</script>

<style lang="less">
  .task-group {
    width: 100%;
    padding: 8px 8px;
    border-radius: 0px;
    .task-head {
      margin-bottom: 8px;
      .title {
        display: inline-block;
        span {
          display: inline-block;
          border-radius: 10px;
          margin: 0 8px;
          font-size: 12px;
          padding: 2px 6px;
          background-color: #e6fcff;
          color: #00adef;
        }
      }
      .actions {
        display: inline-block;
        float: right;
        font-size: 18px;
        font-weight: bold;
        i {
          cursor: pointer;
        }
      }
    }
  }
</style>
