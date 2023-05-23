"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[1772],{34531:function(e,t,a){a.d(t,{Z:function(){return g}});var n=a(66252),l=a(3577);const i={key:0,class:"flex pd-10"},s={key:0,class:"flex-item"},r={class:"flex-item"},o={class:"pl-10"},u=["xlink:href"],c={class:"card-selector-title"};var d=a(85263),p=a(75255),h=a(60459),m={name:"CardSelector",components:{CheckOutlined:p.Z,EnvSelector:h.Z},props:["loading","envFilter","search","options","icon","placement","disabled","value","getTag","svg","col","width","multiple"],emits:["envChange","select"],data(){return{simpleImage:d.Z.PRESENTED_IMAGE_SIMPLE,visible:!1,key:""}},i18n:a(89234),computed:{multipleSelectNum(){let e=0;return this.options.forEach((t=>{t.checked&&e++})),e},filterOptions(){if(this.key){let e=this.options.filter((e=>(e.name||e.username||"").indexOf(this.key)>=0));return e.map((e=>{null==e.checked&&(e.checked=!1)})),e}{let e=this.options;return e.map((e=>{null==e.checked&&(e.checked=!1)})),e}}},watch:{value:{handler(){this.multiple&&this.options.forEach((e=>{e.checked=!!this.value.find((t=>e.id==t.id))}))},deep:!0}},methods:{envChange(e){this.$emit("envChange",e)},multipleSelect(){this.visible=!1;let e=this.options.filter((e=>e.checked));this.$emit("select",e),this.$emit("update:value",e)},select(e){this.multiple?this.options.forEach((t=>{t.id==e.id&&(t.checked=!t.checked)})):(this.visible=!1,this.$emit("update:value",e.id),this.$emit("select",e))}}};var g=(0,a(83744).Z)(m,[["render",function(e,t,a,d,p,h){const m=(0,n.up)("EnvSelector"),g=(0,n.up)("a-input-search"),v=(0,n.up)("a-button"),f=(0,n.up)("a-empty"),y=(0,n.up)("a-skeleton"),w=(0,n.up)("a-card-grid"),b=(0,n.up)("a-card"),_=(0,n.up)("CheckOutlined"),k=(0,n.up)("a-tag"),$=(0,n.up)("a-popover");return(0,n.wg)(),(0,n.j4)($,{placement:a.placement||"bottom","overlay-class-name":"selector-popover",visible:p.visible,"onUpdate:visible":t[1]||(t[1]=e=>p.visible=e),trigger:"click"},{content:(0,n.w5)((()=>[a.search?((0,n.wg)(),(0,n.iD)("div",i,[a.envFilter?((0,n.wg)(),(0,n.iD)("div",s,[(0,n.Wm)(m,{"no-all":!0,"is-filter":!0,onEnvChange:h.envChange},null,8,["onEnvChange"])])):(0,n.kq)("",!0),(0,n._)("div",r,[(0,n.Wm)(g,{value:p.key,"onUpdate:value":t[0]||(t[0]=e=>p.key=e),class:"full",placeholder:e.$t("search")},null,8,["value","placeholder"])]),(0,n._)("div",o,[a.multiple?((0,n.wg)(),(0,n.j4)(v,{key:0,type:"primary",onClick:h.multipleSelect,disabled:0==h.multipleSelectNum},{default:(0,n.w5)((()=>[(0,n.Uk)((0,l.zw)(e.$t("Ok")),1)])),_:1},8,["onClick","disabled"])):(0,n.kq)("",!0)])])):(0,n.kq)("",!0),a.loading||0!=h.filterOptions.length?(0,n.kq)("",!0):((0,n.wg)(),(0,n.j4)(f,{key:1,image:p.simpleImage},null,8,["image"])),(0,n._)("div",{class:"overflow-auto scrollbar",style:(0,l.j5)("max-height:"+90*(e.rows||5)+"px")},[a.loading?((0,n.wg)(),(0,n.j4)(b,{key:0,class:"grid-menu",style:(0,l.j5)("width: "+(a.width?a.width:300)+"px")},{default:(0,n.w5)((()=>[(0,n.Wm)(w,{class:"selector-item",style:{width:"100%",padding:"15px"}},{default:(0,n.w5)((()=>[(0,n.Wm)(y,{avatar:"",paragraph:{rows:2}})])),_:1})])),_:1},8,["style"])):((0,n.wg)(),(0,n.j4)(b,{key:1,class:"grid-menu",style:(0,l.j5)("width: "+(a.width?a.width:300)+"px")},{default:(0,n.w5)((()=>[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(h.filterOptions,((e,t)=>((0,n.wg)(),(0,n.j4)(w,{class:(0,l.C_)(["selector-item",(a.value==e.id?"selected":"")+(a.disabled&&a.disabled(e)?" disabled":"")]),key:t,value:e.id,style:(0,l.j5)(a.col?"width:"+100/a.col+"%":a.options.length>=3?"width: 33%;":2==a.options.length?"width:50%;":"width:100%;"),onClick:t=>h.select(e)},{default:(0,n.w5)((()=>[e.checked?((0,n.wg)(),(0,n.j4)(_,{key:0,class:"CheckOutlined"})):(0,n.kq)("",!0),(0,n._)("div",{class:(0,l.C_)(a.getTag?"mt-15":"")},[a.icon?((0,n.wg)(),(0,n.j4)((0,n.LL)(a.icon),{key:0,"two-tone-color":"#00adef"})):a.svg?((0,n.wg)(),(0,n.iD)("svg",{key:1,class:(0,l.C_)([a.getTag?"mt-20":"","card-avatar icon"]),"aria-hidden":"true"},[(0,n._)("use",{"xlink:href":a.svg},null,8,u)],2)):(0,n.kq)("",!0),(0,n._)("div",c,(0,l.zw)(e.name||e.username),1)],2),a.getTag&&a.getTag(e)?((0,n.wg)(),(0,n.j4)(k,{key:1,class:"ribbon",color:"#f5f5f5"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,l.zw)(a.getTag(e)),1)])),_:2},1024)):(0,n.kq)("",!0)])),_:2},1032,["class","value","style","onClick"])))),128))])),_:1},8,["style"]))],4)])),default:(0,n.w5)((()=>[(0,n.WI)(e.$slots,"default",{},void 0,!0)])),_:3},8,["placement","visible"])}],["__scopeId","data-v-30bb0bbf"]])},9294:function(e,t,a){a.d(t,{Z:function(){return s}});var n=a(66252);var l=a(29764);(0,a(25552).H)({id:"javascript",extensions:[".js",".es6",".jsx",".mjs"],firstLine:"^#!.*\\bnode",filenames:["jakefile"],aliases:["JavaScript","javascript","js"],mimetypes:["text/javascript"],loader:function(){return a.e(6015).then(a.bind(a,6015))}});var i={name:"JsEditor",components:{monacoeditor:l.Z},props:["value","height","isReadonly","id","theme"],data(){return{code:"",cmOptions:{lineNumbers:!0,mode:"javascript",readOnly:!1,lint:!0}}},watch:{value(e,t){e!==t&&this.setValue()}},mounted(){this.setValue()},methods:{change(e){"string"==typeof e&&(this.$emit("update:value",e),this.$emit("change",e))},setValue(){null!=this.value.replace&&(this.code=this.value)}}};var s=(0,a(83744).Z)(i,[["render",function(e,t,a,l,i,s){const r=(0,n.up)("monacoeditor");return(0,n.wg)(),(0,n.iD)("div",null,[(0,n.Wm)(r,{id:a.id||"JsEditor",content:i.code,"onUpdate:content":t[0]||(t[0]=e=>i.code=e),option:i.cmOptions,onChange:s.change,height:a.height,theme:a.theme,"is-readonly":a.isReadonly},null,8,["id","content","option","onChange","height","theme","is-readonly"])])}]])},1299:function(e,t,a){a.d(t,{Z:function(){return r}});var n=a(66252),l=a(3577);const i={key:0,class:"title"};var s={name:"DetailList",props:{title:{type:String,required:!1,default:""},col:{type:Number,required:!1,default:3},size:{type:String,required:!1,default:"large"},layout:{type:String,required:!1,default:"horizontal"}}};var r=(0,a(83744).Z)(s,[["render",function(e,t,a,s,r,o){const u=(0,n.up)("a-row");return(0,n.wg)(),(0,n.iD)("div",{class:(0,l.C_)(["detail-list","small"===a.size?"small":"large","vertical"===a.layout?"vertical":"horizontal"]),style:(0,l.j5)("flex-"+a.col)},[a.title?((0,n.wg)(),(0,n.iD)("div",i,(0,l.zw)(a.title),1)):(0,n.kq)("",!0),(0,n.Wm)(u,null,{default:(0,n.w5)((()=>[(0,n.WI)(e.$slots,"default")])),_:3})],6)}]])},13589:function(e,t,a){a.d(t,{Z:function(){return o}});var n=a(66252),l=a(3577);const i={class:"detail-content"};const s={1:{xs:24},2:{xs:24,sm:12},3:{xs:24,sm:12,md:8},4:{xs:24,sm:12,md:6}};var r={name:"DetailListItem",i18n:a(39945),props:{name:{type:String,required:!1,default:""},rules:{type:Array,required:!1,default(){return[]}},term:{type:String,required:!1,default:""},termTop:{type:Boolean}},data(){return{col:2,responsive:s}},computed:{getRules(){return this.rules.map((e=>(e.message=this.$t(e.message),e))),this.rules}},created(){this.$parent&&this.$parent.$parent&&this.$parent.$parent.col>0&&(this.col=this.$parent.$parent.col)},methods:{}};var o=(0,a(83744).Z)(r,[["render",function(e,t,a,s,r,o){const u=(0,n.up)("a-form-item"),c=(0,n.up)("a-col");return(0,n.wg)(),(0,n.j4)(c,(0,n.dG)({class:"detail-list-content flex"},r.responsive[r.col]),{default:(0,n.w5)((()=>[(0,n._)("div",{class:(0,l.C_)(a.termTop?"term top":"term")},(0,l.zw)(a.term),3),(0,n._)("div",i,[a.rules?((0,n.wg)(),(0,n.j4)(u,{key:0,name:a.name,rules:o.getRules},{default:(0,n.w5)((()=>[(0,n.WI)(e.$slots,"default")])),_:3},8,["name","rules"])):(0,n.WI)(e.$slots,"default",{key:1})])])),_:3},16)}]])},57378:function(e,t,a){a.r(t),a.d(t,{default:function(){return h}});var n=a(66252),l=a(3577);a(57658);var i=a(61103),s=a(1299),r=a(33907),o=a(50976),u=a(34531),c=a(13589),d=a(9294);var p={name:"TestcaseCreate",i18n:a(89234),components:{DetailListItem:c.Z,DetailList:s.Z,PageLayout:i.Z,AutoForm:o.Z,CardSelector:u.Z,JsEditor:d.Z},data(){return{pid:"",urlList:[],initMapping:[{label:"Basic",fields:[[{name:"jitter",type:"boolean",unit:"",label:"Jitter",value:!1},{name:"uniform",type:"boolean",unit:"",label:"Uniform",value:!1},{name:"p",type:"text",unit:"",label:"Percentiles",value:"50, 75, 90, 99, 99.9"},{name:"r",type:"number",unit:"",label:"Histogram Resolution",value:"0.0001"},{name:"c",type:"number",unit:"",label:"Threads/Simultaneous connections",value:"8"},{name:"qps",type:"number",unit:"",label:"QPS",value:"1000"},{name:"t",type:"number",unit:"s",label:"Duration",value:"3"},{name:"n",type:"number",unit:"calls",label:"or run for exactly",value:""},{name:"tMax",type:"boolean",unit:"",label:"or run until interrupted",value:!1}]]},{label:"Load using",fields:[[{name:"runner",type:"select",unit:"",label:"Runner",value:"tcp/udp/http",options:[{label:"tcp/udp/http",value:"tcp/udp/http"},{label:"grpc",value:"grpc"}]},{name:"https-insecure",type:"boolean",unit:"",label:"https insecure",value:!0,showBy:{runner:"tcp/udp/http"}},{name:"stdclient",type:"boolean",unit:"",label:"standard go client instead of fastclient",value:!1,showBy:{runner:"tcp/udp/http"}},{name:"sequential-warmup",type:"boolean",unit:"",label:"sequential warmup",value:!1,showBy:{runner:"tcp/udp/http"}},{name:"resolve",type:"text",unit:"",label:"resolve",value:"",showBy:{runner:"tcp/udp/http"}},{name:"grpc-secure",type:"boolean",unit:"",label:"grpc secure transport (tls)",value:!0,showBy:{runner:"grpc"}},{name:"ping",type:"boolean",unit:"",label:"using ping backend",value:!1,showBy:{runner:"grpc"}},{name:"grpc-ping-delay",type:"number",unit:"s",label:"ping delay",value:"0",showBy:{runner:"grpc"}},{name:"json",type:"boolean",unit:"",label:"JSON output",value:!1,showBy:{runner:"grpc"}},{name:"save",type:"boolean",unit:"",label:"Save output",value:!1,showBy:{runner:"grpc"}}]]}],visible:!1,detail:{content:{targets:[],pipyJS:"",url:null,H:"User-Agent: fortio.org/fortio-dev",payload:"",name:"New Fortio",timeout:"750"}},loading:!0,fortios:[]}},computed:{...(0,r.rn)({rules:e=>e.rules.rules,isMobile:e=>e.setting.isMobile})},created(){this.pid=this.$route.params.id||"",this.$gql.query('fleets(filters:{type:{eq:"fortio"}}){data{id,attributes{name,content}}}').then((e=>{this.fortios=e.data})),this.getUrlList(),""!=this.pid?(this.loading=!0,this.$gql.query(`testcase(id: ${this.pid}){data{id,attributes{name,content,createdAt}}}`).then((e=>{let t=e.data;this.detail=t,this.detail.content.targets=this.detail.content.targets?this.detail.content.targets:[],this.initMapping.forEach((e=>{e.fields.forEach((e=>{e.forEach((e=>{t.content[e.name]&&("t"==e.name?e.value=t.content[e.name].replace(e.unit,""):e.value=t.content[e.name])}))}))})),this.loading=!1}))):(this.detail={content:{os:"generic_linux",arch:"loongarch64",pipy_version:"nightly-202205110231",pipyJS:"pipy({\n  _upstream_router: new algo.URLRouter({\n    '/1': new Data(new Array(1024).fill(65)),\n    '/10': new Data(new Array(10*1024).fill(65)),\n    '/100': new Data(new Array(100*1024).fill(65)),\n    '/1000': new Data(new Array(1000*1024).fill(65)),\n    '/*': new Data(new Array(128).fill(65))\n  }),\n\n  // proxies\n  _upstream_services: (\n    Object.fromEntries(\n      Object.entries({\n        \"default\": [\n          \"127.0.0.1:8080\",\n        ]\n      }).map(\n        ([k, v]) => [\n          k, new algo.RoundRobinLoadBalancer(v)\n        ]\n      )\n    )\n  ),\n\n  _proxy_router: new algo.URLRouter({\n      '/*': \"default\"\n    }),\n\n  __turnDown: false,\n  __serviceID: '',\n\n  _balancer: null,\n  _balancerCache: null,\n  _target: '',\n  _targetCache: null,\n\n  _g: {\n    connectionID: 0,\n  },\n\n  _connectionPool: new algo.ResourcePool(\n    () => ++_g.connectionID\n  )\n})\n\n.listen(8080)\n  .serveHTTP(\n    req => new Message(\n      _upstream_router.find(req.head.path)\n    )\n  )\n\n.listen(8000)\n  .handleStreamStart(\n    () => (\n      _balancerCache = new algo.Cache(\n        // k is a balancer, v is a target\n        (k  ) => k.select(),\n        (k,v) => k.deselect(v),\n      ),\n      _targetCache = new algo.Cache(\n        // k is a target, v is a connection ID\n        (k  ) => _connectionPool.allocate(k),\n        (k,v) => _connectionPool.free(v),\n      )\n    )\n  )\n  .handleStreamEnd(\n    () => (\n      _targetCache.clear(),\n      _balancerCache.clear()\n    )\n  )\n  .demuxHTTP('router-request')\n\n.pipeline('router-request')\n  .handleMessageStart(\n    msg => (\n      __serviceID = _proxy_router.find(\n        msg.head.headers.host,\n        msg.head.path,\n      )\n    )\n  )\n  .link(\n    'balancer-request'\n  )\n\n.pipeline('balancer-request')\n  .handleMessageStart(\n    () => (\n      _balancer = _upstream_services[__serviceID],\n      _balancer && (_target = _balancerCache.get(_balancer)),\n      _target && (__turnDown = true)\n    )\n  )\n  .link(\n    'balancer-forward', () => Boolean(_target),\n    ''\n  )\n\n.pipeline('balancer-forward')\n  .muxHTTP(\n    'balancer-connection',\n    () => _targetCache.get(_target)\n  )\n\n.pipeline('balancer-connection')\n  .connect(\n    () => _target\n  )\n\n.pipeline('404-request')\n  .replaceMessage(\n    new Message({ status: 404 }, 'No handler')\n  )\n",url:null,H:"User-Agent: fortio.org/fortio-dev",payload:"",timeout:"750",name:"New Fortio",targets:[]}},this.loading=!1)},methods:{pjsChange(){},onTabChange(e){},valid(){return""==this.detail.name?(this.$message.error(this.$t("The name cannot be empty"),3),!1):""!=this.detail.name||(this.$message.error(this.$t("The name cannot be empty"),3),!1)},clearTarget(e){this.detail.content.targets.splice(e,1)},setTargets(e){this.detail.content.targets=e},validate(){this.$refs.layout.$refs.form.validateFields().then((()=>{this.save()})).catch((()=>{}))},save(){if(!this.valid())return;let e={};e.name=this.detail.content.name;let t={};t.pipyJS=this.detail.content.pipyJS,t.name=this.detail.content.name,t.url=this.detail.content.url,t.timeout=this.detail.content.timeout,t.payload=this.detail.content.payload,t.H=this.detail.content.H,t.targets=this.detail.content.targets,t.os=this.detail.content.os,t.arch=this.detail.content.arch,t.pipy_version=this.detail.content.pipy_version,this.initMapping.forEach((e=>{e.fields.forEach((e=>{e.forEach((e=>{"t"==e.name?t[e.name]=e.value+e.unit:t[e.name]=e.value}))}))})),e.content=t,""!=this.pid?this.$gql.mutation(`updateTestcase(id:${this.pid}, data: $data){data{id}}`,{data:e},{data:"TestcaseInput!"}).then((()=>{this.$message.success(this.$t("Save successfully"),3),this.$closePage(this.$route)})):this.$gql.mutation("createTestcase(data: $data){data{id,attributes{name}}}",{data:e},{data:"TestcaseInput!"}).then((e=>{this.insertUrl(),this.$message.success(this.$t("Created successfully"),3),this.goDetail(e.testcase.id)}))},getUrlList(){this.urlList=[],this.$gql.query('systemSettings(filters:{type:{eq:"TestcaseURL"}}){data{id,attributes{mode,content}}}').then((e=>{e.data.forEach((e=>{if(e.content.status){let t={label:"",value:""};t.disabled="activated"!=e.content.status,t.label=e.content.displayName+"("+e.content.host+(e.content.port?":"+e.content.port:"")+e.content.path+")",t.value=e.content.host+(e.content.port?":"+e.content.port:"")+e.content.path,"activated"!=e.content.status&&(t.label+=`(${e.content.status})`),this.urlList.push(t)}}))}))},insertUrl(){},goDetail(e){this.$router.push({path:"/inspector/testcase/detail/"+e})},handleChange(){},hide(){this.visible=!1}}};var h=(0,a(83744).Z)(p,[["render",function(e,t,a,i,s,r){const o=(0,n.up)("a-input"),u=(0,n.up)("DetailListItem"),c=(0,n.up)("a-textarea"),d=(0,n.up)("a-tag"),p=(0,n.up)("CardSelector"),h=(0,n.up)("a-select-option"),m=(0,n.up)("a-select"),g=(0,n.up)("DetailList"),v=(0,n.up)("a-button"),f=(0,n.up)("AutoForm"),y=(0,n.up)("a-card"),w=(0,n.up)("a-tab-pane"),b=(0,n.up)("JsEditor"),_=(0,n.up)("a-tabs"),k=(0,n.up)("a-col"),$=(0,n.up)("a-row"),C=(0,n.up)("PageLayout");return(0,n.wg)(),(0,n.j4)(C,{"hide-breadcrumb":!0,"form-state":s.detail.content,title:e.$t("New Testcase"),ref:"layout"},(0,n.Nv)({headerContent:(0,n.w5)((()=>[(0,n.Wm)(g,{size:"small",col:2},{default:(0,n.w5)((()=>[(0,n.Wm)(u,{term:e.$t("as"),name:"name",rules:e.rules.required},{default:(0,n.w5)((()=>[(0,n.Wm)(o,{placeholder:e.$t("unset"),value:s.detail.content.name,"onUpdate:value":t[0]||(t[0]=e=>s.detail.content.name=e),class:"width-200"},null,8,["placeholder","value"])])),_:1},8,["term","rules"]),(0,n.Wm)(u,{term:e.$t("Timeout")+" (ms)",name:"timeout",rules:e.rules.required},{default:(0,n.w5)((()=>[(0,n.Wm)(o,{value:s.detail.content.timeout,"onUpdate:value":t[1]||(t[1]=e=>s.detail.content.timeout=e),type:"number",placeholder:e.$t("unset"),class:"width-100"},null,8,["value","placeholder"])])),_:1},8,["term","rules"]),(0,n.Wm)(u,{term:e.$t("Headers"),"term-top":!0},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{value:s.detail.content.H,"onUpdate:value":t[2]||(t[2]=e=>s.detail.content.H=e),placeholder:e.$t("unset"),rows:4},null,8,["value","placeholder"])])),_:1},8,["term"]),(0,n.Wm)(u,{term:e.$t("Payload"),"term-top":!0},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{value:s.detail.content.payload,"onUpdate:value":t[3]||(t[3]=e=>s.detail.content.payload=e),placeholder:e.$t("unset"),rows:4},null,8,["value","placeholder"])])),_:1},8,["term"]),s.pid?(0,n.kq)("",!0):((0,n.wg)(),(0,n.j4)(u,{key:0,term:e.$t("Test Machine")},{default:(0,n.w5)((()=>[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(s.detail.content.targets||[],((e,t)=>((0,n.wg)(),(0,n.j4)(d,{key:t,closable:"",onClose:e=>r.clearTarget(t)},{default:(0,n.w5)((()=>[(0,n.Uk)((0,l.zw)(e.name),1)])),_:2},1032,["onClose"])))),128)),(0,n.Wm)(p,{search:!0,width:400,col:2,svg:"#icon-fortio",value:s.detail.content.targets,"onUpdate:value":t[4]||(t[4]=e=>s.detail.content.targets=e),multiple:!0,"get-tag":e=>e.content.host,options:s.fortios},{default:(0,n.w5)((()=>[(0,n._)("a",null,[(0,n.Wm)(d,{color:"#00adef",key:"submit",type:"primary"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,l.zw)(e.$t("select"))+" Fortio ",1)])),_:1})])])),_:1},8,["value","get-tag","options"])])),_:1},8,["term"])),(0,n.Wm)(u,{term:e.$t("Test Target"),name:"url",rules:e.rules.required},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{ref:"select",value:s.detail.content.url,"onUpdate:value":t[5]||(t[5]=e=>s.detail.content.url=e),class:"full"},{default:(0,n.w5)((()=>[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(s.urlList,((e,t)=>((0,n.wg)(),(0,n.j4)(h,{key:t,value:e.value,disabled:e.disabled},{default:(0,n.w5)((()=>[(0,n.Uk)((0,l.zw)(e.label),1)])),_:2},1032,["value","disabled"])))),128))])),_:1},8,["value"])])),_:1},8,["term","rules"])])),_:1})])),action:(0,n.w5)((()=>[(0,n.Wm)(v,{type:"primary",onClick:r.validate},{default:(0,n.w5)((()=>[(0,n.Uk)((0,l.zw)(""!=s.pid?e.$t("save"):s.detail.content.targets.length>0?e.$t("Run"):e.$t("create")),1)])),_:1},8,["onClick"])])),default:(0,n.w5)((()=>[(0,n.Wm)($,{class:"mg-0"},{default:(0,n.w5)((()=>[(0,n.Wm)(k,{class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,n.w5)((()=>[(0,n.Wm)(_,{type:"card"},{default:(0,n.w5)((()=>[(0,n.Wm)(w,{key:"1",tab:e.$t("config")},{default:(0,n.w5)((()=>[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(s.initMapping,((e,t)=>((0,n.wg)(),(0,n.j4)(y,{key:t,class:"card mb-24",title:e.label,bordered:!1,loading:s.loading},{default:(0,n.w5)((()=>[(0,n.Wm)(f,{col:3,fields:e.fields},null,8,["fields"])])),_:2},1032,["title","loading"])))),128))])),_:1},8,["tab"]),(0,n.Wm)(w,{key:"2",tab:e.$t("PipyJS")},{default:(0,n.w5)((()=>[(0,n.Wm)(b,{"is-readonly":!1,value:s.detail.content.pipyJS,"onUpdate:value":t[6]||(t[6]=e=>s.detail.content.pipyJS=e)},null,8,["value"])])),_:1},8,["tab"])])),_:1})])),_:1})])),_:1})])),_:2},[""!=s.pid?{name:"extra",fn:(0,n.w5)((()=>[])),key:"0"}:void 0]),1032,["form-state","title"])}]])}}]);