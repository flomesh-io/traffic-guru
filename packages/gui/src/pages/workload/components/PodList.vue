<template>
  <div>
    <CPUMemory
      v-if="metric"
      :loading="loading"
      :metrics="cumulativeMetrics"
    />
    <a-card
      class="card nopd"
      :title="$t('Pods')"
      :loading="loading"
    >
      <template
        v-if="hasSearch"
        #extra
      >
        <div>
          <a-input-search
            v-model:value="params.key"
            @search="search()"
            class="right-search-input"
            :placeholder="$t('search')"
          />
        </div>
      </template>
      <div>
        <a-table
          :pagination="{
            showSizeChanger: false,
            showQuickJumper: false,
            onShowSizeChange: search,
            onChange: search,
            current: params.pageNo,
            pageSize: params.pageSize,
            showTotal: (total, range) => `${$t('Total')} ${total}`,
            total: params.total,
          }"
          :columns="dataColumns"
          :data-source="list"
          class="bg-white"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <div>
                <a
                  href="javascript:void(0)"
                  @click="detail(record.name, record.namespace)"
                >{{ record.name }}</a>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 't'">
              <div>
                <a-tooltip
                  placement="topLeft"
                  :title="record.t"
                >
                  <a href="javascript:void(0)">
                    <svg
                      class="icon svg"
                      aria-hidden="true"
                    >
                      <use
                        :xlink:href="
                          $REST.KUBE.iconStatus[record.t]
                        "
                      />
                    </svg>
                  </a>
                </a-tooltip>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'labels'">
              <div>
                <a-tag
                  :key="index"
                  v-for="(key, index) in Object.keys(record.labels)"
                  :closable="false"
                >
                  {{ key }}:{{ record.labels[key] }}
                </a-tag>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <div>
                <a-dropdown>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <a @click="detail(record.name, record.namespace)">{{
                          $t("view")
                        }}</a>
                      </a-menu-item>
                      <a-menu-item v-if="false">
                        <a-popconfirm
                          placement="topLeft"
                          :ok-text="$t('Yes')"
                          :cancel-text="$t('No')"
                          @confirm="remove(item.id)"
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
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import { MoreOutlined } from "@ant-design/icons-vue";
import CPUMemory from "@/components/chart/CPUMemory.vue";
const columns = [
  {
    key: " ", 
    dataIndex: "t",
  },
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Namespace",
    width: 130,
    dataIndex: "namespace",
  },
  {
    key: "Labels",
    dataIndex: "labels",
  },
  {
    key: "node",
    dataIndex: "node",
  },
  {
    key: "Status",
    dataIndex: "status",
  },
  {
    key: "Restart",
    dataIndex: "restartCount",
  },
  {
    key: "Cpu Usage(cores)",
    dataIndex: "cpuUsage",
  },
  {
    key: "Memory Usage(cores)",
    dataIndex: "memoryUsage",
  },
  {
    key: "Creation Timestamp",
    dataIndex: "creationTimestamp",
    sorter: true,
  },
  {
    key: "Action",
    width: 130,
    dataIndex: "action",
  },
];
export default {
  name: "PodList",
  components: { CPUMemory, MoreOutlined },
  props: ["url", "metric", "hasSearch", "namespace"],
  i18n: require("@/i18n"),
  data() {
    return {
      iconStatus: {
        Completed: "#icon-success",
        Running: "#icon-success",
        Warning: "#icon-warning",
        ImagePullBackOff: "#icon-error",
        ErrImagePull: "#icon-error",
        "Init: CrashLoopBackOff": "#icon-error",
      },

      params: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        key: "",
      },

      columns,
      cumulativeMetrics: [],
      loading: false,
      list: [],
    };
  },

  computed: {
    dataColumns() {
      return this.columns.map((column) => {
        column.title = this.$t(column.key);
        return column;
      });
    },
  },

  created() {
    this.search();
  },

  methods: {
    detail(id, namespace) {
      this.$router.push({
        path: `/workload/pod/detail/${namespace}/${id}`,
      });
    },

    MakeUrl() {
      let append = this.$REST.KUBE.append(
        this.params.pageSize,
        this.params.pageNo,
        "d,creationTimestamp",
        this.params.key,
      );
      return this.$REST.KUBE.encode(this.url, append, this.namespace);
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.params.pageNo = pageNo;
        this.params.pageSize = pageSize;
      }
      this.loading = true;
      this.$request(this.MakeUrl(), this.$METHOD.GET).then((res) => {
        let _data = res.data;
        this.list = this.reset(_data.pods);
        this.params.total = _data.listMeta.totalItems;
        this.cumulativeMetrics = _data.cumulativeMetrics;
        this.loading = false;
      });
    },

    reset(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].uid = list[i].objectMeta.uid;
        list[i].name = list[i].objectMeta.name;
        list[i].namespace = list[i].objectMeta.namespace;
        list[i].labels = list[i].objectMeta.labels;
        list[i].node = list[i].nodeName;
        list[i].status = list[i].status;
        list[i].restartCount = list[i].restartCount;
        list[i].cpuUsage = list[i].metrics
          ? list[i].metrics.cpuUsage.toFixed(2) + "m"
          : -"";
        list[i].memoryUsage = list[i].metrics
          ? (list[i].metrics.memoryUsage / 100000).toFixed(2) + "Mi"
          : "-";
        list[i].creationTimestamp = new Date(
          list[i].objectMeta.creationTimestamp,
        ).toLocaleString();
        list[i].t = list[i].status;
      }
      return list;
    },
  },
};
</script>

<style lang="less" scoped>
  .search {
    margin-bottom: 54px;
  }
  .fold {
    width: calc(100% - 216px);
    display: inline-block;
  }
  .operator {
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
  .svg {
    width: 30px;
    height: 30px;
    margin-top: 10px;
  }
</style>
