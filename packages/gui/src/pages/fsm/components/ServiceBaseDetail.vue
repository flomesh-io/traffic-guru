<template>
  <PageLayout
    :title="$t('Service')"
    :form-state="detail"
    ref="layout"
  >
    <template #headerContent>
      <DetailList
        size="small"
        :col="1"
      >
        <DetailListItem
          v-if="pid != ''"
          :term="$t('UID')"
        >
          {{
            detail.metadata.uid
          }}
        </DetailListItem>
        <DetailListItem
          v-if="pid != ''"
          :term="$t('as')"
        >
          {{ detail.metadata.name }}
        </DetailListItem>
        <DetailListItem
          v-else
          :term="$t('as')"
          :rules="rules.uniqueName('services',{ns,id:pid})"
          :name="['metadata', 'name']"
        >
          <a-input
            :placeholder="$t('unset')"
            v-model:value="detail.metadata.name"
            class="bold width-300"
          />
        </DetailListItem>
        <DetailListItem
          v-if="pid == ''"
          :term="$t('Registry') + ' / ' + $t('Namespace')"
        >
          <EnvSelector
            :no-all="true"
            :is-filter="true"
            @envChange="envChange"
          />
        </DetailListItem>
        <DetailListItem
          v-if="pid != ''"
          :term="$t('Registry Center')"
        >
          <a-tag
            class="click-icon"
            @click="k8sDetail"
            :closable="false"
          >
            {{
              registry.name
            }}
          </a-tag>
        </DetailListItem>
        <DetailListItem
          v-if="pid != ''"
          :term="$t('Namespace')"
        >
          {{
            detail.metadata.namespace || "default"
          }}
        </DetailListItem>
        <DetailListItem
          v-if="pid != '' && $isPro"
          :term="$t('Organization')"
        >
          {{ organization?.name || "-" }}
        </DetailListItem>
        <DetailListItem
          :term="$t('Sidecar')"
          v-if="$isPro"
        >
          <a-select
            :placeholder="$t('unset')"
            v-model:value="sidecar"
            class="width-180"
            ref="select"
            allow-clear
          >
            <a-select-option
              :value="sidecarOption.id"
              :key="index"
              v-for="(sidecarOption, index) in sidecars"
            >
              {{ sidecarOption.name }}
            </a-select-option>
          </a-select>
        </DetailListItem>
        <DetailListItem
          :term="$t('Gateway Path')"
          v-if="$isPro"
        >
          <a-input
            :placeholder="$t('unset')"
            v-model:value="gatewayPath"
            class="width-300"
          />
        </DetailListItem>
        <DetailListItem
          :term="$t('Is Gateway')"
          v-if="$isPro"
        >
          <a-switch v-model:checked="isGateway" />
        </DetailListItem>
      </DetailList>
      <DetailList
        size="small"
        :col="1"
      >
        <DetailListItem :term="$t('Labels')">
          <a-tag
            :key="index"
            v-for="(key, index) in Object.keys(detail.metadata.labels || [])"
            @close="handleClose(detail.metadata.labels, key)"
            :closable="true"
          >
            {{ key }}:{{ detail.metadata.labels[key] }}
          </a-tag>
          <a-input
            v-show="labelVisible"
            ref="labelRef"
            type="text"
            size="small"
            class="width-100"
            placeholder="[KEY:VALUE]"
            v-model:value="labelValue"
            @blur="labelInputConfirm"
            @keyup.enter="labelInputConfirm"
          />
          <a-tag
            v-permission="['service:update']"
            v-if="!labelVisible"
            @click="labelShowInput"
            class="dashed-tag"
          >
            <PlusOutlined />
            {{ $t("add") }}
          </a-tag>
        </DetailListItem>
        <DetailListItem :term="$t('Annotations')">
          <a-tag
            :key="index"
            v-for="(key, index) in Object.keys(
              detail.metadata.annotations || [],
            )"
            @close="handleClose(detail.metadata.annotations, key)"
            :closable="true"
            class="mb-5"
          >
            <span v-if="key == 'objectset.rio.cattle.io/applied'">
              <a-tooltip
                placement="topLeft"
                :title="detail.metadata.annotations[key]"
              >
                <a
                  class="font-primary"
                  href="javascript:void(0)"
                >{{ key }}</a>
              </a-tooltip>
            </span>
            <span
              v-else-if="
                key == 'kubectl.kubernetes.io/last-applied-configuration'
              "
            >
              <a-popover
                trigger="click"
                :title="key"
              >
                <template #content>
                  <JsonEditor
                    :is-json="true"
                    :value="detail.metadata.annotations[key]"
                  />
                </template>
                <a
                  class="font-primary"
                  href="javascript:void(0)"
                >{{ key }}</a>
              </a-popover>
            </span>
            <span v-else>{{ key }}:{{ detail.metadata.annotations[key] }}</span>
          </a-tag>
          <a-input
            v-show="annotationVisible"
            ref="annotationRef"
            type="text"
            size="small"
            class="width-100"
            placeholder="[KEY:VALUE]"
            v-model:value="annotationValue"
            @blur="annotationInputConfirm"
            @keyup.enter="annotationInputConfirm"
          />
          <a-tag
            v-permission="['service:update']"
            v-if="!annotationVisible"
            @click="annotationShowInput"
            class="dashed-tag"
          >
            <PlusOutlined />
            {{ $t("add") }}
          </a-tag>
        </DetailListItem>
        <DetailListItem
          v-if="pid != ''"
          :term="$t('Creation Timestamp')"
        >
          {{
            creationTimestamp
          }}
        </DetailListItem>
      </DetailList>
    </template>

    <template #extra>
      <slot name="extra" />
    </template>
    <template #action>
      <a-space>
        <slot name="action" />
        <a-button
          type="primary"
          @click="validate"
          v-permission="['service:update']"
          v-if="pid != ''"
        >
          {{ $t("save") }}
        </a-button>
        <a-button
          type="primary"
          @click="validate"
          v-permission="['service:create']"
          v-else
        >
          {{ $t("create") }}
        </a-button>
      </a-space>
    </template>
    <a-row class="row-mg">
      <a-col
        class="col-pd"
        :xl="24"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <slot name="tabs" />
      </a-col>
    </a-row>
  </PageLayout>
