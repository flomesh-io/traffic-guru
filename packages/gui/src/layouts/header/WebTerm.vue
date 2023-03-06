<template>
  <CodeOutlined
    class="font-16"
    @click="showModal"
  />
  <a-modal
    :title="'Web ' + $t('Console')"
    class="web-term-modal"
    width="80%"
    :footer="null"
    v-model:visible="visible"
    @ok="handleOk"
  >
    <a-card
      :tab-list="tabListNoTitle"
      :active-tab-key="noTitleKey"
      :bordered="false"
      class="nopd"
      @tabChange="key => onTabChange(key)"
    >
      <template #customTab="item">
        {{ $t(item.tab) }}
      </template>
      <template #tabBarExtraContent>
        <div
          class="flex"
          v-if="noTitleKey == 'History'"
        >
          <div>
            <a-select v-model:value="selectReg">
              <a-select-option 
                v-for="(reg, idx) in regs" 
                :key="idx" 
                :value="reg.id"
              >
                {{ reg.name }}
              </a-select-option>
            </a-select>
          </div>
          <div
            class="flex-item"
          >
            <a-input-search
              v-model:value="key"
              @search="getKubectls()"
              class="right-search-input"
              :placeholder="$t('search')"
            />
          </div>
          <div>
            <a-pagination
              class="relative"
              style="top:5px"
              @change="getKubectls"
              v-model:current="pageNo"
              simple
              :total="total"
              :page-size="1"
            />
          </div>
        </div>
        <EnvSelector
          v-else-if="noTitleKey == 'New resource'"
          type="k8s"
          :is-filter="true"
          :no-all="true"
          @envChange="envChange2"
        />
        <EnvSelector
          v-else
          type="k8s"
          :is-filter="true"
          :no-all="false"
          @envChange="envChange1"
        />
      </template>
      <div
        class="flex"
        v-if="noTitleKey == 'Terminal'"
      >
        <div class="flex-item">
          <ShellEditor
            @enter="enter"
            id="Terminal"
            v-model:value="shell"
          />
        </div>
        <div class="quick-comd">
          <a-card-grid
            class="card-grid"
            @click="changeShell(item.comd)"
            v-for="(item,index) in quicks"
            :key="index"
          >
            {{ item.name }}
          </a-card-grid>
        </div>
      </div>
      <div
        class="flex"
        v-else-if="noTitleKey == 'New resource'"
      >
        <div class="flex-item">
          <YamlEditor
            @fetch="getYaml"
            v-model:value="yamlConfig"
          />
        </div>
        <div class="quick-comd">
          <a-upload
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
          >
            <a-button
              class="Upload"
              type="link"
              block
            >
              <FileSearchOutlined />
              {{ $t('select') }}
            </a-button>
          </a-upload>
          <a-button
            class="Upload"
            type="link"
            block
            @click="clearConfig"
          >
            <DeleteRowOutlined />
            {{ $t('Clear') }}
          </a-button>
          <a-button
            :disabled="!yamlConfig"
            class="Upload"
            type="link"
            block
            @click="createYaml"
          >
            <UploadOutlined />
            {{ $t('create') }}
          </a-button>
        </div>
      </div>
      <div
        class="flex"
        v-else-if="noTitleKey == 'History'"
      >
        <div class="flex-item">
          <ShellEditor
            :is-readonly="true"
            id="History"
            :value="historyShell"
          />
        </div>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import EnvSelector from "@/components/menu/EnvSelector";
