<template>
  <div>
    <a-card
      class="card nopd"
      :title="title"
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
              <Status :d="record.jobStatus" />
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
import ImageTags from "./ImageTags";
import PodStatusTags from "./PodStatusTags";
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
  name: "JobList",
  components: { MoreOutlined,ImageTags,PodStatusTags,Status },
  props: ["url", "hasSearch", "unactive", "title", "namespace","d","embed"],
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

  watch: {
    d: {
      handler: function () {
        this.setD(this.d,this.d.length);
      },

      deep: true,
    },
  },
	
  created() {
    if(this.embed){
      this.setD(this.d,this.d.length);
    }else{
      this.search();
    }
  },

  methods: {
    detail(id, namespace) {
      this.$router.push({
        path: `/workload/job/detail/${namespace}/${id}`,
      });
    },
		
    setD(d, l){
      this.list = this.reset(d); 
      this.params.total = l;
      this.loading = false;
    },

    URL() {
      let append = this.$REST.K8S.append(
        this.params.pageSize,
        this.params.pageNo,
        "d,creationTimestamp",
        this.params.key,
      );
      return this.$REST.K8S.encode(
        this.url,
        append + (this.unactive ? "&active=false" : ""),
        this.namespace,
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
        this.setD(_data.items,_data.count);
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
</style>
