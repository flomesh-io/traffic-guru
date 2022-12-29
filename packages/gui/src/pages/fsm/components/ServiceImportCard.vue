<template>
  <a-descriptions
    bordered
    class="bg-white mb-15"
  >
    <a-descriptions-item
      :label="$t('Namespace')"
      :span="2"
    >
      {{ d.registry?.name }}/{{ d.namespace }}
    </a-descriptions-item>
    <a-descriptions-item
      :label="$t('Enabled')"
      :span="1"
    >
      <a-switch
        class="relative"
        style="top: -3px"
        v-model:checked="d.policySwitch"
      />
    </a-descriptions-item>
    <a-descriptions-item
      :label="$t('Type')"
      :span="3"
    >
      <a-radio-group
        v-model:value="d.content.type"
      >
        <a-radio-button value="Locality">
          {{ $t('Locality') }}
        </a-radio-button>
        <a-radio-button value="FailOver">
          {{ $t('FailOver') }}
        </a-radio-button>
        <a-radio-button value="ActiveActive">
          {{ $t('ActiveActive') }}
        </a-radio-button>
      </a-radio-group>
    </a-descriptions-item>
  </a-descriptions>
  <CardGroup
    v-if="d.content && d.content.targets && d.serviceExports"
    :fixed="true"
    :col="3"
    :cards="d.serviceExports"
  >
    <template #title>
      {{ $t('Export') }}
    </template>
    <template #extra="{ item }">
      <a-switch
        class="relative"
        style="top: -3px"
        v-model:checked="d.content.targets[item.id].enabled"
      />
    </template>
    <template #default="{ item }">
      <a-descriptions
        bordered
        class="bg-white"
      >
        <a-descriptions-item
          :label="$t('Namespace')"
          :span="3"
        >
          {{ item.service.registry?.name }} / {{ item.service.namespace }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="d.content.targets[item.id]"
          :label="$t('Service')"
          :span="3"
        >
          <div class="full">
            <DatabaseOutlined class="font-20 mr-10 primary" />
            <a
              class="pointer relative"
              style="top: -2px"
              @click="detail(item.service.id, item.service.namespace)"
            ><b>{{ item.service.name }}</b></a>
          </div>
        </a-descriptions-item>
        <a-descriptions-item
          v-if="d.content.type == 'ActiveActive'"
          :label="$t('Weight')"
          :span="3"
        >
          <FormItem
            :name="['content','targets', item.id, 'weight']"
            :rules="rules.weight"
          >
            <a-input-number
              v-model:value="d.content.targets[item.id].weight"
              :min="1"
            />
          </FormItem>
        </a-descriptions-item>
      </a-descriptions>
    </template>
  </CardGroup>
</template>

<script>
import FormItem from "@/components/tool/FormItem";
import CardGroup from "@/components/card/CardGroup";
import { mapState } from "vuex";
import {
  DatabaseOutlined,
} from "@ant-design/icons-vue";
export default {
  name: "ServiceImportCard",
  components: {
    FormItem,
    CardGroup,
    DatabaseOutlined,
  },

  props: ["d"],
  i18n: require("@/i18n"),
  computed: {
    ...mapState("rules", ["rules"]),
  },

  methods: {
    detail(id, namespace) {
      this.$router.push({
        path: `/fsm/service/detail/${namespace || "default"}/${id}`,
      });
    },
  }
};
</script>

<style lang="less" scoped></style>
