<template>
  <PageLayout
    :hide-breadcrumb="embed"
    :title="embed ? ' ' : detail.name ? detail.name : $t('new') + ' Tunnel'"
    :form-state="detail"
    ref="layout"
  >
    <template #headerContent>
      <DetailList
        size="small"
        :col="2"
      >
        <DetailListItem
          :term="$t('as')"
          name="name"
          v-if="!embed"
          :rules="rules.uniqueName('tunnels',{id:pid})"
        >
          <a-input
            :placeholder="$t('unset')"
            v-model:value="detail.name"
            class="width-200"
          />
        </DetailListItem>
        <DetailListItem
          :term="$t('port')"
          :name="['content', 'port']"
          v-if="!embed"
          :rules="rules.required"
        >
          <a-input
            type="number"
            :placeholder="$t('unset')"
            v-model:value="detail.content.port"
            class="width-100"
            :disabled="pid != ''"
          />
        </DetailListItem>
        <DetailListItem
          :term="$t('Organization')"
          :name="['organization', 'id']"
          :rules="rules.required"
        >
          <a-select
            :placeholder="$t('unset')"
            v-model:value="detail.organization.id"
            class="width-180"
            ref="select"
            :disabled="pid != ''"
            @change="getAddressPools();detail.addressPool.id=null;"
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
        </DetailListItem>
        <DetailListItem
          :term="$t('Unique IP')"
        >
          <a-switch
            class="ml-10"
            v-model:checked="detail.content.uniqueIp"
            :disabled="pid != ''"
          />
        </DetailListItem>
        <DetailListItem
          :term="$t('addressPool')"
          :name="['addressPool', 'id']"
          :rules="rules.required"
        >
          <a-select
            :placeholder="$t('unallocated')"
            class="width-200"
            v-model:value="detail.addressPool.id"
            @change="(e) => changeAddressPool(e)"
            :disabled="pid != ''"
          >
            <a-select-option
              v-for="(item, index) in pools"
              :key="index"
              :value="item.id"
            >
              <span v-if="item.id">{{ item.name }}</span>
            </a-select-option>
          </a-select>
        </DetailListItem>
        <DetailListItem
          :term="$t('Protocol')"
          :name="['content', 'protocol']"
          :rules="rules.required"
        >
          <a-select
            :placeholder="$t('unallocated')"
            class="width-200"
            v-model:value="detail.content.protocol"
          >
            <a-select-option
              v-for="(item, index) in protocols"
              :key="index"
              :value="item.id"
            >
              <span v-if="item.id">{{ item.name }}</span>
            </a-select-option>
          </a-select>
        </DetailListItem>
        <DetailListItem
          :term="$t('cluster')"
          :name="['tunnelExternal', 'id']"
          :rules="rules.required"
        >
          <a-select
            :disabled="pid != ''"
            :placeholder="$t('unallocated')"
            class="width-200"
            v-model:value="detail.tunnelExternal.id"
            @change="(e) => handleChange()"
          >
            <a-select-option
              v-for="(item, index) in pipys"
              :key="index"
              :value="item.id"
            >
              <span v-if="item.id">{{ item.name }}</span>
            </a-select-option>
          </a-select>
        </DetailListItem>
        
        <DetailListItem
          :term="$t('IP')"
          v-if="detail.address && detail.address.ip"
        >
          {{ detail.address.ip }}
        </DetailListItem>
        <DetailListItem
          :term="$t('Global Id')"
          v-if="pid"
        >
          {{ detail.globalId }}
        </DetailListItem>
      </DetailList>
    </template>
    <template
      v-if="pid != '' && !embed"
      #extra
    />
    <template
      #action
      v-if="!embed"
    >
      <a-button
        v-if="pid != ''"
        type="primary"
        @click="validate()"
        v-permission="['l4-lb:update']"
      >
        {{ $t("save") }}
      </a-button>
      <a-button
        v-else
        type="primary"
        @click="validate()"
        v-permission="['l4-lb:create']"
      >
        {{ $t("create") }}
      </a-button>
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
        <a-tabs type="card">
          <a-tab-pane
            key="1"
            :tab="$t('config')"
          >
            <a-card
              v-for="(field, index) in detail.content.mapping"
              :key="index"
              class="card mb-24"
              :title="$t(field.label)"
              :bordered="false"
              :loading="loading"
            >
              <AutoForm :fields="field.fields" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="$t('Policy')"
          >
            <a-row class="row-mg">
              <a-col
                class="col-pd"
                :xl="24"
                :lg="24"
                :md="24"
                :sm="24"
                :xs="24"
              >
                <PluginConfig
                  v-model:plugins="detail.content.plugins"
                  @add="showPluginBox"
                  :add-text="$t('Add Plugin')"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane
            key="3"
            :tab="$t('healthcheck')"
            v-if="pid"
          >
            <a-row class="row-mg">
              <a-col
                class="col-pd"
                :xl="24"
                :lg="24"
                :md="24"
                :sm="24"
                :xs="24"
              >
                <HealthcheckResult
                  :service-id="pid"
                  mode="l4Lb"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane
            key="11"
            v-if="pid != ''"
            :tab="$t('log')"
          >
            <LogViewer
              :uid="pid"
              type="4lb"
              :hide-chart="true"
            />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
    <a-modal
      :footer="null"
      :width="800"
      v-model:visible="visibleAP"
      :title="$t('Add Plugin')"
      @ok="handleOk"
    >
      <PluginList
        apply="4lb"
        @selectPlugin="selectPlugin"
        :hide-head="true"
      />
    </a-modal>
  </PageLayout>
