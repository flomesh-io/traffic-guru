<template>
  <a-popover
    :placement="placement || 'bottom'"
    overlay-class-name="selector-popover"
    v-model:visible="visible"
    trigger="click"
  >
    <template #content>
      <div
        class="flex pd-10"
        v-if="search"
      >
        <div
          v-if="envFilter"
          class="flex-item"
        >
          <EnvSelector
            :no-all="true"
            :is-filter="true"
            @envChange="envChange"
          />
        </div>
        <div class="flex-item">
          <a-input-search
            v-model:value="key"
            class="full"
            :placeholder="$t('search')"
          />
        </div>
        <div class="pl-10">
          <a-button
            v-if="multiple"
            type="primary"
            @Click="multipleSelect"
            :disabled="multipleSelectNum == 0"
          >
            {{ $t("Ok") }}
          </a-button>
        </div>
      </div>
      <a-empty
        v-if="!loading && filterOptions.length == 0"
        :image="simpleImage"
      />
      <div
        class="overflow-auto scrollbar"
        :style="'max-height:' + (rows || 5) * 90 + 'px'"
      >
        <a-card
          v-if="loading"
          class="grid-menu"
          :style="'width: ' + (width ? width : 300) + 'px'"
        >
          <a-card-grid
            class="selector-item"
            style="width: 100%; padding: 15px"
          >
            <a-skeleton
              avatar
              :paragraph="{ rows: 2 }"
            />
          </a-card-grid>
        </a-card>
        <div v-else>
          <a-card
            v-for="(colItem,colIndex) in calcCol"
            :key="colItem"
            class="grid-menu"
            style="float: left;"
            :style="'width: ' + ((width ? width : 300)/calcCol) + 'px'"
          >
            <a-card-grid
              class="selector-item"
              :class="
                (value == option.id ? 'selected' : '') +
                  (disabled && disabled(option) ? ' disabled' : '')
              "
              v-for="(option, optionIndex) in calcFilterOptions(colIndex)"
              :key="optionIndex"
              :value="option.id"
              style="width:100%"
              @click="select(option)"
            >
              <CheckOutlined
                v-if="option.checked"
                class="CheckOutlined"
              />
              <div :class="getTag ? 'mt-15' : ''">
                <component
                  two-tone-color="#00adef"
                  :is="icon"
                  v-if="icon"
                />
                <svg
                  :class="getTag ? 'mt-20' : ''"
                  v-else-if="svg"
                  class="card-avatar icon"
                  aria-hidden="true"
                >
                  <use :xlink:href="svg" />
                </svg>
                <div class="card-selector-title">
                  {{ option.name || option.username }}
                </div>
              </div>
              <a-tag
                v-if="getTag && getTag(option)"
                class="ribbon"
                color="#f5f5f5"
              >
                {{ getTag(option) }}
              </a-tag>
            </a-card-grid>
          </a-card>
        </div>
      </div>
    </template>
    <slot />
  </a-popover>
</template>

<script>
import { Empty } from "ant-design-vue";
import { CheckOutlined } from "@ant-design/icons-vue";
import EnvSelector from "@/components/menu/EnvSelector";
export default {
  name: "CardSelector",

  components: {
    CheckOutlined,
    EnvSelector,
  },

  props: [
    "loading",
    "envFilter",
    "search",
    "options",
    "icon",
    "placement",
    "disabled",
    "value",
    "getTag",
    "svg",
    "col",
    "width",
    "multiple",
  ],

  emits: ["envChange", "select"],

  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      visible: false,
      key: "",
    };
  },

  i18n: require("@/i18n"),
  computed: {
    calcFilterOptions(){
      return (colIndex)=> {
        if(this.calcCol>1){
          return this.filterOptions.filter((item,index) => index%this.calcCol == colIndex);
        } else {
          return this.filterOptions;
        }
      }
    },

    calcCol(){
      let defaultCol = 3;
      if(this.options.length>=defaultCol){
        return this.col || defaultCol;
      } else {
        return this.options.length > this.col ? this.col : (this.options.length || 1)
      }
    },

    multipleSelectNum() {
      let total = 0;
      this.options.forEach((_option) => {
        if (_option.checked) {
          total++;
        }
      });
      return total;
    },

    filterOptions() {
      if (!this.key) {
        let _options = this.options;
        _options.map((option) => {
          if (option.checked == null) {
            option.checked = false;
          }
        });
        return _options;
      } else {
        let _options = this.options.filter((option) => {
          const _name = option.name || option.username || "";
          return _name.indexOf(this.key) >= 0;
        });
        _options.map((option) => {
          if (option.checked == null) {
            option.checked = false;
          }
        });
        return _options;
      }
    },
  },

  watch: {
    value: {
      handler() {
        if (this.multiple) {
          this.options.forEach((_option) => {
            _option.checked = this.value.find((item) => _option.id == item.id)
              ? true
              : false;
          });
        }
      },

      deep: true,
    },
  },

  methods: {
    envChange(data) {
      this.$emit("envChange", data);
    },

    multipleSelect() {
      this.visible = false;
      let _options = this.options.filter((option) => {
        return option.checked;
      });
      this.$emit("select", _options);
      this.$emit("update:value", _options);
    },

    select(item) {
      if (this.multiple) {
        this.options.forEach((_option) => {
          if (_option.id == item.id) {
            _option.checked = !_option.checked;
          }
        });
      } else {
        this.visible = false;
        this.$emit("update:value", item.id);
        this.$emit("select", item);
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .selector-item:hover {
    font-weight: bold;
    border-left: 2px solid #00adef;
  }
  .selector-item.disabled {
    pointer-events: none;
    cursor: no-drop;
    filter: grayscale(1);
  }
  .selector-item {
    cursor: pointer;
    text-align: center;
    position: relative;
  }
  .card-avatar {
    width: 40px;
    height: 40px;
    fill: #00adef;
    border-radius: 0;
  }
  .card-selector-title {
    text-overflow: ellipsis;
    padding: 0 10px;
  }
  .CheckOutlined {
    color: #25b899;
    position: absolute;
    right: 10px;
    top: 10px;
  }
</style>
