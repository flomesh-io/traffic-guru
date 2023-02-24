<template>
  <div
    class="inline-block"
    style="padding: 5px 10px 7px 10px"
  >
    <a-dropdown>
      <a
        class="ant-dropdown-link"
        @click.prevent
      >
        {{ schemaName }} / {{ k8svalue[1] == '_all'? 'all' : k8svalue[1] }}
        <DownOutlined />
      </a>
      <template #overlay>
        <a-menu>
          <a-sub-menu
            popup-class-name="maxHeight400"
            v-for="(item, index) in k8soptions"
            :key="item.value"
            :title="item.label"
            @mouseover="getNS(item.value, index, false, true)"
          >
            <a-menu-item
              v-for="(child, chdIndex) in item.children"
              :key="chdIndex"
              @click="changeNamespace(chdIndex, index)"
            >
              <div class="ellipsis">
                {{ child.label }}
              </div>
            </a-menu-item>
            <a-menu-item
              v-if="item.type == 'k8s'"
              @click.stop="addNamespace(item.id)"
            >
              <div>
                <PlusCircleTwoTone
                  class="font-16 mr-10 relative"
                  style="top: 1px"
                />{{ $t("New namespace") }}
              </div>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
  <a-modal
    v-model:visible="visible"
    :title="schemaName"
    @ok="validNamespace"
  >
    <a-form
      :model="payload"
      ref="nsForm"
    >
      <FormItem
        :name="['newNamespace']"
        :rules="rules.uniqueName('namespaces',{registry:regModId})"
      >
        <a-input
          v-model:value="payload.newNamespace"
          :maxlength="30"
          :placeholder="$t('New namespace')"
        />
      </FormItem>
    </a-form>
  </a-modal>
</template>

