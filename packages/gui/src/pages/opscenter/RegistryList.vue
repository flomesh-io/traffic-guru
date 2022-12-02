<template>
  <div>
    <a-card
      :bordered="false"
      :title="$t('Registry')"
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
          <a-divider
            v-permission="['registry:create']"
            type="vertical"
          />
          <a-button
            v-permission="['registry:create']"
            type="link"
            shape="circle"
            @click="newLb"
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
      <a-list
        size="large"
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
        <a-list-item
          :key="i"
          v-for="(item, i) in list"
        >
          <a-list-item-meta>
            <template #avatar>
              <SyncOutlined
                v-if="item.sync"
                class="font-30 gray"
                spin
              />
              <a-avatar
                v-else
                class="avatar-img font-30 primary schedule"
                size="small"
                shape="square"
                :src="RegistrySvg"
              />
            </template>
            <template #title>
              <a @click="detail(item.id)">{{
                item.name ? item.name : "Unnamed"
              }}</a>
            </template>
            <template #description>
              {{ $t("Type") }}：{{ item.type }}
            </template>
          </a-list-item-meta>
          <template #actions>
            <div>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a
                        @click="tosync(item)"
                        v-permission="['registry:update']"
                      >{{ $t("Sync") }}</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a
                        @click="detail(item.id)"
                        v-permission="['registry:update']"
                      >{{ $t("edit") }}</a>
                    </a-menu-item>
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
                        <a v-permission="['registry:delete']">{{
                          $t("delete")
                        }}</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
                <a><MoreOutlined /></a>
              </a-dropdown>
            </div>
          </template>
          <div class="list-content">
            <div
              class="list-content-item"
              v-if="item.address"
            >
              <span>{{ $t("Location") }}</span>
              <p>
                <a-tag v-if="item.address">
                  {{ item.address }}
                </a-tag>
                <span v-else>-</span>
              </p>
            </div>
            <div
              class="list-content-item"
              v-if="item.namespaces && item.namespaces.length > 0"
            >
              <span>{{ $t("Service") }}</span>
              <p>
                <a-badge :count="item.services?.length" />
                <a-popover
                  :title="$t('Services')"
                  trigger="click"
                >
                  <template #content>
                    <Json2YamlCard
                      class="card nopd width-500"
                      :is-readonly="false"
                      :is-create="false"
                      v-model:jsonVal="item.namespacesString"
                    />
                  </template>
                  <a-button
                    type="link"
                    @click="loadService(item)"
                  >
                    <EyeOutlined
                      class="eye relative"
                      style="top: 4px"
                    />
                  </a-button>
                </a-popover>
              </p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import Json2YamlCard from "@/components/card/Json2YamlCard";
import {
  MoreOutlined,
  PlusCircleTwoTone,
  SyncOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import RegistrySvg from "@/assets/img/registry.svg";
export default {
  name: "RegistryList",
  i18n: require("@/i18n"),
  components: {
    MoreOutlined,
    PlusCircleTwoTone,
    SyncOutlined,
    EyeOutlined,
    Json2YamlCard,
  },

  data() {
    return {
      service: `{
	  }`,

      RegistrySvg,
      key: "",
      pageSize: 10,
      pageNo: 1,
      total: 0,
      loading: true,
      list: [],
    };
  },

  computed: {
    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  created() {
    this.search();
  },

  methods: {
    loadService(item) {
      this.service = item.services;
    },

    newLb() {
      this.$router.push({
        path: "/ops-center/registry/create",
      });
    },

    detail(id) {
      this.$router.push({
        path: "/ops-center/registry/detail/" + id,
      });
    },

    remove(id) {
      this.$gql
        .mutation(`deleteRegistry(input:{where:{id:${id}}}){registry{id}}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    tosync(item) {
      item.sync = true;
      this.$gql
        .mutation(
          `refreshRegistry(input:{where:{id:${item.id}}}){registry{id}}`,
        )
        .then(() => {
          this.$message.success(this.$t("Sync successfully"), 3);
          item.sync = false;
          this.search();
        });
    },

    toimport() {},
    search(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      this.loading = true;
      const where = { name_contains: this.key };
      this.$gql
        .query(
          `registriesConnection(where: $where, start: ${this.start}, limit: ${this.pageSize}){values{id,name,type,address,services{id,name},namespaces{id,name,services{id,uid,fleet{id,name},organization{id,name},namespace,name,registry{id,name},content,created_at}}},aggregate{totalCount}}`,
          { where },
        )
        .then((res) => {
          this.list = res.values;
          this.list.forEach((item) => {
            item.namespacesString = item.namespaces
              ? JSON.stringify(item.namespaces)
              : "{}";
          });
          this.total = res.aggregate.totalCount;
          this.loading = false;
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
  .schedule {
    font-size: 30px;
    color: #00adef;
    position: relative;
    top: 5px;
  }
  .eye {
    font-size: 20px;
    position: relative;
    left: 2px;
  }
</style>
