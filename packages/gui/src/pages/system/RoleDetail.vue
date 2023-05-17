<template>
  <PageLayout
    :form-state="detail"
    ref="layout"
  >
    <template #headerContent>
      <a-descriptions>
        <a-descriptions-item
          :label="$t('Role Name')"
          :span="3"
        >
          <FormItem
            name="name"
            :rules="rules.uniqueName('usersPermissionsRoles',{id:detail.id,type:detail.type})"
          >
            <a-input
              :maxlength="10"
              :placeholder="$t('unset')"
              v-model:value="detail.name"
            >
              <template #prefix>
                <UserOutlined type="user" />
              </template>
            </a-input>
          </FormItem>
        </a-descriptions-item>
        <a-descriptions-item
          :label="$t('Type')"
          :span="3"
        >
          <a-select
            :disabled="!!pid"
            :placeholder="$t('Unselect')"
            class="width-200"
            v-model:value="detail.type"
            @change="renderCallback"
          >
            <a-select-option
              v-for="(item, index) in tabs"
              :key="index"
              :value="item.type"
            >
              <CrownTwoTone
                v-if="item.name == 'Authenticated'"
                two-tone-color="#00adef"
                class="font-20"
              />
              <CustomerServiceTwoTone
                v-else-if="item.name == 'Public'"
                two-tone-color="#00adef"
                class="font-20"
              />
              <IdcardTwoTone
                v-else
                two-tone-color="#00adef"
                class="font-20"
              />
              {{ $t(item.title) }}
            </a-select-option>
          </a-select>
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <template #extra>
      <a-button
        v-if="!!pid"
        :loading="saving"
        v-permission="['role:update']"
        type="primary"
        @click="valid"
      >
        {{ $t("save") }}
      </a-button>
      <a-button
        :loading="saving"
        v-else
        v-permission="['role:create']"
        type="primary"
        @click="valid"
      >
        {{ $t("create") }}
      </a-button>
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
        <a-tabs
          type="card"
          v-model:activeKey="tabKey"
        >
          <a-tab-pane
            key="1"
            v-if="detail.type == 'system'"
            :tab="$t('Menu Permission')"
          >
            <MenuTree 
              ref="menuTree" 
              type="role" 
              :draggable="false" 
              :role-id="pid"
              :is-edit="!!pid" 
              @updated="updated"
            />
          </a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="$t('Resources Permission')"
          >
            <a-card v-if="permissions && permissions.length > 0">
              <div
                class="flex"
                v-for="(resource, index) in permissions"
                :key="index"
                v-show="resource"
              >
                <div class="font-left width-100">
                  {{ $t(resource.name) }}
                </div>
                <div
                  class="font-center width-100"
                  v-if="checkAll[resource.name]"
                >
                  <a-checkbox
                    @change="togglePermissionsAll(resource)"
                    :indeterminate="checkAll[resource.name].indeterminate"
                    v-model:checked="checkAll[resource.name].checked"
                  >
                    {{ $t('All') }}
                  </a-checkbox>
                </div>
                <div
                  class="font-center width-100"
                  v-for="(action, index3) in resource.actions"
                  :key="index3"
                >
                  <a-checkbox
                    @change="togglePermissions(action, resource)"
                    v-model:checked="action.enabled"
                  >
                    {{ $t(action.name) }}
                  </a-checkbox>
                </div>
              </div>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </PageLayout>
</template>

