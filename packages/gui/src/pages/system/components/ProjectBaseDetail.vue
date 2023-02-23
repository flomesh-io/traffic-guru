<template>
  <PageLayout
    :form-state="detail"
    ref="layout"
  >
    <template #headerContent>
      <DetailList
        size="small"
        :col="1"
      >
        <DetailListItem
          :term="$t('as')"
          v-if="!embed"
          :rules="rules.uniqueName('projects',{id:pid,organization:detail.organization})"
          name="name"
        >
          <a-input
            :placeholder="$t('unset')"
            v-model:value="detail.name"
            class="width-200"
          />
        </DetailListItem>
        <DetailListItem
          :term="$t('Organization')"
          :rules="rules.required"
          name="organization"
        >
          <a-select
            :placeholder="$t('unset')"
            v-model:value="detail.organization"
            class="width-180"
            ref="select"
          >
            <a-select-option
              :value="org.id"
              :key="index"
              v-for="(org, index) in orgs"
            >
              {{
                org.name
              }}
            </a-select-option>
          </a-select>
        </DetailListItem>
      </DetailList>
    </template>
    <template #action>
      <a-space>
        <slot name="action" />
        <CardSelector
          :search="true"
          :icon="UserOutlined"
          @select="addUser"
          :disabled="
            (item) => {
              let disabled = false;
              (item.userProjects || []).forEach((project) => {
                disabled = project.id == pid || disabled;
              });
              return disabled;
            }
          "
          :options="users"
          v-model:value="selectUsers"
        >
          <a-button
            v-permission="[
              detail.organization
                ? 'project:update:organization:' + detail.organization
                : 'project:update',
            ]"
          >
            {{ $t("Add members") }}
          </a-button>
        </CardSelector>
        <a-button
          type="primary"
          @click="validate"
          v-permission="[
            detail.organization
              ? 'project:update:organization:' + detail.organization
              : 'project:update',
          ]"
          v-if="pid != ''"
        >
          {{ $t("save") }}
        </a-button>
        <a-button
          type="primary"
          @click="validate"
          v-permission="[
            detail.organization
              ? 'project:create:organization:' + detail.organization
              : 'project:create',
          ]"
          v-else
        >
          {{ $t("create") }}
        </a-button>
      </a-space>
    </template>
    <a-row class="row-mg">
      <a-col
        class="col-pd"
        :xl="24"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <slot name="tabs" />
      </a-col>
    </a-row>
    <FolderTwoTone v-if="false" />
		
    <a-modal
      width="80%"
      v-model:visible="projectVisible"
      :title="$t('Project Role')"
      :cancel-text="$t('Remove Role')"
      :ok-text="$t('Save')"
      @cancel="deleteUserOrganizationRoles"
      @ok="saveUserOrganizationRoles"
    >
      <p>
        <a-select
          :placeholder="$t('unset')"
          class="width-500"
          v-model:value="
            permissionPayload.userOrganizationRole
          "
          @change="setDefaultResources"
        >
          <a-select-option
            v-for="(
              projectRole, index2
            ) in projectRoles"
            :key="index2"
            :value="projectRole.id"
          >
            <span>
              <IdcardTwoTone
                two-tone-color="#00adef"
                class="font-30"
              />
              <span class="role-name">{{
                projectRole.name
              }}</span>
            </span>
          </a-select-option>
        </a-select>
      </p>
      <p>
        <PermissionCard
          :resources="resources"
          style="width: 1200px;"
          v-if="resources.length > 0"
        />
      </p>
    </a-modal>
    <UserOutlined v-if="false" />
  </PageLayout>
</template>

