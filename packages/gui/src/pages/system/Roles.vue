<template>
  <PageLayout :avatar="CustomerServiceOutlined">
    <template #headerContent>
      <div />
    </template>
    <template #extra>
      <HeadInfo
        v-permission="['userspermissions:create']"
        class="split-right"
        :title="$t('Create role')"
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
    <a-tabs
      type="card"
      v-model:activeKey="activeKey"
      @change="loaddata"
    >
      <a-tab-pane
        v-for="tab in tabs"
        :key="tab.type"
      >
        <template #tab>
          <div class="capitalize">
            {{ $t(tab.title) }}
          </div>
        </template>
        <CardList
          :loading="loading"
          :hide-action-title="true"
          :data-source="roles"
          type="component"
          :actions="[
            {
              icon: 'EditOutlined',
              text: $t('edit'),
              call: setting,
              permission: ['userspermissions:update'],
            },
            {
              icon: 'CloseOutlined',
              hide: true,
              text: $t('delete'),
              call: remove,
              permission: ['userspermissions:delete'],
            },
          ]"
        >
          <template #default="{ item }">
            <a-card-meta>
              <template #title>
                <div class="capitalize">
                  {{ $t(item.name) }}
                </div>
              </template>
              <template #avatar>
                <CrownTwoTone
                  v-if="item.name == 'Authenticated'"
                  two-tone-color="#00adef"
                  class="font-50"
                />
                <CustomerServiceTwoTone
                  v-else-if="item.name == 'Public'"
                  two-tone-color="#00adef"
                  class="font-50"
                />
                <IdcardTwoTone
                  v-else
                  two-tone-color="#00adef"
                  class="font-50"
                />
              </template>
              <template #description>
                {{
                  item.users?.length + item.userOrganizationRoles?.length || "0"
                }}
                <UserOutlined
                  class="font-14 font-primary"
                />
              </template>
            </a-card-meta>
          </template>
        </CardList>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      v-model:visible="visible"
      :title="$t('Role')"
      width="70%"
    >
      <template #footer>
        <a-button
          v-if="isEdit"
          :loading="saving"
          v-permission="['userspermissions:update']"
          type="primary"
          @click="valid"
        >
          {{ $t("save") }}
        </a-button>
        <a-button
          :loading="saving"
          v-else
          v-permission="['userspermissions:create']"
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
            :label="$t('Type')"
            :span="3"
          >
            <a-select
              :disabled="isEdit"
              :placeholder="$t('Unselect')"
              class="width-200"
              v-model:value="payload.type"
              @change="renderCallback"
            >
              <a-select-option
                v-for="(item, index) in tabs"
                :key="index"
                :value="item.type"
              >
                {{ $t(item.title) }}
              </a-select-option>
            </a-select>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Avatar')"
            :span="3"
          >
            <CrownTwoTone
              v-if="payload.name == 'Authenticated'"
              two-tone-color="#00adef"
              class="font-50"
            />
            <CustomerServiceTwoTone
              v-else-if="payload.name == 'Public'"
              two-tone-color="#00adef"
              class="font-50"
            />
            <IdcardTwoTone
              v-else
              two-tone-color="#00adef"
              class="font-50"
            />
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Role Name')"
            :span="3"
          >
            <FormItem
              name="name"
              :rules="rules.uniqueName('getRoles',{id:payload.id,type:payload.type})"
            >
              <a-input
                :maxlength="10"
                :placeholder="$t('unset')"
                v-model:value="payload.name"
              >
                <template #prefix>
                  <UserOutlined type="user" />
                </template>
              </a-input>
            </FormItem>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('Resources')"
            :span="3"
            v-if="resources && resources.length > 0"
          >
            <div
              class="flex"
              v-for="(resource, index) in resources"
              :key="index"
              v-show="resource"
            >
              <div class="font-left width-100">
                {{ $t(resource.name) }}
              </div>
              <div
                class="font-center width-100"
                v-for="(action, index3) in resource.actions"
                :key="index3"
              >
                <a-checkbox
                  @change="toggleResources(action, resource.actions)"
                  v-model:checked="action.enabled"
                >
                  {{ $t(action.name) }}
                </a-checkbox>
              </div>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </a-form>
    </a-modal>
    <CustomerServiceOutlined v-if="false" />
  </PageLayout>
</template>

