<template>
  <PageLayout :avatar="TeamOutlined">
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
                    <span>{{ $t("Card View") }}</span>
                  </div>
                  <div class="content">
                    <a-form-item>
                      <a-radio-group
                        size="small"
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
            <div>
              <HeadInfo
                v-permission="['user:create']"
                class="split-right"
                :title="$t('Create user')"
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
            </div>
          </div>
        </a-card>
      </div>
    </template>
    <UsersResults
      :loading="loading"
      :users="users"
      :page-no="pageNo"
      :total="total"
      @search="search"
      :page-size="pageSize"
      @remove="remove"
      @setting="setting"
    />

    <a-modal
      v-model:visible="visible"
      :title="$t('user')"
      width="50%"
    >
      <template #footer>
        <a-button
          v-if="isEdit"
          v-permission="['user:update']"
          type="primary"
          @click="valid"
        >
          {{ $t("save") }}
        </a-button>
        <a-button
          v-else
          v-permission="['user:create']"
          type="primary"
          @click="valid"
        >
          {{ $t("create") }}
        </a-button>
      </template>

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
              name="username"
              :rules="rules.username"
            >
              <a-input
                :placeholder="$t('unset')"
                v-model:value="payload.username"
              >
                <template #prefix>
                  <UserOutlined type="user" />
                </template>
              </a-input>
            </FormItem>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Mobile')"
            :span="3"
            v-if="$isPro"
          >
            <a-input
              :placeholder="$t('unset')"
              v-model:value="payload.phone"
            >
              <template #prefix>
                <MobileOutlined type="user" />
              </template>
            </a-input>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Password')"
            :span="3"
            v-if="!isEdit"
          >
            <FormItem
              name="password"
              :rules="rules.password"
            >
              <a-input-password
                v-model:value="payload.password"
                :placeholder="$t('unset')"
              />
            </FormItem>
          </a-descriptions-item>

          <a-descriptions-item
            :label="$t('Email')"
            :span="3"
          >
            <FormItem
              name="email"
              :rules="rules.email"
            >
              <a-input
                :placeholder="$t('unset')"
                v-model:value="payload.email"
              >
                <template #prefix>
                  <MailOutlined type="user" />
                </template>
              </a-input>
            </FormItem>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Roles')"
            :span="3"
          >
            <a-radio-group
              v-if="payload.role.type == 'system'"
              v-model:value="payload.role.id"
              button-style="solid"
              @change="setDefaultResources"
            >
              <a-radio-button
                :value="role.id"
                :key="index"
                v-for="(role, index) in roles"
                v-show="role.type == 'system'"
              >
                {{ $t(role.name) }}
              </a-radio-button>
            </a-radio-group>
            <span v-else>{{ $t(payload.role.name) }}</span>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Authority')"
            :span="3"
          >
            <PermissionCard
              :resources="resources"
              v-if="resources.length > 0"
            />
          </a-descriptions-item>
        </a-descriptions>
      </a-form>
    </a-modal>
    <TeamOutlined v-if="TeamOutlined" />
  </PageLayout>
</template>

<script>
import {
  PlusCircleTwoTone,
  UserOutlined,
  MobileOutlined,
  MailOutlined,
  TeamOutlined,
} from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import UsersResults from "./components/UsersResults";
import PermissionCard from "@/components/card/PermissionCard";
import FormItem from "@/components/tool/FormItem";

import { DEFAULT_PREFERENCE } from "@/services/user";
import _ from "lodash";

