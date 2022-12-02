<template>
  <a-card
    class="card nopd"
    :bordered="false"
    :title="title"
  >
    <a-table
      row-key="id"
      :columns="dataColumns"
      :data-source="address"
      :pagination="false"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'type'">
          <a-select
            class="ip-selector width-200"
            v-if="record.editable"
            v-model:value="record.type"
            @change="handleChange(record.type, record.id, 'type')"
          >
            <a-select-option
              :value="option.value"
              v-for="(option, idx) in options"
              :key="idx"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
          <span v-else>{{ options_keyset[record.type] }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'a'">
          <span v-if="record.type<=4">
            <a-input
              key="a"
              type="number"
              min="0"
              max="999"
              v-if="record.editable"
              class="ipunit"
              v-model:value="record.a"
              :placeholder="record.a"
              @change="handleChange(record.a, record.id, 'a')"
            />
            <span v-else>{{ record.a }}</span>
            <span>.</span>
            <a-input
              key="b"
              type="number"
              min="0"
              max="999"
              v-if="record.editable"
              class="ipunit"
              v-model:value="record.b"
              :placeholder="record.b"
              @change="handleChange(record.b, record.id, 'b')"
            />
            <span v-else>{{ record.b }}</span>
            <span>.</span>
            <a-input
              key="c"
              type="number"
              min="0"
              max="999"
              v-if="record.editable"
              class="ipunit"
              v-model:value="record.c"
              :placeholder="record.c"
              @change="handleChange(record.c, record.id, 'c')"
            />
            <span v-else>{{ record.c }}</span>
            <span>.</span>
          </span>
          <span v-else> 
            <a-input
              key="a"
              v-if="record.editable"
              class="ipunit width-200"
              v-model:value="record.a"
              :placeholder="record.a"
              @change="handleChange(record.a, record.id, 'a')"
            />
            <span v-else>{{ record.a }}</span>
          </span>
          <span v-if="record.type == 1">x</span>
          <span v-if="record.type == 2">
            <a-input
              key="d"
              type="number"
              min="0"
              :max="record.suffix ? record.suffix - 1 : 999"
              v-if="record.editable"
              class="ipunit"
              v-model:value="record.d"
              :placeholder="record.d"
              @change="handleChange(record.d, record.id, 'd')"
            />
            <span v-if="record.editable">- {{ record.a }} . {{ record.b }} . {{ record.c }} .</span>
            <a-input
              key="suffix"
              type="number"
              :min="record.d * 1 + 1"
              max="999"
              v-if="record.editable"
              class="ipunit"
              v-model:value="record.suffix"
              :placeholder="record.suffix"
              @change="handleChange(record.suffix, record.id, 'suffix')"
            />
            <span v-if="!record.editable">{{ record.d }} - {{ record.a }} . {{ record.b }} . {{ record.c }} . {{ record.suffix }}</span>
          </span>

          <span v-if="record.type == 3">
            <a-input
              key="d"
              type="number"
              min="0"
              max="999"
              v-if="record.editable"
              class="ipunit"
              v-model:value="record.d"
              :placeholder="record.d"
              @change="handleChange(record.d, record.id, 'd')"
            />
            <span v-if="record.editable">/</span>
            <a-input
              key="suffix"
              type="number"
              min="0"
              max="999"
              v-if="record.editable"
              class="ipunit"
              v-model:value="record.suffix"
              :placeholder="record.suffix"
              @change="handleChange(record.suffix, record.id, 'suffix')"
            />
            <span v-if="!record.editable">{{ record.d }} / {{ record.suffix }}</span>
          </span>
          <span v-if="record.type == 4">
            <a-input
              key="d"
              type="number"
              min="0"
              max="999"
              v-if="record.editable"
              class="ipunit"
              v-model:value="record.d"
              :placeholder="record.d"
              @change="handleChange(record.d, record.id, 'd')"
            />
            <span v-if="!record.editable">{{ record.d }}</span>
          </span>
          <span v-if="record.type == 5">
            <span> : </span>
            <a-input
              key="d"
              v-if="record.editable"
              class="ipunit"
              v-model:value="record.d"
              :placeholder="record.d"
              @change="handleChange(record.d, record.id, 'd')"
            />
            <span v-if="record.editable">- {{ record.a }} :</span>
            <a-input
              key="suffix"
              v-if="record.editable"
              class="ipunit"
              v-model:value="record.suffix"
              :placeholder="record.suffix"
              @change="handleChange(record.suffix, record.id, 'suffix')"
            />
            <span v-if="!record.editable">{{ record.d }} - {{ record.a }} : {{ record.suffix }}</span>
          </span>

          <span v-if="record.type == 6">
            <span> / </span>
            <a-input
              key="suffix"
              type="number"
              min="0"
              max="999"
              v-if="record.editable"
              class="ipunit"
              v-model:value="record.suffix"
              :placeholder="record.suffix"
              @change="handleChange(record.suffix, record.id, 'suffix')"
            />
            <span v-if="!record.editable">{{ record.suffix }}</span>
          </span>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <span v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record.id, true)">{{ $t('Ok') }}</a>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="$t('deleteConfirm')"
                @confirm="remove(index)"
              >
                <a>{{ $t('delete') }}</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="cancle(record.id)">{{ $t('Ok') }}</a>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="$t('deleteConfirm')"
                @confirm="remove(index)"
              >
                <a>{{ $t('delete') }}</a>
              </a-popconfirm>
            </span>
          </span>
          <span v-else>
            <a @click="toggle(record.id)">{{ $t('edit') }}</a>
            <a-divider type="vertical" />
            <a-popconfirm
              :title="$t('deleteConfirm')"
              @confirm="remove(index)"
            >
              <a>{{ $t('delete') }}</a>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>
    <div class="pd-20">
      <a-button
        class="full"
        type="dashed"
        @click="newMember"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        {{ $t('new') }}
      </a-button>
    </div>
  </a-card>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue';
