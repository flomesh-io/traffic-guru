<template>
  <div>
    <CardList
      :hide-action-title="true"
      :loading="loading"
      :data-source="users"
      type="component"
      :actions="
        noAction
          ? null
          : (actions?actions:[
            {
              icon: 'EditOutlined',
              text: $t('edit'),
              call: setting,
              permission: ['user:update'],
            },
            {
              icon: 'CloseOutlined',
              hide: true,
              text: $t('delete'),
              call: remove,
              permission: ['user:delete'],
            },
          ])
      "
    >
      <template #default="{ item }">
        <a-card-meta>
          <template #title>
            <div class="mb-3">
              {{ item.username }}
              <a-tag
                v-if="item.role"
                color="blue"
                class="ml-10"
              >
                {{ item.role.name }}
              </a-tag>
            </div>
          </template>
          <template #avatar>
            <CrownTwoTone
              v-if="item.role && item.role.name == 'Authenticated'"
              two-tone-color="#00adef"
              class="font-50"
            />
            <CustomerServiceTwoTone
              v-else-if="item.role && item.role.name == 'Public'"
              two-tone-color="#00adef"
              class="font-50"
            />
            <IdcardTwoTone
              v-else
              two-tone-color="#00adef"
              class="font-50"
            />
          </template>
          <template #description>
            <div class="meta-content">
              {{ $t("Email") }}：{{ item.email || $t("unset") }}
            </div>
          </template>
        </a-card-meta>
      </template>
    </CardList>
    <a-pagination
      v-if="pageNoVal >= 0"
      @change="search"
      v-model:current="pageNoVal"
      :total="total"
      :page-size="pageSize"
      show-less-items
    />
  </div>
</template>

<script>
import {
  CustomerServiceTwoTone,
  IdcardTwoTone,
  CrownTwoTone,
} from "@ant-design/icons-vue";
import CardList from "@/components/card/CardList";

export default {
  name: "UsersResults",
  components: {
    CardList,
    IdcardTwoTone,
    CrownTwoTone,
    CustomerServiceTwoTone,
  },

  i18n: require("@/i18n"),
  props: ["users", "total", "pageNo", "pageSize", "loading", "actions", "noAction"],
  data() {
    return {
      pageNoVal: 0,
    };
  },

  computed: {},
	
  watch: {
    pageNoVal: {
      deep: true,
      handler() {
        this.$emit("update:pageNo", this.pageNoVal);
      },
    },
  },
	
  mounted() {
    this.pageNoVal = this.pageNo;
  },
	
  methods: {
    search(pageNo, pageSize, call) {
      this.$emit("search", pageNo, pageSize, call);
    },

    remove(index, type, item) {
      this.$emit("remove", index, type, item);
    },

    setting(index, type, item) {
      this.$emit("setting", index, type, item);
    },
		
  },
};
</script>

<style lang="less" scoped>
  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    height: auto;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
  }
</style>
