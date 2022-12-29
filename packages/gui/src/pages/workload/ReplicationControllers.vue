<template>
  <div>
    <a-card
      class="card nopd"
      :title="$t('Replication Controllers')"
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
              <Status :d="record.podInfo?.warnings" />
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
            <template v-else-if="column.dataIndex === 'containerImages'">
              <ImageTags :d="record" />
            </template>
            <template v-else-if="column.dataIndex === 'pods'">
              <PodStatusTags :d="record.podInfo" />
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
import ImageTags from "./components/ImageTags";
import PodStatusTags from "./components/PodStatusTags";
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
    key: "Pods",
    dataIndex: "pods",
  },
  {
    key: "Container Images",
    dataIndex: "containerImages",
  },
  {
    key: "Creation Timestamp",
    dataIndex: "creationTimestamp",
  },
  {
    key: "Action",
    width: 130,
    dataIndex: "action",
  },
];
export default {
  name: "ReplicationControllers",
  components: { MoreOutlined,ImageTags,PodStatusTags,Status },
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
  },

  created() {
    this.search();
  },

  methods: {
    detail(id, namespace) {
      this.$router.push({
        path: `/workload/replication-controller/detail/${namespace}/${id}`,
      });
    },

    URL() {
      let append = this.$REST.K8S.append(
        this.params.pageSize,
        this.params.pageNo,
        "d,creationTimestamp",
        this.params.key,
      );
      return this.$REST.K8S.encode(
        this.$REST.K8S.REPLICATIONCONTROLLER,
        append,
      );
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
        this.params.total = _data.count;
        this.loading = false;
      });
    },

    reset(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].uid = list[i].metadata.uid;
        list[i].name = list[i].metadata.name;
        list[i].namespace = list[i].metadata.namespace;
        list[i].labels = list[i].metadata.labels
          ? list[i].metadata.labels
          : [];
        list[i].creationTimestamp = new Date(
          list[i].metadata.creationTimestamp,
        ).toLocaleString();
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