const columns = [
  {
    key: 'Type',
    dataIndex: 'type',
    id: 'type',
    width: '20%'
  },
  {
    key: 'IP Pool',
    dataIndex: 'a',
    id: 'a',
    width: '40%'
  },
  {
    key: 'Action',
    id: 'operation',
    dataIndex: 'operation'
  }
];

export default {
  name: 'IPList',
  i18n: require('@/i18n'),
  components: { PlusOutlined },
  props: ['list', 'title', 'fixedType'],
  data() {
    return {
      columns,
      options_keyset: [
        "",
        "0.0.0.x IP",
        '0.0.0.x - 0.0.0.y IP',
        '0.0.0.x/y IP',
        "Fixed IP",
        "::x - ::y IPv6",
        "::x/y IPv6",
      ],

      options: [
        // { value: 1, label: "0.0.0.x IP" },
        { value: 2, label: '0.0.0.x - 0.0.0.y IP' },
        { value: 3, label: '0.0.0.x/y IP' },
        // { value: 4, label: "Fixed IP" },
        { value: 5, label: '::x - ::y IPv6' },
        { value: 6, label: '::x/y IPv6' }
      ],

      address: []
    };
  },

  computed: {
    dataColumns() {
      if (this.fixedType && this.columns[0].id == 'type') {
        this.columns.splice(0, 1);
      }
      return this.columns.map(column => {
        column.title = this.$t(column.key);
        return column;
      });
    }
  },

  watch: {
    list() {
      this.address = this.list;
    }
  },

  created() {
    this.address = this.list;
  },

  methods: {
    newMember() {
      this.address.push({
        id: this.address.length + 1,
        type: this.fixedType ? this.fixedType : 2,
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        suffix: 0,
        editable: true,
        isNew: true
      });
    },

    remove(key) {
      this.address.filter(item => item.id !== key);
      console.log(key);
      this.address.splice(key, 1);
    },

    saveRow(key) {
      let target = this.address.filter(item => {
        return item.id === key;
      })[0];
      target.editable = false;
      target.isNew = false;
    },

    toggle(key) {
      let index = null;
      let target = this.address.filter((item, i) => {
        if (item.id === key) {
          index = i;
        }
        return item.id === key;
      })[0];
      target.editable = !target.editable;
      this.$set(this.address, index, target);
    },

    cancle(key) {
      let index = null;
      let target = this.address.filter((item, i) => {
        if (item.id === key) {
          index = i;
        }
        return item.id === key;
      })[0];
      target.editable = false;
      this.$set(this.address, index, target);
    },

    handleChange(value, key, column) {
      const newData = [...this.address];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        if(target.type==5){
          target.a = "::ffff:0";
          target.suffix = "ffff";
        }else if(target.type==6){
          target.a = "::ffff:0:0";
          target.suffix = "120";
        }
        target[column] = value;
        this.address = newData;
      }
      this.$emit('update:list', this.address);
    },

    valid() {
      for (let i = 0; i < this.address.length; i++) {
        let node = this.address[i];
        if (node.type <= 4 && (node.a === '' || node.b === '' || node.c === '')) {
          this.$message.error(i + 1 + ' row IP not set', 3);
          return false;
        }
        if (node.type > 4 && node.a === '') {
          this.$message.error(i + 1 + ' row IP not set', 3);
          return false;
        }
        if ((node.type == 2 || node.type == 5) && (node.d === '' || node.suffix === '')) {
          this.$message.error(i + 1 + ' row IP not set', 3);
          return false;
        }
        if ((node.type == 3 || node.type == 6) && (node.d === '' || node.suffix === '')) {
          this.$message.error(i + 1 + ' row IP not set', 3);
          return false;
        }
        if (node.type == 4 && node.d === '') {
          this.$message.error(i + 1 + ' row IP not set', 3);
          return false;
        }
        if (node.type == 2 && node.d * 1 >= node.suffix * 1) {
          this.$message.error(i + 1 + ' invalid row IP segment range', 3);
          return false;
        }
      }
      return true;
    }
  }
};
</script>

<style lang="less" scoped>
.ipunit {
	width: 60px;
	padding-left: 0;
	padding-right: 0;
	text-align: center;
	display: inline-block;
}
.ip-selector {
	margin: -5px 0;
}
</style>
