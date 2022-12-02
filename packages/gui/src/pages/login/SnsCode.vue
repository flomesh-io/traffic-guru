<template>
  <div class="flex">
    <div class="flex-item">
      <MdInput
        icon="safty"
        size="large"
        ref="snscode"
        auto-complete="new-password"
        v-model:value="code"
        @write="valueChange"
        :placeholder="$t('Please input snscode')"
        @pressEnter="validate"
      >
        {{ $t("Snscode") }}
      </MdInput>
    </div>
    <div class="pl-25">
      <a-button
        :loading="snsloading"
        @click="snssend"
        @mouseover="snshover"
        :disabled="!username"
        :type="snsstatus == 'ok' ? 'dashed' : 'primary'"
        :class="snsstatus == 'ok' ? 'success-btn' : ''"
        shape="circle"
        class="border-round"
      >
        <template #icon>
          <SendOutlined
            v-if="snsstatus == 'free'"
            class="login-send"
          />
          <CheckOutlined v-if="snsstatus == 'ok'" />
          <span v-if="snsstatus == 'retry' && snsnum > 0">{{ snsnum }}s</span>
          <RedoOutlined
            v-if="snsstatus == 'retry' && snsnum == 0"
            class="RedoOutlined"
          />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script>
import { verificationCode } from "@/services/user";
import MdInput from "@/components/MDinput/MDinput";
import {
  SendOutlined,
  CheckOutlined,
  RedoOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "LoginForm",
  components: {
    MdInput,
    SendOutlined,
    CheckOutlined,
    RedoOutlined,
  },

  props: ["value", "username"],
  i18n: require("./i18n"),
  data() {
    return {
      code: '',
      snsloading: false,
      snsstatus: "free",
      snsnum: 0,
    };
  },

  mounted() {
    this.code = this.value;
  },
	
  methods: {
    validate() {
      this.$emit("validate", v);
    },

    valueChange(v) {
      this.$emit("update:value", v);
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
        verificationCode(this.username, this.$t);
        this.snsnum = 8;
        this.countdown();
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
  .success-btn {
    color: #23b899;
    border-color: #23b899;
  }
  .login-send {
    position: relative;
    top: -1px;
    left: 1px;
    transform: rotate(-45deg);
  }
  .RedoOutlined {
    position: relative;
    top: -1px;
  }
</style>
