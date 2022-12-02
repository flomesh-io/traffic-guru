<template>
  <a-row class="row-mg">
    <a-col
      class="col-pd"
      :xl="pid != '' && $isPro ? 16 : 24"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24"
    >
      <a-card
        class="card mb-20"
        :bordered="false"
        :loading="loading"
        v-if="registry.type == 'k8s'"
        :title="$t('Resource Info')"
      >
        <DetailList
          size="small"
          :col="3"
        >
          <DetailListItem
            :term="$t('Type')"
          >
            <a-input
              :placeholder="$t('unset')"
              v-model:value="detail.spec.type"
            />
          </DetailListItem>
          <DetailListItem
            :term="$t('Cluster IP')"
          >
            <a-input
              :placeholder="$t('unset')"
              v-model:value="detail.spec.clusterIP"
            />
          </DetailListItem>
          <DetailListItem :term="$t('Session Affinity')">
            <a-input
              :placeholder="$t('unset')"
              v-model:value="detail.spec.sessionAffinity"
            />
          </DetailListItem>
        </DetailList>
        <DetailList
          size="small"
          :col="1"
        >
          <DetailListItem
            v-if="detail.spec.containerImages"
            :term="$t('Container Images')"
          >
            <a-tag
              :key="index"
              v-for="(item, index) in detail.containerImages"
              :closable="false"
            >
              {{ item }}
            </a-tag>
          </DetailListItem>
          <DetailListItem
            :term="$t('Selector')"
            v-if="detail.spec.selector"
          >
            <a-tag
              :key="index"
              v-for="(key, index) in Object.keys(detail.spec.selector)"
              :closable="false"
            >
              {{ key }}:{{ detail.spec.selector[key] }}
            </a-tag>
          </DetailListItem>
          <DetailListItem
            v-if="
              detail.spec.labelSelector && detail.spec.labelSelector.matchLabels
            "
            :term="$t('Selector')"
          >
            <a-tag
              :key="index"
              v-for="(key, index) in Object.keys(
                detail.spec.labelSelector.matchLabels,
              )"
              :closable="false"
            >
              {{ key }}:{{ detail.spec.labelSelector.matchLabels[key] }}
            </a-tag>
          </DetailListItem>
        </DetailList>
      </a-card>
      <a-card
        class="card mb-20"
        :bordered="false"
        :loading="loading"
        v-if="registry.type == 'eureka'"
        :title="$t('Resource Info')"
      >
        <DetailList
          size="small"
          :col="3"
          :key="index"
          v-for="(instance, index) in detail.instance"
        >
          <DetailListItem :term="$t('Name')">
            <a-tag>{{ instance.app }}</a-tag>
          </DetailListItem>
          <DetailListItem :term="$t('Status')">
            <a-tag>{{ instance.status }}</a-tag>
          </DetailListItem>
          <DetailListItem :term="$t('Host')">
            <a-tag>{{ instance.hostName }}</a-tag>
          </DetailListItem>
          <DetailListItem :term="$t('IP')">
            <a-tag>{{ instance.ipAddr }}</a-tag>
          </DetailListItem>
          <DetailListItem :term="$t('Port')">
            <a-tag>{{ instance.port["$"] }}</a-tag>
          </DetailListItem>
        </DetailList>
      </a-card>
      <a-card
        class="card mb-20"
        :bordered="false"
        :loading="loading"
        :title="$t('Ports')"
      >
        <template #extra>
          <a
            v-permission="['service:update']"
            @click="addPort"
            href="javascript:void(0)"
          ><PlusCircleTwoTone
            class="font-20"
          /></a>
        </template>
        <a-table
          :pagination="false"
          :columns="portDataColumns"
          :data-source="detail.spec.ports"
          :loading="loading"
          class="bg-white"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'name'">
              <a-input
                v-if="record.isedit"
                v-model:value="record.name"
                class="edit-input"
              />
              <div v-else>
                {{ record.name || "-" }}
              </div>
            </template>
            <template v-if="column.dataIndex === 'port'">
              <FormItem
                :name="['spec', 'ports', index, 'port']"
                :rules="rules.numberRequired"
              >
                <a-input-number
                  v-if="record.isedit"
                  :min="0"
                  v-model:value="record.port"
                  class="edit-input"
                />
                <div v-else>
                  {{ record.port || "-" }}
                </div>
              </FormItem>
            </template>
            <template v-if="column.dataIndex === 'protocol'">
              <a-select
                v-if="record.isedit"
                v-model:value="record.protocol"
                class="edit-input width-90"
              >
                <a-select-option value="TCP">
                  TCP
                </a-select-option>
                <a-select-option value="SCTP">
                  SCTP
                </a-select-option>
                <a-select-option value="UDP">
                  UDP
                </a-select-option>
              </a-select>
              <div v-else>
                {{ record.protocol || "-" }}
              </div>
            </template>
            <template v-if="column.dataIndex === 'targetPort'">
              <FormItem
                :name="['spec', 'ports', index, 'targetPort']"
                :rules="rules.numberRequired"
              >
                <a-input-number
                  :min="0"
                  v-if="record.isedit"
                  v-model:value="record.targetPort"
                  class="edit-input"
                />
                <div v-else>
                  {{ record.targetPort || "-" }}
                </div>
              </FormItem>
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
                    v-permission="['service:update']"
                    @click="edit(record)"
                  ><EditOutlined
                    class="icon-menu"
                  /></a>
                </span>
                <a
                  v-if="detail.spec.ports.length > 1"
                  @click="removePort(index)"
                ><CloseOutlined
                  class="icon-menu"
                /></a>
              </div>
            </template>
          </template>
        </a-table>
      </a-card>
      <a-card
        class="card mb-20"
        :bordered="false"
        :loading="loading"
        :title="$t('Endpoints')"
      >
        <template #extra>
          <a
            v-permission="['service:update']"
            @click="addEndpoints"
            href="javascript:void(0)"
          ><PlusCircleTwoTone
            class="font-20"
          /></a>
        </template>
        <a-table
          :pagination="false"
          :columns="epDataColumns"
          :data-source="detail.endpoints"
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
                <a
                  :href="'http://' + record.host"
                  target="_blank"
                >{{
                  record.host || "-"
                }}</a>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'ports'">
              <div v-if="record.isedit">
                <a-textarea
                  v-model:value="record.port_val"
                  placeholder=""
                  allow-clear
                />
                <div class="textarea-tip">
                  {{ $t("List of name/port/protocol") }}
                </div>
              </div>
              <div v-else>
                <pre>{{ record.port_val.trim() || "-" }}</pre>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'nodeName'">
              <a-input
                v-if="record.isedit"
                v-model:value="record.nodeName"
                class="edit-input"
              />
              <div v-else>
                {{ record.nodeName || "-" }}
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'ready'">
              <a-input
                v-if="record.isedit"
                v-model:value="record.ready"
                class="edit-input"
              />
              <div v-else>
                {{ record.ready || "-" }}
              </div>
            </template>

            <template v-else-if="column.dataIndex === 'action'">
              <div class="editable-row-operations">
                <span v-if="record.isedit">
                  <a @click="cancel(record)"><CheckOutlined /></a>
                </span>
                <span v-else>
                  <a
                    v-permission="['service:update']"
                    @click="edit(record)"
                  ><EditOutlined /></a>
                </span>
              </div>
            </template>
          </template>
        </a-table>
      </a-card>
      <a-card
        v-if="detail.rollingUpdateStrategy && registry.type == 'k8s'"
        class="card mb-20"
        :bordered="false"
        :loading="loading"
        :title="$t('Rolling Update Strategy')"
      >
        <DetailList
          size="small"
          :col="3"
        >
          <DetailListItem :term="$t('Max Surge')">
            <a-input
              :placeholder="$t('unset')"
              v-model:value="detail.rollingUpdateStrategy.maxSurge"
            />
          </DetailListItem>
          <DetailListItem :term="$t('Max Unavailable')">
            <a-input
              :placeholder="$t('unset')"
              v-model:value="detail.rollingUpdateStrategy.maxUnavailable"
            />
          </DetailListItem>
        </DetailList>
      </a-card>
    </a-col>
    <slot name="right" />
  </a-row>
