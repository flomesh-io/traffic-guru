<template>
  <div
    v-show="logLevelVal"
    class="mb-10"
  >
    <span class="log-filter-title">{{ $t("Log Record Level") }}:</span>
    <a-radio-group
      @change="emitSave"
      v-model:value="logLevelVal"
    >
      <a-radio
        v-for="(level, index) in logLevels"
        :key="index"
        :value="level"
      >
        {{
          $t(level)
        }}
      </a-radio>
    </a-radio-group>
  </div>
  <a-row class="row-mg">
    <a-col
      class="col-pd"
      :xl="hideChart ? 24 : 16"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24"
    >
      <a-card
        class="search-content"
        :loading="loading"
      >
        <template #title>
          <div class="flex">
            <div class="pl-30">
              <FieldTimeOutlined class="FieldTimeOutlined" />
            </div>
            <div class="flex-item2 pr-20">
              <a-slider
                range
                class="slider-dot"
                @change="onDateChange"
                :tooltip-visible="false"
                :marks="datamarks"
                :step="null"
                :default-value="dateVal"
              />
            </div>
            <div
              v-if="!noSearch"
              class="flex-item search-warpper"
            >
              <div class="inline-block">
                <a-input-search
                  v-model:value="key"
                  @search="onSearch"
                  class="right-search-input"
                  :placeholder="$t('search')"
                />
              </div>
              <a-divider
                type="vertical"
                v-if="type == 'api'"
              />
              <div
                class="inline-block"
                v-if="type == 'api'"
              >
                <a-dropdown>
                  <b
                    class="ant-dropdown-link font-primary uppercase"
                    @click.prevent
                  >
                    {{ (pipy && pipy.name) || $t("Pipy") }}
                    <DownOutlined />
                  </b>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <a
                          href="javascript:void(0);"
                          @click="setPipy(null)"
                          class="uppercase"
                        >{{ $t("All") }}</a>
                      </a-menu-item>
                      <a-menu-item
                        v-for="(item, pipyIndex) in pipys"
                        :key="pipyIndex"
                      >
                        <a
                          href="javascript:void(0);"
                          @click="setPipy(item)"
                          class="uppercase"
                        >{{ item.name }}</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
          </div>
        </template>
        <div class="flex">
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
          <div class="flex-item pd-x-15">
            <a-checkbox-group
              @change="changeSelected"
              v-model:value="selectedVal"
              style="width: 100%"
            >
              <a-list
                item-layout="vertical"
                :pagination="{
                  showSizeChanger: false,
                  showQuickJumper: false,
                  onShowSizeChange: getData,
                  onChange: getData,
                  current: pagging.pageNo,
                  pageSize: pageSize || 10,
                  showTotal: (total, range) => `${$t('Total')} ${total}`,
                  total: pagging.total,
                }"
              >
                <a-list-item
                  :key="record"
                  v-for="(record, index) in data"
                >
                  <a-list-item-meta class="log-viewer-list-meta">
                    <template #avatar>
                      <svg
                        v-if="
                          record['res.status'] * 1 >= 200 &&
                            record['res.status'] * 1 < 600
                        "
                        class="icon"
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
                        class="icon"
                        aria-hidden="true"
                      >
                        <use xlink:href="#icon-info" />
                      </svg>
                    </template>
                    <template #title>
                      <a
                        href="javascript:void(0)"
                        class="mr-16 pointer"
                        @click="detail(record.message)"
                      >{{ record["req.path"] || record["pod.name"] }}</a>
                      <a-tag
                        :color="
                          record['req.method'] == 'GET' ? 'green' : 'blue'
                        "
                        v-if="record['req.method']"
                      >
                        {{ record["req.method"] }}
                      </a-tag>
                    </template>
                    <template #description />
                  </a-list-item-meta>
                  <template #actions>
                    <span v-if="record['res.status'] > 0">Status {{ record["res.status"] }}</span>
                    <span><FieldTimeOutlined /> {{ record.timestamp }}</span>
                    <span
                      v-if="record.remoteAddr"
                    >Remote {{ record.remoteAddr }} : {{ record.remotePort }}
                    </span>
                    <span
                      v-if="record.localAddr"
                    >Local {{ record.localAddr }} : {{ record.localPort }}
                    </span>
                    <span
                      v-if="record['resSize'] && record['resSize'] > 0"
                    >Size:{{ record["resSize"] / 1000 }} kb 
                    </span>
                  </template>
                  <template #extra>
                    <a-checkbox
                      v-if="selected != null"
                      :value="index"
                    />
                  </template>
                </a-list-item>
              </a-list>
            </a-checkbox-group>
          </div>
        </div>
      </a-card>
    </a-col>
    <a-col
      class="col-pd"
      :xl="8"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24"
      v-if="!hideChart"
    >
      <a-card
        class="card mb-15 nopd"
        :loading="loading"
        :title="$t('Load Status')"
      >
        <MiniSector
          :colors="statusColors"
          :dv="status"
          :height="200"
          :padding="[0, 0, 0, 0]"
        />
      </a-card>
      <a-card
        class="card mb-15 nopd"
        :loading="loading"
        :title="$t('tps')"
      >
        <MiniArea
          :id="type"
          :colors="['#8be4c1']"
          :dv="tps"
          :height="200"
          :padding="[0, 0, 0, 0]"
          :axis="false"
          unit=""
          :showy="false"
        />
      </a-card>
      <a-card
        class="card nopd"
        :loading="loading"
        :title="$t('Latency')"
      >
        <MiniBar
          :colors="['#8be4c1']"
          :id="type"
          :dv="latency"
          :height="200"
          :padding="[0, 0, 0, 0]"
          :showy="false"
          :axis="false"
        />
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import MiniBar from "@/components/chart/MiniBar";
import MiniArea from "@/components/chart/MiniArea";
import MiniSector from "@/components/chart/MiniSector";
import { spread } from "@/utils/request";
import {
  getTPSByWhere,
  getLatencyByWhere,
  getLoadStatusByWhere,
  coverArray,
} from "@/services/clickhouse";
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
  FieldTimeOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import { mapState } from "vuex";
