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
      <FormItem
        :label="$t(field.label)"
        :name="field?.name"
        :rules="field?.rules"
      >
        <a-switch
          v-if="
            field.type == 'boolean' ||
              (!field.type &&
                keyset[field.label] &&
                keyset[field.label].type == 'boolean')
          "
          @change="change"
          v-model:checked="field.value"
        />
        <a-input
          :type="field.type"
          v-if="field.type == 'text' || field.type == 'number'"
          :placeholder="$t('unset')"
          v-model:value="field.value"
          @change="change"
          :suffix="field.unit"
        />
        <a-input
          v-if="
            !field.type &&
              (keyset[field.label].type == 'text' ||
                keyset[field.label].type == 'number')
          "
          :type="keyset[field.label].type"
          :placeholder="$t('unset')"
          v-model:value="field.value"
          @change="change"
          :suffix="keyset[field.label].unit"
        />

        <a-input-password
          :type="field.type"
          v-if="field.type == 'password'"
          :placeholder="$t('unset')"
          @change="change"
          v-model:value="field.value"
        />
        <a-input-password
          v-if="!field.type && keyset[field.label].type == 'password'"
          :type="keyset[field.label].type"
          :placeholder="$t('unset')"
          @change="change"
          v-model:value="field.value"
        />
        <a-select
          class="form-width"
          @change="toggleSelect(field)"
          v-model:value="field.value"
          :placeholder="$t('unset')"
          v-if="
            field.type == 'select' ||
              (!field.type &&
                keyset[field.label] &&
                keyset[field.label].type == 'select')
          "
        >
          <a-select-option
            :key="index3"
            v-for="(option, index3) in field.values ||
              field.options ||
              keyset[field.label].options"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>

        <a-select
          class="form-width"
          v-model:value="field.value"
          :placeholder="$t('unset')"
          @change="change"
          v-if="
            field.type == 'multipleselect' ||
              (!field.type &&
                keyset[field.label] &&
                keyset[field.label].type == 'multipleselect')
          "
          mode="multiple"
        >
          <a-select-option
            :key="index3"
            v-for="(option, index3) in field.values ||
              field.options ||
              keyset[field.label].options"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>
        <a-textarea
          v-model:value="field.value"
          @change="change"
          v-if="
            field.type == 'textarea' ||
              (!field.type &&
                keyset[field.label] &&
                keyset[field.label].type == 'textarea')
          "
          :placeholder="$t('unset')"
          class="form-width"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
        <div
          class="form-tips"
          v-if="keyset[field.label] && keyset[field.label].tips"
        >
          {{ keyset[field.label].tips }}
        </div>
      </FormItem>

      <template v-if="field.subfields">
        <FormItem
          v-for="(subfield, index4) in field.subfields"
          :key="index4"
          :name="subfield?.name"
          :rules="subfield?.rules"
        >
          <a-switch
            v-if="
              subfield.type == 'boolean' ||
                (!subfield.type &&
                  keyset[subfield.label] &&
                  keyset[subfield.label].type == 'boolean')
            "
            @change="change"
            v-model:checked="subfield.value"
          />
          <a-input
            :type="subfield.type"
            v-if="subfield.type == 'text' || subfield.type == 'number'"
            :placeholder="$t('unset')"
            @change="change"
            v-model:value="subfield.value"
          />
          <a-input
            :type="keyset[subfield.label].type"
            v-if="
              !subfield.type &&
                (keyset[subfield.label].type == 'text' ||
                  keyset[subfield.label].type == 'number')
            "
            :placeholder="$t('unset')"
            @change="change"
            v-model:value="subfield.value"
          />
          <a-input-password
            :type="subfield.type"
            v-if="subfield.type == 'password'"
            :placeholder="$t('unset')"
            @change="change"
            v-model:value="subfield.value"
          />
          <a-input-password
            :type="keyset[subfield.label].type"
            v-if="!subfield.type && keyset[subfield.label].type == 'password'"
            :placeholder="$t('unset')"
            @change="change"
            v-model:value="subfield.value"
          />
          <a-select
            class="form-width"
            v-model:value="subfield.value"
            :placeholder="$t('unset')"
            @change="change"
            v-if="
              subfield.type == 'select' ||
                (!subfield.type &&
                  keyset[subfield.label] &&
                  keyset[subfield.label].type == 'select')
            "
          >
            <a-select-option
              v-for="(option, index3) in subfield.values ||
                subfield.options ||
                keyset[subfield.label].options"
              :key="index3"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
          <a-select
            class="form-width"
            v-model:value="subfield.value"
            :placeholder="$t('unset')"
            @change="change"
            v-if="
              subfield.type == 'multipleselect' ||
                (!subfield.type &&
                  keyset[subfield.label] &&
                  keyset[subfield.label].type == 'multipleselect')
            "
            mode="multiple"
          >
            <a-select-option
              v-for="(option, index3) in subfield.values ||
                subfield.options ||
                keyset[subfield.label].options"
              :key="index3"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
          <a-textarea
            v-model:value="subfield.value"
            @change="change"
            v-if="
              subfield.type == 'textarea' ||
                (!subfield.type &&
                  keyset[subfield.label] &&
                  keyset[subfield.label].type == 'textarea')
            "
            :placeholder="$t('unset')"
            class="form-width"
            :autosize="{ minRows: 4, maxRows: 6 }"
          />

          <div
            class="form-tips"
            v-if="keyset[subfield.label] && keyset[subfield.label].tips"
          >
            {{ keyset[subfield.label].tips }}
          </div>
        </FormItem>
      </template>
    </a-col>
  </a-row>