<script>
import {
  IdcardTwoTone,
  CrownTwoTone,
  UserOutlined,
  CustomerServiceTwoTone,
} from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import FormItem from "@/components/tool/FormItem";
import { getPermission, buildPermission } from "@/services/user";
import MenuTree from "./components/MenuTree";
import _ from "lodash";
import { mapState } from "vuex";
export default {
  name: "RoleDetail",
  i18n: require("@/i18n"),
  components: { 
    PageLayout, 
    PageLayout,
    UserOutlined,
    IdcardTwoTone,
    CrownTwoTone,
    CustomerServiceTwoTone,
    FormItem, 
    MenuTree
  },

  data() {
    return {
      pid:null,
      tabKey: "1",
      checkAll:{},
      tabs: [
        { type: "system", title: "System Role" },
        { type: "organization", title: "Organization Role" },
        { type: "project", title: "Project Role" },
      ],

      visible: false,
      detail: {
        name: "",
        type: "system",
        permissions: [],
      },

      defaultPermissions: {},
      permissions: {},
      loading: true,
      saving: false,
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
  },
	
  created() {
    this.loaddata()
  },

  methods: {
    loaddata() {
      if (!this.$isPro) {
        this.tabs = [
          { type: "system", title: "System Role" },
          { type: "organization", title: "Organization Role" },
        ];
      }
      this.initResource();
      this.pid = this.$route.params.id || "";
      if (this.pid) {
        this.loading = true;
        this.$gql
          .query(
            `usersPermissionsRole(id:"${this.pid}"){
              data{id,attributes{
                name,
                type,
                users{data{id}},
                userOrganizationRoles{data{id}}
              }}
            }`,
          )
          .then((res) => {
            this.detail = res.data;
            if(this.detail.type == 'system'){
              this.tabKey = '1';
            }else{
              this.tabKey = '2';
            }
          });
        getPermission({id:this.pid})
          .then((res) => {
            this.permissions = res.permissions;
            this.initCheckAll();
            this.loading = false;
          });
      } else {
        this.detail = {
          name: "",
          type: "system",
          permissions: [],
        };
        this.loading = false;
      }
    },

    togglePermissionsAll(resource){
      resource.actions.forEach((_action) => {
        _action.enabled = this.checkAll[resource.name].checked;
      });
    },

    togglePermissions(action, resource) {
      let lth = 0;
      if (action.name != "find" && action.enabled) {
        resource.actions.forEach((_action) => {
          if (_action.name == "find") {
            _action.enabled = true;
          }
        });
      } else if (action.name == "find" && !action.enabled) {
        resource.actions.forEach((_action) => {
          _action.enabled = false;
        });
      }
      resource.actions.forEach((_action) => {
        if(_action.enabled){
          lth++;
        }
      });
      this.checkAll[resource.name].indeterminate = lth > 0 && lth < resource.actions.length;
      this.checkAll[resource.name].checked = lth == resource.actions.length;
    },

    valid() {
      this.$refs.layout.$refs.form
        .validateFields()
        .then(() => {
          this.handleOk();
        })
        .catch(() => {});
    },

    initCheckAll() {
      this.checkAll = {};
      this.permissions.forEach((resource) => {
        let lth = 0;
        resource.actions.forEach((_action) => {
          if(_action.enabled){
            lth++;
          }
        });
        this.checkAll[resource.name] = {
          indeterminate: lth > 0 && lth < resource.actions.length,
          checked: lth == resource.actions.length
        }
      });
    },

    renderCallback() {
      this.permissions = this.defaultPermissions[this.detail.type];
      this.initCheckAll();
      if(this.detail.type == 'system'){
        this.tabKey = '1';
      }else{
        this.tabKey = '2';
      }
    },

    initResource() {
      this.tabs.forEach((tab) => {
        getPermission({type:tab.type})
          .then((res) => {
            this.defaultPermissions[tab.type] = res.permissions;
            if(this.detail.type == tab.type && !this.pid){
              this.renderCallback();
            }
          });
      });
    },

    handleOk() {
      let permissions = _.cloneDeep(this.permissions);
      const input = {
        name: this.detail.name,
        type: this.detail.type,
        permissions: buildPermission(permissions),
      };
      this.saving = true;
      if (!!this.pid) {
        this.$gql
          .mutation(`updateRoleResourcePermission(id: ${this.pid}, data: $data)`, 
                    { data: input },
                    { data: "RolePermissionInput"},
          )
          .then(() => {
            if(this.detail.type == "system"){
              setTimeout(() => {
                this.$refs['menuTree'].handleOk();
              }, 100);
            } else {
              this.updated();
            }
          });
      } else {
        this.$gql
          .mutation(`createRoleResourcePermission(data: $data)`, 
                    { data: input },
                    { data: "RolePermissionInput"}
          )
          .then((res) => {
            this.pid = res;
            if(this.detail.type == "system"){
              setTimeout(() => {
                this.$refs['menuTree'].handleOk();
              }, 100);
            } else {
              this.updated();
            }
          });
      }
    },
		
    updated(){
      this.saving = false;
      this.visible = false;
      this.loaddata();
      if (!!this.pid) {
        this.$message.success(this.$t("Save successfully"), 3);
      } else {
        this.$message.success(this.$t("Created successfully"), 3);
      }
      
      this.$closePage(this.$route);
    }
		
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
