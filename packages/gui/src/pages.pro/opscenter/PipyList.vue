<template>
  <PageLayout
    :title="$t('Pipy')"
    :hide-head="hideHead"
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
                    <span>{{ $t("Type") }}</span>
                  </div>
                  <div class="content">
                    <a-form-item>
                      <a-radio-group
                        size="small"
                        @change="search(1)"
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
                    </a-form-item>
                  </div>
                </div>
              </a-form>
            </div>
            <div
              v-permission="['fleet:create']"
              class="width-200"
            >
              <HeadInfo
                class="pd-0 split-right"
                :title="$t('create')+' Pipy'"
              >
                <template #body>
                  <div>
                    <PlusCircleTwoTone
                      @click="addpipy"
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
      <CardList
        :result-empty="{ status: 404, title: $t('No data') }"
        :loading="loading"
        :data-source="list"
        :hide-action-title="!hideHead"
        type="component"
        :actions="[
          /*{
						icon: 'ExportOutlined',
						hide: true,
						text: $t('Force Push'),
						call: forcepush,
						permission: ['fleet:update'],
					},*/
          { icon: 'EditOutlined', text: $t('edit'), call: detail },
          {
            icon: 'DeleteOutlined',
            text: $t('delete'),
            call: remove,
            hide: true,
          },
        ]"
      >
        <template #default="{ item }">
          <a-card-meta>
            <template #title>
              <div class="mb-3">
                <a-badge
                  status="processing"
                  v-if="item.status == 'running' && item.type?.toLowerCase() == 'pipy'"
                />
                <a-badge
                  status="processing"
                  color="red"
                  v-if="item.status != 'running' && item.type?.toLowerCase() == 'pipy'"
                />{{
                  item.name
                }}
              </div>
            </template>
            <template #avatar>
              <svg
                class="card-avatar icon"
                aria-hidden="true"
              >
                <use :xlink:href="'#'+icons[item.type].icon" />
              </svg>
            </template>
            <template #description>
              <div class="meta-content">
                {{ $t("Type") }}：{{ icons[item.type].label }}
              </div>
            </template>
          </a-card-meta>
        </template>
      </CardList>
      <a-pagination
        @change="search"
        v-model:current="pageNo"
        :total="total"
        :page-size="pageSize"
        show-less-items
      />
    </div>
  </PageLayout>
</template>

<script>
import HeadInfo from "@/components/tool/HeadInfo";
import {
  PlusCircleTwoTone,
} from "@ant-design/icons-vue";
import { mapState } from "vuex";
import CardList from "@/components/card/CardList";
import PageLayout from "@/layouts/PageLayout";

export default {
  name: "PipyList",
  i18n: require("@/i18n"),

  components: {
    PageLayout,
    CardList,
    PlusCircleTwoTone,
    HeadInfo,
  },

  props: ["hideHead"],
	
  data() {
    return {
      pageSize: 12,
      pageNo: 1,
      total: 0,
      key: "",
      list: [],
      icons:{
        pipy: {icon:"icon-pipy",label:'API'},
        pipy4lb: {icon:"icon-pipy",label:'4LB'},
        sidecar: {icon:"icon-car",label:'Sidecar'},
        tunnelInternal: {icon:"icon-pipy",label:'Tunnel Internal'},
        tunnelExternal: {icon:"icon-pipy",label:'Tunnel External'},
      },

      viewtypevalue: 0,
      viewtype: [
        { value:0 ,filter: {in:["pipy","pipy4lb","sidecar","tunnelInternal", "tunnelExternal"]}, label: "All" },
        { value:1 ,filter: {eq:"pipy"}, label: "API" },
        { value:2 ,filter: {eq:"pipy4lb"}, label: "4LB" },
        { value:3 ,filter: {eq:"sidecar"}, label: "Sidecar" },
        { value:4 ,filter: {eq:"tunnelInternal"}, label: "Tunnel Internal" },
        { value:5 ,filter: {eq:"tunnelExternal"}, label: "Tunnel External" },
      ],

      loading: true,
    };
  },

  computed: {
    ...mapState("setting", ["layout", "pageWidth"]),
    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  mounted() {
    this.search();
  },

  methods: {
    addpipy() {
      this.$router.push({
        path: "/ops-center/pipy/create",
      });
    },

    detail(index, type, item) {
      this.$router.push({
        path: "/ops-center/pipy/detail/" + item.id,
      });
    },

    forcepush(index, type, item) {
      this.$gql.mutation(`updatePipy(id: ${item.id})`).then(() => {
        this.$message.success(this.$t("Sync successfully"), 3);
      });
    },

    remove(index, type, item) {
      this.$gql
        .mutation(`deleteFleet(id:${item.id}){data{id}}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    search(pageNo) {
      if (pageNo) {
        this.pageNo = pageNo;
      } else {
        this.pageNo = 1;
      }
      this.loading = true;
      let filters = {
        name: { contains: this.key },
        type: this.viewtype[this.viewtypevalue].filter
      };
      this.$gql
        .query(`fleets(filters: $filters, pagination: {start: ${this.start}, limit: ${this.pageSize}}){
						data{id,attributes{name,type,content,apply,organizations{data{id,attributes{name}}},template{data{id,attributes{name}}}, status}},
						meta{pagination{total}}
					}`,
               { 
                 filters
               },{
                 filters: "FleetFiltersInput"
               })
        .then((res) => {
          this.list = [];
          this.total = res.pagination.total;
          this.loading = false;
          if (res.data) {
            res.data.forEach((item) => {
              if (item.template && item.template.id) {
                item.template = item.template.id;
              }
              if (item.type == "pipy4lb" && !item.content.healthcheck) {
                item.content.healthcheck = {
                  interval: "3s",
                  connectTimeout: "1s",
                  readTimeout: "1s",
                  host: "localhost",
                  port: 8888,
                  failures: 3,
                };
              }
              let _organizations = item.organizations;
              item.organizations = [];
              if(_organizations){
                _organizations.forEach((_org)=>{
                  item.organizations.push(_org.id)
                })
              }
              this.list.push(item);
            });
          }
        });
				
    },

    select(index, type, item) {
      this.$emit("selectPolicy", item);
    },

    getData() {},
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
	
  .card-avatar {
  }
  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: auto;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .a-divider-div {
    flex: 1;
    text-align: center;
    position: relative;
  }
  .a-divider {
    height: 240px;
    position: absolute;
    top: 0px;
    left: 0;
  }
</style>
