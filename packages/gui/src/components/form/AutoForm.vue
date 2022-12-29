<template>
  <a-row
    class="form-row"
    v-for="(fieldGroup, index) in fields"
    :key="index"
  >
    <a-col
      :lg="24 / (col ? col : fieldGroup.length > 4 ? 4 : fieldGroup.length)"
      :sm="24"
      v-for="(field, index2) in fieldGroup"
      :key="index2"
      v-show="showByField(field)"
      class="mb-10"
    >
      <AutoItem
        :field="field"
        @change="change"
      />
      <template v-if="field.subfields">
        <AutoItem
          v-for="(subfield, index4) in field.subfields"
          :key="index4"
          :field="subfield"
          @change="change"
        />
      </template>
    </a-col>
  </a-row>
</template>

<script>
import AutoItem from "@/components/form/AutoItem";
export default {
  name: "AutoForm",
  i18n: require("./i18n"),
  components: {
    AutoItem,
  },

  props: ["fields", "col"],
  data() {
    return {}
  },

  computed: {
    showByField() {
      return (field) => {
        if (field.showBy && Object.keys(field.showBy).length > 0) {
          for (let z = 0; z < this.fields.length; z++) {
            const fieldGroup = this.fields[z];
            for (let j = 0; j < fieldGroup.length; j++) {
              const _field = fieldGroup[j];
              const keys = Object.keys(field.showBy);
              for (let i = 0; i < keys.length; i++) {
                if (
                  keys[i] == _field.name &&
                  field.showBy[keys[i]] == _field.value
                ) {
                  return true;
                }
              }
            }
          }
          return false;
        } else {
          return true;
        }
      };
    },
  },

  methods: {
    change(e) {
      this.$emit("change", e);
    },
  },
};
</script>

<style lang="less" scoped>
  .form {
    .form-row {
      margin: 0 -8px;
    }
    .ant-col-md-12,
    .ant-col-sm-24,
    .ant-col-lg-6,
    .ant-col-lg-8,
    .ant-col-lg-10,
    .ant-col-xl-8,
    .ant-col-xl-6 {
      padding: 0 8px;
    }
  }
  .form-width {
    min-width: 150px;
  }
</style>