</template>

<script>
import {
  PlusCircleTwoTone,
  CloseOutlined,
  CheckOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
import FormItem from "@/components/tool/FormItem";
const port_columns = [
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Port",
    dataIndex: "port",
  },
  {
    key: "Protocol",
    dataIndex: "protocol",
  },
  {
    key: "Target Port",
    dataIndex: "targetPort",
  },
  {
    key: "Action",
    width: 140,
    dataIndex: "action",
  },
];
const ep_columns = [
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
    width: 140,
    dataIndex: "action",
  },
];

export default {
  name: "ServicesDetail",
  i18n: require("@/i18n"),
  components: {
    PlusCircleTwoTone,
    CloseOutlined,
    CheckOutlined,
    EditOutlined,
    DetailList,
    DetailListItem,
    FormItem,
  },

  props: ["detail", "registry"],
  data() {
    return {
      port_columns,
      ep_columns,
      rules: {
        name: [
          {
            required: true,
            message: "Name is required",
            whitespace: true,
            trigger: "blur",
          },
        ],

        numberRequired: [
          {
            required: true,
            message: "This is required",
            trigger: "blur",
            type: "number",
          },
        ],
      },
    };
  },

  computed: {
    epDataColumns() {
      return this.ep_columns.map((column) => {
        column.title = this.$t(column.key);
        return column;
      });
    },

    portDataColumns() {
      return this.port_columns.map((column) => {
        column.title = this.$t(column.key);
        return column;
      });
    },
  },

  created() {},

  methods: {
    removePort(index) {
      this.detail.spec.ports.splice(index, 1);
      this.$emit("update:detail", this.detail);
    },

    removeEndpoint(index) {
      this.detail.endpoints.splice(index, 1);
      this.$emit("update:detail", this.detail);
    },

    cancel(obj) {
      obj.isedit = false;
      this.$emit("update:detail", this.detail);
    },

    edit(obj) {
      obj.isedit = true;
      this.$emit("update:detail", this.detail);
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
      this.$emit("update:detail", this.detail);
    },

    addPort() {
      this.detail.spec.ports = this.detail.spec.ports || [];
      this.detail.spec.ports.push({
        isedit: true,
        name: "",
        port: 8080,
        protocol: "TCP",
        targetPort: "",
      });
      this.$emit("update:detail", this.detail);
    },
  },
};
</script>
