<template>
  <div class="statusIcon">
    <a-tooltip
      placement="topLeft"
      :title="d ? (d.message || (d[0] && d[0].message)):''"
    >
      <a href="javascript:void(0)">
        <LoadingOutlined
          v-if="status == 'pending'"
          class="font-18 font-primary svg"
        />
        <StopOutlined
          v-else-if="status == 'stop'"
          class="danger font-18 svg"
        />
        <CloseCircleFilled
          v-else-if="status == 'error'"
          class="danger font-18 svg"
        />
        <CheckCircleFilled
          v-else-if="status == 'success'"
          class="font-18 success svg"
        />
        <WarningFilled 
          v-else-if="status == 'warning'"
          class="font-18 svg warning"
        />
        <svg
          v-else
          class="icon svg"
          aria-hidden="true"
        >
          <use
            :xlink:href="status"
          />
        </svg>
      </a>
    </a-tooltip>
  </div>
</template>

<script>
import {
  StopOutlined,
  LoadingOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  WarningFilled,
} from "@ant-design/icons-vue";
export default {
  name: "Status",
  components: {
    StopOutlined,
    LoadingOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    WarningFilled,
  },

  props: ["d"],
  i18n: require("@/i18n"),

  data() {
    return {
      iconStatus: {
        running: "success",
        pending: "pending",
        success: "success",
        stop: "stop",
        failed: "error",
        Normal: "success",
        Pending: "pending",
        Succeeded: "success",
        Success: "success",
        Completed: "success",
        Complete: "success",
        Running: "success",
        Warning: "warning",
        ImagePullBackOff: "error",
        ErrImagePull: "error",
        "Init: CrashLoopBackOff": "error",
        "Init:Error": "error",
        "Error: ErrImagePull": "error",
        "Back-off restarting failed container": "error",
      },
    }
  },

  computed: {
    status(){
      return this.iconStatus[this.d ? (this.d.status || (this.d[0] ? this.d[0].status : null)) : 'Success']
    }
  }
};
</script>

<style lang="less" scoped>
  .svg {
    width: 30px;
    height: 30px;
    margin-top: 5px;
  }
	.statusIcon{
		height: 30px;
	}
</style>
