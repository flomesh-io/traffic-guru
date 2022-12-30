<template>
  <div class="col-space flex">
    <div class="flex-item">
      <div
        class="layout-selector"
        :class="col == 6 ? 'highlight' : ''"
        @click="update(6)"
      >
        <h5>1 / 4</h5>
        <div class="layout-body">
          <div
            v-for="(item, index) in 4"
            :key="index"
            class="layout-grid"
            :class="index == 0 ? 'highlight' : ''"
          >
            <div class="layout-item" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-item">
      <div
        class="layout-selector"
        :class="col == 8 ? 'highlight' : ''"
        @click="update(8)"
      >
        <h5>1 / 3</h5>
        <div class="layout-body">
          <div
            v-for="(item, index) in 3"
            :key="index"
            class="layout-grid"
            :class="index == 0 ? 'highlight' : ''"
          >
            <div class="layout-item" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-item">
      <div
        class="layout-selector"
        :class="col == 12 ? 'highlight' : ''"
        @click="update(12)"
      >
        <h5>1 / 2</h5>
        <div class="layout-body">
          <div
            v-for="(item, index) in 2"
            :key="index"
            class="layout-grid"
            :class="index == 0 ? 'highlight' : ''"
          >
            <div class="layout-item" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-item">
      <div
        class="layout-selector"
        :class="col == 16 ? 'highlight' : ''"
        @click="update(16)"
      >
        <h5>2 / 3</h5>
        <div class="layout-body">
          <div
            v-for="(item, index) in 2"
            :key="index"
            class="layout-grid"
            :style="index == 0 ? 'flex:2' : ''"
            :class="index == 0 ? 'highlight' : ''"
          >
            <div class="layout-item" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-item">
      <div
        class="layout-selector"
        :class="col == 24 ? 'highlight' : ''"
        @click="update(24)"
      >
        <h5>100%</h5>
        <div class="layout-body">
          <div
            v-for="(item, index) in 1"
            :key="index"
            class="layout-grid"
            :class="index == 0 ? 'highlight' : ''"
          >
            <div class="layout-item" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ColSpace",
  props: ["col", "readonly"],
  data() {
    return {};
  },

  created() {},

  methods: {
    update(col) {
      if (!this.readonly) {
        this.$emit("update:col", col);
      }
    },
  },
};
</script>

<style lang="less" scoped>
	.col-space .flex-item{
	}
  .svg {
    width: 50px;
    height: 50px;
    fill: #00adef;
    border-radius: 0;
  }
  .auto-card {
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
  }
  .layout-selector {
    border-right: 1px dashed #dddddd;
    border-radius: 0px;
    padding: 8px;
    cursor: pointer;
    text-align: center;
  }
  .layout-selector.highlight {
    border: 0px solid #00adef;
		border-radius: 6px;
		box-shadow: 0 0 6px 6px rgba(0,173,239,0.3);
  }
  .layout-body {
    display: flex;
    height: 30px;
    width: 100%;
  }
  .layout-grid {
    flex: 1;
    padding: 0 5px;
  }
  .layout-item {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: #00adef;
    opacity: 0.3;
  }
  .layout-grid.highlight .layout-item {
    background-color: orange;
  }
  .select-svg {
    width: 20px;
    height: 20px;
    fill: #00adef;
    border-radius: 0;
    position: relative;
    top: 4px;
  }
</style>
