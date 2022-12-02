<template>
  <CardSelector
    :search="true"
    :multiple="multiple"
    :icon="PartitionOutlined"
    @select="orgChange"
    :options="orgs"
    :col="2"
  >
    <div>
      <PartitionOutlined v-if="false" />
      <a>
        {{ value ? value.name : $t("organization") }}
        <DownOutlined />
      </a>
    </div>
  </CardSelector>
</template>

<script>
import CardSelector from "@/components/card/CardSelector";
import { DownOutlined, PartitionOutlined } from "@ant-design/icons-vue";
export default {
  name: "OrgSelector",
  components: {
    DownOutlined,
    CardSelector,
    PartitionOutlined,
  },

  i18n: require("@/i18n"),
  props: ["value", "selector", "multiple"],
  data() {
    return {
      PartitionOutlined,
      orgs: [],
    };
  },

  computed: {},
  created() {
    this.loaddata();
  },

  methods: {
    loaddata() {
      this.loading = true;
      this.$gql.query(`organizations{id,name}`).then((res) => {
        this.orgs = res;
        if (res.length > 0 && !this.value) {
          localStorage.setItem("ORG-ID", res[0].id);
          localStorage.setItem("ORG-NAME", res[0].name);
          this.$emit("update:value", res[0]);
        }
        this.loading = false;
      });
    },

    emitChange(value) {
      this.$emit("orgChange", value);
      this.$emit("update:value", value);
    },

    orgChange(value) {
      this.emitChange(value);
      if (!this.selector) {
        localStorage.setItem("ORG-ID", value.id);
        localStorage.setItem("ORG-NAME", value.name);
        location.reload();
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
