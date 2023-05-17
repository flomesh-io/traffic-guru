<template>
  <a-drawer
    :width="width||'80%'"
    placement="right"
    :closable="false"
    :visible="visible"
    :get-container="false"
    :style="{ position: 'absolute' }"
    @close.stop="onClose"
  >
    <div class="flex">
      <div
        class="flex-item"
        v-for="(os,index) in osList"
        :key="index"
      >
        <div
          class="osIcon"
          @click="download(os)"
        >
          <svg
            v-if="!os.downloading"
            class="icon"
            aria-hidden="true"
          >
            <use
              :xlink:href="os.icon"
            />
          </svg>
          <LoadingOutlined
            v-else
            class="icon"
          />
        </div>
        <div class="osLabel">
          {{ os.label }}<br><div class="osTag">
            {{ os.tag }}
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import {
  LoadingOutlined,
} from "@ant-design/icons-vue";
import { DEFAULT_BASE_URL } from "@/services/api";
export default {
  name: "WebsiteDownload",
  components: { LoadingOutlined },
  props:['downloading','visible','pid','width'],
  data() {
    return {
      osList:[
        { icon:'#icon-apple',label:"MacOS",value:"MacOS-ARM",downloading:false },
        { icon:'#icon-centos',label:"Centos / RHEL7",value:"CentosRHEL7-x64",downloading:false },
        { icon:'#icon-linux',label:"GeneralLinux",value:"GeneralLinux-ARM",tag:'ARM',downloading:false },
        { icon:'#icon-linux',label:"GeneralLinux ",value:"GeneralLinux-x64",tag:'x64',downloading:false },
      ],
    };
  },

  methods: {
    onClose(){
      this.$emit("update:visible",false);
    },

    download(os){
      console.log(this.downloading);
      this.$emit("update:downloading",true);
      os.downloading = true;
      this.$gql.query(`websiteDownload(id: ${this.pid},os: "${os.value}")`).then((res) => {
        this.$emit("update:downloading",false);
        os.downloading = false;
        window.location.href = DEFAULT_BASE_URL + res;
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
