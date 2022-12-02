<template>
  <a-card
    class="result-success"
    :bordered="false"
  >
    <Result
      :is-success="true"
      :description="description"
      :title="title"
    >
      <template #action>
        <a-button
          class="action"
          type="primary"
        >
          {{
            $t("Return to list")
          }}
        </a-button>
        <a-button class="action">
          {{ $t("View items") }}
        </a-button>
        <a-button
          class="action"
          @click="print"
        >
          {{ $t("Print") }}
        </a-button>
      </template>
    </Result>
  </a-card>
</template>

<script>
import Result from "../../components/result/Result";
export default {
  name: "Success",
  components: { Result },
  data() {
    return {
      title: "Submitted successfully",
      description: "",
    };
  },

  methods: {
    print() {
      window.print();
    },
  },
};
</script>

<style scoped lang="less">
  .result-success {
    .action:not(:first-child) {
      margin-left: 8px;
    }
    .project-name {
      font-size: 16px;
      color: @title-color;
      font-weight: 500;
      margin-bottom: 20px;
    }
  }
</style>
