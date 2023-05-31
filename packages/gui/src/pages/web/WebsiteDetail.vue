<template>
  <PageLayout
    :hide-breadcrumb="true"
    :form-state="detail"
    ref="layout"
  >
    <template #headerContent>
      <DetailList
        size="small"
        :col="2"
      >
        <DetailListItem
          :term="$t('Domain')"
          name="domain"
          :rules="rules.required"
        >
          <a-input
            :placeholder="$t('unset')"
            v-model:value="detail.domain"
            class="width-200"
          />
        </DetailListItem>
        <DetailListItem
          :term="$t('Port')"
          name="port"
          :rules="rules.numberRequired"
        >
          <a-input-number
            v-model:value="detail.port"
            :placeholder="$t('unset')"
            class="width-100"
          />
        </DetailListItem>

        <DetailListItem
          :term="$t('Enabled TLS')"
        >
          <a-switch
            class="ml-10"
            v-model:checked="detail.tlsEnabled"
          />
        </DetailListItem>
        <DetailListItem
          :term="$t('TLS Port')"
          name="tlsPort"
          v-if="detail.tlsEnabled"
          :rules="rules.numberRequired"
        >
          <a-input-number
            :placeholder="$t('unset')"
            v-model:value="detail.tlsPort"
            class="width-100"
          />
        </DetailListItem>
        <DetailListItem
          :term="$t('TLS Certificate')"
          :name="certificate"
          v-if="detail.tlsEnabled"
          :rules="rules.required"
        >
          <a-select
            :placeholder="$t('unset')"
            class="width-200"
            v-model:value="detail.certificate"
            allow-clear
          >
            <a-select-option
              :value="certificate.id"
              :key="certificateIdx"
              v-for="(certificate, certificateIdx) in certificates"
            >
              {{ certificate.name + "(" + certificate.type + ")" }}
            </a-select-option>
          </a-select>
          <a
            href="javascript:void(0)"
            @click="goCertificates"
            class="link ml-10"
          >{{ $t('New Certificate') }}</a>
        </DetailListItem>
      </DetailList>
    </template>
    <template
      v-if="pid != ''"
      #extra
    />
    <template #action>
      <a-button
        type="default"
        @click="validate"
        v-if="pid != ''"
      >
        {{ $t("save") }}
      </a-button>
      <a-button
        type="primary"
        @click="validate"
        v-else
      >
        {{ $t("create") }}
      </a-button>
    </template>

    <a-row class="mg-0">
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
              :title="$t('Static Resource')"
              :bordered="false"
              :loading="loading"
            >
              <a-row class="mg-0">
                <a-col
                  class="col-pd"
                  :xl="12"
                  :lg="24"
                  :md="24"
                  :sm="24"
                  :xs="24"
                >
                  <a-upload-dragger
                    accept=".zip"
                    v-model:file-list="fileList"
                    :headers="upHeaders"
                    name="files"
                    class="avatar-uploader"
                    :show-upload-list="true"
                    :action="UPLOAD"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                  >
                    <p class="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p class="ant-upload-text">
                      {{ $t('Click or drag file(.zip) to this area to upload') }}
                    </p>
                  </a-upload-dragger>
                </a-col>
                <a-col
                  class="col-pd"
                  :xl="12"
                  :lg="24"
                  :md="24"
                  :sm="24"
                  :xs="24"
                >
                  <div
                    @click="showDrawer"
                    :class="resource?'':'btn-disabled'"
                    class="dashed-card-area"
                  >
                    <div>
                      <div>
                        <svg
                          v-if="!downloading"
                          class="card-avatar icon"
                          aria-hidden="true"
                        >
                          <use
                            xlink:href="#icon-pipy"
                          />
                        </svg>
                        <LoadingOutlined
                          v-else
                          class="card-avatar font-30 icon"
                        />
                      </div>
                      <h3>{{ $t('Download pipy website package') }} <span v-if="resource">({{ resource[0].name }})</span></h3>
                    </div>
                    <WebsiteDownload
                      :pid="pid"
                      v-model:downloading="downloading"
                      v-model:visible="visible"
                    />
                  </div>
                </a-col>
              </a-row>
            </a-card>
            <a-card
              :title="$t('Reverse Proxy')"
              class="mt-15 nopd"
              :bordered="false"
              :loading="loading"
            >
              <template #extra>
                <div>
                  <a-button
                    type="link"
                    shape="circle"
                    @click="addProvider"
                  >
                    <template #icon>
                      <PlusCircleTwoTone class="font-20 icon-menu-sm rotate-icon" />
                    </template>
                  </a-button>
                </div>
              </template>
              <a-list
                size="large"
                :pagination="false"
              >
                <a-list-item
                  :key="i"
                  v-for="(item, i) in detail.providers"
                >
                  <a-list-item-meta>
                    <template #title>
                      <b>{{ $t("Path") }} : </b>
                      <a @click="editProvider(item)">
                        {{ item.path ? item.path : "-" }}
                      </a>
                    </template>
                    <template #description>
                      <b>{{ $t("Host") }} : </b>
                      <span
                        v-if="item.hosts && item.hosts.length > 0 "
                      >
                        <span
                          v-for="(host, index) in item.hosts"
                          :key="index"
                        >
                          {{ host }};
                        </span>
                      </span>
                      <span v-else>{{ item.content }} </span>
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <div>
                      <a-dropdown>
                        <template #overlay>
                          <a-menu>
                            <a-menu-item>
                              <a @click="editProvider(item)">{{
                                $t("edit")
                              }}</a>
                            </a-menu-item>
                            <a-menu-item>
                              <a-popconfirm
                                placement="topLeft"
                                :ok-text="$t('Yes')"
                                :cancel-text="$t('No')"
                                @confirm="removeProvider(i)"
                              >
                                <template #title>
                                  <p>{{ $t("Tip") }}</p>
                                  <p>
                                    {{ $t("Are you sure to remove this?") }}
                                  </p>
                                </template>
                                <a>{{ $t("Remove") }}</a>
                              </a-popconfirm>
                            </a-menu-item>
                          </a-menu>
                        </template>
                        <a>
                          <MoreOutlined class="mr-20" />
                        </a>
                      </a-dropdown>
                    </div>
                  </template>
                  <!--
                    <div class="list-content">
                    <div class="flex list-content-item">
                    <div class="flex-item pl-10">
                    <span>{{ $t("Default") }}</span>
                    <p>
                    <a-switch
                    @change="changePrdDefault(item, i)"
                    v-model:checked="item.isDefault"
                    size="small"
                    />
                    </p>
                    </div>
                    </div>
                    </div>
                  -->
                </a-list-item>
              </a-list>
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="$t('Mime Type')"
          >	
            <JsonEditor
              id="mimeType"
              v-model:value="detail.mimeType"
            />
          </a-tab-pane>
          <a-tab-pane
            key="3"
            :tab="$t('Log')"
          />
          <a-tab-pane
            key="4"
            :tab="$t('Statistic')"
          />
          <a-tab-pane
            key="5"
            :tab="$t('Monitor')"
          />
        </a-tabs>
      </a-col>
    </a-row>
		
    <a-modal
      :destroy-on-close="true"
      v-model:visible="visibleProvider"
      :title="$t('Provider')"
      @ok="validProvider"
      width="70%"
      :cancel-text="$t('cancel')"
      :ok-text="isEdit ? $t('Save') : $t('create')"
    >
      <a-form
        :model="payload"
        :wrapper-col="{ span: 24 }"
        ref="providerForm"
      >
        <a-descriptions bordered>
          <a-descriptions-item
            :label="$t('path')"
            :span="3"
          >
            <a-input
              :placeholder="$t('unset')"
              v-model:value="payload.path"
              class="width-300"
            />
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Host')"
            :span="3"
          >
            <div>
              <FormItem
                name="hosts"
                :rules="rules.arrayRequired"
              >
                <TagList
                  v-model:list="payload.hosts"
                  name="hosts"
                  placeholder="192.168.10.1:8080"
                />
              </FormItem>
            </div>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Algo')"
            :span="3"
          >
            <div>
              <FormItem
                name="hosts"
              >
                <a-select
                  :placeholder="$t('unallocated')"
                  class="width-220"
                  v-model:value="payload.algo"
                >
                  <a-select-option
                    v-for="(item, index) in algos"
                    :key="index"
                    :value="item.id"
                  >
                    <span v-if="item.id">{{ item.name }}</span>
                    <i
                      v-if="!item.id"
                      class="gray"
                    >{{ item.name }} </i>
                  </a-select-option>
                </a-select>
              </FormItem>
            </div>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Rewrite Path')"
            :span="1"
          >
            <div>
              <FormItem
                name="hosts"
              >
                <a-switch
                  v-model:checked="payload.rewritePath"
                />
              </FormItem>
            </div>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('New Path')"
            :span="2"
          >
            <div>
              <FormItem
                name="hosts"
              >
                <a-input
                  :placeholder="$t('unset')"
                  v-model:value="payload.newPath"
                  :disabled="!payload.rewritePath"
                />
              </FormItem>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </a-form>
    </a-modal>
    <RiseOutlined v-if="false" />
  </PageLayout>
