<template>
  <div>
    <monacoeditor
      id="YamlEditor"
      v-model:content="code"
      :option="cmOptions"
      @change="change"
      :height="height"
      :is-readonly="isReadonly"
    />
  </div>
</template>

<script>
import monacoeditor from "./monacoeditor";
import "monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution.js";

export default {
  name: "YamlEditor",
  components: { monacoeditor },
  props: ["value", "height", "isReadonly"],
  data() {
    return {
      code: "",
      cmOptions: {
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        readOnly: false,
        lineWrapping: true,
        mode: "yaml",
        foldGutter: true,
        smartInder: false,
        lint: false,
        matchBrackets: false,
      },
    };
  },

  watch: {
    value(value) {
      if (value !== this.code) {
        this.setValue();
      }
    },
  },

  mounted() {
    this.setValue();
  },

  methods: {
    change(event) {
      if (typeof event == "string") {
        this.$emit("update:value", event);
      }
    },

    setValue() {
      this.code = this.value;
    },
  },
};
</script>
