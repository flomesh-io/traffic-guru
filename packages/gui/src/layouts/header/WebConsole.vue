<template>
  <a-dropdown
    placement="bottomRight"
    :trigger="['click']"
  >
    <div
      class="header-setting pointer"
      @click="search"
    >
      <svg
        class="card-avatar icon"
        aria-hidden="true"
      >
        <use xlink:href="#icon-fenxi" />
      </svg>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item
          v-for="(item, index) in webConsoles"
          :key="index"
        >
          <a
            class="block link"
            target="_blank"
            :href="item.content?.url"
          >
            {{ item.name }}
            <svg
              class="card-avatar icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-share" />
            </svg>
          </a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "WebConsole",
  data() {
    return {
      webConsoles: [],
    };
  },

  i18n: require("@/i18n"),

  computed: {
    ...mapState("setting", ["isMobile"]),
    ...mapGetters("account", ["user"]),
  },

  methods: {
    search() {
      this.$gql
        .query(`fleets(filters:{type:{eq:"webConsole"}}){data{id,attributes{name,content}}}`)
        .then((res) => {
          this.webConsoles = res.data;
        });
    },

    customDashboard() {
      this.$router.push("/system/dashboard/list");
    },

    organizations() {
      this.$router.push("/system/organizations/list");
    },

    projects() {
      this.$router.push("/system/projects/list");
    },

    roles() {
      this.$router.push("/system/roles");
    },

    users() {
      this.$router.push("/system/users");
    },

    jump() {
      this.$router.push("/system/components");
    },

    editor() {
      this.$router.push("/system/topology-editor");
    },
  },
};
</script>

<style lang="less" scoped>
  .header-setting {
    text-align: center;
  }
  .icon.card-avatar {
    position: relative;
    top: 4px;
    width: 18px;
    height: 18px;
    fill: rgba(0, 0, 0, 0.65);
  }
</style>
