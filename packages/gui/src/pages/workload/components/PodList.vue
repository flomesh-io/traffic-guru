<template>
  <div>
    <CPUMemory
      v-if="metric"
      :loading="loading"
      :metrics="metrics"
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
              <Status :d="{status:record.phase}" />
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
            <template v-else-if="column.dataIndex === 'restartCount'">
              <a-badge
                :count="record.restartCount"
                :show-zero="false"
              />
            </template>
            <template v-else-if="column.dataIndex === 'cpuUsage'">
              <a-tag v-if="record.cpuUsage">
                {{ record.cpuUsage }}
              </a-tag><span v-else>-</span>
            </template>
            <template v-else-if="column.dataIndex === 'memoryUsage'">
              <a-tag v-if="record.memoryUsage">
                {{ record.memoryUsage }}
              </a-tag><span v-else>-</span>
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
import Status from "@/components/tag/Status";
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
    dataIndex: "phase",
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
    dataIndex: "creationTimestamp"
  },
  {
    key: "Action",
    width: 130,
    dataIndex: "action",
  },
];
export default {
  name: "PodList",
  components: { CPUMemory, MoreOutlined,Status },
  props: ["embed","d", "url", "metric", "hasSearch", "namespace"],
  i18n: require("@/i18n"),
  data() {
    return {
      params: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        key: "",
      },

      columns,
      metrics: [],
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
    if(this.embed){
      this.list = this.reset(this.d);
      this.params.total = this.d.length;
      this.metrics = null;
      this.loading = false;
    }else{
      this.search();
    }
  },

  methods: {
    detail(id, namespace) {
      this.$router.push({
        path: `/workload/pod/detail/${namespace}/${id}`,
      });
    },

    MakeUrl() {
      let append = this.$REST.K8S.append(
        this.params.pageSize,
        this.params.pageNo,
        "d,creationTimestamp",
        this.params.key,
      );
      return this.$REST.K8S.encode(this.url, append, this.namespace);
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.params.pageNo = pageNo;
        this.params.pageSize = pageSize;
      }
      this.loading = true;
      this.$request(this.MakeUrl(), this.$METHOD.GET).then((res) => {
        let _data = res.data;
        this.list = this.reset(_data.items);
        this.params.total = _data.count;
        this.metrics = _data.metrics;
        this.loading = false;
      });
    },

    reset(list) {
      let setMemory = { "Ki":1,"Mi":1000,"Gi":1000000 }
      for (let i = 0; i < list.length; i++) {
        list[i].uid = list[i].metadata.uid;
        list[i].name = list[i].metadata.name;
        list[i].namespace = list[i].metadata.namespace;
        list[i].labels = list[i].metadata.labels;
        list[i].node = list[i].spec.nodeName;
        list[i].restartCount = list[i].status.containerStatuses?list[i].status.containerStatuses[0].restartCount : 0;
        list[i].cpuUsage = list[i].metrics && list[i].metrics.length>0
          ? (list[i].metrics[list[i].metrics.length-1].cpu/1000000000).toFixed(2) + "cores"
          : null;
        let memory = list[i].metrics && list[i].metrics.length>0
          ? list[i].metrics[list[i].metrics.length-1].memory
          : null;
        let memortUnit = "Ki";
        if(memory>1000000){
          memortUnit = "Gi";
        }else if(memory>1000){
          memortUnit = "Mi";
        }else{
          memortUnit = "Ki";
        }
        list[i].memoryUsage = memory?(''+(memory / setMemory[memortUnit]).toFixed(2) + memortUnit):null
        list[i].creationTimestamp = new Date(
          list[i].metadata.creationTimestamp,
        ).toLocaleString();
        list[i].phase = list[i].status.phase;
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
