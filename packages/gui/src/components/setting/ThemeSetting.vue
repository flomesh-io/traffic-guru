<template>
  {{ themeVal }}
  <svg
    @click="toggleTheme"
    v-if="themeVal == 'light'"
    class="icon icon-menu-sm rotate-icon"
  >
    <use xlink:href="#icon-light" />
  </svg>
  <svg
    @click="toggleTheme"
    v-else-if="themeVal == 'night'"
    class="icon icon-menu-sm rotate-icon"
  >
    <use xlink:href="#icon-night" />
  </svg>
  <svg
    @click="toggleTheme"
    v-else
    class="icon icon-menu-sm rotate-icon"
  >
    <use xlink:href="#icon-auto" />
  </svg>
  <div
    class="side-setting"
    v-if="false"
  >
    <SettingItem>
      <a-button
        @click="saveSetting"
        type="primary"
        icon="save"
      >
        {{ $t('save') }}
      </a-button>
      <a-button
        @click="resetSetting"
        type="dashed"
        icon="redo"
        style="float: right"
      >
        {{ $t('reset') }}
      </a-button>
    </SettingItem>
    <SettingItem>
      <a-list :split="false">
        <a-list-item>
          {{ $t('navigate.content.title') }}
          <a-select
            :get-popup-container="getPopupContainer"
            :value="pageWidth"
            @change="setPageWidth"
            class="select-item"
            size="small"
          >
            <a-select-option value="fluid">
              {{ $t('navigate.content.fluid') }}
            </a-select-option>
            <a-select-option value="fixed">
              {{ $t('navigate.content.fixed') }}
            </a-select-option>
          </a-select>
        </a-list-item>
        <a-list-item>
          {{ $t('navigate.fixedHeader') }}
          <a-switch
            :checked="fixedHeader"
            size="small"
            @change="setFixedHeader"
          />
        </a-list-item>
        <a-list-item>
          {{ $t('navigate.fixedSideBar') }}
          <a-switch
            :checked="fixedSideBar"
            size="small"
            @change="setFixedSideBar"
          />
        </a-list-item>
      </a-list>
    </SettingItem>
    <a-divider />
    <SettingItem :title="$t('other.title')">
      <a-list :split="false">
        <a-list-item>
          {{ $t('other.weekMode') }}
          <a-switch
            :checked="weekMode"
            size="small"
            @change="setWeekMode"
          />
        </a-list-item>
        <a-list-item>
          {{ $t('other.multiPages') }}
          <a-switch
            :checked="multiPage"
            size="small"
            @change="setMultiPage"
          />
        </a-list-item>
        <a-list-item>
          {{ $t('other.hideSetting') }}
          <a-switch
            :checked="hideSetting"
            size="small"
            @change="setHideSetting"
          />
        </a-list-item>
      </a-list>
    </SettingItem>
    <a-divider />
    <SettingItem :title="$t('animate.title')">
      <a-list :split="false">
        <a-list-item>
          {{ $t('animate.disable') }}
          <a-switch
            :checked="animate.disabled"
            size="small"
            @change="val => setAnimate({...animate, disabled: val})"
          />
        </a-list-item>
        <a-list-item>
          {{ $t('animate.effect') }}
          <a-select
            :value="animate.name"
            :get-popup-container="getPopupContainer"
            @change="val => setAnimate({...animate, name: val})"
            class="select-item"
            size="small"
          >
            <a-select-option
              :key="index"
              :value="item.name"
              v-for="(item, index) in animates"
            >
              {{ item.alias }}
            </a-select-option>
          </a-select>
        </a-list-item>
        <a-list-item>
          {{ $t('animate.direction') }}
          <a-select
            :value="animate.direction"
            :get-popup-container="getPopupContainer"
            @change="val => setAnimate({...animate, direction: val})"
            class="select-item"
            size="small"
          >
            <a-select-option
              :key="index"
              :value="item"
              v-for="(item, index) in directions"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-list-item>
      </a-list>
    </SettingItem>
    <a-alert
      v-if="isDev"
      style="max-width: 240px; margin: -16px 0 8px; word-break: break-all"
      type="warning"
      :message="$t('alert')"
    />
    <a-button
      v-if="isDev"
      id="copyBtn"
      :data-clipboard-text="copyConfig"
      @click="copyCode"
      style="width: 100%"
      icon="copy"
    >
      {{ $t('copy') }}
    </a-button>
  </div>
