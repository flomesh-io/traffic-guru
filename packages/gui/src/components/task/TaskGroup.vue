<template>
  <div class="task-group">
    <div class="task-head">
      <h3 class="title">
        {{ title }}
        <span v-if="count">{{ count }}</span>
      </h3>
      <div class="actions float-right">
        <slot name="actions" />
      </div>
    </div>
    <div class="task-content">
      <draggable
        :group="group"
        :sort="true"
        :scroll="true"
        :scroll-speed="2"
        :animation="150"
        ghost-class="dragable-ghost"
        chosen-class="dragable-chose"
        drag-class="dragable-drag"
        item-key="id"
        v-model="innerList"
        :handle="handle"
        @update="updateList"
        @add="addList"
      >
        <template #footer>
          <a-empty
            :image="simpleImage"
            v-if="!innerList || innerList.length == 0"
          />
        </template>
        <template #item="{ element }">
          <div>
            <slot
              name="item"
              :data="element"
            />
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { Empty } from "ant-design-vue";

export default {
  name: "TaskGroup",
  components: { draggable },
  props: ["title", "group", "list", "handle"],
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      innerList: [],
    };
  },

  computed: {
    count() {
      return this.innerList.length;
    },
  },

  watch: {
    list: {
      immediate: true,
      deep: true,
      handler() {
        this.innerList = this.list;
      },
    },
  },

  methods: {
    updateList() {
      this.$emit("update:list", this.innerList);
    },

    addList(e) {
      this.$emit("update:list", this.innerList);
      this.$emit("change", e);
    },
  },
};
</script>

<style lang="less">
  .task-group {
    width: 100%;
    padding: 8px 8px;
    border-radius: 0px;
    .task-head {
      margin-bottom: 8px;
      .title {
        display: inline-block;
        span {
          display: inline-block;
          border-radius: 10px;
          margin: 0 8px;
          font-size: 12px;
          padding: 2px 6px;
          background-color: #e6fcff;
          color: #00adef;
        }
      }
      .actions {
        display: inline-block;
        float: right;
        font-size: 18px;
        font-weight: bold;
        i {
          cursor: pointer;
        }
      }
    }
  }
</style>
