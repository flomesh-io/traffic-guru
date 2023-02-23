<template>
  <a-card
    class="card nopd"
    :loading="loading"
  >
    <template #title>
      {{ title ? title : $t("Service Imports") }}
    </template>
    <template #extra>
      <div v-if="embed">
        <slot name="extra" />
      </div>
      <div v-if="hasSearch">
        <a-input-search
          v-model:value="key"
          @search="search()"
          class="right-search-input"
          :placeholder="$t('search')"
        />
        <a-divider
          v-if="!embed"
          type="vertical"
        />
        <EnvSelector v-if="!embed" />
      </div>
    </template>
    <div>
      <a-table
        :pagination="{
          showSizeChanger: false,
          showQuickJumper: false,
          onShowSizeChange: search,
          onChange: search,
          current: pageNo,
          pageSize: pageSize,
          showTotal: (total, range) => `${$t('Total')} ${total}`,
          total: total,
        }
        "
        :columns="dataColumns"
        :data-source="list"
        class="bg-white"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'registry.name'">
            {{ record.registry?.name }}
          </template>
          <template v-else-if="column.dataIndex === 'policy'">
            {{ record.content? $t(record.content.type) : $t('unset') }}
          </template>
          <template v-else-if="column.dataIndex === 'serviceExports'">
            <div v-if="record.serviceExports">
              <a-tag
                :key="index"
                v-for="(ep, index) in record.serviceExports"
                :closable="false"
              >
                {{ ep?.service?.registry?.name }} / {{ ep?.service?.namespace }} / {{ ep?.service?.name }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a
                      v-permission="['service:update']"
                      @click="edit(record)"
                    >{{ (record.content && record.content.type ? $t("edit") :$t("create")) +' '+ $t("Policy") }}</a>
                  </a-menu-item>
                </a-menu>
              </template>
              <a><MoreOutlined /></a>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </div>
  </a-card>
  <a-modal
    v-model:visible="visible"
    :title="'MCS '+$t('Policy')"
    @ok="valid"
    width="80%"
    :ok-text="$t('Save')"
  >
    <a-form
      :model="payload"
      :wrapper-col="{ span: 24 }"
      ref="form"
    >
      <ServiceImportCard v-model:d="payload" />
    </a-form>
  </a-modal>
</template>

<script>
import _ from "lodash";
import {
  MoreOutlined,
} from "@ant-design/icons-vue";
import EnvSelector from "@/components/menu/EnvSelector";
import ServiceImportCard from "./ServiceImportCard";

const columns = [
  {
    key: "Registry",
    dataIndex: "registry.name",
  },
  {
    key: "Namespace",
    width: 130,
    dataIndex: "namespace",
  },
  {
    key: "Exports",
    dataIndex: "serviceExports",
  },
  {
    key: "Policy",
    dataIndex: "policy",
  },
  {
    key: "Action",
    width: 130,
    dataIndex: "action",
  },
];
export default {
  name: "ServiceImportList",
  components: {
    MoreOutlined,
    EnvSelector,
    ServiceImportCard,
  },

  props: [
    "embed",
    "serviceExport",
  ],

  i18n: require("@/i18n"),
  data() {
    return {
      key: "",
      syncLoading: -1,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      columns,
      loading: true,
      visible: false,
      payload:{content:{type:'Locality',enabled:true,targets:[{enabled:true,weight:10},{enabled:true,weight:20}]},serviceExports:[{service:{name:"service A"}},{service:{name:"service B"}}],registry:{name:"Reg A"},namespace:{name:"NS A"}},
      list: [],
    };
  },

  computed: {

    start(){
      return (this.pageNo - 1) * this.pageSize;
    },

    dataColumns() {
      return this.columns
        .filter((column) => column.key != "Organization" || this.$isPro)
        .map((column) => {
          column.title = this.$t(column.key);
          return column;
        });
    },
  },

  created() {
    this.search();
  },
	
  methods: {
    valid() {
      this.$refs.form
        .validateFields()
        .then(() => {
          this.save();
        })
        .catch(() => {});
    },

    save(){
      let input = _.cloneDeep(this.payload);
      input.registry = this.payload.registry.id;
      input.serviceExports = [];
      if(this.payload.serviceExports){
        this.payload.serviceExports.forEach((serviceExport)=>{
          input.serviceExports.push(serviceExport.id);;
        })
      }
      let _pid = input.id;
      delete input.id;
      this.$gql
        .mutation(
          `updateServiceImport(id:${_pid}, data: $data){data{id}}`,
          { data: input },
          { data: "ServiceImportInput!" },
        )
        .then(() => {
          this.visible = false;
          this.search();
          this.$message.success(this.$t("Save successfully"), 3);
        });
    },

    edit(d){
      this.payload = _.cloneDeep(d);
      this.visible = true;
      if(!this.payload.content){
        this.payload.content = {};
      }
      if(!this.payload.content.type){
        this.payload.content.type = "Locality";
      }
      if(this.payload.policySwitch == null){
        this.payload.policySwitch = true;
      }
      if(this.payload.serviceExports){
        if(!this.payload.content.targets || typeOf(this.payload.content.targets) != "object"){
          this.payload.content.targets = {};
        }
        this.payload.serviceExports.forEach((item)=>{
          let serviceExportId = item.id;
          let registry = item.service?.registry;
          if(!this.payload.content.targets[serviceExportId]){
            this.payload.content.targets[serviceExportId] = {registry,weight:0,enabled:false};
          }
        })
      }
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      let pagination = {
        start: this.start, 
        limit: this.pageSize
      };
      this.loading = true;
      let filters = {};
      filters.name = { contains: this.key };
      if(this.embed){
        filters.serviceExports = { eq: this.serviceExport };
      }
      this.$gql
        .query(
          `serviceImports(filters: $filters, pagination: $pagination){
						data{id,attributes{
							name,
							content,
							policySwitch,
							namespace,
							registry{data{id,attributes{name}}},
							serviceExports{data{id,attributes{
								content,
								service{data{id,attributes{
									uid,
									namespace,
									name,
									registry{data{id,attributes{name}}},
									content,
									updatedAt
								}}}
							}}}
						}},
						meta{pagination{total}}
					}`,
          { 
            filters,pagination
          },{
            filters: "ServiceImportFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.list = this.reset(res.values);
          this.total = res.pagination.total;
          this.loading = false;
        });
    },
		
    reset(list) {
      if (!list) {
        return [];
      }
      return list;
    },
  }
};
</script>

<style lang="less" scoped></style>
