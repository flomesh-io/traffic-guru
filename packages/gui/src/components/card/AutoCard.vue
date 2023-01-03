<template>
  <a-card
    :class="
      data.className +
        (n == 'system.common.Space' ? ' toggle-card' : ' shadow-card') +
        (isEdit ? ' opacity-7' : '')
    "
    :loading="data.loading"
  >
    <template
      #title
      v-if="!data.noTitle"
    >
      <div class="handle move">
        {{ getTitle }}
      </div>
    </template>
    <template
      v-if="data.cardToolLayout == 'slot'"
      #extra
    >
      <div class="relative toggle-card-item">
        <a-divider type="vertical" />
        <CaretRightOutlined
          @click="toggleRuntime"
          v-if="!data.runtime"
          class="font-20 gray handle icon-menu-sm relative"
        />
        <LoadingOutlined
          @click="toggleRuntime"
          v-else
          class="font-primary icon-menu-sm"
        />
        <CloseOutlined
          v-if="isEdit"
          @click="unpin"
          class="gray handle icon-menu-sm relative"
          style="right: -10px"
        />
      </div>
    </template>
    <span
      v-if="data.cardToolLayout == 'absolute'"
      class="card-span toggle-card-item"
    >
      <a-divider type="vertical" />
      <CaretRightOutlined
        @click="toggleRuntime"
        v-if="!data.runtime"
        class="font-20 gray handle icon-menu-sm relative"
      />
      <LoadingOutlined
        @click="toggleRuntime"
        v-else
        class="font-primary icon-menu-sm"
      />
      <CloseOutlined
        v-if="isEdit"
        @click="unpin"
        class="gray handle icon-menu-sm relative"
        style="right: -10px"
      />
    </span>
    <component
      v-if="n != 'system.common.Space' && data.resData"
      :is="data.tag"
      v-bind="{
        ...data.resData,
        pid,
        did,
        params,
        where,
        filters,
        apply,
        kind,
        loading: data.loading,
      }"
    />
    <div
      v-if="n == 'system.common.Space'"
      class="full height-30"
    />
    <div
      v-else-if="data.loading"
      class="full"
      style="height: 240px"
    />
    <div
      class="provide"
      :class="data.config?.provide"
      v-if="data.config?.provide"
    >
      {{ data.config.provide }}
    </div>
  </a-card>
</template>

