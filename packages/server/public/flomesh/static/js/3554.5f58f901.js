"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[3554],{74353:function(e,t,a){a.d(t,{Z:function(){return c}});var n=a(66252),i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884zm288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z"}}]},name:"stop",theme:"outlined"},s=a(33058);function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?Object(arguments[t]):{},n=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable})))),n.forEach((function(t){l(e,t,a[t])}))}return e}function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var o=function(e,t){var a=r({},e,t.attrs);return(0,n.Wm)(s.Z,r({},a,{icon:i}),null)};o.displayName="StopOutlined",o.inheritAttrs=!1;var c=o},16822:function(e,t,a){a.d(t,{Z:function(){return m}});var n=a(66252);const i={class:"statusIcon"},s={href:"javascript:void(0)"},r={key:5,class:"icon svg","aria-hidden":"true"},l=["xlink:href"];var o=a(74353),c=a(50320),d=a(70001),u=a(58721),p=a(13868),h={name:"Status",components:{StopOutlined:o.Z,LoadingOutlined:c.Z,CheckCircleFilled:d.Z,CloseCircleFilled:u.Z,WarningFilled:p.Z},props:["d"],i18n:a(89234),data(){return{iconStatus:{running:"success",pending:"pending",success:"success",stop:"stop",failed:"error",Normal:"success",Pending:"pending",Succeeded:"success",Success:"success",Completed:"success",Complete:"success",Running:"success",Warning:"warning",ImagePullBackOff:"error",ErrImagePull:"error","Init: CrashLoopBackOff":"error","Init:Error":"error","Error: ErrImagePull":"error","Back-off restarting failed container":"error"}}},computed:{status(){return this.iconStatus[this.d?this.d.status||(this.d[0]?this.d[0].status:null):"Success"]}}};var m=(0,a(83744).Z)(h,[["render",function(e,t,a,o,c,d){const u=(0,n.up)("LoadingOutlined"),p=(0,n.up)("StopOutlined"),h=(0,n.up)("CloseCircleFilled"),m=(0,n.up)("CheckCircleFilled"),g=(0,n.up)("WarningFilled"),y=(0,n.up)("a-tooltip");return(0,n.wg)(),(0,n.iD)("div",i,[(0,n.Wm)(y,{placement:"topLeft",title:a.d?a.d.message||a.d[0]&&a.d[0].message:""},{default:(0,n.w5)((()=>[(0,n._)("a",s,["pending"==d.status?((0,n.wg)(),(0,n.j4)(u,{key:0,class:"font-18 font-primary svg"})):"stop"==d.status?((0,n.wg)(),(0,n.j4)(p,{key:1,class:"danger font-18 svg"})):"error"==d.status?((0,n.wg)(),(0,n.j4)(h,{key:2,class:"danger font-18 svg"})):"success"==d.status?((0,n.wg)(),(0,n.j4)(m,{key:3,class:"font-18 success svg"})):"warning"==d.status?((0,n.wg)(),(0,n.j4)(g,{key:4,class:"font-18 svg warning"})):((0,n.wg)(),(0,n.iD)("svg",r,[(0,n._)("use",{"xlink:href":d.status},null,8,l)]))])])),_:1},8,["title"])])}],["__scopeId","data-v-5c100524"]])},21002:function(e,t,a){a.d(t,{Z:function(){return s}});var n=a(66252);var i={name:"SyncBar",components:{SyncOutlined:a(21826).Z},props:["percent"],methods:{sync(){this.$emit("sync")}}};var s=(0,a(83744).Z)(i,[["render",function(e,t,a,i,s,r){const l=(0,n.up)("a-progress"),o=(0,n.up)("SyncOutlined"),c=(0,n.up)("a-button");return(0,n.wg)(),(0,n.iD)(n.HY,null,[a.percent>-1?((0,n.wg)(),(0,n.j4)(l,{key:0,size:"small",class:"title-progress","stroke-color":{"0%":"#00adef","100%":"#87d068"},percent:a.percent},null,8,["percent"])):(0,n.kq)("",!0),-1==a.percent?((0,n.wg)(),(0,n.j4)(c,{key:1,type:"link",shape:"circle",onClick:r.sync},{icon:(0,n.w5)((()=>[(0,n.Wm)(o,{class:"font-20 icon-menu-sm rotate-icon"})])),_:1},8,["onClick"])):(0,n.kq)("",!0),a.percent>-1&&a.percent<100?((0,n.wg)(),(0,n.j4)(c,{key:2,type:"link",shape:"circle"},{icon:(0,n.w5)((()=>[a.percent>-1&&a.percent<100?((0,n.wg)(),(0,n.j4)(o,{key:0,spin:"",class:"font-12"})):(0,n.kq)("",!0)])),_:1})):(0,n.kq)("",!0)],64)}],["__scopeId","data-v-6a8f29bb"]])},13554:function(e,t,a){a.d(t,{Z:function(){return q}});var n=a(66252),i=a(3577);const s={key:0},r={style:{padding:"8px"}},l={key:2},o={key:4},c=["onClick"],d={key:2},u={key:0},p={key:1},h={key:0},m={key:1},g={key:9},y=["innerHTML"],k={key:10},w=["innerHTML"],v={key:0},b={class:"ml-15"},f={key:1},S=["onClick"],x={key:1};a(57658);var C=a(49506),I=a(2692),z=a(47586),$=a(74353),_=a(99684),E=a(60459),j=a(21002),O=a(16822);const D=[{key:"Enabled",dataIndex:"enabled"},{key:"Service",dataIndex:"name",customFilterDropdown:!0,onFilter:(e,t)=>t.name.toString().toLowerCase().includes(e.toLowerCase()),onFilterDropdownVisibleChange:e=>{e&&setTimeout((()=>{(void 0).$refs.searchInput.focus()}),100)}},{key:"Namespace",dataIndex:"namespace"},{key:"Gateway path",dataIndex:"gatewayPath"},{key:"Organization",width:130,dataIndex:"organizationName"}],L=[{key:"as",dataIndex:"name"},{key:"Organization",width:330,dataIndex:"organizationName"},{key:"Namespace",dataIndex:"namespace"}],W=[{key:"as",dataIndex:"name"},{key:"Namespace",dataIndex:"namespace"},{key:"Labels",width:280,dataIndex:"labels"}],P=[{key:" ",dataIndex:"t"},{key:"as",dataIndex:"name"},{key:"Namespace",dataIndex:"namespace"},{key:"Organization",width:130,dataIndex:"organizationName"},{key:"Labels",width:280,dataIndex:"labels"},{key:"Export",dataIndex:"serviceExport"},{key:"Imports",dataIndex:"serviceImports"},{key:"updTime",dataIndex:"creationTimestamp"},{key:"Action",width:130,dataIndex:"action"}];var T={name:"ServiceList",components:{SearchOutlined:C.Z,MoreOutlined:I.Z,CheckCircleOutlined:z.Z,StopOutlined:$.Z,SyncBar:j.Z,PlusCircleTwoTone:_.Z,EnvSelector:E.Z,Status:O.Z},props:["title","selector","namespace","hasSearch","namespaces","mode","embedServices","embed","whitelistServices","blacklistServices","tabList","tabKey"],i18n:a(89234),data(){return{key:"",syncLoading:-1,pageNo:1,pageSize:10,total:0,columns:P,regcolumns:D,short2columns:L,short3columns:W,loading:!0,searchText:"",searchedColumn:"",list:[]}},computed:{embedList(){return this.reset(this.embedServices?.filter((e=>e.name.indexOf(this.key)>-1)))},start(){return(this.pageNo-1)*this.pageSize},dataColumns(){return"Subscribe Service"==this.mode?this.short2columns.map((e=>(e.title=this.$t(e.key),e))):"mesh"==this.mode?this.short3columns.filter((e=>"Organization"!=e.key||this.$isPro)).map((e=>(e.title=this.$t(e.key),e))):"registry"==this.mode?this.regcolumns.filter((e=>"Organization"!=e.key&&"Gateway path"!=e.key&&"Action"!=e.key||this.$isPro)).map((e=>(e.title=this.$t(e.key),e))):"ACL"==this.mode?this.columns.filter((e=>"Labels"!=e.key&&"Export"!=e.key&&"Imports"!=e.key)).map((e=>(e.title=this.$t(e.key),e))):this.columns.filter((e=>"Organization"!=e.key||this.$isPro)).map((e=>(e.title=this.$t(e.key),e)))}},watch:{namespaces:{handler:function(){this.search()},deep:!0},embedServices:{handler:function(){this.search()},deep:!0}},created(){this.embed&&this.embedServices?this.loading=!1:this.search()},methods:{handleSearch(e,t,a){t(),this.searchText=e[0],this.searchedColumn=a},handleReset(e){e({confirm:!0}),this.searchText=""},enabledChange(e){this.$emit("enabledChange",e)},onTabChange(e){this.$emit("update:tabKey",e),this.$emit("nsChange",e)},remove(e){this.$gql.mutation(`deleteServiceSync(id:${e}){data{id}}`).then((()=>{this.$message.success(this.$t("Deleted successfully"),3),this.search()}))},detail(e,t){this.$router.push({path:`/fsm/service/detail/${t||"default"}/${e}`})},sync(e){e&&(this.syncLoading=0,this.$gql.mutation("fetchServices").then((()=>{this.syncLoading=100,this.search(),setTimeout((()=>{this.syncLoading=-1}),1e3)}))),this.syncLoading<90&&(this.syncLoading+=10,setTimeout((()=>{this.sync()}),100))},newItem(){this.$router.push({path:"/fsm/service/create"})},search(e,t){if(e&&(this.pageNo=e,this.pageSize=t),this.loading=!0,this.embed&&this.embedServices)this.list=this.reset(this.embedServices),this.loading=!1;else{let e={start:this.start,limit:this.pageSize},t={name:{contains:this.key},deleted:{eq:!1}},a=[];if(this.namespaces&&this.namespaces.length>0)this.namespaces.forEach((e=>{a.push(e.id)})),t.ns={id:{in:a}};else if(this.namespaces&&0==this.namespaces.length)return this.list=[],this.total=0,void(this.loading=!1);this.namespace&&(t.namespace={eq:this.namespace}),this.selector&&(t.selector={eq:this.selector});let n="getServices";"mesh"==this.mode&&(n="services"),this.$gql.query(`${n}(filters: $filters, pagination: $pagination){\n\t\t\t\t\t\t\tdata{id,attributes{\n\t\t\t\t\t\t\t\tuid,\n\t\t\t\t\t\t\t\tserviceExport{data{id,attributes{\n\t\t\t\t\t\t\t\t\tcontent,\n\t\t\t\t\t\t\t\t\tserviceImports{data{id,attributes{\n\t\t\t\t\t\t\t\t\t\tregistry{data{id,attributes{name}}},\n\t\t\t\t\t\t\t\t\t\tnamespace\n\t\t\t\t\t\t\t\t\t}}}\n\t\t\t\t\t\t\t\t}}},\n\t\t\t\t\t\t\t\tfleet{data{id,attributes{name}}},\n\t\t\t\t\t\t\t\torganization{data{id,attributes{name}}},\n\t\t\t\t\t\t\t\tnamespace,\n\t\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\t\tregistry{data{id,attributes{name, type}}},\n\t\t\t\t\t\t\t\tcontent,\n\t\t\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t\t\t}},\n\t\t\t\t\t\t\tmeta{pagination{total}}\n\t\t\t\t\t\t}`,{filters:t,pagination:e},{filters:"ServiceFiltersInput",pagination:"PaginationArg"}).then((e=>{this.list=this.reset(e.data),this.total=e.pagination.total,this.loading=!1}))}},reset(e){if(!e)return[];for(let t=0;t<e.length;t++){let a=e[t].content;e[t].uid=a.metadata.uid,e[t].name=a.metadata.name,e[t].organizationName=e[t].organization?e[t].organization.name:"-",e[t].registryName=e[t].registry?e[t].registry.name:"-",e[t].namespace=a.metadata.namespace||"default",e[t].labels=a.metadata.labels,e[t].internalEndpointStr=this.contactInternalEndpoint(a.internalEndpoint?a.internalEndpoint:{ports:[]}),e[t].externalEndpointStr=this.contactExternalEndpoint(a.externalEndpoints?a.externalEndpoints:[]),e[t].creationTimestamp=new Date(e[t].updatedAt).toLocaleString(),e[t].t="Success"}return e},contactInternalEndpoint(e){let t="";for(let a=0;a<e.ports.length;a++)t+=e.host+":"+e.ports[a].port+" "+e.ports[a].protocol+"<br/>"+e.host+":"+e.ports[a].nodePort+" "+e.ports[a].protocol+"<br/>";return t},contactExternalEndpoint(e){let t="";for(let a=0;a<e.length;a++){e[a].ports=e[a].ports?e[a].ports:[];for(let n=0;n<e[a].ports.length;n++)t+=e[a].host+":"+e[a].ports[n].port+" "+e[a].ports[n].protocol+"<br/>"}return t},addWhitelist(e){this.whitelistServices.some(((t,a)=>{e.id===t.id&&this.whitelistServices.splice(a,1)})),this.blacklistServices.some(((t,a)=>{e.id===t.id&&this.blacklistServices.splice(a,1)})),this.embedServices.some(((t,a)=>{e.id===t.id&&this.embedServices.splice(a,1)})),this.whitelistServices.push(e)},addBlacklist(e){this.whitelistServices.some(((t,a)=>{e.id===t.id&&this.whitelistServices.splice(a,1)})),this.blacklistServices.some(((t,a)=>{e.id===t.id&&this.blacklistServices.splice(a,1)})),this.embedServices.some(((t,a)=>{e.id===t.id&&this.embedServices.splice(a,1)})),this.blacklistServices.push(e)},updateGatewayPath(e){this.$gql.mutation(`updateService(id:${e.id}, data: $data){data{id}}`,{data:{gatewayPath:e.gatewayPath}},{data:"ServiceInput!"}).then((()=>{}))}}};var q=(0,a(83744).Z)(T,[["render",function(e,t,a,C,I,z){const $=(0,n.up)("a-badge"),_=(0,n.up)("a-input-search"),E=(0,n.up)("a-divider"),j=(0,n.up)("PlusCircleTwoTone"),O=(0,n.up)("a-button"),D=(0,n.up)("SyncBar"),L=(0,n.up)("EnvSelector"),W=(0,n.up)("a-input"),P=(0,n.up)("SearchOutlined"),T=(0,n.up)("a-checkbox"),q=(0,n.up)("Status"),N=(0,n.up)("a-tag"),Z=(0,n.up)("CheckCircleOutlined"),U=(0,n.up)("a-tooltip"),F=(0,n.up)("StopOutlined"),H=(0,n.up)("a-menu-item"),B=(0,n.up)("a-popconfirm"),A=(0,n.up)("a-menu"),Y=(0,n.up)("MoreOutlined"),K=(0,n.up)("a-dropdown"),M=(0,n.up)("a-table"),G=(0,n.up)("a-card"),R=(0,n.Q2)("permission");return(0,n.wg)(),(0,n.j4)(G,{class:"card nopd","tab-list":a.tabList,"active-tab-key":a.tabKey,onTabChange:z.onTabChange,loading:I.loading},(0,n.Nv)({customTab:(0,n.w5)((e=>[(0,n.Uk)((0,i.zw)(e.tab)+" ",1),e.services>0?((0,n.wg)(),(0,n.j4)($,{key:0,class:"ml-10",count:e.services,"number-style":{backgroundColor:"#00adef"}},null,8,["count"])):(0,n.kq)("",!0)])),extra:(0,n.w5)((()=>[a.hasSearch?((0,n.wg)(),(0,n.iD)("div",s,[(0,n.Wm)(_,{value:I.key,"onUpdate:value":t[0]||(t[0]=e=>I.key=e),onSearch:t[1]||(t[1]=e=>z.search()),class:"right-search-input",placeholder:e.$t("search")},null,8,["value","placeholder"]),a.embed?(0,n.kq)("",!0):(0,n.wy)(((0,n.wg)(),(0,n.j4)(E,{key:0,type:"vertical"},null,512)),[[R,["service:create"]]]),a.embed?(0,n.kq)("",!0):(0,n.wy)(((0,n.wg)(),(0,n.j4)(O,{key:1,type:"link",shape:"circle",onClick:z.newItem},{icon:(0,n.w5)((()=>[(0,n.Wm)(j,{class:"font-20 icon-menu-sm rotate-icon"})])),_:1},8,["onClick"])),[[R,["service:create"]]]),a.embed?(0,n.kq)("",!0):(0,n.wy)(((0,n.wg)(),(0,n.j4)(E,{key:2,type:"vertical"},null,512)),[[R,["service:create"]]]),a.embed?(0,n.kq)("",!0):(0,n.wy)(((0,n.wg)(),(0,n.j4)(D,{key:3,percent:I.syncLoading,onSync:t[2]||(t[2]=e=>z.sync(!0))},null,8,["percent"])),[[R,["service:create"]]]),a.embed?(0,n.kq)("",!0):((0,n.wg)(),(0,n.j4)(E,{key:4,type:"vertical"})),a.embed?(0,n.kq)("",!0):((0,n.wg)(),(0,n.j4)(L,{key:5}))])):(0,n.kq)("",!0)])),default:(0,n.w5)((()=>[(0,n._)("div",null,[(0,n.Wm)(M,{"row-key":e=>e.id,pagination:a.embed&&a.embedServices?null:{showSizeChanger:!1,showQuickJumper:!1,onShowSizeChange:z.search,onChange:z.search,current:I.pageNo,pageSize:I.pageSize,showTotal:(t,a)=>`${e.$t("Total")} ${t}`,total:I.total},columns:z.dataColumns,"data-source":a.embed&&null!=a.embedServices?z.embedList:I.list,class:"bg-white"},{customFilterDropdown:(0,n.w5)((({setSelectedKeys:t,selectedKeys:a,confirm:s,clearFilters:l,column:o})=>[(0,n._)("div",r,[(0,n.Wm)(W,{ref:"searchInput",placeholder:e.$t("search"),value:a[0],style:{width:"188px","margin-bottom":"8px",display:"block"},onChange:e=>t(e.target.value?[e.target.value]:[]),onPressEnter:e=>z.handleSearch(a,s,o.dataIndex)},null,8,["placeholder","value","onChange","onPressEnter"]),(0,n.Wm)(O,{type:"primary",size:"small",style:{width:"90px","margin-right":"8px"},onClick:e=>z.handleSearch(a,s,o.dataIndex)},{icon:(0,n.w5)((()=>[(0,n.Wm)(P)])),default:(0,n.w5)((()=>[(0,n.Uk)(" "+(0,i.zw)(e.$t("search")),1)])),_:2},1032,["onClick"]),(0,n.Wm)(O,{size:"small",style:{width:"90px"},onClick:e=>z.handleReset(l)},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(e.$t("Reset")),1)])),_:2},1032,["onClick"])])])),customFilterIcon:(0,n.w5)((({filtered:e})=>[(0,n.Wm)(P,{style:(0,i.j5)({color:e?"#108ee9":void 0})},null,8,["style"])])),bodyCell:(0,n.w5)((({column:t,record:s})=>["enabled"===t.dataIndex?((0,n.wg)(),(0,n.j4)(T,{key:0,checked:s.enabled,"onUpdate:checked":e=>s.enabled=e,onChange:e=>z.enabledChange(s)},null,8,["checked","onUpdate:checked","onChange"])):"t"===t.dataIndex?((0,n.wg)(),(0,n.j4)(q,{key:1,d:{status:s.t}},null,8,["d"])):"gatewayPath"===t.dataIndex?((0,n.wg)(),(0,n.iD)("div",l,[(0,n.Wm)(W,{placeholder:e.$t("unset"),value:s.gatewayPath,"onUpdate:value":e=>s.gatewayPath=e,class:"width-200",onBlur:e=>z.updateGatewayPath(s)},null,8,["placeholder","value","onUpdate:value","onBlur"])])):"namespace"===t.dataIndex?((0,n.wg)(),(0,n.iD)(n.HY,{key:3},[(0,n.Uk)((0,i.zw)(s.registryName)+" / "+(0,i.zw)(s.namespace),1)],64)):"name"===t.dataIndex?((0,n.wg)(),(0,n.iD)("div",o,[(0,n._)("a",{href:"javascript:void(0)",onClick:e=>z.detail(s.id,s.namespace)},(0,i.zw)(s.name),9,c)])):"organizationName"===t.dataIndex?((0,n.wg)(),(0,n.iD)(n.HY,{key:5},["registry"==a.mode?(0,n.WI)(e.$slots,"organization",{key:0,item:s},void 0,!0):s.organizationName&&"-"!=s.organizationName?((0,n.wg)(),(0,n.j4)(N,{key:1},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(s.organizationName),1)])),_:2},1024)):((0,n.wg)(),(0,n.iD)("span",d,"-"))],64)):"labels"===t.dataIndex?((0,n.wg)(),(0,n.iD)(n.HY,{key:6},[s.labels?((0,n.wg)(),(0,n.iD)("div",u,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(Object.keys(s.labels),((e,t)=>((0,n.wg)(),(0,n.j4)(N,{key:t,closable:!1},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(e)+":"+(0,i.zw)(s.labels[e]),1)])),_:2},1024)))),128))])):(0,n.kq)("",!0)],64)):"serviceExport"===t.dataIndex?((0,n.wg)(),(0,n.iD)(n.HY,{key:7},[s.serviceExport&&s.serviceExport.content?((0,n.wg)(),(0,n.j4)(N,{key:0},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(s.serviceExport.content.path)+" | "+(0,i.zw)(s.serviceExport.content.portNumber),1)])),_:2},1024)):((0,n.wg)(),(0,n.iD)("span",p,"-"))],64)):"serviceImports"===t.dataIndex?((0,n.wg)(),(0,n.iD)(n.HY,{key:8},[s.serviceExport&&s.serviceExport.serviceImports?((0,n.wg)(),(0,n.iD)("div",h,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(s.serviceExport.serviceImports,((e,t)=>((0,n.wg)(),(0,n.j4)(N,{key:t,closable:!1},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(e?.registry?.name)+" / "+(0,i.zw)(e?.namespace),1)])),_:2},1024)))),128))])):((0,n.wg)(),(0,n.iD)("span",m,"-"))],64)):"internalEndpointStr"===t.dataIndex?((0,n.wg)(),(0,n.iD)("div",g,[(0,n._)("div",{innerHTML:s.internalEndpointStr},null,8,y)])):"externalEndpointStr"===t.dataIndex?((0,n.wg)(),(0,n.iD)("div",k,[(0,n._)("div",{innerHTML:s.externalEndpointStr},null,8,w)])):"action"===t.dataIndex?((0,n.wg)(),(0,n.iD)(n.HY,{key:11},["ACL"==a.mode?((0,n.wg)(),(0,n.iD)("div",v,[(0,n.Wm)(U,{title:e.$t("Add to the whitelist"),onClick:e=>z.addWhitelist(s)},{default:(0,n.w5)((()=>[(0,n._)("a",null,[(0,n.Wm)(Z,{class:"font-20 success"})])])),_:2},1032,["title","onClick"]),(0,n.Wm)(U,{title:e.$t("Add to the blacklist"),onClick:e=>z.addBlacklist(s)},{default:(0,n.w5)((()=>[(0,n._)("a",b,[(0,n.Wm)(F,{class:"danger font-20"})])])),_:2},1032,["title","onClick"])])):((0,n.wg)(),(0,n.iD)("div",f,[a.embed?((0,n.wg)(),(0,n.iD)("span",x," -")):((0,n.wg)(),(0,n.j4)(K,{key:0},{overlay:(0,n.w5)((()=>[(0,n.Wm)(A,null,{default:(0,n.w5)((()=>[(0,n.Wm)(H,null,{default:(0,n.w5)((()=>[(0,n.wy)(((0,n.wg)(),(0,n.iD)("a",{onClick:e=>z.detail(s.id,s.namespace)},[(0,n.Uk)((0,i.zw)(e.$t("edit")),1)],8,S)),[[R,["service:update"]]])])),_:2},1024),"eureka"!=s?.registry?.type?((0,n.wg)(),(0,n.j4)(H,{key:0},{default:(0,n.w5)((()=>[(0,n.Wm)(B,{placement:"topLeft","ok-text":e.$t("Yes"),"cancel-text":e.$t("No"),onConfirm:e=>z.remove(s.id)},{title:(0,n.w5)((()=>[(0,n._)("p",null,(0,i.zw)(e.$t("Tip")),1),(0,n._)("p",null,(0,i.zw)(e.$t("Are you sure to delete this?")),1)])),default:(0,n.w5)((()=>[(0,n.wy)(((0,n.wg)(),(0,n.iD)("a",null,[(0,n.Uk)((0,i.zw)(e.$t("delete")),1)])),[[R,["service:delete"]]])])),_:2},1032,["ok-text","cancel-text","onConfirm"])])),_:2},1024)):(0,n.kq)("",!0)])),_:2},1024)])),default:(0,n.w5)((()=>[(0,n._)("a",null,[(0,n.Wm)(Y)])])),_:2},1024))]))],64)):(0,n.kq)("",!0)])),_:3},8,["row-key","pagination","columns","data-source"])])])),_:2},["registry"!=a.mode?{name:"title",fn:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(a.title?a.title:e.$t("Services")),1)])),key:"0"}:void 0,a.embed?{name:"tabBarExtraContent",fn:(0,n.w5)((()=>[(0,n.WI)(e.$slots,"extra",{},void 0,!0)])),key:"1"}:void 0]),1032,["tab-list","active-tab-key","onTabChange","loading"])}],["__scopeId","data-v-26920956"]])}}]);