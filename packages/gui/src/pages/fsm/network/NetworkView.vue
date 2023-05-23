<template>
  <PageLayout :title="$t('Waterfall')">
    <template #headerContent>
      <div :class="['search-head', layout, pageWidth]">
        <div class="search-input">
          <a-input-search
            class="search-ipt"
            v-model:value="filter"
            @search="getData()"
            :loading="loading"
            :placeholder="
              $t('Please input') + ':' + $t('Trace / Service / Pod')
            "
            size="large"
          />
        </div>
        <a-card
          :bordered="false"
          class="search-form"
        >
          <a-form>
            <div class="form-row">
              <div class="label">
                <span>{{ $t("Time screening") }}</span>
              </div>
              <div class="content">
                <a-date-picker
                  v-model:value="date"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="$t('Start Date')"
                  @change="getData()"
                />
                <em class="em"> ~ </em>
                <a-date-picker
                  v-model:value="endDate"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="$t('End Date')"
                  @change="getData()"
                />
              </div>
            </div>
          </a-form>
        </a-card>
      </div>
    </template>
    <a-card
      class="search-content"
      :loading="loading"
    >
      <a-list
        item-layout="vertical"
        :pagination="{
          showSizeChanger: false,
          showQuickJumper: false,
          onShowSizeChange: getData,
          onChange: getData,
          current: params.pageNo,
          pageSize: params.pageSize,
          showTotal: (total, range) => `${$t('Total')} ${total}`,
          total: params.total,
        }"
      >
        <a-list-item
          :key="index"
          v-for="(record, index) in data"
        >
          <a-list-item-meta>
            <template #title>
              Trace&nbsp;:&nbsp;
              <a-typography-paragraph
                class="search-content-meta"
                :copyable="{ tooltips: false }"
              >
                <a
                  href="javascript:void(0)"
                  @click="detail(record.traceId)"
                >{{
                  record.traceId
                }}</a>
              </a-typography-paragraph>
            </template>
            <template #description>
              <a-tag
                :key="tagIdx"
                v-for="(tag, tagIdx) in record.serviceName"
              >
                {{ tag }}
              </a-tag>
              <a-tag
                :key="tagIdx"
                v-for="(tag, tagIdx) in record.podName"
              >
                {{ tag }}
              </a-tag>
            </template>
          </a-list-item-meta>
          <div class="content" />
          <template #actions>
            <span><NodeIndexOutlined /> {{ record.spanCount }}
              {{ $t("unitci") }}</span>
            <span><FieldTimeOutlined /> {{ record.duration }} ms</span>
            <span><em>{{ new Date(record.minReqTime * 1).toLocaleString() }}</em>
              <em> ~ </em>
              <em>{{ new Date(record.maxResTime * 1).toLocaleString() }}</em></span>
          </template>
        </a-list-item>
      </a-list>
    </a-card>
  </PageLayout>
</template>

<script>
import {
  getTraceList,
} from "@/services/clickhouseGQL";
import {
  FieldTimeOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons-vue";
import { mapState } from "vuex";
import PageLayout from "@/layouts/PageLayout";
export default {
  name: "NetworkView",
  i18n: require("@/i18n"),

  components: {
    PageLayout,
    NodeIndexOutlined,
    FieldTimeOutlined,
  },

  data() {
    return {
      date: "",
      endDate: "",
      filter: "",
      loading: true,
      params: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },

      data: [],
    };
  },

  computed: {
    ...mapState("setting", ["layout", "pageWidth"]),
  },

  created() {
    this.getData();
  },

  methods: {
    getData(pageNo, pageSize) {
      if (pageNo) {
        this.params.pageNo = pageNo;
        this.params.pageSize = pageSize;
      }
      this.loading = true;
      this.data = [];
      getTraceList({
        ...this.params,
        filter: this.filter,
        date: this.date,
        endDate: this.endDate
      })
        .then((res) => {
          this.loading = false;
          this.params.total = res.total;
          this.data = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    detail(id) {
      this.$router.push({ path: "/fsm/waterfall/detail/" + id });
    },
  },
};
</script>

<style lang="less" scoped>
  :deep(.page-header) {
    padding-bottom: 0;
  }
  .search-content-meta {
    display: inline-block;
    margin-bottom: 0;
  }
</style>
