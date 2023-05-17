<template>
  <PageLayout
    :hide-breadcrumb="embed"
    :title="embed ? ' ' : detail.name ? detail.name : $t('new') + ' Pipy'"
    :form-state="detail"
    ref="layout"
  >
    <template #headerContent>
      <div class="template-div" />
      <DetailList
        size="small"
        :col="1"
      >
        <DetailListItem
          :term="$t('as')"
          name="name"
          :rules="rules.uniqueName('fleets',{id:pid,type:detail.type})"
          :span="2"
        >
          <a-input
            :placeholder="$t('unset')"
            v-model:value="detail.name"
            class="width-300"
          />
        </DetailListItem>
        <DetailListItem
          :term="$t('Type')"
          :span="1"
        >
          <a-select
            :disabled="!!pid"
            :placeholder="$t('Unselect')"
            class="width-200"
            v-model:value="detail.type"
            @change="renderCallback"
          >
            <a-select-option
              v-for="(item, index) in types"
              :key="index"
              :value="item.value"
            >
              <span>
                <svg
                  class="icon selector-icon"
                  aria-hidden="true"
                >
                  <use :xlink:href="'#' + item.icon" />
                </svg>
                <font class="capitalize">{{ item.label }}</font>
              </span>
            </a-select-option>
          </a-select>
        </DetailListItem>
        <DetailListItem
          v-if="detail.type.toLowerCase() == 'pipy4lb' || detail.type == 'tunnelInternal' || detail.type == 'tunnelExternal'"
          :term="$t('Organization')"
          :span="3"
        >
          <a-select
            :placeholder="$t('unset')"
            mode="multiple"
            v-model:value="detail.organizations"
            class="width-300"
            ref="select"
          >
            <a-select-option
              :value="org.id"
              :key="index"
              v-for="(org, index) in orgs"
            >
              {{
                org.name
              }}
            </a-select-option>
          </a-select>
        </DetailListItem>
        <DetailListItem
          v-if="detail.type.toLowerCase() == 'pipy' && detail.json"
          :term="'Http '+ $t('Port')"
          :span="3"
        >
          <a-input
            :placeholder="$t('unset')"
            v-model:value="detail.json.port"
            class="width-100"
          />
        </DetailListItem>
        <!--
          <DetailListItem
          v-if="(detail.type == 'tunnelInternal' || detail.type == 'tunnelExternal') && detail.json"
          :term="$t('Port')"
          :span="3"
          >
          <a-input
          :placeholder="$t('unset')"
          v-model:value="detail.json.port"
          class="width-100"
          />
          </DetailListItem> 
        -->
        <DetailListItem
          v-if="detail.type.toLowerCase() == 'pipy' && detail.json"
          :term="'Https '+ $t('Port')"
          :span="3"
        >
          <a-input
            :placeholder="$t('unset')"
            v-model:value="detail.json.tlsport"
            class="width-100"
          />
        </DetailListItem>
        <DetailListItem
          v-if="
            false &&
              detail.type.toLowerCase() == 'sidecar' &&
              detail.json &&
              detail.json.consul != null
          "
          :label="$t('Listen')"
          :span="3"
        >
          <div class="flex">
            <div class="flex-item">
              <label>{{ $t("Target") }} : </label>
              <a-input-number
                v-model:value="detail.json.consul.target"
                :min="0"
              />
            </div>
            <div class="flex-item">
              <label>{{ $t("Listen") }} : </label>
              <a-input-number
                v-model:value="detail.json.consul.listen"
                :min="0"
              />
            </div>
          </div>
        </DetailListItem>
      </DetailList>
    </template>
    <template
      v-if="false"
      #extra
    >
      <HeadInfo
        title=""
        :content="0"
      />
    </template>
    <template
      v-if="!embed"
      #action
    >
      <a-button
        type="primary"
        @click="validate"
        v-if="pid != ''"
        v-permission="['fleet:update']"
      >
        {{ $t("save") }}
      </a-button>
      <a-button
        type="primary"
        @click="validate"
        v-else
        v-permission="['fleet:create']"
      >
        {{ $t("create") }}
      </a-button>
    </template>
    <a-row class="row-mg">
      <a-col
        class="col-pd"
        :xl="24"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24"
      >
        <a-tabs
          type="card"
          v-model:activeKey="activeKey"
        >
          <template #rightExtra>
            <!--
              <a-button
              v-show="detail.content.plugins.length > 0"
              type="primary"
              @click="showPluginBox"
              >
              {{ $t("Add Plugin") }}
              </a-button> 
            -->
          </template>
          <a-tab-pane
            key="1"
            :tab="$t('Config')"
            v-if="detail.json"
          >
            <a-row class="row-mg">
              <a-col
                class="col-pd"
                :xl="24"
                :lg="24"
                :md="24"
                :sm="24"
                :xs="24"
              >
                <a-card>
                  <div class="flex">
                    <div class="flex-item">
                      <div class="mt-10">
                        <label>{{ $t("Template") }} : </label>
                        <a-select
                          :disabled="!!pid"
                          :placeholder="$t('unallocated')"
                          class="width-220"
                          v-model:value="detail.template"
                        >
                          <a-select-option
                            v-for="(item, index) in templates[
                              detail.type
                            ]"
                            :value="item.id"
                            :key="index"
                          >
                            <span>{{ item.name }}</span>
                          </a-select-option>
                        </a-select>
                      </div>
                      
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy'"
                      >
                        <label>{{ $t("RFC8998") }} : </label>
                        <a-switch
                          v-model:checked="detail.json.rfc8998"
                          @change="e => detail.json.minTLSVersion = ''"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy'"
                      >
                        <label>{{ $t("DH Param") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.dhparam"
                          class="width-120"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy'"
                      >
                        <label>{{ $t("Client Cert") }} : </label>
                        <a-select
                          :placeholder="$t('unset')"
                          class="width-120"
                          v-model:value="detail.json.clientCert"
                          allow-clear
                        >
                          <a-select-option
                            :value="certificate.id"
                            :key="certificateIdx"
                            v-for="(certificate, certificateIdx) in certificates"
                          >
                            {{ certificate.name }}
                          </a-select-option>
                        </a-select>
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy' || detail.type == 'tunnelExternal'"
                      >
                        <label>{{ $t("Read Timeout") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.readTimeout"
                          class="width-120"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'sidecar'"
                      >
                        <label>{{ $t("Service Port Offset") }} : </label>
                        <a-input-number
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.offset"
                          class="width-100"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy4lb'"
                      >
                        <label>{{ $t("Global Max Connections") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.maxConnectionsGlobal"
                          class="width-120"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy4lb'"
                      >
                        <label>{{ $t("Default Read Timeout") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.readTimeout"
                          class="width-120"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy4lb'"
                      >
                        <label>{{ $t("Default IDLE Timeout") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.idleTimeout"
                          class="width-120"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy4lb' || detail.type == 'tunnelExternal'"
                      >
                        <label>{{ $t("Global Id Prefix") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.idPrefix"
                          class="width-120"
                        />
                      </div>

                      <div
                        class="mt-10"
                        v-if="detail.type == 'tunnelInternal' || detail.type == 'tunnelExternal'"
                      >
                        <label>{{ $t("Enable Debug") }} : </label>
                        <a-switch
                          v-model:checked="detail.json.enableDebug"
                        />
                      </div>
                    </div>
                    <div class="flex-item">
                      <div
                        class="mt-10"
                        v-if="detail.type != 'tunnelInternal'"
                      >
                        <label>{{ $t("Log") }} : </label>
                        <a-select
                          :placeholder="$t('unallocated')"
                          class="width-220"
                          v-model:value="detail.json.log.bind.id"
                        >
                          <a-select-option
                            v-for="(item, index) in logs"
                            :key="index"
                            :value="item.id"
                          >
                            <b v-if="item.id">{{ item.name }}(ID:{{ item.id }})</b>
                            <i
                              v-if="!item.id"
                              class="gray"
                            >{{ item.name }} </i>
                            <div>
                              <div
                                v-for="(key, index2) in Object.keys(
                                  item.content || [],
                                )"
                                v-show="key != 'bind' && item.content[key]"
                                :key="index2"
                              >
                                {{ key }}:{{ item.content[key] }}
                              </div>
                            </div>
                          </a-select-option>
                        </a-select>
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'sidecar'"
                      >
                        <label>{{ $t("log file path") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.logFilePath"
                          class="width-350"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy'"
                      >
                        <label>{{ $t("Min Version") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.minTLSVersion"
                          class="width-120"
                          :disabled="detail.json.rfc8998"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy'"
                      >
                        <label>{{ $t("Ciphers") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.ciphers"
                          class="width-300"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy' || detail.type == 'tunnelExternal'"
                      >
                        <label>{{ $t("Connect Timeout") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.connectTimeout"
                          class="width-120"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy'"
                      >
                        <label>{{ $t("Write Timeout") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.writeTimeout"
                          class="width-120"
                        />
                      </div>
                      <!--
                        <div
                        class="mt-10"
                        v-if="detail.type == 'tunnelInternal' || detail.type == 'tunnelExternal'"
                        >
                        <label>{{ $t("Certificate") }} : </label>
                        <a-select
                        :placeholder="$t('unset')"
                        class="width-120"
                        v-model:value="detail.json.cert"
                        >
                        <a-select-option
                        :value="certificate.id"
                        :key="certificateIdx"
                        v-for="(certificate, certificateIdx) in certificatesTls"
                        >
                        {{ certificate.name }}
                        </a-select-option>
                        </a-select>
                        </div>
                      -->
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy4lb'"
                      >
                        <label>{{ $t("Default Max Connections") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.maxConnections"
                          class="width-120"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy4lb'"
                      >
                        <label>{{ $t("Default Write Timeout") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.writeTimeout"
                          class="width-120"
                        />
                      </div>
                      <div
                        class="mt-10"
                        v-if="detail.type.toLowerCase() == 'pipy4lb' || detail.type == 'tunnelExternal'"
                      >
                        <label>{{ $t("Max LBs") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.maxLBs"
                          class="width-120"
                        />
                      </div>

                      <div
                        class="mt-10"
                        v-if="detail.type == 'tunnelInternal' || detail.type == 'tunnelExternal'"
                      >
                        <label>{{ $t("Connect Retry") }} : </label>
                        <a-input
                          :placeholder="$t('unset')"
                          v-model:value="detail.json.connectRetry"
                          class="width-120"
                        />
                      </div>
                    </div>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane
            key="3"
            :tab="$t('BGP Speaker')"
            v-if="(detail.type.toLowerCase() == 'pipy4lb' || detail.type == 'tunnelExternal') && detail.json"
          >
            <JsonEditor v-model:value="detail.json.bgp" />
          </a-tab-pane>
          <a-tab-pane
            key="4"
            :tab="$t('healthcheck')"
            v-if="(detail.type.toLowerCase() == 'pipy4lb' || detail.type == 'tunnelExternal') && detail.json "
          >
            <a-card>
              <div class="flex">
                <div
                  class="flex-item"
                  v-if="detail.json.healthcheck.host"
                >
                  <div>
                    <label>{{ $t("Host") }} : </label>
                    <a-input
                      :placeholder="$t('unset')"
                      v-model:value="detail.json.healthcheck.host"
                      class="width-220"
                    />
                  </div>
                </div>
                <div
                  class="flex-item"
                  v-if="detail.json.healthcheck.port"
                >
                  <div>
                    <label>{{ $t("Port") }} : </label>
                    <a-input-number
                      :placeholder="$t('unset')"
                      v-model:value="detail.json.healthcheck.port"
                      :min="0"
                    />
                  </div>
                </div>
              </div>
              <div class="flex">
                <div
                  class="flex-item"
                  v-if="detail.json.healthcheck.interval"
                >
                  <div>
                    <label>{{ $t("Interval") }} : </label>
                    <a-input
                      :placeholder="$t('unset')"
                      v-model:value="detail.json.healthcheck.interval"
                      class="width-120"
                    />
                  </div>
                </div>
                <div
                  class="flex-item"
                  v-if="detail.json.healthcheck.failures"
                >
                  <div>
                    <label>{{ $t("Failures") }} : </label>
                    <a-input-number
                      :placeholder="$t('unset')"
                      v-model:value="detail.json.healthcheck.failures"
                      :min="0"
                    />
                  </div>
                </div>
              </div>
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="2"
            :tab="$t('Certificates')"
            v-if="(detail.type.toLowerCase() == 'pipy') && detail.json "
          >
            <IdentityList
              :certificate-size="1"
              mode="certificates"
              v-model:certificates="detail.json.tls"
              :col="2"
              :title="$t('Add Bind')"
            />
          </a-tab-pane>
          <a-tab-pane
            key="5"
            :tab="$t('Custom Error Page')"
            v-if="detail.type.toLowerCase() == 'pipy' && detail.json "
          >	
            <a-card>
              <InputList
                :d="detail.json.errRoutes"
                :attrs="newErrRoute"
              >
                <template #default="{ item }">
                  <a-descriptions>
                    <a-descriptions-item :label="$t('Error Status')">
                      <TagList
                        type="number"
                        v-model:list="item.errCodes"
                        name="errCodes"
                        :placeholder="$t('Unset')"
                      />
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('Error Message')">
                      <a-textarea
                        v-model:value="item.resTxt"
                        :placeholder="$t('Unset')"
                        :auto-size="{ minRows: 2, maxRows: 5 }"
                      />
                    </a-descriptions-item>
                  </a-descriptions>
                </template>
              </InputList>
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="6"
            :tab="$t('Nodes')"
            v-if="detail.type == 'tunnelInternal' && detail.json "
          >	
            <a-card>
              <InputList
                :d="detail.json.nodes"
                :attrs="newNodesInternal"
              >
                <template #default="{ item }">
                  <a-descriptions>
                    <a-descriptions-item :label="$t('node')">
                      <a-input
                        :placeholder="$t('IP:PORT')"
                        v-model:value="item.node"
                        class="width-220"
                      />
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('TLS Certificate')">
                      <a-select
                        :placeholder="$t('unset')"
                        class="width-120"
                        v-model:value="item.cert"
                      >
                        <a-select-option
                          :value="certificate.id"
                          :key="certificateIdx"
                          v-for="(certificate, certificateIdx) in certificatesTls"
                        >
                          {{ certificate.name }}
                        </a-select-option>
                      </a-select>
                    </a-descriptions-item>

                    <a-descriptions-item :label="$t('Max Connections')">
                      <a-input
                        :placeholder="$t('unset')"
                        v-model:value="item.maxConnections"
                        class="width-120"
                      />
                    </a-descriptions-item>

                    <a-descriptions-item :label="$t('Read Timeout')">
                      <a-input
                        :placeholder="$t('unset')"
                        v-model:value="item.readTimeout"
                        class="width-120"
                      />
                    </a-descriptions-item>

                    <a-descriptions-item :label="$t('Write Timeout')">
                      <a-input
                        :placeholder="$t('unset')"
                        v-model:value="item.writeTimeout"
                        class="width-120"
                      />
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('IDLE Timeout')">
                      <a-input
                        :placeholder="$t('unset')"
                        v-model:value="item.idleTimeout"
                        class="width-120"
                      />
                    </a-descriptions-item>
                  </a-descriptions>
                </template>
              </InputList>
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            key="7"
            :tab="$t('Nodes')"
            v-if="detail.type == 'tunnelExternal' && detail.json "
          >	
            <a-card>
              <InputList
                :d="detail.json.nodes"
                :attrs="newNodesExternal"
              >
                <template #default="{ item }">
                  <a-descriptions>
                    <a-descriptions-item :label="$t('Tunnel Internal')">
                      <a-select
                        :placeholder="$t('unset')"
                        class="width-120"
                        v-model:value="item.tunnelInternal"
                        @change="setInternal(item)"
                      >
                        <a-select-option
                          :value="tunnelInternal.id"
                          :key="tunnelInternalIdx"
                          v-for="(tunnelInternal, tunnelInternalIdx) in tunnelInternals"
                        >
                          {{ tunnelInternal.name }}
                        </a-select-option>
                      </a-select>
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('Nodes')">
                      <div>
                        <div
                          :value="node"
                          :key="nodeIdx"
                          v-for="(node, nodeIdx) in item.nodes"
                        >
                          <a-tag>{{ node.node }}</a-tag>
												
                          <span class="ml-15">{{ $t("Weight") }}:</span>
                          <a-input-number
                            :placeholder="$t('unset')"
                            v-model:value="node.weight"
                            :min="0"
                          />
                          <span class="ml-15">{{ $t("TLS Certificate") }}:</span>
                          <a-select
                            :placeholder="$t('unset')"
                            class="width-120"
                            v-model:value="node.tlsCert"
                          >
                            <a-select-option
                              :value="certificate.id"
                              :key="certificateIdx"
                              v-for="(certificate, certificateIdx) in certificatesTls"
                            >
                              {{ certificate.name }}
                            </a-select-option>
                          </a-select>
                        </div>
                      </div>
                    </a-descriptions-item>
                  </a-descriptions>
                </template>
              </InputList>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </PageLayout>
</template>

<script>
import _ from "lodash";
import PageLayout from "@/layouts/PageLayout";
import DetailList from "@/components/tool/DetailList";
import { mapState } from "vuex";
import HeadInfo from "@/components/tool/HeadInfo";
import DetailListItem from "@/components/tool/DetailListItem";
import JsonEditor from "@/components/editor/JsonEditor";
import IdentityList from "@/components/table/IdentityList";
import InputList from "@/components/form/InputList";
import TagList from "@/components/tag/TagList";

export default {
  name: "PolicyDetail",
  i18n: require("@/i18n"),
  components: {
    HeadInfo,
    DetailListItem,
    DetailList,
    PageLayout,
    JsonEditor,
    IdentityList,
    InputList,
    TagList
  },

  props: ["embed"],
  data() {
    return {
      detail: { 
        name: "",
        id: "",
        type: "pipy",
        content: "",
        json: {log:{bind:{id:null}}},
        apply:false,
        template: null,
      },

      newErrRoute:{
        resTxt:"",
        errCodes:[]
      },

      newNodesInternal:{
        node:"",
        maxConnections: "1000",
        readTimeout: "5s",
        writeTimeout: "5s",
        idleTimeout: "60s",
      },

      newNodesExternal:{
        tunnelInternal:"",
        nodes:[]
      },

      types:[
        {icon:"icon-pipy",label:'API',value:'pipy'},
        {icon:"icon-pipy",label:'4LB',value:'pipy4lb'},
        {icon:"icon-pipy",label:'Sidecar',value:'sidecar'},
        {icon:"icon-pipy",label:'Tunnel Internal',value:'tunnelInternal'},
        {icon:"icon-pipy",label:'Tunnel External',value:'tunnelExternal'},
      ],

      initContent:{
        pipy: {
          log: {
            bind: {
              id: null,
            },
          },
				
          port: 80,
          tlsport: 443,
          tls: [],
          maxConnections: null,
          readTimeout: "60s",
          writeTimeout: "60s",
          connectTimeout:"60s",
          minTLSVersion: "",
          ciphers: "",
          dhparam: "",
          clientCert: "",
          rfc8998: false,
          errRoutes:[]
        },
				
        pipy4lb: {
          log: {
            type: "clickhouse",
            bind: {
              id: null,
            },
				
            table: "",
          },
				
          tls: [],
          healthcheck: {
            host: "localhost",
            port: 8888,
            failures: 3,
            interval: "5s"
          },
				
          maxConnections: "1000",
          readTimeout: "5s",
          writeTimeout: "5s",
          idleTimeout: "60s",
          maxLBs: 20,
          maxConnectionsGlobal: "3000",
          idPrefix: "",
          bgp: '{\n  \"as\": 0,\n  \"id\": \"0.0.0.0\",\n  \"peers\": [],\n  \"ipv4\": {\n    \"nextHop\": \"0.0.0.0\",\n    \"reachable\": [],\n    \"unreachable\": []\n  },\n  \"ipv6\": {\n    \"nextHop\": \"::\",\n    \"reachable\": [],\n    \"unreachable\": []\n  }\n}',
        },
				
        sidecar: {
          log: {
            type: "clickhouse",
            bind: {
              id: null,
            },
				
            table: "",
          },
				
          consul: {
            listen: "",
            target: "",
          },

          logFilePath: ""
        },

        tunnelInternal: {
          port: 80,
          enableDebug: false,
          connectRetry: -1,
          nodes:[{
            node:"",
            maxConnections: "1000",
            readTimeout: "5s",
            writeTimeout: "5s",
            idleTimeout: "60s",
          }]
        },

        tunnelExternal: {
          log: {
            bind: {
              id: null,
            },
          },
				
          port: 80,
          enableDebug: false,
          connectRetry: -1,
          nodes:[{
            tunnelInternal:"",
            nodes:[]
          }],

          bgp: '{\n  \"as\": 0,\n  \"id\": \"0.0.0.0\",\n  \"peers\": [],\n  \"ipv4\": {\n    \"nextHop\": \"0.0.0.0\",\n    \"reachable\": [],\n    \"unreachable\": []\n  },\n  \"ipv6\": {\n    \"nextHop\": \"::\",\n    \"reachable\": [],\n    \"unreachable\": []\n  }\n}',
        
          healthcheck: {
            host: "localhost",
            port: 8888,
            failures: 3,
            interval: "5s"
          },
        },
      },

      visible: false,
      activeKey: "1",
      loading: true,
      logs: [],
      log: "{}",
      orgs:[],
      pid: "",
      filter: "",
      templates: {},
      certificates:[],
      certificatesTls:[],
      tunnelInternals:[]
    };
  },

  computed: {
    ...mapState({
      rules: state => state.rules.rules,
      isMobile: state => state.setting.isMobile,
    }),
  },

  created() {
    this.pid = this.$route.params.id || "";
    this.$gql
      .query(`templates(filters:{type:{eq:"sidecars"}}){data{id,attributes{name,type,content}}}`)
      .then((res) => {
        this.templates["sidecar"] = res.data;
      });
    this.$gql
      .query(`templates(filters:{type:{eq:"pipy"}}){data{id,attributes{name,type,content}}}`)
      .then((res) => {
        this.templates["pipy"] = res.data;
      });
    this.$gql
      .query(`templates(filters:{type:{eq:"pipy4lb"}}){data{id,attributes{name,type,content}}}`)
      .then((res) => {
        this.templates["pipy4lb"] = res.data;
      });
    
    this.$gql
      .query(`templates(filters:{type:{eq:"tunnelInternal"}}){data{id,attributes{name,type,content}}}`)
      .then((res) => {
        this.templates["tunnelInternal"] = res.data;
      });
    this.$gql
      .query(`templates(filters:{type:{eq:"tunnelExternal"}}){data{id,attributes{name,type,content}}}`)
      .then((res) => {
        this.templates["tunnelExternal"] = res.data;
      });

    this.$gql
      .query(`fleets(filters:{type:{eq:"log"}}){data{id,attributes{name,apply,content}}}`)
      .then((res) => {
        this.logs = res.data;
      });
    this.$gql.query(`organizations(pagination:{limit: ${this.$DFT_LIMIT}}){data{id,attributes{name}}}`).then((res) => {
      this.orgs = res.data;
    });
    this.$gql
      .query(`fleets(filters:{type:{eq:"tunnelInternal"}}){data{id,attributes{name,content}}}`)
      .then((res) => {
        this.tunnelInternals = res.data;
        this.mergeNodes();
      });
    this.$gql.query(`organizations(pagination:{limit: ${this.$DFT_LIMIT}}){data{id,attributes{name}}}`).then((res) => {
      this.orgs = res.data;
    });

    this.getCertificates();

    if (this.pid != "") {
      this.loading = false;
      this.$gql
        .query(
          `fleet(id: ${this.pid}){data{id,attributes{name,type,content,apply,organizations{data{id,attributes{name}}},template{data{id,attributes{name}}}, status}}}`,
        )
        .then((res) => {
          this.loading = false;
          if (res.data.type == "pipy4lb" && !res.data.content.healthcheck) {
            res.data.content.healthcheck = {
              interval: "3s",
              connectTimeout: "1s",
              readTimeout: "1s",
              host: "localhost",
              port: 8888,
              failures: 3,
            };
          }
          if (res.data.type == "pipy" && !res.data.content.errRoutes) {
            res.data.content.errRoutes = [];
          }
          const _content = res.data.content;
          this.detail = res.data;
          if (res.data.template && res.data.template.id) {
            this.detail.template = res.data.template.id;
          }
          this.detail.content = JSON.stringify(_content);
          this.detail.json = _content;
          let _organizations = res.data.organizations;
          this.detail.organizations = [];
          if(_organizations){
            _organizations.forEach((_org)=>{
              this.detail.organizations.push(_org.id)
            })
          }
          this.mergeNodes();
        });
    } else {
      this.detail = { 
        name: "",
        id: "",
        type: "pipy",
        content: "",
        json: {},
        apply:false,
        template: null,
      };
      this.renderCallback();
      this.loading = false;
    }
  },

  methods: {
    mergeNodes() {
      if (this.detail.type != "tunnelExternal" || !this.detail.id || this.tunnelInternals.length == 0) {
        return;
      }
      for (const nodeAll of this.detail.json.nodes) {
        const tunnelInternal = this.tunnelInternals.find((t) => t.id == nodeAll.tunnelInternal)
        if (!tunnelInternal) continue;
        const newNode = []
        for (const node of tunnelInternal.content.nodes) {
          const orgNode = nodeAll.nodes.find((t) => t.node == node.node)
          if (!orgNode) {
            newNode.push({node: node.node, weight: 100, tlsCert: null})
          } else {
            newNode.push({node: orgNode.node, weight: orgNode.weight, tlsCert: orgNode.tlsCert})
          }
        }
        nodeAll.nodes = newNode
      }
    },

    getCertificates() {
      this.$gql
        .query(
          `certificates(filters: $filters, pagination: { start: 0, limit: ${this.$DFT_LIMIT}}){data{id,attributes{
						name,
						type,
						namespace{data{id,attributes{
							name,
							registry{data{id,attributes{name}}}
						}}},
						content
					}}}`,
          { filters: { type: {eq: "client"} }},
          {
            filters: "CertificateFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.certificates = res.data;
        });

      this.$gql
        .query(
          `certificates(filters: $filters, pagination: { start: 0, limit: ${this.$DFT_LIMIT}}){data{id,attributes{
						name,
						type,
						namespace{data{id,attributes{
							name,
							registry{data{id,attributes{name}}}
						}}},
						content
					}}}`,
          { filters: { type: {eq: "tunnel"} }},
          {
            filters: "CertificateFiltersInput",
            pagination: "PaginationArg",
          }
        )
        .then((res) => {
          this.certificatesTls = res.data;
        });
    },

    renderCallback() {
      this.detail.content = JSON.stringify(
        this.initContent[this.detail.type],
      );
      this.detail.json = this.initContent[this.detail.type];
      this.activeKey="1";
    },
		
    showPluginBox() {
      this.visible = true;
    },

    handleClose(list, index) {
      delete list[index];
    },

    onTabChange(key) {
      console.log(key);
    },

    valid() {
      if (this.detail.name == "") {
        this.$message.error(this.$t("The name cannot be empty"), 3);
        return false;
      }
      return true;
    },

    validate() {
      this.$refs.layout.$refs.form
        .validateFields()
        .then(() => {
          this.save();
        })
        .catch(() => {});
    },

    validLogic() {
      if (this.detail.type == "tunnelInternal") {
        if (
          !this.detail.template
        ) {
          this.$message.error(this.$t("Please set all config"), 3);
          return false;
        }
      } else {
        if (
          !this.detail.json.log.bind.id ||
          !this.detail.template
        ) {
          this.$message.error(this.$t("Please set all config"), 3);
          return false;
        }
      }

      if (this.detail.type == "tunnelInternal") {
        if (!this.detail.json.nodes.length || this.detail.json.nodes.find((n) => !n.node)) {
          this.$message.error(this.$t("Please set nodes"), 3);
          return false;
        }
      }
      return true;
    },

    save() {
      if (!this.validLogic()) {
        return;
      }
			
      let savedata = _.cloneDeep(this.detail);
      let content = _.cloneDeep(savedata.json);
				
      delete savedata.createdAt;
      delete savedata.updatedAt;
      delete savedata.content;
      delete savedata.json;
      delete this.detail.json;
			
			
      if (this.pid) {
        delete savedata.id;
        delete savedata.template;
        this.$gql
          .mutation(
            `updateFleet(id:${this.pid}, data: $data){data{id}}`,
            {
              data: {
                content,
                ...savedata,
              },
            },
            {
              data: "FleetInput!",
            }
          )
          .then(() => {
            this.$message.success(this.$t("Save successfully"), 3);
            this.$closePage(this.$route);
          });
      } else {
        delete savedata.id;
        this.$gql
          .mutation(
            `createFleet(data: $data){data{id}}`,
            {
              data: {
                content,
                ...savedata,
              },
            },
            {
              data: "FleetInput!",
            }
          )
          .then(() => {
            this.$message.success(this.$t("Created successfully"), 3);
            this.$closePage(this.$route);
          });
      }
    },

    setInternal(item) {
      const nodes = this.tunnelInternals.find((e)=> e.id == item.tunnelInternal)?.content?.nodes
      item.nodes = []
      for (const node of nodes) {
        item.nodes.push({node: node.node, weight: 100, tlsCert: null})
      }

    },
  },
};
</script>

<style lang="less" scoped>
  :deep(.ant-divider-dashed::before),
  :deep(.ant-divider-dashed::after) {
    border-color: #ccc !important;
  }
  .template-div {
    padding: 0 0 20px 0;
    display: flex;
    width: 100%;
  }
  .selector-icon {
    width: 20px;
    height: 20px;
    fill: #00adef;
    border-radius: 0;
    position: relative;
    top: 4px;
  }
</style>
