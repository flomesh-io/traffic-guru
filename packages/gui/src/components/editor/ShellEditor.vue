<template>
  <div>
    <monacoeditor
      id="ShellEditor"
      v-model:content="code"
      :option="cmOptions"
      @change="change"
      :height="height"
      :theme="theme"
      :is-readonly="isReadonly"
    />
  </div>
</template>

<script>
import monacoeditor from "./monacoeditor";
import "monaco-editor/esm/vs/basic-languages/shell/shell.contribution.js";

export default {
  name: "JsEditor",
  components: { monacoeditor },
  props: ["value", "height", "isReadonly", "theme"],
  data() {
    return {
      code: "",
      cmOptions: {
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        matchBrackets: true,
        mode: "shell",
        readOnly: false,
        lint: true,
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
      this.code = this.value
        .replace(/"/g, "")
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "	");
    },
  },
};
</script>
