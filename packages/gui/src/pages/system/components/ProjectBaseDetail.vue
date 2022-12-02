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
          :rules="rules.name"
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
          :rules="rules.organization"
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
  </PageLayout>
</template>

<script>
import {
  FolderTwoTone,
} from "@ant-design/icons-vue";
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
import PageLayout from "@/layouts/PageLayout";
import _ from "lodash";
import { Empty } from "ant-design-vue";
export default {
  name: "ProjectBaseDetail",
  components: {
    DetailListItem,
    DetailList,
    PageLayout,
    FolderTwoTone,
  },

  i18n: require("@/i18n"),
  props: ["pid"],
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: "Name is required",
            whitespace: true,
            trigger: "blur",
          },
        ],

        organization: [
          {
            required: true,
            message: "Organization is required",
            whitespace: true,
            trigger: "blur",
          },
        ],
      },

      activeKey: "1",
      FolderTwoTone,
      orgs: [],
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
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },

  computed: {},
  created() {
    if (this.pid != "") {
      this.isEdit = true;
      this.loaddata();
    } else {
      this.loading = false;
      this.detail = {
        users: [],
        id: "",
        name: "",
        organization: null,
      };
      this.$gql.query(`myOrganizations{id,name}`).then((res) => {
        this.orgs = res;
      });
      this.$emit("getDetail", { detail: this.detail, loading: this.loading });
    }
  },

  activated() {},

  methods: {
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
            `updateProject(input: $input){project{id}}`,
            {
              input: { where: { id: whereID }, data: savedata },
            },
            {
              input: "updateProjectInput",
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
            `createProject(input: $input){project{id}}`,
            {
              input: { data: savedata },
            },
            {
              input: "createProjectInput",
            },
          )
          .then((res) => {
            this.$message.success(this.$t("Created successfully"), 3);
            this.$emit("update:pid", res.project.id);
            this.isEdit = true;
            setTimeout(()=>{
              this.loaddata();
            },1000);
          });
      }
    },

    remove(index, type, item) {
      this.$gql
        .mutation(`deleteProject(input:{where:{id:${item.id}}}){project{id}}`)
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
          `project(id: ${this.pid}){id,name,organization{id,name},users{id,username,phone,email,type},content}`,
        )
        .then((res) => {
          this.detail = res;
          this.detail.organization = res.organization
            ? res.organization.id
              ? res.organization.id
              : res.organization
            : null;
          this.loading = false;
          this.$emit("getDetail", {
            detail: this.detail,
            loading: this.loading,
          });
        });
      this.$gql.query(`myOrganizations{id,name}`).then((res) => {
        this.orgs = res;
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
