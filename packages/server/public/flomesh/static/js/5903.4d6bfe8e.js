"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[5903],{74353:function(t,e,a){a.d(e,{Z:function(){return l}});var s=a(66252),n={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884zm288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z"}}]},name:"stop",theme:"outlined"},i=a(33058);function d(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?Object(arguments[e]):{},s=Object.keys(a);"function"==typeof Object.getOwnPropertySymbols&&(s=s.concat(Object.getOwnPropertySymbols(a).filter((function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable})))),s.forEach((function(e){o(t,e,a[e])}))}return t}function o(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var r=function(t,e){var a=d({},t,e.attrs);return(0,s.Wm)(i.Z,d({},a,{icon:n}),null)};r.displayName="StopOutlined",r.inheritAttrs=!1;var l=r},80927:function(t,e,a){a.d(e,{Z:function(){return g}});var s=a(66252),n=a(3577);const i={class:"chart-card-header"},d={class:"meta"},o={class:"chart-card-title"},r={class:"chart-card-action"},l={key:0,class:"total"},c={class:"content-fix"},u={key:0,class:"chart-card-footer"};var p={name:"ChartCard",props:["title","hideTotal","loading","notFt","height","padding"]};var g=(0,a(83744).Z)(p,[["render",function(t,e,a,p,g,h){const m=(0,s.up)("a-card");return(0,s.wg)(),(0,s.j4)(m,{loading:a.loading,"body-style":{padding:a.padding?a.padding:"8px 24px 8px"},bordered:!1},{default:(0,s.w5)((()=>[(0,s._)("div",i,[(0,s._)("div",d,[(0,s._)("span",o,(0,n.zw)(a.title),1),(0,s._)("span",r,[(0,s.WI)(t.$slots,"action",{},void 0,!0)])]),a.hideTotal?(0,s.kq)("",!0):((0,s.wg)(),(0,s.iD)("div",l,[(0,s.WI)(t.$slots,"total",{},void 0,!0)]))]),(0,s._)("div",{class:(0,n.C_)(["chart-card-content",a.hideTotal?"hideTotal":""]),style:(0,n.j5)({height:a.height?a.height:"66px"})},[(0,s._)("div",c,[(0,s.WI)(t.$slots,"default",{},void 0,!0)])],6),a.notFt?(0,s.kq)("",!0):((0,s.wg)(),(0,s.iD)("div",u,[(0,s.WI)(t.$slots,"footer",{},void 0,!0)]))])),_:3},8,["loading","body-style"])}],["__scopeId","data-v-909bd9a2"]])},16822:function(t,e,a){a.d(e,{Z:function(){return h}});var s=a(66252);const n={class:"statusIcon"},i={href:"javascript:void(0)"},d={key:5,class:"icon svg","aria-hidden":"true"},o=["xlink:href"];var r=a(74353),l=a(50320),c=a(70001),u=a(58721),p=a(13868),g={name:"Status",components:{StopOutlined:r.Z,LoadingOutlined:l.Z,CheckCircleFilled:c.Z,CloseCircleFilled:u.Z,WarningFilled:p.Z},props:["d"],i18n:a(89234),data(){return{iconStatus:{running:"success",pending:"pending",success:"success",stop:"stop",failed:"error",Normal:"success",Pending:"pending",Succeeded:"success",Success:"success",Completed:"success",Complete:"success",Running:"success",Warning:"warning",ImagePullBackOff:"error",ErrImagePull:"error","Init: CrashLoopBackOff":"error","Init:Error":"error","Error: ErrImagePull":"error","Back-off restarting failed container":"error"}}},computed:{status(){return this.iconStatus[this.d?this.d.status||(this.d[0]?this.d[0].status:null):"Success"]}}};var h=(0,a(83744).Z)(g,[["render",function(t,e,a,r,l,c){const u=(0,s.up)("LoadingOutlined"),p=(0,s.up)("StopOutlined"),g=(0,s.up)("CloseCircleFilled"),h=(0,s.up)("CheckCircleFilled"),m=(0,s.up)("WarningFilled"),f=(0,s.up)("a-tooltip");return(0,s.wg)(),(0,s.iD)("div",n,[(0,s.Wm)(f,{placement:"topLeft",title:a.d?a.d.message||a.d[0]&&a.d[0].message:""},{default:(0,s.w5)((()=>[(0,s._)("a",i,["pending"==c.status?((0,s.wg)(),(0,s.j4)(u,{key:0,class:"font-18 font-primary svg"})):"stop"==c.status?((0,s.wg)(),(0,s.j4)(p,{key:1,class:"danger font-18 svg"})):"error"==c.status?((0,s.wg)(),(0,s.j4)(g,{key:2,class:"danger font-18 svg"})):"success"==c.status?((0,s.wg)(),(0,s.j4)(h,{key:3,class:"font-18 success svg"})):"warning"==c.status?((0,s.wg)(),(0,s.j4)(m,{key:4,class:"font-18 svg warning"})):((0,s.wg)(),(0,s.iD)("svg",d,[(0,s._)("use",{"xlink:href":c.status},null,8,o)]))])])),_:1},8,["title"])])}],["__scopeId","data-v-5c100524"]])},23605:function(t,e,a){a.r(e),a.d(e,{default:function(){return h}});var s=a(66252);var n=a(13504),i=a(7141),d=a(96991),o=a(61103),r=a(33907),l=a(39176),c=a(44044),u=a(54140),p=a(67554),g={name:"JobsDetail",i18n:a(89234),components:{PageLayout:o.Z,EventList:n.Z,StatusList:i.Z,PodList:d.Z,RollingUpdateCard:l.Z,PodStatusCard:c.Z,DetailHeader:u.Z,ResourceInfoCard:p.Z},data(){return{detail:{metadata:{labels:{},annotations:{}},typeMeta:{},jobStatus:{},podInfo:{},selector:{},statusInfo:{},conditions:[],rollingUpdateStrategy:{}},loading:!0,pid:"",namespace:"",isMounted:!1,metrics:[],params:{key:"",pageNo:1,pageSize:10,total:0}}},computed:{...(0,r.rn)("setting",["isMobile"])},created(){this.pid=this.$route.params.id||"",this.namespace=this.$route.params.namespace||localStorage.getItem("NAMESPACE")},mounted(){this.isMounted=!0,""!=this.pid?this.search():(this.detail={metadata:{labels:{},annotations:{}},typeMeta:{},jobStatus:{},podInfo:{},selector:{},statusInfo:{},conditions:[],rollingUpdateStrategy:{}},this.loading=!1)},methods:{onTabChange(t){},search(){this.loading=!0,this.$request(this.URL(),this.$METHOD.GET).then((t=>{this.detail=t.data,this.loading=!1}))},URL(){let t="/"+this.pid;return this.$REST.K8S.encode(this.$REST.K8S.JOB,t,this.namespace)},valid(){return!0},save(){this.valid()&&(""!=this.pid?(this.$message.success(this.$t("Save successfully"),3),this.$closePage(this.$route)):(this.$message.success(this.$t("Created successfully"),3),this.$closePage(this.$route)))},handleChange(){}}};var h=(0,a(83744).Z)(g,[["render",function(t,e,a,n,i,d){const o=(0,s.up)("DetailHeader"),r=(0,s.up)("ResourceInfoCard"),l=(0,s.up)("RollingUpdateCard"),c=(0,s.up)("PodStatusCard"),u=(0,s.up)("a-tab-pane"),p=(0,s.up)("StatusList"),g=(0,s.up)("a-card"),h=(0,s.up)("PodList"),m=(0,s.up)("EventList"),f=(0,s.up)("a-tabs"),v=(0,s.up)("a-col"),b=(0,s.up)("a-row"),y=(0,s.up)("PageLayout");return(0,s.wg)(),(0,s.j4)(y,{title:t.$t("Jobs")},{headerContent:(0,s.w5)((()=>[(0,s.Wm)(o,{d:i.detail},null,8,["d"])])),action:(0,s.w5)((()=>[])),default:(0,s.w5)((()=>[(0,s.Wm)(b,{class:"row-mg"},{default:(0,s.w5)((()=>[(0,s.Wm)(v,{class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,s.w5)((()=>[(0,s.Wm)(f,{type:"card"},{default:(0,s.w5)((()=>[(0,s.Wm)(u,{key:"1",tab:t.$t("Overview")},{default:(0,s.w5)((()=>[(0,s.Wm)(r,{loading:i.loading,d:i.detail},null,8,["loading","d"]),(0,s.Wm)(l,{loading:i.loading,d:i.detail.spec?.updateStrategy},null,8,["loading","d"]),(0,s.Wm)(c,{loading:i.loading,d:i.detail.podInfo},null,8,["loading","d"])])),_:1},8,["tab"]),i.detail.status?((0,s.wg)(),(0,s.j4)(u,{key:"2",tab:t.$t("Status")},{default:(0,s.w5)((()=>[(0,s.Wm)(g,{class:"card nopd",bordered:!1,loading:i.loading},{default:(0,s.w5)((()=>[(0,s.Wm)(p,{d:i.detail.status.conditions||[]},null,8,["d"])])),_:1},8,["loading"])])),_:1},8,["tab"])):(0,s.kq)("",!0),(0,s.Wm)(u,{key:"3",tab:t.$t("Pods")},{default:(0,s.w5)((()=>[(0,s.Wm)(g,{class:"card nopd",bordered:!1,loading:i.loading},{default:(0,s.w5)((()=>[(0,s.Wm)(h,{embed:!0,d:i.detail.pods,"has-search":!1},null,8,["d"])])),_:1},8,["loading"])])),_:1},8,["tab"]),(0,s.Wm)(u,{key:"4",tab:t.$t("Events")},{default:(0,s.w5)((()=>[(0,s.Wm)(g,{class:"card nopd",bordered:!1,loading:i.loading},{default:(0,s.w5)((()=>[(0,s.Wm)(m,{namespace:i.namespace,"has-search":!1,url:t.$REST.K8S.JOB+"/"+i.pid+"/event"},null,8,["namespace","url"])])),_:1},8,["loading"])])),_:1},8,["tab"])])),_:1})])),_:1})])),_:1})])),_:1},8,["title"])}]])},7141:function(t,e,a){a.d(e,{Z:function(){return d}});var s=a(66252);const n=[{key:"Type",dataIndex:"type"},{key:"Status",dataIndex:"status"},{key:"Last Probe Time",dataIndex:"lastProbeTime"},{key:"Last Transition Time",dataIndex:"lastTransitionTime"},{key:"Reason",dataIndex:"reason"},{key:"Message",dataIndex:"message"}];var i={name:"StatusList",components:{},props:["d"],i18n:a(89234),data(){return{columns:n,loading:!1,list:[]}},computed:{dataColumns(){return this.columns.map((t=>(t.title=this.$t(t.key),t)))}},created(){this.search()},methods:{search(){this.list=this.reset(this.d)},reset(t){for(let e=0;e<t.length;e++)t[e].lastProbeTime=new Date(t[e].lastProbeTime).toLocaleString(),t[e].lastTransitionTime=new Date(t[e].lastTransitionTime).toLocaleString();return t}}};var d=(0,a(83744).Z)(i,[["render",function(t,e,a,n,i,d){const o=(0,s.up)("a-table"),r=(0,s.up)("a-card");return(0,s.wg)(),(0,s.j4)(r,{class:"card nopd",title:t.$t("Status"),loading:i.loading},{default:(0,s.w5)((()=>[(0,s._)("div",null,[(0,s.Wm)(o,{columns:d.dataColumns,"data-source":i.list},null,8,["columns","data-source"])])])),_:1},8,["title","loading"])}],["__scopeId","data-v-1d5ee6b5"]])}}]);