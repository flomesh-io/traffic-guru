<template>
  <PageLayout
    :title="$t('Plugin')"
    :hide-breadcrumb="hideHead"
    :style="hideHead ? 'padding-top:0 ;' : ''"
  >
    <template #headerContent>
      <div :class="['search-head', layout, pageWidth]">
        <div class="search-input">
          <a-input-search
            v-model:value="key"
            class="search-ipt"
            @search="search()"
            :placeholder="$t('Please input') + '...'"
            size="large"
          />
        </div>

        <a-card
          :bordered="false"
          class="search-form"
        >
          <div class="content flex">
            <div class="flex-item">
              <a-form>
                <div class="form-row">
                  <div class="label">
                    <span>{{ $t("Card View") }}</span>
                  </div>
                  <div class="content">
                    <a-form-item>
                      <a-radio-group
                        size="small"
                        @change="changeView"
                        v-model:value="viewtypevalue"
                        button-style="solid"
                      >
                        <a-radio-button
                          :value="item.value"
                          v-for="(item, index) in viewtype"
                          :key="index"
                        >
                          {{ $t(item.label) }}
                        </a-radio-button>
                      </a-radio-group>
                      <a-tag
                        class="ml-10"
                        v-if="viewtypeproject"
                        closable
                        @close="removeViewtypeproject"
                      >
                        {{ viewtypeproject.name }}
                      </a-tag>
                    </a-form-item>
                  </div>
                </div>
              </a-form>
            </div>
            <div
              v-if="!hideHead"
              v-permission="['plugin:create']"
              class="width-200"
            >
              <HeadInfo
                class="pd-0 split-right"
                :title="$t('Create Plugin')"
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
            </div>
          </div>
        </a-card>
      </div>
    </template>

    <div class="search-content">
      <a-row
        :gutter="[16, 8]"
        v-show="viewtypevalue == 1 && !viewtypeproject"
        class="mb-10"
      >
        <a-col
          v-for="(pluginType, index) in pluginTypes"
          :key="index"
          :span="6"
          @click="filterData(pluginType)"
        >
          <div class="project-selection">
            <p class="font-20">
              {{ pluginType.name }}
            </p>
            <p class="font-16">
              {{ $t("Plugin") }}
              <span class="font-20 primary">{{
                pluginType.plugins.length
              }}</span>
              {{ $t("unitge") }}
            </p>
          </div>
        </a-col>
      </a-row>
      <CardList
        :result-empty="{ status: 404, title: $t('No data') }"
        :col="hideHead ? 2 : null"
        v-show="viewtypevalue == 0 || viewtypeproject"
        :loading="loading"
        :data-source="plugins"
        :hide-action-title="!hideHead"
        type="component"
        :actions="
          hideHead
            ? [{ icon: 'PlusOutlined', text: 'add', call: select }]
            : [
              {
                icon: 'EditOutlined',
                text: $t('edit'),
                call: detail,
                permissionWhere: [
                  'plugin:update:project:',
                  'project',
                  'plugin:update',
                ],
              },
              {
                icon: 'DeleteOutlined',
                text: $t('delete'),
                call: remove,
                hide: true,
                permissionWhere: [
                  'plugin:delete:project:',
                  'project',
                  'plugin:delete',
                ],
              },
            ]
        "
      >
        <template #default="{ item }">
          <a-card-meta>
            <template #title>
              <div class="mb-3">
                {{ item.name }}
                <span
                  v-if="
                    item.content.displayName &&
                      item.name != item.content.displayName
                  "
                >
                  ( {{ item.content.displayName }} )
                </span>
                <a-tag
                  color="pink"
                  class="result-tag"
                  v-if="item.type"
                >
                  {{
                    item.type.name
                  }}
                </a-tag>
              </div>
            </template>
            <template #avatar>
              <a-badge status="processing" />
            </template>
            <template #description />
          </a-card-meta>
          <div class="height-90 relative">
            <div class="content template-div">
              <div
                v-if="item.icon"
                class="template-div-icon"
              >
                <img
                  :src="DEFAULT_BASE_URL + item.icon.url"
                  alt="avatar"
                  class="square-70"
                >
              </div>
              <div class="template-div-2">
                <p>{{ $t("Description") }}</p>
                <p class="description-text">
                  <a-typography-paragraph
                    :ellipsis="{ rows: 3 }"
                    :content="item.desc"
                  />
                </p>
              </div>
            </div>
          </div>
        </template>
      </CardList>

      <a-pagination
        v-show="viewtypevalue == 1 && !viewtypeproject"
        @change="searchProject"
        v-model:current="pageNo"
        :total="total"
        :page-size="pageSize"
        show-less-items
      />
      <a-pagination
        v-show="viewtypevalue == 0 || viewtypeproject"
        @change="search"
        v-model:current="pageNo"
        :total="total"
        :page-size="pageSize"
        show-less-items
      />
    </div>

    <a-modal
      v-model:visible="visible"
      :title="$t('Plugin')"
      width="70%"
    >
      <template #footer>
        <a-button
          v-if="isEdit"
          type="primary"
          @click="valid"
        >
          {{
            $t("save")
          }}
        </a-button>
        <a-button
          v-else
          type="primary"
          @click="valid"
        >
          {{
            $t("create")
          }}
        </a-button>
      </template>
      <a-form
        :model="payload"
        :wrapper-col="{ span: 24 }"
        ref="form"
      >
        <a-descriptions bordered>
          <a-descriptions-item
            :label="$t('ID')"
            :span="3"
            v-if="payload.id"
          >
            {{ payload.id }}
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Icon')"
            :span="3"
          >
            <a-upload
              accept="image/png, image/jpeg, .svg"
              v-model:file-list="fileList"
              :headers="upHeaders"
              name="files"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :action="UPLOAD"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <img
                v-if="payload.icon"
                :src="DEFAULT_BASE_URL + payload.icon.url"
                alt="avatar"
                class="square-150"
              >
              <div v-else>
                <LoadingOutlined v-if="upLoading" />
                <PlusOutlined v-else />
                <div class="ant-upload-text">
                  {{ $t("Upload") }}
                </div>
              </div>
            </a-upload>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('as')"
            :span="3"
          >
            <FormItem
              name="name"
              :rules="rules.uniqueName('plugins',{id:payload.id})"
            >
              <a-input
                :placeholder="$t('unset')"
                v-model:value="payload.name"
              />
            </FormItem>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Display Name')"
            :span="3"
          >
            <FormItem
              :name="['content', 'displayName']"
              :rules="rules.required"
            >
              <a-input
                :placeholder="$t('unset')"
                v-model:value="payload.content.displayName"
              />
            </FormItem>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Limit')"
            :span="3"
          >
            <a-checkbox-group
              v-model:value="payload.apply"
              :options="[
                { label: 'API', value: 'api' },
                { label: $t('service'), value: 'service' },
              ]"
            />
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Type')"
            :span="3"
          >
            <FormItem
              name="type"
              :rules="rules.required"
            >
              <a-select
                :placeholder="$t('Type')"
                class="width-160"
                v-model:value="payload.type"
              >
                <a-select-option
                  v-for="(pluginType, index) in pluginTypes"
                  :key="index"
                  :value="pluginType.id"
                >
                  <span v-if="pluginType.id">{{ pluginType.name }}</span>
                  <i
                    v-if="!pluginType.id"
                    class="gray"
                  >{{ pluginType.name }}
                  </i>
                </a-select-option>
              </a-select>
            </FormItem>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Attributes')"
            :span="3"
          >
            <div
              v-for="(attribute, index) in payload.content.fields"
              :key="index"
              class="attribute-warpper flex"
            >
              <div class="flex-item">
                <div>
                  <a-input
                    v-model:value="attribute.name"
                    :placeholder="$t('as')"
                    class="width-120"
                  />
                  <a-input
                    v-model:value="attribute.label"
                    :placeholder="$t('Display Name')"
                    class="width-120"
                  />
                  <a-select
                    :placeholder="$t('Type')"
                    class="width-110"
                    v-model:value="attribute.type"
                  >
                    <a-select-option
                      v-for="(attrType, index2) in attrTypes"
                      :key="index2"
                      :value="attrType.id"
                    >
                      <span v-if="attrType.id">{{ attrType.name }}</span>
                      <i
                        v-if="!attrType.id"
                        class="gray"
                      >{{ attrType.name }}
                      </i>
                    </a-select-option>
                  </a-select>
                </div>
                <div>
                  <a-input
                    v-if="attribute.type == 'text'"
                    v-model:value="attribute.value"
                    :placeholder="$t('Default')"
                    class="width-350"
                  />
                  <a-input-number
                    v-if="attribute.type == 'number'"
                    v-model:value="attribute.value"
                    :placeholder="$t('Default')"
                    class="width-350"
                  />
                  <div
                    v-if="attribute.type == 'boolean'"
                    class="width-350"
                  >
                    <a-switch
                      class="ml-10"
                      v-model:checked="attribute.value"
                    />
                  </div>
                  <a-textarea
                    v-if="attribute.type == 'textarea'"
                    v-model:value="attribute.value"
                    :placeholder="$t('Default')"
                    class="width-350"
                    :autosize="{ minRows: 2, maxRows: 6 }"
                  />
                  <a-textarea
                    v-if="attribute.type == 'select'"
                    v-model:value="attribute.value"
                    :placeholder="$t('Default')"
                    class="width-350"
                    :autosize="{ minRows: 2, maxRows: 6 }"
                  />
                </div>
              </div>
              <div class="pt-20 width-80">
                <MinusCircleTwoTone
                  v-if="payload.content.fields.length > 1"
                  class="font-20 ml-10 two-tone"
                  :disabled="payload.content.fields.length === 1"
                  @click="removeAttribute(attribute)"
                  two-tone-color="#00adef"
                />
                <PlusCircleTwoTone
                  class="font-20 ml-10 two-tone"
                  v-if="payload.content.fields.length - 1 == index"
                  @click="addAttribute"
                  two-tone-color="#00adef"
                />
              </div>
            </div>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Description')"
            :span="3"
          >
            <a-textarea
              :placeholder="$t('unset')"
              v-model:value="payload.desc"
            />
          </a-descriptions-item>
        </a-descriptions>
      </a-form>
    </a-modal>
  </PageLayout>