</template>

<script>
import {
  PlusCircleTwoTone,
  MoreOutlined,
  RiseOutlined,
  InboxOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import { mapState } from "vuex";
import DetailListItem from "@/components/tool/DetailListItem";
import JsonEditor from "@/components/editor/JsonEditor";
import FormItem from "@/components/tool/FormItem";
import TagList from "@/components/tag/TagList";
import WebsiteDownload from "./WebsiteDownload";
import { getHeaders } from "@/utils/request";
import { UPLOAD } from "@/services/api";

export default {
  name: "WebsiteDetail",
  i18n: require("@/i18n"),
  components: {
    DetailListItem,
    DetailList,
    PageLayout,
    JsonEditor,
    FormItem,
    TagList,
    PlusCircleTwoTone,
    MoreOutlined,
    RiseOutlined,
    LoadingOutlined,
    InboxOutlined,
    WebsiteDownload,
  },

  data() {
    return {
      RiseOutlined,
      UPLOAD,
      fileList: [],
      upLoading: false,
      upHeaders: {},
      visible:false,
      isEdit:false,
      pid: "",
      upstreams: [],
      certificates: [],
      defaultMime: [],
      visibleProvider:false,
      payload: {
        path: "subpath1/",
        hosts: []
      },

      resource:null,
      detail: {
        domain:'',
        port:80,
        mimeType:JSON.stringify({}),
        tlsEnabled:false,
        tlsPort:443,
        providers:[],
        certificate:null,
        resource:null,
      },

      downloading:false,
      loading: true,
      algos: [
        { name: "RoundRobinLoadBalancer", id: "RoundRobinLoadBalancer" },
        { name: "LeastWorkLoadBalancer", id: "LeastWorkLoadBalancer" },
        { name: "HashingLoadBalancer", id: "HashingLoadBalancer" },
      ],
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
    this.getCertificates();
    this.upHeaders = getHeaders();
		
    this.loadData();
    if(this.$isPro){
      this.$gql.query(`upstreams{data{id,attributes{name,content}}}`).then((res) => {
        this.upstreams = res.data;
      });
    }
    this.$gql
      .query(`systemSettings(filters:{type:{eq:"MimeTypes"}}){data{id,attributes{mode,content}}}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          this.defaultMime = res.data[0].content;
          if (!this.pid) {
            this.detail.mimeType = JSON.stringify(this.defaultMime) || JSON.stringify({});
          }
        }
      });
  },

  methods: {
    showDrawer(){
      this.visible = true;
    },

    loadData(){
      if (this.pid != "") {
        this.loading = true;
        this.$gql
          .query(`website(id: ${this.pid}){data{id,attributes{domain,port,mimeType,tlsEnabled,tlsPort,providers,certificate{data{id}},resource{data{id,attributes{name}}}}}}`)
          .then((d) => {
            let res = d.data;
            res.mimeType = JSON.stringify(res.mimeType)
            this.detail = res;
            delete this.detail.id;
            if(res.certificate){
              this.detail.certificate = res.certificate.id;
            }
            if(res.resource && res.resource.length>0){
              this.resource = res.resource;
              this.detail.resource = [];
              this.resource.forEach((file)=>{
                this.detail.resource.push(file.id);
              })
            } else {
              this.detail.resource = null;
            }
            this.loading = false;
          });
      } else {
        this.detail = {
          domain:'',
          port:80,
          mimeType:JSON.stringify({}),
          tlsEnabled:false,
          tlsPort:443,
          providers:[],
          certificate:null
        };
        this.loading = false;
      }
    },

    goCertificates(){
      this.$router.push({
        path: "/ops-center/certificates",
      });
    },

    handleChange(info) {
      if (info.file.status === "uploading") {
        this.upLoading = true;
        return;
      }
      if (info.file.status === "done") {
        this.detail.resource = [info.file.response[0].id];
        this.upLoading = false;
      }
      if (info.file.status === "error") {
        this.upLoading = false;
        this.$message.error("upload error");
      }
    },
		
    beforeUpload() {
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   this.$message.error("Image must smaller than 2MB!");
      // }
      return true;
    },
		
    validProvider () {
      this.$refs.providerForm
        .validateFields()
        .then(() => {
          this.handleOkProvider();
        })
        .catch(() => { });
    },
		
    handleOkProvider () {
      this.visibleProvider = false;
      if (!this.isEdit) {
        this.detail.providers.push(_.cloneDeep(this.payload));
      }
    },

    addProvider () {
      this.isEdit = false;
      this.payload = {
        path: "/",
        hosts: [],
        rewritePath: false,
        newPath: "",
        algo: "RoundRobinLoadBalancer"
      };
      this.visibleProvider = true;
    },
		
    editProvider (node) {
      this.isEdit = true;
      this.payload = node;
      this.visibleProvider = true;
    },
		
    removeProvider (i) {
      this.detail.providers.splice(i, 1);
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
          { filters: {type: {eq: "api"}}},
          {
            filters: "CertificateFiltersInput",
          }
        )
        .then((res) => {
          this.certificates = res.data;
        });
    },

    saveSelector (target) {
      if(target.content.targets){
        target.content.targets.forEach(item=>{
          this.payload.hosts.push(item.host);
        })
      }
    },

    valid() {
      return true;
    },

    validate() {
      this.$refs.layout.$refs.form
        .validateFields()
        .then(() => {
          this.save();
        })
        .catch(() => {});
    },

    save() {
      if (!this.valid()) {
        return;
      }
      let savedata = this.detail;
      savedata.mimeType = JSON.parse(savedata.mimeType) 
      if (this.pid != "") {
        this.$gql
          .mutation(
            `updateWebsite(id:${this.pid}, data: $data){data{id}}`,
            {
              data: savedata
            },{
              data: "WebsiteInput!"
            }
          )
          .then(() => {
            this.$message.success(this.$t("Save successfully"), 3);
            this.loadData();
          });
      } else {
        this.$gql
          .mutation(
            `createWebsite(data: $data){data{id}}`,
            {
              data: savedata
            },{
              data: "WebsiteInput!"
            }
          )
          .then((res) => {
            this.$message.success(this.$t("Created successfully"), 3);
            this.pid = res.data.id;
            this.loadData();
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
