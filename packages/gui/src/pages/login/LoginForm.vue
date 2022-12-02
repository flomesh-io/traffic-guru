<template>
  <div class="login login-form">
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
      <a-form-item name="mobile">
        <MdInput
          icon="email"
          size="large"
          auto-complete="new-password"
          v-model:value="formState.name"
          :placeholder="$t('Please input user or email')"
          @pressEnter="passwordfocus"
        >
          {{ $t("User") }}
        </MdInput>
      </a-form-item>
      <a-form-item name="password">
        <MdInput
          type="password"
          icon="password"
          ref="password"
          @focus="getCookies"
          auto-complete="new-password"
          size="large"
          v-model:value="formState.password"
          name="title"
          @pressEnter="snsfocus"
          :placeholder="$t('Please input password')"
        >
          {{ $t("Password") }}
        </MdInput>
      </a-form-item>
      <a-form-item name="snscode">
        <SnsCode
          ref="snscode"
          v-model:value="formState.snscode"
          @validate="validate"
          :username="formState.name"
        />
      </a-form-item>
      <div class="login-foot">
        <a-switch
          v-model:checked="formState.automatic"
          size="small"
          default-checked
          class="login-switch"
        />
        {{ $t("Trust device") }}
        <a
          @click="forget"
          class="float-right"
        >{{ $t("Forget") }}
          <ArrowRightOutlined />
        </a>
      </div>
      <div>
        <!--
          <a @click="reg"
          ><ArrowLeftOutlined />
          {{ $t('Register') }}
          </a> 
        -->
      </div>
      <a-form-item>
        <a-button
          :loading="logging"
          class="login-btn"
          size="large"
          @click="validate"
          type="primary"
        >
          {{ $t("Login") }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { login } from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { mapMutations } from "vuex";
import MdInput from "@/components/MDinput/MDinput";
import SnsCode from "./SnsCode";
import Cookie from "js-cookie";
import { ArrowRightOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { h } from "vue";
import { loadRoutes } from "@/utils/routerUtil";

export default {
  name: "LoginForm",
  components: {
    SnsCode,
    MdInput,
    ArrowRightOutlined,
  },

  i18n: require("./i18n"),
  inject: ["last", "next"],
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
      },

      rules: {
        name: [
          {
            required: true,
            message: "Please input a user",
            whitespace: true,
            trigger: "blur",
          },
        ],

        password: [
          {
            required: true,
            message: "Please input password",
            whitespace: true,
            trigger: "blur",
          },
        ],
      },
    };
  },

  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },

    getRules() {
      Object.keys(this.rules).map((key) => {
        this.rules[key].map((rule) => {
          rule.message = this.$t(rule.message);
          return rule;
        });
        return key;
      });
      return this.rules;
    },
  },

  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    reg() {
      this.last();
    },

    getCookies() {
      if (this.formState.name) {
        let password = Cookie.get(this.formState.name);
        if (password) {
          this.formState.password = atob(password);
        }
      }
    },

    forget() {
      this.next();
    },

    handleFinish() {
      this.logging = true;
      const name = this.formState.name;
      const password = this.formState.password;
      const snscode = this.formState.snscode;
      login(name, password, snscode)
        .then(this.afterLogin)
        .catch(() => {
          this.logging = false;
          this.$message.error(
            this.$t("The password or verification code is incorrect"),
            3,
          );
        });
    },

    passwordfocus() {
      this.$refs.password.getfocus();
    },

    snsfocus() {
      this.$refs.snscode.getfocus();
    },

    handleFinishFailed() {},
    validate() {
      this.$refs.form
        .validateFields()
        .then(() => {
          this.handleFinish();
        })
        .catch(() => {});
    },

    afterLogin(res) {
      this.logging = false;
      const loginRes = res;
      if (res.errors) {
        return;
      }
      if (loginRes.jwt) {
        if (this.formState.automatic) {
          Cookie.set(this.formState.name, btoa(this.formState.password));
        } else {
          Cookie.remove(this.formState.name);
        }
        this.setUser({
          name: this.formState.name,
          avatar: "@AVATAR",
          address: "@CITY",
          position: "@POSITION",
          ...loginRes.user,
        });
        setAuthorization(
          {
            token: loginRes.jwt,
            expireAt: new Date(new Date().getTime() + 120 * 60 * 1000),
          },
          "basic",
        );

        const usericon = require("@/assets/img/usericon.png");
        notification.open({
          message: this.$t("Login successfully"),
          icon: h("img", {
            src: usericon,
            width: 35,
            height: 35,
            style: "posirion:relative,left:-30px",
          }),
          placement: "bottomRight",
          description: this.formState.name + "，" + this.$t("Welcome back"),
        });
        const roleId = loginRes.user.role ? loginRes.user.role.id : "";
        let _resources = [];
        this.$gql
          .query(
            `getRoleResourcePermission(roleId:${roleId}){resources{name,actions{name,enabled}}}`,
          )
          .then((res2) => {
            _resources = res2.resources;
            this.setRoles(_resources);
            this.$router.push("/workplace");
          });
        this.$gql
          .query(
            `userOrganizationRoles(limit:-1,where:{user:${loginRes.user.id}}){id,type,project{id,name},organization{id,name},role{id,name}}`,
          )
          .then((res3) => {
            this.setPermissions(res3);
            res3.forEach((uor) => {
              if (uor.role && uor.role.id) {
                this.$gql
                  .query(
                    `getRoleResourcePermission(roleId:${uor.role.id}){resources{name,actions{name,enabled}}}`,
                  )
                  .then((res4) => {
                    let _temp = [];
                    res4.resources.forEach((_resource) => {
                      _temp.push({
                        ..._resource,
                        type: uor.type,
                        project: uor.project,
                        organization: uor.organization,
                      });
                    });
                    _resources = _resources.concat(_temp);
                    this.setRoles(_resources);
                  });
              }
            });
          });
        let _append = process.env.VUE_APP_VERSION == "pro" ? ".pro" : "";
        const options = require(`@/router/config${_append}`).default;
        loadRoutes(options);
      } else {
        this.error = loginRes.message;
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
  .login-form {
    z-index: 1;
    position: relative;
  }
  .login-foot {
    position: relative;
    top: -10px;
  }
  .login-switch {
    position: relative;
    top: -2px;
  }
</style>
