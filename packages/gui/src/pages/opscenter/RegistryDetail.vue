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
          <EmptyResult
            v-if="pid == ''"
            :sub-title="$t('Please save the registration certificate first')"
          />

          <a-row
            class="row-mg"
            v-if="pid != ''"
          >
            <a-col
              class="col-pd"
              :xl="24"
              :lg="24"
              :md="24"
              :sm="24"
              :xs="24"
            >
              <ServiceList
                mode="registry"
                :embed-services="selectedNS.services"
                :tab-list="namespaceTabs"
                v-model:tabKey="selectedKeys"
                :embed="true"
                :metric="false"
                :has-search="false"
                @nsChange="selectNS"
                @enabledChange="enabledChange"
              >
                <template
                  #extra
                  v-if="$isPro"
                >
                  <a-select
                    :placeholder="$t('unset')"
                    v-model:value="selectedNS.organizationId"
                    class="width-180"
                    ref="select"
                  >
                    <a-select-option
                      :value="org.id"
                      v-for="(org, index) in orgs"
                      :key="index"
                    >
                      {{ org.name }}
                    </a-select-option>
                  </a-select>
                  <a-button
                    class="ml-10"
                    type="primary"
                    @click="assignOrganization"
                  >
                    {{ $t("Assign Organization") }}
                  </a-button>
                </template>
                <template
                  #organization="{ item }"
                >
                  <a-select
                    :placeholder="$t('unset')"
                    v-model:value="item.organization.id"
                    @change="assignOrganizationByItem(item.id,item.organization.id)"
                    class="width-180"
                    ref="select"
                    v-if="item.organization"
                  >
                    <a-select-option
                      :value="org.id"
                      v-for="(org, index) in orgs"
                      :key="index"
                    >
                      {{ org.name }}
                    </a-select-option>
                  </a-select>
                </template>
              </ServiceList>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </template>
  </RegistryBaseDetail>
</template>

<script>
import RegistryBaseDetail from "./common/RegistryBaseDetail";
import { mapState } from "vuex";
import ServiceList from "@/pages/fsm/components/ServiceList";
import EmptyResult from "@/components/tag/EmptyResult";
export default {
  name: "RegistryDetail",
  i18n: require("@/i18n"),
  components: {
    ServiceList,
    RegistryBaseDetail,
    EmptyResult,
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

      orgs: [],
      pjsConfig: "",
      pid: "",
      json: '{ "":"" }',
      config: "",
      noTitleKey: "",
    };
  },

  computed: {
    ...mapState("setting", ["isMobile"]),
    namespaceTabs(){
      let ret = [];
      this.namespaces.forEach((ns)=>{
        ret.push({key:ns.id,tab:ns.name,services:ns.services.length})
      });
      return ret;
    }
  },

  created() {
    this.pid = this.$route.params.id || "";
  },

  methods: {
    enabledChange(d){
      this.$gql
        .mutation(
          `updateServiceSync(id: ${d.id}, data: $data){data{id}}`,
          { data: { deleted: !d.enabled } },
          { data: "ServiceInput!" },
        )
        .then(() => {
          this.$message.success(this.$t("Save successfully"), 3);
        });
    },

    getDetail(d) {
      this.detail = d.detail;
      this.namespaces = d.namespaces;
      this.selectedKeys = d.selectedKeys;
      this.selectedNS = d.selectedNS || [];
    },

    selectNS(id) {
      this.selectedNS = {services:[]};
      this.detail.namespaces.forEach((ns) => {
        if (ns.id == id) {
          this.selectedNS = ns;
        }
      });
    },


    handleChange() {},
  },
};
</script>

<style lang="less" scoped>
</style>
