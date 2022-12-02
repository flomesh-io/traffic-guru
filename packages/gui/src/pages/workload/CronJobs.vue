<template>
  <div>
    <a-card
      class="card nopd"
      :title="$t('Cron Jobs')"
      :loading="loading"
    >
      <template #extra>
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
            showSizeChanger: true,
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
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 't'">
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
            <template v-else-if="column.dataIndex === 'name'">
              <div>
                <a
                  href="javascript:void(0)"
                  @click="detail(record.name, record.namespace)"
                >{{ record.name }}</a>
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
                          $t("Trigger")
                        }}</a>
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
    key: "Schedule",
    dataIndex: "schedule",
  },
  {
    key: "Suspend",
    dataIndex: "suspend",
  },
  {
    key: "Active",
    dataIndex: "active",
  },
  {
    key: "Last Schedule",
    dataIndex: "lastSchedule",
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
  name: "CronJobs",
  components: { MoreOutlined },
  i18n: require("@/i18n"),
  data() {
    return {
      params: {
        key: "",
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },

      columns,
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

    filterEvent() {
      if (this.params.key != "") {
        return this.list.filter((node) => {
          return (
            node.name.indexOf(this.params.key) > -1 ||
            node.title.indexOf(this.params.key) > -1 ||
            node.ip.indexOf(this.params.key) > -1 ||
            node.content.indexOf(this.params.key) > -1 ||
            node.user.indexOf(this.params.key) > -1
          );
        });
      } else {
        return this.list;
      }
    },
  },

  created() {
    this.search();
  },

  methods: {
    detail(id, namespace) {
      this.$router.push({
        path: `/workload/cronjob/detail/${namespace}/${id}`,
      });
    },

    URL() {
      let append = this.$REST.KUBE.append(
        this.params.pageSize,
        this.params.pageNo,
        "d,creationTimestamp",
        this.params.key,
      );
      return this.$REST.KUBE.encode(this.$REST.KUBE.CRONJOB, append);
    },

    search(pageNo, pageSize) {
      if (pageNo) {
        this.params.pageNo = pageNo;
        this.params.pageSize = pageSize;
      }
      this.loading = true;
      this.$request(this.URL(), this.$METHOD.GET).then((res) => {
        let _data = res.data; 
        this.list = this.reset(_data.items); 
        this.params.total = _data.listMeta.totalItems;
        this.loading = false;
      });
    },

    reset(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].uid = list[i].objectMeta.uid;
        list[i].name = list[i].objectMeta.name;
        list[i].namespace = list[i].objectMeta.namespace;
        list[i].labels = list[i].objectMeta.labels
          ? list[i].objectMeta.labels
          : [];
        list[i].schedule = list[i].schedule;
        list[i].suspend = "" + list[i].suspend;
        list[i].active = list[i].active;
        list[i].lastSchedule = new Date(
          list[i].lastSchedule,
        ).toLocaleString();
        list[i].creationTimestamp = new Date(
          list[i].objectMeta.creationTimestamp,
        ).toLocaleString();
        list[i].t = "Success";
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
