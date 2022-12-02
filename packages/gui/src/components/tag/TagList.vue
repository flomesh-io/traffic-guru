<template>
  <a-tag
    :key="index"
    v-for="(tag, index) in list"
    @close="handleClose(tag)"
    :closable="true"
  >
    {{ tag }}
  </a-tag>
  <a-input
    v-show="visible"
    :ref="name"
    type="text"
    size="small"
    class="width-100"
    :placeholder="placeholder"
    v-model:value="value"
    @blur="inputConfirm"
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

export default {
  name: "TagList",
  components: { PlusOutlined },
  props: ["placeholder", "name", "list"],
  i18n: require("@/i18n"),
  data() {
    return {
      value: "",
      visible: false,
    };
  },

  methods: {
    showInput() {
      this.visible = true;
      this.$nextTick().then(() => {
        this.$refs[this.name].focus();
      });
    },

    handleClose(removedTag) {
      const tags = this.list.filter((tag) => tag !== removedTag);
      this.$emit("update:list", tags);
      this.$emit("change", tags);
    },

    inputConfirm() {
      if (this.value == "") {
        this.visible = false;
        return;
      }
      const tags = [...this.list, this.value];
      this.value = "";
      this.visible = false;
      this.$emit("update:list", tags);
      this.$emit("change", tags);
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
