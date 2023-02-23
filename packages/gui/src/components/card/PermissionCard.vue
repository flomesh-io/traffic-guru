<template>
  <a-card
    class="grid-menu nopd small-grid-menu"
    :bordered="false"
  >
    <div
      :key="index"
      v-for="(resource, index) in resources"
    >
      <div
        class="permission-card-body"
        v-if="
          resource.type == 'project' &&
            (index == 0 || resources[index - 1].project?.id != resource.project.id)
        "
      >
        {{ $t("Project") }}:{{ resource.project.name }}
      </div>
      <div
        class="permission-card-body"
        v-if="
          resource.type == 'organization' &&
            (index == 0 ||
              resources[index - 1].organization?.id != resource.organization.id)
        "
      >
        {{ $t("Organization") }}:{{ resource.organization.name }}
      </div>
      <a-card-grid
        class="flex-item permission-card-resource"
        :style="'width:' + Math.floor(1000 / (maxResources + 1)) / 10 + '%'"
      >
        <b>{{ $t(resource.name) }}</b>
      </a-card-grid>
      <a-card-grid
        v-for="(item3, index3) in maxResources"
        :key="index3"
        class="flex-item permission-card-action"
        :style="'width:' + Math.floor(1000 / (maxResources + 1)) / 10 + '%'"
      >
        <div v-if="resource.actions.length > index3">
          <div class="inline-block">
            <CheckOutlined
              class="success"
              v-if="resource.actions[index3].enabled"
            />
            <CloseOutlined
              class="danger"
              v-else
            />
          </div>
          <div
            class="inline-block relative"
            style="left: 10px; top: -7px"
          >
            {{ $t(resource.actions[index3].name) }}
          </div>
        </div>
        <div v-else>
          <div class="inline-block">
            <CloseOutlined
              class="danger"
              style="opacity: 0"
            />
          </div>
          <div
            class="inline-block relative"
            style="left: 10px; top: -7px"
          />
        </div>
      </a-card-grid>
    </div>
  </a-card>
</template>

<script>
import { CheckOutlined, CloseOutlined } from "@ant-design/icons-vue";
export default {
  name: "PermissionCard",
  components: { CheckOutlined, CloseOutlined },
  props: ["resources"],
  i18n: require("@/i18n"),
  data() {
    return {};
  },

  computed: {
    maxResources() {
      let max = 0;
      this.resources.forEach((resource) => {
        max = max > resource.actions.length ? max : resource.actions.length;
      });
      return max;
    },
  },

  created() {},
  mounted() {},

  methods: {},
};
</script>

<style lang="less" scoped>
  .permission-card {
    width: 20%;
    height: 43px;
    text-align: center;
    background-color: #fafafa;
  }
  .permission-card-body {
    display: block;
    text-align: left;
    line-height: 40px;
    font-weight: bold;
    padding-left: 20px;
    background-color: #fafafa;
  }
  .permission-card-resource {
    // width: 20%;
    line-height: 32px;
    background-color: #fafafa;
    text-align: center;
  }
  .permission-card-action {
    // width: 20%;
    text-align: center;
    line-height: 30px;
  }
</style>
