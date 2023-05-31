<template>
  <div>
    <div
      class="side-nav"
      v-if="mode == 'nav'"
    >
      <div class="left-bar">
        <div class="bottom">
          <a-popover
            overlay-class-name="nopd"
            trigger="hover"
            v-if="(routerSettingMenu.showZone && $isPro) || routerSettingMenu.showEnv"
            placement="rightTop"
          >
            <template #content>
              <a-descriptions
                style="width: 400px;"
                bordered
              >
                <a-descriptions-item
                  :span="3"
                  :label="$t('Zone')"
                  v-if="routerSettingMenu.showZone && $isPro"
                >
                  <a-select
                    class="ant-dropdown-link font-center full"
                    v-model:value="zoneVal"
                  >
                    <a-select-option value="default">
                      default
                    </a-select-option>
                  </a-select>
                </a-descriptions-item>
                <a-descriptions-item
                  :span="3"
                  :label="$t('Registry')"
                  v-if="routerSettingMenu.showEnv"
                >
                  <div
                    class="font-center"
                  >
                    <EnvSelector />
                  </div>
                </a-descriptions-item>
              </a-descriptions>
            </template>
            <SelectOutlined class="icon-menu" />
          </a-popover>
          <a-tooltip
            :key="index"
            v-for="(menu, index) in subMenu"
          >
            <a-popover
              overlay-class-name="nopd side-nav-memu"
              trigger="hover"
              v-if="
                !menu.meta.invisible &&
                  menu.children &&
                  menu.children.length > 0
              "
              placement="rightTop"
            >
              <template #content>
                <div
                  class="menu-content"
                  v-if="contentIndex >= 0"
                >
                  <h4 class="pd-20">
                    <img
                      class="img-radius"
                      v-if="subMenu[contentIndex].path == 'flb'"
                      width="30"
                      src="@/assets/img/app1.jpg"
                    >
                    <img
                      class="img-radius"
                      v-else-if="subMenu[contentIndex].path == 'fsm'"
                      width="30"
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
                          @click="() => {contentIndex = contentIndex}"
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
                          <span>{{ subitem.name }}</span>
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
              </template>
              <div>
                <div 
                  class="img-menu" 
                  v-if="menu.path == 'flb'"
                  @mouseenter="selectContent(index)"
                  @mouseleave="() => {contentIndex = contentIndex}"
                >
                  <img src="@/assets/img/app1.jpg">
                </div>
                <div 
                  class="img-menu" 
                  v-else-if="menu.path == 'fsm'"
                  @mouseenter="selectContent(index)"
                  @mouseleave="() => {contentIndex = contentIndex}"
                >
                  <img src="@/assets/img/app2.jpg">
                </div>
                <component
                  v-else
                  class="icon-menu"
                  @mouseenter="selectContent(index)"
                  @mouseleave="() => {contentIndex = contentIndex}"
                  :is="menu.meta.icon"
                />
              </div>
            </a-popover>
            <router-link
              v-else-if="!menu.meta.invisible && menu.children == 0"
              :to="menu.fullPath"
            >
              <component
                class="icon-menu"
                :is="menu.meta.icon"
              />
            </router-link>
          </a-tooltip>
          <a-tooltip
            :title="$t('router-setting.name')"
            color="#00adef"
            placement="right"
          >
            <SlidersOutlined
              v-permission="['admin']"
              @click="routerSetting"
              class="icon-menu"
            />
          </a-tooltip>
          <a-tooltip
            :title="$t('Logout')"
            color="#00adef"
            placement="right"
          >
            <PoweroffOutlined
              @click="logout"
              class="icon-menu"
            />
          </a-tooltip>
          <a-tooltip
            :title="$t('Collapse')"
            color="#00adef"
            placement="right"
          >
            <FullscreenExitOutlined
              @click="changeLayout('small')"
              class="icon-menu"
            />
          </a-tooltip>
        </div>
      </div>
    </div>
    <div
      class="windowWrapper wrapper"
      v-if="!visible && mode != 'nav'"
      @click="showDrawer"
    >
      <div
        class="cube"
        :class="theme"
      >
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
      :destroy-on-close="true"
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
            <a-tooltip
              :title="$t('home.name')"
              color="#00adef"
              placement="right"
            >
              <HomeOutlined
                @click="home"
                class="icon-menu"
              />
            </a-tooltip>
            <a-tooltip
              :title="$t('system.name')"
              color="#00adef"
              placement="right"
            >
              <SettingOutlined
                @click="systemSetting"
                class="icon-menu"
              />
            </a-tooltip>
            <a-tooltip
              :title="$t('router-setting.name')"
              color="#00adef"
              placement="right"
            >
              <SlidersOutlined
                v-permission="['admin']"
                @click="routerSetting"
                class="icon-menu"
              />
            </a-tooltip>
            <a-tooltip
              :title="$t('Change Menu Layout')"
              color="#00adef"
              placement="right"
            >
              <BorderLeftOutlined
                @click="() => {onClose();changeLayout('nav')}"
                class="icon-menu"
              />
            </a-tooltip>
            <a-tooltip
              :title="$t('Logout')"
              color="#00adef"
              placement="right"
            >
              <PoweroffOutlined
                @click="logout"
                class="icon-menu"
              />
            </a-tooltip>
            <a-tooltip
              :title="$t('Collapse')"
              color="#00adef"
              placement="right"
            >
              <FullscreenExitOutlined
                @click="onClose"
                class="icon-menu"
              />
            </a-tooltip>
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
          <div
            class="font-center"
            v-show="routerSettingMenu.showEnv"
          >
            <EnvSelector />
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
                <div 
                  class="img-menu inline-block" 
                  v-if="menu.path == 'flb'"
                >
                  <img src="@/assets/img/app1.jpg">
                </div>
                <div 
                  class="img-menu inline-block" 
                  v-else-if="menu.path == 'fsm'"
                >
                  <img src="@/assets/img/app2.jpg">
                </div>
                <component
                  v-else
                  :is="menu.meta.icon"
                />
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
              class="img-radius"
              v-if="subMenu[contentIndex].path == 'flb'"
              width="50"
              src="@/assets/img/app1.jpg"
            >
            <img
              class="img-radius"
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
                  <span>{{ subitem.name }}</span>
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
  BorderLeftOutlined,
  SelectOutlined,
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
    BorderLeftOutlined,
    SlidersOutlined,
    SelectOutlined,
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
      mode: localStorage.getItem('MENU_LAYOUT') || 'small',
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
      .query(`systemSettings(filters:{type:{eq:"RouterSetting"}}){data{id,attributes{mode,content}}}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          this.routerSettingMenu = { ...res.data[0].content, id: res.data[0].id };
        } else {
          this.routerSettingMenu = { showEnv: true, showZone: true };
        }
      });
  },

  methods: {
    changeLayout(mode){
      this.mode = mode;
      localStorage.setItem('MENU_LAYOUT',mode);
    },

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
    background-color: @background-color-base;
    height: 100%;
    overflow: hidden;
  }
	.img-menu{
		text-align: center;
	}
	.windowDrawerBody .img-menu{
		margin-right: 10px;
	}
	.windowDrawerBody .img-menu img{
		width:20px;
		height: 20px;
		position: relative;
		top: -2px;
		border-radius: 2px;
	}
	.side-nav .img-menu img{
		
		margin: 10px 0;
		width: 30px;
		height: 30px;
		transition: .3s all;
		cursor: pointer;
		border-radius: 2px;
	}
	.side-nav .img-menu:hover img{
		border-radius: 50%;
		margin: 0;
		width: 50px;
		height: 50px;
	}
  .left-bar {
    position: relative;
    width: 50px;
  }
	.side-nav .menu-content{
		
	}
  .left-bar .bottom {
    width: 50px;
  }
	.side-nav{
		padding-right: 3px;
		padding-top: 10px;
		height: 100%;
		position: relative;
		z-index: 1;
	}
	.side-nav:after {
		position: absolute;
		top: 20px;
		content: "";
		width: 2px;
		height: 600px;
		display: block;
		right: -1px;
		box-shadow: -1px 0px 3px 0px rgba(0,0,0,0.2);
		border-radius: 100%;
	}
	.windowDrawerBody .left-bar .bottom {
    position: absolute;
    bottom: 0;
  }
  .menu-bar {
    flex: 2;
    background-color: @body-background;
  }
  .menu-bar h6 {
    display: block;
    width: 100%;
    color: #999;
    padding: 10px;
    background-color: @background-color-light;
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
    color: @text-color;
  }
  .icon-menu:hover {
    color: #00adef;
    background-color: @body-background;
  }
  .grid-menu-item {
    transition: all 0.3s;
  }
  .grid-menu-item:hover {
    border-left: 3px solid #00adef;
    border-right: 3px solid #00adef;
  }
	.grid-menu-item:nth-child(3n+1){
		clear: both;
	}
  .app-icon {
    vertical-align: middle;
    border-radius: 4px;
    font-size: 30px;
    color: @body-background;
    background-color: #409de0;
    height: 50px;
    padding-top: 4px;
    line-height: 46px;
    width: 50px;
    text-align: center;
  }
  .side-nav-memu .app-icon {
    height: 30px !important;
    line-height: 27px !important;
    font-size: 18px !important;
    width: 30px !important;
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
    background: @window-menu-color-light;
    color: @body-background;
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.05);
    line-height: 200px;
    font-size: 25px;
  }
	.cube.night > div {
		background: @window-menu-color-night;
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
    background: @window-menu-color-hover-light;
  }
  .cube:hover .plane-back {
    transform: rotateY(180deg) translateZ(40px);
    background: @window-menu-color-hover-light;
  }
  .cube:hover .plane-left {
    transform: rotateY(270deg) translateZ(40px);
    background: @window-menu-color-hover-light;
  }
  .cube:hover .plane-right {
    transform: rotateY(90deg) translateZ(40px);
    background: @window-menu-color-hover-light;
  }
  .cube:hover .plane-top {
    transform: rotateX(90deg) translateZ(40px);
    background: @window-menu-color-hover-light;
  }
  .cube:hover .plane-bottom {
    transform: rotateX(270deg) translateZ(40px);
    background: @window-menu-color-hover-light;
  }
	.cube.night:hover{
		.plane-front,.plane-back,.plane-left,.plane-right,.plane-top,.plane-bottom{
			background: @window-menu-color-hover-night;
		}
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
	.img-radius{
		border-radius: 4px;
	}
</style>
