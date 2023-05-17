<template>
  <div>
    <div
      v-for="(item, index) in d"
      class="mb-10"
      :key="index"
    >
      <div
        class="flex"
        :style="width?`max-width:${width}px`:''"
      >
        <div class="flex-item">
          <slot :item="item" />
        </div>
        <div
          class="font-left width-100"
          v-if="xlButton"
        >
          <a-button
            v-if="d.length > 1"
            :disabled="d.length === 1"
            @click="remove(item)"
            shape="circle"
            class="border-round ml-10"
          >
            <MinusOutlined />
          </a-button>
          <a-button
            type="primary"
            v-if="d.length - 1 == index"
            @click="add"
            shape="circle"
            class="border-round ml-10"
          >
            <PlusOutlined />
          </a-button>
        </div>
        <div
          class="font-left width-100"
          v-else
        >
          <MinusCircleTwoTone
            v-if="d.length > 1"
            class="icon-menu two-tone"
            :disabled="d.length === 1"
            @click="remove(item)"
            two-tone-color="#00adef"
          />
          <PlusCircleTwoTone
            class="icon-menu two-tone"
            v-if="d.length - 1 == index"
            @click="add"
            two-tone-color="#00adef"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	
import {
  MinusCircleTwoTone,
  PlusCircleTwoTone,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
export default {
  name: "InputList",
  components: {
    MinusCircleTwoTone,
    PlusCircleTwoTone,
    MinusOutlined,
    PlusOutlined,
  },

  props:['d','attrs', 'width', 'xlButton'],
  data() {
    return {
    };
  },

  created() {
    if(this.d.length == 0){
      this.add();
    }
  },

  methods: {

    remove(item) {
      let index = this.d.indexOf(item);
      if (index !== -1) {
        this.d.splice(index, 1);
      }
    },

    add() {
      this.d.push(JSON.parse(JSON.stringify(this.attrs)) || {});
    },

  },
};
</script>

<style lang="less" scoped>
  .two-tone {
    font-size: 20px;
    margin-left: 5px;
  }
</style>