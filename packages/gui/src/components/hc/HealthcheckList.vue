<template>
  <div>
    <a-card
      :loading="loading"
      :bordered="false"
      :title="modeName ? $t('Bind Healthcheck') : $t('Healthcheck List')"
    >
      <template #extra>
        <div>
          <a-input-search
            v-if="!modeName"
            v-model:value="key"
            @input="search()"
            class="right-search-input"
            :placeholder="$t('search')"
          />
          <a-divider
            type="vertical"
            v-if="!modeName"
          />
          <a-button
            type="link"
            v-if="!modeName"
            shape="circle"
            @click="newLb"
          >
            <template
              #icon
            >
              <PlusCircleTwoTone
                class="PlusCircle icon-menu-sm rotate-icon"
              />
            </template>
          </a-button>
        </div>
      </template>
      <a-list
        size="large"
        :pagination="
          modeName
            ? false
            : {
              showSizeChanger: true,
              showQuickJumper: false,
              onShowSizeChange: search,
              onChange: search,
              current: pageNo,
              pageSize: pageSize,
              showTotal: (total, range) => `${$t('Total')} ${total}`,
              total: total,
            }
        "
      >
        <a-list-item
          :key="i"
          v-for="(item, i) in list"
        >
          <a-list-item-meta>
            <template #avatar>
              <MedicineBoxOutlined class="list-item-avatar" />
            </template>
            <template #title>
              <a @click="detail(item.id)">{{
                item.name ? item.name : $t("unnamed")
              }}</a>
            </template>
            <template #description>
              {{
                item.type == "0"
                  ? $t("Passive Healthcheck")
                  : $t("Active Healthcheck")
              }}
              <span v-if="modeName"> - {{ item.dialTestingName }}</span>
            </template>
          </a-list-item-meta>
          <template #actions>
            <div v-if="!modeName">
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
                        <a v-if="!modeName">{{ $t("delete") }}</a>
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
              <span>{{ $t("Status") }}：</span>
              <p>
                <a-tag
                  class="mb-5"
                  v-for="(n, index) in item.content.success"
                  :key="index"
                  color="#88d4a1"
                >
                  {{ n }}
                </a-tag>
                <a-tag
                  class="mb-5"
                  v-for="(n, index) in item.content.failure"
                  :key="index"
                  color="#fb9690"
                >
                  {{ n }}
                </a-tag>
              </p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import {
  MoreOutlined,
  PlusCircleTwoTone,
  MedicineBoxOutlined,
} from "@ant-design/icons-vue";
export default {
  name: "List",
  i18n: require("@/i18n"),
  components: {
    MoreOutlined,
    PlusCircleTwoTone,
    MedicineBoxOutlined,
  },

  props: ["modeName", "modeId", "modeType", "dialTestings"],

  data() {
    return {
      addBindVal: [],
      key: "",
      pageSize: 10,
      pageNo: 1,
      total: 0,
      loading: true,
      list: [],
    };
  },

  computed: {
    searchFilter() {
      if (this.key != "") {
        return this.list.filter((node) => {
          return (
            node.name.indexOf(this.key) > -1 || node.ip.indexOf(this.key) > -1
          );
        });
      } else {
        return this.list;
      }
    },

    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  created() {
    this.search();
  },

  methods: {
    newLb() {
      this.$router.push({
        path: "/inspector/healthcheck/create",
      });
    },

    detail(id) {
      this.$router.push({
        path: "/inspector/healthcheck/detail/" + id,
      });
    },

    remove(id) {
      this.$gql
        .mutation(
          `deleteHealthcheck(input:{where:{id:${id}}}){healthcheck{id}}`,
        )
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      this.loading = true;
      this.list = [];
      const where = { name_contains: this.key };

      if (this.modeId) {
        where.dialTestings = [];
        this.dialTestings.forEach((dialTesting) => {
          where.dialTestings.push(dialTesting.id);
        });
      }

      this.$gql
        .query(
          `healthchecksConnection(where: $where, start: ${this.start}, limit: ${this.pageSize}){values{id,name,content,created_at, dialTestings{name,content}},aggregate{totalCount}}`,
          { 
            where 
          },
        )
        .then((res) => {
          for (let value of res.values) {
            value.dialTestingName = "";
            value.dialTestings.some((item) => {
              for (let i2 = 0; i2 < item.content.targets.length; i2++) {
                let dialTesting = item.content.targets[i2];
                if (
                  dialTesting.type == this.modeType &&
                  dialTesting.id == this.modeId
                ) {
                  value.dialTestingName += item.name + " ";
                  break;
                }
              }
            });
          }
          this.list = res.values;
          this.list.forEach((item) => {
            if (item.content && item.content.length > 1) {
              //item.protocol = item.content[0].data[0][0].value;

              item.status = item.content[0].data[0][0].value.concat(
                item.content[1].data[0][0].value,
              );
            }
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
    vertical-align: top;
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
  .list-item-avatar {
    font-size: 30px;
    color: #00adef;
    position: relative;
    top: 5px;
  }
  .list-content {
    width: 200px;
  }
</style>
