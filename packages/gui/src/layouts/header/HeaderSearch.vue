<template>
  <div class="header-search">
    <SearchOutlined
      v-show="!searchMode"
      class="search-icon"
      @click="enterSearchMode"
    />
    <a-input-search
      ref="input"
      size="large"
      v-show="searchMode"
      v-model:value="value"
      class="enter search-input search-ipt"
      :placeholder="$t('Uni Search')"
      @search="search"
      @blur="leaveSearchMode"
    />
    <div
      class="search-pannel"
      v-if="visible"
    >
      <CloseOutlined
        class="close-icon"
        @click="close"
      />
      <UniSearch
        :keyword="value"
        @open="close"
      />
    </div>
  </div>
</template>

<script>
import { SearchOutlined, CloseOutlined } from "@ant-design/icons-vue";
import UniSearch from "./UniSearch";

export default {
  name: "HeaderSearch",
  i18n: require("@/i18n"),
  components: { SearchOutlined, CloseOutlined, UniSearch },
  data() {
    return {
      value: "",
      visible: false,
      searchMode: false,
    };
  },

  methods: {
    search() {
      this.visible = true;
    },

    close() {
      this.visible = false;
    },

    enterSearchMode() {
      this.searchMode = true;
      this.$emit("active", true);
      setTimeout(() => this.$refs.input.focus(), 300);
    },

    leaveSearchMode() {
      if (this.value == "") {
        this.searchMode = false;
        this.visible = false;
        setTimeout(() => this.$emit("active", false), 300);
      }
    },
  },
};
</script>

<style lang="less">
  .header-search {
    .search-icon {
      font-size: 16px;
      cursor: pointer;
    }
    .search-input {
      border: 0;
      border-bottom: 1px solid @border-color-split;
      transition: width 0.3s ease-in-out;
			position: relative;
			top: 8px;
      input {
        border: 0;
        box-shadow: 0 0 0 0;
      }
      &.leave {
        width: 0px;
        input {
          display: none;
        }
      }
      &.enter {
        width: 522px;
        input:focus {
          box-shadow: 0 0 0 0;
        }
      }
    }
  }
  .header-search-fullscreen {
    position: absolute;
    left: 0px;
    right: -20px;
    overflow: auto;
    z-index: 100;
  }
  .header-search-fullscreen .search-icon {
    margin-left: 20px;
  }
  .header-search-fullscreen .search-ipt {
    margin-left: 20px;
  }
  .search-pannel {
    width: 100%;
    position: fixed;
    left: 0px;
    right: 0px;
    top: 64px;
    bottom: 0;
    min-height: 1620px;
    background-color: #fafafa;
    z-index: 12;
    padding: 5px 20px;
  }
  .close-icon {
    color: #fff;
    background-color: #00adef;
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 10000;
    font-size: 40px;
  }
</style>
