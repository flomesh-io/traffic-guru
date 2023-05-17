"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[7413],{34531:function(e,t,a){a.d(t,{Z:function(){return g}});var l=a(66252),i=a(3577);const n={key:0,class:"flex pd-10"},s={key:0,class:"flex-item"},o={class:"flex-item"},r={class:"pl-10"},u=["xlink:href"],d={class:"card-selector-title"};var c=a(85263),p=a(75255),m=a(60459),h={name:"CardSelector",components:{CheckOutlined:p.Z,EnvSelector:m.Z},props:["loading","envFilter","search","options","icon","placement","disabled","value","getTag","svg","col","width","multiple"],emits:["envChange","select"],data(){return{simpleImage:c.Z.PRESENTED_IMAGE_SIMPLE,visible:!1,key:""}},i18n:a(89234),computed:{multipleSelectNum(){let e=0;return this.options.forEach((t=>{t.checked&&e++})),e},filterOptions(){if(this.key){let e=this.options.filter((e=>(e.name||e.username||"").indexOf(this.key)>=0));return e.map((e=>{null==e.checked&&(e.checked=!1)})),e}{let e=this.options;return e.map((e=>{null==e.checked&&(e.checked=!1)})),e}}},watch:{value:{handler(){this.multiple&&this.options.forEach((e=>{e.checked=!!this.value.find((t=>e.id==t.id))}))},deep:!0}},methods:{envChange(e){this.$emit("envChange",e)},multipleSelect(){this.visible=!1;let e=this.options.filter((e=>e.checked));this.$emit("select",e),this.$emit("update:value",e)},select(e){this.multiple?this.options.forEach((t=>{t.id==e.id&&(t.checked=!t.checked)})):(this.visible=!1,this.$emit("update:value",e.id),this.$emit("select",e))}}};var g=(0,a(83744).Z)(h,[["render",function(e,t,a,c,p,m){const h=(0,l.up)("EnvSelector"),g=(0,l.up)("a-input-search"),f=(0,l.up)("a-button"),v=(0,l.up)("a-empty"),y=(0,l.up)("a-skeleton"),w=(0,l.up)("a-card-grid"),b=(0,l.up)("a-card"),k=(0,l.up)("CheckOutlined"),_=(0,l.up)("a-tag"),$=(0,l.up)("a-popover");return(0,l.wg)(),(0,l.j4)($,{placement:a.placement||"bottom","overlay-class-name":"selector-popover",visible:p.visible,"onUpdate:visible":t[1]||(t[1]=e=>p.visible=e),trigger:"click"},{content:(0,l.w5)((()=>[a.search?((0,l.wg)(),(0,l.iD)("div",n,[a.envFilter?((0,l.wg)(),(0,l.iD)("div",s,[(0,l.Wm)(h,{"no-all":!0,"is-filter":!0,onEnvChange:m.envChange},null,8,["onEnvChange"])])):(0,l.kq)("",!0),(0,l._)("div",o,[(0,l.Wm)(g,{value:p.key,"onUpdate:value":t[0]||(t[0]=e=>p.key=e),class:"full",placeholder:e.$t("search")},null,8,["value","placeholder"])]),(0,l._)("div",r,[a.multiple?((0,l.wg)(),(0,l.j4)(f,{key:0,type:"primary",onClick:m.multipleSelect,disabled:0==m.multipleSelectNum},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(e.$t("Ok")),1)])),_:1},8,["onClick","disabled"])):(0,l.kq)("",!0)])])):(0,l.kq)("",!0),a.loading||0!=m.filterOptions.length?(0,l.kq)("",!0):((0,l.wg)(),(0,l.j4)(v,{key:1,image:p.simpleImage},null,8,["image"])),(0,l._)("div",{class:"overflow-auto scrollbar",style:(0,i.j5)("max-height:"+90*(e.rows||5)+"px")},[a.loading?((0,l.wg)(),(0,l.j4)(b,{key:0,class:"grid-menu",style:(0,i.j5)("width: "+(a.width?a.width:300)+"px")},{default:(0,l.w5)((()=>[(0,l.Wm)(w,{class:"selector-item",style:{width:"100%",padding:"15px"}},{default:(0,l.w5)((()=>[(0,l.Wm)(y,{avatar:"",paragraph:{rows:2}})])),_:1})])),_:1},8,["style"])):((0,l.wg)(),(0,l.j4)(b,{key:1,class:"grid-menu",style:(0,i.j5)("width: "+(a.width?a.width:300)+"px")},{default:(0,l.w5)((()=>[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(m.filterOptions,((e,t)=>((0,l.wg)(),(0,l.j4)(w,{class:(0,i.C_)(["selector-item",(a.value==e.id?"selected":"")+(a.disabled&&a.disabled(e)?" disabled":"")]),key:t,value:e.id,style:(0,i.j5)(a.col?"width:"+100/a.col+"%":a.options.length>=3?"width: 33%;":2==a.options.length?"width:50%;":"width:100%;"),onClick:t=>m.select(e)},{default:(0,l.w5)((()=>[e.checked?((0,l.wg)(),(0,l.j4)(k,{key:0,class:"CheckOutlined"})):(0,l.kq)("",!0),(0,l._)("div",{class:(0,i.C_)(a.getTag?"mt-15":"")},[a.icon?((0,l.wg)(),(0,l.j4)((0,l.LL)(a.icon),{key:0,"two-tone-color":"#00adef"})):a.svg?((0,l.wg)(),(0,l.iD)("svg",{key:1,class:(0,i.C_)([a.getTag?"mt-20":"","card-avatar icon"]),"aria-hidden":"true"},[(0,l._)("use",{"xlink:href":a.svg},null,8,u)],2)):(0,l.kq)("",!0),(0,l._)("div",d,(0,i.zw)(e.name||e.username),1)],2),a.getTag&&a.getTag(e)?((0,l.wg)(),(0,l.j4)(_,{key:1,class:"ribbon",color:"#f5f5f5"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(a.getTag(e)),1)])),_:2},1024)):(0,l.kq)("",!0)])),_:2},1032,["class","value","style","onClick"])))),128))])),_:1},8,["style"]))],4)])),default:(0,l.w5)((()=>[(0,l.WI)(e.$slots,"default",{},void 0,!0)])),_:3},8,["placement","visible"])}],["__scopeId","data-v-30bb0bbf"]])},9294:function(e,t,a){a.d(t,{Z:function(){return s}});var l=a(66252);var i=a(29764);(0,a(25552).H)({id:"javascript",extensions:[".js",".es6",".jsx",".mjs"],firstLine:"^#!.*\\bnode",filenames:["jakefile"],aliases:["JavaScript","javascript","js"],mimetypes:["text/javascript"],loader:function(){return a.e(6015).then(a.bind(a,6015))}});var n={name:"JsEditor",components:{monacoeditor:i.Z},props:["value","height","isReadonly","id","theme"],data(){return{code:"",cmOptions:{lineNumbers:!0,mode:"javascript",readOnly:!1,lint:!0}}},watch:{value(e,t){e!==t&&this.setValue()}},mounted(){this.setValue()},methods:{change(e){"string"==typeof e&&(this.$emit("update:value",e),this.$emit("change",e))},setValue(){null!=this.value.replace&&(this.code=this.value)}}};var s=(0,a(83744).Z)(n,[["render",function(e,t,a,i,n,s){const o=(0,l.up)("monacoeditor");return(0,l.wg)(),(0,l.iD)("div",null,[(0,l.Wm)(o,{id:a.id||"JsEditor",content:n.code,"onUpdate:content":t[0]||(t[0]=e=>n.code=e),option:n.cmOptions,onChange:s.change,height:a.height,theme:a.theme,"is-readonly":a.isReadonly},null,8,["id","content","option","onChange","height","theme","is-readonly"])])}]])},1299:function(e,t,a){a.d(t,{Z:function(){return o}});var l=a(66252),i=a(3577);const n={key:0,class:"title"};var s={name:"DetailList",props:{title:{type:String,required:!1,default:""},col:{type:Number,required:!1,default:3},size:{type:String,required:!1,default:"large"},layout:{type:String,required:!1,default:"horizontal"}}};var o=(0,a(83744).Z)(s,[["render",function(e,t,a,s,o,r){const u=(0,l.up)("a-row");return(0,l.wg)(),(0,l.iD)("div",{class:(0,i.C_)(["detail-list","small"===a.size?"small":"large","vertical"===a.layout?"vertical":"horizontal"]),style:(0,i.j5)("flex-"+a.col)},[a.title?((0,l.wg)(),(0,l.iD)("div",n,(0,i.zw)(a.title),1)):(0,l.kq)("",!0),(0,l.Wm)(u,null,{default:(0,l.w5)((()=>[(0,l.WI)(e.$slots,"default")])),_:3})],6)}]])},13589:function(e,t,a){a.d(t,{Z:function(){return r}});var l=a(66252),i=a(3577);const n={class:"detail-content"};const s={1:{xs:24},2:{xs:24,sm:12},3:{xs:24,sm:12,md:8},4:{xs:24,sm:12,md:6}};var o={name:"DetailListItem",i18n:a(39945),props:{name:{type:String,required:!1,default:""},rules:{type:Array,required:!1,default(){return[]}},term:{type:String,required:!1,default:""},termTop:{type:Boolean}},data(){return{col:2,responsive:s}},computed:{getRules(){return this.rules.map((e=>(e.message=this.$t(e.message),e))),this.rules}},created(){this.$parent&&this.$parent.$parent&&this.$parent.$parent.col>0&&(this.col=this.$parent.$parent.col)},methods:{}};var r=(0,a(83744).Z)(o,[["render",function(e,t,a,s,o,r){const u=(0,l.up)("a-form-item"),d=(0,l.up)("a-col");return(0,l.wg)(),(0,l.j4)(d,(0,l.dG)({class:"detail-list-content flex"},o.responsive[o.col]),{default:(0,l.w5)((()=>[(0,l._)("div",{class:(0,i.C_)(a.termTop?"term top":"term")},(0,i.zw)(a.term),3),(0,l._)("div",n,[a.rules?((0,l.wg)(),(0,l.j4)(u,{key:0,name:a.name,rules:r.getRules},{default:(0,l.w5)((()=>[(0,l.WI)(e.$slots,"default")])),_:3},8,["name","rules"])):(0,l.WI)(e.$slots,"default",{key:1})])])),_:3},16)}]])},9280:function(e,t,a){a.d(t,{Z:function(){return u}});var l=a(66252);const i=(0,l._)("div",{id:"DataChart",class:"height-500"},null,-1),n=(0,l._)("div",{id:"PercentilesChart",class:"height-500"},null,-1);a(57658);var s=a(21936);function o(e,t){let a=document.getElementById(e.id);a&&t.dispose(a);let l,i=t.init(a);l={title:{text:e.title},tooltip:e.tooltip,legend:{data:e.legend},grid:{left:"3%",right:"4%",bottom:e.hasZoom?"60px":"10px",containLabel:!0},toolbox:{feature:{saveAsImage:{}}},dataZoom:e.hasZoom?[{type:"slider",start:0,end:100,labelFormatter:function(t){return Math.ceil(100*t/e.xAxisLength)+"%"}}]:null,xAxis:e.xAxis,yAxis:{boundaryGap:!0,name:e.yAxis.name,type:"value"},series:e.series},l&&"object"==typeof l&&i.setOption(l)}var r={name:"TestReportContent",i18n:a(89234),components:{JsonEditor:s.Z},props:["reports"],data(){return{}},computed:{logStringify(){return this.reports?JSON.stringify(this.reports):"{}"}},mounted(){let e=[];this.reports.forEach((t=>{1==t.status&&e.push(t.content)})),function(e,t){let a=[],l=[],i=[];e&&e.forEach((e=>{if(e.DurationHistogram&&e.DurationHistogram.Percentiles){i=[];let t=[];t.push({value:0}),i.push(0),e.DurationHistogram.Percentiles.forEach((e=>{t.push({value:1e3*e.Value}),i.push(e.Percentile)}));let n=`pipy-${e.StartTime.split(".")[0]}`;l.push(n),a.push({name:n,type:"line",areaStyle:{},smooth:!0,data:t})}})),o({id:"PercentilesChart",title:"Latency P99",legend:l,tooltip:{trigger:"axis"},xAxis:{data:i,name:"(%)",boundaryGap:!1,type:"category"},yAxis:{name:"(ms)"},series:a},t)}(e,this.$echarts),function(e,t){let a=[],l=[],i=0;e&&e.forEach((e=>{if(e.DurationHistogram&&e.DurationHistogram.Data){let t=[];e.DurationHistogram.Data.forEach((e=>{let a=Math.ceil(1e3*e.Start),l=Math.ceil(1e3*e.End);t.push({type:"start",value:[a,e.Count],start:a,end:l,lantency:l-a,count:e.Count,percent:Math.ceil(e.Percent)}),t.push({type:"end",value:[l,e.Count],start:a,end:l,lantency:l-a,count:e.Count,percent:Math.ceil(e.Percent)}),i<l&&(i=l)}));let n=`pipy-${e.StartTime.split(".")[0]}`;l.push(n),a.push({name:n,type:"line",symbol:"none",areaStyle:{},smooth:!1,data:t})}})),o({id:"DataChart",title:"TPS",hasZoom:!0,legend:l,tooltip:{trigger:"axis",formatter:function(e){let t="";return e.forEach((e=>{"end"==e.data.type&&(t+=`<span style="background:${e.color};width:10px;height:10px;display:inline-block;margin-right:10px"></span>${e.data.start}ms ~ ${e.data.end}ms (${e.data.lantency}ms) / ${e.data.count} (${e.data.percent}%)<br/>`)})),t}},xAxisLength:i,xAxis:{name:"(ms)",max:i,type:"value"},yAxis:{},series:a},t)}(e,this.$echarts)},methods:{}};var u=(0,a(83744).Z)(r,[["render",function(e,t,a,s,o,r){const u=(0,l.up)("a-col"),d=(0,l.up)("a-row"),c=(0,l.up)("a-tab-pane"),p=(0,l.up)("JsonEditor"),m=(0,l.up)("a-tabs");return a.reports&&a.reports.length>0?((0,l.wg)(),(0,l.j4)(m,{key:0,type:"card"},{default:(0,l.w5)((()=>[(0,l.Wm)(c,{key:"1",tab:e.$t("Overview")},{default:(0,l.w5)((()=>[(0,l.Wm)(d,{class:"row-mg"},{default:(0,l.w5)((()=>[(0,l.Wm)(u,{class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,l.w5)((()=>[i,n])),_:1})])),_:1})])),_:1},8,["tab"]),(0,l.Wm)(c,{key:"2",tab:e.$t("log")},{default:(0,l.w5)((()=>[(0,l.Wm)(p,{"is-readonly":!0,value:r.logStringify},null,8,["value"])])),_:1},8,["tab"])])),_:1})):(0,l.kq)("",!0)}]])},91821:function(e,t,a){a.r(t),a.d(t,{default:function(){return S}});var l=a(66252),i=a(3577);const n={class:"content"},s={class:"flex"},o={class:"flex-item"},r=["onClick"],u={class:"flex-item"},d={key:0},c={key:1},p={class:"flex-item"},m={class:"flex-item"},h={class:"font-right"};a(57658);var g=a(9280),f=a(50320),v=a(13471),y=a(2692),w=a(61103),b=a(1299),k=a(33907),_=a(50976),$=a(34531),x=a(13589),C=a(9294),W={name:"TestcaseDetail",i18n:a(89234),components:{LoadingOutlined:f.Z,DetailListItem:x.Z,DetailList:b.Z,PageLayout:w.Z,TestReportContent:g.Z,AutoForm:_.Z,FieldTimeOutlined:v.Z,MoreOutlined:y.Z,JsEditor:C.Z,CardSelector:$.Z},data(){return{selectTR:[],selectReports:[],running:!1,initMapping:[{label:"Basic",fields:[[{name:"jitter",type:"boolean",unit:"",label:"Jitter",value:!1},{name:"uniform",type:"boolean",unit:"",label:"Uniform",value:!1},{name:"p",type:"text",unit:"",label:"Percentiles",value:"50, 75, 90, 99, 99.9"},{name:"r",type:"number",unit:"",label:"Histogram Resolution",value:"0.0001"},{name:"c",type:"number",unit:"",label:"Threads/Simultaneous connections",value:"8"},{name:"qps",type:"number",unit:"",label:"QPS",value:"1000"},{name:"t",type:"number",unit:"s",label:"Duration",value:"3"},{name:"n",type:"number",unit:"calls",label:"or run for exactly",value:""},{name:"tMax",type:"boolean",unit:"s",label:"or run until interrupted",value:!1}]]},{label:"Load using",fields:[[{name:"runner",type:"select",unit:"",label:"Runner",value:"tcp/udp/http",options:[{label:"tcp/udp/http",value:"tcp/udp/http"},{label:"grpc",value:"grpc"}]},{name:"https-insecure",type:"boolean",unit:"",label:"https insecure",value:!0,showBy:{runner:"tcp/udp/http"}},{name:"stdclient",type:"boolean",unit:"",label:"standard go client instead of fastclient",value:!1,showBy:{runner:"tcp/udp/http"}},{name:"sequential-warmup",type:"boolean",unit:"",label:"sequential warmup",value:!1,showBy:{runner:"tcp/udp/http"}},{name:"resolve",type:"text",unit:"",label:"resolve",value:"",showBy:{runner:"tcp/udp/http"}},{name:"grpc-secure",type:"boolean",unit:"",label:"grpc secure transport (tls)",value:!0,showBy:{runner:"grpc"}},{name:"ping",type:"boolean",unit:"",label:"using ping backend",value:!1,showBy:{runner:"grpc"}},{name:"grpc-ping-delay",type:"number",unit:"s",label:"ping delay",value:"0",showBy:{runner:"grpc"}},{name:"json",type:"boolean",unit:"",label:"JSON output",value:!1,showBy:{runner:"grpc"}},{name:"save",type:"boolean",unit:"",label:"Save output",value:!1,showBy:{runner:"grpc"}}]]}],visible:!1,detail:{content:{pipyJS:""},name:"New Fortio",url:"http://localhost:8080//echo?delay=250us:30,5ms:5&status=503:0.5,429:1.5",H:"User-Agent: fortio.org/fortio-dev",payload:"",timeout:"750"},loading:!0,timeoutCnt:1,fortios:[],pid:"",key:"",pageNo:1,pageSize:10,total:0,testresults:[]}},computed:{...(0,k.rn)("setting",["isMobile"]),start(){return(this.pageNo-1)*this.pageSize}},created(){this.pid=this.$route.params.id||"",this.$gql.query('fleets(filters:{type:{eq:"fortio"}}){data{id,attributes{name,content}}}').then((e=>{this.fortios=e.data})),""!=this.pid&&(this.loading=!0,this.$gql.query(`testcase(id: ${this.pid}){data{id,attributes{name,content}}}`).then((e=>{let t=e.data;this.detail=t,this.detail.name=this.detail.name?this.detail.name:t.content.name,this.detail.url=t.content.url,this.detail.timeout=t.content.timeout,this.detail.payload=t.content.payload,this.detail.H=t.content.H,this.initMapping.forEach((e=>{e.fields.forEach((e=>{e.forEach((e=>{t.content[e.name]&&("t"==e.name?e.value=t.content[e.name].replace(e.unit,""):e.value=t.content[e.name])}))}))})),this.search(),this.timer()})))},methods:{remove(e){this.$gql.mutation(`deleteTestresult(id:${e}){data{id}}`).then((()=>{this.$message.success(this.$t("Deleted successfully"),3),this.search()}))},onTabChange(e){},previewAlone(e){this.selectReports=[e],this.visible=!0},preview(){this.selectReports=[],this.selectTR.forEach((e=>{this.testresults.forEach((t=>{t.id==e&&(this.selectReports.push(t),this.visible=!0)}))}))},valid(){return""!=this.detail.name||(this.$message.error(this.$t("The name cannot be empty"),3),!1)},edit(){this.$router.push({path:"/inspector/testcase/edit/"+this.pid})},save(e){if(!this.valid())return;this.running=!0;let t={};t.testcase=this.pid;let a={};a.targets=e,t.content=a,""!=this.pid&&this.$gql.mutation("runTestcase(data: $data)",{data:t},{data:"TestCaseRunInput"}).then((()=>{this.$message.success(this.$t("Created successfully"),3),this.running=!1}))},handleChange(){},search(e,t,a,l){this.pageNo=e||1,l||(this.loading=!0);let i={testcase:{eq:thispid}};this.$gql.query(`testresults(sort: "id:DESC", filters: $filters, pagination:{ start: ${this.start}, limit: ${this.pageSize}}){\n\t\t\t\t\t\tdata{id,attributes{status,content,updatedAt,createdAt}},\n\t\t\t\t\t\tmeta{pagination{total}}\n\t\t\t\t\t}`,{filters:i},{filters:"TestresultFiltersInput"}).then((e=>{this.testresults=e.data,this.total=e.pagination.total,this.loading=!1}))},hide(){this.visible=!1},timer(){setTimeout((()=>{this.search(null,null,null,!0),this.timer(),this.timeoutCnt++}),2e3*this.timeoutCnt)}}};var S=(0,a(83744).Z)(W,[["render",function(e,t,a,g,f,v){const y=(0,l.up)("DetailListItem"),w=(0,l.up)("DetailList"),b=(0,l.up)("a-button"),k=(0,l.up)("CardSelector"),_=(0,l.up)("a-checkbox"),$=(0,l.up)("LoadingOutlined"),x=(0,l.up)("a-badge"),C=(0,l.up)("FieldTimeOutlined"),W=(0,l.up)("a-popconfirm"),S=(0,l.up)("a-menu-item"),T=(0,l.up)("a-menu"),D=(0,l.up)("MoreOutlined"),j=(0,l.up)("a-dropdown"),z=(0,l.up)("a-list-item"),E=(0,l.up)("a-list"),q=(0,l.up)("a-checkbox-group"),Z=(0,l.up)("a-card"),R=(0,l.up)("a-col"),A=(0,l.up)("AutoForm"),L=(0,l.up)("a-row"),O=(0,l.up)("a-tab-pane"),U=(0,l.up)("JsEditor"),P=(0,l.up)("a-tabs"),H=(0,l.up)("TestReportContent"),I=(0,l.up)("a-modal"),M=(0,l.up)("PageLayout");return(0,l.wg)(),(0,l.j4)(M,{"hide-breadcrumb":!0,title:f.detail.name},{headerContent:(0,l.w5)((()=>[(0,l.Wm)(w,{size:"small",col:2},{default:(0,l.w5)((()=>[(0,l.Wm)(y,{term:e.$t("as")},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(f.detail.name||"-"),1)])),_:1},8,["term"]),(0,l.Wm)(y,{term:e.$t("Timeout")+" (ms)"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(f.detail.timeout||"-"),1)])),_:1},8,["term"]),(0,l.Wm)(y,{term:e.$t("Headers")},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(f.detail.H||"-"),1)])),_:1},8,["term"]),(0,l.Wm)(y,{term:e.$t("Payload")},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(f.detail.payload||"-"),1)])),_:1},8,["term"]),(0,l.Wm)(y,{term:e.$t("URL")},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(f.detail.url||"-"),1)])),_:1},8,["term"])])),_:1})])),action:(0,l.w5)((()=>[(0,l.Wm)(b,{onClick:v.edit,class:"mr-10"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(e.$t("edit")),1)])),_:1},8,["onClick"]),(0,l.Wm)(k,{search:!0,width:400,col:2,svg:"#icon-fortio",onSelect:v.save,multiple:!0,"get-tag":e=>e.content.host,options:f.fortios},{default:(0,l.w5)((()=>[(0,l._)("a",null,[(0,l.Wm)(b,{loading:f.running,key:"submit",type:"primary"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(f.running?e.$t("Running"):e.$t("Run")),1)])),_:1},8,["loading"])])])),_:1},8,["onSelect","get-tag","options"])])),default:(0,l.w5)((()=>[(0,l.Wm)(L,{class:"mg-0"},{default:(0,l.w5)((()=>[(0,l.Wm)(R,{class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,l.w5)((()=>[(0,l.Wm)(P,{type:"card"},{default:(0,l.w5)((()=>[(0,l.Wm)(O,{key:"1",tab:e.$t("Overview")},{default:(0,l.w5)((()=>[(0,l.Wm)(L,{class:"row-mg"},{default:(0,l.w5)((()=>[(0,l.Wm)(R,{class:"col-pd",xl:16,lg:24,md:24,sm:24,xs:24},{default:(0,l.w5)((()=>[(0,l.Wm)(Z,{class:"search-content",title:e.$t("Test Report"),loading:f.loading},{extra:(0,l.w5)((()=>[f.testresults.length>1?((0,l.wg)(),(0,l.j4)(b,{key:0,onClick:v.preview,type:"primary",disabled:f.selectTR.length<=1},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(e.$t("Multiple Preview")),1)])),_:1},8,["onClick","disabled"])):(0,l.kq)("",!0)])),default:(0,l.w5)((()=>[(0,l.Wm)(q,{value:f.selectTR,"onUpdate:value":t[0]||(t[0]=e=>f.selectTR=e),class:"full"},{default:(0,l.w5)((()=>[(0,l.Wm)(E,{"item-layout":"vertical",pagination:{showSizeChanger:!1,showQuickJumper:!1,onShowSizeChange:v.search,onChange:v.search,current:f.pageNo,pageSize:f.pageSize,showTotal:(t,a)=>`${e.$t("Total")} ${t}`,total:f.total}},{default:(0,l.w5)((()=>[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(f.testresults,((t,a)=>((0,l.wg)(),(0,l.j4)(z,{key:a},{default:(0,l.w5)((()=>[(0,l._)("div",n,[(0,l._)("div",s,[(0,l._)("div",o,[(0,l._)("div",null,[f.testresults.length>1?((0,l.wg)(),(0,l.j4)(_,{key:0,disabled:1!=t.status,value:t.id,class:"mr-10"},null,8,["disabled","value"])):(0,l.kq)("",!0),(0,l._)("a",{onClick:e=>v.previewAlone(t)},[(0,l._)("b",null,"#"+(0,i.zw)(t.id),1)],8,r)])]),(0,l._)("div",u,[(0,l._)("div",null,[0==t.status?((0,l.wg)(),(0,l.iD)("span",d,[(0,l.Wm)($,{class:"font-primary"}),(0,l.Uk)(" "+(0,i.zw)(e.$t("Running")),1)])):((0,l.wg)(),(0,l.iD)("span",c,[(0,l.Wm)(x,{color:["red","processing","green"][t.status+1],text:e.$t(["Failed","Running","Done"][t.status+1])},null,8,["color","text"])]))])]),(0,l._)("div",p,[(0,l._)("div",null,[(0,l._)("b",null,(0,i.zw)(e.$t("Target")),1),(0,l.Uk)(" : "),(0,l._)("span",null,(0,i.zw)(t.from||"-"),1)])]),(0,l._)("div",m,[(0,l._)("div",null,[(0,l.Wm)(C),(0,l._)("span",null,(0,i.zw)(new Date(t.updatedAt).toLocaleString()),1)])]),(0,l._)("div",h,[(0,l._)("div",null,[(0,l.Wm)(j,null,{overlay:(0,l.w5)((()=>[(0,l.Wm)(T,null,{default:(0,l.w5)((()=>[(0,l.Wm)(S,null,{default:(0,l.w5)((()=>[(0,l.Wm)(W,{placement:"topLeft","ok-text":e.$t("Yes"),"cancel-text":e.$t("No"),onConfirm:e=>v.remove(t.id)},{title:(0,l.w5)((()=>[(0,l._)("p",null,(0,i.zw)(e.$t("Tip")),1),(0,l._)("p",null,(0,i.zw)(e.$t("Are you sure to delete this?")),1)])),default:(0,l.w5)((()=>[(0,l._)("a",null,(0,i.zw)(e.$t("delete")),1)])),_:2},1032,["ok-text","cancel-text","onConfirm"])])),_:2},1024)])),_:2},1024)])),default:(0,l.w5)((()=>[(0,l._)("a",null,[(0,l.Wm)(D)])])),_:2},1024)])])])])])),_:2},1024)))),128))])),_:1},8,["pagination"])])),_:1},8,["value"])])),_:1},8,["title","loading"])])),_:1}),(0,l.Wm)(R,{class:"col-pd",xl:8,lg:24,md:24,sm:24,xs:24},{default:(0,l.w5)((()=>[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(f.initMapping,((e,t)=>((0,l.wg)(),(0,l.j4)(Z,{key:t,class:"card mb-24",title:e.label,bordered:!1,loading:f.loading},{default:(0,l.w5)((()=>[(0,l.Wm)(A,{col:1,fields:e.fields,class:"disabed-element"},null,8,["fields"])])),_:2},1032,["title","loading"])))),128))])),_:1})])),_:1})])),_:1},8,["tab"]),(0,l.Wm)(O,{key:"2",tab:e.$t("PipyJS")},{default:(0,l.w5)((()=>[(0,l.Wm)(U,{"is-readonly":!0,value:f.detail.content.pipyJS},null,8,["value"])])),_:1},8,["tab"])])),_:1})])),_:1})])),_:1}),(0,l.Wm)(I,{"destroy-on-close":!0,visible:f.visible,"onUpdate:visible":t[1]||(t[1]=e=>f.visible=e),title:e.$t("Test Report Detail"),footer:null,width:"70%"},{default:(0,l.w5)((()=>[(0,l.Wm)(H,{reports:f.selectReports},null,8,["reports"])])),_:1},8,["visible","title"])])),_:1},8,["title"])}]])}}]);