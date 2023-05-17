"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[9373],{74353:function(t,e,a){a.d(e,{Z:function(){return u}});var n=a(66252),i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884zm288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z"}}]},name:"stop",theme:"outlined"},r=a(33058);function o(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?Object(arguments[e]):{},n=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter((function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable})))),n.forEach((function(e){s(t,e,a[e])}))}return t}function s(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var l=function(t,e){var a=o({},t,e.attrs);return(0,n.Wm)(r.Z,o({},a,{icon:i}),null)};l.displayName="StopOutlined",l.inheritAttrs=!1;var u=l},80927:function(t,e,a){a.d(e,{Z:function(){return p}});var n=a(66252),i=a(3577),r={class:"chart-card-header"},o={class:"meta"},s={class:"chart-card-title"},l={class:"chart-card-action"},u={key:0,class:"total"},d={class:"content-fix"},c={key:0,class:"chart-card-footer"};var m={name:"ChartCard",props:["title","hideTotal","loading","notFt","height","padding"]};var p=(0,a(83744).Z)(m,[["render",function(t,e,a,m,p,g){var h=(0,n.up)("a-card");return(0,n.wg)(),(0,n.j4)(h,{loading:a.loading,"body-style":{padding:a.padding?a.padding:"8px 24px 8px"},bordered:!1},{default:(0,n.w5)((function(){return[(0,n._)("div",r,[(0,n._)("div",o,[(0,n._)("span",s,(0,i.zw)(a.title),1),(0,n._)("span",l,[(0,n.WI)(t.$slots,"action",{},void 0,!0)])]),a.hideTotal?(0,n.kq)("",!0):((0,n.wg)(),(0,n.iD)("div",u,[(0,n.WI)(t.$slots,"total",{},void 0,!0)]))]),(0,n._)("div",{class:(0,i.C_)(["chart-card-content",a.hideTotal?"hideTotal":""]),style:(0,i.j5)({height:a.height?a.height:"66px"})},[(0,n._)("div",d,[(0,n.WI)(t.$slots,"default",{},void 0,!0)])],6),a.notFt?(0,n.kq)("",!0):((0,n.wg)(),(0,n.iD)("div",c,[(0,n.WI)(t.$slots,"footer",{},void 0,!0)]))]})),_:3},8,["loading","body-style"])}],["__scopeId","data-v-909bd9a2"]])},36102:function(t,e,a){a.d(e,{Z:function(){return g}});var n=a(66252),i={class:"cpu-body"},r={class:"cpu-body"},o={key:1},s={class:"relative"},l={class:"relative"};a(57658);var u=a(35316),d=a(80927),c=a(48551),m=a(72167),p={name:"CPUMemory",components:{ChartCard:d.Z,MiniArea:c.Z,InfoCircleOutlined:u.Z},i18n:a(89234),props:["metrics","loading","layout"],data:function(){return{cpu:[],memory:[],memortUnit:"Ki",loadingCPU:!1,loadingMemory:!1}},watch:{loading:function(){this.loadingCPU=this.loading,this.loadingMemory=this.loading},metrics:function(t){this.renderData(t)}},mounted:function(){this.renderData(this.metrics),this.loadingCPU=this.loading,this.loadingMemory=this.loading},methods:{renderData:function(t){this.cpu=[],this.memory=[];for(var e=0,a=0;a<t.length;a++)t[a].memory>e&&(e=t[a].memory);this.memortUnit=e>1e6?"Gi":e>1e3?"Mi":"Ki";for(var n={Ki:1,Mi:1e3,Gi:1e6},i=0;i<t.length;i++)this.cpu.push({type:"CPU",value:t[i].cpu/1e9,date:(0,m.Z)(new Date(1e3*t[i].time),"HH:mm")}),this.memory.push({type:"Memory",value:t[i].memory/n[this.memortUnit],date:(0,m.Z)(new Date(1e3*t[i].time),"HH:mm")})}}};var g=(0,a(83744).Z)(p,[["render",function(t,e,a,u,d,c){var m=(0,n.up)("MiniArea"),p=(0,n.up)("a-col"),g=(0,n.up)("a-row"),h=(0,n.up)("InfoCircleOutlined"),f=(0,n.up)("a-tooltip"),v=(0,n.up)("ChartCard");return(0,n.wg)(),(0,n.iD)("div",null,["v"!=a.layout?((0,n.wg)(),(0,n.j4)(g,{key:0,class:"cpu-layout",gutter:[24,0]},{default:(0,n.w5)((function(){return[d.cpu?((0,n.wg)(),(0,n.j4)(p,{key:0,sm:24,md:12,xl:12},{default:(0,n.w5)((function(){return[(0,n._)("div",i,[(0,n.Wm)(m,{colors:["rgba(107,204,255,1)","rgba(127,214,247,0.4)"],height:240,padding:[0,0,0,0],axis:!1,unit:"cores",showy:!1,id:"cpu-area"+Math.ceil(1e3*Math.random()),dv:d.cpu},null,8,["colors","id","dv"])])]})),_:1})):(0,n.kq)("",!0),d.memory?((0,n.wg)(),(0,n.j4)(p,{key:1,sm:24,md:12,xl:12},{default:(0,n.w5)((function(){return[(0,n._)("div",r,[(0,n.Wm)(m,{colors:["rgba(195,158,253,1)","rgba(195,158,253,0.4)"],height:240,padding:[0,0,0,0],unit:d.memortUnit,axis:!1,showy:!1,id:"memory-area"+Math.ceil(1e3*Math.random()),dv:d.memory},null,8,["colors","unit","id","dv"])])]})),_:1})):(0,n.kq)("",!0)]})),_:1})):(0,n.kq)("",!0),"v"==a.layout?((0,n.wg)(),(0,n.iD)("div",o,[d.cpu?((0,n.wg)(),(0,n.j4)(v,{key:0,padding:"20px 24px 28px",height:"120px","not-ft":!0,loading:d.loadingCPU,title:t.$t("CPU Usage"),class:"mb-20"},{default:(0,n.w5)((function(){return[(0,n.Wm)(f,{title:t.$t("introduce")},{action:(0,n.w5)((function(){return[(0,n.Wm)(h)]})),_:1},8,["title"]),(0,n._)("div",s,[(0,n.Wm)(m,{colors:["rgba(107,204,255,1)","rgba(127,214,247,0.4)"],height:230,padding:[55,5,5,15],axis:!0,unit:"cores",id:"cpu-area"+Math.ceil(1e3*Math.random()),dv:d.cpu},null,8,["colors","id","dv"])])]})),_:1},8,["loading","title"])):(0,n.kq)("",!0),d.memory?((0,n.wg)(),(0,n.j4)(v,{key:1,padding:"20px 24px 28px",height:"120px","not-ft":!0,loading:d.loadingMemory,title:t.$t("Memory Usage")},{default:(0,n.w5)((function(){return[(0,n.Wm)(f,{title:t.$t("introduce")},{action:(0,n.w5)((function(){return[(0,n.Wm)(h)]})),_:1},8,["title"]),(0,n._)("div",l,[(0,n.Wm)(m,{colors:["rgba(195,158,253,1)","rgba(195,158,253,0.4)"],height:230,padding:[55,5,5,15],axis:!0,unit:d.memortUnit,id:"memory-area"+Math.ceil(1e3*Math.random()),dv:d.memory},null,8,["colors","unit","id","dv"])])]})),_:1},8,["loading","title"])):(0,n.kq)("",!0)])):(0,n.kq)("",!0)])}],["__scopeId","data-v-ef2e4ec2"]])},16822:function(t,e,a){a.d(e,{Z:function(){return g}});var n=a(66252),i={class:"statusIcon"},r={href:"javascript:void(0)"},o={key:5,class:"icon svg","aria-hidden":"true"},s=["xlink:href"];var l=a(74353),u=a(50320),d=a(70001),c=a(58721),m=a(13868),p={name:"Status",components:{StopOutlined:l.Z,LoadingOutlined:u.Z,CheckCircleFilled:d.Z,CloseCircleFilled:c.Z,WarningFilled:m.Z},props:["d"],i18n:a(89234),data:function(){return{iconStatus:{running:"success",pending:"pending",success:"success",stop:"stop",failed:"error",Normal:"success",Pending:"pending",Succeeded:"success",Success:"success",Completed:"success",Complete:"success",Running:"success",Warning:"warning",ImagePullBackOff:"error",ErrImagePull:"error","Init: CrashLoopBackOff":"error","Init:Error":"error","Error: ErrImagePull":"error","Back-off restarting failed container":"error"}}},computed:{status:function(){return this.iconStatus[this.d?this.d.status||(this.d[0]?this.d[0].status:null):"Success"]}}};var g=(0,a(83744).Z)(p,[["render",function(t,e,a,l,u,d){var c=(0,n.up)("LoadingOutlined"),m=(0,n.up)("StopOutlined"),p=(0,n.up)("CloseCircleFilled"),g=(0,n.up)("CheckCircleFilled"),h=(0,n.up)("WarningFilled"),f=(0,n.up)("a-tooltip");return(0,n.wg)(),(0,n.iD)("div",i,[(0,n.Wm)(f,{placement:"topLeft",title:a.d?a.d.message||a.d[0]&&a.d[0].message:""},{default:(0,n.w5)((function(){return[(0,n._)("a",r,["pending"==d.status?((0,n.wg)(),(0,n.j4)(c,{key:0,class:"font-18 font-primary svg"})):"stop"==d.status?((0,n.wg)(),(0,n.j4)(m,{key:1,class:"danger font-18 svg"})):"error"==d.status?((0,n.wg)(),(0,n.j4)(p,{key:2,class:"danger font-18 svg"})):"success"==d.status?((0,n.wg)(),(0,n.j4)(g,{key:3,class:"font-18 success svg"})):"warning"==d.status?((0,n.wg)(),(0,n.j4)(h,{key:4,class:"font-18 svg warning"})):((0,n.wg)(),(0,n.iD)("svg",o,[(0,n._)("use",{"xlink:href":d.status},null,8,s)]))])]})),_:1},8,["title"])])}],["__scopeId","data-v-5c100524"]])},5966:function(t,e,a){a.d(e,{Z:function(){return s}});var n=a(66252),i=a(3577),r={key:0};var o={name:"PodStatusTags",props:["d"],i18n:a(89234)};var s=(0,a(83744).Z)(o,[["render",function(t,e,a,o,s,l){var u=(0,n.up)("a-badge"),d=(0,n.up)("a-tag");return a.d?((0,n.wg)(),(0,n.iD)("div",r,[null!=a.d.running?((0,n.wg)(),(0,n.j4)(d,{key:0,closable:!1},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,i.zw)(t.$t("Running"))+" ",1),(0,n.Wm)(u,{count:a.d.running,"show-zero":!0},null,8,["count"])]})),_:1})):(0,n.kq)("",!0),null!=a.d.desired?((0,n.wg)(),(0,n.j4)(d,{key:1,closable:!1},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,i.zw)(t.$t("Desired"))+" ",1),(0,n.Wm)(u,{count:a.d.desired,"show-zero":!0},null,8,["count"])]})),_:1})):(0,n.kq)("",!0),null!=a.d.available?((0,n.wg)(),(0,n.j4)(d,{key:2,closable:!1},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,i.zw)(t.$t("Available"))+" ",1),(0,n.Wm)(u,{count:a.d.available,"show-zero":!0},null,8,["count"])]})),_:1})):(0,n.kq)("",!0),null!=a.d.updated?((0,n.wg)(),(0,n.j4)(d,{key:3,closable:!1},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,i.zw)(t.$t("Updated"))+" ",1),(0,n.Wm)(u,{count:a.d.updated,"show-zero":!0},null,8,["count"])]})),_:1})):(0,n.kq)("",!0),null!=a.d.replicas?((0,n.wg)(),(0,n.j4)(d,{key:4,closable:!1},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,i.zw)(t.$t("total"))+": ",1),(0,n.Wm)(u,{count:a.d.replicas,"show-zero":!0},null,8,["count"])]})),_:1})):(0,n.kq)("",!0)])):(0,n.kq)("",!0)}]])},19373:function(t,e,a){a.d(e,{Z:function(){return v}});a(74916),a(64765),a(92222),a(68309),a(47941);var n=a(66252),i=a(3577),r={key:1},o=["onClick"],s={key:2},l={key:5},u=["onClick"];a(21249),a(57658);var d=a(2692),c=a(51461),m=a(36102),p=a(5966),g=a(16822),h=[{key:" ",dataIndex:"t"},{key:"as",dataIndex:"name"},{key:"Namespace",width:130,dataIndex:"namespace"},{key:"Labels",dataIndex:"labels"},{key:"Pods",dataIndex:"pods"},{key:"Container Images",dataIndex:"containerImages"},{key:"Creation Timestamp",dataIndex:"creationTimestamp"},{key:"Action",width:130,dataIndex:"action"}],f={name:"ReplicaSetList",components:{CPUMemory:m.Z,MoreOutlined:d.Z,ImageTags:c.Z,PodStatusTags:p.Z,Status:g.Z},props:["embed","d","title","url","metric","hasSearch","namespace"],i18n:a(89234),data:function(){return{params:{key:"",pageNo:1,pageSize:10,total:0},columns:h,metrics:[],loading:!1,list:[]}},computed:{dataColumns:function(){var t=this;return this.columns.map((function(e){return e.title=t.$t(e.key),e}))}},created:function(){this.embed?(this.list=this.reset(this.d),this.params.total=this.d.length,this.metrics=null,this.loading=!1):this.search()},methods:{detail:function(t,e){this.$router.push({path:"/workload/replicaset/detail/".concat(e,"/").concat(t)})},URL:function(){var t=this.$REST.K8S.append(this.params.pageSize,this.params.pageNo,"d,creationTimestamp",this.params.key);return this.$REST.K8S.encode(this.url,t,this.namespace)},search:function(t,e){var a=this;t&&(this.params.pageNo=t,this.params.pageSize=e),this.loading=!0,this.$request(this.URL(),this.$METHOD.GET).then((function(t){var e=t.data;a.list=a.reset(e.items),a.params.total=e.count,a.metrics=e.metrics,a.loading=!1}))},reset:function(t){for(var e=0;e<t.length;e++)t[e].uid=t[e].metadata.uid,t[e].name=t[e].metadata.name,t[e].namespace=t[e].metadata.namespace,t[e].labels=t[e].metadata.labels?t[e].metadata.labels:[],t[e].creationTimestamp=new Date(t[e].metadata.creationTimestamp).toLocaleString();return t}}};var v=(0,a(83744).Z)(f,[["render",function(t,e,a,d,c,m){var p=(0,n.up)("CPUMemory"),g=(0,n.up)("a-input-search"),h=(0,n.up)("Status"),f=(0,n.up)("a-tag"),v=(0,n.up)("ImageTags"),w=(0,n.up)("PodStatusTags"),y=(0,n.up)("a-menu-item"),k=(0,n.up)("a-menu"),b=(0,n.up)("MoreOutlined"),_=(0,n.up)("a-dropdown"),C=(0,n.up)("a-table"),x=(0,n.up)("a-card");return(0,n.wg)(),(0,n.iD)("div",null,[a.metric?((0,n.wg)(),(0,n.j4)(p,{key:0,loading:c.loading,metrics:c.metrics},null,8,["loading","metrics"])):(0,n.kq)("",!0),(0,n.Wm)(x,{class:"card nopd",title:a.title,loading:c.loading},(0,n.Nv)({default:(0,n.w5)((function(){return[(0,n._)("div",null,[(0,n.Wm)(C,{pagination:{showSizeChanger:!0,showQuickJumper:!1,onShowSizeChange:m.search,onChange:m.search,current:c.params.pageNo,pageSize:c.params.pageSize,showTotal:function(e,a){return"".concat(t.$t("Total")," ").concat(e)},total:c.params.total},columns:m.dataColumns,"data-source":c.list},{bodyCell:(0,n.w5)((function(e){var a,d=e.column,c=e.record;return["t"===d.dataIndex?((0,n.wg)(),(0,n.j4)(h,{key:0,d:null===(a=c.podInfo)||void 0===a?void 0:a.warnings},null,8,["d"])):"name"===d.dataIndex?((0,n.wg)(),(0,n.iD)("div",r,[(0,n._)("a",{href:"javascript:void(0)",onClick:function(t){return m.detail(c.name,c.namespace)}},(0,i.zw)(c.name),9,o)])):"labels"===d.dataIndex?((0,n.wg)(),(0,n.iD)("div",s,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(Object.keys(c.labels),(function(t,e){return(0,n.wg)(),(0,n.j4)(f,{key:e,closable:!1},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,i.zw)(t)+":"+(0,i.zw)(c.labels[t]),1)]})),_:2},1024)})),128))])):"containerImages"===d.dataIndex?((0,n.wg)(),(0,n.j4)(v,{key:3,d:c},null,8,["d"])):"pods"===d.dataIndex?((0,n.wg)(),(0,n.j4)(w,{key:4,d:c.podInfo},null,8,["d"])):"action"===d.dataIndex?((0,n.wg)(),(0,n.iD)("div",l,[(0,n.Wm)(_,null,{overlay:(0,n.w5)((function(){return[(0,n.Wm)(k,null,{default:(0,n.w5)((function(){return[(0,n.Wm)(y,null,{default:(0,n.w5)((function(){return[(0,n._)("a",{onClick:function(t){return m.detail(c.name,c.namespace)}},(0,i.zw)(t.$t("view")),9,u)]})),_:2},1024)]})),_:2},1024)]})),default:(0,n.w5)((function(){return[(0,n._)("a",null,[(0,n.Wm)(b)])]})),_:2},1024)])):(0,n.kq)("",!0)]})),_:1},8,["pagination","columns","data-source"])])]})),_:2},[a.hasSearch?{name:"extra",fn:(0,n.w5)((function(){return[(0,n._)("div",null,[(0,n.Wm)(g,{value:c.params.key,"onUpdate:value":e[0]||(e[0]=function(t){return c.params.key=t}),onSearch:e[1]||(e[1]=function(t){return m.search()}),class:"input-search",placeholder:t.$t("search")},null,8,["value","placeholder"])])]})),key:"0"}:void 0]),1032,["title","loading"])])}],["__scopeId","data-v-44e4b55f"]])}}]);