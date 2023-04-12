<template>
  <PageLayout
    :title="detail.name ? detail.name : $t('Registry')"
    :form-state="detail"
    ref="layout"
  >
    <template #headerContent>
      <a-row>
        <a-col
          :xl="12"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <DetailList
            size="small"
            :col="1"
          >
            <DetailListItem
              :term="$t('as')"
              :rules="rules.uniqueName('registries',{id:pid})"
              name="name"
            >
              <a-input
                :placeholder="$t('unset')"
                v-model:value="detail.name"
                class="width-200"
              />
            </DetailListItem>
            <DetailListItem
              v-if="pid == ''"
              :term="$t('Type')"
              :rules="rules.required"
              name="type"
            >
              <a-select
                :placeholder="$t('unallocated')"
                class="width-200"
                v-model:value="detail.type"
                @change="(e) => handleChange()"
              >
                <a-select-option
                  v-for="(item, index) in types"
                  :key="index"
                  :value="item.name"
                >
                  <span v-if="item.name">{{ item.name }}</span>
                  <i
                    v-if="!item.name"
                    class="gray"
                  >{{ item.name }} </i>
                </a-select-option>
              </a-select>
            </DetailListItem>
            <DetailListItem
              v-else
              :term="$t('Type')"
            >
              {{ detail.type }}
            </DetailListItem>
            <DetailListItem
              :term="$t('Is Gateway')"
              v-if="$isPro"
            >
              <a-switch v-model:checked="detail.content.isGateway" />
            </DetailListItem>
            <DetailListItem
              :rules="rules.required"
              :name="['content', 'gatewayPath']"
              :term="$t('Gateway Path')"
              v-if="detail.content.isGateway && $isPro"
            >
              <a-input
                :placeholder="$t('unset')"
                v-model:value="detail.content.gatewayPath"
                class="width-300"
              />
            </DetailListItem>
            <DetailListItem
              :term="$t('Gateway Port')"
              v-if="detail.content.isGateway && $isPro"
            >
              <a-input-number
                :placeholder="$t('unset')"
                :min="0"
                v-model:value="detail.content.gatewayPort"
                class="width-300"
              />
            </DetailListItem>
            <DetailListItem
              :term="$t('Auto Create')"
              v-if="$isPro && false"
            >
              <a-checkbox v-model:checked="detail.content.autoApplication">
                {{ $t("Application") }}
              </a-checkbox>
              <a-checkbox v-model:checked="detail.content.autoUpstream">
                {{ $t("Upstream") }}
              </a-checkbox>
            </DetailListItem>
          </DetailList>
        </a-col>
        <a-col
          :xl="12"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <DetailList
            size="small"
            :col="1"
          >
            <DetailListItem
              v-if="detail.type != 'k8s'"
              :rules="rules.required"
              name="address"
              :term="$t('Location')"
            >
              <a-textarea
                v-model:value="detail.address"
                :placeholder="$t('protocol://hostname:port')"
                allow-clear
              />
            </DetailListItem>
						
            <DetailListItem
              :term="detail.type == 'k8s'?'K8S Config':$t('Config')"
              :rules="rules.required"
              :name="['config']"
              v-if="detail.type == 'k8s'"
            >
              <a-popover
                trigger="click"
                :destroy-tooltip-on-hide="true"
                title="K8S Config"
              >
                <template #content>
                  <YamlEditor
                    @fetch="getYaml"
                    class="width-500"
                    v-model:value="yamlConfig"
                  />
                </template>
                <a-button class="mr-10">
                  <SnippetsOutlined />
                  {{ $t('Paste') }}
                </a-button>
              </a-popover>
              <a-upload
                v-model:file-list="fileList"
                :before-upload="beforeUpload"
              >
                <a-button>
                  <UploadOutlined />
                  {{ $t('Upload') }}
                </a-button>
              </a-upload>
              <div
                v-if="!!configJson && getCluster"
                class="flex mt-10"
              >
                <div>
                  <a-tag
                    closable
                    @close="clearConfig"
                  >
                    {{ getCluster.server }} ({{ configJson.apiVersion }})
                  </a-tag>
                </div>
                <Status
                  class="inline-block"
                  v-if="!!configJson && configJson.kind == 'Config'"
                  :d="{status:'success'}"
                />
                <Status
                  class="inline-block"
                  v-else-if="!!configJson"
                  :d="{status:'failed'}"
                />
              </div>
            </DetailListItem>
            <DetailListItem
              v-if="detail.type != 'k8s'"
              :term="$t('Credit')"
            >
              <a-textarea
                class="height-90"
                v-model:value="detail.content.credit"
                :placeholder="$t('Please input user:passwor or token')"
                allow-clear
              />
            </DetailListItem>
            <DetailListItem
              :term="$t('Certificate')"
              v-if="false"
            >
              <a-textarea
                class="height-90"
                v-model:value="detail.content.certificate"
                :placeholder="$t('Please input certificate authority data')"
                allow-clear
              />
            </DetailListItem>
          </DetailList>
        </a-col>
      </a-row>
    </template>
    <template #action>
      <a-button
        class="mr-10"
        type="primary"
        @click="pingValidate"
        :loading="connectLoading"
      >
        {{ $t("Connect Registry") }}
      </a-button>
      <a-button
        v-if="pid != ''"
        type="primary"
        @click="validate"
        v-permission="['registry:update']"
      >
        {{ $t("save") }}
      </a-button>
      <a-button
        v-else
        type="primary"
        @click="validate"
        v-permission="['registry:create']"
      >
        {{ $t("create") }}
      </a-button>
    </template>
    <a-row>
      <a-col
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
import { Empty } from "ant-design-vue";
import PageLayout from "@/layouts/PageLayout";
import Status from "@/components/tag/Status";
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
import YamlEditor from "@/components/editor/YamlEditor";
import { mapState } from "vuex";
import {
  UploadOutlined,
  SnippetsOutlined
} from "@ant-design/icons-vue";
let YAML = require("js-yaml");
let YAMLTool = require("json2yaml");
export default {
  name: "RegistryBaseDetail",
  i18n: require("@/i18n"),
  components: {
    DetailListItem,
    DetailList,
    Status,
    UploadOutlined,
    SnippetsOutlined,
    PageLayout,
    YamlEditor,
  },

  props: ["pid", "types"],
  data() {
    return {
      connectLoading: false,
      namespaces: [],
      fileList:[],
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      service: `{
		}`,

      configJson: null,
      yamlConfig: '',
      detail: {
        organization: null,
        type: "k8s",
        name: "",
        config: null,
        content: {
          credit: "",
          autoUpstream: false,
          autoApplication: false,
          isGateway: false,
          gatewayPath: "",
          gatewayPort: 0,
        },

        address: "",
      },

      json: '{ "":"" }',
      config: "",
      loading: true,
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
    getCluster(){
      let cluster = null;
      if(this.configJson && this.configJson.clusters) {
        if(this.configJson['current-context']){
          cluster = this.configJson.clusters.find(c => c.name == this.configJson['current-context']).cluster
        } else {
          cluster = this.configJson.clusters[0].cluster;
        }
      }
      return cluster;
    }
  },
	
  created() {
    if (this.pid != "") {
      this.loaddata();
    } else {
      this.detail = {
        organization: null,
        type: "k8s",
        name: "",
        config: null,
        yamlConfig: '',
        content: {
          credit: "",
          autoUpstream: false,
          autoApplication: false,
          isGateway: false,
          gatewayPath: "",
          gatewayPort: 0
        },

        address: "",
      };
      this.loading = false;
      this.$emit("getDetail", { detail: this.detail });
    }
  },

  methods: {
    clearConfig(){
      this.detail.config = null;
      this.configJson = null;
    },
		
    getYaml(){
      this.detail.config = this.yamlConfig;
      this.configJson = YAML.load(this.yamlConfig);
    },

    convertToYaml(json) {
      if (json == "") {
        return "";
      }
      let _json = JSON.parse(json);
      let _yaml = null;
      //YAML.dump
      _yaml = YAMLTool.stringify(_json);
      return _yaml;
    },

    beforeUpload(file) {
      return new Promise(() => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if(reader.result){
            let configText = atob(reader.result.split("base64,")[1]);
            this.detail.config = configText;
            this.configJson = YAML.load(configText);
            this.yamlConfig = this.convertToYaml(JSON.stringify(this.configJson));
          }
        };
      });
    },

    valid() {
      if (this.detail.name == "") {
        this.$message.error(this.$t("The name cannot be empty"), 3);
        return false;
      }
      return true;
    },

    saved(id) {
      if (this.pid != "") {
        this.$message.success(this.$t("Save successfully"), 3);
        this.$closePage(this.$route);
      } else {
        this.$message.success(this.$t("Created successfully"), 3);

        this.$router.push({
          path: "/ops-center/registry/detail/" + id,
        });
        this.$closePage(this.$route);
      }
    },

    pingValidate() {
      this.$refs.layout.$refs.form
        .validateFields()
        .then(() => {
          this.ping();
        })
        .catch(() => {});
    },

    validate() {
      this.$refs.layout.$refs.form
        .validateFields()
        .then(() => {
          this.save();
        })
        .catch(() => {});
    },

    ping() {
      if (!this.valid()) {
        return;
      }
      let savedata = _.cloneDeep(this.detail);
      delete savedata.services;
      delete savedata.L4LBs;
      delete savedata.id;
      delete savedata.namespaces;
      delete savedata.L7Lbs;
      delete savedata.yamlConfig;
      this.connectLoading = true;
      this.$gql
        .mutation(
          `pingRegistry(data: $data)`,
          {
            data: savedata,
          },
          {
            data: "RegistryInput",
          },
        )
        .then((res) => {
          this.connectLoading = false;
          if (res.isOK) {
            this.$message.success(this.$t("Connect successfully"), 3);
          } else {
            this.$message.error(res.error, 3);
          }
        });
    },

    save() {
      if (!this.valid()) {
        return;
      }
      let savedata = _.cloneDeep(this.detail);
      delete savedata.services;
      delete savedata.L4LBs;
      delete savedata.namespaces;
      delete savedata.L7Lbs;
      delete savedata.yamlConfig;
      if (this.pid != "") {
        delete savedata.id;
        this.$gql
          .mutation(
            `updateRegistry(id:${this.pid}, data: $data){data{id}}`,
            {
              data: savedata
            },
            {
              data: "RegistryInput!",
            },
          )
          .then(() => {
            this.saved();
          });
      } else {
        this.$gql
          .mutation(
            `createRegistry(data: $data){data{id}}`,
            {
              data: savedata
            },
            {
              data: "RegistryInput!",
            },
          )
          .then((res) => {
            this.saved(res.data.id);
          });
      }
    },

    handleChange() {},
    hide() {
      this.visible = false;
      this.save();
    },

    loaddata() {
      this.loading = true;
      this.$gql
        .query(
          `registry(id: ${this.pid}){data{id,attributes{
						name,
						type,
						address,
						config,
						content,
						namespaces(pagination: {limit: 9999 }){data{id,attributes{
							name,
							organization{data{id,attributes{name}}},
							services(pagination: {limit: 9999 }){data{id,attributes{
								uid,
								gatewayPath,
								deleted,
								fleet{data{id,attributes{name}}},
								organization{data{id,attributes{name}}},
								namespace,
								name,
								registry{data{id,attributes{name}}},
								content,
								createdAt
							}}}
						}}}
					}}}`,
        )
        .then((res) => {
          this.detail = res.data;
          if (!this.detail.content) {
            this.detail.content = {};
          }
          if (!this.detail.content.credit) {
            this.detail.content.credit = "";
          }
          if (!!this.detail.config) {
            this.configJson = YAML.load(this.detail.config);
            this.yamlConfig = this.convertToYaml(JSON.stringify(this.configJson));
          }else{
            this.configJson = null;
            this.yamlConfig = this.convertToYaml("{}");
          }
          if (this.detail.content.autoUpstream == null) {
            this.detail.content.autoUpstream = false;
          }
          if (this.detail.content.autoApplication == null) {
            this.detail.content.autoApplication = false;
          }
          if (this.detail.namespaces) {
            let _find = false;
            this.detail.namespaces.forEach((ns) => {
              ns.organizationId = ns.organization ? ns.organization.id : null;
              if (ns.services.length > 0) {
                ns.services.forEach((s) => {
                  s.organization = s.organization ? s.organization : {id: null},
                  s.enabled = !s.deleted;
                })
                if(!_find){
                  _find = true;
                  this.selectedKeys = ns.id;
                  this.selectedNS = ns;
                }
              }
            });
          }
          this.loading = false;
          this.namespaces = res.data.namespaces;
          this.$emit("getDetail", {
            detail: this.detail,
            namespaces: this.namespaces,
            selectedNS: this.selectedNS,
            selectedKeys: this.selectedKeys,
          });
        });
    },
  },
};
</script>