import ShellEditor from "@/components/editor/ShellEditor";
import YamlEditor from "@/components/editor/YamlEditor";
import { CodeOutlined,UploadOutlined,FileSearchOutlined,DeleteRowOutlined } from "@ant-design/icons-vue";
export default {
  name: "WebTerm",
  components: {
    YamlEditor,
    ShellEditor,
    UploadOutlined,
    FileSearchOutlined,
    DeleteRowOutlined,
    CodeOutlined,
    EnvSelector,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      key: "",
      pageSize: 10,
      pageNo: 1,
      total: 0,
      loading: true,
      visible: false,
      fileList:[],
      regs:[],
      selectReg:null,
      kubectls:[],
      yamlConfig: '',
      quicks:[
        {name:'Version',comd:'kubectl version'},
        {name:'Cluster Info',comd:'kubectl cluster-info'},
        {name:'Get Nodes',comd:'kubectl get nodes'},
        {name:'Get Crd',comd:'kubectl get crd'},
        {name:'Clear',comd:'clear'},
      ],

      noTitleKey:'Terminal',
      tabListNoTitle:[
        {
          key: 'Terminal',
          tab: 'Terminal',
        },
        {
          key: 'New resource',
          tab: 'New resource',
        },
        {
          key: 'History',
          tab: 'History',
        },
      ],

      shell: "",
      historyShell: "",
      aid: "",
      name: "",
      address: [],
      node: { name: "" },
      k8yaml: null,
      env1: {},
      env2: {},
    };
  },

  computed: {
    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  created() {
    this.registries();
  },

  methods: {
    enter(cmd){
      if(cmd.indexOf("kubectl ") == 0){
        this.createKubectl(cmd);
      } else {
        this.$message.error(this.$t("Must a kubectl command"), 3);
      }
    },

    onTabChange(value){
      this.noTitleKey = value;
      if(this.noTitleKey == "History"){
        this.getKubectls();
      }
    },

    clearConfig(){
      this.k8yaml = null;
      this.yamlConfig = "";
    },
		
    getYaml(){
      this.k8yaml = this.yamlConfig;
    },

    envChange1(data) {
      this.env1 = data;
    },

    envChange2(data) {
      this.env2 = data;
    },

    beforeUpload(file) {
      return new Promise(() => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if(reader.result){
            let configText = atob(reader.result.split("base64,")[1]);
            this.k8yaml = configText;
            this.yamlConfig = configText;
          }
        };
      });
    },

    showModal(){
      this.visible = true;
    },

    handleOk(){
      this.visible = false;
    },

    changeShell(cmd) {
      if (cmd == "clear") {
        this.shell = "";
      } else {
        this.shell += cmd + "\n";
        this.createKubectl(cmd);
      }
    },
		
    createKubectl(command) {
      let data = {
        command,
        registry: this.env1.registerId
      }
      if(!!this.env1.namespaceId){
        data.namespace = this.env1.namespaceId;
      }
      this.$gql
        .mutation(
          `createKubectl(data: $data){data{id,attributes{result}}}`,
          { data },
          {
            data: "KubectlInput!",
          },
        )
        .then((res) => {
          if(res.data.result){
            this.shell += res.data.result + "\n";
          }else {
            this.shell += '[void]' + "\n";
          }
        });
    },

    createYaml() {
      this.$gql
        .mutation(
          `createYaml(data: $data){data{id}}`,
          {
            data: {
              yaml: this.k8yaml,
              namespace: this.env2.namespaceId
            }
          },
          {
            data: "YamlInput!",
          },
        )
        .then(() => {
          this.$message.success(this.$t("Created successfully"), 3);
          this.clearConfig();
        });
    },
		
    registries() {
      let pagination = {
        start: 0, 
        limit: -1
      };
      let filters = {
        name: { contains: this.key },
        type:{ eq: "k8s" }
      };
      this.$gql
        .query(
          `registries(filters: $filters, pagination: $pagination){
						data{id,attributes{
							name,
							type,
							address,
							services{data{id,attributes{name}}},
							namespaces{data{id,attributes{
								name,
								services{data{id,attributes{
									uid,
									fleet{data{id,attributes{name}}},
									organization{data{id,attributes{name}}},
									namespace,
									name,
									registry{data{id,attributes{name}}},
									content,
									createdAt
								}}}
							}}}
						}},
						meta{pagination{total}}
					}`,
          { 
            filters,pagination
          },{
            filters: "RegistryFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.regs = res.data;
          if(this.regs.length>0){
            this.selectReg = this.regs[0].id
          }
        });
    },

    getKubectls(pageNo) {
      if (pageNo) {
        this.pageNo = pageNo;
      }
      let pagination = {
        start: this.start, 
        limit: this.pageSize
      };
      this.loading = true;
      let filters = {
        command: { contains: this.key }
      };
      if(this.selectReg){
        filters.registry = { id: {eq: this.selectReg} }
      }
      this.$gql
        .query(
          `kubectls(filters: $filters, pagination: $pagination){
						data{id,attributes{
							command,
							registry{data{id,attributes{name}}},
							namespace{data{id,attributes{name}}},
							user{data{id,attributes{username}}},
							result,
							createdAt
						}},
						meta{pagination{total}}
					}`,
          { 
            filters,pagination
          },{
            filters: "KubectlFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.historyShell = "";
          this.kubectls = res.data;
          this.kubectls.forEach((kubectl)=>{
            this.historyShell += (kubectl.namespace?`[${kubectl.registry?.name}/${kubectl.namespace?.name}] >`:`[${kubectl.registry?.name}] >`)+kubectl.command +'\n';
            this.historyShell += kubectl.result?kubectl.result:'[void]' +'\n';
          })
          this.total = res.pagination.total;
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="less">
  .web-term-modal{
		.ant-modal-body{
			padding: 0 !important;
		}
		.card-grid{
			width:100%;
			background-color: #fff;
			cursor: pointer;
		}
		.quick-comd{
			width: 130px;
			font-weight: bold;
			color: #00adef;
			text-align: center;
			background-color: #f5f5f5;
		}
		.Upload{
			background-color: #fff;
			height: 40px;
			margin-top: 1px;
		}
		.ant-upload.ant-upload-select{
			display: block;
		}
		
	} 
	
</style>