</template>

<script>
import _ from "lodash";
import HeadInfo from "@/components/tool/HeadInfo";
import {
  PlusOutlined,
  LoadingOutlined,
  PlusCircleTwoTone,
  MinusCircleTwoTone,
} from "@ant-design/icons-vue";
import { mapState } from "vuex";
import CardList from "@/components/card/CardList";
import PageLayout from "@/layouts/PageLayout";
import { Empty } from "ant-design-vue";
import { UPLOAD, DEFAULT_BASE_URL } from "@/services/api";
import { getHeaders } from "@/utils/request";
import FormItem from "@/components/tool/FormItem";

export default {
  name: "PluginList",
  i18n: require("@/i18n"),
  components: {
    PageLayout,
    CardList,
    PlusCircleTwoTone,
    HeadInfo,
    MinusCircleTwoTone,
    PlusOutlined,
    LoadingOutlined,
    FormItem,
  },

  props: ["hideHead", "apply"],
  data() {
    return {
      UPLOAD,
      DEFAULT_BASE_URL,
      fileList: [],
      upLoading: false,
      upHeaders: {},
      imageUrl: "",
      hideApps: true,
      pageSize: 12,
      pageNo: 1,
      total: 0,
      key: "",
      filterApp: "",
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      visible: false,
      visible2: false,
      showApp: false,
      pluginTypes: [],
      attrTypes: [
        {
          id: "text",
          name: "Text",
        },
        {
          id: "boolean",
          name: "Boolean",
        },
        {
          id: "number",
          name: "Number",
        },
        {
          id: "textarea",
          name: "Textarea",
        },
        {
          id: "select",
          name: "Select",
        },
      ],

      screenWidth: document.body.clientWidth,
      json: "{}",
      plugins: [],
      stepfilter: -1,
      payload: {
        id: "",
        name: "",
        type: null,
        apply: ["api"],
        content: {
          fields: [
            {
              name: "",
              type: "text",
              value: null,
              unit: "",
            },
          ],

          displayName: "",
        },

        desc: "",
      },

      categray: [
        { value: -1, label: "All" },
        { value: 0, label: "Design" },
        { value: 1, label: "Review" },
        { value: 2, label: "Run" },
        { value: 3, label: "Stop" },
      ],

      viewtypevalue: 0,
      viewtypeproject: null,
      viewtype: [
        { value: 0, label: "All" },
        { value: 1, label: "Goup By Type" },
      ],

      loading: true,
    };
  },

  computed: {
    ...mapState({
      rules: state => state.rules.rules,
      layout: state => state.setting.layout,
      pageWidth: state => state.setting.pageWidth,
    }),

    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  mounted() {
    this.upHeaders = getHeaders();
    this.searchProject();
    this.search();
    const that = this;
    if (window) {
      window.onresize = () => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      };
    }
  },

  methods: {
    select(index, type, item) {
      this.$emit("selectPlugin", {...item,enable:true});
    },

    handleChange(info) {
      if (info.file.status === "uploading") {
        this.upLoading = true;
        return;
      }
      if (info.file.status === "done") {
        this.payload.icon = info.file.response[0];
        this.getBase64(info.file.originFileObj, (base64Url) => {
          this.imageUrl = base64Url;
          this.upLoading = false;
        });
      }
      if (info.file.status === "error") {
        this.upLoading = false;
        this.$message.error("upload error");
      }
    },

    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("Image must smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },

    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    },

    valid() {
      this.$refs.form
        .validateFields()
        .then(() => {
          this.handleOk();
        })
        .catch(() => {});
    },

    validForm() {
      for (const field of this.payload.content.fields) {
        if (!field.name) {
          this.$message.error(this.$t("The name cannot be empty"), 3);
          return false;
        } else if (!field.label) {
          this.$message.error(this.$t("The display name cannot be empty"), 3);
          return false;
        }
      }
      return true;
    },

    handleOk() {
      if (!this.validForm()) {
        return;
      }
      let savedata = _.cloneDeep(this.payload);
      if (savedata.content.fields) {
        savedata.content.fields.forEach((field) => {
          if (field.type == "select") {
            let _options = field.value.split("\n");
            field.options = [];
            _options.forEach((option) => {
              field.options.push({ value: option, label: option });
            });
            field.value = "";
          }
        });
      }
      savedata.icon = savedata.icon ? savedata.icon.id : null;
      savedata.apply = savedata.apply.join(",");
      if (!savedata.icon) {
        delete savedata.icon;
      }
      if (this.isEdit) {
        const whereID = savedata.id;
        delete savedata.id;
        this.$gql
          .mutation(
            `updatePlugin(id:${whereID}, data: $data){data{id}}`,
            {
              data: savedata,
            },
            {
              data: "PluginInput!",
            },
          )
          .then(() => {
            this.visible = false;
            this.$message.success(this.$t("Modified successfully"), 3);
            this.search();
          });
      } else {
        delete savedata.id;
        this.$gql
          .mutation(
            `createPlugin(data: $data){data{id}}`,
            {
              data: savedata,
            },
            {
              data: "PluginInput!",
            },
          )
          .then(() => {
            this.visible = false;
            this.$message.success(this.$t("Created successfully"), 3);
            this.search();
          });
      }
    },


    addAttribute() {
      this.payload.content.fields.push({
        name: "",
        type: "text",
        value: null,
        unit: "",
      });
    },

    createApp() {
      this.$router.push({
        path: "/openapi/application/create",
      });
    },

    add() {
      this.isEdit = false;
      this.payload = {
        id: "",
        name: "",
        type: null,
        apply: ["api"],
        content: {
          script: '',
          fields: [
            {
              name: "",
              type: "text",
              value: null,
              unit: "",
            },
          ],

          displayName: "",
        },

        desc: "",
      };
      this.showModal();
    },

    addpolicy() {
      this.$router.push({
        path: "/openapi/api/create/Policy",
      });
    },

    showModal() {
      this.visible = true;
    },

    detail(index, type, item) {
      this.payload = _.cloneDeep(item);
      if (this.payload.type) {
        this.payload.type = this.payload.type.id;
      }
      this.isEdit = true;
      if (!this.payload.apply) {
        this.payload.apply = ["api"];
      } else {
        this.payload.apply = this.payload.apply.split(",");
      }
      if (this.payload.content.fields) {
        this.payload.content.fields.forEach((field) => {
          if (field.type == "select") {
            field.value = "";
            field.options.forEach((option, idx) => {
              if (idx > 0) {
                field.value += "\n";
              }
              field.value += option.value;
            });
          }
        });
      }
      this.showModal();
    },

    removeAttribute(item) {
      let index = this.payload.content.fields.indexOf(item);
      if (index !== -1) {
        this.payload.content.fields.splice(index, 1);
      }
    },
		
    remove(index, type, item) {
      this.$gql
        .mutation(`deletePlugin(id:${item.id}){data{id}}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    show() {
      this.visible = true;
    },

    removeViewtypeproject() {
      this.viewtypeproject = null;
      this.searchProject();
    },

    filterData(project) {
      this.viewtypeproject = project;
      this.search();
    },

    changeView() {
      this.viewtypeproject = null;
      if (this.viewtypevalue == 0) {
        this.search();
      } else {
        this.searchProject();
      }
    },

    search(pageNo) {
      if (pageNo) {
        this.pageNo = pageNo;
      } else {
        this.pageNo = 1;
      }
      this.loading = true;
      let pagination = {
        start: this.start, 
        limit: this.pageSize
      };
      let filters = {};
      filters.name = { contains: this.key };
      if (this.apply) {
        filters.apply = { contains: this.apply };
      }
      if (this.viewtypeproject) {
        filters.type = { eq: this.viewtypeproject.id };
      }
      this.$gql
        .query(
          `plugins(filters: $filters, pagination: $pagination){
						data{id,attributes{
							name,
							icon{data{id,attributes{url,previewUrl}}},
							apply,
							type{data{id,attributes{name}}},
							desc,
							content
						}},
						meta{pagination{total}}
					}`,
          { 
            filters, pagination
          },{
            filters: "PluginFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.plugins = res.data;
          this.plugins.forEach(plugin=>{
            if(!plugin.content.script){
              plugin.content.script = '';
            }
          })
          this.total = res.pagination.total;
          this.loading = false;
        });
    },

    searchProject(pageNo) {
      if (pageNo) {
        this.pageNo = pageNo;
      } else {
        this.pageNo = 1;
      }
      let pagination = {
        start: this.start, 
        limit: this.pageSize
      };
      this.loading = true;
      this.$gql
        .query(
          `pluginTypes(pagination: $pagination){data{id,attributes{name,plugins{data{id,attributes{name}}}}}}`,
          {
            pagination 
          },{
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.pluginTypes = res.data;
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
  :deep(.page-header) {
    padding-bottom: 0;
  }
  .search-content {
    .clearfix() {
      zoom: 1;
      &:before,
      &:after {
        content: " ";
        display: table;
      }
      &:after {
        clear: both;
        visibility: hidden;
        font-size: 0;
        height: 0;
      }
    }
    .content {
      .clearfix();
      margin-top: 16px;
      & > div {
        position: relative;
        text-align: left;
        float: left;
        width: 33%;
        p {
          line-height: 32px;
          font-size: 24px;
          text-align: center;
          margin: 0;
        }
        p:first-child {
          color: @text-color-second;
          font-size: 12px;
          line-height: 20px;
          margin-bottom: 4px;
        }
      }
    }
  }
  .mini-linedata {
    border-bottom: 1px dashed #ddd;
    padding-bottom: 15px;
    position: relative;
  }
  .mini-linedata .close {
    position: absolute;
    right: 0px;
    color: #ddd;
    top: 5px;
    display: none;
    cursor: pointer;
  }
  .mini-linedata:hover .close {
    display: block;
  }
  .template-div {
    position: absolute;
    z-index: 10;
    width: 100%;
  }
  .template-div-icon {
    border-radius: 8px;
    margin: 0 8%;
  }
  .template-div-2 {
    border-radius: 8px;
    margin: 0 8%;
    flex: 2;
  }
  .attribute-warpper {
    border: 5px solid #f5f5f5;
    padding: 10px;
    margin-bottom: 10px;
  }
</style>
