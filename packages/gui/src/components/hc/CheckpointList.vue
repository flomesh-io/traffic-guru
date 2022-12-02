<template>
  <div>
    <a-card
      :bordered="false"
      :title="modeName ? $t('Bind Dial Test') : $t('Dial Test')"
      :loading="loading"
    >
      <template #extra>
        <div>
          <a-input-search
            v-if="!modeName"
            v-model:value="key"
            @search="search()"
            class="right-search-input"
            :placeholder="$t('search')"
          />
          <a-divider
            type="vertical"
            v-if="!modeName"
          />
          <a-button
            v-if="!modeName"
            type="link"
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
          <a-popconfirm
            :ok-text="$t('Add Bind')"
            @confirm="addBind"
          >
            <template #title>
              <p>{{ $t("Please select dial test") }}</p>
              <a-select
                class="width-220"
                mode="multiple"
                v-model:value="addBindVal"
              >
                <a-select-option
                  :value="dialTesting"
                  v-for="(dialTesting, index) in dialTestings"
                  :key="index"
                >
                  {{ dialTesting.name }}
                </a-select-option>
              </a-select>
            </template>
            <a
              href="#"
              v-if="modeName"
            ><PlusCircleTwoTone
              class="PlusCircle"
            /></a>
          </a-popconfirm>
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
              <WifiOutlined class="list-item-avatar" />
            </template>
            <template #title>
              <a @click="detail(item.id)">{{
                item.name ? item.name : "Unnamed"
              }}</a>
            </template>
            <template #description>
              <span><a
                @click="hcdetail(item.healthcheck.id)"
              >{{ $t("Check configuration") }}-{{
                item.healthcheck.name
              }}</a></span>
            </template>
          </a-list-item-meta>
          <template #actions>
            <div>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a @click="viewLog(item.id)">{{
                        $t("log")
                      }}</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a
                        v-if="modeName"
                        @click="unbind(item)"
                      >{{
                        $t("Unbind")
                      }}</a>
                    </a-menu-item>
                    <a-menu-item
                      v-if="!modeName"
                    >
                      <a @click="detail(item.id)">{{
                        $t("edit")
                      }}</a>
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
              <span>{{ $t("Checkpoint Target") }}</span>
              <p>
                <a-tag
                  v-for="(target, index) in item.content.targets"
                  :key="index"
                >
                  {{ target.type }}:{{ target.name }}
                </a-tag>
              </p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>

    <a-drawer
      v-if="visible"
      :get-container="false"
      :title="$t('log')"
      placement="bottom"
      height="600"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <JsonEditor
        :is-readonly="true"
        :value="log"
      />
    </a-drawer>
  </div>
</template>

<script>
import JsonEditor from "@/components/editor/JsonEditor";
import {
  MoreOutlined,
  PlusCircleTwoTone,
  WifiOutlined,
} from "@ant-design/icons-vue";
export default {
  name: "CheckpointList",
  i18n: require("@/i18n"),
  components: {
    MoreOutlined,
    PlusCircleTwoTone,
    WifiOutlined,
    JsonEditor,
  },

  props: ["modeId", "modeName", "modeType"],
  data() {
    return {
      visible: false,
      key: "",
      log: "{}",
      pageSize: 10,
      pageNo: 1,
      total: 0,
      loading: true,
      list: [],
      dialTestings: [],
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
    viewLog() {
      this.visible = true;
    },

    remove(id) {
      this.$gql
        .mutation(
          `deleteDialTesting(input:{where:{id:${id}}}){dialTesting{id}}`,
        )
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    newLb() {
      this.$router.push({
        path: "/inspector/checkpoint/create",
      });
    },

    hcdetail(id) {
      this.$router.push({
        path: "/inspector/healthcheck/detail/" + id,
      });
    },

    detail(id) {
      this.$router.push({
        path: "/inspector/checkpoint/detail/" + id,
      });
    },

    search(pageNo, pageSize) {
      if (this.modeId) {
        this.$gql
          .query(
            `dialTestings(where: $where){id,name,content, services{id}}`,
            { where: {} },
          )
          .then((res) => {
            this.dialTestings = res.filter((item) => {
              const find = item.services.find(
                (item) => this.modeId == item.id,
              );
              return !find;
            });
          });
      }

      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      this.loading = true;

      const where = { name_contains: this.key };

      if (this.modeId) {
        where.services = this.modeId;
      }
      this.$gql
        .query(
          `dialTestingsConnection(where: $where, start: ${this.start}, limit: ${this.pageSize}){values{id,name,healthcheck{id,name},fleet{id,name},content,created_at},aggregate{totalCount}}`,
          { 
            where 
          },
        )
        .then((res) => {
          this.list = res.values;
          this.$emit("getDialTestings", res.values);
          this.total = res.aggregate.totalCount;
          this.loading = false;
        });
    },

    addBind() {
      if (!this.addBindVal?.length) return;
      if (!this.addBindVal[0].content) this.addBindVal[0].content = {};
      if (!this.addBindVal[0].content.targets)
        this.addBindVal[0].content.targets = [];
      this.addBindVal[0].content.targets.push({
        id: this.modeId,
        type: this.modeType,
        name: this.modeName,
      });
      let services = this.addBindVal[0].content.targets.filter((item) => {
        return item.type == this.modeType;
      });
      services = services.map((item) => {
        return Number(item.id);
      });
      for (let dialTesting of this.addBindVal) {
        this.$gql
          .mutation(
            `updateDialTesting(input: $input){dialTesting{id}}`,
            {
              input: {
                where: { id: dialTesting.id },
                data: {
                  content: dialTesting.content,
                  services: services,
                },
              },
            },
            {
              input: "updateDialTestingInput",
            },
          )
          .then(() => {
            this.addBindVal = [];
            this.$message.success(this.$t("Bind successfully"), 3);
            this.search();
          });
      }
    },

    unbind(dialTesting) {
      dialTesting.content.targets.some((item, i) => {
        if (item.id === this.modeId) {
          dialTesting.content.targets.splice(i, 1);
        }
      });
      let services = dialTesting.content.targets.filter((item) => {
        return item.type == "service";
      });
      services = services.map((item) => {
        return Number(item.id);
      });
      this.$gql
        .mutation(
          `updateDialTesting(input: $input){dialTesting{id}}`,
          {
            input: {
              where: { id: dialTesting.id },
              data: {
                content: dialTesting.content,
                services: services,
              },
            },
          },
          {
            input: "updateDialTestingInput",
          },
        )
        .then(() => {
          this.$message.success(this.$t("Unbind successfully"), 3);
          this.search();
        });
    },

    onClose() {
      this.visible = false;
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
  .list-item-avatar {
    font-size: 30px;
    color: #00adef;
    position: relative;
    top: 5px;
  }
  .list-content {
    width: 300px;
  }
</style>
