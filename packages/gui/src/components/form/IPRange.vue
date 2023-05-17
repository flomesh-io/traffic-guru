<template>
  <span v-if="type<=4">
    <a-input-number
      key="a"
      :min="0"
      :max="999"
      v-if="editable"
      class="ipunit"
      v-model:value="ip.a"
      :placeholder="ip.a"
      @change="handleChange(ip.a, 'a')"
    />
    <span v-else>{{ ip.a }}</span>
    <span>.</span>
    <a-input-number
      key="b"
      type="number"
      :min="0"
      :max="999"
      v-if="editable"
      class="ipunit"
      v-model:value="ip.b"
      :placeholder="ip.b"
      @change="handleChange(ip.b, 'b')"
    />
    <span v-else>{{ ip.b }}</span>
    <span>.</span>
    <a-input-number
      key="c"
      :min="0"
      :max="999"
      v-if="editable"
      class="ipunit"
      v-model:value="ip.c"
      :placeholder="ip.c"
      @change="handleChange(ip.c, 'c')"
    />
    <span v-else>{{ ip.c }}</span>
    <span>.</span>
  </span>
  <span v-else> 
    <a-input
      key="a"
      v-if="editable"
      class="ipunit width-200"
      v-model:value="ip.a"
      :placeholder="ip.a"
      @change="handleChange(ip.a, 'a')"
    />
    <span v-else>{{ ip.a }}</span>
  </span>
  <span v-if="type == 1">x</span>
  <span v-if="type == 2">
    <a-input-number
      key="d"
      :min="0"
      :max="ip.suffix ? ip.suffix - 1 : 999"
      v-if="editable"
      class="ipunit"
      v-model:value="ip.d"
      :placeholder="ip.d"
      @change="handleChange(ip.d, 'd')"
    />
    <span v-if="editable">- {{ ip.a }} . {{ ip.b }} . {{ ip.c }} .</span>
    <a-input-number
      key="suffix"
      :min="ip.d * 1 + 1"
      :max="999"
      v-if="editable"
      class="ipunit"
      v-model:value="ip.suffix"
      :placeholder="ip.suffix"
      @change="handleChange(ip.suffix, 'suffix')"
    />
    <span v-if="!editable">{{ ip.d }} - {{ ip.a }} . {{ ip.b }} . {{ ip.c }} . {{ ip.suffix }}</span>
  </span>
  
  <span v-if="type == 3">
    <a-input-number
      key="d"
      :min="0"
      :max="999"
      v-if="editable"
      class="ipunit"
      v-model:value="ip.d"
      :placeholder="ip.d"
      @change="handleChange(ip.d, 'd')"
    />
    <span v-if="editable">/</span>
    <a-input-number
      key="suffix"
      type="number"
      :min="0"
      :max="999"
      v-if="editable"
      class="ipunit"
      v-model:value="ip.suffix"
      :placeholder="ip.suffix"
      @change="handleChange(ip.suffix, 'suffix')"
    />
    <span v-if="!editable">{{ ip.d }} / {{ ip.suffix }}</span>
  </span>
  <span v-if="type == 4">
    <a-input-number
      key="d"
      type="number"
      :min="0"
      :max="999"
      v-if="editable"
      class="ipunit"
      v-model:value="ip.d"
      :placeholder="ip.d"
      @change="handleChange(ip.d, 'd')"
    />
    <span v-if="!editable">{{ ip.d }}</span>
  </span>
  <span v-if="type == 5">
    <span> : </span>
    <a-input
      key="d"
      v-if="editable"
      class="ipunit"
      v-model:value="ip.d"
      :placeholder="ip.d"
      @change="handleChange(ip.d, 'd')"
    />
    <span v-if="editable">- {{ ip.a }} :</span>
    <a-input
      key="suffix"
      v-if="editable"
      class="ipunit"
      v-model:value="ip.suffix"
      :placeholder="ip.suffix"
      @change="handleChange(ip.suffix, 'suffix')"
    />
    <span v-if="!editable">{{ ip.d }} - {{ ip.a }} : {{ ip.suffix }}</span>
  </span>
  
  <span v-if="type == 6">
    <span> / </span>
    <a-input-number
      key="suffix"
      :min="0"
      :max="999"
      v-if="editable"
      class="ipunit"
      v-model:value="ip.suffix"
      :placeholder="ip.suffix"
      @change="handleChange(ip.suffix, 'suffix')"
    />
    <span v-if="!editable">{{ ip.suffix }}</span>
  </span>
</template>

<script>
export default {
  name: "IPRange",
  i18n: require("@/i18n"),
  props: ['type', 'editable', 'ip'],

  data() {
    return {};
  },

  created() {},

  methods: {
    handleChange(value, column) {
      let _ip = this.ip;
      if (_ip) {
        if(this.type==5){
          if(!_ip.a){
            _ip.a = "::ffff:0";
          }
          if(!_ip.suffix){
            _ip.suffix = "ffff";
          }
        }else if(_ip.type==6){
          if(!_ip.a){
            _ip.a = "::ffff:0:0";
          }
          if(!_ip.suffix){
            _ip.suffix = "120";
          }
        }
        _ip[column] = value;
        this.$emit('update:ip', _ip);
        this.$emit('handleChange', _ip);
      }
    },
		
  },
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
</style>
