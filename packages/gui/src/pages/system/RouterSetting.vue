<template>
  <PageLayout :avatar="PartitionOutlined">
    <template #headerContent>
      <div />
    </template>
    <template #extra>
      <HeadInfo
        v-permission="['admin']"
        class="split-right"
        :title="$t('Initialization Menu')"
      >
        <template #body>
          <div>
            <SyncOutlined
              @click="add"
              class="font-primary icon-menu rotate-icon"
            />
          </div>
        </template>
      </HeadInfo>
      <HeadInfo
        v-permission="['admin']"
        class="split-right"
        :title="$t('Save')"
      >
        <template #body>
          <div>
            <SaveOutlined
              @click="edit"
              class="font-primary icon-menu"
            />
          </div>
        </template>
      </HeadInfo>
    </template>
    <a-row class="row-mg">
      <a-col
        class="col-pd"
        :xl="12"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <MenuTree 
          ref="menuTree" 
          type="admin" 
          :draggable="true" 
          :is-edit="isEdit" 
          @loaded="loaded"
          @updated="updated"
        >
          <template
            #empty
            v-if="!isInit"
          >
            <EmptyResult
              v-if="!isInit"
              class="mt-100"
              :sub-title="$t('Click the [Initialization Menu] button first')"
            />
          </template>
        </MenuTree>
      </a-col>
      <a-col
        class="col-pd"
        :xl="12"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <a-card
          class="nopd"
          :title="$t('Other Settings')"
          :loading="loading"
        >
          <a-descriptions
            bordered
            style="min-height: 650px"
          >
            <a-descriptions-item
              :label="$t('Zone')"
              :span="3"
            >
              <a-switch v-model:checked="routerSettingMenu.showZone">
                <template #checkedChildren>
                  <EyeOutlined />
                </template>
                <template #unCheckedChildren>
                  <EyeInvisibleOutlined />
                </template>
              </a-switch>
            </a-descriptions-item>
            <a-descriptions-item
              :label="$t('Registry Center')"
              :span="3"
            >
              <a-switch v-model:checked="routerSettingMenu.showEnv">
                <template #checkedChildren>
                  <EyeOutlined />
                </template>
                <template #unCheckedChildren>
                  <EyeInvisibleOutlined />
                </template>
              </a-switch>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>
    <PartitionOutlined v-if="false" />
  </PageLayout>
</template>

<script>
import {
  SyncOutlined,
  PartitionOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import MenuTree from "./components/MenuTree";
import EmptyResult from "@/components/tag/EmptyResult";
import { mapGetters } from "vuex";
export default {
  name: "RouterSetting",
  components: {
    HeadInfo,
    MenuTree,
    PageLayout,
    SyncOutlined,
    PartitionOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    SaveOutlined,
    EmptyResult,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      isInit: false,
      PartitionOutlined,
      isEdit: false,
      visible: false,
      hasRouterSettingMenu: false,
      routerSettingMenu: { showEnv: true, showZone: true },
      loading: true,
    };
  },

  computed: {
    ...mapGetters("account", ["user"]),
  },

  mounted() {
    this.loaddata();
  },

  methods: {
    add() {
      this.isEdit = false;
      this.handleOk();
    },

    edit() {
      this.isEdit = true;
      this.handleOk();
    },

    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.$refs['menuTree'].handleOk();
      }, 100);
      this.saveRouterSettingMenu();
    },

    loaded(d){
      this.isInit = !!d.length;
    },

    updated(){
      this.loading = false;
      location.reload();
    },
		
    saveRouterSettingMenu() {
      let content = JSON.parse(JSON.stringify(this.routerSettingMenu));
      if (this.hasRouterSettingMenu) {
        delete content.id;
        this.$gql
          .mutation(
            `updateSystemSetting(id:${this.routerSettingMenu.id}, data: $data){data{id}}`,
            {
              data: { type: "RouterSetting", content },
            },
            { data: "SystemSettingInput!" },
          )
          .then(() => {});
      } else {
        this.$gql
          .mutation(
            `createSystemSetting(data: $data){data{id}}`,
            {
              data: { type: "RouterSetting", content },
            },
            { data: "SystemSettingInput!" },
          )
          .then(() => {});
      }
    },

    loaddata() {
      this.loading = true;
      this.$gql
        .query(
          `systemSettings(filters:{type:{eq:"RouterSetting"}}){data{id,attributes{mode,content}}}`,
        )
        .then((d) => {
          this.loading = false;
          let res = d.data;
          this.hasRouterSettingMenu = res && res.length > 0;
          if (this.hasRouterSettingMenu) {
            this.routerSettingMenu = { ...res[0].content, id: res[0].id };
          } else {
            this.routerSettingMenu = { showEnv: true, showZone: true };
          }
        });
    },
  },
};
</script>