</template>

<script>
import _ from "lodash";
import EnvSelector from "@/components/menu/EnvSelector";
import JsonEditor from "@/components/editor/JsonEditor";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
import { mapState } from "vuex";
import {
  PlusOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "ServicesBaseDetail",
  i18n: require("@/i18n"),
  components: {
    JsonEditor,
    DetailListItem,
    DetailList,
    PageLayout,
    PlusOutlined,
    EnvSelector,
  },

  props: [
    "loading",
    "pid",
    "namespace",
    "contentString",
    "detail",
    "registry",
    "extend",
    "hasExport",
    "blacklistServices",
    "whitelistServices",
    "subscribeServices",
    "subscribeServicesTo",
    "subscribeServicesAll",
  ],

  data() {
    return {
      orgs: [],
      sidecars: [],
      ns: null,
      visibleAP: false,
      dialTestings: [],
      whiteAddress: [],
      blackAddress: [],
      visible: false,
      aclKey: "2",
      labelVisible: false,
      labelValue: "",
      annotationVisible: false,
      creationTimestamp: "-",
      annotationValue: "",
      certificates: [],
      organization: null,
      sidecar: null,
      isGateway: null,
      gatewayPath: null,
      isMounted: false,
    };
  },

  computed: {
    ...mapState({
      rules: state => state.rules.rules,
      isMobile: state => state.setting.isMobile,
    }),
  },

  created() {},
  mounted() {
    this.isMounted = true;

    this.$gql.query(`organizations{id,name}`).then((res) => {
      this.orgs = res;
    });
    this.$gql.query(`fleets(where:{type:"sidecar"}){id,name}`).then((res) => {
      this.sidecars = res;
    });
    if (this.pid != "") {
      this.search();
    } else {
      let extend = {
        certificates: [],
        identitys: {},
        log: { level: "All" },
        plugins: [],
      };
      let detail = {
        endpoints: [],
        spec: { type: "", clusterIP: "", sessionAffinity: "", ports: [] },
        metadata: {
          name: "",
          namespace: this.namespace,
          labels: {},
          annotations: {},
        },

        typeMeta: {},
        podInfo: {},
        containerImages: [],
        selector: {},
        statusInfo: {},
        conditions: [],
        rollingUpdateStrategy: { maxUnavailable: "", maxSurge: "" },
      };
      this.$emit("update:detail", detail);
      this.$emit("update:extend", extend);
      this.$emit("update:loading", false);
    }
  },

  methods: {
    envChange(d) {
      let detail = this.detail;
      detail.metadata.namespace = d.namespace;
      this.ns = d.namespaceId;
      this.$emit("update:registry", {
        id: d.registerId,
        name: d.registerName,
      });
      this.$emit("update:detail", detail);
    },

    handleClose(list, index) {
      delete list[index];
      let detail = this.detail;
      this.$emit("update:detail", detail);
    },

    labelShowInput() {
      this.labelVisible = true;
      this.$nextTick().then(() => {
        this.$refs.labelRef.focus();
      });
    },

    labelInputConfirm() {
      if (this.labelValue == "") {
        this.labelVisible = false;
        return;
      }
      let vals = this.labelValue.split(":");
      if (vals.length < 2) {
        this.$message.error({
          content: this.$t("Please enter the format of [key]:[value]"),
        });
      } else {
        let detail = this.detail;
        detail.metadata.labels = detail.metadata.labels || {};
        detail.metadata.labels[vals.shift()] = vals.join(":");
        this.labelValue = "";
        this.labelVisible = false;
        this.$emit("update:detail", detail);
      }
    },

    annotationShowInput() {
      this.annotationVisible = true;
      this.$nextTick().then(() => {
        this.$refs.annotationRef.focus();
      });
    },

    annotationInputConfirm() {
      if (this.annotationValue == "") {
        this.annotationVisible = false;
        return;
      }
      let vals = this.annotationValue.split(":");
      if (vals.length < 2) {
        this.$message.error({
          content: this.$t("Please enter the format of [key]:[value]"),
        });
      } else {
        let detail = this.detail;
        detail.metadata.annotations = detail.metadata.annotations || {};
        detail.metadata.annotations[vals.shift()] = vals.join(":");
        this.annotationValue = "";
        this.annotationVisible = false;
        this.$emit("update:detail", detail);
      }
    },

    k8sDetail() {
      this.$router.push({
        path: "/ops-center/registry/detail/" + this.registry.id,
      });
    },

    search() {
      this.$emit("update:loading", true);
      this.$gql
        .query(
          `getService(id: ${this.pid}){id,serviceExport{id},pods,content,ns{id,name},isGateway,gatewayPath,organization{id,name,whiteOrgs{id,name,services{id,name,content,organization{id,name},registry{id,type,name,content},namespace,blacklistServices{id}}},whiteOrgsBack{id,name,services{id,name,content,organization{id,name},registry{id,type,name,content},namespace,blacklistServices{id}}},services{id,name,content,organization{id,name},registry{id,type,name,content},namespace,blacklistServices{id}},subscribeServices{id,name,content,organization{id,name},registry{id,type,name,content},namespace,blacklistServices{id}}},extend,certificates{id,name,content},uid,name,fleet{id,name},registry{id,type,name,content},created_at, subscribeOrgs{services{id,name,content,organization{id,name},registry{id,type,name,content},namespace}},whitelistServices{id,name,namespace},blacklistServices{id,name,namespace},sidecar{id,name}}`,
        )
        .then((res) => {
          let subscribeServices = [];
          let subscribeServicesTo = [];
          if (res.organization && res.organization.services.length) {
            subscribeServices = subscribeServices.concat(
              res.organization.services.filter((item) => item.id != this.pid),
            );
            subscribeServicesTo = subscribeServices.concat(
              res.organization.services.filter((item) => item.id != this.pid),
            );
          }
          if (res.subscribeOrgs && res.subscribeOrgs.length) {
            for (const org of res.subscribeOrgs) {
              if (org.services && org.services.length) {
                subscribeServices = subscribeServices.concat(org.services);
              }
            }
          }

          if (
            res.organization &&
            res.organization.whiteOrgs &&
            res.organization.whiteOrgs.length
          ) {
            for (const org of res.organization.whiteOrgs) {
              if (org.services && org.services.length) {
                subscribeServices = subscribeServices.concat(org.services);
              }
            }
          }

          if (!res.content.whiteExcludedPath)
            res.content.whiteExcludedPath = {};
          if (!res.content.blackExcludedPath)
            res.content.blackExcludedPath = {};
          for (const svc of subscribeServices) {
            if (!res.content.whiteExcludedPath[svc.id])
              res.content.whiteExcludedPath[svc.id] = "";
            if (!res.content.blackExcludedPath[svc.id])
              res.content.blackExcludedPath[svc.id] = "";
          }

          let resMap = new Map();
          let whitelistServices = res.whitelistServices
            ? res.whitelistServices
            : [];
          let blacklistServices = res.blacklistServices
            ? res.blacklistServices
            : [];
          subscribeServices = subscribeServices.filter(
            (item) => !resMap.has(item.id) && resMap.set(item.id, 1),
          );
          let subscribeServicesAll = _.cloneDeep(subscribeServices);
          subscribeServices = subscribeServices.filter((service) => {
            const whiteBlackList =
              whitelistServices.concat(blacklistServices);
            const has = whiteBlackList.find((v) => {
              return v.id == service.id;
            });
            return !has;
          });

          if (res.organization && res.organization.subscribeServices) {
            subscribeServicesTo = subscribeServices.concat(
              res.organization.subscribeServices.filter(
                (item) => item.id != this.pid,
              ),
            );
          }

          if (
            res.organization &&
            res.organization.whiteOrgsBack &&
            res.organization.whiteOrgsBack.length
          ) {
            for (const org of res.organization.whiteOrgsBack) {
              if (org.services && org.services.length) {
                subscribeServicesTo = subscribeServices.concat(org.services);
              }
            }
          }

          resMap = new Map();
          subscribeServicesTo = subscribeServicesTo.filter(
            (item) => !resMap.has(item.id) && resMap.set(item.id, 1),
          );
          subscribeServicesTo = subscribeServicesTo.filter((service) => {
            const has =
              service.blacklistServices &&
              service.blacklistServices.find((v) => {
                return v.id == this.pid;
              });
            return !has;
          });

          this.creationTimestamp = new Date(res.created_at).toLocaleString();
          let extend = res.extend || {};

          let detail = res.content;
          if (!detail.spec) {
            detail.spec = { ports: [] };
          }
          if (!detail.endpoints) {
            detail.endpoints = [];
          }
          let registry = res.registry;
          let ns = res.ns;
          // this.organization = res.organization ? res.organization.id : null;
          this.sidecar = res.sidecar ? res.sidecar.id : null;
          this.isGateway = res.isGateway;
          this.gatewayPath = res.gatewayPath;
          if (detail.endpoints) {
            detail.endpoints.forEach((n) => {
              n.isedit = false;
              n.port_val = n.ports
                ? _.reduce(
                  n.ports,
                  function (sum, n) {
                    const append =
                      "" + n.name + "/" + n.port + "/" + n.protocol;
                    return sum ? sum + "\n" + append : append;
                  },
                  0,
                )
                : "";
            });
          }

          if (!extend.identitys) {
            extend.identitys = {};
          }
          if (!extend.plugins) {
            extend.plugins = [];
          }
          if (!extend.certificates) {
            extend.certificates = [];
          }
          if (res.certificates && res.certificates.length > 0) {
            extend.certificates.forEach((certificate1) => {
              res.certificates.forEach((certificate2) => {
                if (certificate1.id == certificate2.id) {
                  certificate1.name = certificate2.name;
                  certificate1.content = certificate2.content;
                }
              });
            });
          }
          if (!extend.log) {
            extend.log = {};
          }
          if (!extend.log.level) {
            extend.log.level = "All";
          }
          this.$emit("update:contentString", JSON.stringify(detail));
          this.$emit("update:detail", detail);
          this.$emit("update:extend", extend);
          this.$emit("update:registry", registry);
          this.$emit("update:ns", ns);
          this.$emit("update:pods", res.pods||[]);
          this.$emit("update:whitelistServices", whitelistServices);
          this.$emit("update:blacklistServices", blacklistServices);
          this.$emit("update:subscribeServicesAll", subscribeServicesAll);
          this.$emit("update:subscribeServicesTo", subscribeServicesTo);
          this.$emit("update:subscribeServices", subscribeServices);
          this.$emit("update:loading", false);
          this.$emit("update:hasExport", !!res.serviceExport);
          console.log(this.loading);
          console.log(this.hasExport);
          console.log(this.subscribeServices);
          console.log(this.subscribeServicesTo);
          console.log(this.subscribeServicesAll);
        });
    },

    valid() {
      if (this.detail.metadata.name == "") {
        this.$message.error(this.$t("The name cannot be empty"), 3);
        return false;
      }
      return true;
    },

    saveLogLevel(data) {
      this.extend.log.level = data.logLevel;
      this.save(true);
    },

    getSaveData() {
      let savedata = _.cloneDeep(this.detail);
      if (savedata.endpoints) {
        savedata.endpoints.forEach((n) => {
          delete n.isedit;
          n.ports = [];
          const port_val_ary = n.port_val.trim().split("\n");
          port_val_ary.forEach((itemstr) => {
            const itemary = itemstr.split("/");
            n.ports.push({
              name: itemary[0],
              port: itemary[1],
              protocol: itemary[2],
            });
          });
          delete n.port_val;
        });
      }
      if (savedata.spec.ports) {
        savedata.spec.ports.forEach((n) => {
          delete n.isedit;
          n.port = n.port * 1;
        });
      }
      this.$emit("update:contentString", JSON.stringify(savedata));
      return savedata;
    },

    setSaveData() {
      let savedata = JSON.parse(this.contentString);
      this.$emit("update:detail", savedata);
    },

    save(keep) {
      if (!this.valid()) {
        return;
      }
      let savedata = this.getSaveData();

      let extend = _.cloneDeep(this.extend);
      let certificates = [];
      if (extend.certificates && extend.certificates.length > 0) {
        certificates = [];
        extend.certificates.forEach((certificate) => {
          certificates.push(certificate.id);
        });
      }
      let input = {
        name: this.detail.metadata.name,
        // organization: this.organization,
        isGateway: this.isGateway,
        gatewayPath: this.gatewayPath,
        sidecar: this.sidecar || null,
        content: savedata,
        certificates,
        extend,
        whitelistServices: this.whitelistServices.map((item) => item.id),
        blacklistServices: this.blacklistServices.map((item) => item.id),
      };
      if (this.pid != "") {
        this.$gql
          .mutation(
            `updateServiceSync(input: $input){id}`,
            { input: { where: { id: this.pid }, data: input } },
            { input: "updateServiceInput" },
          )
          .then(() => {
            this.$message.success(this.$t("Save successfully"), 3);
            if (keep != true) {
              this.$closePage(this.$route);
            }
          });
      } else {
        input.namespace = this.detail.metadata.namespace;
        input.registry = this.registry.id;
        this.$gql
          .mutation(
            `createServiceSync(input: $input){id}`,
            { input: { data: input } },
            { content: "createServiceInput" },
          )
          .then((res) => {
            this.$emit("update:pid", res.id);
            this.$message.success(this.$t("Created successfully"), 3);
            this.$closePage(this.$route);
          });
      }
    },

    validate() {
      this.$refs.layout.$refs.form
        .validateFields()
        .then(() => {
          this.save();
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
  .divider {
    height: 120px;
    position: relative;
    top: 60px;
  }
</style>