<script>
import { DownOutlined, PlusCircleTwoTone } from "@ant-design/icons-vue";
import { getRegistries, getK8sNamespaces } from "@/services/common";
import FormItem from "@/components/tool/FormItem";
import { mapState } from "vuex";
export default {
  name: "EnvSelector",
  components: {
    DownOutlined,
    PlusCircleTwoTone,
    FormItem
  },

  props: ["isFilter", "noAll", "namespace", "type"],
  i18n: require("@/i18n"),
  data() {
    return {
      visible: false,
      payload:{
        newNamespace: "",
      },

      isEditing: false,
      regModId:null,
      k8svalue: [],
      k8soptions: [],
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
    schemaName() {
      let name = "Select register";
      this.k8soptions.forEach((option) => {
        if (
          option.id == this.k8svalue[0] ||
          option.value == this.k8svalue[0]
        ) {
          name = option.name;
        }
      });
      return name;
    },
  },

  watch: {
    namespace() {
      if (this.namespace && this.namespace.registry) {
        this.k8svalue[0] = this.namespace.registry.id;
        this.k8svalue[1] = this.namespace.name;
        this.k8svalue[2] = this.namespace.id;
      }
    },
  },

  created() {
    this.getK8s();
  },

  methods: {
    addNamespace(id) {
      this.regModId = id;
      this.visible = true;
    },

    validNamespace() {
      this.$refs.nsForm
        .validateFields()
        .then(() => {
          this.saveNamespace();
        })
        .catch(() => {});
    },

    saveNamespace() {
      let savedata = {
        registry: this.regModId,
        name: this.payload.newNamespace,
      };
      this.$gql
        .mutation(
          `createNamespace(data: $data){data{id}}`,
          {
            data: savedata
          },
          {
            data: "NamespaceInput!",
          },
        )
        .then(() => {
          this.payload.newNamespace = "";
          this.visible = false;
          this.$message.success(this.$t("Created successfully"), 3);
          let findOps = null;
          this.k8soptions.forEach((option) => {
            if (option.value == this.k8svalue[0]) {
              findOps = option;
            }
          });
          if(this.k8svalue){
            this.getNS(this.k8svalue, findOps);
          }
        });
    },

    emitChange(selectedOption) {
      this.$emit("update:namespace", {
        registry: {
          id: this.k8svalue[0].split(",")[0],
          name: selectedOption.name,
        },
        id: this.k8svalue[2],
        name: this.k8svalue[1],
      });
      this.$emit("envChange", {
        registerId: this.k8svalue[0].split(",")[0],
        namespace: this.k8svalue[1],
        namespaceId: this.k8svalue[2],
        type: selectedOption.type,
        registerName: selectedOption.name,
      });
    },

    changeNamespace(index, parentIndex) {
      let targetRegistry = this.k8soptions[parentIndex];
      let targetOption = targetRegistry.children[index];
      this.k8svalue = [
        targetRegistry.value,
        targetOption.value,
        targetOption.id,
      ];
      if (this.isFilter) {
        this.emitChange(targetOption);
      } else {
        localStorage.setItem("SCHEMA_ID", targetRegistry.id);
        localStorage.setItem("NAMESPACE", targetOption.value);
        localStorage.setItem("NAMESPACE_ID", targetOption.id);
        localStorage.setItem("SCHEMA_TYPE", targetRegistry.type);
        localStorage.setItem("SCHEMA_NAME", targetRegistry.name);
        location.reload();
      }
    },

    getK8s() {
      getRegistries(this.type).then((regs) => {
        this.k8soptions = regs.data;
        let findId = localStorage.getItem("SCHEMA_ID");
        let rtnId = null;
        let _ns = null;
        let _ns_id = "";
        let type = null;
        let findIdx = -1;
        this.schemaMapping = {};
        this.k8soptions.forEach((opt, index) => {
          this.schemaMapping[opt.type + opt.id] = [opt.type, opt.name];
          opt.label = opt.name;
          opt.value = `${opt.id},${opt.type}`;
          opt.isLeaf = false;
          if (index == 0) {
            rtnId = opt.id;
            findIdx = index;
            type = opt.type;
          }
          if (
            findId != null &&
            opt.id == findId &&
            opt.type == localStorage.getItem("SCHEMA_TYPE") &&
            (localStorage.getItem("NAMESPACE") != "_all" || !this.noAll)
          ) {
            rtnId = opt.id;
            findIdx = index;
            _ns = localStorage.getItem("NAMESPACE");
            _ns_id = localStorage.getItem("NAMESPACE_ID");
            type = opt.type;
          }
        });
        if(rtnId){
          this.k8svalue = [`${rtnId},${type}`, _ns, _ns_id];
          this.getNS(this.k8svalue[0], findIdx, true);
        }
      });
    },

    getNS(D, index, isInit, noEmit) {
      let nsId = D.split(",")[0];
      getK8sNamespaces(nsId).then((res) => {
        let _data = res.data;
        let defaultChild = this.noAll
          ? []
          : [{ label: "all", value: "_all", id: "", isLeaf: true }];
        _data.forEach((np, index2) => {
          if (index2 == 0 && this.k8svalue[1] == null && isInit) {
            this.k8svalue[1] = np.name;
            this.k8svalue[2] = np.id;
          }
          defaultChild.push({
            label: np.name,
            value: np.name,
            id: np.id,
            isLeaf: true,
          });
        });
        if (defaultChild.length <= 1) {
          defaultChild = [
            { label: "all", value: "_all", id: "", isLeaf: true },
          ];
        }
        if (isInit) {
          if (defaultChild.length <= 1) {
            this.k8svalue[1] = "_all";
            this.k8svalue[2] = "";
          }
          if (this.isFilter) {
            if (!noEmit || this.namespace === null) {
              this.emitChange({ type: "", name: "" });
            }
          } else {
            localStorage.setItem("SCHEMA_ID", this.k8svalue[0].split(",")[0]);
            localStorage.setItem("NAMESPACE", this.k8svalue[1]);
            localStorage.setItem("NAMESPACE_ID", this.k8svalue[2]);
            localStorage.setItem(
              "SCHEMA_TYPE",
              this.k8svalue[0].split(",")[1],
            );
          }
        }
        if (index >= 0) {
          this.k8soptions[index].children = defaultChild;
        }
      });
    },
  },
};
</script>