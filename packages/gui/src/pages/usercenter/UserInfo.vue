<template>
  <PageLayout :avatar="require('@/assets/img/usericon.png')">
    <template #headerContent>
      <div>
        <div class="title">
          {{ $t("Hello") + " " }} {{ currUser.name + " " }}，{{
            $t(welcome.message)
          }}
        </div>
        <div>{{ $t("Last Login") }} : {{ welcome.timeFix }}</div>
      </div>
    </template>
    <template #extra>
      <HeadInfo
        class="split-right"
        :title="$t('Change Password')"
      >
        <template #body>
          <ToolFilled
            @click="showModal"
            class="font-primary icon-menu rotate-icon"
          />
        </template>
      </HeadInfo>
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
        <a-tabs type="card">
          <a-tab-pane
            key="1"
            :tab="$t('Overview')"
          >
            <a-card
              class="card mb-20 nopd"
              :bordered="false"
            >
              <a-descriptions
                bordered
                size="small"
              >
                <a-descriptions-item
                  :label="$t('as')"
                  :span="1"
                >
                  {{
                    detail.username
                  }}
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Mobile')"
                  :span="2"
                >
                  <div class="userinfo-description">
                    <span v-if="!detail.phone">-</span>
                    <a-typography-paragraph
                      class="inline-block"
                      v-model:content="detail.phone"
                      :editable="{ onEnd: savePhone }"
                    />
                  </div>
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Roles')"
                  :span="1"
                >
                  <a-tag color="blue">
                    {{ $t(detail.role.name) }}
                  </a-tag>
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Email')"
                  :span="2"
                >
                  <div class="userinfo-description">
                    <span v-if="!detail.email">-</span>
                    <a-typography-paragraph
                      class="inline-block"
                      v-model:content="detail.email"
                    />
                  </div>
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Organization')"
                  :span="1"
                >
                  <span
                    v-if="
                      !detail.userOrganizations ||
                        detail.userOrganizations.length == 0
                    "
                  >-</span>
                  <div
                    :key="i"
                    v-for="(org, i) in detail.userOrganizations"
                    :style="i == 0 ? '' : 'margin-top: 5px;'"
                  >
                    <a-tag color="orange">
                      {{ org.name }}
                    </a-tag>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('Project')"
                  :span="2"
                >
                  <span
                    v-if="
                      !detail.userProjects || detail.userProjects.length == 0
                    "
                  >-</span>
                  <div
                    :key="i"
                    v-for="(item, i) in detail.userProjects"
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
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="$t('Authority')"
          >
            <a-tabs
              tab-position="left"
              type="line"
              v-model:activeKey="activeKey"
              @change="changeRes"
            >
              <a-tab-pane
                v-for="(tab, i) in tabs"
                :key="i"
              >
                <template #tab>
                  <div class="capitalize">
                    {{ $t(tab.title) }}
                  </div>
                </template>
                <PermissionCard
                  :resources="resources"
                  v-if="resources.length > 0"
                />
              </a-tab-pane>
            </a-tabs>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
    <a-modal
      v-model:visible="visible"
      :title="$t('Change Password')"
      width="25%"
      :ok-text="$t('Reset')"
      @ok="forget"
    >
      <div class="pd-20">
        <ForgetForm
          ref="forget"
          :nofoot="true"
          :user-name="detail.email"
        />
      </div>
    </a-modal>
  </PageLayout>
</template>

<script>
import store from "@/store";
import ForgetForm from "@/pages/login/ForgetForm";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import PermissionCard from "@/components/card/PermissionCard";
import { getUserInfo, editUserInfo } from "@/services/user";
import { mapState } from "vuex";
import {
  ToolFilled,
} from "@ant-design/icons-vue";

export default {
  name: "UserInfo",
  components: {
    HeadInfo,
    PageLayout,
    ToolFilled,
    PermissionCard,
    ForgetForm,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      visible: false,
      resources: {},
      loading: true,
      oldphone: "",
      activeKey: "system",
      tabs: [],
      detail: { phone: "", email: "", role: { name: "" } },
      welcome: {
        timeFix: new Date().toLocaleString(),
        message: "Welcome Flomesh",
      },
    };
  },

  computed: {
    ...mapState("account", { currUser: "user" }),
  },

  watch: {},

  created() {
    if (this.$isPro) {
      this.tabs = [
        { type: "system", title: "System Role" },
        { type: "organization", title: "Organization Role" },
        { type: "project", title: "Project Role" },
      ];
    } else {
      this.tabs = [
        { type: "system", title: "System Role" },
        { type: "organization", title: "Organization Role" },
      ];
    }
  },

  mounted() {
    this.search();
  },

  methods: {
    forget() {
      this.$refs.forget.validate((res) => {
        if (res) {
          this.visible = false;
        }
      });
    },

    goProject(id) {
      this.$router.push({
        path: "/system/projects/detail/" + id,
      });
    },

    showModal() {
      this.visible = true;
    },

    search() {
      this.loading = true;
      getUserInfo().then((res) => {
        this.detail = res;
        this.detail.phone = this.detail.phone || "";
        this.oldphone = this.detail.phone || "";
        this.detail.email = this.detail.email || "";
        this.initroles();
        this.loading = false;
      });
    },

    saveEmail() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      editUserInfo({ id: this.detail.id, email: this.detail.email }).then(
        () => {
          this.loading = false;
          this.$message.success(this.$t("Email replacement succeeded"), 3);
        },
      );
    },

    initroles() {
      this.changeRes();
    },

    changeRes() {
      this.resources = [];
      const roles = store.getters["account/roles"];
      roles.forEach((role) => {
        if (
          this.activeKey == "system" &&
          (!role.type || role.type == this.activeKey)
        ) {
          this.resources.push(role);
        } else if (
          this.activeKey != "system" &&
          role.type == this.activeKey
        ) {
          this.resources.push(role);
        }
      });
    },

    savePhone() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      if (isNaN(this.detail.phone * 1)) {
        this.$message.error(this.$t("Wrong phone number format"), 3);
        setTimeout(() => {
          this.detail.phone = this.oldphone;
        }, 300);
        return;
      } else {
        editUserInfo({ id: this.detail.id, phone: this.detail.phone }).then(
          () => {
            this.loading = false;
            this.oldphone = this.detail.phone;
            this.$message.success(
              this.$t("Mobile phone number changed successfully"),
              3,
            );
          },
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .userinfo-description {
    position: relative;
    top: 5px;
  }
  :deep(.ant-form-item-control-input) {
    margin-bottom: 10px;
  }
</style>
