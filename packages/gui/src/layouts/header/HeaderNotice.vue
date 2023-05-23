<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('Alarm Detail')"
    width="100%"
    wrap-class-name="full-modal"
  >
    <template #footer>
      <a-button @click="last">
        &lt;
      </a-button>
      <a-button
        type="primary"
        :loading="loading"
        @click="next"
      >
        >
      </a-button>
    </template>
    <a-list class="tab-pane">
      <a-list-item>
        <a-list-item-meta>
          <template #title>
            {{ detail.title }}
          </template>
          <template #description>
            {{ detail.moment }}
            <span
              v-if="detail.target"
            >/ {{ detail.target.type || "Service" }} :
              {{ detail.target.name }}
            </span>
          </template>
          <template #avatar>
            <a-badge :count="detail.cnt">
              <ExclamationOutlined
                :style="'background-color: ' + levelColors[detail.level]"
                class="ExclamationOutlined"
              />
            </a-badge>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
    <JsonEditor
      :is-readonly="true"
      :value="log"
      :height="editorHeight + 'px'"
    />
  </a-modal>
  <a-dropdown
    v-model="show"
    placement="bottom"
    :trigger="['click']"
  >
    <template #overlay>
      <a-spin :spinning="false">
        <a-tabs
          @change="changeTab"
          v-model:activeKey="activeKey"
          class="dropdown-tabs"
          :tab-bar-style="{ textAlign: 'center' }"
        >
          <a-tab-pane
            :tab="$t('Notice')"
            key="system"
          >
            <a-list
              class="tab-pane"
              :loading="loading"
            >
              <a-list-item
                v-for="(item, index) in list"
                :key="index"
              >
                <a-list-item-meta
                  :title="item.title"
                  :description="item.moment"
                >
                  <template #avatar>
                    <MailFilled class="MailFilled" />
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
            <a-pagination
              @showSizeChange="search"
              @change="search"
              v-model:current="pageNo"
              v-model:pageSize="pageSize"
              :total="total"
              show-less-items
              class="pagination"
            />
          </a-tab-pane>
          <a-tab-pane
            :tab="$t('Alarm')"
            key="alarm"
            v-if="$isPro"
          >
            <div class="tab-pane-head">
              <a-input-search
                v-model:value="key"
                @search="search()"
                class="full"
                :placeholder="$t('search')"
              />
            </div>
            <a-list
              class="tab-pane"
              :loading="loading"
            >
              <a-list-item
                v-for="(item, index) in list"
                :key="index"
              >
                <a-list-item-meta>
                  <template #title>
                    {{ item.title }}
                  </template>
                  <template #description>
                    {{ item.moment }}
                    <span
                      v-if="item.target"
                    >/ {{ item.target.type || "Service" }} :
                      {{ item.target.name }}
                    </span>
                    <a
                      @click="showModal(item, index)"
                      href="javascript:void(0);"
                      class="float-right"
                    ><EyeOutlined /></a>
                  </template>
                  <template #avatar>
                    <a-badge :count="item.cnt">
                      <ExclamationOutlined
                        :style="'background-color: ' + levelColors[item.level]"
                        class="ExclamationOutlined"
                      />
                    </a-badge>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
            <a-pagination
              @showSizeChange="search"
              @change="search"
              v-model:current="pageNo"
              v-model:pageSize="pageSize"
              :total="total"
              show-less-items
              class="pagination"
            />
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span
      @click="fetchNotice"
      class="header-notice"
    >
      <a-tooltip
        :title="$t('Notice')"
        color="#00adef"
        placement="bottom"
      >
        <a-badge
          class="notice-badge"
          dot
        >
          <AlertOutlined :class="['header-notice-icon']" />
        </a-badge>
      </a-tooltip>
    </span>
  </a-dropdown>
</template>

