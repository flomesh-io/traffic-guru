<template>
  <DetailList
    size="small"
    v-if="d.metadata"
    :col="1"
  >
    <DetailListItem
      v-if="d.metadata?.uid"
      :term="$t('UID')"
    >
      {{
        d.metadata.uid
      }}
    </DetailListItem>
    <DetailListItem
      :term="$t('as')"
    >
      {{ d.metadata.name }}
    </DetailListItem>
    <DetailListItem
      :term="$t('Namespace')"
    >
      {{ d.metadata.namespace }}
    </DetailListItem>
    <DetailListItem :term="$t('Creation Timestamp')">
      {{
        new Date(d.metadata.creationTimestamp).toLocaleString()
      }}
    </DetailListItem>
  </DetailList>
  <DetailList
    size="small"
    v-if="d.metadata"
    :col="1"
  >
    <DetailListItem :term="$t('Labels')">
      <a-tag
        :key="index"
        v-for="(key, index) in Object.keys(d.metadata.labels || [])"
        :closable="false"
      >
        {{ key }}:{{ d.metadata.labels[key] }}
      </a-tag>
    </DetailListItem>
    <DetailListItem :term="$t('Annotations')">
      <a-tag
        :key="index"
        v-for="(key, index) in Object.keys(
          d.metadata.annotations || [],
        )"
        :closable="false"
        class="mb-5"
      >
        <span v-if="key == 'objectset.rio.cattle.io/applied'">
          <a-tooltip
            placement="topLeft"
            :title="d.metadata.annotations[key]"
          >
            <a
              class="font-primary"
              href="javascript:void(0)"
            >{{ key }}</a>
          </a-tooltip>
        </span>
        <span v-else-if="key == proxyProfileKey">
          <a-popover
            trigger="click"
            :title="key"
          >
            <template #content>
              <Json2YamlCard
                :is-create="false"
                :is-readonly="true"
                :is-pop="true"
                v-if="proxyProfile"
                :json-val="proxyProfile"
              />
            </template>
            <a
              class="font-primary"
              href="javascript:void(0)"
            >{{ key }}</a>
          </a-popover>
        </span>
        <span
          v-else-if="
            key == 'kubectl.kubernetes.io/last-applied-configuration'
          "
        >
          <a-popover
            trigger="click"
            :title="key"
          >
            <template #content>
              <JsonEditor
                :is-json="true"
                :value="d.metadata.annotations[key]"
              />
            </template>
            <a
              class="font-primary"
              href="javascript:void(0)"
            >{{ key }}</a>
          </a-popover>
        </span>
        <span
          v-else
        >{{ key }}:{{ d.metadata.annotations[key] }}</span>
      </a-tag>
    </DetailListItem>
  </DetailList>
</template>

<script>
import JsonEditor from "@/components/editor/JsonEditor";
import DetailList from "@/components/tool/DetailList";
import DetailListItem from "@/components/tool/DetailListItem";
import Json2YamlCard from "@/components/card/Json2YamlCard";
export default {
  name: "DetailHeader",
  i18n: require("@/i18n"),
  components: {
    DetailListItem,
    DetailList,
    Json2YamlCard,
    JsonEditor,
  },
	
  props:['d'],
	
  data() {
    return {
      proxyProfile: null,
      proxyProfileKey: "flomesh.io/proxy-profile",
    };
  },

};
</script>

