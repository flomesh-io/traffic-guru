<template>
  <a-menu
    v-show="visible"
    class="contextmenu"
    :style="style"
    :selected-keys="selectedKeys"
    @click="handleClick"
  >
    <a-menu-item
      :key="item.key"
      v-for="item in itemList"
    >
      <component
        v-if="item.icon"
        :is="item.icon"
      />
      <span>{{ item.text }}</span>
    </a-menu-item>
  </a-menu>
</template>

<script>
import { InfoCircleOutlined } from "@ant-design/icons-vue";
export default {
  name: "Contextmenu",
  components: { InfoCircleOutlined },
  props: {
    visible: {
      type: Boolean,
      required: false,
    },

    itemList: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      left: 0,
      top: 0,
      target: null,
      meta: null,
      selectedKeys: [],
    };
  },

  computed: {
    style() {
      return {
        left: this.left + "px",
        top: this.top + "px",
      };
    },
  },

  created() {
    window.addEventListener("click", this.closeMenu);
    window.addEventListener("contextmenu", this.setPosition);
  },

  beforeUnmount() {
    window.removeEventListener("click", this.closeMenu);
    window.removeEventListener("contextmenu", this.setPosition);
  },

  methods: {
    closeMenu() {
      this.$emit("update:visible", false);
    },

    setPosition(e) {
      this.left = e.clientX;
      this.top = e.clientY;
      this.target = e.target;
      this.meta = e.meta;
    },

    handleClick({ key }) {
      this.$emit("select", key, this.target, this.meta);
      this.closeMenu();
    },
  },
};
</script>

<style lang="less" scoped>
  .contextmenu {
    position: fixed;
    z-index: 1000;
    border-radius: 4px;
    box-shadow: -4px 4px 16px 1px @shadow-color !important;
  }
  .ant-menu-item {
    margin: 0 !important 
;
  }
</style>
