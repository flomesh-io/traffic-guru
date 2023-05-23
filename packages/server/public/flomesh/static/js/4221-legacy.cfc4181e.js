"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[4221],{72535:function(e,t,i){i.d(t,{Z:function(){return f}});i(74916),i(64765),i(92222),i(68309);var n=i(66252),a=i(3577),s=["onClick"],r={key:0},c={key:0},l={key:0},o={class:"list-content"},u={class:"list-content-item"};var d=i(66347),p=(i(57327),i(41539),i(57658),i(54747),i(2692)),v=i(99684),m=i(15541),h={name:"List",i18n:i(89234),components:{MoreOutlined:p.Z,PlusCircleTwoTone:v.Z,MedicineBoxOutlined:m.Z},props:["modeName","modeId","modeType","dialTestings"],data:function(){return{addBindVal:[],key:"",pageSize:10,pageNo:1,total:0,loading:!0,list:[]}},computed:{searchFilter:function(){var e=this;return""!=this.key?this.list.filter((function(t){return t.name.indexOf(e.key)>-1||t.ip.indexOf(e.key)>-1})):this.list},start:function(){return(this.pageNo-1)*this.pageSize}},created:function(){this.search()},methods:{newLb:function(){this.$router.push({path:"/inspector/healthcheck/create"})},detail:function(e){this.$router.push({path:"/inspector/healthcheck/detail/"+e})},remove:function(e){var t=this;this.$gql.mutation("deleteHealthcheck(id:".concat(e,"){data{id}}")).then((function(){t.$message.success(t.$t("Deleted successfully"),3),t.search()}))},search:function(e,t){var i=this;e&&(this.pageNo=e,this.pageSize=t);var n={start:this.start,limit:this.pageSize};this.loading=!0,this.list=[];var a={};a.name={contains:this.key},this.modeId&&(a.dialTestings={or:[]},this.dialTestings.forEach((function(e){a.dialTestings.or.push({id:{eq:e.id}})}))),this.$gql.query("healthchecks(filters: $filters, pagination: $pagination){\n\t\t\t\t\t\tdata{\n\t\t\t\t\t\t\tid,\n\t\t\t\t\t\t\tattributes{\n\t\t\t\t\t\t\t\tname,content,createdAt, \n\t\t\t\t\t\t\t\tdialTestings{data{id,attributes{name,content}}}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t},\n\t\t\t\t\t\tmeta{pagination{total}}\n\t\t\t\t\t}",{filters:a,pagination:n},{filters:"HealthcheckFiltersInput",pagination:"PaginationArg"}).then((function(e){var t,n=(0,d.Z)(e.data);try{var a=function(){var e=t.value;e.dialTestingName="",e.dialTestings.some((function(t){for(var n=0;n<t.content.targets.length;n++){var a=t.content.targets[n];if(a.type==i.modeType&&a.id==i.modeId){e.dialTestingName+=t.name+" ";break}}}))};for(n.s();!(t=n.n()).done;)a()}catch(e){n.e(e)}finally{n.f()}i.list=e.data,i.list.forEach((function(e){e.content&&e.content.length>1&&(e.status=e.content[0].data[0][0].value.concat(e.content[1].data[0][0].value))})),i.total=e.pagination.total,i.loading=!1}))}}};var f=(0,i(83744).Z)(h,[["render",function(e,t,i,d,p,v){var m=(0,n.up)("a-input-search"),h=(0,n.up)("a-divider"),f=(0,n.up)("PlusCircleTwoTone"),g=(0,n.up)("a-button"),b=(0,n.up)("MedicineBoxOutlined"),w=(0,n.up)("a-list-item-meta"),k=(0,n.up)("a-popconfirm"),S=(0,n.up)("a-menu-item"),y=(0,n.up)("a-menu"),x=(0,n.up)("MoreOutlined"),_=(0,n.up)("a-dropdown"),$=(0,n.up)("a-tag"),C=(0,n.up)("a-list-item"),W=(0,n.up)("a-list"),D=(0,n.up)("a-card");return(0,n.wg)(),(0,n.iD)("div",null,[(0,n.Wm)(D,{loading:p.loading,bordered:!1,title:i.modeName?e.$t("Bind Healthcheck"):e.$t("Healthcheck List")},{extra:(0,n.w5)((function(){return[(0,n._)("div",null,[i.modeName?(0,n.kq)("",!0):((0,n.wg)(),(0,n.j4)(m,{key:0,value:p.key,"onUpdate:value":t[0]||(t[0]=function(e){return p.key=e}),onInput:t[1]||(t[1]=function(e){return v.search()}),class:"right-search-input",placeholder:e.$t("search")},null,8,["value","placeholder"])),i.modeName?(0,n.kq)("",!0):((0,n.wg)(),(0,n.j4)(h,{key:1,type:"vertical"})),i.modeName?(0,n.kq)("",!0):((0,n.wg)(),(0,n.j4)(g,{key:2,type:"link",shape:"circle",onClick:v.newLb},{icon:(0,n.w5)((function(){return[(0,n.Wm)(f,{class:"PlusCircle icon-menu-sm rotate-icon"})]})),_:1},8,["onClick"]))])]})),default:(0,n.w5)((function(){return[(0,n.Wm)(W,{size:"large",pagination:!i.modeName&&{showSizeChanger:!0,showQuickJumper:!1,onShowSizeChange:v.search,onChange:v.search,current:p.pageNo,pageSize:p.pageSize,showTotal:function(t,i){return"".concat(e.$t("Total")," ").concat(t)},total:p.total}},{default:(0,n.w5)((function(){return[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(p.list,(function(t,d){return(0,n.wg)(),(0,n.j4)(C,{key:d},{actions:(0,n.w5)((function(){return[i.modeName?(0,n.kq)("",!0):((0,n.wg)(),(0,n.iD)("div",c,[(0,n.Wm)(_,null,{overlay:(0,n.w5)((function(){return[(0,n.Wm)(y,null,{default:(0,n.w5)((function(){return[(0,n.Wm)(S,null,{default:(0,n.w5)((function(){return[(0,n.Wm)(k,{placement:"topLeft","ok-text":e.$t("Yes"),"cancel-text":e.$t("No"),onConfirm:function(e){return v.remove(t.id)}},{title:(0,n.w5)((function(){return[(0,n._)("p",null,(0,a.zw)(e.$t("Tip")),1),(0,n._)("p",null,(0,a.zw)(e.$t("Are you sure to delete this?")),1)]})),default:(0,n.w5)((function(){return[i.modeName?(0,n.kq)("",!0):((0,n.wg)(),(0,n.iD)("a",l,(0,a.zw)(e.$t("delete")),1))]})),_:2},1032,["ok-text","cancel-text","onConfirm"])]})),_:2},1024)]})),_:2},1024)]})),default:(0,n.w5)((function(){return[(0,n._)("a",null,[(0,n.Wm)(x)])]})),_:2},1024)]))]})),default:(0,n.w5)((function(){return[(0,n.Wm)(w,null,{avatar:(0,n.w5)((function(){return[(0,n.Wm)(b,{class:"list-item-avatar"})]})),title:(0,n.w5)((function(){return[(0,n._)("a",{onClick:function(e){return v.detail(t.id)}},(0,a.zw)(t.name?t.name:e.$t("unnamed")),9,s)]})),description:(0,n.w5)((function(){return[(0,n.Uk)((0,a.zw)("0"==t.type?e.$t("Passive Healthcheck"):e.$t("Active Healthcheck"))+" ",1),i.modeName?((0,n.wg)(),(0,n.iD)("span",r," - "+(0,a.zw)(t.dialTestingName),1)):(0,n.kq)("",!0)]})),_:2},1024),(0,n._)("div",o,[(0,n._)("div",u,[(0,n._)("span",null,(0,a.zw)(e.$t("Status"))+"：",1),(0,n._)("p",null,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(t.content.success,(function(e,t){return(0,n.wg)(),(0,n.j4)($,{class:"mb-5",key:t,color:"#88d4a1"},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,a.zw)(e),1)]})),_:2},1024)})),128)),((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(t.content.failure,(function(e,t){return(0,n.wg)(),(0,n.j4)($,{class:"mb-5",key:t,color:"#fb9690"},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,a.zw)(e),1)]})),_:2},1024)})),128))])])])]})),_:2},1024)})),128))]})),_:1},8,["pagination"])]})),_:1},8,["loading","title"])])}],["__scopeId","data-v-7c7a5f10"]])},54982:function(e,t,i){i.r(t),i.d(t,{default:function(){return Z}});i(68309);var n=i(66252),a=i(3577),s=i(49963);var r=i(95082),c=(i(21249),i(57658),i(92222),i(41539),i(69384)),l=i(88711),o={key:0},u=["onClick"],d={key:3},p={key:0},v=["onClick"],m={key:3};i(40561),i(57327),i(69826);var h=i(13554),f=i(87202),g=[{key:"as",dataIndex:"name"},{key:"Namespace",width:160,dataIndex:"namespace"},{key:"Excluded path",width:330,dataIndex:"excludedPath"},{key:"Action",width:70,dataIndex:"action"}],b={name:"ServicesACL",i18n:i(89234),components:{DeleteOutlined:f.Z,ServiceList:h.Z},props:["blacklistServices","whitelistServices","subscribeServices","subscribeServicesAll","detail"],data:function(){return{svc_columns:g,whiteAddress:[],blackAddress:[]}},computed:{svcColumns:function(){var e=this;return this.svc_columns.map((function(t){return t.title=e.$t(t.key),t}))}},methods:{svcdetail:function(e,t){this.$router.push({path:"/fsm/service/detail/".concat(t,"/").concat(e)})},delWhitelistServices:function(e){var t=this,i=this.whitelistServices;this.whitelistServices.some((function(i,n){e.id===i.id&&t.whitelistServices.splice(n,1)}));var n=this.subscribeServicesAll.filter((function(e){return!i.concat(t.blacklistServices).find((function(t){return t.id==e.id}))}));this.$emit("update:whitelistServices",i),this.$emit("update:subscribeServices",n)},delblacklistServices:function(e){var t=this,i=this.blacklistServices;i.some((function(t,n){e.id===t.id&&i.splice(n,1)}));var n=this.subscribeServicesAll.filter((function(e){return!t.whitelistServices.concat(i).find((function(t){return t.id==e.id}))}));this.$emit("update:blacklistServices",i),this.$emit("update:subscribeServices",n)}}},w=i(83744);var k=(0,w.Z)(b,[["render",function(e,t,i,s,r,c){var l=(0,n.up)("ServiceList"),h=(0,n.up)("a-col"),f=(0,n.up)("a-input"),g=(0,n.up)("DeleteOutlined"),b=(0,n.up)("a-table"),w=(0,n.up)("a-card"),k=(0,n.up)("a-row"),S=(0,n.up)("a-tab-pane"),y=(0,n.up)("a-tabs");return(0,n.wg)(),(0,n.j4)(w,{class:"card",bordered:!1},{default:(0,n.w5)((function(){return[(0,n.Wm)(y,{activeKey:e.aclKey,"onUpdate:activeKey":t[0]||(t[0]=function(t){return e.aclKey=t}),"tab-position":"left"},{default:(0,n.w5)((function(){return[(0,n.Wm)(S,{key:"2",tab:e.$t("Service Black/White")},{default:(0,n.w5)((function(){return[(0,n.Wm)(k,{class:"row-mg"},{default:(0,n.w5)((function(){return[(0,n.Wm)(h,{class:"col-pd",xl:12,lg:24,md:24,sm:24,xs:24},{default:(0,n.w5)((function(){return[(0,n.Wm)(l,{mode:"ACL","destroy-inactive-tab-pane":!0,metric:!1,"has-search":!0,"embed-services":i.subscribeServices,embed:!0,"whitelist-services":i.whitelistServices,"blacklist-services":i.blacklistServices},null,8,["embed-services","whitelist-services","blacklist-services"])]})),_:1}),(0,n.Wm)(h,{class:"col-pd",xl:12,lg:24,md:24,sm:24,xs:24},{default:(0,n.w5)((function(){return[(0,n.Wm)(w,{class:"card nopd",title:e.$t("Service White")},{default:(0,n.w5)((function(){return[(0,n.Wm)(b,{columns:c.svcColumns,"data-source":i.whitelistServices,pagination:!1},{bodyCell:(0,n.w5)((function(t){var s=t.column,r=t.record;return["name"===s.dataIndex?((0,n.wg)(),(0,n.iD)("div",o,[(0,n._)("a",{href:"javascript:void(0)",onClick:function(e){return c.svcdetail(r.name,r.namespace)}},(0,a.zw)(r.name),9,u)])):"namespace"===s.dataIndex?((0,n.wg)(),(0,n.iD)(n.HY,{key:1},[(0,n.Uk)((0,a.zw)(r.registry.name+" / "+r.namespace),1)],64)):"excludedPath"===s.dataIndex?((0,n.wg)(),(0,n.j4)(f,{key:2,placeholder:e.$t("unset"),value:i.detail.whiteExcludedPath[r.id],"onUpdate:value":function(e){return i.detail.whiteExcludedPath[r.id]=e}},null,8,["placeholder","value","onUpdate:value"])):"action"===s.dataIndex?((0,n.wg)(),(0,n.iD)("a",d,[(0,n.Wm)(g,{onClick:function(e){return c.delWhitelistServices(r)}},null,8,["onClick"])])):(0,n.kq)("",!0)]})),_:1},8,["columns","data-source"])]})),_:1},8,["title"]),(0,n.Wm)(w,{class:"card mb-20 nopd",title:e.$t("Service Black")},{default:(0,n.w5)((function(){return[(0,n.Wm)(b,{columns:c.svcColumns,"data-source":i.blacklistServices,pagination:!1},{bodyCell:(0,n.w5)((function(t){var s=t.column,r=t.record;return["name"===s.dataIndex?((0,n.wg)(),(0,n.iD)("div",p,[(0,n._)("a",{href:"javascript:void(0)",onClick:function(e){return c.svcdetail(r.name,r.namespace)}},(0,a.zw)(r.name),9,v)])):"namespace"===s.dataIndex?((0,n.wg)(),(0,n.iD)(n.HY,{key:1},[(0,n.Uk)((0,a.zw)(r.registry.name+" / "+r.namespace),1)],64)):"excludedPath"===s.dataIndex?((0,n.wg)(),(0,n.j4)(f,{key:2,placeholder:e.$t("unset"),value:i.detail.blackExcludedPath[r.id],"onUpdate:value":function(e){return i.detail.blackExcludedPath[r.id]=e}},null,8,["placeholder","value","onUpdate:value"])):"action"===s.dataIndex?((0,n.wg)(),(0,n.iD)("a",m,[(0,n.Wm)(g,{onClick:function(e){return c.delblacklistServices(r)}},null,8,["onClick"])])):(0,n.kq)("",!0)]})),_:1},8,["columns","data-source"])]})),_:1},8,["title"])]})),_:1})]})),_:1})]})),_:1},8,["tab"])]})),_:1},8,["activeKey"])]})),_:1})}]]),S=i(38718),y=i(43462),x=i(79954),_=i(96991),$=i(33907),C=i(44107),W=i(49702),D=i(47556),A=i(990),E=i(88843),P=i(9294),U=i(60389),L=i(72535),j=i(48551),T=i(9112),I={name:"ServicesDetail",i18n:i(89234),components:{RingStatus:y.Z,ServiceBaseDetail:c.Z,ServiceOverview:l.Z,PodList:_.Z,HealthcheckList:L.Z,CheckpointList:U.Z,Json2YamlCard:C.Z,ServiceList:h.Z,PluginConfig:S.Z,PluginList:x.Z,EmbedDashboard:A.Z,JsEditor:P.Z,LogViewer:W.Z,ServiceACL:k,MiniArea:j.Z,ServiceExportCard:T.Z},data:function(){return{DEFAULT_SERVICE_DETAIL:D.ZC,activeKey:"1",external:{url:"",type:"Http://",token:""},visibleAP:!1,dialTestings:[],visible:!1,aclKey:"2",extend:{plugins:[],certificates:[],identitys:{},log:{level:"All"}},registry:{type:"",name:"",content:{}},ns:{id:"",name:""},pods:[],detail:{endpoints:[],spec:{type:"",clusterIP:"",sessionAffinity:"",ports:[]},metadata:{name:"",namespace:"",labels:{},annotations:{}},typeMeta:{},podInfo:{},containerImages:[],selector:{},statusInfo:{},conditions:[],rollingUpdateStrategy:{maxUnavailable:"",maxSurge:""},whiteExcludedPath:{},blackExcludedPath:{}},pjsConfig:"",contentString:"",loading:!0,pid:"",namespace:"",isMounted:!1,cumulativeMetrics:[],healthcheckData:{healthchecks_timer:[],healthchecks:{health:0,unhealthy:0}},subscribeServices:[],subscribeServicesTo:[],subscribeServicesAll:[],whitelistServices:[],blacklistServices:[],exportLoading:!1,modalVisible:!1,isExportEdit:!0}},computed:(0,r.Z)((0,r.Z)({},(0,$.rn)("setting",["isMobile"])),{},{svcColumns:function(){var e=this;return this.svc_columns.map((function(t){return t.title=e.$t(t.key),t}))}}),created:function(){this.pid=this.$route.params.id||"",this.namespace=this.$route.params.namespace||localStorage.getItem("NAMESPACE")},mounted:function(){var e=this;(0,E.oj)("service",this.pid).then((function(t){e.healthcheckData=t}))},methods:{exportOpen:function(){this.activeKey="15",this.modalVisible=!0},exportStart:function(){this.exportLoading=!0},exportSave:function(){this.exportLoading=!1},getDialTestings:function(e){this.dialTestings=e},selectPlugin:function(e){this.extend.plugins.push((0,r.Z)((0,r.Z)({},e),{},{enable:!0})),this.visibleAP=!1,this.$message.success(this.$t("Added successfully"),3)},showPluginBox:function(){this.visibleAP=!0},svcdetail:function(e,t){this.$router.push({path:"/fsm/service/detail/".concat(t,"/").concat(e)})},onTabChange:function(e){},saveLogLevel:function(e){this.$refs.ServiceBaseDetail.saveLogLevel(e)},getSaveData:function(){this.$refs.ServiceBaseDetail.getSaveData()},setSaveData:function(){this.$refs.ServiceBaseDetail.setSaveData()},handleOk:function(){},pjsChange:function(e){this.pjsConfig=e},getDefaultPjsConfig:function(){var e=this;fetch("pipy-4lb.js").then((function(e){return e.text()})).then((function(t){e.pjsConfig=t})).catch((function(e){}))}}};var Z=(0,w.Z)(I,[["render",function(e,t,i,r,c,l){var o=(0,n.up)("a-button"),u=((0,n.up)("a-divider"),(0,n.up)("RingStatus"),(0,n.up)("MiniArea")),d=(0,n.up)("a-card"),p=(0,n.up)("a-col"),v=(0,n.up)("ServiceOverview"),m=(0,n.up)("a-tab-pane"),h=(0,n.up)("PodList"),f=(0,n.up)("CheckpointList"),g=(0,n.up)("HealthcheckList"),b=(0,n.up)("a-row"),w=(0,n.up)("PluginConfig"),k=(0,n.up)("ServiceACL"),S=(0,n.up)("JsEditor"),y=(0,n.up)("Json2YamlCard"),x=(0,n.up)("ServiceExportCard"),_=(0,n.up)("ServiceList"),$=(0,n.up)("LogViewer"),C=(0,n.up)("EmbedDashboard"),W=(0,n.up)("a-tabs"),D=(0,n.up)("ServiceBaseDetail"),A=(0,n.up)("PluginList"),E=(0,n.up)("a-modal"),P=(0,n.Q2)("permission");return(0,n.wg)(),(0,n.iD)(n.HY,null,[(0,n.Wm)(D,{loading:c.loading,"onUpdate:loading":t[10]||(t[10]=function(e){return c.loading=e}),namespace:c.namespace,"onUpdate:namespace":t[11]||(t[11]=function(e){return c.namespace=e}),pid:c.pid,"onUpdate:pid":t[12]||(t[12]=function(e){return c.pid=e}),contentString:c.contentString,"onUpdate:contentString":t[13]||(t[13]=function(e){return c.contentString=e}),detail:c.detail,"onUpdate:detail":t[14]||(t[14]=function(e){return c.detail=e}),registry:c.registry,"onUpdate:registry":t[15]||(t[15]=function(e){return c.registry=e}),ns:c.ns,"onUpdate:ns":t[16]||(t[16]=function(e){return c.ns=e}),pods:c.pods,"onUpdate:pods":t[17]||(t[17]=function(e){return c.pods=e}),extend:c.extend,"onUpdate:extend":t[18]||(t[18]=function(e){return c.extend=e}),hasExport:c.isExportEdit,"onUpdate:hasExport":t[19]||(t[19]=function(e){return c.isExportEdit=e}),blacklistServices:c.blacklistServices,"onUpdate:blacklistServices":t[20]||(t[20]=function(e){return c.blacklistServices=e}),whitelistServices:c.whitelistServices,"onUpdate:whitelistServices":t[21]||(t[21]=function(e){return c.whitelistServices=e}),subscribeServices:c.subscribeServices,"onUpdate:subscribeServices":t[22]||(t[22]=function(e){return c.subscribeServices=e}),subscribeServicesTo:c.subscribeServicesTo,"onUpdate:subscribeServicesTo":t[23]||(t[23]=function(e){return c.subscribeServicesTo=e}),subscribeServicesAll:c.subscribeServicesAll,"onUpdate:subscribeServicesAll":t[24]||(t[24]=function(e){return c.subscribeServicesAll=e}),ref:"ServiceBaseDetail"},(0,n.Nv)({action:(0,n.w5)((function(){return[c.isExportEdit?(0,n.kq)("",!0):(0,n.wy)(((0,n.wg)(),(0,n.j4)(o,{key:0,loading:c.exportLoading,type:"primary",onClick:l.exportOpen},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,a.zw)(e.$t("Export")),1)]})),_:1},8,["loading","onClick"])),[[P,["service:update"]]])]})),tabs:(0,n.w5)((function(){return[(0,n.Wm)(W,{type:"card",activeKey:c.activeKey,"onUpdate:activeKey":t[9]||(t[9]=function(e){return c.activeKey=e})},{rightExtra:(0,n.w5)((function(){return[(0,n.wy)(((0,n.wg)(),(0,n.j4)(o,{type:"primary",onClick:l.showPluginBox},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,a.zw)(e.$t("Add Plugin")),1)]})),_:1},8,["onClick"])),[[P,["service:update"]],[s.F8,"7"==c.activeKey&&c.extend.plugins.length>0]])]})),default:(0,n.w5)((function(){return[(0,n.Wm)(m,{key:"1",tab:e.$t("Overview")},{default:(0,n.w5)((function(){return[(0,n.Wm)(v,{pid:c.pid,detail:c.detail,"onUpdate:detail":t[0]||(t[0]=function(e){return c.detail=e}),registry:c.registry},{right:(0,n.w5)((function(){return[""!=c.pid?((0,n.wg)(),(0,n.j4)(p,{key:0,class:"col-pd",xl:8,lg:24,md:24,sm:24,xs:24},{default:(0,n.w5)((function(){return[(0,n.Wm)(d,{title:e.$t("Healthy Status"),class:"card nopd",bordered:!1,loading:c.loading},{default:(0,n.w5)((function(){return[c.healthcheckData.healthchecks_timer&&c.healthcheckData.healthchecks_timer.length>0?((0,n.wg)(),(0,n.j4)(u,{key:0,colors:["#8bd4a1","#fb9690"],height:240,padding:[0,0,0,0],axis:!1,unit:e.$t("unitge"),showy:!1,dv:c.healthcheckData.healthchecks_timer},null,8,["unit","dv"])):((0,n.wg)(),(0,n.j4)(u,{key:1,colors:["#8bd4a1","#fb9690"],height:240,padding:[0,0,0,0],axis:!1,unit:e.$t("unitge"),showy:!1,dv:[{type:"-",date:(new Date).toLocaleDateString(),value:0}]},null,8,["unit","dv"]))]})),_:1},8,["title","loading"])]})),_:1})):(0,n.kq)("",!0)]})),_:1},8,["pid","detail","registry"])]})),_:1},8,["tab"]),""!=c.pid&&"k8s"==c.registry.type?((0,n.wg)(),(0,n.j4)(m,{key:"3",tab:e.$t("Pods")},{default:(0,n.w5)((function(){return[(0,n.Wm)(d,{class:"card nopd",bordered:!1,loading:c.loading},{default:(0,n.w5)((function(){return[(0,n.Wm)(h,{namespace:c.namespace,"has-search":!1,d:c.pods},null,8,["namespace","d"])]})),_:1},8,["loading"])]})),_:1},8,["tab"])):(0,n.kq)("",!0),""!=c.pid&&e.$isPro&&"k8s"==c.registry.type?((0,n.wg)(),(0,n.j4)(m,{key:"5",tab:e.$t("Healthcheck")},{default:(0,n.w5)((function(){return[(0,n.Wm)(b,{class:"row-mg"},{default:(0,n.w5)((function(){return[(0,n.Wm)(p,{class:"col-pd",xl:14,lg:24,md:24,sm:24,xs:24},{default:(0,n.w5)((function(){return[(0,n.Wm)(f,{"mode-type":"service","mode-id":c.pid,"mode-name":c.detail.metadata.name,onGetDialTestings:l.getDialTestings},null,8,["mode-id","mode-name","onGetDialTestings"])]})),_:1}),(0,n.Wm)(p,{class:"col-pd",xl:10,lg:24,md:24,sm:24,xs:24},{default:(0,n.w5)((function(){return[(0,n.Wm)(g,{"mode-name":c.detail.metadata.name,"mode-type":"service","mode-id":c.pid,"dial-testings":c.dialTestings},null,8,["mode-name","mode-id","dial-testings"])]})),_:1})]})),_:1})]})),_:1},8,["tab"])):(0,n.kq)("",!0),e.$isPro?((0,n.wg)(),(0,n.j4)(m,{key:"7",tab:e.$t("Identity")},{default:(0,n.w5)((function(){return[(0,n.Wm)(b,{class:"row-mg"},{default:(0,n.w5)((function(){return[(0,n.Wm)(p,{class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,n.w5)((function(){return[(0,n.Wm)(w,{plugins:c.extend.plugins,"onUpdate:plugins":t[1]||(t[1]=function(e){return c.extend.plugins=e}),onAdd:l.showPluginBox,type:"service","add-text":e.$t("Add Plugin")},null,8,["plugins","onAdd","add-text"])]})),_:1})]})),_:1})]})),_:1},8,["tab"])):(0,n.kq)("",!0),e.$isPro?((0,n.wg)(),(0,n.j4)(m,{key:"8",tab:e.$t("ACL")},{default:(0,n.w5)((function(){return[(0,n.Wm)(k,{detail:c.detail,blacklistServices:c.blacklistServices,"onUpdate:blacklistServices":t[2]||(t[2]=function(e){return c.blacklistServices=e}),whitelistServices:c.whitelistServices,"onUpdate:whitelistServices":t[3]||(t[3]=function(e){return c.whitelistServices=e}),subscribeServices:c.subscribeServices,"onUpdate:subscribeServices":t[4]||(t[4]=function(e){return c.subscribeServices=e}),subscribeServicesAll:c.subscribeServicesAll,"onUpdate:subscribeServicesAll":t[5]||(t[5]=function(e){return c.subscribeServicesAll=e})},null,8,["detail","blacklistServices","whitelistServices","subscribeServices","subscribeServicesAll"])]})),_:1},8,["tab"])):(0,n.kq)("",!0),e.$isPro&&"k8s"==c.registry.type?((0,n.wg)(),(0,n.j4)(m,{key:"10",tab:e.$t("PJS")},{default:(0,n.w5)((function(){return[(0,n.Wm)(d,{class:"card mb-24",bordered:!1},(0,n.Nv)({extra:(0,n.w5)((function(){return[(0,n.Wm)(o,{type:"primary",onClick:e.excute},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,a.zw)(e.$t("save")),1)]})),_:1},8,["onClick"])]})),default:(0,n.w5)((function(){return[(0,n.Wm)(S,{value:c.pjsConfig,onInput:l.pjsChange},null,8,["value","onInput"])]})),_:2},[void 0]),1024)]})),_:1},8,["tab"])):(0,n.kq)("",!0),"k8s"==c.registry.type?((0,n.wg)(),(0,n.j4)(m,{key:"11",tab:e.$t("config"),onClick:l.getSaveData},{default:(0,n.w5)((function(){return[(0,n.Wm)(y,{class:"card full nopd","is-readonly":!1,"is-create":!1,jsonVal:c.contentString,"onUpdate:jsonVal":t[6]||(t[6]=function(e){return c.contentString=e}),onChange:l.setSaveData},null,8,["jsonVal","onChange"])]})),_:1},8,["tab","onClick"])):(0,n.kq)("",!0),c.pid&&"k8s"==c.registry.type?((0,n.wg)(),(0,n.j4)(m,{key:"15",tab:e.$t("MCS")},{default:(0,n.w5)((function(){var e,i;return[(0,n.Wm)(x,{sid:c.pid,ports:null===(e=c.detail)||void 0===e||null===(i=e.spec)||void 0===i?void 0:i.ports,loading:c.loading,isEdit:c.isExportEdit,"onUpdate:isEdit":t[7]||(t[7]=function(e){return c.isExportEdit=e}),modal:c.modalVisible,"onUpdate:modal":t[8]||(t[8]=function(e){return c.modalVisible=e}),onStart:l.exportStart,onSave:l.exportSave},null,8,["sid","ports","loading","isEdit","modal","onStart","onSave"])]})),_:1},8,["tab"])):(0,n.kq)("",!0),e.$isPro?((0,n.wg)(),(0,n.j4)(m,{key:"12",tab:e.$t("Subscribe Service")},{default:(0,n.w5)((function(){return[(0,n.Wm)(_,{mode:"Subscribe Service",title:e.$t("Subscribe Service"),"destroy-inactive-tab-pane":!0,metric:!1,"has-search":!1,"embed-services":c.subscribeServicesTo,embed:!0},null,8,["title","embed-services"])]})),_:1},8,["tab"])):(0,n.kq)("",!0),""!=c.pid?((0,n.wg)(),(0,n.j4)(m,{key:"13",tab:e.$t("log")},{default:(0,n.w5)((function(){var e,t,i;return[(0,n.Wm)($,{uid:c.pid,params:{name:null===(e=c.detail.metadata)||void 0===e?void 0:e.name,namespace:null===(t=c.detail.metadata)||void 0===t?void 0:t.namespace,domain:null===(i=c.registry.content)||void 0===i?void 0:i.domain},type:"service","log-level":c.extend.log.level,onSave:l.saveLogLevel},null,8,["uid","params","log-level","onSave"])]})),_:1},8,["tab"])):(0,n.kq)("",!0),""!=c.pid&&"k8s"==c.registry.type?((0,n.wg)(),(0,n.j4)(m,{key:"14",tab:e.$t("Dashboard")},{default:(0,n.w5)((function(){var e,t,i,a;return[(0,n.Wm)(C,{"page-id":c.pid,params:{name:null===(e=c.detail.metadata)||void 0===e?void 0:e.name,namespace:null===(t=c.ns)||void 0===t?void 0:t.name,namespaceId:null===(i=c.ns)||void 0===i?void 0:i.id,domain:null===(a=c.registry.content)||void 0===a?void 0:a.domain},apply:"service","default-widget":c.DEFAULT_SERVICE_DETAIL,"hide-add":"14"!=c.activeKey},null,8,["page-id","params","default-widget","hide-add"])]})),_:1},8,["tab"])):(0,n.kq)("",!0)]})),_:1},8,["activeKey"])]})),_:2},[void 0]),1032,["loading","namespace","pid","contentString","detail","registry","ns","pods","extend","hasExport","blacklistServices","whitelistServices","subscribeServices","subscribeServicesTo","subscribeServicesAll"]),(0,n.Wm)(E,{footer:null,width:"80%",visible:c.visibleAP,"onUpdate:visible":t[25]||(t[25]=function(e){return c.visibleAP=e}),title:e.$t("Add Plugin"),onOk:l.handleOk},{default:(0,n.w5)((function(){return[(0,n.Wm)(A,{apply:"service",onSelectPlugin:l.selectPlugin,"hide-head":!0},null,8,["onSelectPlugin"])]})),_:1},8,["visible","title","onOk"])],64)}],["__scopeId","data-v-4ed08602"]])}}]);