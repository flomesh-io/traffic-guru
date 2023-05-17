<template>
  <PageLayout :avatar="CustomerServiceOutlined">
    <template #headerContent>
      <div />
    </template>
    <template #extra>
      <HeadInfo
        v-permission="['role:create']"
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
          :result-empty="{}"
          type="component"
          :actions="[
            {
              icon: 'EditOutlined',
              text: $t('edit'),
              call: setting,
              permission: ['role:update'],
            },
            {
              icon: 'CloseOutlined',
              hide: true,
              text: $t('delete'),
              call: remove,
              permission: ['role:delete'],
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
      roles: [],
      visible: false,
      pageSize: 10,
      pageNo: 1,
      total: 0,
      loading: true,
    };
  },
	
  created() {
    if (!this.$isPro) {
      this.tabs = [
        { type: "system", title: "System Role" },
        { type: "organization", title: "Organization Role" },
      ];
    }
    this.loaddata();
  },

  methods: {

    add() {
      this.$router.push({
        path: "/system/roles/create",
      });
    },

    remove(index, type, item) {
      this.$gql
        .mutation(`deleteRoleResourcePermission(id: ${item.id})`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.loaddata();
        });
    },

    setting(index, type, item) {
      this.$router.push({
        path: "/system/roles/detail/" + item.id,
      });
    },


    loaddata() {
      this.roles = [];
      this.loading = true;
      const activeKey = this.activeKey;
      this.$gql
        .query(
          `usersPermissionsRoles(filters:{type:{eq:"${activeKey}"}}){
						data{id,attributes{
							name,
							type,
							users{data{id}},
							userOrganizationRoles{data{id}}
						}}
					}`,
        )
        .then((res) => {
          this.roles = res.data;
          this.loading = false;
        });
    },
  },
};
</script>