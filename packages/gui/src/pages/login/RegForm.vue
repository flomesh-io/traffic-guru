<template>
  <div class="login reg-form">
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
        :rules="rules.name"
      >
        <MdInput
          icon="user"
          size="large"
          v-model:value="formState.name"
          :placeholder="$t('Please input user name')"
          @pressEnter="passwordfocus"
        >
          {{ $t("User") }}
        </MdInput>
      </FormItem>
      <FormItem
        class="mb-20"
        name="name"
        :rules="rules.email"
      >
        <MdInput
          icon="email"
          size="large"
          v-model:value="formState.email"
          :placeholder="$t('Please input email')"
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
          :placeholder="$t('Please input password')"
        >
          {{ $t("Password") }}
        </MdInput>
      </FormItem>
      <div
        v-if="false"
        class="font-right"
      >
        <a @click="gologin">{{ $t("Go Login") }} <ArrowRightOutlined /></a>
      </div>
      <a-form-item v-if="!nofoot">
        <a-button
          :loading="logging"
          class="login-btn primary"
          size="large"
          @click="validate"
          type="dashed"
          ghost
        >
          {{ $t("Register initial user") }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { register, verificationCode, getPermission } from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { mapMutations } from "vuex";
import MdInput from "@/components/MDinput/MDinput";
import {
  ArrowRightOutlined,
} from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { h } from "vue";
import { mapState } from "vuex";
import FormItem from "@/components/tool/FormItem";
import SnsCode from "./SnsCode";

export default {
  name: "RegForm",
  components: {
    MdInput,
    ArrowRightOutlined,
    FormItem,
    SnsCode,
  },

  i18n: require("./i18n"),
  inject: ["next"],
  props: ["nofoot"],
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
        email: "",
        password: "",
        automatic: true,
      },
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },

  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    gologin() {
      this.next();
    },

    handleFinish() {
      this.logging = true;
      const name = this.formState.name;
      const email = this.formState.email;
      const snscode = this.formState.snscode;
      const password = this.formState.password;
      register(name, email, password, snscode)
        .then(this.afterLogin)
        .catch(() => {
          this.logging = false;
          this.$message.error(this.$t("The email already exists"), 3);
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
        this.setUser({
          name: this.formState.name,
          avatar: "@AVATAR",
          address: "@CITY",
          position: "@POSITION",
        });
        setAuthorization(
          {
            token: loginRes.jwt,
            expireAt: new Date(new Date().getTime() + 30 * 60 * 1000),
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
        let _role = null;
        getUserInfo().then((userinfo) => {
          if(userinfo.data.role?.id){
            getPermission({id:userinfo.data.role.id})
              .then((role) => {
                _role = role;
                this.setRoles(role);
                setTimeout(()=>{
                  this.$router.push("/workplace");
                },300);
								
                this.$gql
                  .query(
                    `userOrganizationRoles(pagination:{limit: ${this.$DFT_LIMIT}},filters:{user:{eq:${loginRes.user.id}}}){data{id,attributes{
											type,
											project{data{id,attributes{name}}},
											organization{data{id,attributes{name}}},
											role{data{id,attributes{name}}}
										}}}`,
                  )
                  .then((res3) => {
                    this.setPermissions(res3.data);
                    res3.data.forEach((uor) => {
                      if (uor.role && uor.role.id) {
                        getPermission({id:uor.role.id})
                          .then((role) => {
                            let _temp = [];
                            role.permissions.forEach((_resource) => {
                              _temp.push({
                                ..._resource,
                                type: uor.type,
                                project: uor.project,
                                organization: uor.organization,
                              });
                            });
                            _role.permissions = _role.permissions.concat(_temp);
                            this.setRoles(_role);
                          });
                      }
                    });
                  });
              });
          }
        });
      } else {
        this.error = loginRes.message;
      }
    },

    countdown() {
      this.snsnum--;
      if (this.snsnum > 0) {
        setTimeout(() => {
          this.countdown();
        }, 1000);
      }
    },

    snshover() {
      if (this.snsstatus == "ok") {
        this.snsstatus = "retry";
      }
    },

    snssend() {
      this.snsloading = true;
      setTimeout(() => {
        this.snsloading = false;
        this.snsstatus = "ok";
        verificationCode(this.formState.email, this.$t);
        this.snsnum = 8;
        this.countdown();
      }, 1000);
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
  .send {
    position: relative;
    top: -1px;
    left: 1px;
    transform: rotate(-45deg);
  }
  .reg-form {
    z-index: 1;
    position: relative;
  }
</style>
