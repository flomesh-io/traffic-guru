"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[6908],{60300:function(e,t,a){a.d(t,{Z:function(){return d}});var i=a(66252),s={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM304 240a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0z"}}]},name:"database",theme:"outlined"},n=a(33058);function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?Object(arguments[t]):{},i=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(a).filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable})))),i.forEach((function(t){r(e,t,a[t])}))}return e}function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var o=function(e,t){var a=l({},e,t.attrs);return(0,i.Wm)(n.Z,l({},a,{icon:s}),null)};o.displayName="DatabaseOutlined",o.inheritAttrs=!1;var d=o},34531:function(e,t,a){a.d(t,{Z:function(){return g}});var i=a(66252),s=a(3577);const n={key:0,class:"flex pd-10"},l={key:0,class:"flex-item"},r={class:"flex-item"},o={class:"pl-10"},d=["xlink:href"],c={class:"card-selector-title"};var u=a(85263),p=a(75255),h=a(60459),m={name:"CardSelector",components:{CheckOutlined:p.Z,EnvSelector:h.Z},props:["loading","envFilter","search","options","icon","placement","disabled","value","getTag","svg","col","width","multiple"],emits:["envChange","select"],data(){return{simpleImage:u.Z.PRESENTED_IMAGE_SIMPLE,visible:!1,key:""}},i18n:a(89234),computed:{multipleSelectNum(){let e=0;return this.options.forEach((t=>{t.checked&&e++})),e},filterOptions(){if(this.key){let e=this.options.filter((e=>(e.name||e.username||"").indexOf(this.key)>=0));return e.map((e=>{null==e.checked&&(e.checked=!1)})),e}{let e=this.options;return e.map((e=>{null==e.checked&&(e.checked=!1)})),e}}},watch:{value:{handler(){this.multiple&&this.options.forEach((e=>{e.checked=!!this.value.find((t=>e.id==t.id))}))},deep:!0}},methods:{envChange(e){this.$emit("envChange",e)},multipleSelect(){this.visible=!1;let e=this.options.filter((e=>e.checked));this.$emit("select",e),this.$emit("update:value",e)},select(e){this.multiple?this.options.forEach((t=>{t.id==e.id&&(t.checked=!t.checked)})):(this.visible=!1,this.$emit("update:value",e.id),this.$emit("select",e))}}};var g=(0,a(83744).Z)(m,[["render",function(e,t,a,u,p,h){const m=(0,i.up)("EnvSelector"),g=(0,i.up)("a-input-search"),v=(0,i.up)("a-button"),f=(0,i.up)("a-empty"),y=(0,i.up)("a-skeleton"),k=(0,i.up)("a-card-grid"),w=(0,i.up)("a-card"),b=(0,i.up)("CheckOutlined"),C=(0,i.up)("a-tag"),$=(0,i.up)("a-popover");return(0,i.wg)(),(0,i.j4)($,{placement:a.placement||"bottom","overlay-class-name":"selector-popover",visible:p.visible,"onUpdate:visible":t[1]||(t[1]=e=>p.visible=e),trigger:"click"},{content:(0,i.w5)((()=>[a.search?((0,i.wg)(),(0,i.iD)("div",n,[a.envFilter?((0,i.wg)(),(0,i.iD)("div",l,[(0,i.Wm)(m,{"no-all":!0,"is-filter":!0,onEnvChange:h.envChange},null,8,["onEnvChange"])])):(0,i.kq)("",!0),(0,i._)("div",r,[(0,i.Wm)(g,{value:p.key,"onUpdate:value":t[0]||(t[0]=e=>p.key=e),class:"full",placeholder:e.$t("search")},null,8,["value","placeholder"])]),(0,i._)("div",o,[a.multiple?((0,i.wg)(),(0,i.j4)(v,{key:0,type:"primary",onClick:h.multipleSelect,disabled:0==h.multipleSelectNum},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.$t("Ok")),1)])),_:1},8,["onClick","disabled"])):(0,i.kq)("",!0)])])):(0,i.kq)("",!0),a.loading||0!=h.filterOptions.length?(0,i.kq)("",!0):((0,i.wg)(),(0,i.j4)(f,{key:1,image:p.simpleImage},null,8,["image"])),(0,i._)("div",{class:"overflow-auto scrollbar",style:(0,s.j5)("max-height:"+90*(e.rows||5)+"px")},[a.loading?((0,i.wg)(),(0,i.j4)(w,{key:0,class:"grid-menu",style:(0,s.j5)("width: "+(a.width?a.width:300)+"px")},{default:(0,i.w5)((()=>[(0,i.Wm)(k,{class:"selector-item",style:{width:"100%",padding:"15px"}},{default:(0,i.w5)((()=>[(0,i.Wm)(y,{avatar:"",paragraph:{rows:2}})])),_:1})])),_:1},8,["style"])):((0,i.wg)(),(0,i.j4)(w,{key:1,class:"grid-menu",style:(0,s.j5)("width: "+(a.width?a.width:300)+"px")},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(h.filterOptions,((e,t)=>((0,i.wg)(),(0,i.j4)(k,{class:(0,s.C_)(["selector-item",(a.value==e.id?"selected":"")+(a.disabled&&a.disabled(e)?" disabled":"")]),key:t,value:e.id,style:(0,s.j5)(a.col?"width:"+100/a.col+"%":a.options.length>=3?"width: 33%;":2==a.options.length?"width:50%;":"width:100%;"),onClick:t=>h.select(e)},{default:(0,i.w5)((()=>[e.checked?((0,i.wg)(),(0,i.j4)(b,{key:0,class:"CheckOutlined"})):(0,i.kq)("",!0),(0,i._)("div",{class:(0,s.C_)(a.getTag?"mt-15":"")},[a.icon?((0,i.wg)(),(0,i.j4)((0,i.LL)(a.icon),{key:0,"two-tone-color":"#00adef"})):a.svg?((0,i.wg)(),(0,i.iD)("svg",{key:1,class:(0,s.C_)([a.getTag?"mt-20":"","card-avatar icon"]),"aria-hidden":"true"},[(0,i._)("use",{"xlink:href":a.svg},null,8,d)],2)):(0,i.kq)("",!0),(0,i._)("div",c,(0,s.zw)(e.name||e.username),1)],2),a.getTag&&a.getTag(e)?((0,i.wg)(),(0,i.j4)(C,{key:1,class:"ribbon",color:"#f5f5f5"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(a.getTag(e)),1)])),_:2},1024)):(0,i.kq)("",!0)])),_:2},1032,["class","value","style","onClick"])))),128))])),_:1},8,["style"]))],4)])),default:(0,i.w5)((()=>[(0,i.WI)(e.$slots,"default",{},void 0,!0)])),_:3},8,["placement","visible"])}],["__scopeId","data-v-30bb0bbf"]])},9294:function(e,t,a){a.d(t,{Z:function(){return l}});var i=a(66252);var s=a(29764);(0,a(25552).H)({id:"javascript",extensions:[".js",".es6",".jsx",".mjs"],firstLine:"^#!.*\\bnode",filenames:["jakefile"],aliases:["JavaScript","javascript","js"],mimetypes:["text/javascript"],loader:function(){return a.e(6015).then(a.bind(a,6015))}});var n={name:"JsEditor",components:{monacoeditor:s.Z},props:["value","height","isReadonly","id","theme"],data(){return{code:"",cmOptions:{lineNumbers:!0,mode:"javascript",readOnly:!1,lint:!0}}},watch:{value(e,t){e!==t&&this.setValue()}},mounted(){this.setValue()},methods:{change(e){"string"==typeof e&&(this.$emit("update:value",e),this.$emit("change",e))},setValue(){null!=this.value.replace&&(this.code=this.value)}}};var l=(0,a(83744).Z)(n,[["render",function(e,t,a,s,n,l){const r=(0,i.up)("monacoeditor");return(0,i.wg)(),(0,i.iD)("div",null,[(0,i.Wm)(r,{id:a.id||"JsEditor",content:n.code,"onUpdate:content":t[0]||(t[0]=e=>n.code=e),option:n.cmOptions,onChange:l.change,height:a.height,theme:a.theme,"is-readonly":a.isReadonly},null,8,["id","content","option","onChange","height","theme","is-readonly"])])}]])},1299:function(e,t,a){a.d(t,{Z:function(){return r}});var i=a(66252),s=a(3577);const n={key:0,class:"title"};var l={name:"DetailList",props:{title:{type:String,required:!1,default:""},col:{type:Number,required:!1,default:3},size:{type:String,required:!1,default:"large"},layout:{type:String,required:!1,default:"horizontal"}}};var r=(0,a(83744).Z)(l,[["render",function(e,t,a,l,r,o){const d=(0,i.up)("a-row");return(0,i.wg)(),(0,i.iD)("div",{class:(0,s.C_)(["detail-list","small"===a.size?"small":"large","vertical"===a.layout?"vertical":"horizontal"]),style:(0,s.j5)("flex-"+a.col)},[a.title?((0,i.wg)(),(0,i.iD)("div",n,(0,s.zw)(a.title),1)):(0,i.kq)("",!0),(0,i.Wm)(d,null,{default:(0,i.w5)((()=>[(0,i.WI)(e.$slots,"default")])),_:3})],6)}]])},13589:function(e,t,a){a.d(t,{Z:function(){return o}});var i=a(66252),s=a(3577);const n={class:"detail-content"};const l={1:{xs:24},2:{xs:24,sm:12},3:{xs:24,sm:12,md:8},4:{xs:24,sm:12,md:6}};var r={name:"DetailListItem",i18n:a(39945),props:{name:{type:String,required:!1,default:""},rules:{type:Array,required:!1,default(){return[]}},term:{type:String,required:!1,default:""},termTop:{type:Boolean}},data(){return{col:2,responsive:l}},computed:{getRules(){return this.rules.map((e=>(e.message=this.$t(e.message),e))),this.rules}},created(){this.$parent&&this.$parent.$parent&&this.$parent.$parent.col>0&&(this.col=this.$parent.$parent.col)},methods:{}};var o=(0,a(83744).Z)(r,[["render",function(e,t,a,l,r,o){const d=(0,i.up)("a-form-item"),c=(0,i.up)("a-col");return(0,i.wg)(),(0,i.j4)(c,(0,i.dG)({class:"detail-list-content flex"},r.responsive[r.col]),{default:(0,i.w5)((()=>[(0,i._)("div",{class:(0,s.C_)(a.termTop?"term top":"term")},(0,s.zw)(a.term),3),(0,i._)("div",n,[a.rules?((0,i.wg)(),(0,i.j4)(d,{key:0,name:a.name,rules:o.getRules},{default:(0,i.w5)((()=>[(0,i.WI)(e.$slots,"default")])),_:3},8,["name","rules"])):(0,i.WI)(e.$slots,"default",{key:1})])])),_:3},16)}]])},46908:function(e,t,a){a.r(t),a.d(t,{default:function(){return ee}});var i=a(66252),s=a(3577),n=a(49963);const l={key:0},r={class:"font-primary",href:"javascript:void(0)"},o={key:1},d={class:"font-primary",href:"javascript:void(0)"},c={key:2},u=["onClick"],p={key:0},h={class:"font-s gray mt-10"},m={key:1},g={key:2},v={key:1},f={key:1},y={key:0},k={key:0,class:"full"},w={class:"pointer relative",style:{top:"-2px"}},b={key:0},C={key:1},$={key:1},_={key:1},j={key:6,class:"editable-row-operations"},I={key:0},x=["onClick"],D={key:1},S=["onClick"],P=["onClick"];a(57658);var z=a(79332),E=a(9294),q=a(21936),T=a(61103),W=a(1299),O=a(33907),U=a(13589),V=a(60459),Z=a(34531),B=a(96486),L=a.n(B),N=a(44218),A=a(99684),H=a(46981),R=a(54367),M=a(60300),F=a(75255);const K=[{key:"Host",dataIndex:"host"},{key:"Ports(Name/Port/Protocol)",dataIndex:"ports"},{key:"node",dataIndex:"nodeName"},{key:"Ready",dataIndex:"ready"},{key:"Action",dataIndex:"action"}],Y=[{key:"Path Type",dataIndex:"pathType"},{key:"Path",dataIndex:"path"},{key:"Host",dataIndex:"host"},{key:"Service",dataIndex:"serviceName"},{key:"Service Port",dataIndex:"servicePort"},{key:"Action",dataIndex:"action"}],J=[{key:"Service",dataIndex:"serviceName"},{key:"Service Port",dataIndex:"servicePort"},{key:"Action",dataIndex:"action"}],G=[{key:"Host",dataIndex:"host"},{key:"TLS Secret",dataIndex:"secret"},{key:"Action",dataIndex:"action"}],Q={apiVersion:"networking.k8s.io/v1",kind:"Ingress",spec:{ingressClassName:"pipy"}};var X={name:"IngressDetail",i18n:a(89234),components:{JsEditor:E.Z,JsonEditor:q.Z,DetailListItem:U.Z,DetailList:W.Z,PageLayout:T.Z,PlusOutlined:N.Z,PlusCircleTwoTone:A.Z,EditOutlined:H.Z,CloseOutlined:R.Z,FormItem:z.Z,EnvSelector:V.Z,DatabaseOutlined:M.Z,CardSelector:Z.Z,CheckOutlined:F.Z},data(){return{certificates:[],labelVisible:!1,labelValue:"",annotationVisible:!1,creationTimestamp:"-",annotationValue:"",pathTypes:["Prefix","Exact","Mixed"],detail:{name:"",namespace:null,tls:[],rules:[],defaultBackend:[],content:{metadata:{name:"",namespace:"",labels:{},annotations:{}}}},selectorLoading:!0,services:[],loading:!0,pid:"",pjsConfig:"",namespace:"",registry:"",isMounted:!1,metrics:[],columns:K,rulecolumns:Y,secretrulecolumns:G,defaultBackendcolumns:J}},computed:{...(0,O.rn)({rules:e=>e.rules.rules,isMobile:e=>e.setting.isMobile}),dataColumns(){return this.columns.map((e=>(e.title=this.$t(e.key),e)))},ruledataColumns(){return this.rulecolumns.map((e=>(e.title=this.$t(e.key),e)))},defaultColumns(){return this.defaultBackendcolumns.map((e=>(e.title=this.$t(e.key),e)))},secretColumns(){return this.secretrulecolumns.map((e=>(e.title=this.$t(e.key),e)))}},created(){this.pid=this.$route.params.id||"",this.namespace=this.$route.params.namespace||localStorage.getItem("NAMESPACE"),this.registry=this.$route.params.registry||localStorage.getItem("SCHEMA_ID"),this.getDefaultPjsConfig()},mounted(){this.isMounted=!0,""!=this.pid?this.search():(this.detail={namespace:null,name:"",rules:[],tls:[],defaultBackend:[],content:{metadata:{name:"",namespace:"",labels:{},annotations:{}}}},this.loading=!1)},methods:{build(e){let t=null;"create"==e?t=L().cloneDeep(Q):(t=L().cloneDeep(this.detail.content),delete t.tls,delete t.rules),this.detail.tls.length>0&&(t.spec.tls=[]),this.detail.tls.forEach((e=>{let a={secretName:e.secret};e.host&&(a.hosts=e.host.split("\n")),t.spec.tls.push(a)})),this.detail.rules.length>0&&(t.spec.rules=[]),this.detail.rules.forEach((e=>{let a=-1;t.spec.rules.forEach(((t,i)=>{t.host!=e.host&&(t.host||e.host)||(a=i)}));let i={path:e.path,pathType:e.pathType,backend:{service:{name:e.service.name}}};e.servicePort&&(i.backend.service.port={number:e.servicePort}),-1==a&&(e.host?t.spec.rules.push({host:e.host,http:{paths:[]}}):t.spec.rules.push({http:{paths:[]}}),a=t.spec.rules.length-1),t.spec.rules[a].http.paths.push(i)})),this.detail.defaultBackend.forEach((e=>{t.spec.defaultBackend={service:{name:""}},t.spec.defaultBackend.service.name=e.service.name,e.servicePort&&(t.spec.defaultBackend.service.port={number:e.servicePort})})),t.metadata=this.detail.content.metadata,t.metadata.name=this.detail.name,t.metadata.namespace=this.detail.namespace.name,this.detail.content=t},reset(){const e=this.detail.content;this.detail.defaultBackend=[],e.spec.defaultBackend&&this.detail.defaultBackend.push({isedit:!1,service:{name:e.spec.defaultBackend.service.name},servicePort:e.spec.defaultBackend.service.port?.number||""}),this.detail.rules=[],e.spec.rules.forEach((e=>{e.http.paths.forEach((t=>{this.detail.rules.push({isedit:!1,host:e.host,service:{name:t.backend.service.name},servicePort:t.backend.service.port?.number||"",path:t.path,pathType:t.pathType})}))})),this.detail.tls=[],(e.spec.tls||[]).forEach((e=>{this.detail.tls.push({isedit:!1,secret:e.secretName,host:e.hosts?e.hosts.join("\n"):""})}))},handleClose(e,t){delete e[t]},labelShowInput(){this.labelVisible=!0,this.$nextTick().then((()=>{this.$refs.labelRef.focus()}))},labelInputConfirm(){if(""==this.labelValue)return void(this.labelVisible=!1);let e=this.labelValue.split(":");e.length<2?this.$message.error({content:this.$t("Please enter the format of [key]:[value]")}):(this.detail.content.metadata.labels=this.detail.content.metadata.labels||{},this.detail.content.metadata.labels[e.shift()]=e.join(":"),this.labelValue="",this.labelVisible=!1)},annotationShowInput(){this.annotationVisible=!0,this.$nextTick().then((()=>{this.$refs.annotationRef.focus()}))},annotationInputConfirm(){if(""==this.annotationValue)return void(this.annotationVisible=!1);let e=this.annotationValue.split(":");e.length<2?this.$message.error({content:this.$t("Please enter the format of [key]:[value]")}):(this.detail.content.metadata.annotations=this.detail.content.metadata.annotations||{},this.detail.content.metadata.annotations[e.shift()]=e.join(":"),this.annotationValue="",this.annotationVisible=!1)},addEndpoints(){this.detail.endpoints=this.detail.endpoints||[],this.detail.endpoints.push({isedit:!0,host:"",port_val:"",nodeName:"",ready:""})},addRule(e){0==e?(this.detail.rules=this.detail.rules||[],this.detail.rules.push({isedit:!0,host:"",service:null,serviceName:"",servicePort:"",path:"",pathType:"Prefix"})):1==e?(this.detail.defaultBackend=this.detail.defaultBackend||[],this.detail.defaultBackend.push({isedit:!0,service:null,serviceName:"",servicePort:""})):2==e&&(this.detail.tls=this.detail.tls||[],this.detail.tls.push({isedit:!0,secret:null,host:""}))},remove(e,t){0==e?this.detail.rules.splice(t,1):1==e?this.detail.defaultBackend.splice(t,1):2==e&&this.detail.tls.splice(t,1)},cancel(e){e.isedit=!1},edit(e){e.isedit=!0},excute(){this.$message.loading({content:this.$t("Running..."),key:"excute"}),setTimeout((()=>{this.$message.success({content:this.$t("Publish success!"),key:"excute",duration:2})}),1e3)},pjsChange(e){this.pjsConfig=e},getDefaultPjsConfig(){fetch("pipy-4lb.js").then((e=>e.text())).then((e=>{this.pjsConfig=e})).catch((e=>{}))},onTabChange(e){},getServices(){this.selectorLoading=!0;const e={namespace:{eq:this.detail.namespace.name},registry:{id:{eq:this.detail.namespace.registry.id}}};this.$gql.query(`services(filters: $filters, pagination: {start: 0, limit: ${this.$DFT_LIMIT}} ){\n\t\t\t\t\t\tdata{id,attributes{\n\t\t\t\t\t\t\tuid,\n\t\t\t\t\t\t\tnamespace,\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\tregistry{data{id,attributes{name}}},\n\t\t\t\t\t\t\tcontent,\n\t\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t\t}},\n\t\t\t\t\t\tmeta{pagination{total}}\n\t\t\t\t\t}`,{filters:e},{filters:"ServiceFiltersInput",pagination:"PaginationArg"}).then((e=>{this.selectorLoading=!1,this.services=e.data,this.services.forEach((e=>{e.name=e.name?e.name:e.metadata.name,e.registry?e.clusterName=e.registry.name:e.fleet?e.clusterName=e.fleet.name:e.clusterName="-"}))}))},saveService(e,t){e.service=t},search(){this.loading=!0,this.$gql.query(`getIngress(id: ${this.pid}){data{id,attributes{\n\t\t\t\t\t\tcontent,\n\t\t\t\t\t\tnamespace{data{id,attributes{\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\tregistry{data{id,attributes{name}}}\n\t\t\t\t\t\t}}},\n\t\t\t\t\t\tname,\n\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t}}}`).then((e=>{this.loading=!1,this.creationTimestamp=new Date(e.data.createdAt).toLocaleString(),this.detail=e.data,this.reset(),this.envChange()}))},valid(){return""!=this.detail.name||(this.$message.error(this.$t("The name cannot be empty"),3),!1)},save(){if(!this.valid())return;this.build(""!=this.pid?"update":"create");let e=L().cloneDeep(this.detail.content);""!=this.pid?this.$gql.mutation(`updateIngressSync(id:${this.pid}, data: $data){data{id}}`,{data:{name:this.detail.name,namespace:this.detail.namespace.id,registry:this.registry,content:e}},{data:"IngressInput!"}).then((()=>{this.$message.success(this.$t("Save successfully"),3),this.$closePage(this.$route)})):this.$gql.mutation("createIngressSync(data: $data){data{id}}",{data:{name:this.detail.name,content:e,namespace:this.detail.namespace.id,registry:this.registry}},{data:"IngressInput!"}).then((e=>{this.pid=e.data.id,this.$message.success(this.$t("Created successfully"),3),this.$closePage(this.$route)}))},validate(){this.$refs.layout.$refs.form.validateFields().then((()=>{this.save()})).catch((()=>{}))},servicedetail(e){this.$router.push({path:"/fsm/service/detail/"+e})},envChange(){this.detail.namespace?.id&&this.getCertificates(),this.detail.namespace?.registry?.id&&this.getServices()},getCertificates(){this.$gql.query(`certificates(filters: $filters, pagination: { start: 0, limit: ${this.$DFT_LIMIT}}){data{id,attributes{\n\t\t\t\t\t\tname,\n\t\t\t\t\t\ttype,\n\t\t\t\t\t\tnamespace{data{id,attributes{\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\tregistry{data{id,attributes{name}}}\n\t\t\t\t\t\t}}},\n\t\t\t\t\t\tcontent\n\t\t\t\t\t}}}`,{filters:{type:{eq:"k8s"},namespace:{id:{eq:this.detail.namespace.id}}}},{filters:"CertificateFiltersInput",pagination:"PaginationArg"}).then((e=>{this.certificates=e.data,this.certificates.forEach((e=>{e.id=e.name})),this.certificates=[{id:null,name:this.$t("unset")},...this.certificates]}))}}};var ee=(0,a(83744).Z)(X,[["render",function(e,t,a,z,E,q){const T=(0,i.up)("DetailListItem"),W=(0,i.up)("a-input"),O=(0,i.up)("EnvSelector"),U=(0,i.up)("DetailList"),V=(0,i.up)("a-tag"),Z=(0,i.up)("PlusOutlined"),B=(0,i.up)("a-tooltip"),L=(0,i.up)("JsonEditor"),N=(0,i.up)("a-popover"),A=(0,i.up)("a-button"),H=(0,i.up)("PlusCircleTwoTone"),R=(0,i.up)("a-textarea"),M=(0,i.up)("FormItem"),F=(0,i.up)("a-select-option"),K=(0,i.up)("a-select"),Y=(0,i.up)("CloseOutlined"),J=(0,i.up)("DatabaseOutlined"),G=(0,i.up)("CardSelector"),Q=(0,i.up)("a-input-number"),X=(0,i.up)("CheckOutlined"),ee=(0,i.up)("EditOutlined"),te=(0,i.up)("a-table"),ae=(0,i.up)("a-card"),ie=(0,i.up)("a-col"),se=(0,i.up)("a-row"),ne=(0,i.up)("a-tab-pane"),le=((0,i.up)("JsEditor"),(0,i.up)("a-tabs")),re=(0,i.up)("PageLayout"),oe=(0,i.Q2)("permission");return(0,i.wg)(),(0,i.j4)(re,{title:e.$t("Ingress"),"form-state":E.detail,ref:"layout"},{headerContent:(0,i.w5)((()=>[(0,i.Wm)(U,{size:"small",col:1,style:{width:"60%"}},{default:(0,i.w5)((()=>[""!=E.pid?((0,i.wg)(),(0,i.j4)(T,{key:0,term:e.$t("UID")},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(E.detail.content.metadata?.uid),1)])),_:1},8,["term"])):(0,i.kq)("",!0),(0,i.Wm)(T,{term:e.$t("as"),rules:e.rules.uniqueName("ingresses",{id:E.pid,namespace:E.detail.namespace?.id}),name:"name"},{default:(0,i.w5)((()=>[(0,i.Wm)(W,{placeholder:e.$t("unset"),value:E.detail.name,"onUpdate:value":t[0]||(t[0]=e=>E.detail.name=e),class:"bold width-300"},null,8,["placeholder","value"])])),_:1},8,["term","rules"]),(0,i.Wm)(T,{term:e.$t("Namespace")},{default:(0,i.w5)((()=>[(0,i.Wm)(O,{"no-all":!0,namespace:E.detail.namespace,"onUpdate:namespace":t[1]||(t[1]=e=>E.detail.namespace=e),"is-filter":!0,onEnvChange:q.envChange},null,8,["namespace","onEnvChange"])])),_:1},8,["term"]),""!=E.pid?((0,i.wg)(),(0,i.j4)(T,{key:1,term:e.$t("Creation Timestamp")},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(E.creationTimestamp),1)])),_:1},8,["term"])):(0,i.kq)("",!0)])),_:1}),(0,i.Wm)(U,{size:"small",col:1},{default:(0,i.w5)((()=>[(0,i.Wm)(T,{term:e.$t("Labels")},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(Object.keys(E.detail.content.metadata.labels||[]),((e,t)=>((0,i.wg)(),(0,i.j4)(V,{key:t,onClose:t=>q.handleClose(E.detail.content.metadata.labels,e),closable:!0},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e)+":"+(0,s.zw)(E.detail.content.metadata.labels[e]),1)])),_:2},1032,["onClose"])))),128)),(0,i.wy)((0,i.Wm)(W,{ref:"labelRef",type:"text",size:"small",class:"width-100",placeholder:"[KEY:VALUE]",value:E.labelValue,"onUpdate:value":t[2]||(t[2]=e=>E.labelValue=e),onBlur:q.labelInputConfirm,onKeyup:(0,n.D2)(q.labelInputConfirm,["enter"])},null,8,["value","onBlur","onKeyup"]),[[n.F8,E.labelVisible]]),E.labelVisible?(0,i.kq)("",!0):(0,i.wy)(((0,i.wg)(),(0,i.j4)(V,{key:0,onClick:q.labelShowInput,class:"dashed-tag"},{default:(0,i.w5)((()=>[(0,i.Wm)(Z),(0,i.Uk)(" "+(0,s.zw)(e.$t("add")),1)])),_:1},8,["onClick"])),[[oe,["ingress:update"]]])])),_:1},8,["term"]),(0,i.Wm)(T,{term:e.$t("Annotations")},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(Object.keys(E.detail.content.metadata.annotations||[]),((e,t)=>((0,i.wg)(),(0,i.j4)(V,{key:t,onClose:t=>q.handleClose(E.detail.content.metadata.annotations,e),closable:!0,class:"mb-5"},{default:(0,i.w5)((()=>["objectset.rio.cattle.io/applied"==e?((0,i.wg)(),(0,i.iD)("span",l,[(0,i.Wm)(B,{placement:"topLeft",title:E.detail.content.metadata.annotations[e]},{default:(0,i.w5)((()=>[(0,i._)("a",r,(0,s.zw)(e),1)])),_:2},1032,["title"])])):"kubectl.kubernetes.io/last-applied-configuration"==e?((0,i.wg)(),(0,i.iD)("span",o,[(0,i.Wm)(N,{trigger:"click",title:e},{content:(0,i.w5)((()=>[(0,i.Wm)(L,{"is-json":!0,value:E.detail.content.metadata.annotations[e]},null,8,["value"])])),default:(0,i.w5)((()=>[(0,i._)("a",d,(0,s.zw)(e),1)])),_:2},1032,["title"])])):((0,i.wg)(),(0,i.iD)("span",c,(0,s.zw)(e)+":"+(0,s.zw)(E.detail.content.metadata.annotations[e]),1))])),_:2},1032,["onClose"])))),128)),(0,i.wy)((0,i.Wm)(W,{ref:"annotationRef",type:"text",size:"small",class:"width-100",placeholder:"[KEY:VALUE]",value:E.annotationValue,"onUpdate:value":t[3]||(t[3]=e=>E.annotationValue=e),onBlur:q.annotationInputConfirm,onKeyup:(0,n.D2)(q.annotationInputConfirm,["enter"])},null,8,["value","onBlur","onKeyup"]),[[n.F8,E.annotationVisible]]),E.annotationVisible?(0,i.kq)("",!0):(0,i.wy)(((0,i.wg)(),(0,i.j4)(V,{key:0,onClick:q.annotationShowInput,class:"dashed-tag"},{default:(0,i.w5)((()=>[(0,i.Wm)(Z),(0,i.Uk)(" "+(0,s.zw)(e.$t("add")),1)])),_:1},8,["onClick"])),[[oe,["ingress:update"]]])])),_:1},8,["term"])])),_:1})])),action:(0,i.w5)((()=>[""!=E.pid?(0,i.wy)(((0,i.wg)(),(0,i.j4)(A,{key:0,type:"primary",onClick:q.validate},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.$t("save")),1)])),_:1},8,["onClick"])),[[oe,["ingress:update"]]]):(0,i.wy)(((0,i.wg)(),(0,i.j4)(A,{key:1,type:"primary",onClick:q.validate},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.$t("create")),1)])),_:1},8,["onClick"])),[[oe,["ingress:create"]]])])),default:(0,i.w5)((()=>[(0,i.Wm)(le,{type:"card"},{default:(0,i.w5)((()=>[(0,i.Wm)(ne,{key:"1",tab:e.$t("Overview")},{default:(0,i.w5)((()=>[(0,i.Wm)(se,{class:"row-mg"},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)([{s:24,t:e.$t("Rules"),c:q.ruledataColumns,d:E.detail.rules},{s:12,t:e.$t("Default Backend"),c:q.defaultColumns,d:E.detail.defaultBackend},{s:12,t:e.$t("Secret"),c:q.secretColumns,d:E.detail.tls}],((a,l)=>((0,i.wg)(),(0,i.j4)(ie,{key:l,class:"col-pd",xl:a.s,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((()=>[(0,i.Wm)(ae,{class:"card mb-20 nopd",bordered:!1,loading:E.loading,title:a.t},{extra:(0,i.w5)((()=>[(0,i.wy)(((0,i.wg)(),(0,i.iD)("a",{onClick:e=>q.addRule(l),class:(0,s.C_)(E.detail.namespace?"":"disabed-element"),href:"javascript:void(0)"},[(0,i.Wm)(H,{class:"font-20"})],10,u)),[[oe,["ingress:update"]],[n.F8,1!=l||1==l&&0==a.d.length]])])),default:(0,i.w5)((()=>[(0,i.Wm)(te,{pagination:!1,columns:a.c,"data-source":a.d,loading:E.loading,class:"bg-white"},{bodyCell:(0,i.w5)((({column:a,record:n,index:r})=>["host"===a.dataIndex?((0,i.wg)(),(0,i.j4)(M,{key:0,name:["tls",r,"host"],cond:2==l,rules:e.rules.required},{default:(0,i.w5)((()=>[n.isedit&&2==l?((0,i.wg)(),(0,i.iD)("div",p,[(0,i.Wm)(R,{class:"edit-input",value:n.host,"onUpdate:value":e=>n.host=e,placeholder:e.$t("unset"),rows:2},null,8,["value","onUpdate:value","placeholder"]),(0,i._)("div",h,(0,s.zw)(e.$t("List of host")),1)])):n.isedit&&0==l?((0,i.wg)(),(0,i.iD)("div",m,[(0,i.Wm)(W,{value:n.host,"onUpdate:value":e=>n.host=e,class:"edit-input"},null,8,["value","onUpdate:value"])])):((0,i.wg)(),(0,i.iD)("div",g,(0,s.zw)(n.host||"-"),1))])),_:2},1032,["name","cond","rules"])):"path"===a.dataIndex?((0,i.wg)(),(0,i.j4)(M,{key:1,name:["rules",r,"path"],rules:e.rules.required},{default:(0,i.w5)((()=>[n.isedit?((0,i.wg)(),(0,i.j4)(W,{key:0,value:n.path,"onUpdate:value":e=>n.path=e,class:"edit-input"},null,8,["value","onUpdate:value"])):((0,i.wg)(),(0,i.iD)("div",v,(0,s.zw)(n.path||"-"),1))])),_:2},1032,["name","rules"])):"pathType"===a.dataIndex?((0,i.wg)(),(0,i.iD)(i.HY,{key:2},[n.isedit?((0,i.wg)(),(0,i.j4)(K,{key:0,class:"width-200",value:n.pathType,"onUpdate:value":e=>n.pathType=e},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(E.pathTypes,((e,t)=>((0,i.wg)(),(0,i.j4)(F,{value:e,key:t},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e),1)])),_:2},1032,["value"])))),128))])),_:2},1032,["value","onUpdate:value"])):((0,i.wg)(),(0,i.iD)("div",f,(0,s.zw)(n.pathType||"-"),1))],64)):"serviceName"===a.dataIndex?((0,i.wg)(),(0,i.j4)(M,{key:3,name:[["rules",r,"service"],["defaultBackend",r,"service"],null][l],rules:e.rules.objectRequired},{default:(0,i.w5)((()=>[n.isedit?((0,i.wg)(),(0,i.iD)("div",y,[n.service?((0,i.wg)(),(0,i.iD)("div",k,[e.detailType?(0,i.kq)("",!0):((0,i.wg)(),(0,i.j4)(Y,{key:0,onClick:()=>{n.service=null},class:"absolute icon-menu rotate-icon",style:{right:"10px",top:"-5px"}},null,8,["onClick"])),(0,i.Wm)(J,{class:"font-20 mr-10 primary"}),(0,i._)("a",w,[(0,i._)("b",null,(0,s.zw)(n.service.name),1)])])):(0,i.kq)("",!0),(0,i.Wm)(G,{loading:E.selectorLoading,width:400,col:2,"env-filter":!1,search:!0,placement:"right",icon:e.DatabaseOutlined,onSelect:e=>{q.saveService(n,e)},"get-tag":e=>e.clusterName+" / "+e.namespace,options:E.services},{default:(0,i.w5)((()=>[n.service?(0,i.kq)("",!0):((0,i.wg)(),(0,i.iD)("a",b,[(0,i.Wm)(V,{color:"#00adef",key:"submit",type:"primary"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.$t("Select k8s service")),1)])),_:1})]))])),_:2},1032,["loading","icon","onSelect","get-tag","options"])])):((0,i.wg)(),(0,i.iD)("div",C,[(0,i._)("a",{href:"javascript:void(0)",onClick:t[4]||(t[4]=t=>q.servicedetail(e.text))},(0,s.zw)(n.service?.name||"-"),1)]))])),_:2},1032,["name","rules"])):"servicePort"===a.dataIndex?((0,i.wg)(),(0,i.j4)(M,{key:4,name:[["rules",r,"servicePort"],["defaultBackend",r,"servicePort"],null][l],rules:e.rules.numberRequired},{default:(0,i.w5)((()=>[n.isedit?((0,i.wg)(),(0,i.j4)(Q,{key:0,value:n.servicePort,"onUpdate:value":e=>n.servicePort=e,class:"edit-input"},null,8,["value","onUpdate:value"])):((0,i.wg)(),(0,i.iD)("div",$,(0,s.zw)(n.servicePort||"-"),1))])),_:2},1032,["name","rules"])):"secret"===a.dataIndex?((0,i.wg)(),(0,i.iD)(i.HY,{key:5},[n.isedit?((0,i.wg)(),(0,i.j4)(K,{key:0,class:"width-100",value:n.secret,"onUpdate:value":e=>n.secret=e},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(E.certificates,((e,t)=>((0,i.wg)(),(0,i.j4)(F,{value:e.id,key:t},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.name),1)])),_:2},1032,["value"])))),128))])),_:2},1032,["value","onUpdate:value"])):((0,i.wg)(),(0,i.iD)("div",_,(0,s.zw)(n.secret||"-"),1))],64)):"action"===a.dataIndex?((0,i.wg)(),(0,i.iD)("div",j,[n.isedit?((0,i.wg)(),(0,i.iD)("span",I,[(0,i._)("a",{onClick:e=>q.cancel(n)},[(0,i.Wm)(X,{class:"icon-menu"})],8,x)])):((0,i.wg)(),(0,i.iD)("span",D,[(0,i.wy)(((0,i.wg)(),(0,i.iD)("a",{onClick:e=>q.edit(n)},[(0,i.Wm)(ee,{class:"icon-menu"})],8,S)),[[oe,["ingress:update"]]])])),(0,i.wy)(((0,i.wg)(),(0,i.iD)("a",{onClick:e=>q.remove(l,r)},[(0,i.Wm)(Y,{class:"icon-menu"})],8,P)),[[oe,["ingress:update"]]])])):(0,i.kq)("",!0)])),_:2},1032,["columns","data-source","loading"])])),_:2},1032,["loading","title"])])),_:2},1032,["xl"])))),128))])),_:1})])),_:1},8,["tab"]),(0,i.kq)("",!0),(0,i.kq)("",!0)])),_:1})])),_:1},8,["title","form-state"])}]])}}]);