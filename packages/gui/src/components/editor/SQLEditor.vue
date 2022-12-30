<template>
  <div>
    <monacoeditor
      :id="id || 'SQLEditor'"
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
import "monaco-editor/esm/vs/basic-languages/sql/sql.contribution";

export default {
  name: "SQLEditor",
  components: { monacoeditor },
  props: ["value", "height", "isReadonly", "id", "theme"],
  data() {
    return {
      code: "",
      cmOptions: {
        lineNumbers: true,
        mode: "sql",
        readOnly: false,
        lint: true,
      },
    };
  },

  watch: {
    value(value, old) {
      if (value !== old) {
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
        this.$emit("change", event);
      }
    },

    setValue() {
      if (this.value.replace != null) {
        this.code = this.value
          .replace(/"/g, "")
          .replace(/\\n/g, "\n")
          .replace(/\\t/g, "	");
      }
    },
  },
};
</script>