</template>

<script>
import SettingItem from './SettingItem'
import Clipboard from 'clipboard'
import { mapState, mapMutations } from 'vuex'
import {formatConfig} from '@/utils/formatter'
import {setting} from '@/config/default'
import sysConfig from '@/config/config'
import fastEqual from 'fast-deep-equal'
import deepMerge from 'deepmerge'

export default {
  name: 'ThemeSetting',
  i18n: require('./i18n'),
  components: {SettingItem},
  data() {
    return {
      themeVal:'',
      isInit:false,
      copyConfig: 'Sorry, you have copied nothing O(∩_∩)O~',
      isDev: false
    }
  },

  computed: {
    directions() {
      return this.animates.find(item => item.name == this.animate.name).directions
    },

    ...mapState('setting', ['theme', 'layout', 'animate', 'animates', 'palettes', 'multiPage', 'weekMode', 'fixedHeader', 'fixedSideBar', 'hideSetting', 'pageWidth'])
  },

  watch: {
    'animate.name': function(val) {
      this.setAnimate({name: val, direction: this.directions[0]})
    },

    'theme.mode': {
      handler() {
        const localSettingStr = localStorage.getItem(
          process.env.VUE_APP_SETTING_KEY,
        );
        const localSetting = JSON.parse(localSettingStr);
        if(localSetting && localSetting.theme){
          this.themeVal = localSetting.theme.mode;
        } else {
          this.themeVal = process.env.VUE_APP_THEME;
          if(!this.isInit){
            this.isInit = true;
            this.setTheme({...this.theme, mode: this.getThemeMode(this.themeVal)});
          }
        }
      },

      immediate:true,
    }
  },

  methods: {
    getThemeMode(d) {
      if(d == 'light' || d == 'night'){
        return d;
      }else {
        if (window.matchMedia && 
          window.matchMedia('(prefers-color-scheme: dark)').matches ) {
          return "night";
        }  else if (window.matchMedia && 
          window.matchMedia('(prefers-color-scheme: light)').matches ) {
          return "light";
        }
      }
    },
		
    toggleTheme() {
      if(this.themeVal == 'light'){
        this.themeVal = 'night';
      }else if(this.themeVal == 'night'){
        this.themeVal = 'auto';
      }else {
        this.themeVal = 'light';
      }
      this.setTheme({...this.theme, mode: this.getThemeMode(this.themeVal)});
      this.saveSetting();
    },

    getPopupContainer() {
      return this.$el.parentNode
    },

    copyCode () {
      let config = this.extractConfig(false)
      this.copyConfig = `module.exports = ${formatConfig(config)}`
      let clipboard = new Clipboard('#copyBtn')
      clipboard.on('success', () => {
        // const localConfig = localStorage.getItem(process.env.VUE_APP_SETTING_KEY)
        clipboard.destroy()
      })
    },

    saveSetting() {
      const config = this.extractConfig(true);
      localStorage.setItem(process.env.VUE_APP_SETTING_KEY, JSON.stringify(config))
    },

    resetSetting() {
      localStorage.removeItem(process.env.VUE_APP_SETTING_KEY)
      window.location.reload()
    },

    extractConfig(local = false) {
      let config = {}
      let mySetting = this.$store.state.setting
      if(mySetting && mySetting.theme){
        mySetting.theme.mode = this.getThemeMode(this.themeVal);
      }
      let dftSetting = local ? deepMerge(setting, sysConfig) : setting
      Object.keys(mySetting).forEach(key => {
        const dftValue = dftSetting[key], myValue = mySetting[key]
        if (dftValue != undefined && !fastEqual(dftValue, myValue) || key == 'theme') {
          config[key] = myValue
        }
      })
      return this.themeVal == "auto" ? {} : config;
    },

    ...mapMutations('setting', ['setTheme', 'setLayout', 'setMultiPage', 'setWeekMode',
                                'setFixedSideBar', 'setFixedHeader', 'setAnimate', 'setHideSetting', 'setPageWidth'])
  }
}
</script>

<style lang="less" scoped>
  .side-setting{
    min-height: 100%;
    background-color: @base-bg-color;
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    position: relative;
    .flex{
      display: flex;
    }
    .select-item{
      width: 80px;
    }
  }
	.icon-menu-sm{
		width: 26px;
		height: 26px;
		padding:2px;
	}
</style>
