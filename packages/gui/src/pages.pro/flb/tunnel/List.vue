<template>
  <div>
    <a-card
      :bordered="false"
      class="nopd"
      :title="$t('Tunnel') + $t('list')"
      :loading="loading"
    >
      <template #extra>
        <div>
          <a-button
            type="link"
            shape="circle"
            @click="newLb"
            v-permission="['l4-lb:create']"
          >
            <template
              #icon
            >
              <PlusCircleTwoTone
                class="font-20 icon-menu-sm rotate-icon"
              />
            </template>
          </a-button>
        </div>
      </template>
      <a-table
        @change="handleTableChange"
        class="bg-white"
        :columns="dataColumns"
        :data-source="list" 
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: false,
          onShowSizeChange: search,
          onChange: search,
          current: pageNo,
          pageSize: pageSize,
          showTotal: (total, range) => `${$t('Total')} ${total}`,
          total: total,
        }"
      >
        <template
          #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        >
          <div style="padding: 8px">
            <a-input
              ref="searchInput"
              :placeholder="$t('search')"
              v-model:value="filter[column.dataIndex]"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
            />
            <a-button
              type="primary"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
            >
              <template #icon>
                <SearchOutlined />
              </template>
              {{ $t('search') }}
            </a-button>
            <a-button
              size="small"
              style="width: 90px"
              @click="handleReset(clearFilters, column.dataIndex)"
            >
              {{ $t('Reset') }}
            </a-button>
          </div>
        </template>
        <template #customFilterIcon="{ filtered,column }">
          <FilterOutlined
            :style="{ color: filtered ? '#108ee9' : undefined }"
            v-if="column.dataIndex =='organization'"
          />
          <SearchOutlined
            :style="{ color: filtered ? '#108ee9' : undefined }"
            v-else
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <a-avatar
              size="small"
              shape="square"
              :src="require('@/assets/img/lb.png')"
            />
            <a
              class="ml-10"
              @click="detail(record.id)"
            >{{
              record.name ? record.name : "Unnamed"
            }}</a>
          </template>
          <template v-else-if="column.dataIndex === 'addressPool'">
            <a-tag>
              {{ record.addressPool.name }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'organization'">
            <a-tag v-if="record.organization">
              {{ record.organization.name }}
            </a-tag>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.dataIndex === 'healthCheckStatus'">
            <div
              v-if="
                record.healthCheckStatus &&
                  Object.keys(record.healthCheckStatus).length > 0
              "
            >
              <p
                :key="i"
                v-for="(item, i) in Object.keys(record.healthCheckStatus)"
              >
                <a-badge
                  status="processing"
                  color="red"
                  v-if="record.healthCheckStatus[item] == 0"
                />
                <a-badge
                  status="processing"
                  v-else
                />
                {{ item }}
              </p>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'address'">
            <span>{{
              record.address ? record.address.ip : "(IP " + $t("unset") + ")"
            }}<span
              v-if="record.content.port != 0"
            >:{{ record.content.port }}</span></span>
          </template>
          <template v-else-if="column.dataIndex === 'updatedAt'">
            {{ new Date(record.updatedAt).toLocaleString() }}
          </template>
          <template v-else-if="column.key === 'Action'">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a
                      v-permission="['l4-lb:update']"
                      @click="detail(record.id)"
                    >{{
                      $t("edit")
                    }}</a>
                  </a-menu-item>
                  <a-menu-item
                    v-if="record.source != 'FLB'"
                  >
                    <a-popconfirm
                      placement="topLeft"
                      :ok-text="$t('Yes')"
                      :cancel-text="$t('No')"
                      @confirm="remove(record.id)"
                    >
                      <template #title>
                        <p>{{ $t("Tip") }}</p>
                        <p>{{ $t("Are you sure to delete this?") }}</p>
                      </template>
                      <a v-permission="['l4-lb:delete']">{{ $t("delete") }}</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </template>
              <a><MoreOutlined /></a>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { MoreOutlined, PlusCircleTwoTone, SearchOutlined,FilterOutlined } from "@ant-design/icons-vue";


const columns = [
  {
    dataIndex: 'name',
    key: 'as',
    customFilterDropdown: true,
  },
  {
    dataIndex: 'globalId',
    key: 'Global Id',
    customFilterDropdown: true,
  },
  {
    dataIndex: 'organization',
    key: 'Organization',
    filters: [],
  },
  {
    dataIndex: 'addressPool',
    key: 'addressPool',
  },
  {
    dataIndex: 'healthCheckStatus',
    key: 'Target Status',
  },
  {
    dataIndex: 'address',
    key: 'Endpoint',
    customFilterDropdown: true,
  },
  {
    dataIndex: 'updatedAt',
    sorter: true,
    key: 'updTime',
  },
  {
    key: 'Action',
  },
];

export default {
  name: "List",
  i18n: require("@/i18n"),
  components: {
    MoreOutlined,
    PlusCircleTwoTone,
    SearchOutlined,
    FilterOutlined,
  },

  data() {
    return {
      columns,
      filter:{
        name:"",
        globalId:"",
        filters:{},
      },

      sorter: "updatedAt",
      sortOrder: "end$desc",
      orgs:[],
      pageSize: 10,
      pageNo: 1,
      total: 0,
      searchedColumn: '',
      loading: true,
      list: [],
    };
  },

  computed: {
    dataColumns() {
      return this.columns
        .map((column) => {
          column.title = this.$t(column.key);
          if(column.dataIndex == "organization"){
            column.filters = this.orgs;
          }
          if (column.sorter && this.sorter == column.dataIndex) {
            column.sortOrder = this.sortOrder;
          }
          return column;
        });
    },

    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  created() {
    this.search();
    this.$gql.query(`myOrganizations{data{id,attributes{name}}}`).then((res) => {
      this.orgs = [];
      res.data.forEach((org)=>{
        this.orgs.push({value:org.id,text:org.name});
      })
    });
  },

  methods: {
    handleTableChange(pag, filters, sorter){
      (this.sorter = sorter.field),
      (this.sortOrder = sorter.order),
      this.filter.filters = filters;
      this.search();
    },

    handleSearch(selectedKeys, confirm, dataIndex){
      confirm();
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters,dataIndex){
      clearFilters({ confirm: true });
      this.filter[dataIndex] = "";
      this.search();
    },

    remove(id) {
      this.$gql
        .mutation(`deleteTunnel(id:${id}){data{id,attributes{name, organization{data{id}}}}}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    newLb() {
      this.$router.push({
        path: "/flb/tunnel/create",
      });
    },

    detail(id) {
      this.$router.push({
        path: "/flb/tunnel/detail/" + id,
      });
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      this.loading = true;
      setTimeout(()=>{
        let filters = {
          name: { contains: this.filter.name }
        };
        if(this.filter.globalId){
          filters.globalId = { contains: this.filter.globalId };
        }
        if(this.filter.address){
          filters.endpoint = { contains: this.filter.address };
        }
        if(this.filter.filters){
          if(this.filter.filters.Organization){
            filters.organization = {id:{in:this.filter.filters.Organization}}
          }
        }
        console.log(this.filter)
        let order = "updatedAt:desc";
        if (this.sorter && this.sortOrder) {
          order = this.sortOrder.replace(/\$/g, "");
          order = order.replace(/end/g, "");
          order = `${this.sorter}:${order}`;
        }
        this.$gql
          .query(
            `myTunnels(filters: $filters, pagination:{start: ${this.start}, limit: ${this.pageSize}}, sort: "${order}"){
							data{id,attributes{
								name,
								source,
								globalId,
								organization{data{id,attributes{name}}},
								addressPool{data{id,attributes{name}}},
								content,
								updatedAt, 
								address{data{id,attributes{ip}}}, 
								healthCheckStatus
							}},
							meta{pagination{total}}
						}`,
            { 
              filters
            },{
              filters: "TunnelFiltersInput",
            }
          )
          .then((res) => {
            this.list = res.data;
            this.total = res.pagination.total;
            this.loading = false;
          });
      })
    },
  },
};
</script>

<style lang="less" scoped>
  .list-content-item {
    color: @text-color-second;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;

    span {
      line-height: 20px;
    }

    p {
      margin: 4px 0 0;
      line-height: 22px;
    }
  }
</style>
