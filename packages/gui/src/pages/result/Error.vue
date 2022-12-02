<template>
  <a-card
    class="result-error"
    :bordered="false"
  >
    <Result
      class="result-error-content"
      :is-success="false"
      :title="$t('Submit failed')"
      :description="
        $t(
          'Please check and modify the following information before resubmitting',
        )
      "
    >
      <template #action>
        <a-button type="primary">
          {{ $t("Return to modify") }}
        </a-button>
      </template>
      <div>
        <div class="div-msg">
          {{ $t("The content you submitted has the following errors") }}：
        </div>
        <div class="mb-16">
          <CloseCircleOutlined class="error-icon" />
          {{ $t("Your account has been frozen") }}
          <a
            class="ml-16"
          >{{ $t("Thaw immediately") }} <RightOutlined
            type="right"
          /></a>
        </div>
        <div>
          <CloseCircleOutlined class="error-icon" />
          {{ $t("Your account is not qualified yet") }}
          <a
            class="ml-16"
          >{{ $t("Upgrade now") }} <RightOutlined
            type="right"
          /></a>
        </div>
      </div>
    </Result>
  </a-card>
</template>

<script>
import { RightOutlined, CloseCircleOutlined } from "@ant-design/icons-vue";
import Result from "@/components/result/Result";
export default {
  name: "Error",
  components: { Result, RightOutlined, CloseCircleOutlined },
  data() {
    return {};
  },
};
</script>

<style scoped lang="less">
  .result-error {
    .error-icon {
      color: @red-6;
      margin-right: 8px;
    }
  }
  .div-msg {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .result-error-content {
    margin-bottom: 16px;
    margin-top: 48px;
  }
</style>
