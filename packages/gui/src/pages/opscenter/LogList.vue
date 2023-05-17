<template>
  <PageLayout :title="$t('log')">
    <template #headerContent>
      <div :class="['search-head', layout, pageWidth]">
        <div class="search-input">
          <div
            class="flex"
            style="width:510px;margin: auto"
          >
            <InputList
              class="flex-item"
              :width="450"
              :d="filter"
              :attrs="newFilter"
              :xl-button="true"
            >
              <template #default="{ item }">
                <a-select
                  :placeholder="$t('Column')"
                  v-model:value="item.col"
                  class="bold font-center width-150"
                >
                  <a-select-option
                    :value="col"
                    v-for="(col, colIdx) in columns"
                    :key="colIdx"
                  >
                    {{
                      col
                    }}
                  </a-select-option>
                </a-select>
                <a-select
                  :placeholder="$t('Operator')"
                  v-model:value="item.opt"
                  class="font-center ml-5"
                >
                  <a-select-option
                    :value="opt"
                    v-for="(opt, optIdx) in opts"
                    :key="optIdx"
                  >
                    {{
                      opt
                    }}
                  </a-select-option>
                </a-select>
                <a-input
                  v-model:value="item.value"
                  :placeholder="$t('Value')"
                  class="bold font-center ml-5 width-120"
                />
              </template>
            </InputList>
            <div>
              <a-divider type="vertical" />
              <a-button
                type="primary"
                @click="getData()"
                shape="circle"
                class="border-round ml-15"
              >
                <SearchOutlined />
              </a-button>
            </div>
          </div>
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
                          v-for="(item, idx) in columns"
                        >
                          <a
                            href="javascript:void(0);"
                            @click="orderBy(item, arrow)"
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
                  record['resStatus'] * 1 >= 200 &&
                    record['resStatus'] * 1 < 600
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
                    ][(record['resStatus'] + '').substr(0, 1) * 1]
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
              <a href="javascript:void(0)">{{ record["reqPath"] || "-" }}</a>
            </template>
            <template #description>
              <a-tag v-if="record['reqProtocol'] != '4LB'">
                Method:{{ record["reqMethod"] || "-" }}
              </a-tag>
              <a-tag v-if="record['reqProtocol'] != '4LB'">
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
                    v-if="record['reqProtocol'] == 'dubbo'"
                  ><a-badge
                    :color="record['resStatus'] * 1 > 20 ? 'red' : 'green'"
                    :text="record['resStatus']"
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
                      ][(record['resStatus'] + '').substr(0, 1)]
                    "
                    :text="record['resStatus'] == 0 ? '-' : record['resStatus']"
                  /></span>
                </div>
                <div v-if="record['serviceName']">
                  <b>Service</b> : <span>{{ record["serviceName"] }}</span>
                </div>
                <div>
                  <b>{{ $t("Headers") }}</b> :
                  <span
                    v-if="record['reqHeaders']"
                    class="relative"
                    style="top: 5px"
                  >
                    <a-tooltip
                      placement="topRight"
                      :key="index2"
                      v-for="(key, index2) in Object.keys(
                        getParse(record['reqHeaders']),
                      )"
                    >
                      <template #title>
                        <span>{{ key }}:{{
                          getParse(record["reqHeaders"])[key]
                        }}</span>
                      </template>
                      <a-tag
                        class="ellipsis"
                      >{{ key }}:{{
                        getParse(record["reqHeaders"])[key]
                      }}</a-tag>
                    </a-tooltip>
                  </span>
                  <span v-else>-</span>
                </div>
              </div>
              <div class="flex-item">
                <div v-if="record['reqProtocol'] != '4LB'">
                  <b>{{ $t("Time Quantum") }}</b> :
                  <em>{{ new Date(record.reqTime * 1).toLocaleString() }}</em>
                  <em> ~ </em>
                  <em>{{ new Date(record.resTime * 1).toLocaleString() }}</em>
                </div>
                <div v-if="record['podName']">
                  <b>Pod</b> : <span>{{ record["podName"] }}</span>
                </div>
                <div>
                  <b>{{ $t("Protocol") }}</b> :
                  <span>{{ record["reqProtocol"] || "-" }}</span>
                </div>
              </div>
            </div>
          </div>
          <template #actions>
            <span><FieldTimeOutlined /> {{ record.createdAt }}</span>
            <span
              v-if="record.remoteAddr"
            >{{ $t("Remote") }} {{ record.remoteAddr }} : {{ record.remotePort }}
            </span>
            <span
              v-if="record.localAddr"
            >{{ $t("Local") }} {{ record.localAddr }} : {{ record.localPort }}
            </span>
          </template>
        </a-list-item>
      </a-list>
    </a-card>
  </PageLayout>
</template>

<script>
import {
  filterColumns,
  getLogList,
  coverMessage
} from "@/services/clickhouseGQL";
import InputList from "@/components/form/InputList";
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
    InputList,
    JsonEditor,
  },

  data() {
    return {
      newFilter: {
        col: null,
        opt: "=",
        value: "",
      },

      opts: ["=", ">", ">=", "<=", "<", "like"],
      date: "",
      endDate: "",
      log: "{}",
      arrow: "desc",
      visible: false,
      columns: filterColumns,
      sortBy: "createdAt",
      prefix: " ",
      filter: [],
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

    getFilter(list){
      let filter = "";
      let total = 0;
      if(list){
        list.forEach((item)=>{
          if(item.value != null && item.value != "" && item.col){
            if(total>0){
              filter += " and "
            }
            let _val = ""
            if(item.opt == 'like'){
              _val = `'%${item.value}%'`;
            } else {
              _val = isNaN(item.value)?`'${item.value}'`:(item.value+'');
            }
            filter += `${item.col} ${item.opt} ${_val}`;
            total++;
          }
        })
      }
      return filter;
    },

    getData(pageNo, pageSize) {
      if (pageNo) {
        this.params.pageNo = pageNo;
        this.params.pageSize = pageSize;
      }
      this.loading = true;
      this.data = [];
      getLogList({
        ...this.params,
        filter: this.getFilter(this.filter),
        sortBy: this.sortBy,
        arrow: this.arrow,
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
    position: relative;
    top: 10px;
    color: #00adef;
  }
</style>
