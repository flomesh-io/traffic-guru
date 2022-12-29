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
      v-model:activeKey="ratelimitingKey"
      tab-position="left"
    >
      <a-tab-pane
        :key="_type.value"
        :tab="(_type.label)"
        v-for="_type in ratelimitingTypes"
      >
        <CardList
          :col="col"
          :hide-action-title="true"
          :data-source="ratelimitings[_type.value] || []"
          :type="_type.value"
          :loading="false"
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
    </a-tabs>
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
              v-for="(item, index) in ratelimitingTypes"
              :key="index"
              :value="item"
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
          :label="$t('key')"
          :span="3"
        >
          <FormItem
            name="key"
            :rules="rules.required"
          >
            <a-input
              :placeholder="$t('unset')"
              v-model:value="payload.key"
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
            :col="col"
            :fields="[payload.content.fields]"
          />
        </a-descriptions-item>
      </a-descriptions>
    </a-form>
  </a-modal>
</template>

<script>
import _ from "lodash";
import { PlusCircleTwoTone } from "@ant-design/icons-vue";
import CardList from "@/components/card/CardList";
import AutoForm from "@/components/form/AutoForm";
import FormItem from "@/components/tool/FormItem";
import { mapState } from "vuex";
export default {
  name: "RatelimitingList",
  i18n: require("@/i18n"),
  components: {
    PlusCircleTwoTone,
    CardList,
    AutoForm,
    FormItem,
  },

  props: ["col", "title", "ratelimitings"],

  data() {
    return {
      visible: false,
      ratelimitingVals: {},
      ratelimitingTypes: [],
      payload: {
        type: null,
        name: "",
        key: "",
        content: "",
      },

      isEdit: false,
      loading: true,
      ratelimitingKey: "",
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
  },

  watch: {
    ratelimitingVals: {
      deep: true,
      handler() {
        this.$emit("update:ratelimitings", this.ratelimitingVals);
      },
    },

    ratelimitings: {
      deep: true,
      immediate: true,
      handler() {},
    },
  },

  created() {},
  mounted() {
    
    this.$gql
      .query(`systemSettings(where:{type:"Identifier"}){id,mode,content}`)
      .then(() => {
        //.then((res) => {
        // this.identityTypes = res[0].content;
        // this.ratelimitingKey = res[0].content[0].value;
        this.ratelimitingTypes = [
          {
            "label": "Header",
            "value": "header",
            "name": "",
            "key": "",
            "fields": [
              {
                "name": "enable",
                "type": "select",
                "label": "Enable",
                "value": "true",
                "options": [
                  {
                    "label": "ON",
                    "value": "true"
                  },
                  {
                    "label": "OFF",
                    "value": "false"
                  }
                ]
              },
              {
                "name": "limit",
                "type": "number",
                "label": "Limit",
                "value": ""
              },
              {
                "name": "maxWait",
                "type": "number",
                "label": "Max Wait",
                "value": ""
              },
              {
                "name": "sync_rate",
                "type": "number",
                "label": "Sync Rate",
                "value": ""
              }
            ]
          }
        ]
        this.ratelimitingKey = "header";
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
      this.ratelimitingVals = this.ratelimitings;
      this.ratelimitingVals[type].splice(index, 1);
      this.$emit("ratelimitingSave");
    },

    showModal() {
      this.visible = true;
      this.isEdit = false;
      this.payload.type = this.ratelimitingKey;
      this.ratelimitingTypes.forEach((item) => {
        if (item.value == this.payload.type) {
          this.payload.name = "";
          this.payload.key = "";
          this.payload.content = {
            fields: item.fields,
          };
        }
      });
    },

    renderCallback() {
      this.ratelimitingTypes.forEach((item) => {
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
      this.ratelimitingVals = this.ratelimitings;
      this.ratelimitingVals[this.payload.type] = this.ratelimitingVals[
        this.payload.type
      ]
        ? this.ratelimitingVals[this.payload.type]
        : [];
      if (this.isEdit) {
        this.ratelimitingVals[this.payload.type][this.payload.index] = {
          name: this.payload.name,
          key: this.payload.key,
          content: this.payload.content,
        };
      } else {
        this.ratelimitingVals[this.payload.type].push({
          name: this.payload.name,
          key: this.payload.key,
          content: this.payload.content,
        });
      }
      this.payload = {
        type: null,
        name: "",
        key: "",
        enable: true,
        content: "",
      };
      this.visible = false;

      this.$emit("ratelimitingSave");
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
