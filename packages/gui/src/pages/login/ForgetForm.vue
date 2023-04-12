<template>
  <div class="forget-form login">
    <a-form
      :model="formState"
      :wrapper-col="{ span: 24 }"
      @finish="handleFinish"
      @finishFailed="handleFinishFailed"
      :rules="getRules"
      ref="form"
    >
      <a-alert
        type="error"
        :closable="true"
        v-show="error"
        :message="error"
        show-icon
        class="mb-24"
      />
			
      <FormItem
        class="mb-20"
        name="name"
        v-if="!userName"
        :rules="rules.name"
      >
        <MdInput
          icon="email"
          size="large"
          auto-complete="new-password"
          v-model:value="formState.name"
          :placeholder="$t('Please input your email')"
          @pressEnter="passwordfocus"
        >
          {{ $t("Email") }}
        </MdInput>
      </FormItem>
      <SnsCode
        class="mb-20"
        ref="snscode"
        v-model:value="formState.snscode"
        @validate="validate"
        :username="formState.name"
      />
      <FormItem
        class="mb-20"
        name="password"
        :rules="rules.password"
        v-if="isPass"
      >
        <MdInput
          type="password"
          icon="password"
          ref="password"
          auto-complete="new-password"
          size="large"
          v-model:value="formState.currentPassword"
          name="title"
          @pressEnter="passwordfocus"
          :placeholder="$t('Please input password')"
        >
          {{ $t("Old Password") }}
        </MdInput>
      </FormItem>
      <FormItem
        class="mb-20"
        name="password"
        :rules="rules.password"
      >
        <MdInput
          type="password"
          icon="password"
          ref="password"
          auto-complete="new-password"
          size="large"
          v-model:value="formState.password"
          name="title"
          @pressEnter="snsfocus"
          :placeholder="$t('Please input new password')"
        >
          {{ $t("New Password") }}
        </MdInput>
      </FormItem>
      <div v-if="!nofoot">
        <a @click="fire"><ArrowLeftOutlined /> {{ $t("Back Login") }}</a>
      </div>
      <a-form-item v-if="!nofoot">
        <a-button
          @click="validate"
          :loading="logging"
          class="login-btn primary"
          size="large"
          type="dashed"
          ghost
        >
          {{ $t("Reset") }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { forget } from "@/services/user";
import { mapMutations } from "vuex";
import MdInput from "@/components/MDinput/MDinput";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import SnsCode from "./SnsCode";
import { mapState } from "vuex";
import FormItem from "@/components/tool/FormItem";

export default {
  name: "ForgetForm",
  components: { SnsCode, MdInput, ArrowLeftOutlined, FormItem },
  i18n: require("./i18n"),
  inject: ["last"],
  props: ["nofoot", "userName"],
  data() {
    return {
      snsloading: false,
      snsstatus: "free",
      snsnum: 0,
      hover: false,
      logging: false,
      error: "",
      activeKey: "1",
      user: "",
      password: "",
      formState: {
        snscode: "",
        name: "",
        password: "",
        automatic: true,
        currentPassword: ""
      },

      isPass: process.env.VUE_APP_LOGIN_CODE == "pass"
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },

  mounted() {
    this.formState.name = this.userName;
  },

  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    fire() {
      if (this.last) {
        this.last();
      }
    },

    handleFinish(call) {
      this.logging = true;
      const name = this.formState.name;
      const password = this.formState.password;
      const currentPassword = this.formState.currentPassword;
      forget(name, password, this.formState.snscode,currentPassword).then((res) => {
        this.afterLogin(res);
        if (call) {
          call(res);
        }
      });
    },

    passwordfocus() {
      this.$refs.password.getfocus();
    },

    snsfocus() {
      this.$refs.snscode.getfocus();
    },

    handleFinishFailed() {},
    validate(call) {
      this.$refs.form
        .validateFields()
        .then(() => {
          this.handleFinish(call);
        })
        .catch(() => {});
    },

    afterLogin(res) {
      this.logging = false;
      if (res) {
        this.$message.success(
          this.formState.name + ", " + this.$t("Modified successfully"),
          3,
        );
        this.fire();
      } else {
        this.$message.error(
          this.formState.name + ", " + this.$t("Please check email"),
          3,
        );
        this.error = res;
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .login-btn {
    width: 100%;
    margin-top: 10px;
  }
  .common-layout {
    .login {
      width: 350px;
      margin: 0 auto;
      @media screen and (max-width: 768px) {
        width: 84%;
        margin-top: 60px;
      }
      @media screen and (max-width: 320px) {
        .captcha-button {
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
  :deep(.material-input__component .material-input) {
    border-bottom: 1px dashed #bbb;
  }
  .success-btn {
    color: #23b899;
    border-color: #23b899;
  }
  .forget-form {
    z-index: 1;
    position: relative;
  }
</style>