<script>
import {
  FolderTwoTone,
  IdcardTwoTone,
  UserOutlined,
} from "@ant-design/icons-vue";
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
import PageLayout from "@/layouts/PageLayout";
import CardSelector from "@/components/card/CardSelector";
import _ from "lodash";
import { Empty } from "ant-design-vue";
import { mapState } from "vuex";
import { getPermission } from "@/services/user";
import PermissionCard from "@/components/card/PermissionCard";
export default {
  name: "ProjectBaseDetail",
  components: {
    DetailListItem,
    DetailList,
    PageLayout,
    CardSelector,
    PermissionCard,
    IdcardTwoTone,
    UserOutlined,
    FolderTwoTone,
  },

  i18n: require("@/i18n"),
  props: ["pid"],
  data() {
    return {
      activeKey: "1",
      FolderTwoTone,
      orgs: [],
      selectUsers: null,
      isEdit: false,
      detail: {
        users: [],
        id: "",
        name: "",
        organization: null,
      },

      bindTarget: {},
      editorIsCreate: true,
      workload: [],
      loading: true,
      activities: [],
      config: {},
      teams: [],
      subApis: [],
      projectRoles: [],
      userOrganizationRoles: [],
      userOrganizationRolesMap: [],
      permissionPayload: {
        userOrganizationRole: null,
      },

      permissionUser: null,
      projectVisible: false,
      resources: [],
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      UserOutlined,
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
  },
	
  created() {
    if (this.pid) {
      this.isEdit = true;
      this.loaddata();
    } else {
      this.isEdit = false;
      this.loading = false;
      this.detail = {
        users: [],
        id: "",
        name: "",
        organization: null,
      };
      this.$gql.query(`myOrganizations{data{id,attributes{name}}}`).then((res) => {
        this.orgs = res.data;
      });
      this.$emit("getDetail", { detail: this.detail, loading: this.loading });
    }
  },

  activated() {},

  methods: {
    showProjectRole(item) {
      this.permissionUser = item;
      this.setPermissionPayload(
        item.id,
        this.detail.organization,
        this.pid,
      );
      this.projectVisible = true;
    },
		
    deleteUserOrganizationRoles() {
      let id = this.userOrganizationRolesMap[`project-${this.pid}-${this.permissionUser.id}`].id;
      this.$gql
        .mutation(
          `deleteUserOrganizationRole(id:${id}){data{id}}`,
        )
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.loadRoles();
        });
    },

    setPermissionPayload(user, organization, project) {
      let type = "project";
      this.permissionPayload.userOrganizationRole = null;
      this.resources = [];
      if (
        this.userOrganizationRolesMap[`${type}-${project}-${user}`]
      ) {
        this.permissionPayload.userOrganizationRole =
          this.userOrganizationRolesMap[`${type}-${project}-${user}`].role.id;
      }
      this.setDefaultResources();
    },
		
    setDefaultResources() {
      if (this.permissionPayload.userOrganizationRole) {
        let roleId = this.permissionPayload.userOrganizationRole;
        getPermission({id:roleId})
          .then((resources) => {
            this.resources = resources.permissions;
          });
      }
    },

    loadRoles() {
      this.projectRoles = [];
      this.$gql
        .query(
          `usersPermissionsRoles(filters:{type:{eq:"project"}}){data{id,attributes{name,type}}}`,
        )
        .then((res) => {
          this.projectRoles = res.data;
        });
				
      this.userOrganizationRoles = [];
      this.userOrganizationRolesMap = {};
      const pid = this.detail.organization;
      this.$gql
        .query(
          `userOrganizationRoles(pagination:{limit: ${this.$DFT_LIMIT}},filters:{organization:{id:{eq:${pid}}}}){data{id,attributes{
						type,
						project{data{id,attributes{name}}},
						user{data{id,attributes{username}}},
						role{data{id,attributes{name}}}
					}}}`,
        )
        .then((res) => {
          this.userOrganizationRoles = res.data;
          res.data.forEach((item) => {
            if (item.type == "organization" && item.user) {
              this.userOrganizationRolesMap[`organization-${item.user.id}`] =
                item;
            } else if (item.type == "project" && item.user) {
              this.userOrganizationRolesMap[
                `project-${this.pid}-${item.user.id}`
              ] = item;
            }
          });
          this.detail.users.forEach((user)=>{
            user.role = this.userOrganizationRolesMap[`project-${this.pid}-${user.id}`]?.role;
          });
          this.loading = false;
          this.$emit("getDetail", {
            detail: this.detail,
            loading: this.loading,
          });
        });
    },

    saveUserOrganizationRoles() {
      let _isEdit = false;
      let user = this.permissionUser.id;
      let organization = this.detail.organization;
      let project = this.pid;
      let role = this.permissionPayload.userOrganizationRole;
      let type = "project";
      let savedata = {
        user,
        organization,
        role,
        type,
      };
      savedata.project = project;
      if (
        this.userOrganizationRolesMap[`${type}-${project}-${user}`]
      ) {
        _isEdit = true;
        savedata.id =
          this.userOrganizationRolesMap[`${type}-${project}-${user}`].id;
      }
      if (_isEdit) {
        const whereID = savedata.id;
        delete savedata.id;
        this.$gql
          .mutation(
            `updateUserOrganizationRole(id:${whereID}, data: $data){data{id}}`,
            {
              data: savedata,
            },
            {
              data: "UserOrganizationRoleInput!",
            },
          )
          .then(() => {
            this.$message.success(this.$t("Modified successfully"), 3);
            this.permissionPayload.userOrganizationRole = null;
            this.permissionUser = null;
            this.resources = [];
            this.projectVisible = false;
            this.loadRoles();
          });
      } else {
        delete savedata.id;
        this.$gql
          .mutation(
            `createUserOrganizationRole(data: $data){data{id}}`,
            {
              data: savedata,
            },
            {
              data: "UserOrganizationRoleInput!",
            },
          )
          .then(() => {
            this.$message.success(this.$t("Modified successfully"), 3);
            this.permissionPayload.userOrganizationRole = null;
            this.permissionUser = null;
            this.resources = [];
            this.projectVisible = false;
            this.loadRoles();
          });
      }
    },

    addUser() {
      let users = [];
      this.detail.users.forEach((user) => {
        users.push(user.id);
      });
      users.push(this.selectUsers);
      this.selectUsers = null;
      this.updateProjectUser(this.pid, users);
    },
		
    delProjectUser(id) {
      let users = [],
          users_id = [];
      this.detail.users.forEach((user) => {
        if (id != user.id) {
          users.push(user);
          users_id.push(user.id);
        }
      });
      this.detail.users = users;
      this.updateProjectUser(this.pid, users_id);
    },
		
    updateProjectUser(id, users) {
      let data = { users };
      this.$gql
        .mutation(
          `updateProject(id:${id}, data: $data){data{id}}`,
          { data },
          { data: "ProjectInput!" },
        )
        .then(() => {
          this.loaddata(true);
        });
    },
		
    getSample() {
      this.custom = this.customSample;
    },

    validate() {
      this.$refs.layout.$refs.form
        .validateFields()
        .then(() => {
          this.save();
        })
        .catch(() => {});
    },

    save() {
      let savedata = _.cloneDeep(this.detail);
      if (!savedata.organization) {
        delete savedata.organization;
      }
      delete savedata.users;
      if (this.isEdit) {
        const whereID = savedata.id;
        delete savedata.id;
        delete savedata.apis;
        delete savedata.applications;
        this.$gql
          .mutation(
            `updateProject(id:${whereID}, data: $data){data{id}}`,
            {
              data: savedata
            },
            {
              data: "ProjectInput!",
            },
          )
          .then(() => {
            this.$message.success(this.$t("Modified successfully"), 3);
            this.loaddata();
          });
      } else {
        delete savedata.id;
        this.$gql
          .mutation(
            `createProject(data: $data){data{id}}`,
            {
              data: savedata
            },
            {
              data: "ProjectInput!",
            },
          )
          .then((res) => {
            this.$message.success(this.$t("Created successfully"), 3);
            this.$emit("update:pid", res.data.id);
            this.isEdit = true;
            setTimeout(()=>{
              this.loaddata();
            },1000);
          });
      }
    },

    remove(index, type, item) {
      this.$gql
        .mutation(`deleteProject(id:${item.id}){data{id}}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.loaddata();
        });
    },
		
    getTimeLabel(date) {
      return (
        new Date(date[0]).toLocaleDateString() +
        "~" +
        new Date(date[1]).toLocaleDateString()
      );
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
      this.$gql
        .query(
          `project(id: ${this.pid}){data{id,attributes{
						name,
						organization{data{id,attributes{
							name,
							users{data{id,attributes{
								username,
								type,
								role{data{id,attributes{name}}},
								userProjects{data{id}}
							}}},
						}}},
						users{data{id,attributes{username,role{data{id,attributes{name}}},phone,email,type}}},
						content
					}}}`,
        )
        .then((d) => {
          let res = d.data;
          this.detail = res;
          this.users = res.organization.users;
          this.detail.organization = res.organization
            ? res.organization.id
              ? res.organization.id
              : res.organization
            : null;
          this.loadRoles();
        });
      this.$gql.query(`myOrganizations{data{id,attributes{name}}}`).then((res) => {
        this.orgs = res.data;
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
</style>
