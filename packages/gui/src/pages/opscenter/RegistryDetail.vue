<template>
  <RegistryBaseDetail
    ref="RegistryBaseDetail"
    :pid="pid"
    :types="types"
    @getDetail="getDetail"
  >
    <template #tabs>
      <a-tabs
        type="card"
        @change="cardchange"
      >
        <a-tab-pane
          key="1"
          :tab="$t('Namespace')"
        >
          <a-result
            v-if="pid == ''"
            :sub-title="$t('Please save the registration certificate first')"
          >
            <template #icon>
              <img
                src="../../assets/img/empty.svg"
                style="width: 200px"
              >
            </template>
          </a-result>

          <a-row
            class="row-mg"
            v-if="pid != ''"
          >
            <a-col
              class="col-pd"
              :xl="8"
              :lg="24"
              :md="24"
              :sm="24"
              :xs="24"
            >
              <a-menu
                v-model:selectedKeys="selectedKeys"
                class="full"
                mode="vertical"
                @click="selectNS"
              >
                <a-menu-item
                  v-for="item in namespaces"
                  :key="item.id"
                >
                  {{ item.name
                  }}<span
                    class="ml-10"
                    v-if="item.organizationId"
                  >({{ item.organization.name }})</span>
                  <a-badge
                    class="ml-10"
                    :count="item.services.length"
                    :number-style="{ backgroundColor: '#00adef' }"
                  />
                  <RightOutlined class="RightOutlined float-right" />
                </a-menu-item>
              </a-menu>
            </a-col>
            <a-col
              class="col-pd"
              :xl="16"
              :lg="24"
              :md="24"
              :sm="24"
              :xs="24"
            >
              <ServiceList
                mode="registry"
                :embed-services="selectedNS.services"
                :embed="true"
                :metric="false"
                :has-search="false"
              />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </template>
  </RegistryBaseDetail>
</template>

<script>
import RegistryBaseDetail from "./common/RegistryBaseDetail";
import { RightOutlined } from "@ant-design/icons-vue";
import { mapState } from "vuex";
import ServiceList from "@/pages/fsm/components/ServiceList";
export default {
  name: "RegistryDetail",
  i18n: require("@/i18n"),
  components: {
    RightOutlined,
    ServiceList,
    RegistryBaseDetail,
  },

  data() {
    return {
      selectedKeys: [],
      selectedNS: [],
      namespaces: [],
      detail: {
        organization: null,
        type: "k8s",
        name: "",
        content: {
          domain: "",
          credit: "",
          autoUpstream: false,
          autoApplication: false,
          isGateway: true,
          gatewayPath: "",
          gatewayPort: 0,
        },

        address: "",
      },

      types: [
        {
          name: "k8s",
        }
      ],

      pjsConfig: "",
      pid: "",
      json: '{ "":"" }',
      config: "",
      noTitleKey: "",
    };
  },

  computed: {
    ...mapState("setting", ["isMobile"]),
  },

  created() {
    this.pid = this.$route.params.id || "";
  },

  methods: {
    getDetail(d) {
      this.detail = d.detail;
      this.namespaces = d.namespaces;
      this.selectedKeys = d.selectedKeys || [];
      this.selectedNS = d.selectedNS || [];
    },

    selectNS(e) {
      this.selectedNS = {services:[]}
      this.detail.namespaces.forEach((ns) => {
        if (ns.id == e.key) {
          this.selectedNS = ns;
        }
      });
    },

    handleChange() {},
  },
};
</script>

<style lang="less" scoped>
  .RightOutlined {
    position: relative;
    top: 12px;
  }
</style>
