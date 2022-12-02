<template>
  <PageLayout
    :title="org.name || ''"
    :avatar="PartitionOutlined"
  >
    <template #headerContent>
      <div />
    </template>
    <template #extra>
      <HeadInfo
        v-permission="['organization:update']"
        class="split-right"
        :title="$t('Add Project')"
      >
        <template #body>
          <div>
            <CardSelector
              :search="true"
              :icon="FolderTwoTone"
              @select="addProject"
              :options="projects"
              :disabled="(item) => item.organization_id"
              v-model:value="selectProjects"
            >
              <PlusCircleTwoTone class="font-primary icon-menu rotate-icon" />
            </CardSelector>
          </div>
        </template>
      </HeadInfo>
      <HeadInfo
        v-permission="['organization:update']"
        class="split-right"
        :title="$t('Add User')"
      >
        <template #body>
          <div>
            <CardSelector
              :search="true"
              :icon="UserOutlined"
              @select="addUser"
              :disabled="
                (item) => {
                  let disabled = false;
                  (item.userOrganizations || []).forEach((organization) => {
                    disabled = organization.id == pid || disabled;
                  });
                  return disabled;
                }
              "
              :options="users"
              v-model:value="selectUsers"
            >
              <PlusCircleTwoTone class="font-primary icon-menu rotate-icon" />
            </CardSelector>
          </div>
        </template>
      </HeadInfo>
    </template>
    <a-tabs type="card">
      <a-tab-pane
        key="1"
        :tab="$t('Overview')"
      >
        <a-skeleton
          :loading="loading"
          active
        />
        <a-row
          class="row-mg"
          v-show="!loading"
        >
          <a-col
            v-if="!loading"
            class="col-pd"
            :xl="24"
            :lg="24"
            :md="24"
            :sm="24"
            :xs="24"
          >
            <a-card class="card mb-20 nopd">
              <div class="flex min-height-200">
                <div class="flex-item">
                  <a-empty
                    :image="simpleImage"
                    :description="$t('Projects not added')"
                    v-if="!org.projects || org.projects.length == 0"
                    class="mt-100"
                  />
                  <a-card-grid
                    class="full pd-20"
                    :key="index"
                    v-for="(project, index) in org.projects"
                  >
                    <TaskGroup
                      class="task-group"
                      handle=".handle"
                      @change="saveProjectChange($event, project, org)"
                      :title="$t('Project') + ' : ' + project.name"
                      :group="{ name: org.name, pull: 'clone' }"
                      v-model:list="project.users"
                    >
                      <template #actions>
                        <a><EyeOutlined
                          class="icon-menu"
                          @click="goProject(project.id)"
                        /></a>
                        <a-divider type="vertical" />
                        <a-dropdown placements="topLeft">
                          <template #overlay>
                            <a-menu>
                              <a-menu-item>
                                <a-popconfirm
                                  placement="topLeft"
                                  :ok-text="$t('Yes')"
                                  :cancel-text="$t('No')"
                                  @confirm="removeProject(project.id, org)"
                                >
                                  <template #title>
                                    <p>{{ $t("Tip") }}</p>
                                    <p>
                                      {{ $t("Are you sure to remove this?") }}
                                    </p>
                                  </template>
                                  <a v-permission="['organization:update']">{{
                                    $t("Remove")
                                  }}</a>
                                </a-popconfirm>
                              </a-menu-item>
                            </a-menu>
                          </template>
                          <a><MoreOutlined class="icon-menu" /></a>
                        </a-dropdown>
                      </template>
                      <template #item="item">
                        <div
                          class="userline"
                          :title="item.data.id + ',' + item.data.username"
                        >
                          <CrownTwoTone
                            v-if="
                              item.data.role &&
                                item.data.role.name == 'Authenticated'
                            "
                            two-tone-color="#00adef"
                            class="usericon"
                          />
                          <CustomerServiceTwoTone
                            v-else-if="
                              item.data.role && item.data.role.name == 'Public'
                            "
                            class="usericon"
                          />
                          <IdcardTwoTone
                            v-else
                            two-tone-color="#00adef"
                            class="IdcardTwoTone usericon"
                          />
                          <span
                            class="title"
                          >{{ item.data.username }}
                            <a-tag
                              v-if="
                                userOrganizationRolesMap[
                                  'project-' + project.id + '-' + item.data.id
                                ]
                              "
                              color="blue"
                              :closable="true"
                              @close.prevent="
                                deleteUserOrganizationRoles(
                                  userOrganizationRolesMap[
                                    'project-' + project.id + '-' + item.data.id
                                  ].id,
                                )
                              "
                              class="ml-10"
                            >
                              {{
                                userOrganizationRolesMap[
                                  "project-" + project.id + "-" + item.data.id
                                ].role.name
                              }}
                            </a-tag>
                          </span>
                          <span class="rightSpan">
                            <SwapOutlined
                              v-permission="['organization:update']"
                              class="handle move primary"
                            />
                            <a-divider
                              v-permission="['organization:update']"
                              type="vertical"
                            />
                            <a-dropdown
                              trigger="click"
                              placements="topRight"
                            >
                              <template #overlay>
                                <a-menu>
                                  <a-menu-item>
                                    <a-popover
                                      v-model:visible="item.visible"
                                      :destroy-tooltip-on-hide="true"
                                      placement="topRight"
                                      trigger="click"
                                    >
                                      <template #content>
                                        <p>
                                          <a-select
                                            :placeholder="$t('unset')"
                                            class="width-500"
                                            v-model:value="
                                              permissionPayload.userOrganizationRole
                                            "
                                            @change="setDefaultResources"
                                          >
                                            <a-select-option
                                              v-for="(
                                                projectRole, index2
                                              ) in projectRoles"
                                              :key="index2"
                                              :value="projectRole.id"
                                            >
                                              <span>
                                                <IdcardTwoTone
                                                  two-tone-color="#00adef"
                                                  class="font-30"
                                                />
                                                <span class="role-name">{{
                                                  projectRole.name
                                                }}</span>
                                              </span>
                                            </a-select-option>
                                          </a-select>
                                        </p>
                                        <p>
                                          <PermissionCard
                                            :resources="resources"
                                            v-if="resources.length > 0"
                                          />
                                        </p>
                                        <p>
                                          <a-button
                                            type="primary"
                                            @click="
                                              saveUserOrganizationRoles(
                                                item.data.id,
                                                org.id,
                                                project.id,
                                                permissionPayload.userOrganizationRole,
                                                'project',
                                              );
                                              item.visible = false;
                                            "
                                          >{{ $t("Ok") }}</a-button>
                                        </p>
                                      </template>
                                      <template #title>
                                        <span>{{
                                          $t("Set Project Role")
                                        }}</span>
                                      </template>
                                      <a
                                        v-if="$isPro"
                                        v-permission="['organization:update']"
                                        @click="
                                          setPermissionPayload(
                                            item.data.id,
                                            org.id,
                                            project.id,
                                            permissionPayload.userOrganizationRole,
                                            'project',
                                          )
                                        "
                                      >{{ $t("Set Project Role") }}</a>
                                    </a-popover>
                                  </a-menu-item>
                                  <a-menu-item>
                                    <a-popconfirm
                                      placement="topLeft"
                                      :ok-text="$t('Yes')"
                                      :cancel-text="$t('No')"
                                      @confirm="
                                        delProjectUser(item.data, project)
                                      "
                                    >
                                      <template #title>
                                        <p>{{ $t("Tip") }}</p>
                                        <p>
                                          {{
                                            $t("Are you sure to remove this?")
                                          }}
                                        </p>
                                      </template>
                                      <a
                                        v-permission="['organization:update']"
                                      >{{ $t("Remove") }}</a>
                                    </a-popconfirm>
                                  </a-menu-item>
                                </a-menu>
                              </template>
                              <a><MoreOutlined class="rightIcon" /></a>
                            </a-dropdown>
                          </span>
                        </div>
                      </template>
                    </TaskGroup>
                  </a-card-grid>
                </div>
                <div class="flex-item">
                  <a-card-grid class="full pd-20">
                    <TaskGroup
                      class="task-group"
                      handle=".handle"
                      :title="$t('Organization members')"
                      :group="{ name: org.name, pull: 'clone' }"
                      v-model:list="org.users"
                      @change="orgChange"
                    >
                      <template #actions />
                      <template #item="item">
                        <div
                          class="userline"
                          :title="item.data.id + ',' + item.data.username"
                        >
                          <CrownTwoTone
                            v-if="
                              item.data.role &&
                                item.data.role.name == 'Authenticated'
                            "
                            two-tone-color="#00adef"
                            class="usericon"
                          />
                          <CustomerServiceTwoTone
                            v-else-if="
                              item.data.role && item.data.role.name == 'Public'
                            "
                            two-tone-color="#00adef"
                            class="usericon"
                          />
                          <IdcardTwoTone
                            v-else
                            two-tone-color="#00adef"
                            class="IdcardTwoTone usericon"
                          />
                          <span
                            class="title"
                          >{{ item.data.username }}
                            <a-tag
                              v-if="
                                userOrganizationRolesMap[
                                  'organization-' + item.data.id
                                ] &&
                                  userOrganizationRolesMap[
                                    'organization-' + item.data.id
                                  ].role
                              "
                              color="orange"
                              :closable="true"
                              @close.prevent="
                                deleteUserOrganizationRoles(
                                  userOrganizationRolesMap[
                                    'organization-' + item.data.id
                                  ].id,
                                )
                              "
                              class="ml-10"
                            >
                              {{
                                userOrganizationRolesMap[
                                  "organization-" + item.data.id
                                ].role.name
                              }}
                            </a-tag>
                          </span>
                          <span class="rightSpan">
                            <SwapOutlined
                              v-permission="['organization:update']"
                              class="handle move primary"
                            />
                            <a-divider
                              v-permission="['organization:update']"
                              type="vertical"
                            />
                            <a-dropdown trigger="click">
                              <template #overlay>
                                <a-menu>
                                  <a-menu-item>
                                    <a-popover
                                      v-model:visible="item.visible"
                                      :destroy-tooltip-on-hide="true"
                                      placement="topLeft"
                                      trigger="click"
                                    >
                                      <template #content>
                                        <p>
                                          <a-select
                                            :placeholder="$t('unset')"
                                            class="width-500"
                                            v-model:value="
                                              permissionPayload.userOrganizationRole
                                            "
                                            @change="setDefaultResources"
                                          >
                                            <a-select-option
                                              v-for="(
                                                organizationRole, index
                                              ) in organizationRoles"
                                              :key="index"
                                              :value="organizationRole.id"
                                            >
                                              <span>
                                                <IdcardTwoTone
                                                  two-tone-color="#00adef"
                                                  class="font-30"
                                                />
                                                <span class="role-name">{{
                                                  organizationRole.name
                                                }}</span>
                                              </span>
                                            </a-select-option>
                                          </a-select>
                                        </p>
                                        <p>
                                          <PermissionCard
                                            :resources="resources"
                                            v-if="resources.length > 0"
                                          />
                                        </p>
                                        <p>
                                          <a-button
                                            type="primary"
                                            @click="
                                              saveUserOrganizationRoles(
                                                item.data.id,
                                                org.id,
                                                null,
                                                permissionPayload.userOrganizationRole,
                                                'organization',
                                              )
                                            "
                                          >{{ $t("Ok") }}</a-button>
                                        </p>
                                      </template>
                                      <template #title>
                                        <span>{{
                                          $t("Set Organization Role")
                                        }}</span>
                                      </template>
                                      <a
                                        v-permission="['organization:update']"
                                        @click="
                                          setPermissionPayload(
                                            item.data.id,
                                            org.id,
                                            null,
                                            permissionPayload.userOrganizationRole,
                                            'organization',
                                          );
                                          item.visible = false;
                                        "
                                      >{{ $t("Set Organization Role") }}</a>
                                    </a-popover>
                                  </a-menu-item>
                                  <a-menu-item>
                                    <a-popconfirm
                                      placement="topLeft"
                                      :ok-text="$t('Yes')"
                                      :cancel-text="$t('No')"
                                      @confirm="delUser(item.data.id, org)"
                                    >
                                      <template #title>
                                        <p>{{ $t("Tip") }}</p>
                                        <p>
                                          {{
                                            $t("Are you sure to remove this?")
                                          }}
                                        </p>
                                      </template>
                                      <a
                                        v-permission="['organization:update']"
                                      >{{ $t("Remove") }}</a>
                                    </a-popconfirm>
                                  </a-menu-item>
                                </a-menu>
                              </template>
                              <a><MoreOutlined class="rightIcon" /></a>
                            </a-dropdown>
                          </span>
                        </div>
                      </template>
                    </TaskGroup>
                  </a-card-grid>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        :tab="$t('Service')"
        v-if="$isPro"
      >
        <a-radio-group
          v-model:value="serviceType"
          class="service-type"
          v-if="$isPro"
        >
          <a-radio :value="1">
            {{ $t("My Service") }}
          </a-radio>
          <a-radio :value="2">
            {{ $t("Subscribe Service") }}
          </a-radio>
        </a-radio-group>
        <a-row :gutter="16">
          <a-col :span="settingVisible ? 16 : 24">
            <a-table
              :columns="dataColumns"
              :pagination="false"
              :data-source="serviceType == 1 ? services : subscribeServices"
              class="bg-white"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'name'">
                  <div>
                    <a
                      href="javascript:void(0)"
                      @click="detailsvc(record.id, record.namespace)"
                    >{{ record.name }}</a>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'appliesCnt'">
                  <div v-if="record.appliesCnt > 0">
                    <a-badge
                      :count="record.appliesCnt"
                      @click="showSetting(record)"
                    />
                  </div>
                  <div v-else>
                    -
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'labels'">
                  <div v-if="record.labels">
                    <a-tag
                      :key="index"
                      v-for="(key, index) in Object.keys(record.labels)"
                      :closable="false"
                    >
                      {{ key }}:{{ record.labels[key] }}
                    </a-tag>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                  <div>
                    <a><SettingOutlined
                      @click="showSetting(record)"
                      class="font-18 mr-10"
                    /></a>
                    <a-dropdown>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item
                            v-if="$isPro"
                            v-permission="['service:find']"
                          >
                            <a
                              @click="svcdetail(record.id, record.namespace)"
                            >{{ $t("edit") }}</a>
                          </a-menu-item>
                          <a-menu-item>
                            <a-popconfirm
                              placement="topLeft"
                              :ok-text="$t('Yes')"
                              :cancel-text="$t('No')"
                              @confirm="svcremove(record.id)"
                            >
                              <template #title>
                                <p>{{ $t("Tip") }}</p>
                                <p>{{ $t("Are you sure to delete this?") }}</p>
                              </template>
                              <a v-permission="['service:delete']">{{
                                $t("delete")
                              }}</a>
                            </a-popconfirm>
                          </a-menu-item>
                        </a-menu>
                      </template>
                      <a><MoreOutlined /></a>
                    </a-dropdown>
                  </div>
                </template>
              </template>
            </a-table>
          </a-col>
          <a-col
            v-if="settingVisible"
            :span="8"
          >
            <a-card
              class="card full nopd"
              v-if="targetSvc"
              :title="targetSvc.name"
            >
              <template #extra>
                <a
                  href="javascript:void(0)"
                  @click="closeSetting"
                ><CloseOutlined /></a>
              </template>
              <a-descriptions
                bordered
                size="small"
              >
                <a-descriptions-item
                  :label="$t('Organization')"
                  :span="3"
                >
                  {{
                    targetSvc.organizationName
                  }}
                </a-descriptions-item>
                <a-descriptions-item
                  v-if="serviceType == 1"
                  :label="$t('Permission')"
                  :span="3"
                >
                  <a-radio-group
                    v-model:value="targetSvc.scope"
                    @change="changeScope(targetSvc)"
                  >
                    <a-radio :value="1">
                      {{ $t("Public") }}
                    </a-radio>
                    <a-radio :value="2">
                      {{ $t("Private") }}
                    </a-radio>
                  </a-radio-group>
                </a-descriptions-item>
                <a-descriptions-item
                  v-if="serviceType == 2"
                  :label="$t('Action')"
                  :span="3"
                >
                  <a @click="unsubscribe(targetSvc, org)">{{
                    $t("Unsubscribe")
                  }}</a>
                </a-descriptions-item>
              </a-descriptions>
              <div
                v-if="serviceType == 1"
                class="pd-10"
              >
                <a-tabs type="card">
                  <a-tab-pane key="1">
                    <template #tab>
                      {{ $t("Subscribe") }}
                      <span
                        v-if="targetSvc.subscribeOrgCnt > 0"
                      >({{ targetSvc.subscribeOrgCnt }})</span>
                    </template>
                    <a-list
                      item-layout="horizontal"
                      :data-source="targetSvc.subscribeOrgs"
                    >
                      <template #renderItem="{ item }">
                        <a-list-item>
                          <a-list-item-meta
                            :description="
                              item.description ? item.description : '-'
                            "
                          >
                            <template #title>
                              <a>{{ item.name }}</a>
                            </template>
                            <template #avatar>
                              <PartitionOutlined class="primary" />
                            </template>
                          </a-list-item-meta>
                          <template #extra>
                            <StopOutlined
                              class="danger icon-menu mr-10"
                              v-permission="['organization:update']"
                              @click="removeSubscribe(targetSvc, item)"
                            />
                          </template>
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-tab-pane>
                  <a-tab-pane key="2">
                    <template #tab>
                      {{ $t("Applies") }}
                      <span v-if="targetSvc.appliesCnt > 0">
                        <a-badge :count="targetSvc.appliesCnt" />
                      </span>
                    </template>
                    <a-list
                      item-layout="horizontal"
                      :data-source="targetSvc.subscribeServiceApplies"
                    >
                      <template #renderItem="{ item }">
                        <a-list-item>
                          <a-list-item-meta
                            :description="
                              new Date(item.updated_at).toLocaleString()
                            "
                          >
                            <template #title>
                              <b>{{ item.applyOrganization.name }}</b> ({{
                                item.applyUser.username
                              }})
                              {{ $t("applies for subscription") }}
                            </template>
                            <template #avatar>
                              <PartitionOutlined class="primary" />
                            </template>
                          </a-list-item-meta>
                          <template #extra>
                            <div
                              class="width-60"
                              v-if="item.status == 0"
                            >
                              <a
                                href="javascript:void(0)"
                                @click="refuseApply(targetSvc, item)"
                              ><CloseOutlined /></a>
                              <a
                                href="javascript:void(0)"
                                @click="approvalApply(targetSvc, item)"
                                class="ml-15"
                              ><CheckOutlined /></a>
                            </div>
                            <div
                              class="font-green icon-menu width-60"
                              v-else-if="item.status == 1"
                            >
                              {{ $t("Approval") }}
                            </div>
                            <div
                              class="font-indianred icon-menu width-60"
                              v-else-if="item.status == 2"
                            >
                              {{ $t("Refuse") }}
                            </div>
                          </template>
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-tab-pane>
                </a-tabs>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane
        key="3"
        :tab="$t('ACL')"
        v-if="$isPro"
      >
        <a-card :title="$t('Organization White')">
          <a-transfer
            :titles="[$t('Organization'), ' ' + $t('Added')]"
            :data-source="white.list"
            v-model:target-keys="org.whiteOrgs"
            :show-search="true"
            :filter-option="
              (inputValue, item) => item.name.indexOf(inputValue) !== -1
            "
            :show-select-all="false"
            @search="whiteSearch"
            @change="onWhiteChange"
          >
            <template
              #children="{
                direction,
                filteredItems,
                selectedKeys,
                disabled: listDisabled,
                onItemSelectAll,
                onItemSelect,
              }"
            >
              <a-table
                :row-selection="
                  getRowSelection(
                    listDisabled,
                    selectedKeys,
                    onItemSelectAll,
                    onItemSelect,
                  )
                "
                :columns="
                  direction === 'left' ? dataleftColumns : datarightColumns
                "
                :data-source="filteredItems"
                size="small"
                :pagination="
                  direction === 'left'
                    ? {
                      onChange: whitePagging,
                      current: white.pageNo,
                      pageSize: white.pageSize,
                      showTotal: (total, range) => `${$t('Total')} ${total}`,
                      total: white.total,
                    }
                    : false
                "
                :style="{ pointerEvents: listDisabled ? 'none' : null }"
                :custom-row="
                  ({ key, disabled: itemDisabled }) => ({
                    onClick: () => {
                      if (itemDisabled || listDisabled) return;
                      onItemSelect(key, !selectedKeys.includes(key));
                    },
                  })
                "
              />
            </template>
          </a-transfer>
        </a-card>
      </a-tab-pane>
    </a-tabs>
    <PartitionOutlined v-if="false" />
    <UserOutlined v-if="false" />
    <FolderTwoTone v-if="false" />
  </PageLayout>