<script>
import {
  AlertOutlined,
  ExclamationOutlined,
  EyeOutlined,
  MailFilled,
} from "@ant-design/icons-vue";
import JsonEditor from "@/components/editor/JsonEditor";
import moment from "moment";
export default {
  name: "HeaderNotice",
  components: {
    AlertOutlined,
    ExclamationOutlined,
    EyeOutlined,
    JsonEditor,
    MailFilled,
  },

  data() {
    return {
      editorHeight: document.body.clientHeight - 250,
      levelColors: { info: "#00adef", warning: "orange", major: "#fe5d58" },
      list: [],
      key: "",
      activeKey: "system",
      detail: { content: {} },
      pageSize: 5,
      log: "",
      total: 0,
      pageNo: 1,
      visible: false,
      loading: false,
      show: false,
    };
  },

  i18n: require("@/i18n"),
  computed: {
    start(){
      return (this.pageNo - 1) * this.pageSize;
    }
  },

  methods: {
    handleOk() {
      this.visible = false;
    },

    showModal(item, index) {
      this.detail = item;
      this.log = JSON.stringify(this.detail.content);
      this.detail.index = index;
      (this.editorHeight = document.body.clientHeight - 250),
      (this.visible = true);
    },

    next() {
      const index = this.detail.index + 1;
      const item = this.list[index];
      if (item) {
        this.detail = item;
        this.detail.index = index;
        this.log = JSON.stringify(this.detail.content);
      }
    },

    last() {
      const index = this.detail.index - 1;
      const item = this.list[index];
      if (item) {
        this.detail = item;
        this.detail.index = index;
        this.log = JSON.stringify(this.detail.content);
      }
      return false;
    },

    changeTab() {
      this.loading = true;
      this.key = "";
      this.list = [];
      this.total = 0;
      this.pageNo = 1;
      this.search();
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
      }
      let pagination = {
        start: this.start, 
        limit: this.pageSize
      };
      this.loading = true;
      const filters = { 
        title:{contains:this.key} , 
        type: {eq:this.activeKey} ,
      };
      this.$gql
        .query(
          `myMessages(filters: $filters, pagination: $pagination){
						data{
							id,
							attributes{type,level,title,content,read,cnt,updatedAt}
						},
						meta{pagination{total}}
					}`,
          { 
            filters,pagination
          },{
            filters: "MessageFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.list = res.data;
          this.list.forEach((item) => {
            item.moment = moment(new Date(item.updatedAt)).fromNow();
          });
          this.total = res.pagination.total;
          this.loading = false;
        });
    },

    fetchNotice() {
      if (this.loading) {
        this.loading = false;
        return;
      }
      this.search();
    },
  },
};
</script>

<style lang="less">
  .header-notice {
    display: inline-block;
    transition: all 0.3s;
    .notice-badge {
      color: inherit;
      .header-notice-icon {
        font-size: 16px;
        padding: 4px;
      }
    }
  }
  .dropdown-tabs {
    background-color: @base-bg-color;
    box-shadow: 0 2px 8px @shadow-color;
    border-radius: 4px;
    width: 400px;
    padding: 0 20px !important;
    .tab-pane {
      padding: 0px 0 12px 0;
      min-height: 250px;
    }
  }
  .ant-badge-count {
    line-height: 16px;
    height: 16px;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
    padding: 0 6px;
  }
  .full-modal {
    .ant-modal {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }
    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }
    .ant-modal-body {
      flex: 1;
    }
  }
  .dropdown-tabs .ExclamationOutlined {
    color: #fff;
    border-radius: 50%;
    font-size: 30px;
  }
  .tab-pane-head {
    padding: 0 0px 20px 0px;
  }
  .dropdown-tabs .pagination {
    margin: auto auto 15px auto !important;
    text-align: center;
  }
  .dropdown-tabs .MailFilled {
    background-color: #0aacac;
    border-radius: 50%;
    color: #fff;
    width: 36px;
    line-height: 31px;
    padding-top: 4px;
    text-align: center;
    height: 36px;
    font-size: 20px;
  }
</style>
