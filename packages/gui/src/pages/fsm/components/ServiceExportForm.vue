<template>
  <a-descriptions
    bordered
    class="bg-white"
    v-if="d"
  >
    <a-descriptions-item
      :label="$t('path')"
      :span="3"
    >
      <FormItem
        :name="['content', 'path']"
        :rules="rules.path"
      >
        <a-input
          v-model:value="d.content.path"
          :placeholder="$t('unset')"
        />
      </FormItem>
    </a-descriptions-item>
    <a-descriptions-item
      :label="$t('Port')"
      :span="3"
    >
      <FormItem
        :name="['content','portNumber']"
        :rules="rules.numberRequired"
      >
        <a-select
          :placeholder="$t('unset')"
          v-model:value="d.content.portNumber"
          class="width-180"
          ref="select"
          allow-clear
        >
          <a-select-option
            :value="port.port"
            :key="index"
            v-for="(port, index) in ports"
          >
            {{ port.port }}
          </a-select-option>
        </a-select>
      </FormItem>
    </a-descriptions-item>
  </a-descriptions>
</template>

<script>
import FormItem from "@/components/tool/FormItem";
import { mapState } from "vuex";

export default {
  name: "ServiceExportForm",
  i18n: require("@/i18n"),
  components: {
    FormItem,
  },

  props: ['d','ports'],
  data() {
    return {
      payload:{content:{portNumber:null,path:''}},
    };
  },

  computed: {
    ...mapState("rules", ["rules"]),
  },
	
  watch:{
    d: {
      deep: true,
      immediate: true,
      handler(v) {
        this.payload = v;
      },
    },
  },

  created() {},

  methods: {
  },
};
</script>
