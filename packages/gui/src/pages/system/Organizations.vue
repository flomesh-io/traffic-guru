<template>
  <PageLayout :avatar="PartitionOutlined">
    <template #headerContent>
      <div />
    </template>
    <template #extra>
      <HeadInfo
        v-permission="['organization:create']"
        class="split-right"
        :title="$t('Create organization')"
      >
        <template #body>
          <div>
            <PlusCircleTwoTone
              @click="add"
              class="font-primary icon-menu rotate-icon"
            />
          </div>
        </template>
      </HeadInfo>
    </template>
    <a-card
      :title="$t('Organization Tree')"
      :loading="loading"
    >
      <template #extra>
        {{ $t("Drag to change level") }}
      </template>
      <a-tree
        v-if="orgTree"
        block-node
        class="full"
        draggable
        @dragenter="onDragEnter"
        @drop="onDrop"
        :default-expand-all="true"
        :tree-data="orgTree"
      >
        <template #title="item">
          <div
            class="min-width-200"
            @click="manage(null, null, item)"
          >
            <div class="flex">
              <div class="flex-item">
                <div>
                  <PartitionOutlined class="mr-10 primary" />
                  <b class="font-16">{{ item.name }}</b>
                  <a-divider type="vertical" />
                  <a-dropdown placements="topLeft">
                    <template #overlay>
                      <a-menu>
                        <a-menu-item key="setting">
                          <a
                            @click="setting(null, null, item)"
                            v-permission="['organization:update']"
                          ><EditOutlined /> {{ $t("edit") }}</a>
                        </a-menu-item>
                        <a-menu-item key="manage">
                          <a
                            @click="manage(null, null, item)"
                            v-permission="['organization:update']"
                          ><SettingOutlined /> {{ $t("Administration") }}</a>
                        </a-menu-item>
                        <a-menu-item>
                          <a-popconfirm
                            placement="topLeft"
                            :ok-text="$t('Yes')"
                            :cancel-text="$t('No')"
                            @confirm="removeOrg(null, null, item)"
                          >
                            <template #title>
                              <p>{{ $t("Tip") }}</p>
                              <p>{{ $t("Are you sure to remove this?") }}</p>
                            </template>
                            <a
                              v-permission="['organization:delete']"
                            ><CloseOutlined /> {{ $t("Remove") }}</a>
                          </a-popconfirm>
                        </a-menu-item>
                      </a-menu>
                    </template>
                    <a><MoreOutlined
                      class="icon-menu relative"
                      style="top: 2px"
                    /></a>
                  </a-dropdown>
                </div>
                <div>
                  {{ $t("Project") }} : {{ item.projects?.length }}
                  <a-divider type="vertical" />
                  {{ $t("User") }} : {{ item.users?.length }}
                  <a-divider type="vertical" />
                  {{ $t("Service") }} : {{ item.services?.length }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </a-tree>
      <a-result
        v-else
        :title="$t('No data')"
      >
        <template #icon>
          <img
            src="../../assets/img/empty.svg"
            style="width: 300px"
          >
        </template>
      </a-result>
    </a-card>

    <a-modal
      v-model:visible="visible"
      :title="$t('Organization')"
      @ok="valid"
      width="50%"
      :ok-text="isEdit ? $t('Save') : $t('create')"
    >
      <a-form
        :model="payload"
        :wrapper-col="{ span: 24 }"
        ref="form"
      >
        <a-descriptions bordered>
          <a-descriptions-item
            :label="$t('as')"
            :span="3"
          >
            <FormItem
              name="name"
              :rules="rules.uniqueName('organizations',{id:payload.id})"
            >
              <a-input
                :placeholder="$t('unset')"
                v-model:value="payload.name"
              >
                <template #prefix>
                  <PartitionOutlined type="user" />
                </template>
              </a-input>
            </FormItem>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Description')"
            :span="3"
          >
            <a-textarea
              v-model:value="payload.description"
              :placeholder="$t('unset')"
              allow-clear
              :rows="4"
            />
          </a-descriptions-item>
          <a-descriptions-item :label="$t('Parent Organization')">
            <a-select
              :placeholder="$t('unset')"
              v-model:value="payload.parent"
              class="width-180"
              ref="select"
            >
              <a-select-option
                :disabled="
                  payload.id == org.id ||
                    (payload.children &&
                      payload.children.find((item) => item.id == org.id))
                "
                :value="org.id"
                :key="index"
                v-for="(org, index) in orgs"
              >
                {{ org.name }}
              </a-select-option>
            </a-select>
          </a-descriptions-item>
        </a-descriptions>
      </a-form>
    </a-modal>
  </PageLayout>
</template>

<script>
import {
  PlusCircleTwoTone,
  PartitionOutlined,
  SettingOutlined,
  MoreOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import _ from "lodash";
import { mapGetters } from "vuex";
import { Empty } from "ant-design-vue";
import FormItem from "@/components/tool/FormItem";
import { mapState } from "vuex";
export default {
  name: "Organizations",
  components: {
    HeadInfo,
    PageLayout,
    PlusCircleTwoTone,
    PartitionOutlined,
    SettingOutlined,
    MoreOutlined,
    CloseOutlined,
    EditOutlined,
    FormItem,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      users: [],
      orgs: [],
      orgTree: [],
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

      bindTarget: {},
      editorIsCreate: true,
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
    ...mapState("rules", ["rules"]),
    ...mapGetters("account", ["user"]),
  },

  mounted() {
    this.loaddata();
    this.$gql.query(`projects{data{id,attributes{name,organization{data{id,attributes{name}}}}}}`).then((res) => {
      this.projects = res.data;
    });
    this.$gql.query(`usersPermissionsUsers{data{id,attributes{username,phone,email,type}}}`).then((res) => {
      this.users = res.data;
    });
  },

  methods: {
    onDragEnter(info) {
      console.log(info);
    },

    onDrop(info) {
      console.log(info);
      const dropKey = info.node.key;
      const dropId = info.node.id;
      const dragKey = info.dragNode.key;
      const dragId = info.dragNode.id;
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
      const data = [...this.orgTree];

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
      let parentId = null;
      if (!info.dropToGap) {
        parentId = dropId;
      }
      this.$gql
        .mutation(
          `updateOrganization(id:${dragId},data:{parent: ${parentId}}){data{id}}`,
        )
        .then(() => {});
      this.orgTree = data;
    },

    onContextMenuClick(item, menuKey) {
      console.log(`id,: ${item.id}, menuKey: ${menuKey}`);
      if (menuKey == "setting") {
        this.setting(null, null, item);
      } else if (menuKey == "manage") {
        this.manage(null, null, item);
      } else if (menuKey == "removeOrg") {
        // this.removeOrg(null, null, item);
      }
    },

    add() {
      this.isEdit = false;
      this.payload = {
        id: "",
        name: "",
        parent: null,
        description: "",
      };
      this.showModal();
    },

    showModal() {
      this.visible = true;
    },

    valid() {
      this.$refs.form
        .validateFields()
        .then(() => {
          this.handleOk();
        })
        .catch(() => {});
    },

    handleOk() {
      let savedata = _.cloneDeep(this.payload);
      const _p = {
        name: savedata.name,
        description: savedata.description,
        parent: savedata.parent,
      };
      if (this.isEdit) {
        const whereID = savedata.id;
        this.$gql
          .mutation(
            `updateOrganization(id:${whereID}, data: $data){data{id}}`,
            {
              data: _p
            },
            {
              data: "OrganizationInput!",
            },
          )
          .then(() => {
            this.visible = false;
            this.$message.success(this.$t("Modified successfully"), 3);
            this.loaddata(true);
          });
      } else {
        this.$gql
          .mutation(
            `createOrganization(data: $data){data{id}}`,
            {
              data: _p
            },
            {
              data: "OrganizationInput!",
            },
          )
          .then(() => {
            this.visible = false;
            this.$message.success(this.$t("Created successfully"), 3);
            this.loaddata(true);
          });
      }
    },

    removeOrg(index, type, item) {
      this.$gql
        .mutation(
          `deleteOrganization(id:${item.id}){data{id}}`,
        )
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.loaddata(true);
        });
    },

    manage(index, type, item) {
      this.$router.push({
        path: "/system/organizations/detail/" + item.id,
      });
    },

    setting(index, type, item) {
      this.payload = item;
      if (this.payload.parent) {
        this.payload.parent = "" + this.payload.parent.id;
      }
      this.isEdit = true;
      this.showModal();
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      this.loaddata();
    },

    setTreeKey(tree, level) {
      if(tree){
        tree.forEach((item) => {
          item.key = `${level}-${item.id}`;
          if (item.children) {
            this.setTreeKey(item.children, level + 1);
          }
        });
      }
    },

    loaddata(merge) {
      if (!merge) {
        this.loading = true;
      }
      this.$gql
        .query(`organizations{data{id,attributes{name,parent{data{id,attributes{name}}},children{data{id,attributes{name}}}}}}`)
        .then((res) => {
          this.orgs = res.data;
        });
      this.$gql.query(`getOrganizationsTree`).then((res) => {
        this.orgTree = res;
        this.setTreeKey(this.orgTree, 0);
        this.loading = false;
      });
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
