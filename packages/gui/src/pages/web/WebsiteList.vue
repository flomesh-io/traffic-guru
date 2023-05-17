<template>
  <a-card
    :title="$t('Website')"
    class="search-content"
    :loading="loading"
  >
    <template #extra>
      <div>
        <a-button
          type="link"
          shape="circle"
          @click="add"
        >
          <template #icon>
            <PlusCircleTwoTone class="font-20 icon-menu-sm rotate-icon" />
          </template>
        </a-button>
      </div>
    </template>
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
    >
      <a-list-item
        :key="index"
        v-for="(record, index) in websites"
      >
        <a-list-item-meta>
          <template #avatar>
            <div class="font-right">
              <div>
                <IeOutlined
                  v-if="!record.downloading"
                  class="font-22 primary"
                />
                <LoadingOutlined
                  v-else
                  class="font-20 primary"
                />
              </div>
            </div>
          </template>
          <template #title>
            <a-tag
              :color="record.tlsEnabled ? '#23B899' : '#00adef'"
            >
              {{ record.tlsEnabled?'HTTPS':'HTTP' }}
            </a-tag>
            <a
              href="javascript:void(0)"
              @click="detail(record.id)"
            >{{
              record.domain
            }}</a>
          </template>
          <template #description>
            <a-tag
              v-for="(provider,prdindex) in record.providers"
              :key="prdindex"
            >
              {{ provider.path }}
              =>
              <span
                v-for="(host,hstindex) in provider.hosts"
                :key="hstindex"
              >{{ hstindex>0?',':'' }}{{ host }}</span>
            </a-tag>
          </template>
        </a-list-item-meta>
        <div class="content">
          <div class="flex">
            <div class="flex-item">
              <div>
                <b>{{ $t('Port') }}</b> :
                <span>{{ record.port }}</span>
              </div>
            </div>
          </div>
          <WebsiteDownload
            :pid="record.id"
            v-model:downloading="record.downloading"
            v-model:visible="record.visible"
          />
        </div>
        <template #actions>
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a
                    v-if="record.resource && record.resource.length>0"
                    @click="download(record)"
                  >{{ $t("Download") }}</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="detail(record.id)">{{ $t("detail") }}</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="edit(record.id)">{{ $t("edit") }}</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    placement="topLeft"
                    :ok-text="$t('Yes')"
                    :cancel-text="$t('No')"
                    @confirm="remove(record.id)"
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
            <a><MoreOutlined /></a>
          </a-dropdown>
        </template>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
import {
  IeOutlined,
  LoadingOutlined,
  MoreOutlined,
  PlusCircleTwoTone,
} from "@ant-design/icons-vue";
import { mapState } from "vuex";
import WebsiteDownload from "./WebsiteDownload";
export default {
  name: "WebsiteList",
  i18n: require("@/i18n"),

  components: {
    IeOutlined,
    LoadingOutlined,
    MoreOutlined,
    PlusCircleTwoTone,
    WebsiteDownload,
  },

  data() {
    return {
      visible: false,
      prefix: " ",
      key: "",
      loading: true,
      pageNo: 1,
      pageSize: 10,
      total: 0,

      websites: [],
    };
  },

  computed: {
    ...mapState("setting", ["layout", "pageWidth"]),
    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  created() {
    this.search();
  },

  methods: {
    remove(id) {
      this.$gql
        .mutation(`deleteWebsite(id:${id}){data{id}}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    search(pageNo) {
      if (pageNo) {
        this.pageNo = pageNo;
      } else {
        this.pageNo = 1;
      }
      this.loading = true;
      let filters = {
        // name: { contains: this.key }
      };
      this.$gql
        .query(
          `websites(filters: $filters, pagination:{ start: ${this.start}, limit: ${this.pageSize}}){
						data{id,attributes{
							domain,
							port,
							mimeType,
							tlsEnabled,
							tlsPort,
							providers,
							certificate{data{id}},
							resource{data{id,attributes{url}}},
							createdAt
						}},
						meta{pagination{total}}
					}`,
          { 
            filters
          },{
            filters: "WebsiteFiltersInput",
          }
        )
        .then((res) => {
          this.websites = res.data;
          this.total = res.pagination.total;
          this.loading = false;
        });
    },

    add() {
      this.$router.push({
        path: "/web/website/create",
      });
    },

    detail(id) {
      this.$router.push({
        path: "/web/website/detail/" + id,
      });
    },

    download(item){
      item.visible = true;
      item.downloading = true;
    },

    edit(id) {
      this.$router.push({
        path: "/web/website/edit/" + id,
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