</template>

<script>
import _ from "lodash";
import PluginConfig from "@/components/card/PluginConfig";
import PluginList from "@/components/card/PluginList";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
import HealthcheckResult from "@/pages.pro/flb/lblog/LBLogList";
import { mapState } from "vuex";
import AutoForm from "@/components/form/AutoForm";
import LogViewer from "@/components/table/LogViewer";
import { buildAddressItem, restructAddressItem,mergeFields } from "@/utils/util.js";

export default {
  name: "Lb4Detail",
  i18n: require("@/i18n"),
  components: {
    DetailListItem,
    DetailList,
    PageLayout,
    AutoForm,
    LogViewer,
    PluginConfig,
    PluginList,
    HealthcheckResult,
  },

  props: ["embed", "name", "rid"],
  data() {
		
    return {
      type: "4 Load Balancer",
      initMapping: [
        {
          label: "Targets",
          fields: [[{ label: "Target Hosts", value: "" }]],
        },
        {
          label: "Load Balancing",
          fields: [[{ label: "Algorithm", value: "rr" }]],
        },
        {
          label: "Config",
          fields: [[
            {
              name: "sticky",
              type: "boolean",
              unit: "",
              label: "Sticky",
              value: false,
            },
            {
              name: "maxFails",
              type: "number",
              unit: "",
              label: "Max Fails",
              value: "",
            },
            {
              name: "maxConnections",
              type: "number",
              unit: "",
              label: "Max Connections",
              value: "",
            },
            {
              name: "readTimeout",
              type: "text",
              unit: "",
              label: "Read timeout",
              value: "60s",
            },
            {
              name: "writeTimeout",
              type: "text",
              unit: "",
              label: "Write Timeout",
              value: "60s",
            },
            {
              name: "idleTimeout",
              type: "text",
              unit: "",
              label: "IDLE Timeout",
              value: "60s",
            },
          ]],
        },
      ],

      visible: false,
      pipys: [],
      detail: {
        content: {
          mapping: [],
          bps_limit: null,
          tps_limit: null,
          port: "80",
          plugins: [],
          sourceIpPool:{
            a: 0,
            b: 0,
            c: 0,
            d: 0,
            suffix: 0,
          },

          uniqueIp: false,
        },

        certificate:null,
        organization: { id: null },
        tunnelExternal: { id: null },
        addressPool: { id: null },
        name: "",
      },

      loading: true,
      log: "{}",
      pid: "",
      filter: "",
      params: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },

      profiles: [],
      pools: [],
      tpsCnt: 0,
      activeTabKey: "2",
      visibleAP: false,
      protocols: [
        { id: "tcp", name: "TCP" },
        { id: "udp", name: "UDP" },
      ],

      certificates:[],
      clientCertificates:[],
      orgs: [],
    };
  },

  computed: {
    ...mapState({
      rules: state => state.rules.rules,
      isMobile: state => state.setting.isMobile,
    }),
  },

  created() {
    this.pid = this.rid || "";
    this.$gql.query(`myOrganizations{data{id,attributes{name}}}`).then((res) => {
      this.orgs = res.data;
    });
    if (this.pid != "") {
      this.loading = true;
      this.$gql
        .query(
          `tunnel(id: ${this.pid}){data{id,attributes{
						name,
						globalId,
						organization{data{id,attributes{name}}},
						tunnelExternal{data{id,attributes{name}}},
						addressPool{data{id,attributes{name, organization{data{id, attributes{name}}}}}},
						certificate{data{id,attributes{name}}},
						clientCertificate{data{id,attributes{name}}},
						content, 
            endpoint,
						address{data{id,attributes{ip}}}
					}}}`,
        )
        .then((res) => {
          let _data = res.data;
          _data.content.mapping = mergeFields(this.initMapping,_data.content.mapping);
          this.loading = false;
          this.detail = _data;
          this.detail.organization = this.detail.organization ? this.detail.organization : {id:null};
          
						
          if(this.detail.certificate?.id){
            this.detail.certificate = this.detail.certificate.id;
          }
          if(this.detail.clientCertificate?.id){
            this.detail.clientCertificate = this.detail.clientCertificate.id;
          }
          if(this.detail.content.sourceIpPool?.ip){
            this.detail.content.sourceIpPool = restructAddressItem(this.detail.content.sourceIpPool, 3);
          } else {
            this.detail.content.sourceIpPool = {
              a: 0,
              b: 0,
              c: 0,
              d: 0,
              suffix: 0,
            };
          }
          this.getAddressPools()
        });
    } else {
      this.detail = {
        addressPool: { id: null },
        tunnelExternal: { id: null },
        organization: { id: null },
        address: { ip: null },
        certificate:null,
        clientCertificate: null,
        content: {
          mapping: this.initMapping,
          bps_limit: null,
          tps_limit: null,
          port: "80",
          plugins: [],

          uniqueIp: false
        },

        name: "",
      };
      this.loading = false;
    }


    this.$gql
      .query(`myFleets(filters: {type: {eq:"tunnelExternal"}}){data{id,attributes{name}}}`)
      .then((res) => {
        this.pipys = res.data;
      });
    this.$gql.query(`profiles{data{id,attributes{name}}}`).then((res) => {
      this.profiles = res.data;
    });
    this.getCertificates();
  },

  methods: {
    onTabChange(key) {
      console.log(key);
    },

    getAddressPools() {
      if (this.detail?.organization?.id) {
        this.$gql.query(`addressPools(filters: {organization:{id:{eq:${this.detail?.organization?.id}}}}){data{id,attributes{name, organization{data{id, attributes{name}}}}}}`).then((res) => {
          this.pools = res.data;
        });
      } else {
        this.pools = [];
      }
    },

    getCertificates() {
      this.$gql
        .query(
          `certificates(filters: $filters, pagination: { start: 0, limit: ${this.$DFT_LIMIT}}){data{id,attributes{
						name,
						type,
						namespace{data{id,attributes{
							name,
							registry{data{id,attributes{name}}}
						}}},
						content
					}}}`,
          { filters: { type: {in: ["api", "rfc8998"]} }},
          {
            filters: "CertificateFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.certificates = res.data;
        });

      this.$gql
        .query(
          `certificates(filters: $filters, pagination: { start: 0, limit: ${this.$DFT_LIMIT}}){data{id,attributes{
						name,
						type,
						namespace{data{id,attributes{
							name,
							registry{data{id,attributes{name}}}
						}}},
						content
					}}}`,
          { filters: { type: {eq: "client"} }},
          {
            filters: "CertificateFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.clientCertificates = res.data;
        });
        
    },

    validate(registry_id) {
      this.$refs.layout.$refs.form
        .validateFields()
        .then(() => {
          this.save(registry_id);
        })
        .catch(() => {});
    },

    valid() {
      if (this.detail.name == "" && this.name == "") {
        this.$message.error(this.$t("The name cannot be empty"), 3);
        return false;
      }
      return true;
    },

    save(registry_id) {
      if (!this.valid()) {
        return;
      }
      let savedata = _.cloneDeep(this.detail);
      savedata.content.mapping = _.cloneDeep(this.detail.content.mapping);
      savedata.content.is_gateway = this.embed ? true : false;
      savedata.tunnelExternal = savedata.tunnelExternal.id;
      savedata.addressPool = savedata.addressPool.id;
      if(savedata.content.sourceIpPool){
        savedata.content.sourceIpPool = buildAddressItem(savedata.content.sourceIpPool, 3);
      }
      if (registry_id) {
        savedata.registry = registry_id;
        savedata.name = this.name + " 4LB";
      }
      if (!savedata.content.targets) {
        savedata.content.targets = "[]";
      }
      if (!savedata.content.aggregation_length) {
        savedata.content.aggregation_length = 0;
      }
      if (!savedata.content.checker) {
        savedata.content.checker = "";
      }
      delete savedata.id;
      delete savedata.address;

      if (savedata.content.plugins) {
        savedata.content.plugins.forEach((plugin) => {
          plugin.content.fields.forEach((field) => {
            if (field.type == "number") {
              field.value = Number(field.value);
            }
          });
        });
      }

      if (savedata.organization?.id) {
        savedata.organization = savedata.organization?.id
      }

      if (this.pid != "") {
        delete savedata.profile
        this.$gql
          .mutation(
            `updateTunnel(id:${this.pid}, data: $data){data{id}}`,
            { data: savedata },
            {
              data: "TunnelInput!"
            }
          )
          .then(() => {
            if (this.embed) {
              this.$emit("saved", registry_id);
            } else {
              this.$message.success(this.$t("Save successfully"), 3);
              this.$closePage(this.$route);
            }
          });
      } else {
        this.$gql
          .mutation(`createTunnel(data: $data){data{id,attributes{name}}}`,
                    { data: savedata },
                    {
                      data: "TunnelInput!"
                    }
          )
          .then((res) => {
            if (this.embed) {
              this.$emit("saved", registry_id);
            } else {
              this.pid = res.data.id;
              this.$message.success(this.$t("Created successfully"), 3);
              this.$closePage(this.$route);
            }
          });
      }
    },

    handleChange() {},
    changeAddressPool(e){
      this.detail.organization = this.pools.find((p) => p.id == e).organization
    },

    hide() {
      this.visible = false;
    },

    selectPlugin(data) {
      this.detail.content.plugins.push({ ...data, enable: true });
      this.visibleAP = false;
      this.$message.success(this.$t("Added successfully"), 3);
    },

    showPluginBox() {
      this.visibleAP = true;
    },
  },
};
</script>

<style lang="less" scoped></style>
