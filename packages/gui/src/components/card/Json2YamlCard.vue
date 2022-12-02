<template>
  <a-card
    class="card nopd"
    :class="isPop ? 'isPop' : ''"
    :tab-list="configTab"
    :active-tab-key="configKey"
    @tabChange="(key) => onTabChange(key, 'configKey')"
    :bordered="false"
  >
    <YamlEditor
      :height="height"
      :is-readonly="isReadonly"
      v-if="configKey == 'YAML'"
      v-model:value="yaml"
    />
    <JsonEditor
      :height="height"
      :is-readonly="isReadonly"
      v-if="configKey == 'JSON'"
      :is-j-s-o-n="true"
      :noreset="!isReadonly"
      v-model:value="json"
    />
    <template #tabBarExtraContent>
      <a-button
        type="dashed"
        v-if="url"
        @click="getDefaultYamlConfig"
      >
        {{
          $t("reset")
        }}
      </a-button>
    </template>
  </a-card>
</template>

<script>
import JsonEditor from "@/components/editor/JsonEditor";
import YamlEditor from "@/components/editor/YamlEditor";
let YAMLTool = require("json2yaml");
let YAML = require("js-yaml");
export default {
  name: "Json2YamlCard",
  components: { JsonEditor, YamlEditor },
  props: ["jsonVal", "isCreate", "height", "isReadonly", "url", "isPop"],
  i18n: require("@/i18n"),
  data() {
    return {
      configTab: [
        {
          key: "YAML",
          tab: "YAML",
        },
        {
          key: "JSON",
          tab: "JSON",
        },
      ],

      configKey: "YAML",
      json: "{}",
      yaml: "",
    };
  },

  watch: {
    json(val, oldVal) {
      if (val != oldVal) {
        this.jsonInput(val);
      }
    },

    yaml(val, oldVal) {
      if (val != oldVal) {
        this.yamlInput(val);
      }
    },

    jsonVal: {
      handler(val, oldVal) {
        console.log(val);
        if (val == "{}" || val == "") {
          val = `{"key":"value"}`;
        } else if (val == "[]") {
          // val = `[""]`;
        }
        if (val != oldVal) {
          let _val = JSON.parse(val);
          if (typeof _val == "object") {
            this.json = val;
          }
          // this.yaml = this.json ? YAMLTool.stringify(JSON.parse(this.json)) : '';
        }
      },

      immediate: true,
    },
  },

  created() {},
  mounted() {
    this.init();
  },

  methods: {
    onTabChange(key, type) {
      this[type] = key;
    },

    jsonInput(json) {
      try {
        let _json = JSON.parse(json);
        if (typeof _json == "object") {
          this.yaml = this.convertToYaml(json);
          this.$emit("update:jsonVal", this.json);
          this.$emit("change", this.json);
        }
      } catch (e) {}
    },

    yamlInput(yaml) {
      // this.yaml = yaml;
      let _yaml = YAML.load(yaml);
      let json = JSON.stringify(_yaml, null, "  ");
      let _json = JSON.parse(json);
      if (typeof _json == "object") {
        this.$emit("update:jsonVal", json);
        this.$emit("change", json);
      }
    },

    getDefaultYamlConfig() {
      if (!this.url) {
        this.yaml = this.convertToYaml(this.jsonVal);
        this.yamlInput(this.yaml);
        return;
      }
      fetch(this.url)
        .then((res) => {
          return res.text();
        })
        .then((text) => {
          if (this.url.indexOf(".yaml") >= 0) {
            //TODO
          }
          // this.yaml = text;
          let _yaml = YAML.load(text);

          let _json = JSON.stringify(_yaml, null, "  ");
          let json_obj = JSON.parse(_json);
          if (json_obj.spec && json_obj.spec.namespace) {
            json_obj.spec.namespace =
              localStorage.getItem("NAMESPACE") == "_all"
                ? "default"
                : localStorage.getItem("NAMESPACE");
          }
          let __json = JSON.stringify(json_obj);
          this.yaml = this.convertToYaml(__json);
          setTimeout(() => {
            this.yamlInput(this.yaml);
          }, 2000);
        })
        .catch(() => {
        });
    },

    convertToYaml(json) {
      if (json == "") {
        return "";
      }
      let _json = JSON.parse(json);
      let _yaml = null;
      //YAML.dump
      _yaml = YAMLTool.stringify(_json);

      return _yaml;
    },

    init() {
      if (this.isCreate) {
        this.getDefaultYamlConfig();
      } else {
        this.yaml = this.convertToYaml(this.jsonVal);
        this.yamlInput(this.yaml);
      }
    },
  },
};
</script>
