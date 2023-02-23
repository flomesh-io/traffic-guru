<template>
  <div>
    <a-card
      :bordered="false"
      :title="$t('Namespace')"
      :loading="loading"
    >
      <template #extra>
        <div>
          <a-input-search
            v-model:value="key"
            @search="search()"
            class="right-search-input"
            :placeholder="$t('search')"
          />
          <a-divider type="vertical" />

          <a-popconfirm
            :ok-text="$t('Add Bind')"
            @confirm="addBind"
          >
            <template #title>
              <p>{{ $t("Please select namespace") }}</p>
              <a-select
                class="width-220"
                mode="multiple"
                :show-search="false"
                v-model:value="addBindVal"
                ref="select"
              >
                <a-select-option
                  :value="namespace.id"
                  :key="index"
                  v-for="(namespace, index) in allNamespaces"
                >
                  {{ namespace.name }}
                </a-select-option>
              </a-select>
            </template>
            <a
              v-permission="['mesh:update']"
              href="#"
            ><PlusCircleTwoTone
              class="font-20 icon-menu-sm rotate-icon"
            /></a>
          </a-popconfirm>
        </div>
      </template>
      <a-list
        size="large"
        :pagination="{
          showQuickJumper: false,
          onChange: search,
          current: pageNo,
          pageSize: pageSize,
          showTotal: (total, range) => `${$t('Total')} ${total}`,
          total: total,
        }"
      >
        <a-list-item
          :key="i"
          v-for="(item, i) in list"
        >
          <a-list-item-meta :description="item.registry?.name">
            <template #avatar>
              <BorderOutlined class="font-24 font-primary" />
            </template>
            <template #title>
              <span class="breakall">{{
                item.name ? item.name : "Unnamed"
              }}</span>
            </template>
          </a-list-item-meta>
          <template #actions>
            <div>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a-popconfirm
                        placement="topLeft"
                        :ok-text="$t('Yes')"
                        :cancel-text="$t('No')"
                        @confirm="remove(item.id)"
                      >
                        <template #title>
                          <p>{{ $t("Tip") }}</p>
                          <p>{{ $t("Are you sure to delete this?") }}</p>
                        </template>
                        <a v-permission="['mesh:update']">{{ $t("Unbind") }}</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
                <a><MoreOutlined /></a>
              </a-dropdown>
            </div>
          </template>
          <div class="list-content">
            <div class="list-content-item">
              <span
                v-if="item.bindMesh"
              ><a-tag>Mesh:{{ item.bindMesh?.name }}</a-tag></span>
            </div>

            <div class="list-content-item">
              <span>{{ $t("updTime") }}</span>
              <p>{{ new Date(item.updatedAt).toLocaleString() }}</p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import { spread, merge } from "@/utils/request";
import {
  MoreOutlined,
  PlusCircleTwoTone,
  BorderOutlined,
} from "@ant-design/icons-vue";
export default {
  name: "NamespaceList",
  i18n: require("@/i18n"),
  components: {
    MoreOutlined,
    PlusCircleTwoTone,
    BorderOutlined,
  },

  props: ["bindMesh", "registry"],
  data() {
    return {
      key: "",
      pageSize: 10,
      pageNo: 1,
      total: 0,
      addBindVal: [],
      loading: true,
      list: [],
      allNamespaces: [],
    };
  },

  computed: {
    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  created() {
    this.loadAll();
    this.search();
  },

  methods: {
    addBind() {
      if (!this.addBindVal?.length) return;
      let _reqs = [];
      for (let namespace of this.addBindVal) {
        const _req = this.$gql.mutation(
          `updateNamespace(id:${namespace}, data:{bindMesh: ${this.bindMesh}}){data{id}}`,
        );
        _reqs.push(_req);
      }
      merge(_reqs).then(
        spread(() => {
          this.addBindVal = [];
          this.$message.success(this.$t("Bind successfully"), 3);
          this.$emit("change", {});
          this.search();
          this.loadAll();
        }),
      );
    },

    remove(id) {
      this.$gql
        .mutation(
          `updateNamespace(id:${id},data:{bindMesh:null}){data{id}}`,
        )
        .then(() => {
          this.$message.success(this.$t("Unbind successfully"), 3);
          this.$emit("change", {});
          this.search();
          this.loadAll();
        });
    },

    newLb() {
      this.$router.push({
        path: "/flb/4lb/create",
      });
    },

    detail(id) {
      this.$router.push({
        path: "/flb/4lb/detail/" + id,
      });
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
      const filters = {
        name: {contains:this.key},
        bindMesh: {id: {eq:this.bindMesh}},
        registry: {id: {eq:this.registry}},
      };
      this.$gql
        .query(
          `namespaces(filters: $filters, pagination: $pagination){
						data{id,attributes{
							name,
							registry{data{id,attributes{name}}},
							organization{data{id,attributes{name}}},
							updatedAt, 
							mesh{data{id,attributes{name}}}, 
							bindMesh{data{id,attributes{name}}}
						}},
						meta{pagination{total}}
					}`,
          { 
            filters,pagination
          },{
            filters: "NamespaceFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.list = res.data;
          this.total = res.pagination.total;
          this.loading = false;
        });
    },

    loadAll() {
      this.loading = true;
      const filters = { bindMesh: {id: {null:true}}, registry: {id: {eq:this.registry}} };
      this.$gql
        .query(
          `namespaces( filters: $filters, pagination: {start: 0, limit: ${this.$DFT_LIMIT}} ){
						data{id,attributes{
							name,
							registry{data{id,attributes{name}}},
							organization{data{id,attributes{name}}},
							updatedAt, 
							mesh{data{id,attributes{name}}}, 
							bindMesh{data{id,attributes{name}}}
						}},
						meta{pagination{total}}
					}`,
          { 
            filters
          },{
            filters: "NamespaceFiltersInput",
          }
        )
        .then((res) => {
          this.allNamespaces = res.data;
        });
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
