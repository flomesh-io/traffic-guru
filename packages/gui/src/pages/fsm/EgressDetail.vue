<template>
  <PageLayout
    :title="$t('Egress')"
    :form-state="detail.metadata"
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
          :term="$t('as')"
          :rules="rules.name"
          name="name"
        >
          <a-input
            :placeholder="$t('unset')"
            v-model:value="detail.metadata.name"
            class="bold width-300"
          />
        </DetailListItem>
        <DetailListItem :term="$t('Namespace')">
          {{
            detail.metadata.namespace
          }}
        </DetailListItem>
        <DetailListItem :term="$t('protocol')">
          <a-select
            v-model:value="detail.metadata.protocol"
            class="width-200"
          >
            <a-select-option value="HTTP">
              HTTP
            </a-select-option>
            <a-select-option value="Socks">
              Socks
            </a-select-option>
            <a-select-option value="TCP">
              TCP
            </a-select-option>
          </a-select>
        </DetailListItem>
        <DetailListItem
          v-if="pid"
          :term="$t('Creation Timestamp')"
        >
          {{
            creationTimestamp
          }}
        </DetailListItem>
      </DetailList>

      <DetailList
        v-if="pid"
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
            v-if="!labelVisible"
            @click="labelShowInput"
            class="dashed-tag"
          >
            <PlusOutlined />
            { {$t('add') }}
          </a-tag>
        </DetailListItem>
        <DetailListItem :term="$t('Annotations')">
          <a-tag
            :key="index"
            v-for="(key, index) in Object.keys(
              detail.metadata.annotations || [],
            )"
            :closable="true"
            @close="handleClose(detail.metadata.annotations, key)"
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
            v-if="!annotationVisible"
            @click="annotationShowInput"
            class="dashed-tag"
          >
            <PlusOutlined />
            {{ $t("add") }}
          </a-tag>
        </DetailListItem>
      </DetailList>
    </template>
    <template #action>
      <a-button
        type="primary"
        @click="validate"
        v-permission="['egress:update']"
        v-if="pid != ''"
      >
        {{ $t("save") }}
      </a-button>
      <a-button
        type="primary"
        @click="validate"
        v-permission="['egress:create']"
        v-else
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
            :tab="$t('Overview')"
          >
            <a-card
              v-if="detail.metadata.protocol == 'Socks'"
              class="card mb-20"
              :bordered="false"
              :loading="loading"
              :title="$t('Socks')"
            >
              <DetailList
                size="small"
                :col="1"
              >
                <DetailListItem
                  :term="$t('port')"
                >
                  <a-input
                    :placeholder="$t('unset')"
                    v-model:value="port"
                    class="wdith-300"
                  />
                </DetailListItem>
              </DetailList>

              <a-row class="row-mg">
                <a-col
                  class="col-pd"
                  :xl="12"
                  :lg="24"
                  :md="24"
                  :sm="24"
                  :xs="24"
                >
                  <IPList
                    :fixed-type="4"
                    :title="$t('IP White List')"
                    :list="whiteAddress"
                    ref="whiteip"
                  />
                </a-col>
                <a-col
                  class="col-pd"
                  :xl="12"
                  :lg="24"
                  :md="24"
                  :sm="24"
                  :xs="24"
                >
                  <IPList
                    :fixed-type="4"
                    :title="$t('IP Black List')"
                    :list="blackAddress"
                    ref="blackip"
                  />
                </a-col>
              </a-row>
            </a-card>

            <a-card
              v-if="detail.metadata.protocol == 'HTTP'"
              class="card mb-20"
              :bordered="false"
              :loading="loading"
              :title="$t('HTTP')"
            />
            <a-card
              v-if="detail.metadata.protocol == 'TCP'"
              class="card mb-20"
              :bordered="false"
              :loading="loading"
              :title="$t('TCP')"
            />
          </a-tab-pane>
          <a-tab-pane
            key="3"
            :tab="$t('Strategy')"
          >
            <a-card
              class="card mb-24"
              :bordered="false"
            >
              <template #title>
                <a-button @click="getDefaultPjsConfig">
                  {{
                    $t("reset")
                  }}
                </a-button>
              </template>
              <JsEditor
                :value="pjsConfig"
                @input="pjsChange"
              />
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </PageLayout>
</template>

<script>
import JsonEditor from "@/components/editor/JsonEditor";
import JsEditor from "@/components/editor/JsEditor";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
import { mapState } from "vuex";
import IPList from "@/components/table/IPList";
import { restructAddress, buildAddress } from "@/utils/util.js";
import { PlusOutlined } from "@ant-design/icons-vue";
import _ from "lodash";

