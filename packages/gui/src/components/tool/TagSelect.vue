<template>
  <div class="tag-select">
    <TagSelectOption @click="toggleCheck">
      More
    </TagSelectOption>
    <slot />
    <a
      @click="toggle"
      v-show="showTrigger"
      ref="trigger"
      class="trigger"
    >Open
      <DownOutlined
        v-if="collapsed"
        class="ml-5"
      />
      <UpOutlined
        v-if="!collapsed"
        class="ml-5"
      />
    </a>
  </div>
</template>

<script>
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import TagSelectOption from "./TagSelectOption";
export default {
  name: "TagSelect",
  Option: TagSelectOption,
  components: { TagSelectOption, DownOutlined, UpOutlined },
  data() {
    return {
      showTrigger: false,
      collapsed: true,
      screenWidth: document.body.clientWidth,
      checkAll: false,
    };
  },

  watch: {
    screenWidth: function () {
      this.showTrigger = this.needTrigger();
    },

    collapsed: function (val) {
      this.$el.style.maxHeight = val ? "39px" : "78px";
    },
  },

  mounted() {
    let _this = this;
    setTimeout(() => {
      _this.showTrigger = _this.needTrigger();
      _this.$refs.trigger.style.display = _this.showTrigger
        ? "inline"
        : "none";
    }, 1);
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        _this.screenWidth = window.screenWidth;
      })();
    };
  },

  methods: {
    needTrigger() {
      return (
        this.$el.clientHeight < this.$el.scrollHeight ||
        this.$el.scrollHeight > 39
      );
    },

    toggle() {
      this.collapsed = !this.collapsed;
    },

    getAllTags() {
      const tagList = this.$children.filter((item) => {
        return item.isTagSelectOption;
      });
      return tagList;
    },

    toggleCheck() {
      this.checkAll = !this.checkAll;
      const tagList = this.getAllTags();
      tagList.forEach((item) => {
        item.checked = this.checkAll;
      });
    },
  },
};
</script>

<style lang="less" scoped>
  .tag-select {
    user-select: none;
    position: relative;
    overflow: hidden;
    max-height: 39px;
    padding-right: 50px;
    display: inline-block;
  }
  .trigger {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
