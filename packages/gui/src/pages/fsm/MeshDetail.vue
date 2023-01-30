<template>
  <PageLayout
    :title="$t('Mesh Detail')"
    :form-state="detail"
    ref="layout"
  >
    <template #headerContent>
      <DetailList
        size="small"
        :col="1"
      >
        <DetailListItem
          v-if="detail.name"
          :term="$t('Mesh')"
        >
          {{ detail.name }}
        </DetailListItem>
        <DetailListItem :term="$t('Mesh Config')">
          {{ detail.config?.metadata?.name }}
        </DetailListItem>
        <DetailListItem :term="$t('Namespace')">
          {{ detail.namespace? (detail.namespace?.registry?.name +"/"+detail.namespace?.name):'-' }}
        </DetailListItem>
        <DetailListItem
          v-if="detail.status?.mcs"
          :term="$t('MCS')"
        >
          <Status :d="{status:detail.status?.mcs,message:detail.fsmMessage}" />
        </DetailListItem>
        <DetailListItem :term="$t('Creation Timestamp')">
          {{
            new Date(detail.config?.metadata?.creationTimestamp).toLocaleString()
          }}
        </DetailListItem>
      </DetailList>
    </template>
    <template #action>
      <!--
        <a-button
        type="primary"
        @click="validate"
        v-permission="['service:update']"
        v-if="pid != ''"
        >{{ $t('save') }}</a-button
        > 
      -->
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
        <a-tabs
          type="card"
          v-model:activeKey="activeKey"
          v-if="pid != '' && detail.namespace"
        >
          <a-tab-pane
            key="1"
            :tab="$t('Dashboard')"
          >
            <EmbedDashboard
              :init="false"
              :page-id="detail.namespace?.name + '-' + pid"
              apply="mesh"
              :params="{
                name: detail.name,
                where: '',
                mesh: pid,
                namespace: detail.namespace?.name,
                namespaceId: detail.namespace?.id,
                namespaces: detail.bindNamespaces,
                registry: detail.namespace?.registry.id,
              }"
              :default-widget="DEFAULT_MESH_DETAIL"
              :hide-add="activeKey != '1'"
              v-model:prometheus="detail.prometheus.id"
              @prometheusChange="prometheusChange"
            />
          </a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="$t('Bind Namespaces')"
          >
            <NamespaceList
              :registry="detail.namespace.registry.id"
              :bind-mesh="pid"
              @change="search"
            />
          </a-tab-pane>
          <a-tab-pane
            key="3"
            :tab="$t('Services')"
          >
            <ServiceList
              mode="mesh"
              :namespaces="detail.bindNamespaces"
              :embed="true"
              :metric="false"
              :has-search="false"
            >
              <template #extra />
            </ServiceList>
          </a-tab-pane>
          <a-tab-pane
            key="4"
            :tab="$t('Mesh Config')"
          >
            <a-card
              v-if="detail.config"
              :title="$t('Feature Flags')"
              class="card nopd"
            >
              <a-descriptions bordered>
                <a-descriptions-item
                  :label="$t('Async Proxy Service Mapping')"
                  :span="1"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.featureFlags
                        .enableAsyncProxyServiceMapping
                    "
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Egress Policy')"
                  :span="1"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.featureFlags.enableEgressPolicy
                    "
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Sidecar Active Health Checks')"
                  :span="1"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.featureFlags
                        .enableSidecarActiveHealthChecks
                    "
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Ingress Backend Policy')"
                  :span="1"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.featureFlags.enableIngressBackendPolicy
                    "
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Retry Policy')"
                  :span="1"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.featureFlags.enableRetryPolicy
                    "
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Snapshot Cache Mode')"
                  :span="1"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.featureFlags.enableSnapshotCacheMode
                    "
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('WASM Stats')"
                  :span="1"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.featureFlags.enableWASMStats
                    "
                  />
                </a-descriptions-item>
              </a-descriptions>
            </a-card>
            <a-card
              v-if="detail.config"
              :title="$t('Traffic')"
              class="card mt-15 nopd"
            >
              <a-descriptions bordered>
                <a-descriptions-item
                  :label="$t('Egress')"
                  :span="2"
                >
                  <a-switch
                    v-model:checked="detail.config.spec.traffic.enableEgress"
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Permissive Traffic Policy Mode')"
                  :span="1"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.traffic
                        .enablePermissiveTrafficPolicyMode
                    "
                  />
                </a-descriptions-item>
                <a-descriptions-item :span="3">
                  <span
                    class="absolute"
                    style="left: 30px; margin-top: -10px"
                  >{{ $t("Inbound External Authorization") }}</span>
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Enabled')"
                  :span="2"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.traffic.inboundExternalAuthorization
                        .enable
                    "
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Failure Mode Allow')"
                  :span="1"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.traffic.inboundExternalAuthorization
                        .failureModeAllow
                    "
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Stat Prefix')"
                  :span="2"
                >
                  {{
                    detail.config.spec.traffic.inboundExternalAuthorization
                      .statPrefix
                  }}
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Timeout') + '(s)'"
                  :span="1"
                >
                  <a-input-number
                    :min="0"
                    v-model:value="
                      detail.config.spec.traffic.inboundExternalAuthorization
                        .timeout
                    "
                    :placeholder="$t('unset')"
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Inbound Port (Exclusion)')"
                  :span="2"
                >
                  <TagList
                    v-model:list="
                      detail.config.spec.traffic.inboundPortExclusionList
                    "
                    name="inboundPortExclusionList"
                    placeholder="Port"
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Outbound Port (Exclusion)')"
                  :span="1"
                >
                  <TagList
                    v-model:list="
                      detail.config.spec.traffic.outboundPortExclusionList
                    "
                    name="outboundPortExclusionList"
                    placeholder="Port"
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Outbound IP Range (Exclusion)')"
                  :span="2"
                >
                  <TagList
                    v-model:list="
                      detail.config.spec.traffic.outboundIPRangeExclusionList
                    "
                    name="outboundIPRangeExclusionList"
                    placeholder="0.0.0.0/n"
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Outbound IP Range (Inclusion)')"
                  :span="1"
                >
                  <TagList
                    v-model:list="
                      detail.config.spec.traffic.outboundIPRangeInclusionList
                    "
                    name="outboundIPRangeInclusionList"
                    placeholder="0.0.0.0/n"
                  />
                </a-descriptions-item>
              </a-descriptions>
            </a-card>

            <a-row class="row-mg">
              <a-col
                class="col-pd"
                :xl="12"
                :lg="24"
                :md="24"
                :sm="24"
                :xs="24"
              >
                <a-card
                  v-if="detail.config"
                  :title="$t('Certificate')"
                  class="card mt-15 nopd"
                >
                  <a-descriptions bordered>
                    <a-descriptions-item
                      :label="$t('Cert Key Bit Size')"
                      :span="3"
                    >
                      <a-input-number
                        :min="0"
                        v-model:value="
                          detail.config.spec.certificate.certKeyBitSize
                        "
                        placeholder="Bit"
                      />
                    </a-descriptions-item>
                    <a-descriptions-item
                      :label="$t('Service Cert Validity Duration') + '(h)'"
                      :span="3"
                    >
                      <a-input-number
                        :min="0"
                        v-model:value="
                          detail.config.spec.certificate
                            .serviceCertValidityDuration
                        "
                        placeholder="h"
                      />
                    </a-descriptions-item>
                  </a-descriptions>
                </a-card>
              </a-col>
              <a-col
                class="col-pd"
                :xl="12"
                :lg="24"
                :md="24"
                :sm="24"
                :xs="24"
              >
                <a-card
                  v-if="detail.config"
                  :title="$t('Observability')"
                  class="card mt-15 nopd"
                >
                  <a-descriptions bordered>
                    <a-descriptions-item
                      :label="$t('Log Level')"
                      :span="3"
                    >
                      <a-radio-group
                        v-model:value="
                          detail.config.spec.observability.osmLogLevel
                        "
                        name="radioGroup"
                      >
                        <a-radio value="error">
                          Error
                        </a-radio>
                        <a-radio value="info">
                          Info
                        </a-radio>
                      </a-radio-group>
                    </a-descriptions-item>
                    <a-descriptions-item
                      :label="$t('Debug Server')"
                      :span="1"
                    >
                      <a-switch
                        v-model:checked="
                          detail.config.spec.observability.enableDebugServer
                        "
                      />
                    </a-descriptions-item>
                    <a-descriptions-item
                      :label="$t('Tracing')"
                      :span="2"
                    >
                      <a-switch
                        v-model:checked="
                          detail.config.spec.observability.tracing.enable
                        "
                      />
                    </a-descriptions-item>
                  </a-descriptions>
                </a-card>
              </a-col>
            </a-row>
            <a-card
              v-if="detail.config"
              :title="$t('Sidecar')"
              class="card mt-15 nopd"
            >
              <a-descriptions bordered>
                <a-descriptions-item
                  :label="$t('Log Level')"
                  :span="1"
                >
                  <a-radio-group
                    v-model:value="detail.config.spec.sidecar.logLevel"
                    name="radioGroup"
                  >
                    <a-radio value="error">
                      Error
                    </a-radio>
                    <a-radio value="info">
                      Info
                    </a-radio>
                  </a-radio-group>
                </a-descriptions-item>
                <a-descriptions-item
                  v-if="detail.config.spec.sidecar.localProxyMode"
                  :label="$t('Local Proxy Mode')"
                  :span="1"
                >
                  {{ detail.config.spec.sidecar.localProxyMode }}
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Privileged Init Container')"
                  :span="1"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.sidecar.enablePrivilegedInitContainer
                    "
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Config Resync Interval') + '(s)'"
                  :span="1"
                >
                  <a-input-number
                    :min="0"
                    v-model:value="
                      detail.config.spec.sidecar.configResyncInterval
                    "
                    :placeholder="$t('unset')"
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Tls Protocol Version (Min)')"
                  :span="1"
                >
                  <a-input
                    v-model:value="
                      detail.config.spec.sidecar.tlsMinProtocolVersion
                    "
                    :placeholder="$t('unset')"
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Tls Protocol Version (Max)')"
                  :span="1"
                >
                  <a-input
                    v-model:value="
                      detail.config.spec.sidecar.tlsMaxProtocolVersion
                    "
                    :placeholder="$t('unset')"
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Local DNS Proxy')"
                  :span="1"
                >
                  <a-switch
                    v-model:checked="
                      detail.config.spec.sidecar.localDNSProxy.enable
                    "
                  />
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Resources')"
                  :span="2"
                >
                  <TagMap
                    v-model:map="detail.config.spec.sidecar.resources"
                    name="resources"
                    placeholder="[key]:[value]"
                  />
                </a-descriptions-item>
              </a-descriptions>
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="13"
            v-if="pid != ''"
            :tab="$t('log')"
          >
            <LogViewer
              :uid="pid"
              :params="{ name: detail.name }"
              type="mesh"
            />
          </a-tab-pane>
          <template #rightExtra>
            <a-button
              type="primary"
              @click="validate"
              v-permission="['mesh:update']"
              v-if="pid != '' && activeKey == '4'"
            >
              {{ $t("save") }}
            </a-button>
          </template>
        </a-tabs>
      </a-col>
    </a-row>
  </PageLayout>