export default {
  name: "EgressDetail",
  i18n: require("@/i18n"),
  components: {
    JsEditor,
    IPList,
    JsonEditor,
    DetailListItem,
    DetailList,
    PageLayout,
    PlusOutlined,
  },

  data() {
    return {
      labelVisible: false,
      labelValue: "",
      annotationVisible: false,
      creationTimestamp: "-",
      annotationValue: "",
      pjsConfig: "",
      detail: {
        metadata: {
          name: "",
          protocol: "Socks",
          labels: {},
          annotations: {},
        },

        typeMeta: {},
        selector: {},
      },

      loading: true,
      port: "",
      pid: "",
      namespace: "",
      whiteAddress: [],
      blackAddress: [],
      isMounted: false,
      metrics: [],
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
    this.namespace =
      this.$route.params.namespace || localStorage.getItem("NAMESPACE");
    this.getDefaultPjsConfig();
  },

  mounted() {
    this.isMounted = true;

    if (this.pid != "") {
      this.search();
    } else {
      this.detail = {
        metadata: {
          name: "",
          namespace: this.namespace,
          protocol: "Socks",
          labels: {},
          annotations: {},
        },

        typeMeta: {},
        selector: {},
      };
      this.loading = false;
    }
  },

  methods: {
    handleClose(list, index) {
      delete list[index];
    },

    pjsChange(json) {
      this.pjsConfig = json;
    },

    getDefaultPjsConfig() {
      fetch("pipy-4lb.js")
        .then((res) => {
          return res.text();
        })
        .then((text) => {
          this.pjsConfig = text;
        })
        .catch((e) => {
          console.log(e.message);
        });
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
        this.detail.metadata.labels = this.detail.metadata.labels || {};
        this.detail.metadata.labels[vals.shift()] = vals.join(":");
        this.labelValue = "";
        this.labelVisible = false;
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
        this.detail.metadata.annotations =
          this.detail.metadata.annotations || {};
        this.detail.metadata.annotations[vals.shift()] = vals.join(":");
        this.annotationValue = "";
        this.annotationVisible = false;
      }
    },

    search() {
      this.loading = true;
      this.$gql
        .query(`getEgress(id: ${this.pid}){data{id,attributes{content,createdAt}}}`)
        .then((d) => {
          let res = d.data;
          this.loading = false;
          this.creationTimestamp = new Date(res.createdAt).toLocaleString();
          this.detail = res.content;
          if (this.detail.metadata.protocol == "Socks") {
            this.port = this.detail.socks.port;
            this.whiteAddress = restructAddress(
              this.detail.socks.whiteAddress,
            );
            this.blackAddress = restructAddress(
              this.detail.socks.blackAddress,
            );
          }
        });
    },

    valid() {
      if (this.detail.metadata.name == "") {
        this.$message.error(this.$t("The name cannot be empty"), 3);
        return false;
      } else if (
        this.detail.metadata.protocol == "Socks" &&
        this.port == ""
      ) {
        this.$message.error(this.$t("Port is required"), 3);
        return false;
      } else if (
        this.detail.metadata.protocol == "Socks" &&
        isNaN(this.port)
      ) {
        this.$message.error(this.$t("The port can only enter numbers"), 3);
        return false;
      }
      return this.$refs.whiteip.valid() && this.$refs.blackip.valid();
    },

    save() {
      if (!this.valid()) {
        return;
      }
      let savedata = _.cloneDeep(this.detail);
      if (this.detail.metadata.protocol == "Socks") {
        savedata.socks = {
          port: this.port,
          whiteAddress: buildAddress(this.whiteAddress),
          blackAddress: buildAddress(this.blackAddress),
        };
      }
      if (this.pid != "") {
        this.$gql
          .mutation(
            `updateEgressSync(id:${this.pid}, data: $data){data{id}}`,
            {
              data: {
                name: this.detail.metadata.name,
                content: savedata,
              },
            },
            { data: "EgressInput!" },
          )
          .then(() => {
            this.$message.success(this.$t("Save successfully"), 3);
            this.$closePage(this.$route);
          });
      } else {
        this.$gql
          .mutation(
            `createEgressSync(data: $data){data{id}}`,
            {
              data: {
                name: this.detail.metadata.name,
                content: savedata,
              },
            },
            { data: "EgressInput!" },
          )
          .then((res) => {
            this.pid = res.data.id;
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

<style lang="less" scoped></style>