</template>

<script>
import {
  EyeOutlined,
  IdcardTwoTone,
  CrownTwoTone,
  PlusCircleTwoTone,
  UserOutlined,
  PartitionOutlined,
  CustomerServiceTwoTone,
  MoreOutlined,
  CloseOutlined,
  CheckOutlined,
  StopOutlined,
  SettingOutlined,
  SwapOutlined,
  FolderTwoTone,
} from "@ant-design/icons-vue";
import PageLayout from "@/layouts/PageLayout";
import CardSelector from "@/components/card/CardSelector";
import HeadInfo from "@/components/tool/HeadInfo";
import TaskGroup from "@/components/task/TaskGroup";
import PermissionCard from "@/components/card/PermissionCard";
import _ from "lodash";
import { mapGetters } from "vuex";
import { Empty } from "ant-design-vue";

const columns = [
  {
    key: "as",
    dataIndex: "name",
  },
  {
    key: "Organization",
    width: 130,
    dataIndex: "organizationName",
  },
  {
    key: "Namespace",
    width: 130,
    dataIndex: "namespace",
  },
  {
    key: "Registry",
    dataIndex: "registryName",
  },
];
const columnsFree = [
  ...columns,
  {
    key: "Action",
    width: 130,
    dataIndex: "action",
  },
];
const columnsPro = [
  ...columns,
  {
    key: "Subscribe",
    dataIndex: "subscribeOrgCnt",
  },
  {
    key: "Applies",
    dataIndex: "appliesCnt",
  },
  {
    key: "Action",
    width: 130,
    dataIndex: "action",
  },
];
export default {
  name: "OrganizationDetail",
  components: {
    EyeOutlined,
    HeadInfo,
    PageLayout,
    PlusCircleTwoTone,
    UserOutlined,
    PartitionOutlined,
    IdcardTwoTone,
    CrownTwoTone,
    CustomerServiceTwoTone,
    TaskGroup,
    MoreOutlined,
    CloseOutlined,
    SettingOutlined,
    CheckOutlined,
    PermissionCard,
    CardSelector,
    SwapOutlined,
    StopOutlined,
    FolderTwoTone,
  },

  i18n: require("@/i18n"),
  data() {
    return {
      PartitionOutlined,
      UserOutlined,
      FolderTwoTone,
      pid: "",
      users: [],
      targetSvc: null,
      org: { whiteOrgs: [] },
      serviceType: 1,
      columnsFree,
      columnsPro,
      services: [],
      subscribeServices: [],
      isEdit: false,
      selectProjects: null,
      selectUsers: null,
      roles: [],
      visible: false,
      projectVisible: false,
      organizationVisible: false,
      permissionPayload: {
        userOrganizationRole: null,
      },

      payload: {
        id: "",
        name: "",
        description: "",
      },

      white: {
        loading: true,
        key: "",
        pageSize: 10,
        pageNo: 1,
        total: 0,
        list: [],
      },

      bindTarget: {},
      editorIsCreate: true,
      workload: [],
      projects: [],
      pageSize: 4,
      pageNo: 1,
      total: 0,
      loading: true,
      activities: [],
      config: {},
      teams: [],
      resources: [],
      organizationRoles: [],
      projectRoles: [],
      settingVisible: false,
      userOrganizationRoles: [],
      userOrganizationRolesMap: {},
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },

  computed: {
    ...mapGetters("account", ["user"]),
    dataColumns() {
      return (this.$isPro ? this.columnsPro : this.columnsFree).map(
        (column) => {
          column.title = this.$t(column.key);
          return column;
        },
      );
    },

    dataleftColumns() {
      return [
        {
          dataIndex: "name",
          title: this.$t("Name"),
        },
        {
          dataIndex: "userLength",
          title: this.$t("Users"),
        },
      ];
    },

    datarightColumns() {
      return [
        {
          dataIndex: "name",
          title: this.$t("Name"),
        },
        {
          dataIndex: "userLength",
          title: this.$t("Users"),
        },
      ];
    },
  },

  created() {
    this.pid = this.$route.params.id || "";
  },

  mounted() {
    this.loaddata();
    this.loadroles();
    this.getWhiteOrgs();
  },

  activated() {},

  methods: {
    projectChange() {
      let newlist = [];
      this.org.users.forEach((item) => {
        if (
          !newlist.find((target) => {
            return target.id == item.id;
          })
        ) {
          newlist.push(item);
        }
      });
      this.org.users = newlist;
    },

    orgChange() {
      let newlist = [];
      this.org.users.forEach((item) => {
        if (
          !newlist.find((target) => {
            return target.id == item.id;
          })
        ) {
          newlist.push(item);
        }
      });
      this.org.users = newlist;
    },

    detailsvc(id, namespace) {
      this.$router.push({
        path: `/fsm/service/detail/${namespace}/${id}`,
      });
    },

    changeScope(targetSvc) {
      this.$gql
        .mutation(
          `updateService(input: $input){service{id}}`,
          {
            input: {
              where: { id: targetSvc.id },
              data: { scope: targetSvc.scope },
            },
          },
          {
            input: "updateServiceInput",
          },
        )
        .then(() => {
          this.$message.success(this.$t("Save successfully"), 3);
        });
    },

    approvalApply(targetSvc, item) {
      let subscribeOrgs = [];
      let isfind = false;
      this.$gql
        .query(`getService(id: ${targetSvc.id}){id,subscribeOrgs{id,name}}`)
        .then((res) => {
          res.subscribeOrgs.forEach((org) => {
            if (item.applyOrganization.id == org.id) {
              isfind = true;
            }
            subscribeOrgs.push(org.id);
          });
          if (!isfind) {
            subscribeOrgs.push(item.applyOrganization.id);
          }
          this.$gql
            .mutation(
              `updateService(input: $input){service{id}}`,
              {
                input: {
                  where: { id: targetSvc.id },
                  data: { subscribeOrgs },
                },
              },
              {
                input: "updateServiceInput",
              },
            )
            .then(() => {
              this.$gql
                .mutation(
                  `updateSubscribeServiceApply(input:{where:{id: ${item.id}},data:{status: 1}}){subscribeServiceApply{id}}`,
                )
                .then(() => {
                  this.loaddata(true);
                  this.$message.success(this.$t("Save successfully"), 3);
                });
            });
        });
    },

    refuseApply(targetSvc, item) {
      this.$gql
        .mutation(
          `updateSubscribeServiceApply(input:{where:{id: ${item.id}},data:{status: 2}}){subscribeServiceApply{id}}`,
        )
        .then(() => {
          this.$message.success(this.$t("Save successfully"), 3);
          this.loaddata(true);
        });
    },

    removeSubscribe(targetSvc, item) {
      let subscribeOrgs = [];
      this.$gql
        .query(`getService(id: ${targetSvc.id}){id,subscribeOrgs{id,name}}`)
        .then((res) => {
          res.subscribeOrgs.forEach((org) => {
            if (item.id != org.id) {
              subscribeOrgs.push(org.id);
            }
          });
          this.$gql
            .mutation(
              `updateService(input: $input){service{id}}`,
              {
                input: {
                  where: { id: targetSvc.id },
                  data: { subscribeOrgs },
                },
              },
              {
                input: "updateServiceInput",
              },
            )
            .then(() => {
              this.$message.success(this.$t("Save successfully"), 3);
              this.loaddata(true);
            });
        });
    },

    unsubscribe(targetSvc, item) {
      this.targetSvc = null;
      this.settingVisible = false;
      let subscribeOrgs = [];
      this.$gql
        .query(`getService(id: ${targetSvc.id}){id,subscribeOrgs{id,name}}`)
        .then((res) => {
          res.subscribeOrgs.forEach((org) => {
            if (item.id != org.id) {
              subscribeOrgs.push(org.id);
            }
          });
          this.$gql
            .mutation(
              `updateService(input: $input){service{id}}`,
              {
                input: {
                  where: { id: targetSvc.id },
                  data: { subscribeOrgs },
                },
              },
              {
                input: "updateServiceInput",
              },
            )
            .then(() => {
              this.$message.success(this.$t("Save successfully"), 3);
              this.loaddata(true);
            });
        });
    },

    saveSetting() {
      this.targetSvc = null;
      this.settingVisible = false;
    },

    closeSetting() {
      this.targetSvc = null;
      this.settingVisible = false;
    },

    showSetting(item) {
      this.targetSvc = item;
      this.settingVisible = true;
    },

    svcremove(id) {
      this.$gql
        .mutation(`deleteServiceSync(input:{where:{id:${id}}}){id}`)
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.search();
        });
    },

    svcdetail(id, namespace) {
      this.$router.push({
        path: `/fsm/service/detail/${namespace}/${id}`,
      });
    },

    saveUserOrganizationRoles(user, organization, project, role, type) {
      let _isEdit = false;
      let savedata = {
        user,
        organization,
        role,
        type,
      };
      if (type == "organization") {
        if (this.userOrganizationRolesMap[type + "-" + user]) {
          _isEdit = true;
          savedata.id = this.userOrganizationRolesMap[type + "-" + user].id;
        }
      } else {
        savedata.project = project;
        if (
          this.userOrganizationRolesMap[type + "-" + project + "-" + user]
        ) {
          _isEdit = true;
          savedata.id =
            this.userOrganizationRolesMap[
              type + "-" + project + "-" + user
            ].id;
        }
      }
      if (_isEdit) {
        const whereID = savedata.id;
        delete savedata.id;
        this.$gql
          .mutation(
            `updateUserOrganizationRole(input: $input){userOrganizationRole{id}}`,
            {
              input: { where: { id: whereID }, data: savedata },
            },
            {
              input: "updateUserOrganizationRoleInput",
            },
          )
          .then(() => {
            this.$message.success(this.$t("Modified successfully"), 3);
            this.permissionPayload.userOrganizationRole = null;
            this.resources = [];
            this.projectVisible = false;
            this.organizationVisible = false;
            this.loadUserOrganizationRoles();
          });
      } else {
        delete savedata.id;
        this.$gql
          .mutation(
            `createUserOrganizationRole(input: $input){userOrganizationRole{id}}`,
            {
              input: { data: savedata },
            },
            {
              input: "createUserOrganizationRoleInput",
            },
          )
          .then(() => {
            this.$message.success(this.$t("Created successfully"), 3);
            this.permissionPayload.userOrganizationRole = null;
            this.resources = [];
            this.projectVisible = false;
            this.organizationVisible = false;
            this.loadUserOrganizationRoles();
          });
      }
    },

    deleteUserOrganizationRoles(id) {
      this.$gql
        .mutation(
          `deleteUserOrganizationRole(input:{where:{id:${id}}}){userOrganizationRole{id}}`,
        )
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.loadUserOrganizationRoles();
        });
    },

    onWhiteChange(nextTargetKeys) {
      this.org.whiteOrgs = nextTargetKeys;
      this.$gql
        .mutation(
          `updateOrganization(input: $input){organization{id}}`,
          {
            input: {
              where: { id: this.pid },
              data: { whiteOrgs: nextTargetKeys },
            },
          },
          { input: "updateOrganizationInput" },
        )
        .then(() => {});
    },

    whiteSearch(direction, val) {
      if (direction == "left") {
        this.white.key = val;
        this.getWhiteOrgs();
      }
    },

    getWhiteOrgs(pageNo, pageSize) {
      this.getOrgs(this.white, pageNo, pageSize);
    },

    getOrgs(target, pageNo, pageSize) {
      if (pageNo) {
        target.pageNo = pageNo;
        target.pageSize = pageSize;
      }
      target.loading = true;

      let where = { name_contains: target.key };
      this.$gql
        .query(
          `organizationsConnection(start: 0, limit: 999, where: $where){values{id,name,users{id,username}},aggregate{totalCount}}`,
          { where },
        )
        .then((res) => {
          target.list = res.values;
          target.list.forEach((n) => {
            if (n.users) {
              n.userLength = n.users.length;
            } else {
              n.userLength = "-";
            }
            n.key = `${n.id}`;
          });
          target.total = res.aggregate.totalCount;
          target.loading = false;
        });
    },

    setPermissionPayload(user, organization, project, role, type) {
      this.permissionPayload.userOrganizationRole = null;
      this.resources = [];

      if (type == "organization") {
        if (this.userOrganizationRolesMap[type + "-" + user]) {
          this.permissionPayload.userOrganizationRole =
            this.userOrganizationRolesMap[type + "-" + user].role.id;
        }
      } else {
        if (
          this.userOrganizationRolesMap[type + "-" + project + "-" + user]
        ) {
          this.permissionPayload.userOrganizationRole =
            this.userOrganizationRolesMap[
              type + "-" + project + "-" + user
            ].role.id;
        }
      }
      this.setDefaultResources();
    },

    setDefaultResources() {
      if (this.permissionPayload.userOrganizationRole) {
        let roleId = this.permissionPayload.userOrganizationRole;
        this.$gql
          .query(
            `getRoleResourcePermission(roleId:${roleId}){resources{name,actions{name,enabled}}}`,
          )
          .then((res) => {
            this.resources = res.resources;
          });
      }
    },

    loadUserOrganizationRoles() {
      this.userOrganizationRoles = [];
      this.userOrganizationRolesMap = {};
      const pid = this.pid;
      this.$gql
        .query(
          `userOrganizationRoles(limit:-1,where:{organization:${pid}}){id,type,project{id,name},user{id,username},role{id,name}}`,
        )
        .then((res) => {
          this.userOrganizationRoles = res;
          res.forEach((item) => {
            if (item.type == "organization" && item.user) {
              this.userOrganizationRolesMap[`organization-${item.user.id}`] =
                item;
            } else if (item.type == "project" && item.user) {
              this.userOrganizationRolesMap[
                `project-${item.project.id}-${item.user.id}`
              ] = item;
            }
          });
        });
    },

    loadroles() {
      this.loadUserOrganizationRoles();
      this.organizationRoles = [];
      this.$gql
        .query(
          `getRolesConnection(where:{type:"organization"}){values{id,name,type}}`,
        )
        .then((res) => {
          this.organizationRoles = res.values;
        });
      this.projectRoles = [];
      this.$gql
        .query(
          `getRolesConnection(where:{type:"project"}){values{id,name,type}}`,
        )
        .then((res) => {
          this.projectRoles = res.values;
        });
    },

    saveProjectChange(e, project) {
      const _data = e.clone.querySelector(".userline").title.split(",");
      this.addProjectUser(_data[0], project, _data[1]);
    },

    addProject() {
      let projects = [];
      this.org.projects.forEach((project) => {
        projects.push(project.id);
      });
      projects.push(this.selectProjects);
      this.selectProjects = null;
      this.updateOrgProject(this.org.id, projects);
    },

    removeProject(project_id, org) {
      let projects = [];
      org.projects.forEach((project) => {
        if (project_id != project.id) {
          projects.push(project.id);
        }
      });
      this.updateOrgProject(org.id, projects);
    },

    updateOrgProject(id, projects) {
      this.$gql
        .mutation(
          `updateOrganization(input: $input){organization{id}}`,
          { input: { where: { id }, data: { projects } } },
          { input: "updateOrganizationInput" },
        )
        .then(() => {
          this.loaddata(true);
        });
    },

    addUser() {
      let users = [];
      this.org.users.forEach((user) => {
        users.push(user.id);
      });
      users.push(this.selectUsers);
      this.selectUsers = null;
      this.updateOrgUser(this.org.id, users);
    },

    //todo
    delUser(user_id, org) {
      let users = [],
          users_id = [];
      org.users.forEach((user) => {
        if (user_id != user.id) {
          users.push(user);
          users_id.push(user.id);
        }
      });
      org.users = users;
      this.updateOrgUser(org.id, users_id);
    },

    updateOrgUser(id, users) {
      this.$gql
        .mutation(
          `updateOrganization(input: $input){organization{id}}`,
          { input: { where: { id }, data: { users } } },
          { input: "updateOrganizationInput" },
        )
        .then(() => {
          this.loaddata(true);
        });
    },

    addProjectUser(new_user_id, project) {
      let users = [],
          users_id = [];
      project.users.forEach((user) => {
        if (
          !users.find((target) => {
            return target.id == user.id;
          })
        ) {
          users.push(user);
          users_id.push(user.id);
        }
      });
      if (
        !users.find((target) => {
          return target.id == new_user_id;
        })
      ) {
        users_id.push(new_user_id);
      }
      project.users = users;
      this.updateProjectUser(project.id, users_id);
    },

    delProjectUser(item, project) {
      let users = [],
          users_id = [];
      project.users.forEach((user) => {
        if (item.id != user.id) {
          users.push(user);
          users_id.push(user.id);
        }
      });
      project.users = users;
      this.updateProjectUser(project.id, users_id);
    },

    updateProjectUser(id, users) {
      this.$gql
        .mutation(
          `updateProject(input: $input){project{id}}`,
          { input: { where: { id }, data: { users } } },
          { input: "updateProjectInput" },
        )
        .then(() => {
          this.loaddata(true);
        });
    },

    handleOk() {
      let savedata = _.cloneDeep(this.payload);
      if (this.isEdit) {
        const whereID = savedata.id;
        delete savedata.id;
        this.$gql
          .mutation(
            `updateOrganization(input: $input){organization{id}}`,
            {
              input: { where: { id: whereID }, data: savedata },
            },
            {
              input: "updateOrganizationInput",
            },
          )
          .then(() => {
            this.visible = false;
            this.$message.success(this.$t("Modified successfully"), 3);
            this.loaddata(true);
          });
      } else {
        delete savedata.id;
        this.$gql
          .mutation(
            `createOrganization(input: $input){organization{id}}`,
            {
              input: { data: savedata },
            },
            {
              input: "createOrganizationInput",
            },
          )
          .then(() => {
            this.visible = false;
            this.$message.success(this.$t("Created successfully"), 3);
            this.loaddata(true);
          });
      }
    },

    getRowSelection(disabled, selectedKeys, onItemSelectAll, onItemSelect) {
      return {
        getCheckboxProps: (item) => ({
          disabled: disabled || item.disabled,
        }),

        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          onItemSelectAll(treeSelectedKeys, selected);
        },

        onSelect(item, selected) {
          onItemSelect(item.key, selected);
        },

        selectedRowKeys: selectedKeys,
      };
    },

    removeOrg(id) {
      this.$gql
        .mutation(
          `deleteOrganization(input:{where:{id:${id}}}){organization{id}}`,
        )
        .then(() => {
          this.$message.success(this.$t("Deleted successfully"), 3);
          this.loaddata(true);
        });
    },

    goProject(id) {
      this.$router.push({
        path: "/system/projects/detail/" + id,
      });
    },

    loaddata(merge) {
      if (!merge) {
        this.loading = true;
      }
      this.$gql
        .query(
          `organization(id: ${this.pid}){id,name,whiteOrgs{id,name},parent{id,name},description,projects{id,name,users{id,username,type,role{id,name}}},users{id,username,type,role{id,name}},subscribeServices{id,uid,fleet{id,name},organization{id,name},subscribeOrgs{id,name},namespace,name,registry{id,name},content,created_at},services{id,uid,scope,subscribeServiceApplies{id,status,updated_at,applyUser{id,username},applyOrganization{id,name},approveOrganization{id,name}},fleet{id,name},organization{id,name},subscribeOrgs{id,name},namespace,name,registry{id,name},content,created_at}}`,
        )
        .then((res) => {
          this.org = res;
          this.org.whiteOrgs = res.whiteOrgs.map((o) => o.id);
          this.services = this.reset(res.services, 1);
          this.subscribeServices = this.reset(res.subscribeServices, 2);
          this.loading = false;
        });
      this.loadprojects();
      this.loadusers();
    },

    reset(list, type) {
      for (let i = 0; i < list.length; i++) {
        let _content = list[i].content;
        list[i].uid = _content.metadata.uid;
        list[i].name = _content.metadata.name;
        list[i].organizationName = list[i].organization
          ? list[i].organization.name
          : "-";
        list[i].registryName = list[i].registry ? list[i].registry.name : "-";
        list[i].namespace = _content.metadata.namespace;
        list[i].labels = _content.metadata.labels;
        list[i].creationTimestamp = new Date(
          _content.metadata.creationTimestamp,
        ).toLocaleString();
        list[i].appliesCnt = 0;
        if (list[i].subscribeServiceApplies) {
          list[i].subscribeServiceApplies.forEach((item) => {
            if (item.status == 0) {
              list[i].appliesCnt++;
            }
          });
        }
        list[i].subscribeOrgCnt = list[i].subscribeOrgs.length;
        if (
          this.serviceType == type &&
          this.targetSvc &&
          this.targetSvc.id == list[i].id
        ) {
          this.targetSvc = list[i];
        }
      }
      return list;
    },

    loadusers() {
      this.$gql
        .query(`users{id,username,userOrganizations{id},phone,email,type}`)
        .then((res) => {
          this.users = res;
        });
    },

    loadprojects() {
      this.$gql
        .query(
          `projects(where:{organization_null: true}){id,name,organization{id,name}}`,
        )
        .then((res) => {
          this.projects = res;
        });
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
    height: 187px;
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

  :deep(.ant-divider-dashed::before),
  :deep(.ant-divider-dashed::after) {
    border-color: #ccc !important;
  }
  .userline {
    position: relative;
    border: 1px dashed #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 5px 10px;
  }
  .userline .title {
    padding-left: 15px;
    font-size: 16px;
    line-height: 40px;
  }
  .userline .rightSpan {
    top: 18px;
    position: absolute;
    right: 20px;
  }
  .userline .rightIcon {
    cursor: pointer;
    color: #00adef;
    font-size: 18px;
  }
  .userline:hover {
    border: 1px dashed #00adef;
  }
  .userline:hover .rightIcon {
  }
  .userline .usericon {
    position: relative;
    top: -2px;
    width: 40px;
    vertical-align: middle;
    height: 40px;
    border: 2px solid #fff;
    border-radius: 50%;
    line-height: 40px;
    font-size: 26px;
    background-color: #e6fcff;
    text-align: center;
  }
  .dragable-ghost {
    border: 1px dashed red;
    opacity: 1;
  }
  .dragable-chose {
    border: 1px dashed red;
    opacity: 0.8;
  }
  .dragable-drag {
    border: 1px dashed red;
    opacity: 1;
  }
  .id-card {
    position: relative;
    top: -5px;
    margin-left: 10px;
  }
  .IdcardTwoTone {
    padding-top: 1px;
    line-height: 35px;
  }
  .role-name {
    position: relative;
    top: -5px;
    margin-left: 10px;
  }
  .service-type {
    padding: 10px 5px;
  }
</style>