</template>

<script>
import EmbedDashboard from "@/components/page/EmbedDashboard";
import NamespaceList from "./components/NamespaceList";
import ServiceList from "@/pages/fsm/components/ServiceList";
import _ from "lodash";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
import TagList from "@/components/tag/TagList";
import TagMap from "@/components/tag/TagMap";
import { mapState } from "vuex";
import { DEFAULT_MESH_DETAIL } from "@/services/dashboard";
import LogViewer from "@/components/table/LogViewer";
import Status from "@/components/tag/Status";

export default {
  name: "MeshDetail",
  i18n: require("@/i18n"),
  components: {
    ServiceList,
    NamespaceList,
    PageLayout,
    DetailList,
    DetailListItem,
    LogViewer,
    TagList,
    TagMap,
    EmbedDashboard,
    Status,
  },

  data() {
    return {
      DEFAULT_MESH_DETAIL,
      activeKey: "1",
      detail: {
        name: "",
        prometheus: {id:null},
      },

      isEdit: false,
      loading: true,
      pid: "",
    };
  },

  computed: {
    ...mapState({
      rules: state => state.rules.rules,
      isMobile: state => state.setting.isMobile,
    }),
  },

  created() {
    this.pid = this.$route.params.id || "";
    this.namespace = this.$route.params.namespace || "";
  },

  mounted() {
    if (this.pid != "") {
      this.search();
    } else {
      this.detail = {
        name: "",
        prometheus: {id:null},
        switchType: 0,
        virtualServices: [],
      };
      this.loading = false;
    }
  },

  methods: {
    search() {
      this.loading = true;
      this.$gql
        .query(
          `mesh(id:${this.pid}){id,config,fsmMessage,prometheus{id,name},namespace{id,name,registry{id,name}},status,name,bindNamespaces{id,name},created_at}`,
        )
        .then((res) => {
          this.detail = res;
          this.detail.prometheus = this.detail.prometheus || {id:null}
          this.loading = false;
        });
    },

    prometheusChange(){
      if (this.pid != "") {
        this.$gql
          .mutation(
            `updateMesh(input: $input){mesh{id}}`,
            {
              input: {
                where: { id: this.pid },
                data: { prometheus: this.detail.prometheus?.id },
              },
            },
            { input: "updateMeshInput" },
          )
          .then(() => {
            this.$message.success(this.$t("Save successfully"), 3);
          });
      }
    },

    save() {
      let savedata = _.cloneDeep(this.detail);
      if (this.pid != "") {
        this.$gql
          .mutation(
            `updateMesh(input: $input){mesh{id}}`,
            {
              input: {
                where: { id: this.pid },
                data: { config: savedata.config },
              },
            },
            { input: "updateMeshInput" },
          )
          .then(() => {
            this.$message.success(this.$t("Save successfully"), 3);
            this.search();
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

<style lang="less" scoped></style>
