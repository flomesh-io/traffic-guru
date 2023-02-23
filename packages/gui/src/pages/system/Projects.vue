<template>
  <PageLayout :avatar="ProjectOutlined">
    <template #headerContent>
      <div />
    </template>
    <template #extra>
      <HeadInfo
        v-permission="['project:create']"
        class="split-right"
        :title="$t('Create project')"
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
    <CardList
      :hide-action-title="true"
      :loading="loading"
      :data-source="projects"
      type="component"
      :actions="[
        {
          icon: 'EditOutlined',
          text: $t('edit'),
          call: setting,
          permissionWhere: [
            'project:update:organization:',
            'organization',
            'project:update',
          ],
        },
        {
          icon: 'CloseOutlined',
          hide: true,
          text: $t('delete'),
          call: remove,
          permissionWhere: [
            'project:delete:organization:',
            'organization',
            'project:delete',
          ],
        },
      ]"
    >
      <template #default="{ item }">
        <a-card-meta>
          <template #title>
            <div class="capitalize">
              {{ item.name }}
            </div>
          </template>
          <template #avatar>
            <FolderTwoTone
              two-tone-color="#00adef"
              class="font-50"
            />
          </template>
          <template #description>
            {{ $t("Organization") }} :
            {{ item.organization ? item.organization.name : "-" }} <br>
            {{ $t("User") }} : {{ item.users ? item.users.length : "0" }}
            <UserOutlined class="font-14 font-primary" />
          </template>
        </a-card-meta>
      </template>
    </CardList>
    <a-pagination
      @change="search"
      v-model:current="pageNo"
      :total="total"
      :page-size="pageSize"
      show-less-items
    />
    <ProjectOutlined v-if="false" />
  </PageLayout>
</template>

<script>
import {
  FolderTwoTone,
  PlusCircleTwoTone,
  ProjectOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import CardList from "@/components/card/CardList";
import { Empty } from "ant-design-vue";
export default {
  name: "Projects",
  components: {
    HeadInfo,
    PageLayout,
    CardList,
    PlusCircleTwoTone,
    FolderTwoTone,
    ProjectOutlined,
    UserOutlined,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      ProjectOutlined,
      isEdit: false,
      payload: {
        id: "",
        name: "",
        organization: { id: null },
      },

      bindTarget: {},
      editorIsCreate: true,
      workload: [],
      projects: [],
      pageSize: 12,
      pageNo: 1,
      total: 0,
      loading: true,
      activities: [],
      config: {},
      teams: [],
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },

  computed: {
    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  created() {
    this.loaddata();
  },

  activated() {},

  methods: {
    add() {
      this.$router.push({
        path: "/system/projects/create",
      });
    },

    getSample() {
      this.custom = this.customSample;
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

    setting(index, type, item) {
      this.$router.push({
        path: "/system/projects/detail/" + item.id,
      });
    },

    edit() {},

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
          `projects(pagination:{start: ${this.start}, limit: ${this.pageSize}}){
						data{id,attributes{
							name,
							organization{data{id,attributes{name}}},
							users{data{id,attributes{username}}},
							content
						}},
						meta{pagination{total}}
					}`
        )
        .then((res) => {
          this.projects = res.data;
          this.total = res.pagination.total;
          this.loading = false;
        });
      this.$gql.query(`organizations{data{id,attributes{name}}}`).then((res) => {
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
