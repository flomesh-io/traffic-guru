<template>
  <PageLayout :title="$t('log')">
    <template #headerContent>
      <div :class="['search-head', layout, pageWidth]">
        <div class="search-input">
          <a-mentions
            class="a-mentions search-ipt"
            v-model:value="filter"
            rows="3"
            :placeholder="$t('Please input filter')"
            :prefix="[' ']"
            @search="onSearch"
          >
            <a-mentions-option
              v-for="value in WHERE_DATA[prefix] || []"
              :key="value"
              :value="value"
            >
              {{ value }}
            </a-mentions-option>
          </a-mentions>

          <a-button
            type="primary"
            @click="getData()"
            shape="circle"
            class="border-round ml-15"
          >
            <SearchOutlined />
          </a-button>
          <div
            class="div-msg"
            v-html="
              $t(
                `Input <b>SPACE</b> to add filter, <b>AND</b>/<b>OR</b> to concat. eg: feild1 = 'A' or feild2 = 'B'`,
              )
            "
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
              <div class="content flex">
                <div class="flex-item">
                  <a-form-item>
                    <a-date-picker
                      v-model:value="date"
                      show-time
                      format="YYYY-MM-DD HH:mm:ss"
                      :placeholder="$t('Start Date')"
                      @change="getData()"
                    />
                    <em> ~ </em>
                    <a-date-picker
                      v-model:value="endDate"
                      show-time
                      format="YYYY-MM-DD HH:mm:ss"
                      :placeholder="$t('End Date')"
                      @change="getData()"
                    />
                  </a-form-item>
                </div>
                <div class="flex-item font-right">
                  <span class="sortby">{{ $t("Sort By") }} : </span>
                  <a-dropdown>
                    <b
                      class="ant-dropdown-link sortby-value"
                      @click.prevent
                    >
                      {{ sortBy }}
                      <DownOutlined />
                    </b>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item
                          :key="idx"
                          v-for="(item, idx) in select_keys"
                        >
                          <a
                            href="javascript:void(0);"
                            @click="orderBy(item, arrow)"
                            class="uppercase"
                          >{{ item.replace(/\./g, " ") }}</a>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                  <a-dropdown>
                    <b
                      class="ant-dropdown-link sortby-value"
                      @click.prevent
                    >
                      {{ $t(arrow) }}
                      <DownOutlined />
                    </b>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item>
                          <a
                            href="javascript:void(0);"
                            @click="orderBy(sortBy, 'desc')"
                            class="uppercase"
                          >{{ $t("desc") }}</a>
                        </a-menu-item>
                        <a-menu-item>
                          <a
                            href="javascript:void(0);"
                            @click="orderBy(sortBy, 'asc')"
                            class="uppercase"
                          >{{ $t("asc") }}</a>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
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
      <a-drawer
        v-if="visible"
        :get-container="false"
        :title="$t('log')"
        placement="bottom"
        height="600"
        :closable="false"
        :visible="visible"
        @close="onClose"
      >
        <JsonEditor
          :is-readonly="true"
          :value="log"
        />
      </a-drawer>
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
          @click="detail(record.message)"
        >
          <a-list-item-meta>
            <template #avatar>
              <svg
                v-if="
                  record['res.status'] * 1 >= 200 &&
                    record['res.status'] * 1 < 600
                "
                class="icon square-30"
                aria-hidden="true"
              >
                <use
                  :xlink:href="
                    [
                      '#icon-success',
                      '#icon-success',
                      '#icon-success',
                      '#icon-warning',
                      '#icon-error',
                      '#icon-error',
                    ][(record['res.status'] + '').substr(0, 1) * 1]
                  "
                />
              </svg>
              <svg
                v-else
                class="icon square-30"
                aria-hidden="true"
              >
                <use xlink:href="#icon-info" />
              </svg>
            </template>
            <template #title>
              <a href="javascript:void(0)">{{ record["req.path"] || "-" }}</a>
            </template>
            <template #description>
              <a-tag v-if="record['req.protocol'] != '4LB'">
                Method:{{ record["req.method"] || "-" }}
              </a-tag>
              <a-tag v-if="record['req.protocol'] != '4LB'">
                Size:{{ record["resSize"] > 0 ? (record["resSize"] / 1000) : "-" }} kb
              </a-tag>
            </template>
          </a-list-item-meta>
          <div class="content">
            <div class="flex">
              <div class="flex-item">
                <div>
                  <b>{{ $t("Status") }}</b> :
                  <span
                    v-if="record['req.protocol'] == 'dubbo'"
                  ><a-badge
                    :color="record['res.status'] * 1 > 20 ? 'red' : 'green'"
                    :text="record['res.status']"
                  /></span>
                  <span
                    v-else
                  ><a-badge
                    :color="
                      [
                        'processing',
                        'processing',
                        'green',
                        'gold',
                        'red',
                        'red',
                        'red',
                        'red',
                        'red',
                        'red',
                        'red',
                        'red',
                      ][record['res.status'].substr(0, 1)]
                    "
                    :text="record['res.status'] == 0 ? '-' : record['res.status']"
                  /></span>
                </div>
                <div v-if="record['service.name']">
                  <b>Service</b> : <span>{{ record["service.name"] }}</span>
                </div>
                <div>
                  <b>Headers</b> :
                  <span
                    v-if="record['req.headers']"
                    class="relative"
                    style="top: 5px"
                  >
                    <a-tooltip
                      placement="topRight"
                      :key="index2"
                      v-for="(key, index2) in Object.keys(
                        getParse(record['req.headers']),
                      )"
                    >
                      <template #title>
                        <span>{{ key }}:{{
                          getParse(record["req.headers"])[key]
                        }}</span>
                      </template>
                      <a-tag
                        class="ellipsis"
                      >{{ key }}:{{
                        getParse(record["req.headers"])[key]
                      }}</a-tag>
                    </a-tooltip>
                  </span>
                  <span v-else>-</span>
                </div>
              </div>
              <div class="flex-item">
                <div v-if="record['req.protocol'] != '4LB'">
                  <b>{{ $t("Time Quantum") }}</b> :
                  <em>{{ new Date(record.reqTime * 1).toLocaleString() }}</em>
                  <em> ~ </em>
                  <em>{{ new Date(record.resTime * 1).toLocaleString() }}</em>
                </div>
                <div v-if="record['pod.name']">
                  <b>Pod</b> : <span>{{ record["pod.name"] }}</span>
                </div>
                <div>
                  <b>{{ $t("Protocol") }}</b> :
                  <span>{{ record["req.protocol"] || "-" }}</span>
                </div>
              </div>
            </div>
          </div>
          <template #actions>
            <span><FieldTimeOutlined /> {{ record.timestamp }}</span>
            <span
              v-if="record.remoteAddr"
            >Remote {{ record.remoteAddr }} : {{ record.remotePort }}
            </span>
            <span
              v-if="record.localAddr"
            >Local {{ record.localAddr }} : {{ record.localPort }}
            </span>
          </template>
        </a-list-item>
      </a-list>
    </a-card>
  </PageLayout>
