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
        {{ schemaName }} / {{ k8svalue[1] }}
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
              @click.stop="addNamespace(item.value)"
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
    @ok="saveNamespace"
  >
    <a-input
      v-model:value="newNamespace"
      :maxlength="30"
      :placeholder="$t('New namespace')"
    />
  </a-modal>
</template>

<script>
import { DownOutlined, PlusCircleTwoTone } from "@ant-design/icons-vue";
import { getRegistries, getK8sNamespaces } from "@/services/common";
export default {
  name: "EnvSelector",
  components: {
    DownOutlined,
    PlusCircleTwoTone,
  },

  props: ["isFilter", "noAll", "namespace"],
  i18n: require("@/i18n"),
  data() {
    return {
      visible: false,
      newNamespace: "",
      isEditing: false,
      k8svalue: [],
      k8soptions: [],
    };
  },

  computed: {
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
    addNamespace() {
      this.visible = true;
    },

    saveNamespace() {
      let savedata = {
        registry: this.k8svalue[0].split(",")[0] * 1,
        name: this.newNamespace,
      };
      this.$gql
        .mutation(
          `createNamespace(input: $input){namespace{id}}`,
          {
            input: { data: savedata },
          },
          {
            input: "createNamespaceInput",
          },
        )
        .then(() => {
          this.newNamespace = "";
          this.visible = false;
          this.$message.success(this.$t("Created successfully"), 3);
          let findOps = null;
          this.k8soptions.forEach((option) => {
            if (option.value == this.k8svalue[0]) {
              findOps = option;
            }
          });
          this.getNS(this.k8svalue, findOps);
        });
    },

    emitChange(selectedOption) {
      this.$emit("update:namespace", {
        register: {
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
      getRegistries().then((regs) => {
        this.k8soptions = regs;
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
        this.k8svalue = [`${rtnId},${type}`, _ns, _ns_id];
        this.getNS(this.k8svalue[0], findIdx, true);
      });
    },

    getNS(D, index, isInit, noEmit) {
      getK8sNamespaces(D.split(",")[0]).then((res) => {
        let _data = res;
        let defaultChild = this.noAll
          ? []
          : [{ label: "All", value: "_all", id: "", isLeaf: true }];
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
            { label: "default", value: "default", id: "", isLeaf: true },
          ];
        }
        if (isInit) {
          if (defaultChild.length <= 1) {
            this.k8svalue[1] = "default";
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

<style lang="less" scoped>
  @import "index";
  .windowDrawerBody {
    display: flex;
    background-color: #f5f5f5;
    height: 100%;
  }
  .left-bar {
    position: relative;
    width: 50px;
  }
  .left-bar .bottom {
    width: 50px;
    position: absolute;
    bottom: 0;
  }
  .menu-bar {
    flex: 2;
    background-color: #ffffff;
  }
  .menu-bar h6 {
    display: block;
    width: 100%;
    color: #999;
    padding: 10px;
    background-color: #fcfcfc;
  }

  .back-menu {
    display: none;
    height: 90px;
  }

  .menu-content {
    flex: 3;
  }
  @media (max-width: 768px) {
    .menu-content {
      display: none;
    }
    .back-menu {
      display: block;
    }
    .menu-select {
      .menu-bar {
        display: none;
      }
      .menu-content {
        display: block;
      }
    }
  }
  .icon-menu {
    display: block;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    transition: color 0.3s;
    color: #232323;
  }
  .icon-menu:hover {
    color: #00adef;
  }
  .app-icon {
    vertical-align: middle;
    border-radius: 4px;
    font-size: 30px;
    color: #fff;
    background-color: #409de0;
    height: 50px;
    padding-top: 4px;
    line-height: 46px;
    width: 50px;
    text-align: center;
  }

  .wrapper {
    perspective: 1000px;
  }
  .cube {
    cursor: pointer;
    height: 50px;
    width: 50px;
    position: relative;
    margin: auto;
    transform-style: preserve-3d;
    animation: rotate 15s infinite;
  }
  @keyframes rotate {
    from {
      transform: rotateY(0deg) rotateX(0deg);
    }
    to {
      transform: rotateY(360deg) rotateX(360deg);
    }
  }
  .cube > div {
    height: 100%;
    width: 100%;
    opacity: 0.9;
    position: absolute;
    text-align: center;
    background: rgba(246, 246, 246, 0.5);
    color: #fff;
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.05);
    line-height: 200px;
    font-size: 25px;
  }
  .plane-front {
    position: relative;
    transform: translateZ(25px);
    transition: all 0.3s;
  }
  .plane-back {
    position: relative;
    transform: rotateY(180deg) translateZ(25px);
    transition: all 0.3s;
  }
  .plane-left {
    position: relative;
    transform: rotateY(270deg) translateZ(25px);
    transition: all 0.3s;
  }
  .plane-right {
    position: relative;
    transform: rotateY(90deg) translateZ(25px);
    transition: all 0.3s;
  }
  .plane-top {
    position: relative;
    transform: rotateX(90deg) translateZ(25px);
    transition: all 0.3s;
  }
  .plane-bottom {
    position: relative;
    transform: rotateX(270deg) translateZ(25px);
    transition: all 0.3s;
  }
  .cube:hover .plane-front {
    transform: translateZ(40px);
    background: rgba(255, 255, 255, 0.9);
  }
  .cube:hover .plane-back {
    transform: rotateY(180deg) translateZ(40px);
    background: rgba(255, 255, 255, 0.9);
  }
  .cube:hover .plane-left {
    transform: rotateY(270deg) translateZ(40px);
    background: rgba(255, 255, 255, 0.9);
  }
  .cube:hover .plane-right {
    transform: rotateY(90deg) translateZ(40px);
    background: rgba(255, 255, 255, 0.9);
  }
  .cube:hover .plane-top {
    transform: rotateX(90deg) translateZ(40px);
    background: rgba(255, 255, 255, 0.9);
  }
  .cube:hover .plane-bottom {
    transform: rotateX(270deg) translateZ(40px);
    background: rgba(255, 255, 255, 0.9);
  }
  .cube-icon {
    color: #999;
    position: absolute;
    opacity: 0.7;
    font-size: 30px;
    left: 10px;
    top: 10px;
  }
  .cube-icon-img {
    height: 30px;
    width: 30px;
    opacity: 0.7;
  }
  .windowWrapper {
    position: fixed;
    bottom: 30px;
    left: 30px;
    z-index: 10;
  }
  .windowDrawerBody .avatar {
    border-radius: 50%;
    position: relative;
    top: 10px;
    margin-left: 10px;
  }
  .LeftOutlined {
    color: #ccc;
    position: relative;
    top: 10px;
  }
</style>
