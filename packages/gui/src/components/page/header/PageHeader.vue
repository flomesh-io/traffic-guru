<template>
  <div
    :class="['page-header', layout, pageWidth]"
    v-if="!hideHead"
  >
    <div class="page-header-wide">
      <div
        class="breadcrumb"
        v-if="!hideBreadcrumb"
      >
        <a-breadcrumb>
          <a-breadcrumb-item
            :key="index"
            v-for="(item, index) in breadcrumb"
          >
            <span>{{ item }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="detail">
        <div class="main">
          <div class="row">
            <h1 v-if="showPageTitle && titleVal">
              <a-typography-paragraph
                v-model:content="titleVal"
                :editable="editable ? { onEnd } : false"
                class="title"
              />
            </h1>
            <div class="action">
              <slot name="action" />
            </div>
          </div>
          <div class="row">
            <div
              v-if="$slots.content"
              class="content"
              :style="$slots.extra ? '' : 'width:100%'"
            >
              <div
                v-if="avatar && (avatar.default || typeof avatar == 'string')"
                class="avatar"
              >
                <img
                  :src="avatar"
                  width="72"
                  height="72"
                >
              </div>
              <component
                class="avatar"
                v-else
                :is="avatar"
              />
              <slot name="content" />
            </div>
            <div
              v-if="$slots.extra"
              class="extra"
            >
              <slot name="extra" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PageHeader",
  props: {
    title: {
      type: [String, Boolean],
      required: false,
      default: false,
    },

    editable: {
      type: [Boolean],
      required: false,
      default: false,
    },

    hideBreadcrumb: {
      type: [Boolean],
      required: false,
      default: false,
    },

    hideHead: {
      type: [Boolean],
      required: false,
      default: false,
    },

    breadcrumb: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },

    avatar: {
      type: [String, Object],
      required: false,
      default: '',
    },
  },

  data() {
    return {
      titleVal: null,
    };
  },

  computed: {
    ...mapState("setting", ["layout", "showPageTitle", "pageWidth"]),
  },

  watch: {
    title() {
      this.titleVal = this.title;
    },
  },
	
  created() {
    this.titleVal = this.title;
  },

  methods: {
    onEnd() {
      this.$emit("changeTitle", this.titleVal);
    },
  },
};
</script>

<style lang="less">
  @import "index";
</style>