</template>

<script>
import { spread } from "@/utils/request";
import {
  select_keys,
  getPagingData,
  coverMessage,
  coverList,
} from "@/services/clickhouse";
const WHERE_DATA = {
  " ": select_keys,
  AND: select_keys,
  OR: select_keys,
  and: select_keys,
  or: select_keys,
  "=": ["http", "tcp", "GET", "POST", "PUT", "DELETE"],
};
import JsonEditor from "@/components/editor/JsonEditor";
import {
  DownOutlined,
  FieldTimeOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { mapState } from "vuex";
import PageLayout from "@/layouts/PageLayout";
export default {
  name: "LogList",
  i18n: require("@/i18n"),

  components: {
    DownOutlined,
    PageLayout,
    FieldTimeOutlined,
    SearchOutlined,
    JsonEditor,
  },

  data() {
    return {
      date: "",
      log: "{}",
      arrow: "desc",
      visible: false,
      select_keys,
      WHERE_DATA,
      endDate: "",
      sortBy: "timestamp",
      prefix: " ",
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
    getParse(jsonString) {
      return JSON.parse(jsonString.replace(/\\\\"/g, `'`));
    },

    getData(pageNo, pageSize) {
      if (pageNo) {
        this.params.pageNo = pageNo;
        this.params.pageSize = pageSize;
      }
      this.loading = true;
      this.data = [];
      getPagingData(
        this.params.pageNo,
        this.params.pageSize,
        this.filter,
        this.sortBy,
        this.arrow,
        this.date,
        this.endDate,
      )
        .then(
          spread((cnt, res) => {
            this.loading = false;
            this.params.total = cnt.data * 1;
            this.data = coverList(res);
          }),
        )
        .catch((err) => {
          console.log(err);
        });
    },

    detail(message) {
      this.visible = true;
      this.log = coverMessage({ data: message });
    },

    onSearch(_, prefix) {
      console.log(_, prefix);
      this.prefix = prefix;
    },

    orderBy(key, arrow) {
      this.sortBy = key.replace(/\./g, "_");
      this.arrow = arrow;
      this.getData();
    },

    onClose() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
  :deep(.page-header) {
    padding-bottom: 0;
  }
  .a-mentions {
    width: 522px;
    text-align: left;
    border-radius: 4px;
  }
  .div-msg {
    font-size: 10pt;
    margin-top: 5px;
    color: #999;
  }
  .search-input {
    border-bottom: 1px dashed #ddd;
  }
  .sortby {
    position: relative;
    top: 10px;
  }
  .sortby-value {
    text-transform: uppercase;
    position: relative;
    top: 10px;
    color: #00adef;
  }
</style>
