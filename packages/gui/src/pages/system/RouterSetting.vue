<template>
  <PageLayout :avatar="PartitionOutlined">
    <template #headerContent>
      <div />
    </template>
    <template #extra>
      <HeadInfo
        v-permission="['admin']"
        class="split-right"
        :title="$t('Initialization Menu')"
      >
        <template #body>
          <div>
            <SyncOutlined
              @click="add"
              class="font-primary icon-menu rotate-icon"
            />
          </div>
        </template>
      </HeadInfo>
      <HeadInfo
        v-permission="['admin']"
        class="split-right"
        :title="$t('Save')"
      >
        <template #body>
          <div>
            <SaveOutlined
              @click="edit"
              class="font-primary icon-menu"
            />
          </div>
        </template>
      </HeadInfo>
    </template>
    <a-row class="row-mg">
      <a-col
        class="col-pd"
        :xl="12"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <a-card
          :title="$t('Menu Tree')"
          :loading="loading"
        >
          <template #extra>
            {{ $t("Drag to change level") }}
          </template>
          <a-tree
            :show-line="true"
            class="full"
            :draggable="true"
            v-model:checkedKeys="checkedKeys"
            checkable
            @dragenter="onDragEnter"
            @drop="onDrop"
            :default-expand-all="false"
            :tree-data="menuTree"
          >
            <template
              #title="item"
              @click.stop="() => {}"
            >
              <div class="min-width-200">
                <b class="font-16">
                  <span v-if="!item.displayName">{{ $t(item.name) }}</span>
                  <a-typography-paragraph
                    class="inline-block"
                    v-model:content="item.displayName"
                    :editable="{
                      onChange: displayNameChange(item, item.displayName),
                    }"
                  />
                </b>
              </div>
              <div class="min-width-200">
                {{ $t("Full Path") }} : {{ item.fullPath }}
                <span v-if="item.authority">
                  | {{ $t("Authority") }}:
                  <a-typography-paragraph
                    class="inline-block"
                    v-model:content="item.authority"
                    editable
                  /></span>
              </div>
            </template>
          </a-tree>
        </a-card>
      </a-col>
      <a-col
        class="col-pd"
        :xl="12"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <a-card
          class="nopd"
          :title="$t('Other Settings')"
          :loading="loading"
        >
          <a-descriptions
            bordered
            style="min-height: 650px"
          >
            <a-descriptions-item
              :label="$t('Zone')"
              :span="3"
            >
              <a-switch v-model:checked="routerSettingMenu.showZone">
                <template #checkedChildren>
                  <EyeOutlined />
                </template>
                <template #unCheckedChildren>
                  <EyeInvisibleOutlined />
                </template>
              </a-switch>
            </a-descriptions-item>
            <a-descriptions-item
              :label="$t('ENV')"
              :span="3"
            >
              <a-switch v-model:checked="routerSettingMenu.showEnv">
                <template #checkedChildren>
                  <EyeOutlined />
                </template>
                <template #unCheckedChildren>
                  <EyeInvisibleOutlined />
                </template>
              </a-switch>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>
    <PartitionOutlined v-if="false" />
  </PageLayout>
</template>

