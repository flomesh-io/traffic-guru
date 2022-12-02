<template>
  <CommonLayout>
    <div class="login-warpper">
      <div class="top">
        <div class="header">
          <div class="logo-mask" />
          <img
            class="logo-back"
            src="@/assets/img/flomesh-short.png"
          >
          <img
            alt="logo"
            class="logo"
            src="@/assets/img/logo1.png"
          >
          <a-tag
            class="logo-tag"
            color="#00adef"
          >
            {{ version }}
          </a-tag>
        </div>
      </div>
      <PageToggleTransition
        :direction="direction < 0 ? 'left' : 'right'"
        animate="bounce"
      >
        <div
          key="reg"
          v-if="step == -1"
        >
          <RegForm />
        </div>
        <div
          key="forget"
          v-else-if="step == 1"
        >
          <ForgetForm />
        </div>
        <div
          key="login"
          v-else
        >
          <LoginForm />
        </div>
      </PageToggleTransition>
    </div>
  </CommonLayout>
</template>

<script>
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import CommonLayout from "@/layouts/CommonLayout";
import LoginForm from "./LoginForm";
import ForgetForm from "./ForgetForm";
import RegForm from "./RegForm";

export default {
  name: "Login",
  components: {
    CommonLayout,
    LoginForm,
    ForgetForm,
    RegForm,
    PageToggleTransition,
  },

  i18n: require("./i18n"),
  provide() {
    return {
      next: this.next,
      last: this.last,
    };
  },

  data() {
    return {
      step: 0,
      direction: 0,
      version: process.env.VUE_APP_VERSION,
    };
  },

  methods: {
    next() {
      this.direction = 1;
      this.step += this.direction;
    },

    last() {
      this.direction = -1;
      this.step += this.direction;
    },
  },
};
</script>

<style lang="less" scoped>
  @keyframes logorotate {
    0% {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
    10% {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
    50% {
      transform: rotate(200deg) scale(1.7);
      opacity: 0;
    }
    100% {
      transform: rotate(360deg) scale(1);
      opacity: 1;
    }
  }
  .common-layout {
    :deep(.content) {
      @media (min-width: 768px) {
        // padding-top: 4% !important;
      }
    }
    .top {
      z-index: 1;
      position: relative;
      top: 0px;
      text-align: center;

      @media screen and (max-width: 768px) {
        top: 55px;
      }
      .header {
        height: 100px;
        line-height: 100px;
        text-align: center;
        position: relative;
        a {
          text-decoration: none;
        }
        .logo {
          height: 65px;
          vertical-align: top;
          // background-color: #fefefe;
          position: relative;
          z-index: 3;
          pointer-events: none;
        }
        .logo-mask {
          background-color: #fefefe;
          width: 100px;
          height: 22px;
          z-index: 2;
          left: 50%;
          margin-left: -50px;
          margin-top: 27px;
          position: absolute;
          vertical-align: top;
          pointer-events: none;
        }
        .logo-back {
          height: 65px;
          vertical-align: top;
          z-index: 1;
          margin-left: 30px;
          position: absolute;
          pointer-events: none;
          animation: logorotate 7s infinite;
        }
        .title {
          font-size: 33px;
          color: @title-color;
          font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
            sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
  }
  .logo-tag {
    position: absolute;
    top: 0px;
    margin-left: 60px;
    text-transform: capitalize;
    line-height: 18px;
    opacity: 0.9;
  }
  .login-warpper {
    margin: 3% auto auto auto;
    position: relative;
  }
</style>
