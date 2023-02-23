<template>
  <a-result
    v-if="!isEdit && !loading"
    status="404"
    :title="$t('Not Service Export')"
  >
    <template #extra>
      <a-button
        :loading="saveLoading"
        @click="openExport"
        type="primary"
      >
        {{ $t('Export') }}
      </a-button>
    </template>
  </a-result>
  <a-row
    v-if="pid"
    class="row-mg"
  >
    <a-col
      class="col-pd"
      :xl="10"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24"
    >
      <a-card
        class="card mb-20 nopd"
        :bordered="false"
        :loading="loading"
        :title="$t('Service Export')"
      >
        <template #extra>
          <a-space>
            <a-popconfirm 
              :ok-text="$t('Yes')"
              :cancel-text="$t('No')"
              @confirm="remove"
            >
              <template #title>
                <p>{{ $t("Tip") }}</p>
                <p>{{ $t("Are you sure to delete this?") }}</p>
              </template>
              <a-button
                :loading="saveLoading"
                v-permission="['service:update']"
              >
                {{ $t("Clear") }}
              </a-button>
            </a-popconfirm>
            <a-button
              :loading="saveLoading"
              type="primary"
              @click="saveValid"
              v-permission="['service:update']"
            >
              {{ $t("Save") }}
            </a-button>
          </a-space>
        </template>
        <a-form
          :model="payload"
          :wrapper-col="{ span: 24 }"
          ref="updateForm"
        >
          <ServiceExportForm
            :ports="ports"
            v-model:d="payload"
          />
        </a-form>
      </a-card>
    </a-col>
    <a-col
      class="col-pd"
      :xl="14"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24"
    >
      <ServiceImportList
        :embed="true"
        :service-export="pid"
      />
    </a-col>
  </a-row>
  <a-modal
    v-model:visible="visible"
    :title="$t('Service Export')"
    @ok="createValid"
    @cancel="cancel"
    width="50%"
    :ok-text="$t('Start')"
  >
    <a-form
      :model="payload"
      :wrapper-col="{ span: 24 }"
      ref="createForm"
    >
      <ServiceExportForm
        :ports="ports"
        v-model:d="payload"
      />
    </a-form>
  </a-modal>
</template>

<script>
import _ from "lodash";
import ServiceImportList from "./ServiceImportList";
import ServiceExportForm from "./ServiceExportForm";

export default {
  name: "ServiceExportCard",
  i18n: require("@/i18n"),
  components: {
    ServiceImportList,
    ServiceExportForm,
  },

  props:['modal', 'sid', 'isEdit', 'ports'],
  data() {
    return {
      visible:false,
      loading:true,
      saveLoading:false,
      pid:null,
      payload:{content:{portNumber:0,path:''}},
    };
  },

  watch:{
    modal: {
      deep: true,
      immediate: true,
      handler(v) {
        this.visible = v;
      },
    },
  },

  created() {
    this.visible = this.modal;
    this.loadData();
  },

  methods: {
    loadData(){
      this.loading = true;
      let filters = {
        service: {id: { eq: this.sid }}
      };
      this.$gql
        .query(
          `serviceExports(filters: $filters, pagination:{ start: 0, limit: ${this.$DFT_LIMIT} }){
						data{id,attributes{
						  service{data{id,attributes{name}}},
							content
						}}
					}`,
          { 
            filters
          },{
            filters: "ServiceExportFiltersInput",
          }
        )
        .then((res) => {
          this.loading = false;
          if(res.data && res.data.length>0){
            this.payload = res.data[0];
            this.pid = res.data[0].id;
            this.$emit("update:isEdit",true);
          }else{
            if(this.ports.length>0){
              this.payload.content.portNumber = this.ports[0].port;
            }
            this.$emit("update:isEdit",false);
          }
        });
    },

    createValid() {
      this.$refs.createForm
        .validateFields()
        .then(() => {
          this.save();
        })
        .catch(() => {});
    },

    saveValid() {
      this.$refs.updateForm
        .validateFields()
        .then(() => {
          this.save();
        })
        .catch(() => {});
    },

    remove(){
      this.$gql
        .mutation(`deleteServiceExport(id:${this.pid}){data{id}}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.$emit("update:isEdit",false);
          this.pid = null;
          this.loadData();
        });
    },

    save(){
      this.$emit("start");
      this.$emit("update:modal",false);
      this.saveLoading = true;
			
      let input = _.cloneDeep(this.payload);
      delete input.id;
      input.service = this.sid;
      if (this.pid) {
        this.$gql
          .mutation(
            `updateServiceExport(id:${this.pid}, data: $data){data{id}}`,
            { data: input },
            { data: "ServiceExportInput!" },
          )
          .then(() => {
            this.$emit("save");
            this.saveLoading = false;
            this.$message.success(this.$t("Save successfully"), 3);
          });
      } else {
        this.$gql
          .mutation(
            `createServiceExport(data: $data){data{id}}`,
            { data: input },
            { data: "ServiceExportInput!" },
          )
          .then(() => {
            this.$emit("save");
            this.saveLoading = false;
            this.$message.success(this.$t("Created successfully"), 3);
            this.loadData();
          });
      }
    },

    openExport(){
      this.$emit("export",false);
      this.$emit("update:modal",true);
    },

    cancel(){
      this.$emit("update:modal",false);
    },
  },
};
</script>
