<template>
  <div>
    <monacoeditor
      :id="id || 'JsEditor'"
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
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";

export default {
  name: "JsEditor",
  components: { monacoeditor },
  props: ["value", "height", "isReadonly", "id"],
  data() {
    return {
      code: "",
      cmOptions: {
        lineNumbers: true,
        mode: "javascript",
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
        this.code = this.value;
      }
    },
  },
};
</script>