<script>
import {
  SyncOutlined,
  PartitionOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import { mapGetters } from "vuex";
import { Empty } from "ant-design-vue";
export default {
  name: "RouterSetting",
  components: {
    HeadInfo,
    PageLayout,
    SyncOutlined,
    PartitionOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    SaveOutlined,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      users: [],
      menus: [],
      checkedKeys: [],
      menuTree: [],
      PartitionOutlined,
      isEdit: false,
      selectProjects: [],
      selectUsers: [],
      roles: [],
      expandedKeys: [],
      visible: false,
      payload: {
        id: "",
        name: "",
        parent: null,
        description: "",
      },

      hasRouterSettingMenu: false,
      routerSettingMenu: { showEnv: true, showZone: true },
      bindTarget: {},
      workload: [],
      projects: [],
      loading: true,
      activities: [],
      config: {},
      teams: [],
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },

  computed: {
    ...mapGetters("account", ["user"]),
  },

  mounted() {
    this.loaddata();
  },

  methods: {
    onDragEnter() {},
    displayNameChange(item, displayName) {
      this.menuTree.forEach((node1) => {
        if (node1.fullPath == item.fullPath) {
          node1.displayName = displayName;
        }
        if (node1.children) {
          node1.children.forEach((node2) => {
            if (node2.fullPath == item.fullPath) {
              node2.displayName = displayName;
            }
          });
        }
      });
    },

    onDrop(info) {
      const dropKey = info.node.key;
      // const dropId = info.node.id;
      const dragKey = info.dragNode.key;
      // const dragId = info.dragNode.id;
      const dropPos = info.node.pos.split("-");
      const dropPosition =
        info.dropPosition - dropPos[dropPos.length - 1] * 1;
      const loop = (data, key, callback) => {
        data.forEach((item, index) => {
          if (item.key === key) {
            return callback(item, index, data);
          }
          if (item.children) {
            return loop(item.children, key, callback);
          }
        });
      };
      const data = [...this.menuTree];

      // Find dragObject
      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item) => {
          item.children = item.children || [];
          item.children.unshift(dragObj);
        });
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item) => {
          item.children = item.children || [];
          item.children.unshift(dragObj);
        });
      } else {
        let ar = [];
        let i = 0;
        loop(data, dropKey, (_item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      // let parentId = null;
      // if (!info.dropToGap) {
      //   parentId = dropId;
      // }
      // this.menuTree = data;
    },

    add() {
      this.isEdit = false;
      this.handleOk();
    },

    edit() {
      this.isEdit = true;
      this.handleOk();
    },

    handleOk() {
      this.loading = true;
      let input = [];
      if (this.isEdit) {
        input = this.resetRouterOptions(this.menuTree);
      } else {
        let _append = process.env.VUE_APP_VERSION == "pro" ? ".pro" : "";
        const options = require(`@/router/config${_append}`).default;
        options.initRoutes.forEach((route) => {
          if (route.path == "/") {
            input = this.buildRouterOptions(route.children, "", 1);
          }
        });
      }
      this.$gql
        .mutation(
          `batchCreateRouterSetting(data: $data)`,
          { data: input },
          { data: "JSON" },
        )
        .then(() => {
          this.visible = false;
          this.menuTree = [];
          if (this.isEdit) {
            this.$message.success(this.$t("Save successfully"), 3);
          } else {
            this.$message.success(this.$t("Created successfully"), 3);
          }
          this.loaddata();
        });
      this.saveRouterSettingMenu();
    },

    saveRouterSettingMenu() {
      let content = JSON.parse(JSON.stringify(this.routerSettingMenu));
      if (this.hasRouterSettingMenu) {
        delete content.id;
        this.$gql
          .mutation(
            `updateSystemSetting(id:${this.routerSettingMenu.id}, data: $data){data{id}}`,
            {
              data: { type: "RouterSetting", content },
            },
            { data: "SystemSettingInput!" },
          )
          .then(() => {});
      } else {
        this.$gql
          .mutation(
            `createSystemSetting(data: $data){data{id}}`,
            {
              data: { type: "RouterSetting", content },
            },
            { data: "SystemSettingInput!" },
          )
          .then(() => {});
      }
    },

    setTreeKey(tree) {
      if(!tree){
        return [];
      }
      tree.forEach((item) => {
        item.key = `${item.level}-${item.id}`;
        item.enabled = !item.disabled;
        item.displayName = item.displayName ? item.displayName : "";
        delete item.disabled;
        if (item.children && item.enabled) {
          item.children.forEach((child) => {
            if (child.disabled) {
              item.enabled = false;
            }
          });
        }
        if (item.enabled) {
          this.checkedKeys.push(item.key);
        }
        if (item.children) {
          item.children = this.setTreeKey(item.children);
        }
      });
      return tree;
    },

    loaddata() {
      this.menuTree = [];
      this.checkedKeys = [];
      this.loading = true;
      this.$gql
        .query(
          `routerSettings(sort: "sort:asc", pagination: {limit: 9999 }, filters: { level: { eq: 1 } }){data{id,attributes{
						name,
						displayName,
						path,
						fullPath,
						disabled,
						authority,
						invisible,
						sort,
						level,
						parent{data{id,attributes{name,displayName,path,fullPath,disabled,authority,invisible,sort,level}}},
						children{data{id,attributes{name,displayName,path,fullPath,disabled,authority,invisible,sort,level}}}
					}}}`,
        )
        .then((res) => {
          this.menuTree = this.setTreeKey(JSON.parse(JSON.stringify(res.data)));
          this.loading = false;
          res = [];
        });

      this.$gql
        .query(
          `systemSettings(filters:{type:{eq:"RouterSetting"}}){data{id,attributes{mode,content}}}`,
        )
        .then((d) => {
          let res = d.data;
          this.hasRouterSettingMenu = res && res.length > 0;
          if (this.hasRouterSettingMenu) {
            this.routerSettingMenu = { ...res[0].content, id: res[0].id };
          } else {
            this.routerSettingMenu = { showEnv: true, showZone: true };
          }
        });
    },

    resetRouterOptions(routes) {
      let ary = [];
      let _checkedKeys = this.checkedKeys;
      if (routes) {
        routes.forEach((route, index) => {
          let disabled =
            route.path == "router-setting"
              ? false
              : !_checkedKeys.find((a) => a == route.key);
          if (route.children && disabled) {
            route.children.forEach((child) => {
              if (child.enabled) {
                disabled = false;
              }
            });
          }
          ary.push({
            name: route.name,
            displayName: route.displayName,
            path: route.path,
            sort: index,
            authority: route.authority || "*",
            fullPath: route.fullPath,
            invisible: !!route.invisible,
            disabled: disabled,
            level: route.level,
            children: this.resetRouterOptions(route.children),
          });
        });
      }
      return ary;
    },

    buildRouterOptions(routes, parentPath, level) {
      let ary = [];
      const enableFlbs = [
        "/flb/dashboard",
        "/flb/4lb/list",
        "/flb/4lb/detail/:id",
        "/flb/4lb/create",
        "/flb/address/detail/:id",
        "/flb/address/create",
        "/flb/address/list",
      ];
      if (routes) {
        routes.forEach((route, index) => {
          let meta = route.meta ? route.meta : {};
          let fullPath = `${parentPath}/${route.path}`;
          let disabled = !!meta.disabled;

          if (parentPath == "/flb" && enableFlbs.indexOf(fullPath) == -1) {
            disabled = true;
          }
          ary.push({
            name: route.name,
            displayName: "",
            path: route.path,
            sort: index,
            authority:
              meta.authority && meta.authority.permission
                ? meta.authority.permission
                : typeof meta.authority == "string"
                  ? meta.authority
                  : "",
            fullPath,
            invisible: !!meta.invisible,
            disabled: disabled,
            level,
            children: this.buildRouterOptions(
              route.children,
              fullPath,
              level + 1,
            ),
          });
        });
      }
      return ary;
    },
  },
};
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }

  .new-btn {
    border-radius: 2px;
    width: 100%;
    height: 187px;
  }

  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  :deep(.ant-divider-dashed::before),
  :deep(.ant-divider-dashed::after) {
    border-color: #ccc !important;
  }
  .userline {
    position: relative;
    border: 1px dashed #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 5px 10px;
    cursor: move;
  }
  .userline .title {
    padding-left: 15px;
    font-size: 16px;
    line-height: 40px;
  }
  .userline .rightIcon {
    cursor: pointer;
    position: absolute;
    right: 20px;
    color: #ddd;
    display: none;
    top: 18px;
    font-size: 18px;
  }
  .userline:hover {
    border: 1px dashed #00adef;
  }
  .userline:hover .rightIcon {
    display: block;
  }
  .userline .usericon {
    position: relative;
    top: -2px;
    width: 40px;
    vertical-align: middle;
    height: 40px;
    border: 2px solid #fff;
    border-radius: 50%;
    line-height: 40px;
    font-size: 26px;
    background-color: #e6fcff;
    text-align: center;
  }
  .dragable-ghost {
    border: 1px dashed red;
    opacity: 1;
  }
  .dragable-chose {
    border: 1px dashed red;
    opacity: 0.8;
  }
  .dragable-drag {
    border: 1px dashed red;
    opacity: 1;
  }
</style>
