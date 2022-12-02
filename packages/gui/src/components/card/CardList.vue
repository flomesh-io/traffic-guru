<template>
  <div class="card-list">
    <a-config-provider>
      <template #renderEmpty>
        <a-result
          v-if="dataSource.length == 0 && !!resultEmpty"
          :title="resultEmpty.title"
          :sub-title="resultEmpty.subTitle"
        >
          <template #icon>
            <img
              src="../../assets/img/empty.svg"
              style="width: 300px"
            >
          </template>
        </a-result>
        <a-empty
          v-else-if="dataSource.length == 0 && empty"
          :image="simpleImage"
        >
          <template #description>
            <span v-if="typeof empty == 'object'">
              <span
                v-for="(text, index) in empty"
                :key="index"
              >
                <a-button
                  type="link"
                  v-if="text.link"
                  @click="text.link"
                >{{
                  text.text
                }}</a-button>
                <span v-else>{{ text.text }}</span>
              </span>
            </span>
            <span v-else>{{ empty || $t("No data") }}</span>
          </template>
        </a-empty>
        <a-empty
          :image="simpleImage"
          v-else-if="dataSource.length == 0 && !empty"
        />
      </template>

      <a-list
        :data-source="
          add && dataSource.length > 0
            ? [
              { key: 'add' },
              ...(loading && dataSource.length == 0 ? [{}] : dataSource),
            ]
            : loading && dataSource.length == 0
              ? [{}]
              : dataSource
        "
        :grid="
          col
            ? { gutter: 10, xs: 1, sm: 2, md: col, lg: col, xl: col, xxl: col }
            : { gutter: 10, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }
        "
      >
        <template #renderItem="{ item, index }">
          <a-list-item v-if="add && dataSource.length > 0 && index == 0">
            <div class="list-item">
              <a-button
                @click="add.call"
                class="new-btn"
                type="dashed"
                :style="add.height ? 'height:' + add.height : ''"
              >
                <PlusCircleTwoTone />{{ add.text }}
              </a-button>
            </div>
          </a-list-item>
          <a-list-item v-else>
            <a-skeleton
              :loading="loading"
              active
              avatar
            >
              <div
                class="list-item"
                v-if="Object.keys(item).length > 0"
              >
                <a-card
                  :loading="!!item.loading"
                  :hoverable="true"
                >
                  <slot :item="item" />
                  <template #actions>
                    <ul
                      class="action-inner ant-card-actions"
                      v-if="actions && actions.length > 0"
                    >
                      <template
                        v-for="(action, index2) in actions"
                      >
                        <li
                          :key="index2"
                          v-if="
                            !action.hide &&
                              (!action.showFun || action.showFun(item))
                          "
                          v-permission="
                            action.permissionWhere
                              ? item[action.permissionWhere[1]]
                                ? [
                                  action.permissionWhere[0] +
                                    item[action.permissionWhere[1]].id,
                                ]
                                : [action.permissionWhere[2]]
                              : action.permission
                          "
                        >
                          <a-tooltip>
                            <template #title>
                              {{ $t(action.text) }}
                            </template>
                            <svg
                              v-if="action.svg"
                              class="ant-card-action-item icon"
                              :class="action.className"
                              aria-hidden="true"
                            >
                              <use :xlink:href="action.svg" />
                            </svg>

                            <a-popconfirm
                              v-if="
                                action.icon &&
                                  (action.icon == 'DeleteOutlined' ||
                                    action.icon == 'CloseOutlined')
                              "
                              placement="topLeft"
                              :ok-text="$t('Yes')"
                              :cancel-text="$t('No')"
                              @confirm="doAction(action, index, type, item)"
                            >
                              <template #title>
                                <p>{{ $t("Tip") }}</p>
                                <p>{{ $t("Are you sure to delete this?") }}</p>
                              </template>
                              <a>
                                <component
                                  :class="action.className"
                                  :style="
                                    action.text && !hideActionTitle
                                      ? 'width: auto;margin-right:10px'
                                      : ''
                                  "
                                  v-if="action.icon"
                                  :is="actionicon[action.icon]"
                                  two-tone-color="#333"
                                />&nbsp;
                                <span v-if="action.text && !hideActionTitle">{{
                                  $t(action.text)
                                }}</span>
                              </a>
                            </a-popconfirm>
                            <a
                              @click="doAction(action, index, type, item)"
                              v-else
                            >
                              <component
                                :class="action.className"
                                :style="
                                  action.text && !hideActionTitle
                                    ? 'width: auto;margin-right:10px'
                                    : ''
                                "
                                v-if="action.icon"
                                :is="actionicon[action.icon]"
                                two-tone-color="#333"
                              />&nbsp;
                              <span v-if="action.text && !hideActionTitle">{{
                                $t(action.text)
                              }}</span>
                            </a>
                          </a-tooltip>
                        </li>
                      </template>
                      <li v-if="moreAction.length > 0">
                        <a-dropdown>
                          <template #overlay>
                            <a-menu>
                              <a-menu-item
                                :disabled="
                                  !(!action.showFun || action.showFun(item))
                                "
                                :class="
                                  !action.showFun || action.showFun(item)
                                    ? ''
                                    : 'disabled'
                                "
                                v-for="(action, index2) in moreAction"
                                :key="index2"
                              >
                                <a-popconfirm
                                  v-if="
                                    action.icon == 'DeleteOutlined' ||
                                      action.icon == 'CloseOutlined'
                                  "
                                  placement="topLeft"
                                  :ok-text="$t('Yes')"
                                  :cancel-text="$t('No')"
                                  @confirm="
                                    doAction(action, index, type, item)
                                  "
                                >
                                  <template #title>
                                    <p>{{ $t("Tip") }}</p>
                                    <p>
                                      {{ $t("Are you sure to delete this?") }}
                                    </p>
                                  </template>
                                  <a
                                    v-permission="
                                      action.permissionWhere
                                        ? item[action.permissionWhere[1]]
                                          ? [
                                            action.permissionWhere[0] +
                                              item[action.permissionWhere[1]]
                                                .id,
                                          ]
                                          : [action.permissionWhere[2]]
                                        : action.permission
                                    "
                                  >
                                    <svg
                                      v-if="action.svg"
                                      class="icon svg-icon"
                                      :class="action.className"
                                      aria-hidden="true"
                                    >
                                      <use :xlink:href="action.svg" />
                                    </svg>
                                    <component
                                      v-if="action.icon"
                                      :is="actionicon[action.icon]"
                                      two-tone-color="#333"
                                    />&nbsp;
                                    <span v-if="action.text">{{
                                      $t(action.text)
                                    }}</span>
                                  </a>
                                </a-popconfirm>
                                <a
                                  v-permission="
                                    action.permissionWhere
                                      ? item[action.permissionWhere[1]]
                                        ? [
                                          action.permissionWhere[0] +
                                            item[action.permissionWhere[1]]
                                              .id,
                                        ]
                                        : [action.permissionWhere[2]]
                                      : action.permission
                                  "
                                  @click="doAction(action, index, type, item)"
                                  v-else
                                >
                                  <svg
                                    v-if="action.svg"
                                    class="icon svg-icon"
                                    :class="action.className"
                                    aria-hidden="true"
                                  >
                                    <use :xlink:href="action.svg" />
                                  </svg>
                                  <component
                                    v-if="action.icon"
                                    :is="actionicon[action.icon]"
                                    two-tone-color="#333"
                                  />&nbsp;
                                  <span v-if="action.text">{{
                                    $t(action.text)
                                  }}</span>
                                </a>
                              </a-menu-item>
                            </a-menu>
                          </template>
                          <a><MoreOutlined /></a>
                        </a-dropdown>
                      </li>
                    </ul>
                  </template>
                </a-card>
              </div>
            </a-skeleton>
          </a-list-item>
        </template>
      </a-list>
    </a-config-provider>
  </div>
