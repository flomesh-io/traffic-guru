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
          v-if="$isPro"
          :term="$t('Organization')"
          name="organization"
        >
          <a-select
            v-permission="pid?['admin']:''"
            :placeholder="$t('unset')"
            v-model:value="organization.id"
            class="width-180"
            ref="select"
          >
            <a-select-option
              :value="org.id"
              :key="index"
              v-for="(org, index) in orgs"
            >
              {{
                org.name
              }}
            </a-select-option>
          </a-select>
          <div
            class="width-180"
            v-if="pid"
          >
            <a-tag v-permission="['!admin']">
              {{ organization?.name }}
            </a-tag>
          </div>
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
          :term="$t('Upstream Version')"
          v-if="$isPro"
        >
          <a-input
            :placeholder="$t('unset')"
            v-model:value="upstreamVersion"
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
          <TagMap
            v-model:map="detail.metadata.labels"
            name="labels"
            placeholder="[key]:[value]"
          />
        </DetailListItem>
        <DetailListItem :term="$t('Annotations')">
          <TagMap
            v-model:map="detail.metadata.annotations"
            name="labels"
            placeholder="[key]:[value]"
          />
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
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
import TagMap from "@/components/tag/TagMap";
import { mapState } from "vuex";

export default {
  name: "ServicesBaseDetail",
  i18n: require("@/i18n"),
  components: {
    DetailListItem,
    DetailList,
    PageLayout,
    EnvSelector,
    TagMap,
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
      creationTimestamp: "-",
      certificates: [],
      organization: {id:null},
      sidecar: null,
      isGateway: null,
      gatewayPath: null,
      upstreamVersion: null,
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

    this.$gql.query(`organizations{data{id,attributes{name}}}`).then((res) => {
      this.orgs = res.data;
    });
    this.$gql.query(`fleets(filters:{type:{eq:"sidecar"}}){data{id,attributes{name}}}`).then((res) => {
      this.sidecars = res.data;
    });
    if (this.pid != "") {
      this.search();
    } else {
      let extend = {
        certificates: [],
        identitys: {},
        log: { level: "None" },
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
		
    k8sDetail() {
      this.$router.push({
        path: "/ops-center/registry/detail/" + this.registry.id,
      });
    },

    search() {
      this.$emit("update:loading", true);
      this.$gql
        .query(
          `getService(id: ${this.pid}){data{id,attributes{
						serviceExport{data{id}},
						pods,
						content,
						ns{data{id,attributes{name}}},
						isGateway,
						gatewayPath,
            upstreamVersion,
						organization{data{id,attributes{
							name,
							whiteOrgs{data{id,attributes{
								name,
								services{data{id,attributes{
									name,
									content,
									organization{data{id,attributes{name}}},
									registry{data{id,attributes{type,name,content}}},
									namespace,
									blacklistServices{data{id}},
                  updatedAt
								}}}
							}}},
							whiteOrgsBack{data{id,attributes{
								name,
								services{data{id,attributes{
									name,
									content,
									organization{data{id,attributes{name}}},
									registry{data{id,attributes{type,name,content}}},
									namespace,
									blacklistServices{data{id}},
                  updatedAt
								}}}
							}}},
							services{data{id,attributes{
								name,
								content,
								organization{data{id,attributes{name}}},
								registry{data{id,attributes{type,name,content}}},
								namespace,
								blacklistServices{data{id}},
                updatedAt
							}}},
							subscribeServices{data{id,attributes{
								name,
								content,
								organization{data{id,attributes{name}}},
								registry{data{id,attributes{type,name,content}}},
								namespace,
								blacklistServices{data{id}},
                updatedAt
							}}}
						}}},
						extend,
						certificates{data{id,attributes{name,content}}},
						uid,
						name,
						fleet{data{id,attributes{name}}},
						registry{data{id,attributes{type,name,content}}},
						createdAt, 
						subscribeOrgs{data{id,attributes{
							services{data{id,attributes{
								name,
								content,
								organization{data{id,attributes{name}}},
								registry{data{id,attributes{type,name,content}}},
								namespace
							}}}
						}}},
						whitelistServices{data{id,attributes{name,namespace,registry{data{id,attributes{type,name}}}}}},
						blacklistServices{data{id,attributes{name,namespace,registry{data{id,attributes{type,name}}}}}},
						sidecar{data{id,attributes{name}}}
					}}}`,
        )
        .then((d) => {
          let res = d.data;
          let subscribeServices = [];
          let subscribeServicesTo = [];
          if (res.organization && res.organization.services && res.organization.services.length > 0) {
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

          this.creationTimestamp = new Date(res.createdAt).toLocaleString();
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
          this.organization = res.organization ? res.organization : {id:null};
          this.sidecar = res.sidecar ? res.sidecar.id : null;
          this.isGateway = res.isGateway;
          this.gatewayPath = res.gatewayPath;
          this.upstreamVersion = res.upstreamVersion;
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
            extend.log.level = "None";
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
        organization: this.organization?.id,
        isGateway: this.isGateway,
        gatewayPath: this.gatewayPath,
        upstreamVersion: this.upstreamVersion,
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
            `updateServiceSync(id: ${this.pid}, data: $data){data{id}}`,
            { data: input },
            { data: "ServiceInput!" },
          )
          .then(() => {
            this.$message.success(this.$t("Save successfully"), 3);
            if (keep != true) {
              //this.$closePage(this.$route);
            }
          });
      } else {
        input.namespace = this.detail.metadata.namespace;
        input.registry = this.registry.id;
        this.$gql
          .mutation(
            `createServiceSync(data: $data){data{id}}`,
            { data: input },
            { data: "ServiceInput!" },
          )
          .then((res) => {
            this.$emit("update:pid", res.data.id);
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
