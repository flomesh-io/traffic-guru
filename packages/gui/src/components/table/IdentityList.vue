<template>
  <a-card
    :title="title"
    class="card identifier-card"
    :bordered="false"
  >
    <template #extra>
      <div>
        <a-button
          type="link"
          shape="circle"
          @click="showModal"
          v-if="mode != 'certificates'"
        >
          <template
            #icon
          >
            <PlusCircleTwoTone
              class="PlusCircleTwoTone icon-menu-sm rotate-icon"
            />
          </template>
        </a-button>
      </div>
    </template>
    <a-tabs
      v-if="mode != 'certificates'"
      v-model:activeKey="identityKey"
      tab-position="left"
    >
      <a-tab-pane
        :key="_type.value"
        :tab="$t(_type.label)"
        v-for="_type in identityTypes"
      >
        <CardList
          :col="col"
          :hide-action-title="true"
          :data-source="identitys[_type.value] || []"
          :type="_type.value"
          :loading="loading"
          :actions="[
            { icon: 'EditOutlined', text: $t('edit'), call: setting },
            {
              icon: 'CloseOutlined',
              hide: true,
              text: $t('delete'),
              call: remove,
            },
          ]"
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
                  class="card-avatar icon"
                  aria-hidden="true"
                >
                  <use xlink:href="#icon-certificate" />
                </svg>
              </template>
              <template #description>
                <div
                  class="meta-content"
                  v-if="item.content.fields"
                >
                  <a-space>
                    <span
                      v-for="(field, index) in item.content.fields"
                      :key="index"
                    >
                      <a-tag
                        v-if="field.value"
                      >{{ field.label }}:{{
                        field.type == "password"
                          ? field.value.replace(/./g, "*")
                          : field.value
                      }}</a-tag>
                    </span>
                  </a-space>
                </div>
                <div
                  class="meta-content"
                  v-else
                >
                  {{ item.content }}
                </div>
              </template>
            </a-card-meta>
          </template>
        </CardList>
      </a-tab-pane>
      <a-tab-pane
        key="1"
        :tab="$t('Certificates')"
      >
        <Certificates
          v-if="certificatesVal"
          :col="col"
          :is-bind="true"
          v-model:bindCertificates="certificatesVal"
        />
      </a-tab-pane>
    </a-tabs>
    <div v-if="mode == 'certificates'">
      <Certificates
        v-if="certificatesVal"
        :col="col"
        :is-bind="true"
        :mode="mode"
        v-model:bindCertificates="certificatesVal"
      />
    </div>
  </a-card>

  <a-modal
    v-model:visible="visible"
    :title="$t('Identity')"
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
          :label="$t('Type')"
          :span="3"
        >
          <a-select
            :disabled="isEdit"
            :placeholder="$t('unset')"
            class="width-200"
            v-model:value="payload.type"
            @change="renderCallback"
          >
            <a-select-option
              v-for="(item, index) in identityTypes"
              :key="index"
              :value="item.value"
            >
              <span>
                {{ $t(item.label) }}
              </span>
            </a-select-option>
          </a-select>
        </a-descriptions-item>
        <a-descriptions-item
          :label="$t('as')"
          :span="3"
        >
          <FormItem
            name="name"
            :rules="rules.name"
          >
            <a-input
              :placeholder="$t('unset')"
              v-model:value="payload.name"
              class="width-300"
            />
          </FormItem>
        </a-descriptions-item>
        <a-descriptions-item
          :label="$t('content')"
          :span="3"
        >
          <AutoForm
            v-if="payload.content.fields"
            :col="2"
            :fields="[payload.content.fields]"
          />
          <a-textarea
            v-else
            v-model:value="payload.content"
            placeholder="User:Password / Token / JWT"
            allow-clear
            :rows="14"
          />
        </a-descriptions-item>
      </a-descriptions>
    </a-form>
  </a-modal>
</template>

<script>
import _ from "lodash";
import { PlusCircleTwoTone } from "@ant-design/icons-vue";
import Certificates from "@/pages/opscenter/Certificates";
import CardList from "@/components/card/CardList";
import AutoForm from "@/components/form/AutoForm";
import FormItem from "@/components/tool/FormItem";
import { mapState } from "vuex";
export default {
  name: "IdentityList",
  i18n: require("@/i18n"),
  components: {
    PlusCircleTwoTone,
    CardList,
    Certificates,
    AutoForm,
    FormItem,
  },

  props: [
    "col",
    "title",
    "identitys",
    "certificates",
    "mode",
  ],

  data() {
    return {
      certificatesVal: [],
      visible: false,
      identitysVals: {},
      identityTypes: [],
      payload: {
        type: null,
        name: "",
        content: "",
      },

      isEdit: false,
      loading: true,
      identityKey: "",
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
  },

  watch: {
    certificatesVal: {
      deep: true,
      handler() {
        this.$emit("update:certificates", this.certificatesVal);
      },
    },

    identitysVals: {
      deep: true,
      handler() {
        this.$emit("update:identitys", this.identitysVals);
      },
    },

    identitys: {
      deep: true,
      immediate: true,
      handler() {},
    },
  },

  created() {
    this.certificatesVal = this.certificates;
  },

  mounted() {
    this.$gql
      .query(`systemSettings(filters:{type:{eq:"Identity"}}){data{id,attributes{mode,content}}}`)
      .then((res) => {
        this.identityTypes = res.data[0].content;
        this.identityKey = res.data[0].content[0].value;
        this.certificatesVal = this.certificates;
      });
  },

  methods: {
    setting(index, type, item) {
      this.payload = _.cloneDeep(item);
      this.payload.type = type;
      this.payload.index = index;
      this.isEdit = true;
      this.visible = true;
    },

    remove(index, type) {
      this.identitysVals = this.identitys;
      this.identitysVals[type].splice(index, 1);
    },

    showModal() {
      this.visible = true;
      this.isEdit = false;
      this.payload.type = this.identityKey;
      this.identityTypes.forEach((item) => {
        if (item.value == this.payload.type) {
          this.payload.content = {
            fields: item.fields,
          };
        }
      });
    },

    renderCallback() {
      this.identityTypes.forEach((item) => {
        if (item.value == this.payload.type) {
          this.payload.content = {
            fields: item.fields,
          };
        }
      });
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
      this.identitysVals = this.identitys;
      this.identitysVals[this.payload.type] = this.identitysVals[
        this.payload.type
      ]
        ? this.identitysVals[this.payload.type]
        : [];
      if (this.isEdit) {
        this.identitysVals[this.payload.type][this.payload.index] = {
          name: this.payload.name,
          content: this.payload.content,
        };
      } else {
        this.identitysVals[this.payload.type].push({
          name: this.payload.name,
          content: this.payload.content,
        });
      }
      this.payload = {
        type: null,
        name: "",
        content: "",
      };
      this.visible = false;
    },

    onTabChange(key) {
      console.log(key);
    },
  },
};
</script>

<style lang="less" scoped>
  .identifier-card {
    background-color: #fdfdfd;
  }
  .PlusCircleTwoTone {
    font-size: 20px;
  }
  .card-avatar {
    width: 50px;
    height: 50px;
    border-radius: 0;
  }
</style>