import { format } from "date-fns";
import { getServiceWhere } from "@/services/clickhouse";
export default {
  name: "LogViewer",
  i18n: require("@/i18n"),

  components: {
    DownOutlined,
    FieldTimeOutlined,
    JsonEditor,
    MiniArea,
    MiniBar,
    MiniSector,
  },
	
  props: [
    "type",
    "uid",
    "noSearch",
    "params",
    "logLevel",
    "selected",
    "hideChart",
    "pageSize",
  ],

  data() {
    return {
      pipy: null,
      logLevels: ["None", "Main", "All"],
      logLevelVal:null,
      selectedVal:null,
      pipys: [],
      dateVal: [0, 100],
      sqlDateMap: {
        0: "1 month",
        10: "15 day",
        20: "7 day",
        30: "3 day",
        40: "1 day",
        50: "12 hour",
        60: "6 hour",
        70: "1 hour",
        80: "30 minute",
        90: "5 minute",
        100: "1 second",
      },

      marks: {},
      name: "",
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
      tps: [],
      latency: [],
      status: [],
      statusColors: [],
      tpsCnt: 0,
      pagging: {
        pageNo: 1,
        total: 0,
      },

      data: [],
      key: [],
    };
  },

  computed: {
    ...mapState("setting", ["layout", "pageWidth"]),
    datamarks() {
      this.marks = {
        0: "1" + this.$t(" Mths"),
        10: "15" + this.$t(" D"),
        20: "7" + this.$t(" D"),
        30: "3" + this.$t(" D"),
        40: "1" + this.$t(" D"),
        50: "12" + this.$t(" H"),
        60: "6" + this.$t(" H"),
        70: "1" + this.$t(" H"),
        80: "30" + this.$t(" M"),
        90: "5" + this.$t(" M"),
        100: this.$t(" At present"),
      };
      return this.marks;
    },
  },

  watch: {
    logLevelVal: {
      deep: true,
      handler() {
        this.$emit("update:logLevel", this.logLevelVal);
      },
    },
  },

  created() {
    this.logLevelVal = this.logLevel;
    this.selectedVal = this.selected;
    this.getData();
  },

  methods: {
    changeSelected(e) {
      this.$emit("update:selected", e);
      let rtnData = [];
      e.forEach((idx) => {
        rtnData.push(this.data[idx]);
      });
      this.$emit("changeSelected", rtnData);
    },

    emitSave(value) {
      this.$emit("save", { logLevel: value.target.value });
    },

    onDateChange(value) {
      this.dateVal = value;
      this.getData();
    },

    setPipy(pipy) {
      this.pipy = pipy;
      this.getData();
    },

    getWhere() {
      let filters = [];
      if (this.uid) {
        switch (this.type) {
        case "4lb":
          filters.push(`x_parameters.a4lbid ='${this.uid}'`);
          break;
        case "7lb":
          filters.push(`x_parameters.7lbid ='${this.uid}'`);
          break;
        case "api":
          filters.push(`x_parameters.aid ='${this.uid}'`);
          break;
        case "mesh":
          filters.push(`meshName ='${this.params.name}'`);
          break;
        case "service":
          filters.push(
            getServiceWhere(
              null,
              this.params.name,
              this.params.namespace,
              this.params.domain,
            ),
          );
          break;
        case "app":
          filters.push(`x_parameters.appid ='${this.uid}'`);
          break;
        default:
          break;
        }
      }
      if (this.pipy) {
        filters.push(`x_parameters.igid = '${this.pipy.id}'`);
      }
      if (this.key) {
        filters.push(`message like '%${this.key}%'`);
      }
      return filters.join(" AND ");
    },

    getData(pageNo) {
      if (pageNo) {
        this.pagging.pageNo = pageNo;
        // this.pagging.pageSize = pageSize;
      }
      this.loading = true;
      this.data = [];
      this.filter = this.getWhere();
      getPagingData(
        this.pagging.pageNo,
        this.pageSize || 10,
        this.filter,
        this.sortBy,
        this.arrow,
        null,
        null,
        this.sqlDateMap[this.dateVal[0]],
        this.sqlDateMap[this.dateVal[1]],
        this.type,
        this.uid,
      )
        .then(
          spread((cnt, res) => {
            this.loading = false;
            this.pagging.total = cnt.data * 1;
            this.data = coverList(res);
            this.logLevelVal = this.logLevel;
            this.selectedVal = this.selected;
          }),
        )
        .catch((err) => {
          console.log(err);
        });

      this.$gql.query(`fleets(where:{type:"pipy"}){id,name}`).then((res) => {
        this.pipys = res;
      });
      if (!this.hideChart) {
        getLatencyByWhere(
          this.pagging.pageNo,
          this.pageSize || 10,
          this.filter,
          this.sortBy,
          this.arrow,
          null,
          null,
          this.sqlDateMap[this.dateVal[0]],
          this.sqlDateMap[this.dateVal[1]],
          this.type,
          this.uid,
        ).then((res) => {
          let ary = coverArray(res);
          this.latency = [];
          ary.forEach((item) => {
            let _template = {};
            _template.type = this.type;
            _template.value = item[1];
            _template.date = item[0] * 500 + "ms";

            this.latency.push(_template);
          });
        });
        const colors = [
          "#8bd4a1",
          "#8bd4a1",
          "#8bd4a1",
          "#fac858",
          "#fb9690",
          "#fb9690",
        ];
        getLoadStatusByWhere(
          this.pagging.pageNo,
          this.pageSize || 10,
          this.filter,
          this.sortBy,
          this.arrow,
          null,
          null,
          this.sqlDateMap[this.dateVal[0]],
          this.sqlDateMap[this.dateVal[1]],
          this.type,
          this.uid,
        ).then((res) => {
          let ary = coverArray(res);
          this.status = [];
          ary.forEach((item) => {
            let _template = {};
            _template.type = this.type;
            _template.value = item[0];
            _template.name = item[1];
            this.status.push(_template);
            this.statusColors.push(colors[(item[1] + "").substr(0, 1) * 1]);
          });
        });
        getTPSByWhere(
          this.pagging.pageNo,
          this.pageSize || 10,
          this.filter,
          this.sortBy,
          this.arrow,
          null,
          null,
          this.sqlDateMap[this.dateVal[0]],
          this.sqlDateMap[this.dateVal[1]],
          this.type,
          this.uid,
        )
          .then(
            spread((res, cnt) => {
              let ary = coverArray(res);
              this.tpsCnt = cnt.data;
              this.tps = [];
              ary.forEach((item) => {
                let _template = {};
                _template.type = this.type;
                _template.value = item[0];
                _template.date = format(
                  new Date(item[1]),
                  "yyyy-MM-dd HH:mm",
                );
                this.tps.push(_template);
              });
            }),
          )
          .catch((err) => {
            console.log(err);
          });
      }
    },

    detail(message) {
      this.visible = true;
      this.log = coverMessage({ data: message });
    },

    onSearch() {
      this.getData();
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
  .slider-dot &:deep(.ant-slider-dot) {
    border-radius: 2px;
    width: 12px;
    height: 12px;
    top: -5px;
  }
  .slider-dot &:deep(.ant-slider-handle) {
    border-radius: 2px;
    width: 12px;
    height: 12px;
    background: #00a2e6;
    margin-left: 2px;
  }
  .slider-dot &:deep(.ant-slider-rail) {
    height: 12px;
    top: -1px;
  }
  .slider-dot &:deep(.ant-slider-mark-text) {
    min-width: 50px;
  }
  .log-filter-title {
    position: relative;
    top: -4px;
    margin-right: 10px;
  }
  .FieldTimeOutlined {
    position: relative;
    left: -15px;
    top: 5px;
    font-size: 30px;
    color: #00a2e6;
  }
  .search-warpper {
    text-align: right;
    position: relative;
    top: 10px;
  }
  .log-viewer-list-meta {
    position: relative;
    top: 13px;
  }
  .log-viewer-list-meta .icon {
    width: 30px;
    height: 30px;
    position: relative;
    top: -2px;
  }
</style>
