<template>
  <div
    :id="id"
    :style="height ? 'height:' + height : 'height: 500px;'"
  />
</template>

<script>
import { watch, onMounted, reactive } from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/editor/contrib/find/findController.js";

export default {
  name: "Monacoeditor",
  props: ["content", "option", "height", "isReadonly", "id", "theme"],
  setup(props, ctx) {
    let inst = null;
    let code = reactive({ val: props.content });
    watch(
      () => props.content,
      (newN, oldN) => {
        if (newN != oldN && newN != code.val) {
          code.val = newN;
          if(inst){
            inst.setValue(newN);
          }
        }
      },
    );
    onMounted(() => {
      setTimeout(()=>{
        inst = monaco.editor.create(document.getElementById(props.id), {
          value: props.content,
          theme: props.theme || "vs-dark",
          language: props.option.mode,
          readOnly: props.isReadonly,
        });
        inst.onDidChangeModelContent(() => {
          const newValue = inst.getValue();
          code.val = newValue;
          ctx.emit("change", newValue);
        });
      },10)
    });
  },
};
</script>
