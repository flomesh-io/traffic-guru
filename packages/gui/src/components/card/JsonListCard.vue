<template>
  <a-card
    :loading="loading"
    class="card"
    :bordered="false"
  >
    <template #title>
      <LinkOutlined /> [pipy repo]: {{ path }}
    </template>
    <template #extra>
      <a-button @click="getDefaultPjsConfig(fileKey)">
        {{
          $t("reset")
        }}
      </a-button>
    </template>
    <a-tabs
      v-model:activeKey="fileKey"
      tab-position="left"
    >
      <a-tab-pane
        :key="file"
        :tab="file + '.json'"
        v-for="file in files"
      >
        <JsonEditor
          :id="file + '.json'"
          :is-j-s-o-n="true"
          v-model:value="content[file]"
        />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import JsonEditor from "@/components/editor/JsonEditor";
import { LinkOutlined } from "@ant-design/icons-vue";
export default {
  name: "JsonListCard",
  i18n: require("@/i18n"),
  components: {
    JsonEditor,
    LinkOutlined,
  },

  props: ["files", "path"],
  data() {
    return {
      visible: false,
      content: {},
      isEdit: false,
      loading: true,
      fileKey: "",
    };
  },

  computed: {},
  created() {},
  mounted() {
    this.fileKey = this.files[0];
    this.files.forEach((fileName) => {
      this.content[fileName] = ``;
      this.getDefaultPjsConfig(fileName);
    });
    this.loading = false;
  },

  methods: {
    onTabChange(key) {
      console.log(key);
    },

    getDefaultPjsConfig(name) {
      fetch(`scripts/ingress/config/${name}.json`)
        .then((res) => {
          return res.text();
        })
        .then((text) => {
          this.content[name] = text;
          console.log(text);
        })
        .catch((e) => {
          console.log(e.message);
        });
    },
  },
};
</script>

<style lang="less" scoped>
  .card {
    background-color: #fdfdfd;
  }
</style>