<script>
import subscribe from "@/subscribe/index";
import {
  SwapOutlined,
  CloseOutlined,
  CaretRightOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";
import { getCurrentInstance, computed, shallowReactive, watch } from "vue";
import { clickhouseResult2Array } from "@/utils/util";
import { setDashboard } from "@/services/dashboard";
import { customQuery } from "@/services/prometheus";

export default {
  name: "AutoCard",

  components: {
    SwapOutlined,
    CloseOutlined,
    setDashboard,
    CaretRightOutlined,
    LoadingOutlined,
  },
	
  props: [
    "subscribes",
    "n",
    "pid",
    "params",
    "where",
    "filters",
    "did",
    "isEdit",
    "apply",
    "kind",
    "ver",
    "config",
  ],

  emits: ['subscribeChange'],
	
  i18n: require("@/i18n"),

  setup(props, ctx) {
    const { proxy } = getCurrentInstance();
    const data = shallowReactive({
      ary: [],
      runtime: false,
      noTitle: false,
      className: "",
      name: null,
      cardToolLayout: "slot",
      title: "",
      tag: null,
      config: {},
      resData: null,
      source: null,
      loading: true,
    });
    const getTitle = computed(() => proxy.$t(data.noTitle ? "" : data.title));
    let subscribes = computed(() => props.subscribes);
    const ver = computed(() => props.ver);
    const config = computed(() => props.config);
    watch(
      () => props.n,
      () => {
        renderCard();
      },
    );
    watch(
      () => props.where,
      () => {
        renderCard();
      },
    );
    watch(
      () => props.ver,
      () => {
        renderCard();
      },
    );

    let toggleRuntime = () => {
      data.runtime = !data.runtime;
      if (data.runtime) {
        renderCardTimer();
      }
    };
    let renderCardTimer = () => {
      if (data.ary[0] == "custom") {
        reqCustomService();
      } else {
        reqNormalService();
      }
      if (data.runtime) {
        setTimeout(() => {
          renderCardTimer();
        }, data.config?.timer || 3000);
      }
    };
    let getSubscribe = (obj, index) => {
      if (data.ary.length > index) {
        return getSubscribe(obj[data.ary[index]], ++index);
      } else {
        return obj;
      }
    };
    let subscribeChange = (d) => {
      ctx.emit("subscribeChange", d);
    };

    let unpin = () => {
      if (typeof window !== "undefined") {
        // this.subscribes = (localStorage.getItem('subscribes') || '').split(',');
        subscribes.value.forEach((subscribe, i) => {
          if (subscribe == props.n) {
            subscribes.value.splice(i, 1);
          }
        });
        setDashboard(props.did, { subscribes: subscribes.value }).then(
          () => {
            if (proxy.$t) {
              proxy.$message.success(proxy.$t("Removed successfully"), 3);
            }
            ctx.emit("subscribeChange", subscribes.value);
          },
        );
      }
    };
    let serviceNormalCallback = (res, callback) => {
      ctx.emit("resp", {type:'normal',data:res});
      data.loading = false;
      data.resData = callback ? callback(res) : null;
      if (!data.tag) {
        data.tag = data.config.tag;
      }
      setTimeout(() => {
        if (ver.value && ver.value && data.resData) {
          // data.resData.ver = ver.value;
        }
        // triggerRef(data);
        // nextTick();
      }, 10);
    };
    let serviceCustomCallback = (res, callback) => {
      ctx.emit("resp", {type:'custom',data:res});
      data.loading = false;
      data.resData = callback ? callback(res) : null;
      data.tag = subscribe.baseComponents[data.config.tag.name].component;
      setTimeout(() => {
        if (ver.value && ver.value && data.resData) {
          // data.resData.ver = ver.value;
        }
      }, 10);
    };
    let renderCardByNormal = () => {
      data.title = data.config.title;
      data.noTitle = data.config.noTitle;

      data.className = data.config.className ? data.config.className : "";
      data.cardToolLayout = data.config.cardToolLayout
        ? data.config.cardToolLayout
        : "slot";
      data.loading = true;
      reqNormalService();
    };
    let reqNormalService = () => {
      const callback = data.config.data;
      if (data.config.service) {
        data.config
          .service({
            ...props.params,
            pid: props.pid,
            where: props.where,
            filters: props.filters,
            apply: props.apply,
            kind: props.kind,
          })
          .then((res) => {
            serviceNormalCallback(res, callback);
          })
          .catch(error => {
            proxy.$message.error(error.toString(), 3);
            ctx.emit("resp", {type:'normal',error:error.toString()});
          });
      } else {
        serviceNormalCallback(null, callback);
        ctx.emit("resp", {type:'normal',data:{}});
      }
    };
    let renderCardByCustom = () => {
      if (!data.config) {
        return;
      }
      data.title = data.config.title;
      data.noTitle = data.config.noTitle;
      data.className = data.config.className ? data.config.className : "";
      data.cardToolLayout = data.config.cardToolLayout
        ? data.config.cardToolLayout
        : "slot";
      data.loading = true;
      reqCustomService();
    };
    let reqCustomService = () => {
      const callback = eval(data.config.data);
      let _service = data.config.service;
      if (_service && (
        ( _service.type == "clickhouse" && !!_service.clickhouseSQL) || 
        ( _service.type == "prometheus" && !!_service.prometheusSQL) || 
        ( _service.type == "rest" && !!_service.path)
      )) {
        if (_service.type == "clickhouse") {
          proxy
            .$request(
              proxy.$REST.CLICKHOUSE.QUERY(_service.clickhouseSQL),
              proxy.$METHOD.GET,
            )
            .then((res) => {
              serviceCustomCallback(
                clickhouseResult2Array(res.data),
                callback,
              );
            })
            .catch(error => {
              proxy.$message.error(error.toString(), 3);
              ctx.emit("resp", {type:'custom',error:error.toString()});
            });
        } else if (_service.type == "prometheus") {
          customQuery(_service.prometheusSQL,true)({
            ...props.params,
            pid: props.pid,
            where: props.where,
            filters: props.filters,
            apply: props.apply,
            kind: props.kind,
          })
            .then((res) => {
              serviceCustomCallback(res.data, callback);
            })
            .catch(error => {
              proxy.$message.error(error.toString(), 3);
              ctx.emit("resp", {type:'custom',error:error.toString()});
            });
        } else {
          proxy
            .$request(
              "http://" + _service.path,
              proxy.$METHOD[_service.method],
              JSON.parse(_service.payload),
            )
            .then((res) => {
              serviceCustomCallback(res, callback);
            })
            .catch(error => {
              proxy.$message.error(error.toString(), 3);
              ctx.emit("resp", {type:'custom',error:error.toString()});
            });
        }
      } else {
        serviceCustomCallback(null, callback);
        ctx.emit("resp", {type:'custom',data:{}});
      }
    };
    let renderCard = () => {
      data.ary = props.n.split(".");
      if (data.ary[0] == "custom") {
        data.config = config.value;
        renderCardByCustom();
      } else {
        data.config = getSubscribe(subscribe, 0);
        renderCardByNormal();
      }
    };
    renderCard();
    return {
      data,
      getTitle,
      getSubscribe,
      subscribeChange,
      toggleRuntime,
      unpin,
      renderCardByNormal,
      renderCardByCustom,
      renderCard,
    };
  },
};
</script>

<style lang="less" scoped>
  .toggle-card {
    cursor: pointer;
    transition: all 0.3s;
    opacity: 0;
  }
  .toggle-card:hover {
    opacity: 0.3;
  }
  .shadow-card {
    transition: all 0.3s;
  }
  .shadow-card:hover {
    filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.05));
  }
  .provide {
    font-size: 8px;
    line-height: 14px;
    padding: 0 4px 0 2px;
    background-color: rgba(160, 160, 160, 0.1);
    color: #999;
    position: absolute;
    right: 0;
    bottom: 0;
    font-weight: bold;
    text-transform: uppercase;
    font-style: italic;
  }
  .provide::before {
    height: 0;
    width: 0;
    content: "";
    border-style: solid;
    position: absolute;
    margin-left: -8px;
    margin-top: 0px;
    border-width: 7px 3px;
    border-color: transparent rgba(160, 160, 160, 0.1) rgba(160, 160, 160, 0.1)
      transparent;
  }
</style>