</template>

<script>
import { Empty } from "ant-design-vue";
import {
  PlusCircleTwoTone,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  DeleteOutlined,
  KeyOutlined,
  MoreOutlined,
  CheckOutlined,
  EditOutlined,
  MedicineBoxOutlined,
  DisconnectOutlined,
  LinkOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
  UsergroupAddOutlined,
  SelectOutlined,
  ExportOutlined,
  ImportOutlined,
  CaretRightOutlined,
  MinusSquareTwoTone,
} from "@ant-design/icons-vue";
export default {
  name: "CardList",
  i18n: require("@/i18n"),
  components: {
    SelectOutlined,
    PlusCircleTwoTone,
    PlusOutlined,
    EyeOutlined,
    KeyOutlined,
    SearchOutlined,
    MoreOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckOutlined,
    MedicineBoxOutlined,
    ShoppingCartOutlined,
    DisconnectOutlined,
    LinkOutlined,
    CloseOutlined,
    UsergroupAddOutlined,
    ExportOutlined,
    ImportOutlined,
    CaretRightOutlined,
    MinusSquareTwoTone,
  },

  props: [
    "loading",
    "add",
    "hideActionTitle",
    "actions",
    "dataSource",
    "type",
    "col",
    "empty",
    "resultEmpty",
  ],

  emits: ["add"],

  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      actionicon: {
        SelectOutlined,
        PlusCircleTwoTone,
        PlusOutlined,
        EyeOutlined,
        SearchOutlined,
        KeyOutlined,
        MoreOutlined,
        DeleteOutlined,
        EditOutlined,
        MedicineBoxOutlined,
        ShoppingCartOutlined,
        DisconnectOutlined,
        LinkOutlined,
        CloseOutlined,
        UsergroupAddOutlined,
        ExportOutlined,
        ImportOutlined,
        CheckOutlined,
        CaretRightOutlined,
        MinusSquareTwoTone,
      },
    };
  },

  computed: {
    moreAction() {
      return this.actions.filter((action) => action.hide);
    },
  },

  created() {},

  methods: {
    createCard() {
      this.$emit("add", {});
    },

    doAction(action, index, type, item) {
      if (action.icon == "DeleteOutlined") {
        item.loading = true;
      }
      action.call(index, type, item);
    },
  },
};
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }
  .new-btn {
    border-radius: 2px;
    width: 100%;
    height: 147px;
  }
  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .list-item {
    padding-left: 8px;
    padding-right: 8px;
  }
  :deep(.disabled) {
    opacity: 0.2;
  }
  .ant-card-actions {
    display: flex !important;
  }
  .ant-card-actions li {
    flex: 1;
  }
  :deep(.ant-card-actions .anticon) {
    line-height: 28px;
    display: inline-block;
  }
  :deep(.ant-card-actions li) {
    margin: 0;
    span {
      display: inline;
    }
  }

  :deep(.ant-card-actions) {
    border-radius: 0 0 5px 5px !important;
  }

  .action-inner {
    border-top: none;
  }
  .action-inner li {
    margin: 10px 0;
  }
  .ant-card {
    border-radius: 5px;
  }
  .ant-card-actions {
    border-radius: 0 0 5px 5px !important;
  }
  .svg-icon {
    width: 18px;
    height: 18px;
    fill: #00adef;
    border-radius: 0;
    vertical-align: middle;
  }
  .ant-card-action-item {
    width: 18px;
    height: 18px;
    fill: #00adef;
    border-radius: 0;
    vertical-align: middle;
  }
</style>
