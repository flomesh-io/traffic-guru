<template>
  <a-dropdown>
    <div class="header-setting pointer">
      <MoreOutlined class="MoreOutlined" />
    </div>
    <template #overlay>
      <a-menu class="pd-0">
        <a-menu-item class="pd-0">
          <a-card class="grid-menu width-100">
            <a-card-grid
              v-permission="['organization:find']"
              class="card-grid"
              @click="organizations"
            >
              <PartitionOutlined />
              <span>{{ $t("Organizations") }}</span>
            </a-card-grid>
            <a-card-grid
              v-permission="['project:find']"
              class="card-grid"
              @click="projects"
            >
              <ProjectOutlined />
              <span>{{ $t("Projects") }}</span>
            </a-card-grid>
            <a-card-grid
              v-permission="['userspermissions:find']"
              class="card-grid"
              @click="roles"
            >
              <CustomerServiceOutlined />
              <span>{{ $t("Roles") }}</span>
            </a-card-grid>
            <a-card-grid
              v-permission="['user:find']"
              class="card-grid"
              @click="users"
            >
              <TeamOutlined />
              <span>{{ $t("Users") }}</span>
            </a-card-grid>
          </a-card>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  MoreOutlined,
  ProjectOutlined,
  PartitionOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons-vue";
export default {
  name: "SystemSetting",
  components: {
    MoreOutlined,
    ProjectOutlined,
    PartitionOutlined,
    TeamOutlined,
    CustomerServiceOutlined,
  },

  data() {
    return {};
  },

  i18n: require("@/i18n"),

  computed: {
    ...mapState("setting", ["isMobile"]),
    ...mapGetters("account", ["user"]),
  },

  methods: {
    customDashboard() {
      this.$router.push("/system/dashboard/list");
    },

    organizations() {
      this.$router.push("/system/organizations/list");
    },

    projects() {
      this.$router.push("/system/projects/list");
    },

    roles() {
      this.$router.push("/system/roles");
    },

    users() {
      this.$router.push("/system/users");
    },

    jump() {
      this.$router.push("/system/components");
    },

    editor() {
      this.$router.push("/system/topology-editor");
    },
  },
};
</script>

<style lang="less" scoped>
  .header-setting {
    width: 40px;
    font-size: 30px;
    text-align: center;
    color: #00adef;
  }
  .MoreOutlined {
    position: relative;
    top: -2px;
    font-size: 30px !important;
  }
  .card-grid {
    width: 100% !important;
    text-align: center;
  }
  .beta {
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