export default {
  name: "Users",
  components: {
    HeadInfo,
    PageLayout,
    UsersResults,
    PlusCircleTwoTone,
    UserOutlined,
    MobileOutlined,
    MailOutlined,
    TeamOutlined,
    PermissionCard,
    FormItem,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      rules: {
        username: [
          {
            required: true,
            message: "This is required",
            whitespace: true,
            trigger: "blur",
          },
        ],

        password: [
          {
            required: true,
            message: "Must be at least 6 characters long",
            whitespace: true,
            min: 6,
            trigger: "blur",
          },
        ],

        email: [
          {
            required: true,
            message: "This is required",
            whitespace: true,
            trigger: "blur",
          },
          {
            type: "email",
            message: "Email is not a valid email",
            whitespace: true,
            trigger: "blur",
          },
        ],
      },

      TeamOutlined,
      isEdit: false,
      users: [],
      visible: false,
      viewtypevalue: 0,
      viewtype: [{ value: 0, label: "All" }],
      payload: {
        id: "",
        username: "",
        phone: "",
        role_id: "",
        password: "",
        type: "",
        email: "",
      },

      resources: {},
      defaultResources: {},
      roles: [],
      roleMap: {},
      defaultRoleId: "",
      bindTarget: {},
      editorIsCreate: true,
      workload: [],
      projects: [],
      pageSize: 10,
      pageNo: 1,
      total: 0,
      key: "",
      loading: true,
      activities: [],
      config: {},
      teams: [],
    };
  },

  computed: {
    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  created() {
    this.initroles();
    this.loaddata();
  },

  methods: {
    setDefaultResources() {
      const roleId = this.payload.role.id;
      this.$gql
        .query(
          `getRoleResourcePermission(roleId:${roleId}){resources{name,actions{name,enabled}}}`,
        )
        .then((res) => {
          this.resources = res.resources;
        });
    },

    add() {
      this.isEdit = false;
      const role_id = this.defaultRoleId;
      if (!this.roleMap[`role-${role_id}`]) {
        this.$message.error("Please create a system role first", 3);
        return;
      }
      this.payload = {
        id: "",
        username: "",
        phone: "",
        role: {
          id: role_id,
          type: "system",
          permissions: this.roleMap[`role-${role_id}`].permissions,
        },

        password: "123456",
        widget: DEFAULT_PREFERENCE,
        type: "",
        email: "",
      };

      this.setDefaultResources();
      this.showModal();
    },

    getSample() {
      this.custom = this.customSample;
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
      this.save();
    },

    initroles() {
      let firstRole = false;
      this.$gql
        .query(
          `roles{id,name,type,permissions{id,type,controller,action,enabled}}`,
        )
        .then((res) => {
          this.roles = res;
          res.forEach((role) => {
            if (role.type == "system" && !firstRole) {
              this.defaultRoleId = role.id;
              firstRole = true;
            }
            this.roleMap[`role-${role.id}`] = role;
          });
        });

      this.$gql
        .query(
          `getRoleResourcePermission{resources{name,actions{name,enabled}}}`,
        )
        .then((res) => {
          this.defaultResources = res.resources;
        });
    },

    save() {
      let savedata = _.cloneDeep(this.payload);
      if (savedata.role && savedata.role.id) {
        savedata.role = savedata.role.id;
      } else if (savedata.role && !savedata.role.id) {
        delete savedata.role;
      }
      if (this.isEdit) {
        const whereID = savedata.id;
        delete savedata.id;
        this.$gql
          .mutation(
            `updateUser(input: $input){user{id}}`,
            { input: { where: { id: whereID }, data: savedata } },
            { input: "updateUserInput" },
          )
          .then(() => {
            this.visible = false;
            this.$message.success(this.$t("Modified successfully"), 3);
            this.loaddata();
          });
      } else {
        delete savedata.id;
        this.$gql
          .mutation(
            `createUser(input: $input){user{id}}`,
            { input: { data: savedata } },
            { input: "createUserInput" },
          )
          .then(() => {
            this.visible = false;
            this.$message.success(this.$t("Created successfully"), 3);
            this.loaddata();
          });
      }
    },

    remove(index, type, item) {
      this.$gql
        .mutation(`deleteUser(input:{where:{id:${item.id}}}){user{id}}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.loaddata();
        });
    },

    showModal2() {
      this.visible2 = true;
    },

    getTimeLabel(date) {
      return (
        new Date(date[0]).toLocaleDateString() +
        "~" +
        new Date(date[1]).toLocaleDateString()
      );
    },

    setting(index, type, item) {
      this.payload = item;
      this.setDefaultResources();
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

    loaddata() {
      this.loading = true;
      const where = { username_contains: this.key };
      this.$gql
        .query(
          `usersConnection(where: $where, start: ${this.start}, limit: ${this.pageSize}){values{id,username,phone,email,type,role{id,name,type,permissions{id,type,controller,action,enabled}}},aggregate{totalCount}}`,
          { where }
        )
        .then((res) => {
          this.users = res.values;
          this.total = res.aggregate.totalCount;
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
  .div-phone {
    height: auto;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
  }
</style>
