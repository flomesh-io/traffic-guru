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
                v-for="(tag, tagIdx) in record.service"
              >
                {{ tag }}
              </a-tag>
              <a-tag
                :key="tagIdx"
                v-for="(tag, tagIdx) in record.pod"
              >
                {{ tag }}
              </a-tag>
            </template>
          </a-list-item-meta>
          <div class="content" />
          <template #actions>
            <span><NodeIndexOutlined /> {{ record.spancnt }}
              {{ $t("unitci") }}</span>
            <span><FieldTimeOutlined /> {{ record.duration }} ms</span>
            <span><em>{{ new Date(record.start * 1).toLocaleString() }}</em>
              <em> ~ </em>
              <em>{{ new Date(record.end * 1).toLocaleString() }}</em></span>
          </template>
        </a-list-item>
      </a-list>
    </a-card>
  </PageLayout>
</template>

<script>
import _ from "lodash";
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
    getSqlPagging(sql) {
      return `SELECT traceid,cnt,duration,minReqTime,maxResTime,serviceName,podName FROM ( ${sql} ) ORDER BY minReqTime DESC LIMIT ${
        (this.params.pageNo - 1) * this.params.pageSize
      },${this.params.pageSize};`;
    },

    getWhere() {
      let sql = "where 1=1 ";
      if (this.filter && this.filter != "") {
        sql += ` AND (trace.id = '${this.filter}' or service.name = '${this.filter}' or pod.name = '${this.filter}' or pod.ip = '${this.filter}') `;
      }
      if (this.date && this.date != "") {
        sql += " AND reqTime > " + new Date(this.date).getTime();
      }
      if (this.endDate && this.endDate != "") {
        sql += " AND reqTime < " + new Date(this.endDate).getTime();
      }
      return sql;
    },

    getCount(whereSQL) {
      let SQL = `select count(1) as cnt from (select 1 from log ${whereSQL} group by trace.id)`;
      this.$request(this.$REST.CLICKHOUSE.QUERY(SQL), this.$METHOD.GET)
        .then((res) => {
          this.params.total = res.data * 1;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getData(pageNo, pageSize) {
      if (pageNo) {
        this.params.pageNo = pageNo;
        this.params.pageSize = pageSize;
      }
      let whereSQL = this.getWhere();
      this.getCount(whereSQL);
      this.data = [];
      this.loading = true;
      let SQL = this.getSqlPagging(
        `select trace.id as traceid,count() as cnt,(max(resTime) - min(reqTime)) as duration,min(reqTime) as minReqTime,max(resTime) as maxResTime,groupUniqArray(service.name) as serviceName,groupUniqArray(pod.name) as podName from log ${whereSQL} group by trace.id`,
      );
      this.$request(this.$REST.CLICKHOUSE.QUERY(SQL), this.$METHOD.GET)
        .then((res) => {
          this.loading = false;
          let nodes = res.data.split("\n");
          nodes.map((nodeStr) => {
            let node = nodeStr.split("\t");
            let item = {
              traceId: node[0],
              spancnt: node[1],
              duration: node[2],
              start: node[3],
              end: node[4],
              service: _.uniq(eval(node[5])),
              pod: _.uniq(eval(node[6])),
            };
            if (node[0] != "") {
              this.data.push(item);
            }

            return nodeStr;
          });
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
