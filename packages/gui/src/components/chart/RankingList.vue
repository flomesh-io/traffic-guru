<template>
  <div class="rank">
    <h4
      class="title"
      v-if="title"
    >
      {{ title }}
    </h4>
    <ul class="list">
      <li
        :key="index"
        v-for="(item, index) in list"
      >
        <div class="flex">
          <span :class="index < 3 ? 'active' : null">{{ index + 1 }}</span>
          <span class="flex-item rank-item">{{ item.name }}</span>
          <span>{{ item.value }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "RankingList",
  props: ["title", "list"],
  computed: {
    ...mapState("setting", ["lang"]),
  },

  watch: {
    lang(newVal) {
      this.$i18n.locale = newVal;
    },
  },

  mounted() {
    this.$i18n.locale = this.lang;
  },
};
</script>

<style lang="less" scoped>
  .rank {
    padding: 0 26px 32px 26px;
    .title {
    }
    .list {
      margin: 25px 0 0;
      padding: 0;
      list-style: none;
      li {
        margin-top: 16px;
        word-break: keep-all;
        white-space: nowrap;
        span {
          color: @text-color-second;
          font-size: 14px;
          line-height: 22px;
        }
        span:first-child {
          background-color: @layout-bg-color;
          border-radius: 20px;
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          margin-right: 16px;
          height: 20px;
          line-height: 20px;
          width: 20px;
          text-align: center;
        }
        span.active {
          background-color: #6a7985 !important;
          color: @text-color-inverse !important;
        }
        span:last-child {
          word-break: keep-all;
          white-space: nowrap;
          margin-left: 10px;
        }
      }
    }
  }
  .rank-item {
    word-break: break-all;
    word-wrap: break-word;
    white-space: break-spaces;
  }
</style>
