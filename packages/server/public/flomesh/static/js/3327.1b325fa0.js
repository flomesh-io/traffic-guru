(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[3327],{79797:function(t,e,a){!function(){"use strict";var e=a(17536).typeOf;t.exports.stringify=function(t){var a,i="";return"---"+(a={undefined:function(){return"null"},null:function(){return"null"},number:function(t){return t},boolean:function(t){return t?"true":"false"},string:function(t){return JSON.stringify(t)},array:function(t){var n="";return 0===t.length?n+="[]":(i=i.replace(/$/,"  "),t.forEach((function(t){var l=a[e(t)];if(!l)throw new Error("what the crap: "+e(t));n+="\n"+i+"- "+l(t)})),i=i.replace(/  /,""),n)},object:function(t){var n="";return 0===Object.keys(t).length?n+="{}":(i=i.replace(/$/,"  "),Object.keys(t).forEach((function(l){var s=t[l],r=a[e(s)];if(void 0!==s){if(!r)throw new Error("what the crap: "+e(s));n+="\n"+i+l+": "+r(s)}})),i=i.replace(/  /,""),n)},function:function(){return"[object Function]"}})[e(t)](t)+"\n"}}()},17536:function(t){!function(){"use strict";var e,a,i=Function("return this")(),n="Boolean Number String Function Array Date RegExp Object".split(" "),l={};for(e in n)n.hasOwnProperty(e)&&(a=n[e],l["[object "+a+"]"]=a.toLowerCase());function s(t){return null==t?String(t):l[Object.prototype.toString.call(t)]||"object"}function r(t){var e,a;if("object"===s(t))for(e in t)if(void 0!==(a=t[e])&&"function"!==s(a))return!1;return!0}String.prototype.entityify||(String.prototype.entityify=function(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}),String.prototype.quote||(String.prototype.quote=function(){var t,e,a=this.length,i='"';for(e=0;e<a;e+=1)if((t=this.charAt(e))>=" ")"\\"!==t&&'"'!==t||(i+="\\"),i+=t;else switch(t){case"\b":i+="\\b";break;case"\f":i+="\\f";break;case"\n":i+="\\n";break;case"\r":i+="\\r";break;case"\t":i+="\\t";break;default:t=t.charCodeAt(),i+="\\u00"+Math.floor(t/16).toString(16)+(t%16).toString(16)}return i+'"'}),String.prototype.supplant||(String.prototype.supplant=function(t){return this.replace(/{([^{}]*)}/g,(function(e,a){var i=t[a];return"string"==typeof i||"number"==typeof i?i:e}))}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/,"$1")}),t.exports={typeOf:s,isEmpty:r},i.typeOf=i.typeOf||s,i.isEmpty=i.isEmpty||r}()},93327:function(t,e,a){"use strict";a.d(e,{Z:function(){return P}});var i=a(66252),n=a(3577);const l={key:0},s={key:1,class:"gray"},r={key:0,class:"flex mt-10"};a(82801),a(57658);var o=a(96486),c=a.n(o),d=a(85263),u=a(61103),p=a(16822),h=a(1299),g=a(13589),f=a(8333),m=a(33907),y=a(62202),w={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M832 112H724V72c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v40H500V72c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v40H320c-17.7 0-32 14.3-32 32v120h-96c-17.7 0-32 14.3-32 32v632c0 17.7 14.3 32 32 32h512c17.7 0 32-14.3 32-32v-96h96c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM664 888H232V336h218v174c0 22.1 17.9 40 40 40h174v338zm0-402H514V336h.2L664 485.8v.2zm128 274h-56V456L544 264H360v-80h68v32c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-32h152v32c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-32h68v576z"}}]},name:"snippets",theme:"outlined"},v=a(33058);function k(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?Object(arguments[e]):{},i=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(a).filter((function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable})))),i.forEach((function(e){b(t,e,a[e])}))}return t}function b(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var $=function(t,e){var a=k({},t,e.attrs);return(0,i.Wm)(v.Z,k({},a,{icon:w}),null)};$.displayName="SnippetsOutlined",$.inheritAttrs=!1;var C=$;let S=a(93320),_=a(79797);var j={name:"RegistryBaseDetail",i18n:a(89234),components:{DetailListItem:g.Z,DetailList:h.Z,Status:p.Z,UploadOutlined:y.Z,SnippetsOutlined:C,PageLayout:u.Z,YamlEditor:f.Z},props:["pid","types"],data(){return{connectLoading:!1,namespaces:[],fileList:[],simpleImage:d.Z.PRESENTED_IMAGE_SIMPLE,service:"{\n\t\t}",configJson:null,yamlConfig:"",detail:{organization:null,type:"k8s",name:"",config:null,content:{credit:"",autoUpstream:!1,autoApplication:!1,isGateway:!1,gatewayPath:"",gatewayPort:0},address:""},json:'{ "":"" }',config:"",loading:!0}},computed:{...(0,m.rn)("rules",["rules"]),getCluster(){let t=null;return this.configJson&&this.configJson.clusters&&(t=this.configJson["current-context"]?this.configJson.clusters.find((t=>t.name==this.configJson["current-context"])).cluster:this.configJson.clusters[0].cluster),t}},created(){""!=this.pid?this.loaddata():(this.detail={organization:null,type:"k8s",name:"",config:null,yamlConfig:"",content:{credit:"",autoUpstream:!1,autoApplication:!1,isGateway:!1,gatewayPath:"",gatewayPort:0},address:""},this.loading=!1,this.$emit("getDetail",{detail:this.detail}))},methods:{clearConfig(){this.detail.config=null,this.configJson=null},getYaml(){this.detail.config=this.yamlConfig,this.configJson=S.load(this.yamlConfig)},convertToYaml(t){if(""==t)return"";let e=JSON.parse(t),a=null;return a=_.stringify(e),a},beforeUpload(t){return new Promise((()=>{const e=new FileReader;e.readAsDataURL(t),e.onload=()=>{if(e.result){let t=atob(e.result.split("base64,")[1]);this.detail.config=t,this.configJson=S.load(t),this.yamlConfig=this.convertToYaml(JSON.stringify(this.configJson))}}}))},valid(){return""!=this.detail.name||(this.$message.error(this.$t("The name cannot be empty"),3),!1)},saved(t){""!=this.pid?(this.$message.success(this.$t("Save successfully"),3),this.$closePage(this.$route)):(this.$message.success(this.$t("Created successfully"),3),this.$router.push({path:"/ops-center/registry/detail/"+t}),this.$closePage(this.$route))},pingValidate(){this.$refs.layout.$refs.form.validateFields().then((()=>{this.ping()})).catch((()=>{}))},validate(){this.$refs.layout.$refs.form.validateFields().then((()=>{this.save()})).catch((()=>{}))},ping(){if(!this.valid())return;let t=c().cloneDeep(this.detail);delete t.services,delete t.L4LBs,delete t.id,delete t.namespaces,delete t.L7Lbs,delete t.yamlConfig,this.connectLoading=!0,this.$gql.mutation("pingRegistry(data: $data)",{data:t},{data:"RegistryInput"}).then((t=>{this.connectLoading=!1,t.isOK?this.$message.success(this.$t("Connect successfully"),3):this.$message.error(t.error,3)}))},save(){if(!this.valid())return;let t=c().cloneDeep(this.detail);delete t.services,delete t.L4LBs,delete t.namespaces,delete t.L7Lbs,delete t.yamlConfig,""!=this.pid?(delete t.id,this.$gql.mutation(`updateRegistry(id:${this.pid}, data: $data){data{id}}`,{data:t},{data:"RegistryInput!"}).then((()=>{this.saved()}))):this.$gql.mutation("createRegistry(data: $data){data{id}}",{data:t},{data:"RegistryInput!"}).then((t=>{this.saved(t.data.id)}))},handleChange(){},hide(){this.visible=!1,this.save()},loaddata(){this.loading=!0,this.$gql.query(`registry(id: ${this.pid}){data{id,attributes{\n\t\t\t\t\t\tname,\n\t\t\t\t\t\ttype,\n\t\t\t\t\t\taddress,\n\t\t\t\t\t\tconfig,\n\t\t\t\t\t\tcontent,\n\t\t\t\t\t\tnamespaces(pagination: {limit: 9999 }){data{id,attributes{\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\torganization{data{id,attributes{name}}},\n\t\t\t\t\t\t\tservices(pagination: {limit: 9999 }){data{id,attributes{\n\t\t\t\t\t\t\t\tuid,\n\t\t\t\t\t\t\t\tgatewayPath,\n\t\t\t\t\t\t\t\tdeleted,\n\t\t\t\t\t\t\t\tfleet{data{id,attributes{name}}},\n\t\t\t\t\t\t\t\torganization{data{id,attributes{name}}},\n\t\t\t\t\t\t\t\tnamespace,\n\t\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\t\tregistry{data{id,attributes{name}}},\n\t\t\t\t\t\t\t\tcontent,\n\t\t\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t\t\t}}}\n\t\t\t\t\t\t}}}\n\t\t\t\t\t}}}`).then((t=>{if(this.detail=t.data,this.detail.content||(this.detail.content={}),this.detail.content.credit||(this.detail.content.credit=""),this.detail.config?(this.configJson=S.load(this.detail.config),this.yamlConfig=this.convertToYaml(JSON.stringify(this.configJson))):(this.configJson=null,this.yamlConfig=this.convertToYaml("{}")),null==this.detail.content.autoUpstream&&(this.detail.content.autoUpstream=!1),null==this.detail.content.autoApplication&&(this.detail.content.autoApplication=!1),this.detail.namespaces){let t=!1;this.detail.namespaces.forEach((e=>{e.organizationId=e.organization?e.organization.id:null,e.services.length>0&&(e.services.forEach((t=>{t.organization=t.organization?t.organization:{id:null},t.enabled=!t.deleted})),t||(t=!0,this.selectedKeys=e.id,this.selectedNS=e))}))}this.loading=!1,this.namespaces=t.data.namespaces,this.$emit("getDetail",{detail:this.detail,namespaces:this.namespaces,selectedNS:this.selectedNS,selectedKeys:this.selectedKeys})}))}}};var P=(0,a(83744).Z)(j,[["render",function(t,e,a,o,c,d){const u=(0,i.up)("a-input"),p=(0,i.up)("DetailListItem"),h=(0,i.up)("a-select-option"),g=(0,i.up)("a-select"),f=(0,i.up)("a-switch"),m=(0,i.up)("a-input-number"),y=((0,i.up)("a-checkbox"),(0,i.up)("DetailList")),w=(0,i.up)("a-col"),v=(0,i.up)("a-textarea"),k=(0,i.up)("YamlEditor"),b=(0,i.up)("SnippetsOutlined"),$=(0,i.up)("a-button"),C=(0,i.up)("a-popover"),S=(0,i.up)("UploadOutlined"),_=(0,i.up)("a-upload"),j=(0,i.up)("a-tag"),P=(0,i.up)("Status"),O=(0,i.up)("a-row"),L=(0,i.up)("PageLayout"),z=(0,i.Q2)("permission");return(0,i.wg)(),(0,i.j4)(L,{title:c.detail.name?c.detail.name:t.$t("Registry"),"form-state":c.detail,ref:"layout"},{headerContent:(0,i.w5)((()=>[(0,i.Wm)(O,null,{default:(0,i.w5)((()=>[(0,i.Wm)(w,{xl:12,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((()=>[(0,i.Wm)(y,{size:"small",col:1},{default:(0,i.w5)((()=>[(0,i.Wm)(p,{term:t.$t("as"),rules:t.rules.uniqueName("registries",{id:a.pid}),name:"name"},{default:(0,i.w5)((()=>[(0,i.Wm)(u,{placeholder:t.$t("unset"),value:c.detail.name,"onUpdate:value":e[0]||(e[0]=t=>c.detail.name=t),class:"width-200"},null,8,["placeholder","value"])])),_:1},8,["term","rules"]),""==a.pid?((0,i.wg)(),(0,i.j4)(p,{key:0,term:t.$t("Type"),rules:t.rules.required,name:"type"},{default:(0,i.w5)((()=>[(0,i.Wm)(g,{placeholder:t.$t("unallocated"),class:"width-200",value:c.detail.type,"onUpdate:value":e[1]||(e[1]=t=>c.detail.type=t),onChange:e[2]||(e[2]=t=>d.handleChange())},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(a.types,((t,e)=>((0,i.wg)(),(0,i.j4)(h,{key:e,value:t.name},{default:(0,i.w5)((()=>[t.name?((0,i.wg)(),(0,i.iD)("span",l,(0,n.zw)(t.name),1)):(0,i.kq)("",!0),t.name?(0,i.kq)("",!0):((0,i.wg)(),(0,i.iD)("i",s,(0,n.zw)(t.name),1))])),_:2},1032,["value"])))),128))])),_:1},8,["placeholder","value"])])),_:1},8,["term","rules"])):((0,i.wg)(),(0,i.j4)(p,{key:1,term:t.$t("Type")},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(c.detail.type),1)])),_:1},8,["term"])),t.$isPro?((0,i.wg)(),(0,i.j4)(p,{key:2,term:t.$t("Is Gateway")},{default:(0,i.w5)((()=>[(0,i.Wm)(f,{checked:c.detail.content.isGateway,"onUpdate:checked":e[3]||(e[3]=t=>c.detail.content.isGateway=t)},null,8,["checked"])])),_:1},8,["term"])):(0,i.kq)("",!0),c.detail.content.isGateway&&t.$isPro?((0,i.wg)(),(0,i.j4)(p,{key:3,rules:t.rules.required,name:["content","gatewayPath"],term:t.$t("Gateway Path")},{default:(0,i.w5)((()=>[(0,i.Wm)(u,{placeholder:t.$t("unset"),value:c.detail.content.gatewayPath,"onUpdate:value":e[4]||(e[4]=t=>c.detail.content.gatewayPath=t),class:"width-300"},null,8,["placeholder","value"])])),_:1},8,["rules","term"])):(0,i.kq)("",!0),c.detail.content.isGateway&&t.$isPro?((0,i.wg)(),(0,i.j4)(p,{key:4,term:t.$t("Gateway Port")},{default:(0,i.w5)((()=>[(0,i.Wm)(m,{placeholder:t.$t("unset"),min:0,value:c.detail.content.gatewayPort,"onUpdate:value":e[5]||(e[5]=t=>c.detail.content.gatewayPort=t),class:"width-300"},null,8,["placeholder","value"])])),_:1},8,["term"])):(0,i.kq)("",!0),(t.$isPro,(0,i.kq)("",!0))])),_:1})])),_:1}),(0,i.Wm)(w,{xl:12,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((()=>[(0,i.Wm)(y,{size:"small",col:1},{default:(0,i.w5)((()=>["k8s"!=c.detail.type?((0,i.wg)(),(0,i.j4)(p,{key:0,rules:t.rules.required,name:"address",term:t.$t("Location")},{default:(0,i.w5)((()=>[(0,i.Wm)(v,{value:c.detail.address,"onUpdate:value":e[8]||(e[8]=t=>c.detail.address=t),placeholder:t.$t("protocol://hostname:port"),"allow-clear":""},null,8,["value","placeholder"])])),_:1},8,["rules","term"])):(0,i.kq)("",!0),"k8s"==c.detail.type?((0,i.wg)(),(0,i.j4)(p,{key:1,term:"k8s"==c.detail.type?"K8S Config":t.$t("Config"),rules:t.rules.required,name:["config"]},{default:(0,i.w5)((()=>[(0,i.Wm)(C,{trigger:"click","destroy-tooltip-on-hide":!0,title:"K8S Config"},{content:(0,i.w5)((()=>[(0,i.Wm)(k,{onFetch:d.getYaml,class:"width-500",value:c.yamlConfig,"onUpdate:value":e[9]||(e[9]=t=>c.yamlConfig=t)},null,8,["onFetch","value"])])),default:(0,i.w5)((()=>[(0,i.Wm)($,{class:"mr-10"},{default:(0,i.w5)((()=>[(0,i.Wm)(b),(0,i.Uk)(" "+(0,n.zw)(t.$t("Paste")),1)])),_:1})])),_:1}),(0,i.Wm)(_,{"file-list":c.fileList,"onUpdate:file-list":e[10]||(e[10]=t=>c.fileList=t),"before-upload":d.beforeUpload},{default:(0,i.w5)((()=>[(0,i.Wm)($,null,{default:(0,i.w5)((()=>[(0,i.Wm)(S),(0,i.Uk)(" "+(0,n.zw)(t.$t("Upload")),1)])),_:1})])),_:1},8,["file-list","before-upload"]),c.configJson&&d.getCluster?((0,i.wg)(),(0,i.iD)("div",r,[(0,i._)("div",null,[(0,i.Wm)(j,{closable:"",onClose:d.clearConfig},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(d.getCluster.server)+" ("+(0,n.zw)(c.configJson.apiVersion)+") ",1)])),_:1},8,["onClose"])]),c.configJson&&"Config"==c.configJson.kind?((0,i.wg)(),(0,i.j4)(P,{key:0,class:"inline-block",d:{status:"success"}})):c.configJson?((0,i.wg)(),(0,i.j4)(P,{key:1,class:"inline-block",d:{status:"failed"}})):(0,i.kq)("",!0)])):(0,i.kq)("",!0)])),_:1},8,["term","rules"])):(0,i.kq)("",!0),"k8s"!=c.detail.type?((0,i.wg)(),(0,i.j4)(p,{key:2,term:t.$t("Credit")},{default:(0,i.w5)((()=>[(0,i.Wm)(v,{class:"height-90",value:c.detail.content.credit,"onUpdate:value":e[11]||(e[11]=t=>c.detail.content.credit=t),placeholder:t.$t("Please input user:passwor or token"),"allow-clear":""},null,8,["value","placeholder"])])),_:1},8,["term"])):(0,i.kq)("",!0),(0,i.kq)("",!0)])),_:1})])),_:1})])),_:1})])),action:(0,i.w5)((()=>[(0,i.Wm)($,{class:"mr-10",type:"primary",onClick:d.pingValidate,loading:c.connectLoading},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(t.$t("Connect Registry")),1)])),_:1},8,["onClick","loading"]),""!=a.pid?(0,i.wy)(((0,i.wg)(),(0,i.j4)($,{key:0,type:"primary",onClick:d.validate},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(t.$t("save")),1)])),_:1},8,["onClick"])),[[z,["registry:update"]]]):(0,i.wy)(((0,i.wg)(),(0,i.j4)($,{key:1,type:"primary",onClick:d.validate},{default:(0,i.w5)((()=>[(0,i.Uk)((0,n.zw)(t.$t("create")),1)])),_:1},8,["onClick"])),[[z,["registry:create"]]])])),default:(0,i.w5)((()=>[(0,i.Wm)(O,null,{default:(0,i.w5)((()=>[(0,i.Wm)(w,{xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((()=>[(0,i.WI)(t.$slots,"tabs")])),_:3})])),_:3})])),_:3},8,["title","form-state"])}]])}}]);