</template>

<script>
import FormItem from "@/components/form/FormItem";
export default {
  name: "AutoForm",
  i18n: require("./i18n"),
  components: {
    FormItem,
  },

  props: ["fields", "col"],
  data() {
    return {
      keyset: {
        /*remove*/ "Discovery Name": { type: "text" },
                   /*remove*/ "LB IP": { type: "text" },
                   /*remove*/ "LB Port": { type: "number" },
                   "Target Hosts": {
                     type: "textarea",
                     tips: "List of <ip>:<port>[@<weight>]",
                   },

                   /*remove*/ Slots: { type: "number" },
                   "Hash On": {
                     type: "select",
                     options: [
                       { value: "None", label: "None" },
                       { value: "IP Address", label: "IP Address" },
                       { value: "HTTP Header", label: "HTTP Header" },
                       { value: "HTTP Cookie", label: "HTTP Cookie" },
                       { value: "Application", label: "Application" },
                     ],
                   },

                   /*remove*/ "Hash Fallback": {
                     type: "select",
                     options: [
                       { value: "None", label: "None" },
                       { value: "IP Address", label: "IP Address" },
                       { value: "HTTP Header", label: "HTTP Header" },
                       { value: "HTTP Cookie", label: "HTTP Cookie" },
                       { value: "Application", label: "Application" },
                     ],
                   },

                   Type: {
                     type: "select",
                     options: [
                       { value: "TCP", label: "TCP" },
                       { value: "HTTP", label: "HTTP" },
                       { value: "HTTPS", label: "HTTPS" },
                     ],
                   },

                   "HTTPS Verify Certificate": {
                     type: "select",
                     options: [
                       { value: "Yes", label: "Yes" },
                       { value: "No", label: "No" },
                     ],
                   },

                   Concurrency: { type: "number" },
                   Timeout: { type: "number" },
                   "HTTPS SNI": { type: "text" },
                   "HTTPS Path": { type: "text" },
                   "HTTP Statuses": {
                     type: "multipleselect",
                     options: [
                       { value: 100, label: "100" },
                       { value: 101, label: "101" },
                       { value: 103, label: "103" },
                       { value: 200, label: "200" },
                       { value: 201, label: "201" },
                       { value: 202, label: "202" },
                       { value: 203, label: "203" },
                       { value: 204, label: "204" },
                       { value: 205, label: "205" },
                       { value: 206, label: "206" },
                       { value: 300, label: "300" },
                       { value: 301, label: "301" },
                       { value: 302, label: "302" },
                       { value: 303, label: "303" },
                       { value: 304, label: "304" },
                       { value: 307, label: "307" },
                       { value: 308, label: "308" },
                       { value: 400, label: "400" },
                       { value: 401, label: "401" },
                       { value: 403, label: "403" },
                       { value: 404, label: "404" },
                       { value: 405, label: "405" },
                       { value: 406, label: "406" },
                       { value: 407, label: "407" },
                       { value: 408, label: "408" },
                       { value: 500, label: "500" },
                       { value: 501, label: "501" },
                       { value: 502, label: "502" },
                       { value: 503, label: "503" },
                       { value: 504, label: "504" },
                     ],
                   },

                   Interval: { type: "number" },
                   Successes: { type: "number" },
                   "TCP Failures": { type: "number" },
                   "HTTP Failures": { type: "number" },
                   "HTTP Header": {
                     type: "textarea",
                     tips: "List of <header-key>:<value>",
                   },

                   Timeouts: { type: "number" },
                   "TCP Failures": { type: "number" },
                   "HTTP Failures": { type: "number" },
                   Algorithm: {
                     type: "select",
                     options: [
                       { value: "rr", label: "RoundRobinLoadBalancer" },
                       { value: "lc", label: "LeastWorkLoadBalancer" },
                       { value: "ch", label: "HashingLoadBalancer" },
                     ],
                   },

                   "Hash header key": { type: "text" },
                   Sticky: { type: "boolean" },
                   Port: { type: "number" },
                   "TLS Port": { type: "number" },
      },

      valueset: {
        "HTTP Header": [{ label: "HTTP Header", value: "" }],
      },
    };
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

    handleSubmit(e) {
      e.preventDefault();
    },

    toggleSelect(field) {
      if (
        this.valueset[field.value] &&
        this.valueset[field.value].length > 0
      ) {
        field.subfields = this.valueset[field.value];
      } else {
        delete field.subfields;
      }
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
  .form-tips {
    color: #aaa;
    font-size: 8pt;
  }
</style>
