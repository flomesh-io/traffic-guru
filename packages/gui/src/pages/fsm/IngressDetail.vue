<template>
  <PageLayout
    :title="$t('Ingress')"
    :form-state="detail"
    ref="layout"
  >
    <template #headerContent>
      <DetailList
        size="small"
        :col="1"
        style="width: 60%"
      >
        <DetailListItem
          v-if="pid != ''"
          :term="$t('UID')"
        >
          {{
            detail.content.metadata?.uid
          }}
        </DetailListItem>
        <DetailListItem
          :term="$t('as')"
          :rules="rules.uniqueName('ingresses',{id:pid,namespace:detail.namespace?.id})"
          name="name"
        >
          <a-input
            :placeholder="$t('unset')"
            v-model:value="detail.name"
            class="bold width-300"
          />
        </DetailListItem>
        <DetailListItem :term="$t('Namespace')">
          <EnvSelector
            :no-all="true"
            v-model:namespace="detail.namespace"
            :is-filter="true"
            @envChange="envChange"
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
      <DetailList
        size="small"
        :col="1"
      >
        <DetailListItem :term="$t('Labels')">
          <a-tag
            :key="index"
            v-for="(key, index) in Object.keys(
              detail.content.metadata.labels || [],
            )"
            @close="handleClose(detail.content.metadata.labels, key)"
            :closable="true"
          >
            {{ key }}:{{ detail.content.metadata.labels[key] }}
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
            v-permission="['ingress:update']"
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
              detail.content.metadata.annotations || [],
            )"
            @close="handleClose(detail.content.metadata.annotations, key)"
            :closable="true"
            class="mb-5"
          >
            <span v-if="key == 'objectset.rio.cattle.io/applied'">
              <a-tooltip
                placement="topLeft"
                :title="detail.content.metadata.annotations[key]"
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
                    :value="detail.content.metadata.annotations[key]"
                  />
                </template>
                <a
                  class="font-primary"
                  href="javascript:void(0)"
                >{{ key }}</a>
              </a-popover>
            </span>
            <span
              v-else
            >{{ key }}:{{ detail.content.metadata.annotations[key] }}</span>
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
            v-permission="['ingress:update']"
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
        v-permission="['ingress:update']"
        v-if="pid != ''"
      >
        {{ $t("save") }}
      </a-button>
      <a-button
        type="primary"
        @click="validate"
        v-permission="['ingress:create']"
        v-else
      >
        {{ $t("create") }}
      </a-button>
    </template>
    <a-tabs type="card">
      <a-tab-pane
        key="1"
        :tab="$t('Overview')"
      >
        <a-row class="row-mg">
          <a-col
            :key="index2"
            v-for="(table, index2) in [
              { s: 24, t: $t('Rules'), c: ruledataColumns, d: detail.rules },
              {
                s: 12,
                t: $t('Default Backend'),
                c: defaultColumns,
                d: detail.defaultBackend,
              },
              { s: 12, t: $t('Secret'), c: secretColumns, d: detail.tls },
            ]"
            class="col-pd"
            :xl="table.s"
            :lg="24"
            :md="24"
            :sm="24"
            :xs="24"
          >
            <a-card
              class="card mb-20 nopd"
              :bordered="false"
              :loading="loading"
              :title="table.t"
            >
              <template #extra>
                <a
                  v-permission="['ingress:update']"
                  v-show="index2 != 1 || (index2 == 1 && table.d.length == 0)"
                  @click="addRule(index2)"
                  :class="detail.namespace ? '' : 'disabed-element'"
                  href="javascript:void(0)"
                >
                  <PlusCircleTwoTone class="font-20" />
                </a>
              </template>

              <a-table
                :pagination="false"
                :columns="table.c"
                :data-source="table.d"
                :loading="loading"
                class="bg-white"
              >
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.dataIndex === 'host'">
                    <FormItem
                      :name="['tls', index, 'host']"
                      :cond="index2 == 2"
                      :rules="rules.required"
                    >
                      <div v-if="record.isedit && index2 == 2">
                        <a-textarea
                          class="edit-input"
                          v-model:value="record.host"
                          :placeholder="$t('unset')"
                          :rows="2"
                        />
                        <div class="font-s gray mt-10">
                          {{ $t("List of host") }}
                        </div>
                      </div>
                      <div v-else-if="record.isedit && index2 == 0">
                        <a-input
                          v-model:value="record.host"
                          class="edit-input"
                        />
                      </div>
                      <div v-else>
                        {{ record.host || "-" }}
                      </div>
                    </FormItem>
                  </template>
                  <template v-else-if="column.dataIndex === 'path'">
                    <FormItem
                      :name="['rules', index, 'path']"
                      :rules="rules.required"
                    >
                      <a-input
                        v-if="record.isedit"
                        v-model:value="record.path"
                        class="edit-input"
                      />
                      <div v-else>
                        {{ record.path || "-" }}
                      </div>
                    </FormItem>
                  </template>

                  <template v-else-if="column.dataIndex === 'pathType'">
                    <a-select
                      class="width-200"
                      v-if="record.isedit"
                      v-model:value="record.pathType"
                    >
                      <a-select-option
                        :value="pathType"
                        v-for="(pathType, pathIdx) in pathTypes"
                        :key="pathIdx"
                      >
                        {{ pathType }}
                      </a-select-option>
                    </a-select>
                    <div v-else>
                      {{ record.pathType || "-" }}
                    </div>
                  </template>
                  <template v-else-if="column.dataIndex === 'serviceName'">
                    <FormItem
                      :name="
                        [
                          ['rules', index, 'service'],
                          ['defaultBackend', index, 'service'],
                          null,
                        ][index2]
                      "
                      :rules="rules.objectRequired"
                    >
                      <div v-if="record.isedit">
                        <div
                          class="full"
                          v-if="record.service"
                        >
                          <CloseOutlined
                            v-if="!detailType"
                            @click="
                              () => {
                                record.service = null;
                              }
                            "
                            class="absolute icon-menu rotate-icon"
                            style="right: 10px; top: -5px"
                          />
                          <DatabaseOutlined class="font-20 mr-10 primary" />
                          <a
                            class="pointer relative"
                            style="top: -2px"
                          ><b>{{ record.service.name }}</b></a>
                        </div>
                        <CardSelector
                          :loading="selectorLoading"
                          :width="400"
                          :col="2"
                          :env-filter="false"
                          :search="true"
                          placement="right"
                          :icon="DatabaseOutlined"
                          @select="
                            (service) => {
                              saveService(record, service);
                            }
                          "
                          :get-tag="
                            (item) => {
                              return item.clusterName + ' / ' + item.namespace;
                            }
                          "
                          :options="services"
                        >
                          <a v-if="!record.service">
                            <a-tag
                              color="#00adef"
                              key="submit"
                              type="primary"
                            >
                              {{ $t("Select k8s service") }}
                            </a-tag>
                          </a>
                        </CardSelector>
                      </div>
                      <div v-else>
                        <a
                          href="javascript:void(0)"
                          @click="servicedetail(text)"
                        >{{ record.service?.name || "-" }}</a>
                      </div>
                    </FormItem>
                  </template>
                  <template v-else-if="column.dataIndex === 'servicePort'">
                    <FormItem
                      :name="
                        [
                          ['rules', index, 'servicePort'],
                          ['defaultBackend', index, 'servicePort'],
                          null,
                        ][index2]
                      "
                      :rules="rules.numberRequired"
                    >
                      <a-input-number
                        v-if="record.isedit"
                        v-model:value="record.servicePort"
                        class="edit-input"
                      />
                      <div v-else>
                        {{ record.servicePort || "-" }}
                      </div>
                    </FormItem>
                  </template>
                  <template v-else-if="column.dataIndex === 'secret'">
                    <a-select
                      class="width-100"
                      v-if="record.isedit"
                      v-model:value="record.secret"
                    >
                      <a-select-option
                        :value="certificate.id"
                        :key="certificateIdx"
                        v-for="(certificate, certificateIdx) in certificates"
                      >
                        {{ certificate.name }}
                      </a-select-option>
                    </a-select>
                    <div v-else>
                      {{ record.secret || "-" }}
                    </div>
                  </template>

                  <template v-else-if="column.dataIndex === 'action'">
                    <div class="editable-row-operations">
                      <span v-if="record.isedit">
                        <a
                          @click="cancel(record)"
                        ><CheckOutlined
                          class="icon-menu"
                        /></a>
                      </span>
                      <span v-else>
                        <a
                          v-permission="['ingress:update']"
                          @click="edit(record)"
                        ><EditOutlined
                          class="icon-menu"
                        /></a>
                      </span>
                      <a
                        v-permission="['ingress:update']"
                        @click="remove(index2, index)"
                      ><CloseOutlined
                        class="icon-menu"
                      /></a>
                    </div>
                  </template>
                </template>
              </a-table>
            </a-card>
            <!--
              <a-card
              class="card nopd mb-20"
              :bordered="false"
              :loading="loading"
              :title="$t('Endpoints')"
							
              >
              <template #extra
              ><a @click="addEndpoints" href="javascript:void(0)"
              ><PlusCircleTwoTone class="font-20" /></a
              ></template>
              <a-table
              :pagination="false"
              :columns="dataColumns"
              :dataSource="detail.endpoints"
              :loading="loading"
              class="bg-white"
              >
              <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'host'">
              <a-input
              v-if="record.isedit"
              v-model:value="record.host"
              class="edit-input"
              />
              <div v-else>
              <a :href="'http://' + record.host" target="_blank">{{
              record.host || '-'
              }}</a>
              </div>
              </template>
              <template v-else-if="column.dataIndex === 'ports'">
              <div v-if="record.isedit">
              <a-textarea v-model:value="record.port_val" placeholder="" allow-clear />
              <div class="textarea-tip">
              {{ $t('List of name/port/protocol') }}
              </div>
              </div>
              <div v-else>
              <pre>{{ record.port_val.trim() || '-' }}</pre>
              </div>
              </template>
              <template v-else-if="column.dataIndex === 'nodeName'">
              <a-input
              v-if="record.isedit"
              v-model:value="record.nodeName"
              class="edit-input"
              />
              <div v-else>
              {{ record.nodeName || '-' }}
              </div>
              </template>
              <template v-else-if="column.dataIndex === 'ready'">
              <a-input
              v-if="record.isedit"
              v-model:value="record.ready"
              class="edit-input"
              />
              <div v-else>
              {{ record.ready || '-' }}
              </div>
              </template>

              <template v-else-if="column.dataIndex === 'action'">
              <div class="editable-row-operations">
              <span v-if="record.isedit">
              <a @click="cancel(record)"><CheckOutlined /></a>
              </span>
              <span v-else>
              <a @click="edit(record)"><EditOutlined /></a>
              </span>
              </div>
              </template>
              </template>
              </a-table>
              </a-card> 
            -->
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        :tab="$t('Strategy')"
        v-if="false"
      >
        <a-card
          class="card mb-24"
          :bordered="false"
        >
          <template #title>
            <a-button @click="getDefaultPjsConfig">
              {{ $t("reset") }}
            </a-button>
          </template>
          <template #extra>
            <a-button
              type="primary"
              @click="excute"
            >
              {{
                $t("Execute")
              }}
            </a-button>
          </template>
          <JsEditor
            :value="pjsConfig"
            @input="pjsChange"
          />
        </a-card>
      </a-tab-pane>
      <a-tab-pane
        key="3"
        :tab="$t('Grayscale Publishing')"
        v-if="false"
      >
        <a-card
          class="card mb-24"
          :bordered="false"
        >
          <template #title>
            <a-button @click="getDefaultPjsConfig">
              {{ $t("reset") }}
            </a-button>
          </template>
          <template #extra>
            <a-button
              type="primary"
              @click="excute"
            >
              {{
                $t("Execute")
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
  </PageLayout>
</template>

<script>
import FormItem from "@/components/tool/FormItem";
import JsEditor from "@/components/editor/JsEditor";
import JsonEditor from "@/components/editor/JsonEditor";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import { mapState } from "vuex";
import DetailListItem from "@/components/tool/DetailListItem";
import EnvSelector from "@/components/menu/EnvSelector";
import CardSelector from "@/components/card/CardSelector";
import _ from "lodash";
import {
  PlusOutlined,
  PlusCircleTwoTone,
  EditOutlined,
  CloseOutlined,
  DatabaseOutlined,
  CheckOutlined,
} from "@ant-design/icons-vue";
const columns = [
  {
    key: "Host",
    dataIndex: "host",
  },
  {
    key: "Ports(Name/Port/Protocol)",
    dataIndex: "ports",
  },
  {
    key: "node",
    dataIndex: "nodeName",
  },
  {
    key: "Ready",
    dataIndex: "ready",
  },
  {
    key: "Action",
    dataIndex: "action",
  },
];
const rulecolumns = [
  {
    key: "Path Type",
    dataIndex: "pathType",
  },
  {
    key: "Path",
    dataIndex: "path",
  },
  {
    key: "Host",
    dataIndex: "host",
  },
  {
    key: "Service",
    dataIndex: "serviceName",
  },
  {
    key: "Service Port",
    dataIndex: "servicePort",
  },
  {
    key: "Action",
    dataIndex: "action",
  },
];
const defaultBackendcolumns = [
  {
    key: "Service",
    dataIndex: "serviceName",
  },
  {
    key: "Service Port",
    dataIndex: "servicePort",
  },
  {
    key: "Action",
    dataIndex: "action",
  },
];

const secretrulecolumns = [
  {
    key: "Host",
    dataIndex: "host",
  },
  {
    key: "TLS Secret",
    dataIndex: "secret",
  },
  {
    key: "Action",
    dataIndex: "action",
  },
];
const ingressMock = {
  apiVersion: "networking.k8s.io/v1",
  kind: "Ingress",
  spec: {ingressClassName: "pipy"},
};

export default {
  name: "IngressDetail",
  i18n: require("@/i18n"),
  components: {
    JsEditor,
    JsonEditor,
    DetailListItem,
    DetailList,
    PageLayout,
    PlusOutlined,
    PlusCircleTwoTone,
    EditOutlined,
    CloseOutlined,
    FormItem,
    EnvSelector,
    DatabaseOutlined,
    CardSelector,
    CheckOutlined,
  },

  data() {
    return {
      certificates: [],
      labelVisible: false,
      labelValue: "",
      annotationVisible: false,
      creationTimestamp: "-",
      annotationValue: "",
      pathTypes: ["Prefix", "Exact", "Mixed"],
      detail: {
        name: "",
        namespace: null,
        tls: [],
        rules: [],
        defaultBackend: [],
        content: {
          metadata: { name: "", namespace: "", labels: {}, annotations: {} },
        },
      },

      selectorLoading: true,
      services: [],
      loading: true,
      pid: "",
      pjsConfig: "",
      namespace: "",
      isMounted: false,
      metrics: [],
      columns,
      rulecolumns,
      secretrulecolumns,
      defaultBackendcolumns,
    };
  },

  computed: {
    ...mapState({
      rules: state => state.rules.rules,
      isMobile: state => state.setting.isMobile,
    }),

    dataColumns() {
      return this.columns.map((column) => {
        column.title = this.$t(column.key);
        return column;
      });
    },

    ruledataColumns() {
      return this.rulecolumns.map((column) => {
        column.title = this.$t(column.key);
        return column;
      });
    },

    defaultColumns() {
      return this.defaultBackendcolumns.map((column) => {
        column.title = this.$t(column.key);
        return column;
      });
    },

    secretColumns() {
      return this.secretrulecolumns.map((column) => {
        column.title = this.$t(column.key);
        return column;
      });
    },
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
        namespace: null,
        name: "",
        rules: [],
        tls: [],
        defaultBackend: [],
        content: {
          metadata: { name: "", namespace: "", labels: {}, annotations: {} },
        },
      };
      this.loading = false;
    }
  },

  methods: {
    build(mode) {
      let _d = null;
      if (mode == "create") {
        _d = _.cloneDeep(ingressMock);
      } else {
        _d = _.cloneDeep(this.detail.content);
        delete _d.tls;
        delete _d.rules;
      }
      //tls
      if (this.detail.tls.length > 0) {
        _d.spec.tls = [];
      }
      this.detail.tls.forEach((t) => {
        let _item = {
          secretName: t.secret,
        };
        if (t.host) {
          _item.hosts = t.host.split("\n");
        }
        _d.spec.tls.push(_item);
      });
      //rules
      if (this.detail.rules.length > 0) {
        _d.spec.rules = [];
      }
      this.detail.rules.forEach((t) => {
        let findIndex = -1;
        _d.spec.rules.forEach((r, idx) => {
          if (r.host == t.host || (!r.host && !t.host)) {
            findIndex = idx;
          }
        });
        let _item = {
          path: t.path,
          pathType: t.pathType,
          backend: { service: { name: t.service.name } },
        };
        if (t.servicePort) {
          _item.backend.service.port = { number: t.servicePort };
        }
        if (findIndex == -1) {
          if (t.host) {
            _d.spec.rules.push({ host: t.host, http: { paths: [] } });
          } else {
            _d.spec.rules.push({ http: { paths: [] } });
          }
          findIndex = _d.spec.rules.length - 1;
        }
        _d.spec.rules[findIndex].http.paths.push(_item);
      });
      //defaultBackend
      this.detail.defaultBackend.forEach((_defaultBackend) => {
        _d.spec.defaultBackend = { service: { name: "" } };
        _d.spec.defaultBackend.service.name = _defaultBackend.service.name;
        if (_defaultBackend.servicePort) {
          _d.spec.defaultBackend.service.port = {
            number: _defaultBackend.servicePort,
          };
        }
      });
      _d.metadata = this.detail.content.metadata;
      _d.metadata.name = this.detail.name;
      _d.metadata.namespace = this.detail.namespace.name;
      this.detail.content = _d;
    },

    reset() {
      //defaultBackend
      const _d = this.detail.content;
      this.detail.defaultBackend = [];
      if (_d.spec.defaultBackend) {
        this.detail.defaultBackend.push({
          isedit: false,
          service: { name: _d.spec.defaultBackend.service.name },
          servicePort: _d.spec.defaultBackend.service.port?.number || "",
        });
      }
      //rules
      this.detail.rules = [];
      _d.spec.rules.forEach((a) => {
        a.http.paths.forEach((b) => {
          this.detail.rules.push({
            isedit: false,
            host: a.host,
            service: { name: b.backend.service.name },
            servicePort: b.backend.service.port?.number || "",
            path: b.path,
            pathType: b.pathType,
          });
        });
      });
      //tls
      this.detail.tls = [];
      (_d.spec.tls||[]).forEach((a) => {
        this.detail.tls.push({
          isedit: false,
          secret: a.secretName,
          host: a.hosts ? a.hosts.join("\n") : "",
        });
      });
    },

    handleClose(list, index) {
      delete list[index];
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
        this.detail.content.metadata.labels =
          this.detail.content.metadata.labels || {};
        this.detail.content.metadata.labels[vals.shift()] = vals.join(":");
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
        this.detail.content.metadata.annotations =
          this.detail.content.metadata.annotations || {};
        this.detail.content.metadata.annotations[vals.shift()] =
          vals.join(":");
        this.annotationValue = "";
        this.annotationVisible = false;
      }
    },

    addEndpoints() {
      this.detail.endpoints = this.detail.endpoints || [];
      this.detail.endpoints.push({
        isedit: true,
        host: "",
        port_val: "",
        nodeName: "",
        ready: "",
      });
    },

    addRule(type) {
      if (type == 0) {
        this.detail.rules = this.detail.rules || [];
        this.detail.rules.push({
          isedit: true,
          host: "",
          service: null,
          serviceName: "",
          servicePort: "",
          path: "",
          pathType: "Prefix",
        });
      } else if (type == 1) {
        this.detail.defaultBackend = this.detail.defaultBackend || [];
        this.detail.defaultBackend.push({
          isedit: true,
          service: null,
          serviceName: "",
          servicePort: "",
        });
      } else if (type == 2) {
        this.detail.tls = this.detail.tls || [];
        this.detail.tls.push({
          isedit: true,
          secret: null,
          host: "",
        });
      }
    },

    remove(type, index) {
      if (type == 0) {
        this.detail.rules.splice(index, 1);
      } else if (type == 1) {
        this.detail.defaultBackend.splice(index, 1);
      } else if (type == 2) {
        this.detail.tls.splice(index, 1);
      }
    },

    cancel(obj) {
      obj.isedit = false;
    },

    edit(obj) {
      obj.isedit = true;
    },

    excute() {
      this.$message.loading({
        content: this.$t("Running..."),
        key: "excute",
      });
      setTimeout(() => {
        this.$message.success({
          content: this.$t("Publish success!"),
          key: "excute",
          duration: 2,
        });
      }, 1000);
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

    onTabChange(key) {
      console.log(key);
    },

    getServices() {
      this.selectorLoading = true;
      const where = {
        namespace: this.detail.namespace.name,
        registry: this.detail.namespace.registry.id,
      };
      this.$gql
        .query(
          `servicesConnection(start: 0, limit: -1, where: $where){values{id,uid,namespace,name,registry{id,name},content,created_at},aggregate{totalCount}}`,
          { where },
        )
        .then((res) => {
          this.selectorLoading = false;
          this.services = res.values;
          this.services.forEach((n) => {
            n.name = n.name ? n.name : n.metadata.name;
            if (n.registry) {
              n.clusterName = n.registry.name;
            } else if (n.fleet) {
              n.clusterName = n.fleet.name;
            } else {
              n.clusterName = "-";
            }
          });
        });
    },

    saveService(item, service) {
      item.service = service;
    },

    search() {
      this.loading = true;
      this.$gql
        .query(
          `getIngress(id: ${this.pid}){id,content,namespace{id,name,registry{id,name}},name,created_at}`,
        )
        .then((res) => {
          this.loading = false;
          this.creationTimestamp = new Date(res.created_at).toLocaleString();
          this.detail = res;
          this.reset();
          this.envChange();
        });
    },

    valid() {
      if (this.detail.name == "") {
        this.$message.error(this.$t("The name cannot be empty"), 3);
        return false;
      }
      return true;
    },

    save() {
      if (!this.valid()) {
        return;
      }
      this.build(this.pid != "" ? "update" : "create");
      let savedata = _.cloneDeep(this.detail.content);
      if (this.pid != "") {
        this.$gql
          .mutation(
            `updateIngressSync(input: $input){id}`,
            {
              input: {
                where: { id: this.pid },
                data: {
                  name: this.detail.name,
                  namespace: this.detail.namespace.id,
                  content: savedata,
                },
              },
            },
            { input: "updateIngressInput" },
          )
          .then(() => {
            this.$message.success(this.$t("Save successfully"), 3);
            this.$closePage(this.$route);
          });
      } else {
        this.$gql
          .mutation(
            `createIngressSync(input: $input){id}`,
            {
              input: {
                data: {
                  name: this.detail.name,
                  content: savedata,
                  namespace: this.detail.namespace.id,
                },
              },
            },
            { input: "createIngressInput" },
          )
          .then((res) => {
            this.pid = res.id;
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

    servicedetail(id) {
      this.$router.push({
        path: "/fsm/service/detail/" + id,
      });
    },

    envChange() {
      if(this.detail.namespace?.id){
        this.getCertificates();
      }
      if(this.detail.namespace?.registry?.id){
        this.getServices();
      }
    },

    getCertificates() {
      this.$gql
        .query(
          `certificates(start: 0, limit: -1, where: $where){id,name,type,namespace{id,name,registry{id,name}},content}`,
          { where: { type: "k8s", namespace: this.detail.namespace.id } },
        )
        .then((res) => {
          this.certificates = res;
          this.certificates.forEach((certificate) => {
            certificate.id = certificate.name;
          });
          this.certificates = [
            { id: null, name: this.$t("unset") },
            ...this.certificates,
          ];
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