<script>
import {
  IdcardTwoTone,
  CrownTwoTone,
  PlusCircleTwoTone,
  UserOutlined,
  CustomerServiceTwoTone,
  CustomerServiceOutlined,
} from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import CardList from "@/components/card/CardList";
import FormItem from "@/components/tool/FormItem";
import _ from "lodash";
import { mapState } from "vuex";
export default {
  name: "Roles",
  components: {
    HeadInfo,
    PageLayout,
    CardList,
    PlusCircleTwoTone,
    UserOutlined,
    IdcardTwoTone,
    CrownTwoTone,
    CustomerServiceTwoTone,
    CustomerServiceOutlined,
    FormItem,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      activeKey: "system",
      tabs: [
        { type: "system", title: "System Role" },
        { type: "organization", title: "Organization Role" },
        { type: "project", title: "Project Role" },
      ],

      CustomerServiceOutlined,
      isEdit: false,
      roles: [],
      visible: false,
      payload: {
        id: "",
        name: "",
        type: "system",
        permissions: [],
      },

      defaultResources: {},
      resources: {},
      bindTarget: {},
      editorIsCreate: true,
      workload: [],
      projects: [],
      pageSize: 10,
      pageNo: 1,
      total: 0,
      loading: true,
      saving: false,
      activities: [],
      config: {},
      teams: [],
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
  },
	
  created() {
    if (!this.$isPro) {
      this.tabs = [
        { type: "system", title: "System Role" },
        { type: "organization", title: "Organization Role" },
      ];
    }
    this.loaddata();
    this.initResource();
  },

  methods: {
    toggleResources(action, actions) {
      if (action.name != "find" && action.enabled) {
        actions.forEach((_action) => {
          if (_action.name == "find") {
            _action.enabled = true;
          }
        });
      } else if (action.name == "find" && !action.enabled) {
        actions.forEach((_action) => {
          _action.enabled = false;
        });
      }
    },

    add() {
      this.isEdit = false;
      this.payload = {
        name: "",
        type: "system",
        permissions: [],
      };
      this.resources = this.defaultResources[this.payload.type];
      this.showModal();
    },

    getSample() {
      this.custom = this.customSample;
    },

    showModal() {
      this.visible = true;
    },

    renderCallback() {
      this.resources = this.defaultResources[this.payload.type];
    },

    valid() {
      this.saving = true;
      this.$refs.form
        .validateFields()
        .then(() => {
          this.handleOk();
        })
        .catch(() => {});
    },

    handleOk() {
      let resources = _.cloneDeep(this.resources);
      const input = {
        name: this.payload.name,
        type: this.payload.type,
        resources: resources,
      };
      if (this.isEdit) {
        this.$gql
          .mutation(`updateRoleResourcePermission(roleId: ${this.payload.id}, input: $input)`, { input })
          .then(() => {
            this.saving = false;
            this.visible = false;
            this.$message.success(this.$t("Save successfully"), 3);
            this.loaddata();
          });
      } else {
        this.$gql
          .mutation(`createRoleResourcePermission(input: $input)`, { input })
          .then(() => {
            this.saving = false;
            this.visible = false;
            this.$message.success(this.$t("Created successfully"), 3);
            this.loaddata();
          });
      }
    },

    remove(index, type, item) {
      this.$gql
        .mutation(`deleteRoleResourcePermission(roleId: ${item.id})`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.loaddata();
        });
    },

    setting(index, type, item) {
      this.payload = item;
      this.$gql
        .query(
          `getRoleResourcePermission(roleId: ${item.id}){resources{name,actions{name,enabled}}}`,
        )
        .then((res) => {
          this.resources = res.resources;
          this.isEdit = true;
          this.showModal();
        });
    },

    initResource() {
      this.tabs.forEach((tab) => {
        this.$gql
          .query(
            `getRoleResourcePermission(type:"${tab.type}"){type,resources{name,actions{name,enabled}}}`,
          )
          .then((res) => {
            this.defaultResources[tab.type] = res.resources;
          });
      });
    },

    loaddata() {
      this.roles = [];
      this.loading = true;
      const activeKey = this.activeKey;
      this.$gql
        .query(
          `getRolesConnection(where:{type:"${activeKey}"}){values{id,name,type,users{id},userOrganizationRoles{id}}}`,
        )
        .then((res) => {
          this.roles = res.values;
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
</style>
