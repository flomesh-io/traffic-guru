(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[4868],{79797:function(t,e,n){!function(){"use strict";var e=n(17536).typeOf;t.exports.stringify=function(t){var n,a="";return"---"+(n={undefined:function(){return"null"},null:function(){return"null"},number:function(t){return t},boolean:function(t){return t?"true":"false"},string:function(t){return JSON.stringify(t)},array:function(t){var i="";return 0===t.length?i+="[]":(a=a.replace(/$/,"  "),t.forEach((function(t){var r=n[e(t)];if(!r)throw new Error("what the crap: "+e(t));i+="\n"+a+"- "+r(t)})),a=a.replace(/  /,""),i)},object:function(t){var i="";return 0===Object.keys(t).length?i+="{}":(a=a.replace(/$/,"  "),Object.keys(t).forEach((function(r){var s=t[r],l=n[e(s)];if(void 0!==s){if(!l)throw new Error("what the crap: "+e(s));i+="\n"+a+r+": "+l(s)}})),a=a.replace(/  /,""),i)},function:function(){return"[object Function]"}})[e(t)](t)+"\n"}}()},17536:function(t){!function(){"use strict";var e,n,a=Function("return this")(),i="Boolean Number String Function Array Date RegExp Object".split(" "),r={};for(e in i)i.hasOwnProperty(e)&&(n=i[e],r["[object "+n+"]"]=n.toLowerCase());function s(t){return null==t?String(t):r[Object.prototype.toString.call(t)]||"object"}function l(t){var e,n;if("object"===s(t))for(e in t)if(void 0!==(n=t[e])&&"function"!==s(n))return!1;return!0}String.prototype.entityify||(String.prototype.entityify=function(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}),String.prototype.quote||(String.prototype.quote=function(){var t,e,n=this.length,a='"';for(e=0;e<n;e+=1)if((t=this.charAt(e))>=" ")"\\"!==t&&'"'!==t||(a+="\\"),a+=t;else switch(t){case"\b":a+="\\b";break;case"\f":a+="\\f";break;case"\n":a+="\\n";break;case"\r":a+="\\r";break;case"\t":a+="\\t";break;default:t=t.charCodeAt(),a+="\\u00"+Math.floor(t/16).toString(16)+(t%16).toString(16)}return a+'"'}),String.prototype.supplant||(String.prototype.supplant=function(t){return this.replace(/{([^{}]*)}/g,(function(e,n){var a=t[n];return"string"==typeof a||"number"==typeof a?a:e}))}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/,"$1")}),t.exports={typeOf:s,isEmpty:l},a.typeOf=a.typeOf||s,a.isEmpty=a.isEmpty||l}()},44107:function(t,e,n){"use strict";n.d(e,{Z:function(){return u}});var a=n(66252),i=n(3577);var r=n(21936),s=n(8333);let l=n(79797),o=n(93320);var c={name:"Json2YamlCard",components:{JsonEditor:r.Z,YamlEditor:s.Z},props:["jsonVal","isCreate","height","isReadonly","url","isPop"],i18n:n(89234),data(){return{configTab:[{key:"YAML",tab:"YAML"},{key:"JSON",tab:"JSON"}],configKey:"YAML",json:"{}",yaml:""}},watch:{json(t,e){t!=e&&this.jsonInput(t)},yaml(t,e){t!=e&&this.yamlInput(t)},jsonVal:{handler(t,e){if("{}"!=t&&""!=t||(t='{"key":"value"}'),t!=e){"object"==typeof JSON.parse(t)&&(this.json=t)}},immediate:!0}},created(){},mounted(){this.init()},methods:{onTabChange(t,e){this[e]=t},jsonInput(t){try{"object"==typeof JSON.parse(t)&&(this.yaml=this.convertToYaml(t),this.$emit("update:jsonVal",this.json),this.$emit("change",this.json))}catch(t){}},yamlInput(t){let e=o.load(t),n=JSON.stringify(e,null,"  ");"object"==typeof JSON.parse(n)&&(this.$emit("update:jsonVal",n),this.$emit("change",n))},getDefaultYamlConfig(){if(!this.url)return this.yaml=this.convertToYaml(this.jsonVal),void this.yamlInput(this.yaml);fetch(this.url).then((t=>t.text())).then((t=>{this.url.indexOf(".yaml");let e=o.load(t),n=JSON.stringify(e,null,"  "),a=JSON.parse(n);a.spec&&a.spec.namespace&&(a.spec.namespace="_all"==localStorage.getItem("NAMESPACE")?"default":localStorage.getItem("NAMESPACE"));let i=JSON.stringify(a);this.yaml=this.convertToYaml(i),setTimeout((()=>{this.yamlInput(this.yaml)}),2e3)})).catch((()=>{}))},convertToYaml(t){if(""==t)return"";let e=JSON.parse(t),n=null;return n=l.stringify(e),n},init(){this.isCreate?this.getDefaultYamlConfig():(this.yaml=this.convertToYaml(this.jsonVal),this.yamlInput(this.yaml))}}};var u=(0,n(83744).Z)(c,[["render",function(t,e,n,r,s,l){const o=(0,a.up)("YamlEditor"),c=(0,a.up)("JsonEditor"),u=(0,a.up)("a-button"),p=(0,a.up)("a-card");return(0,a.wg)(),(0,a.j4)(p,{class:(0,i.C_)(["card nopd",n.isPop?"isPop":""]),"tab-list":s.configTab,"active-tab-key":s.configKey,onTabChange:e[2]||(e[2]=t=>l.onTabChange(t,"configKey")),bordered:!1},{tabBarExtraContent:(0,a.w5)((()=>[n.url?((0,a.wg)(),(0,a.j4)(u,{key:0,type:"dashed",onClick:l.getDefaultYamlConfig},{default:(0,a.w5)((()=>[(0,a.Uk)((0,i.zw)(t.$t("reset")),1)])),_:1},8,["onClick"])):(0,a.kq)("",!0)])),default:(0,a.w5)((()=>["YAML"==s.configKey?((0,a.wg)(),(0,a.j4)(o,{key:0,height:n.height,"is-readonly":n.isReadonly,value:s.yaml,"onUpdate:value":e[0]||(e[0]=t=>s.yaml=t)},null,8,["height","is-readonly","value"])):(0,a.kq)("",!0),"JSON"==s.configKey?((0,a.wg)(),(0,a.j4)(c,{key:1,height:n.height,"is-readonly":n.isReadonly,"is-json":!0,noreset:!n.isReadonly,value:s.json,"onUpdate:value":e[1]||(e[1]=t=>s.json=t)},null,8,["height","is-readonly","noreset","value"])):(0,a.kq)("",!0)])),_:1},8,["class","tab-list","active-tab-key"])}]])},74868:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return v}});var a=n(66252),i=n(3577);const r=["onClick"],s=["onClick"],l=["onClick"],o={class:"list-content"},c={key:0,class:"list-content-item"},u={key:1},p={key:1,class:"list-content-item"};n(57658);var d=n(44107),h=n(2692),g=n(99684),y=n(21826),m=n(30631),f=n(3075),w={name:"RegistryList",i18n:n(89234),components:{MoreOutlined:h.Z,PlusCircleTwoTone:g.Z,SyncOutlined:y.Z,EyeOutlined:m.Z,Json2YamlCard:d.Z},data(){return{service:"{\n\t  }",RegistrySvg:f,key:"",pageSize:10,pageNo:1,total:0,loading:!0,list:[]}},computed:{start(){return(this.pageNo-1)*this.pageSize}},created(){this.search()},methods:{loadService(t){this.service=t.services},newLb(){this.$router.push({path:"/ops-center/registry/create"})},detail(t){this.$router.push({path:"/ops-center/registry/detail/"+t})},remove(t){this.$gql.mutation(`deleteRegistry(id:${t}){data{id}}`).then((()=>{this.$message.success(this.$t("Deleted successfully"),3),this.search()}))},tosync(t){t.sync=!0,this.$gql.mutation(`refreshRegistry(id:${t.id})`).then((()=>{this.$message.success(this.$t("Sync successfully"),3),t.sync=!1,this.search()}))},toimport(){},search(t,e){t&&(this.pageNo=t,this.pageSize=e);let n={start:this.start,limit:this.pageSize};this.loading=!0;let a={name:{contains:this.key}};this.$gql.query("registries(filters: $filters, pagination: $pagination){\n\t\t\t\t\t\tdata{id,attributes{\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\ttype,\n\t\t\t\t\t\t\taddress,\n\t\t\t\t\t\t\tservices(pagination: {limit: 9999 }){data{id,attributes{name}}},\n\t\t\t\t\t\t\tnamespaces(pagination: {limit: 9999 }){data{id,attributes{\n\t\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\t\tservices{data{id,attributes{\n\t\t\t\t\t\t\t\t\tuid,\n\t\t\t\t\t\t\t\t\tfleet{data{id,attributes{name}}},\n\t\t\t\t\t\t\t\t\torganization{data{id,attributes{name}}},\n\t\t\t\t\t\t\t\t\tnamespace,\n\t\t\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\t\t\tregistry{data{id,attributes{name}}},\n\t\t\t\t\t\t\t\t\tcontent,\n\t\t\t\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t\t\t\t}}}\n\t\t\t\t\t\t\t}}}\n\t\t\t\t\t\t}},\n\t\t\t\t\t\tmeta{pagination{total}}\n\t\t\t\t\t}",{filters:a,pagination:n},{filters:"RegistryFiltersInput",pagination:"PaginationArg"}).then((t=>{this.list=t.data,this.list.forEach((t=>{t.namespacesString=t.namespaces?JSON.stringify(t.namespaces):"{}"})),this.total=t.pagination.total,this.loading=!1}))}}};var v=(0,n(83744).Z)(w,[["render",function(t,e,n,d,h,g){const y=(0,a.up)("a-input-search"),m=(0,a.up)("a-divider"),f=(0,a.up)("PlusCircleTwoTone"),w=(0,a.up)("a-button"),v=(0,a.up)("SyncOutlined"),k=(0,a.up)("a-avatar"),S=(0,a.up)("a-list-item-meta"),b=(0,a.up)("a-menu-item"),j=(0,a.up)("a-popconfirm"),C=(0,a.up)("a-menu"),$=(0,a.up)("MoreOutlined"),_=(0,a.up)("a-dropdown"),O=(0,a.up)("a-tag"),z=(0,a.up)("a-badge"),N=(0,a.up)("Json2YamlCard"),E=(0,a.up)("EyeOutlined"),J=(0,a.up)("a-popover"),T=(0,a.up)("a-list-item"),Y=(0,a.up)("a-list"),W=(0,a.up)("a-card"),A=(0,a.Q2)("permission");return(0,a.wg)(),(0,a.iD)("div",null,[(0,a.Wm)(W,{bordered:!1,title:t.$t("Registry"),loading:h.loading},{extra:(0,a.w5)((()=>[(0,a._)("div",null,[(0,a.Wm)(y,{value:h.key,"onUpdate:value":e[0]||(e[0]=t=>h.key=t),onSearch:e[1]||(e[1]=t=>g.search()),class:"right-search-input",placeholder:t.$t("search")},null,8,["value","placeholder"]),(0,a.wy)((0,a.Wm)(m,{type:"vertical"},null,512),[[A,["registry:create"]]]),(0,a.wy)(((0,a.wg)(),(0,a.j4)(w,{type:"link",shape:"circle",onClick:g.newLb},{icon:(0,a.w5)((()=>[(0,a.Wm)(f,{class:"font-20 icon-menu-sm rotate-icon"})])),_:1},8,["onClick"])),[[A,["registry:create"]]])])])),default:(0,a.w5)((()=>[(0,a.Wm)(Y,{size:"large",pagination:{showSizeChanger:!0,showQuickJumper:!1,onShowSizeChange:g.search,onChange:g.search,current:h.pageNo,pageSize:h.pageSize,showTotal:(e,n)=>`${t.$t("Total")} ${e}`,total:h.total}},{default:(0,a.w5)((()=>[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(h.list,((e,n)=>((0,a.wg)(),(0,a.j4)(T,{key:n},{actions:(0,a.w5)((()=>[(0,a._)("div",null,[(0,a.Wm)(_,null,{overlay:(0,a.w5)((()=>[(0,a.Wm)(C,null,{default:(0,a.w5)((()=>[(0,a.Wm)(b,null,{default:(0,a.w5)((()=>[(0,a.wy)(((0,a.wg)(),(0,a.iD)("a",{onClick:t=>g.tosync(e)},[(0,a.Uk)((0,i.zw)(t.$t("Sync")),1)],8,s)),[[A,["registry:update"]]])])),_:2},1024),(0,a.Wm)(b,null,{default:(0,a.w5)((()=>[(0,a.wy)(((0,a.wg)(),(0,a.iD)("a",{onClick:t=>g.detail(e.id)},[(0,a.Uk)((0,i.zw)(t.$t("edit")),1)],8,l)),[[A,["registry:update"]]])])),_:2},1024),(0,a.Wm)(b,null,{default:(0,a.w5)((()=>[(0,a.Wm)(j,{placement:"topLeft","ok-text":t.$t("Yes"),"cancel-text":t.$t("No"),onConfirm:t=>g.remove(e.id)},{title:(0,a.w5)((()=>[(0,a._)("p",null,(0,i.zw)(t.$t("Tip")),1),(0,a._)("p",null,(0,i.zw)(t.$t("Are you sure to delete this?")),1)])),default:(0,a.w5)((()=>[(0,a.wy)(((0,a.wg)(),(0,a.iD)("a",null,[(0,a.Uk)((0,i.zw)(t.$t("delete")),1)])),[[A,["registry:delete"]]])])),_:2},1032,["ok-text","cancel-text","onConfirm"])])),_:2},1024)])),_:2},1024)])),default:(0,a.w5)((()=>[(0,a._)("a",null,[(0,a.Wm)($)])])),_:2},1024)])])),default:(0,a.w5)((()=>[(0,a.Wm)(S,null,{avatar:(0,a.w5)((()=>[e.sync?((0,a.wg)(),(0,a.j4)(v,{key:0,class:"font-30 gray",spin:""})):((0,a.wg)(),(0,a.j4)(k,{key:1,class:"avatar-img font-30 primary schedule",size:"small",shape:"square",src:h.RegistrySvg},null,8,["src"]))])),title:(0,a.w5)((()=>[(0,a._)("a",{onClick:t=>g.detail(e.id)},(0,i.zw)(e.name?e.name:"Unnamed"),9,r)])),description:(0,a.w5)((()=>[(0,a.Uk)((0,i.zw)(t.$t("Type"))+"："+(0,i.zw)(e.type),1)])),_:2},1024),(0,a._)("div",o,[e.address?((0,a.wg)(),(0,a.iD)("div",c,[(0,a._)("span",null,(0,i.zw)(t.$t("Location")),1),(0,a._)("p",null,[e.address?((0,a.wg)(),(0,a.j4)(O,{key:0},{default:(0,a.w5)((()=>[(0,a.Uk)((0,i.zw)(e.address),1)])),_:2},1024)):((0,a.wg)(),(0,a.iD)("span",u,"-"))])])):(0,a.kq)("",!0),e.namespaces&&e.namespaces.length>0?((0,a.wg)(),(0,a.iD)("div",p,[(0,a._)("span",null,(0,i.zw)(t.$t("Service")),1),(0,a._)("p",null,[(0,a.Wm)(z,{count:e.services?.length},null,8,["count"]),(0,a.Wm)(J,{title:t.$t("Services"),trigger:"click"},{content:(0,a.w5)((()=>[(0,a.Wm)(N,{class:"card nopd width-500","is-readonly":!1,"is-create":!1,jsonVal:e.namespacesString,"onUpdate:jsonVal":t=>e.namespacesString=t},null,8,["jsonVal","onUpdate:jsonVal"])])),default:(0,a.w5)((()=>[(0,a.Wm)(w,{type:"link",onClick:t=>g.loadService(e)},{default:(0,a.w5)((()=>[(0,a.Wm)(E,{class:"eye relative",style:{top:"4px"}})])),_:2},1032,["onClick"])])),_:2},1032,["title"])])])):(0,a.kq)("",!0)])])),_:2},1024)))),128))])),_:1},8,["pagination"])])),_:1},8,["title","loading"])])}],["__scopeId","data-v-1b9f90c2"]])}}]);