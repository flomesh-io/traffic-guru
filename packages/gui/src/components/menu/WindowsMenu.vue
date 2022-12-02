<template>
  <div>
    <div
      class="windowWrapper wrapper"
      v-if="!visible"
      @click="showDrawer"
    >
      <div class="cube">
        <div class="plane-front">
          <MenuOutlined class="cube-icon" />
        </div>
        <div class="plane-back" />
        <div class="plane-right" />
        <div class="plane-left">
          <img
            class="cube-icon cube-icon-img"
            src="@/assets/img/app1.jpg"
          >
        </div>
        <div class="plane-top">
          <img
            class="cube-icon cube-icon-img"
            src="@/assets/img/app2.jpg"
          >
        </div>
        <div class="plane-bottom" />
      </div>
    </div>
    <a-drawer
      class="windowDrawer"
      :class="contentIndex >= 0 ? 'select' : ''"
      placement="bottom"
      :height="600"
      :visible="visible"
      mask-style="background:rgba(0,0,0,0)"
      :closable="false"
      @close="onClose"
    >
      <div
        class="windowDrawerBody"
        :class="menuSelect ? 'menu-select' : ''"
      >
        <div class="left-bar">
          <div class="top">
            <div
              class="icon-menu"
              @click="usercenter"
            >
              <img
                class="avatar"
                width="30"
                :src="require('@/assets/img/usericon.png')"
              >
            </div>
          </div>
          <div class="bottom">
            <HomeOutlined
              @click="home"
              class="icon-menu"
            />
            <SettingOutlined
              @click="systemSetting"
              class="icon-menu"
            />
            <SlidersOutlined
              @click="routerSetting"
              class="icon-menu"
            />
            <PoweroffOutlined
              @click="logout"
              class="icon-menu"
            />
            <FullscreenExitOutlined
              @click="onClose"
              class="icon-menu"
            />
          </div>
        </div>
        <div class="menu-bar">
          <h6
            class="relative"
            v-if="routerSettingMenu.showZone && $isPro"
          >
            {{ $t("Zone") }}
            <EyeInvisibleOutlined
              v-if="editMenu"
              class="EyeInvisibleOutlined absolute gray right-10 top-10"
              style="font-size: 12px"
            />
          </h6>
          <a-select
            v-if="$isPro"
            v-show="routerSettingMenu.showZone"
            class="ant-dropdown-link font-center full"
            v-model:value="zoneVal"
          >
            <a-select-option value="default">
              default
            </a-select-option>
          </a-select>
          <h6
            class="relative"
            v-if="routerSettingMenu.showEnv"
          >
            {{ $t("Registry") }}
            <EyeInvisibleOutlined
              v-if="editMenu"
              class="EyeInvisibleOutlined absolute gray right-10 top-10"
              style="font-size: 12px"
            />
          </h6>
          <div class="font-center">
            <EnvSelector v-show="routerSettingMenu.showEnv" />
          </div>
          <h6>{{ $t("Menu") }}</h6>
          <a-menu
            :theme="theme"
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            class="transparent"
          >
            <a-menu-item
              v-for="(menu, index) in subMenu"
              :key="menu.fullPath"
            >
              <div
                @click="selectContent(index)"
                class="nowrap overflowHidden"
                v-if="
                  !menu.meta.invisible &&
                    menu.children &&
                    menu.children.length > 0
                "
              >
                <component :is="menu.meta.icon" />
                <span>{{ menu.name }}</span>
                <EyeInvisibleOutlined
                  v-if="editMenu"
                  class="EyeInvisibleOutlined absolute gray right-10 top-15"
                  style="font-size: 12px"
                />
              </div>
              <router-link
                v-else-if="!menu.meta.invisible && menu.children == 0"
                @click="onClose"
                :to="menu.fullPath"
                class="block nowrap overflowHidden"
              >
                <component :is="menu.meta.icon" />
                <span>{{ menu.name }}</span>
                <EyeInvisibleOutlined
                  v-if="editMenu"
                  class="EyeInvisibleOutlined absolute gray right-10 top-15"
                  style="font-size: 12px"
                />
              </router-link>
            </a-menu-item>
          </a-menu>
        </div>
        <div
          class="menu-content"
          v-if="contentIndex >= 0"
        >
          <h4 class="pd-20">
            <img
              v-if="subMenu[contentIndex].path == 'flb'"
              width="50"
              src="@/assets/img/app1.jpg"
            >
            <img
              v-else-if="subMenu[contentIndex].path == 'fsm'"
              width="50"
              src="@/assets/img/app2.jpg"
            >
            <component
              v-else
              :is="subMenu[contentIndex].meta.icon"
              class="app-icon"
            />
            <span class="ml-15">{{ subMenu[contentIndex].name }}</span>
          </h4>
          <a-card class="full grid-menu nodb pd-x-20 transparent">
            <a-card-grid
              v-for="(subitem, subindex) in subMenu[contentIndex].children"
              :key="subitem.fullPath"
              class="grid-menu-item"
              :style="subindex % 3 > 0 ? 'margin-left:5%' : ''"
            >
              <a-tooltip
                placement="topLeft"
                :title="subitem.name"
                arrow-point-at-center
              >
                <router-link
                  @click="onClose"
                  :to="subitem.fullPath"
                  class="block"
                >
                  <EyeInvisibleOutlined
                    v-if="editMenu"
                    class="EyeInvisibleOutlined absolute gray right-10 top-10"
                    style="font-size: 12px"
                  />
                  <component
                    v-if="subitem.meta.icon"
                    :is="subitem.meta.icon"
                  />
                  <div v-if="subitem.meta.svg">
                    <img
                      :src="subitem.meta.svg"
                      width="26"
                      height="26"
                    >
                  </div>
                  <a-typography-text
                    v-if="subitem.meta.badge && !editMenu"
                    class="absolute right-10 top-10"
                    type="warning"
                  >
                    {{ subitem.meta.badge }}
                  </a-typography-text>
                  <span class="black">{{ subitem.name }}</span>
                </router-link>
              </a-tooltip>
            </a-card-grid>
            <a-card-grid
              v-if="subMenu[contentIndex].path == 'system' && false"
              key="edit-menu"
              class="grid-menu-item"
              :style="
                subMenu[contentIndex].children.length % 3 > 0
                  ? 'margin-left:5%'
                  : ''
              "
            >
              <div class="block">
                <div class="block">
                  <a-switch v-model:checked="editMenu" />
                </div>
                <div
                  class="black"
                  style="margin-top: 5px"
                >
                  {{ $t("Edit Menu") }}
                </div>
              </div>
            </a-card-grid>
            <a-card-grid
              class="back-menu grid-menu-item"
              v-if="contentIndex >= 0"
              @click="onBack"
              :style="
                subMenu[contentIndex].children.length % 3 > 0
                  ? 'margin-left:5%'
                  : ''
              "
            >
              <LeftOutlined class="LeftOutlined" />
            </a-card-grid>
          </a-card>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import {
  EyeInvisibleOutlined,
  DownOutlined,
  FullscreenExitOutlined,
  RightOutlined,
  LeftOutlined,
  MenuOutlined,
  SlidersOutlined,
  HomeOutlined,
  SettingOutlined,
  IdcardOutlined,
  PoweroffOutlined,
} from "@ant-design/icons-vue";
import { getI18nKey } from "@/utils/routerUtil";
import { logout } from "@/services/user";
import EnvSelector from "@/components/menu/EnvSelector";
export default {
  name: "WindowsMenu",
  components: {
    EyeInvisibleOutlined,
    DownOutlined,
    FullscreenExitOutlined,
    RightOutlined,
    LeftOutlined,
    MenuOutlined,
    HomeOutlined,
    SettingOutlined,
    IdcardOutlined,
    PoweroffOutlined,
    SlidersOutlined,
    EnvSelector,
  },

  props: {
    menuData: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },

    theme: {
      type: String,
      required: false,
      default: "dark",
    },
  },

  // i18n: require('@/i18n'),
  data() {
    return {
      editMenu: false,
      visible: false,
      selectedKeys: [],
      k8svalue: [],
      k8soptions: [],
      routerSettingMenu: { showEnv: true, showZone: true },
      menuSelect: false,
      schemaMapping: {},
      contentIndex: -1,
      zoneVal: "default",
    };
  },

  computed: {
    oneMenu() {
      let _rtn = this.menuData.filter((menu) => {
        let has = menu && menu.meta && !menu.meta.invisible && !menu.children;
        if (has) {
          menu.name = menu.meta.displayName
            ? menu.meta.displayName
            : this.$t(getI18nKey(menu.fullPath));
        }
        return has;
      });
      return _rtn;
    },

    subMenu() {
      let that = this;
      let _options = _.cloneDeep(this.menuData);
      let _rtn = _options.filter((menu, index) => {
        const _has = menu && menu.meta && menu.children;
        if (_has) {
          menu.meta.icon = that.menuData[index].meta.icon;
          menu.children = menu.children.filter((submenu, subindex) => {
            if (submenu && submenu.meta) {
              submenu.meta.icon =
                that.menuData[index].children[subindex].meta.icon;
              submenu.name = submenu.meta.displayName
                ? submenu.meta.displayName
                : this.$t(getI18nKey(submenu.fullPath));
            }
            return submenu && submenu.meta && !submenu.meta.invisible;
          });
          menu.name = menu.meta.displayName
            ? menu.meta.displayName
            : this.$t(getI18nKey(menu.fullPath));
        }
        return _has;
      });
      return _rtn;
    },

    sideTheme() {
      return this.theme == "light" ? this.theme : "dark";
    },

    ...mapState("setting", ["isMobile", "systemName"]),
  },

  watch: {
    menuData(val) {
      if (val.length > 0 && !val[0].fullPath) {
        this.formatOptions(this.menuData, "");
      }
    },
  },

  created() {
    this.selectedKeys = this.$route.matched.map((item) => item.path);

    this.$gql
      .query(`systemSettings(where:{type:"RouterSetting"}){id,mode,content}`)
      .then((res) => {
        if (res && res.length > 0) {
          this.routerSettingMenu = { ...res[0].content, id: res[0].id };
        } else {
          this.routerSettingMenu = { showEnv: true, showZone: true };
        }
      });
  },

  methods: {
    systemSetting() {
      let systemIndex = -1;
      let _options = _.cloneDeep(this.menuData);
      _options.forEach((menu) => {
        const _has = menu && menu.meta && menu.children;
        if (_has) {
          systemIndex++;
          if (menu.path == "system") {
            this.contentIndex = systemIndex;
            this.menuSelect = true;
          }
        }
      });
    },

    routerSetting() {
      this.$router.push("/router-setting");
      this.visible = false;
    },

    usercenter() {
      this.onClose();
      this.$router.push("/user-center/info");
    },

    logout() {
      this.onClose();
      logout();
      location.reload();
    },

    home() {
      this.onClose();
      this.$router.push("/workplace");
    },

    selectContent(idx) {
      this.contentIndex = idx;
      this.menuSelect = true;
    },

    onBack() {
      this.menuSelect = false;
    },

    onClose() {
      this.visible = false;
      this.menuSelect = false;
    },

    showDrawer() {
      this.contentIndex = -1;
      this.visible = true;
    },

    onCollapse() {
      this.$emit("toggleCollapse");
    },

    onBreakpoint() {
      this.$emit("toggleCollapse");
    },

    toggleCollapse() {
      this.$emit("toggleCollapse");
    },

    onSelect(obj) {
      this.$emit("menuSelect", obj);
    },

    formatOptions(options, parentPath) {
      options.forEach((route) => {
        if (!route.fullPath) {
          let isFullPath = route.path.substring(0, 1) == "/";
          route.fullPath = isFullPath
            ? route.path
            : parentPath + "/" + route.path;
        }
        if (route.children) {
          this.formatOptions(route.children, route.fullPath);
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
    overflow: hidden;
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
    width: 50px;
    line-height: 56px;
    cursor: pointer;
    // transition: color 0.3s;
    color: #232323;
  }
  .icon-menu:hover {
    color: #00adef;
    background-color: #fff;
  }
  .grid-menu-item {
    transition: all 0.3s;
  }
  .grid-menu-item:hover {
    border-left: 3px solid #00adef;
    border-right: 3px solid #00adef;
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
    top: -5px;
    margin-left: 10px;
  }
  .LeftOutlined {
    color: #ccc;
    position: relative;
    top: 10px;
  }
  .EyeInvisibleOutlined {
    transition: color 0.3s;
  }
  .EyeInvisibleOutlined:hover {
    color: #00adef;
  }
  .grid-menu-item {
  }
  .black {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    padding: 0 10px;
  }
</style>
