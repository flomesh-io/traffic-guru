<template>
  <ProjectBaseDetail
    v-model:pid="pid"
    @getDetail="getDetail"
  >
    <template #tabs>
      <a-tabs
        type="card"
        v-model:activeKey="activeKey"
      >
        <a-tab-pane
          key="1"
          :tab="$t('Project members')"
        >
          <UsersResults
            :loading="loading"
            :actions="[
              {
                icon: 'EditOutlined',
                text: $t('Set Project Role'),
                call: setting,
                permission: [
                  detail.organization
                    ? 'project:update:organization:' + detail.organization
                    : 'project:update',
                ],
              },
              {
                icon: 'CloseOutlined',
                hide: true,
                text: $t('Remove'),
                call: remove,
                permission: [
                  detail.organization
                    ? 'project:update:organization:' + detail.organization
                    : 'project:update',
                ],
              },
            ]"
            :users="detail.users"
          />
        </a-tab-pane>
      </a-tabs>
    </template>
  </ProjectBaseDetail>
</template>

<script>
import { DEFAULT_PROJECT } from "@/services/dashboard";
import ProjectBaseDetail from "@/pages/system/components/ProjectBaseDetail";
import UsersResults from "@/pages/system/components/UsersResults";
export default {
  name: "ProjectDetail",
  components: {
    UsersResults,
    ProjectBaseDetail,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      DEFAULT_PROJECT,
      activeKey: "1",
      pid: "",
      detail: {
        users: [],
        id: "",
        name: "",
        organization: null,
      },

      loading: true,
    };
  },

  computed: {},
  created() {
    this.pid = this.$route.params.id || "";
  },

  methods: {
    remove(index, type, item) {
      console.log(index, type);
      this.$refs['projectBase'].delProjectUser(item.id)
    },

    setting(index, type, item) {
      console.log(index, type);
      this.$refs['projectBase'].showProjectRole(item);
    },

    getDetail(d) {
      this.detail = d.detail;
      this.loading = d.loading;
    },
  },
};
</script>
