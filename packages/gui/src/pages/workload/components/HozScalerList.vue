<template>
  <a-card
    class="card nopd"
    :title="$t('Pod Horizontal Auto Scaler')"
    :loading="loading"
  >
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
          <template v-if="column.dataIndex === 'action'">
            <div>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a @click="detail(record.name, record.namespace)">{{
                        $t("edit")
                      }}</a>
                    </a-menu-item>
                    <a-menu-item>
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
</template>

<script>
import { MoreOutlined } from "@ant-design/icons-vue";
const columns = [
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
    key: "Min Replicas",
    dataIndex: "minReplicas",
  },
  {
    key: "Max Replicas",
    dataIndex: "maxReplicas",
  },
  {
    key: "Ref",
    dataIndex: "ref",
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
  name: "ServiceList",
  components: { MoreOutlined },
  props: ["embed","d","url", "namespace"],
  i18n: require("@/i18n"),
  data() {
    return {
      params: {
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
    if(this.embed){
      this.list = this.reset(this.d);
      this.params.total = this.d.length;
      this.loading = false;
    }else{
      this.search();
    }
  },

  methods: {
    detail(id, namespace) {
      this.$router.push({
        path: `/fsm/service/detail/${namespace}/${id}`,
      });
    },

    MakeUrl() {
      let append = this.$REST.K8S.append(
        this.params.pageSize,
        this.params.pageNo,
        "d,creationTimestamp",
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
        this.loading = false;
      });
    },

    reset(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].uid = list[i].metadata.uid;
        list[i].name = list[i].metadata.name;
        list[i].namespace = list[i].metadata.namespace;
        list[i].minReplicas = list[i].spec.minReplicas;
        list[i].maxReplicas = list[i].spec.maxReplicas;
        list[i].ref = list[i].spec.scaleTargetRef?
          (list[i].spec.scaleTargetRef.kind + "/" + list[i].spec.scaleTargetRef.name):'-';
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
