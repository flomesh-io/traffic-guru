<template>
  <PageLayout
    :hide-head="inSetting"
    :title="$t('Sidecar')"
  >
    <template
      v-if="!hideSearch"
      #headerContent
    >
      <HeadInfo
        :title="$t('Create a side car')"
        class="HeadInfo"
      >
        <template #body>
          <div>
            <PlusCircleTwoTone
              @click="newProfile"
              class="font-primary rotate-icon"
            />
          </div>
        </template>
      </HeadInfo>
      <div :class="['search-head', layout, pageWidth]">
        <div class="search-input">
          <a-input-search
            class="search-ipt"
            v-model:value="key"
            @search="search()"
            :loading="loading"
            :placeholder="$t('Please input filter')"
            size="large"
          />
        </div>
      </div>
    </template>
    <a-card
      :bordered="false"
      :title="inSetting ? $t('Bind Sidecar') : ''"
      :loading="loading"
      class="search-content"
    >
      <a-list
        :pagination="{
          showSizeChanger: false,
          showQuickJumper: false,
          onShowSizeChange: search,
          onChange: search,
          current: pageNo,
          pageSize: pageSize,
          showTotal: (total, range) => `${$t('Total')} ${total}`,
          total: total,
        }"
        item-layout="vertical"
      >
        <a-list-item
          :key="i"
          v-for="(item, i) in profiles"
        >
          <a-list-item-meta>
            <template #title>
              <a-dropdown v-if="!inSetting && !list">
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a @click="detail(item.id, item.namespace)">{{
                        $t("edit")
                      }}</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm
                        placement="topLeft"
                        :ok-text="$t('Yes')"
                        :cancel-text="$t('No')"
                        @confirm="remove(item.id, item.namespace)"
                      >
                        <template #title>
                          <p>{{ $t("Tip") }}</p>
                          <p>{{ $t("Are you sure to delete this?") }}</p>
                        </template>
                        <a>{{ $t("delete") }}</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
                <a class="profile-a"><MoreOutlined /></a>
              </a-dropdown>
              <a
                href="javascript:void(0)"
                @click="detail(item.id, item.namespace)"
              >{{ item.name }}</a>
            </template>
            <template #description>
              <span>{{ $t("Labels") }} : </span>
              <a-tag
                :key="index"
                v-for="(labelkey, index) in Object.keys(item.labels)"
                :closable="false"
              >
                {{ labelkey }}:{{ item.labels[labelkey] }}
              </a-tag>
            </template>
          </a-list-item-meta>
          <div class="content">
            <div class="list-content-item">
              <span class="gray">{{ $t("config") }} : </span>
              <span v-if="!item.annotations">-</span>
              <span>
                <a-tag
                  :key="index"
                  v-for="(annotationkey, index) in Object.keys(item.annotations || [])"
                  :closable="false"
                  class="mb-5"
                >
                  <span v-if="key == 'objectset.rio.cattle.io/applied'">
                    <a-tooltip
                      placement="topLeft"
                      :title="item.annotations[annotationkey]"
                    >
                      <a
                        class="tooltip"
                        href="javascript:void(0)"
                      >{{ annotationkey }}</a>
                    </a-tooltip>
                  </span>
                  <span
                    v-else-if="
                      annotationkey == 'kubectl.kubernetes.io/last-applied-configuration'
                    "
                  >
                    <a-popover
                      trigger="click"
                      :title="annotationkey"
                    >
                      <template #content>
                        <Json2YamlCard
                          :is-create="false"
                          :is-pop="true"
                          :is-readonly="true"
                          v-if="item.annotations[annotationkey]"
                          :json-val="item.annotations[annotationkey]"
                        />
                      </template>
                      <a
                        class="tooltip"
                        href="javascript:void(0)"
                      >{{ annotationkey }}</a>
                    </a-popover>
                  </span>
                  <span v-else>{{ annotationkey }}:{{ item.annotations[annotationkey] }}</span>
                </a-tag>
              </span>
            </div>
          </div>

          <template #actions>
            <span v-if="item.namespace">
              {{ $t("Namespace") }} : {{ item.namespace }}
            </span>
            <span>
              {{
                item.creationTimestamp
                  ? new Date(item.creationTimestamp).toLocaleString()
                  : new Date().toLocaleString()
              }}
            </span>
          </template>
        </a-list-item>
      </a-list>
    </a-card>
  </PageLayout>
</template>

<script>
import Json2YamlCard from "@/components/card/Json2YamlCard";
import HeadInfo from "@/components/tool/HeadInfo";
import {
  MoreOutlined,
  PlusCircleTwoTone,
} from "@ant-design/icons-vue";
import { mapState } from "vuex";
import PageLayout from "@/layouts/PageLayout";
export default {
  name: "SidecarList",
  i18n: require("@/i18n"),
  components: {
    PageLayout,
    MoreOutlined,
    Json2YamlCard,
    HeadInfo,
    PlusCircleTwoTone,
  },

  props: ["url", "hideSearch", "list", "inSetting"],
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      key: "",
      loading: true,
      profiles: [],
    };
  },

  computed: {
    ...mapState("setting", ["layout", "pageWidth"]),
    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  created() {
    if (this.list) {
      this.profiles = this.reset(this.list);
      this.total = this.list.length;
      this.loading = false;
    } else if (this.url) {
      this.search();
    }
  },

  methods: {
    remove(id) {
      this.$gql.mutation(`deleteProxyProfile(id: ${id})`).then(() => {
        this.$message.success(this.$t("Deleted successfully"), 3);
        this.search();
      });
    },

    detail(id, namespace) {
      this.$router.push({
        path: `/fsm/sidecar/detail/${namespace}/${id}`,
      });
    },

    bind(id, namespace) {
      this.loading = true;
      this.$emit("bind", { id, namespace, callback: this.search });
    },

    unbind(id) {
      this.loading = true;
      this.$emit("unbind", { id, namespace, callback: this.search });
    },

    newProfile() {
      this.$router.push({
        path: "/fsm/sidecar/create",
      });
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      this.loading = true;
      this.$gql
        .query(`getProxyProfiles(search: ${this.key}, start: ${this.start}, limit: ${this.pageSize}){data{id,content},total}`)
        .then((res) => {
          this.profiles = this.reset(res.data);
          this.total = res.total;
          this.loading = false;
        });
    },

    reset(list) {
      let rtn = [];
      for (let i = 0; i < list.length; i++) {
        let _content = list[i].content;
        if (_content) {
          list[i].name = _content.metadata.name;
          list[i].creationTimestamp = _content.metadata.creationTimestamp;
          list[i].uid = _content.metadata.uid;
          list[i].namespace =
            _content.spec && _content.spec.namespace
              ? _content.spec.namespace
              : _content.metadata.namespace;
          list[i].annotations = _content.metadata.annotations;
          list[i].labels = _content.spec.selector.matchLabels;
          rtn.push(list[i]);
        }
      }
      return rtn;
    },
  },
};
</script>

<style lang="less" scoped>
  :deep(.page-header) {
    padding-bottom: 0;
  }
  .profile-a {
    color: #00adef;
    position: relative;
    top: 3px;
  }
  .HeadInfo {
    position: absolute;
    right: 0px;
  }
  .tooltip {
    color: #28c7fc;
  }
</style>
