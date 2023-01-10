<template>
  <a-card
    class="card nopd"
    :title="$t('Log')"
    :loading="loading"
  >
    <template
      #extra
    >
      <div class="flex">
        <div>
          <slot name="extra" />
        </div>
        <div
          class="flex-item"
          v-if="hasSearch"
        >
          <a-input-search
            v-model:value="params.key"
            @search="search()"
            class="right-search-input"
            :placeholder="$t('search')"
          />
        </div>
        <div>
          <a-pagination
            class="relative"
            style="top:5px"
            @change="search"
            v-model:current="params.pageNo"
            simple
            :total="params.total"
            :page-size="1"
          />
        </div>
      </div>
    </template>
    <ShellEditor :value="log.logs" />
  </a-card>
</template>

<script>
import ShellEditor from "@/components/editor/ShellEditor";
export default {
  name: "LogList",
  components: {
    ShellEditor,
  },

  props: ["url", "hasSearch", "namespace"],
  i18n: require("@/i18n"),
  data() {
    return {
      params: {
        pageNo: null,
        pageSize: 100,
        total: 0,
        timmer: null,
        key: "",
      },

      loading: false,
      log: {},
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
    url(){
      this.loading = true;
      this.params.pageNo = null;
      if(this.timmer){
        clearTimeout(this.timmer);
      }
      this.search();
    }
  },

  created() {
    this.loading = true;
    this.search();
  },
	
  beforeUnmount() {
    if(this.timmer){
      clearTimeout(this.timmer);
    }
  },
	
  methods: {
    MakeUrl() {
      let append = this.$REST.K8S.append(
        this.params.pageSize,
        this.params.pageNo,
        "d,creationTimestamp",
        null,
        this.params.key,
      );
      return this.$REST.K8S.encode(this.url, append, this.namespace);
    },

    search(pageNo) {
      if (pageNo) {
        this.params.pageNo = pageNo;
      }
      this.$request(this.MakeUrl(), this.$METHOD.GET).then((res) => {
        let _data = res.data; 
        this.log = _data; 
        this.params.total = _data.countPage;
        if(!this.params.pageNo){
          this.params.pageNo = _data.countPage;
        }
        if(this.params.total == this.params.pageNo){
          this.timmer = setTimeout(()=>{
            this.search();
          },5000)
        }
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
  .search {
    margin-bottom: 54px;
  }
</style>
