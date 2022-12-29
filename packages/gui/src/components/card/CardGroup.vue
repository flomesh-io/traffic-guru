<template>
  <a-row class="row-mg">
    <a-col
      v-for="(item, index) in cards"
      :key="index"
      class="col-pd mb-20"
      :xl="24 / (col || 2)"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24"
    >
      <a-card>
        <template #title>
          <slot
            name="title"
            :item="item"
            :index="index"
          />
        </template>
        <template #extra>
          <slot
            name="extra"
            :item="item"
            :index="index"
          />
          <a-divider
            type="vertical"
            v-if="!fixed && cards.length > 1"
          />
          <DeleteOutlined
            @click="remove(index)"
            class="font-20 font-primary icon-menu primary"
            v-if="!fixed && cards.length > 1"
          />
          <a-divider
            type="vertical"
            v-if="!fixed && cards.length - 1 == index"
          />
          <PlusCircleTwoTone
            @click="add"
            class="font-20 font-primary icon-menu primary rotate-icon"
            v-if="!fixed && cards.length - 1 == index"
          />
        </template>
      </a-card>
      <slot
        :item="item"
        :index="index"
      />
    </a-col>
  </a-row>
</template>

<script>
import { DeleteOutlined, PlusCircleTwoTone } from "@ant-design/icons-vue";
export default {
  name: "CardGroup",
  components: { DeleteOutlined, PlusCircleTwoTone },
  props: ["cards", "col", "fixed"],
  emits: ["add", "remove"],
  data() {
    return {};
  },

  computed: {},

  watch: {},
  created() {},
  methods: {
    add() {
      this.$emit("add", {});
    },

    remove(index) {
      this.$emit("remove", index);
    },
  },
};
</script>

<style lang="less" scoped></style>
