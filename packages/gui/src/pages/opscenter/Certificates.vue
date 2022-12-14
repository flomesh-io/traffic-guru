<template>
  <PageLayout
    :hide-head="isBind"
    :avatar="FileProtectOutlined"
    :form-state="payload"
    ref="layout"
  >
    <template #extra>
      <HeadInfo
        v-permission="['certificate:create']"
        class="split-right"
        :title="$t('Create a certificate')"
      >
        <template #body>
          <div>
            <PlusCircleTwoTone
              @click="add"
              class="font-primary icon-menu rotate-icon"
            />
          </div>
        </template>
      </HeadInfo>
    </template>
    <div
      v-if="isBind"
      class="mt-25"
    >
      <a-divider
        v-if="bindCertificates.length > 0"
        dashed
      >
        <a-tag>{{ $t("Is binding") }}</a-tag>
      </a-divider>
      <CardList
        :empty="$t('Select a binding in the certificate list')"
        :col="col"
        class="mb-10"
        :hide-action-title="true"
        :data-source="bindCertificates"
        type="component"
        :loading="loading"
        :actions="[
          {
            icon: 'DisconnectOutlined',
            text: $t('Unbind'),
            call: unbind,
            permission: ['certificate:update'],
          },
        ]"
      >
        <template #default="{ item }">
          <a-card-meta>
            <template #title>
              <div class="mb-3">
                <span>{{ item.name }}</span><span v-if="item.host"> / {{ item.host }}</span>
              </div>
            </template>
            <template #avatar>
              <svg
                class="card-avatar icon"
                aria-hidden="true"
              >
                <use xlink:href="#icon-certificate" />
              </svg>
            </template>
            <template #description>
              <div class="certificate-meta-content meta-content">
                {{ $t("Term of validity") }}：{{
                  getTimeLabel([item.start * 1, item.end * 1])
                }}
              </div>
            </template>
          </a-card-meta>
        </template>
      </CardList>
    </div>
    <div>
      <a-divider
        v-if="isBind"
        dashed
      >
        <a-tag>{{ $t("Certificate list") }}</a-tag>
      </a-divider>
      <CardList
        :empty="$t('No certificate')"
        :col="col"
        :hide-action-title="true"
        :data-source="calcCertificates"
        type="component"
        :loading="loading"
        :actions="
          isBind
            ? [
              {
                icon: 'LinkOutlined',
                text: $t('Bind'),
                call: bind,
                permission: ['certificate:update'],
              },
            ]
            : [
              {
                icon: 'EditOutlined',
                text: $t('edit'),
                call: setting,
                permission: ['certificate:update'],
              },
              {
                icon: 'CloseOutlined',
                hide: true,
                text: $t('delete'),
                call: remove,
                permission: ['certificate:delete'],
              },
            ]
        "
      >
        <template #default="{ item }">
          <a-card-meta>
            <template #title>
              <div class="mb-3">
                {{ item.name }}
              </div>
            </template>
            <template #avatar>
              <svg
                class="border-square card-avatar icon square-50"
                aria-hidden="true"
              >
                <use xlink:href="#icon-certificate" />
              </svg>
            </template>
            <template #description>
              <div class="mb-10">
                <a-tag
                  v-if="item.type"
                  :color="{ k8s: 'blue', api: 'green' }[item.type]"
                >
                  {{ tlsMap[item.type] }}
                </a-tag>
                <a-tag
                  v-if="item.namespace"
                >
                  {{ item.namespace.registry?.name }} /
                  {{ item.namespace.name }}
                </a-tag>
              </div>
              <div class="meta-content">
                <div
                  :key="index"
                  v-for="(key, index) in Object.keys(item.content || [])"
                >
                  {{ key }}:{{ item.content[key] }}
                </div>
              </div>
            </template>
          </a-card-meta>
        </template>
      </CardList>
      <a-pagination
        @change="loaddata"
        v-model:current="pageNo"
        :total="total"
        :page-size="pageSize"
        show-less-items
      />
    </div>
    <a-modal
      v-model:visible="visible"
      :title="$t('Certificates')"
      @ok="valid"
      width="50%"
      :ok-text="isEdit ? $t('Save') : $t('create')"
    >
      <a-form
        :model="payload"
        :wrapper-col="{ span: 24 }"
        ref="form"
      >
        <a-descriptions bordered>
          <a-descriptions-item
            :label="$t('as')"
            :span="3"
          >
            <FormItem
              name="name"
              :rules="rules.uniqueName('certificates',{id:payload.id,namespace:payload.namespace?.id})"
            >
              <a-input
                :placeholder="$t('unset')"
                v-model:value="payload.name"
                class="width-300"
              />
            </FormItem>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Type')"
            :span="payload.type == 'k8s' ? 1 : 3"
          >
            <a-select v-model:value="payload.type">
              <a-select-option
                :value="item.value"
                :key="index"
                v-for="(item, index) in tlsTypes"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Namespace')"
            :span="2"
            v-if="payload.type == 'k8s'"
          >
            <EnvSelector
              :no-all="true"
              :is-filter="true"
              v-model:namespace="payload.namespace"
              @envChange="envChange"
            />
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Private Key')"
            :span="3"
          >
            <Json2YamlCard
              class="card nopd"
              :is-create="editorIsCreate"
              height="200px"
              v-model:jsonVal="payload.content"
              @change="yamlchange"
            />
          </a-descriptions-item>
        </a-descriptions>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="visible2"
      :title="$t('Binding certificate')"
      @ok="handleOk2"
      width="50%"
      :ok-text="$t('Bind')"
      :destroy-on-close="true"
    >
      <a-descriptions bordered>
        <a-descriptions-item
          v-if="bindTarget.id"
          :label="$t('ID')"
          :span="3"
        >
          {{ bindTarget.id }}
        </a-descriptions-item>
        <a-descriptions-item
          :label="$t('as')"
          :span="3"
        >
          {{ bindTarget.name }}
        </a-descriptions-item>
        <a-descriptions-item
          :label="$t('Content')"
          :span="3"
        >
          <div class="meta-content">
            <div
              :key="index"
              v-for="(key, index) in Object.keys(bindTarget.content || [])"
            >
              {{ key }}:{{ bindTarget.content[key] }}
            </div>
          </div>
        </a-descriptions-item>
        <a-descriptions-item
          :label="$t('Host')"
          :span="3"
        >
          <a-input
            v-model:value="bindTarget.host"
            class="width-300"
          />
        </a-descriptions-item>
        <a-descriptions-item
          :label="$t('Term of validity')"
          :span="3"
        >
          <a-range-picker v-model:value="bindTarget.validity">
            <template #dateRender="{ current }">
              <div
                class="ant-calendar-date"
                :style="getCurrentStyle(current)"
              >
                {{ current.date() }}
              </div>
            </template>
          </a-range-picker>
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </PageLayout>
</template>

