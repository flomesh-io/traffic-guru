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
      <a-button
        v-if="!isReadonly"
        @click="getDefaultPjsConfig(fileKey)"
      >
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
        :tab="file"
        v-for="file in files"
      >
        <JsonEditor
          v-if="content[file].type == 'json'"
          :is-readonly="isReadonly"
          :id="file"
          :is-json="true"
          v-model:value="content[file].value"
        />
        <JsEditor
          v-else-if="content[file].type == 'js'"
          :is-readonly="isReadonly"
          :id="file"
          :is-json="true"
          v-model:value="content[file].value"
        />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import JsEditor from "@/components/editor/JsEditor";
import JsonEditor from "@/components/editor/JsonEditor";
import { LinkOutlined } from "@ant-design/icons-vue";
export default {
  name: "PipyFileListCard",
  i18n: require("@/i18n"),
  components: {
    JsonEditor,
    JsEditor,
    LinkOutlined,
  },

  props: ["registry", "namespace", "serviceName", "isReadonly"],
  data() {
    return {
      visible: false,
      content: {},
      files: [],
      isEdit: false,
      loading: true,
      fileKey: "",
    };
  },

  computed: {},
  created() {},
  mounted() {
    this.loading = true;
    this.$gql.mutation(`getSideCarFiles(input: $input)`,{input:{
      registry: this.registry,
      namespace: this.namespace,
      serviceName: this.serviceName,
    }},{
      input: "getSideCarFilesInput"
    }).then((res) => {
      if (res.baseFiles) {
        this.files = res.baseFiles;
        this.files.forEach((fileName) => {
          if (!this.fileKey) {
            this.fileKey = fileName;
          }
          let nameAry = fileName.split(".");
          this.content[fileName] = {
            type: nameAry[nameAry.length - 1],
            value: ``,
          };
          this.getDefaultPjsConfig(fileName);
        });
      }
      this.loading = false;
    });
  },

  methods: {
    onTabChange(key) {
      console.log(key);
    },

    getDefaultPjsConfig(fileName) {
      this.$gql
        .mutation(`getSideCarFileContent(input: $input)`,{
          input: {
            registry: this.registry,
            namespace: this.namespace,
            serviceName: this.serviceName,
            fileName,
          }
        }, {
          input: "getSideCarFileContentInput"
        })
        .then((res) => {
          if (this.content[fileName].type == "json") {
            this.content[fileName].value = JSON.stringify(res.data);
          } else {
            this.content[fileName].value = res.data;
          }
          console.log(res);
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
