<template>
  <div class="footer">
    <div class="links">
      <a
        target="_blank"
        :key="index"
        :href="item.link ? item.link : 'javascript: void(0)'"
        v-for="(item, index) in linkList"
      >
        <GithubOutlined v-if="item.icon == 'GithubOutlined'" />
        <b v-if="item.name">{{ item.name }}</b>
      </a>
    </div>
    <div class="copyright">
      Copyright <CopyrightOutlined /> {{ copyright }}
    </div>
  </div>
</template>

<script>
import { CopyrightOutlined, GithubOutlined } from "@ant-design/icons-vue";
export default {
  name: "PageFooter",
  components: { CopyrightOutlined, GithubOutlined },
  props: ["copyright", "linkList"],
};
</script>

<style lang="less" scoped>
  .footer {
    padding: 48px 16px 24px;
    text-align: center;
    .copyright {
      color: #00adef;
      font-size: 14px;
      i {
        margin: 0 4px;
      }
    }
    .links {
      margin-bottom: 8px;
      a:not(:last-child) {
        margin-right: 40px;
      }
      a {
        color: #00adef;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
      }
    }
  }
</style>
