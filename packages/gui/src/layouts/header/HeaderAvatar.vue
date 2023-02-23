<template>
  <a-dropdown
    placement="bottomRight"
    :trigger="['click']"
  >
    <template #overlay>
      <a-menu :class="['avatar-menu']">
        <a-menu-item
          class="header-menu-item"
        >
          <h3
            class="header-menu-title"
            style="padding-left: 15px"
          >
            <img
              class="avatar"
              width="40"
              :src="require('@/assets/img/usericon.png')"
            >
            <div class="avatar-title">
              <div>{{ detail.username }}</div>
              <div>
                <a-typography-text
                  type="secondary"
                  class="avatar-phone"
                >
                  {{
                    detail.email || "-"
                  }}
                </a-typography-text>
              </div>
            </div>
          </h3>
          <a-descriptions
            bordered
            size="small"
            class="descriptions"
          >
            <a-descriptions-item
              :label="$t('Role')"
              :span="3"
              class="font-left"
            >
              <a-tag
                color="blue"
              >
                <div class="ellipsis-120">
                  {{ $t(detail.role.name) }}
                </div>
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item
              :label="$t('Organization')"
              :span="3"
              class="font-left"
            >
              <span
                v-if="
                  !detail.userOrganizations ||
                    detail.userOrganizations.length == 0
                "
              >-</span>
              <div
                v-for="(org, i) in detail.userOrganizations"
                :key="i"
              >
                <a-tag
                  v-if="i < 3"
                  color="orange"
                  :style="i == 0 ? '' : 'margin-top: 5px;'"
                >
                  <div class="ellipsis-120">
                    {{ org.name }}
                  </div>
                </a-tag>
              </div>
              <span v-if="detail.userOrganizations.length >= 3">...</span>
            </a-descriptions-item>
            <a-descriptions-item
              :label="$t('Project')"
              :span="3"
              class="font-left"
            >
              <span
                v-if="!detail.userProjects || detail.userProjects.length == 0"
              >-</span>
              <div
                class="ellipsis-120"
                v-for="(item, i) in detail.userProjects"
                :key="i"
                :style="i == 0 ? '' : 'margin-top: 5px;'"
                @click="goProject(item.id)"
              >
                <a-badge
                  :text="item.name"
                  status="processing"
                />
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </a-menu-item>

        <a-menu-item class="pd-0">
          <a-card class="grid-menu nopd small-grid-menu">
            <a-card-grid
              class="card-grid"
              @click="usercenter"
            >
              <UserOutlined />
              <span>{{ $t("User center") }}</span>
            </a-card-grid>
            <a-card-grid
              class="card-grid"
              @click="logout"
            >
              <PoweroffOutlined class="danger" />
              <span>{{ $t("Logout") }}</span>
            </a-card-grid>
          </a-card>
        </a-menu-item>
      </a-menu>
    </template>
    <div
      class="header-avatar pointer"
      @click="getUser"
    >
      <img
        class="avatar"
        width="24"
        :src="require('@/assets/img/usericon.png')"
      >
      <span class="name">{{ user.name }}</span>
    </div>
  </a-dropdown>
  <a-modal
    v-model:visible="visible"
    :title="$t('Change Password')"
    width="30%"
    :ok-text="$t('Reset')"
  >
    <ForgetForm
      :nofoot="true"
      :user-name="detail.username"
    />
  </a-modal>
</template>

<script>
import ForgetForm from "@/pages/login/ForgetForm";
import { mapGetters } from "vuex";
import { logout, getUserInfo } from "@/services/user";
import {
  PoweroffOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
export default {
  name: "HeaderAvatar",
  components: {
    ForgetForm,
    PoweroffOutlined,
    UserOutlined,
  },

  data() {
    return {
      loading: true,
      visible: false,
      detail: {
        phone: "",
        email: "",
        username: "",
        userOrganizations: [],
        userProjects: [],
        role: { name: "" },
      },
    };
  },

  i18n: require("@/i18n"),

  computed: {
    ...mapGetters("account", ["user"]),
  },

  methods: {
    goProject(id) {
      this.$router.push({
        path: "/system/projects/detail/" + id,
      });
    },

    getUser() {
      this.loading = true;
      getUserInfo().then((res) => {
        this.loading = false;
        this.detail = res.data;
        this.detail.phone = this.detail.phone || "-";
        this.detail.email = this.detail.email || "-";
      });
    },

    changepass() {
      this.visible = true;
    },

    usercenter() {
      this.$router.push("/user-center/info");
    },

    logout() {
      logout();
      location.reload();
      // this.$router.push('/login');
    },
  },
};
</script>

<style lang="less" scoped>
  .header-avatar {
    .avatar,
    .name {
      align-self: center;
    }
    .avatar {
      margin-right: 8px;
      border-radius: 50%;
      position: relative;
      top: -2px;
    }
    .name {
      font-weight: 500;
    }
  }
  .avatar-menu {
    width: 280px;
    padding-bottom: 0;
  }
  :deep(.ant-descriptions-item-label),
  :deep(.ant-descriptions-item-content) {
    padding: 8px 15px !important;
  }
  :deep(.ant-descriptions-item-label) {
    width: 69px;
  }
  :deep(.header-menu-item) {
    text-align: center;
    padding: 0 !important;
    pointer-events: none;
		background-color: @body-background !important;
  }
  .header-menu-title {
    padding: 20px 0 10px 0;
  }
  .header-menu-title .avatar {
    border-radius: 50%;
    position: relative;
    top: -2px;
  }
  .header-menu-title .avatar-title {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    padding-left: 10px;
  }
  .avatar-phone {
    font-size: 10pt;
    font-weight: normal;
  }
  .descriptions {
    position: relative;
    top: 1px;
  }
  .small-grid-menu {
    width: 280px;
  }
  .card-grid {
    width: 50%;
    text-align: center;
  }
</style>