<script>
import Json2YamlCard from "@/components/card/Json2YamlCard";
import {
  PlusCircleTwoTone,
  FileProtectOutlined,
} from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import CardList from "@/components/card/CardList";
import EnvSelector from "@/components/menu/EnvSelector";
import FormItem from "@/components/tool/FormItem";
import { mapState } from "vuex";
import { Empty } from "ant-design-vue";
export default {
  name: "Certificates",
  components: {
    HeadInfo,
    PageLayout,
    EnvSelector,
    CardList,
    PlusCircleTwoTone,
    Json2YamlCard,
    FormItem,
  },

  i18n: require("@/i18n"),
  props: ["isBind", "col", "bindCertificates", "certificateSize"],
  data() {
    return {
      tlsMap: { k8s: "K8S Secret", api: "API Secret" },
      tlsTypes: [
        { value: "k8s", label: "K8S Secret" },
        { value: "api", label: "API Secret" },
      ],

      FileProtectOutlined,
      isEdit: false,
      bindCertificatesVals: [],
      certificates: [],
      visible: false,
      visible2: false,
      subscribes: [],
      flb: [],
      fsm: [],
      payload: {
        name: "",
        id: "",
        port: 0,
        type: "k8s",
        namespaceId: null,
        content: '{"Public Key":""}',
      },

      bindTarget: {},
      editorIsCreate: true,
      workload: [],
      projects: [],
      pageSize: 12,
      pageNo: 1,
      total: 0,
      loading: true,
      activities: [],
      config: {},
      teams: [],
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
    calcCertificates() {
      if (!this.isBind) {
        return this.certificates;
      }
      let rtn = [];
      this.certificates.forEach((item) => {
        let isInclude = false;
        this.bindCertificates.forEach((binditem) => {
          if (binditem.id == item.id) {
            isInclude = true;
          }
        });
        if (!isInclude) {
          rtn.push(item);
        }
      });
      return rtn;
    },

    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  watch: {
    bindCertificatesVals: {
      deep: true,
      handler() {
        this.$emit("update:bindCertificates", this.bindCertificatesVals);
      },
    },

    bindCertificates: {
      deep: true,
      immediate: true,
      handler(n) {
        if (n == null) {
          this.bindCertificatesVals = [];
        }
      },
    },
  },

  created() {
    this.loaddata();
  },

  methods: {
    envChange(data) {
      this.payload.namespaceId = data.namespaceId;
    },

    getCurrentStyle(current) {
      const style = {};
      if (current.date() === 1) {
        style.border = "1px solid #1890ff";
        style.borderRadius = "50%";
      }
      return style;
    },

    add() {
      this.isEdit = false;
      this.payload = {
        name: "",
        id: "",
        type: "k8s",
        namespaceId: null,
        content: '{"cert": "", "key": ""}',
      };
      this.showModal();
    },

    getSample() {
      this.custom = this.customSample;
    },

    showModal() {
      this.visible = true;
    },

    valid() {
      this.$refs.form
        .validateFields()
        .then(() => {
          this.handleOk();
        })
        .catch(() => {});
    },

    handleOk() {
      let namespaceId = this.payload.namespaceId;
      if (this.isEdit) {
        const whereID = this.payload.id;
        delete this.payload.id;
        delete this.payload.namespaceId;
        delete this.payload.namespace;
        const p = {
          content: JSON.parse(this.payload.content),
          namespace: namespaceId,
          ...this.payload,
        };
        this.$gql
          .mutation(
            `updateCertificate(input: $input){certificate{id}}`,
            { input: { where: { id: whereID }, data: p } },
            { input: "updateCertificateInput" },
          )
          .then(() => {
            this.$message.success(this.$t("Save successfully"), 3);
            this.visible = false;
            this.loaddata();
          });
      } else {
        delete this.payload.id;
        delete this.payload.namespaceId;
        delete this.payload.namespace;
        const p = {
          namespace: namespaceId,
          ...this.payload,
        };

        this.$gql
          .mutation(
            `createCertificate(input: $input){certificate{id}}`,
            { input: { data: p } },
            { input: "createCertificateInput" },
          )
          .then(() => {
            this.$message.success(this.$t("Created successfully"), 3);
            this.visible = false;
            this.loaddata();
          });
      }
    },

    setting(index, type, item) {
      this.payload.namespace = item.namespace;
      this.$gql
        .query(
          `certificate(id: ${item.id}){id,name,type,namespace{id,name,registry{id,name}},content}`,
        )
        .then((res) => {
          this.payload = res;
          this.payload.content = JSON.stringify(item.content);
          this.payload.namespaceId = res.namespace?.id;
        });
      this.isEdit = true;
      this.showModal();
    },

    remove(index, type, item) {
      this.$gql
        .mutation(
          `deleteCertificate(input: $input){certificate{id}}`,
          { input: { where: { id: item.id } } },
          { input: "deleteCertificateInput" },
        )
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.loaddata();
        });
    },

    showModal2() {
      this.visible2 = true;
    },

    getTimeLabel(date) {
      return (
        new Date(date[0]).toLocaleDateString() +
        "~" +
        new Date(date[1]).toLocaleDateString()
      );
    },

    handleOk2() {
      if (!this.bindTarget.validity[1]) {
        this.$message.error(this.$t("Please select a valid period"), 3);
        return;
      }
      this.bindCertificatesVals = this.bindCertificates;
      this.bindCertificatesVals.push({
        id: this.bindTarget.id,
        name: this.bindTarget.name,
        host: this.bindTarget.host,
        start: "" + new Date(this.bindTarget.validity[0]).getTime(),
        end: "" + new Date(this.bindTarget.validity[1]).getTime(),
      });
      this.bindTarget = {};
      this.visible2 = false;
      this.$message.success(this.$t("Binding succeeded"), 3);
    },

    unbind(index) {
      this.bindCertificatesVals = this.bindCertificates;
      this.bindCertificatesVals.splice(index, 1);
    },

    bind(index, type, item) {
      const _certificateSize = this.certificateSize || 2;
      if (this.bindCertificates.length >= _certificateSize) {
        this.$message.warning(this.$t("At most 3 certificates can be bound"));
        return;
      }
      this.bindTarget = item;
      this.bindTarget.validity = [];
      this.showModal2();
    },

    edit() {},

    loaddata(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      this.loading = true;
      this.$gql
        .query(
          `certificatesConnection(sort:"name:asc",start: ${this.start}, limit: ${this.pageSize}){values{id,name,type,namespace{id,name,registry{id,name}},content},aggregate{totalCount}}`
        )
        .then((res) => {
          this.certificates = res.values;
          this.total = res.aggregate.totalCount;
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }
  .new-btn {
    border-radius: 2px;
    width: 100%;
    height: 187px;
  }
  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  :deep(.ant-divider-dashed::before),
  :deep(.ant-divider-dashed::after) {
    border-color: #ccc !important;
  }
  .certificate-meta-content {
    height: auto;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
  }
</style>
