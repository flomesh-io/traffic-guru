"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[3279],{74353:function(t,e,n){n.d(e,{Z:function(){return u}});var a=n(66252),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884zm288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z"}}]},name:"stop",theme:"outlined"},i=n(33058);function s(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?Object(arguments[e]):{},a=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable})))),a.forEach((function(e){o(t,e,n[e])}))}return t}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var d=function(t,e){var n=s({},t,e.attrs);return(0,a.Wm)(i.Z,s({},n,{icon:r}),null)};d.displayName="StopOutlined",d.inheritAttrs=!1;var u=d},38415:function(t,e,n){var a=n(19303),r=n(41340),i=n(84488),s=RangeError;t.exports=function(t){var e=r(i(this)),n="",o=a(t);if(o<0||o==1/0)throw s("Wrong number of repetitions");for(;o>0;(o>>>=1)&&(e+=e))1&o&&(n+=e);return n}},56977:function(t,e,n){var a=n(82109),r=n(1702),i=n(19303),s=n(50863),o=n(38415),d=n(47293),u=RangeError,l=String,c=Math.floor,f=r(o),g=r("".slice),p=r(1..toFixed),h=function(t,e,n){return 0===e?n:e%2==1?h(t,e-1,n*t):h(t*t,e/2,n)},m=function(t,e,n){for(var a=-1,r=n;++a<6;)r+=e*t[a],t[a]=r%1e7,r=c(r/1e7)},v=function(t,e){for(var n=6,a=0;--n>=0;)a+=t[n],t[n]=c(a/e),a=a%e*1e7},b=function(t){for(var e=6,n="";--e>=0;)if(""!==n||0===e||0!==t[e]){var a=l(t[e]);n=""===n?a:n+f("0",7-a.length)+a}return n};a({target:"Number",proto:!0,forced:d((function(){return"0.000"!==p(8e-5,3)||"1"!==p(.9,0)||"1.25"!==p(1.255,2)||"1000000000000000128"!==p(0xde0b6b3a7640080,0)}))||!d((function(){p({})}))},{toFixed:function(t){var e,n,a,r,o=s(this),d=i(t),c=[0,0,0,0,0,0],p="",w="0";if(d<0||d>20)throw u("Incorrect fraction digits");if(o!=o)return"NaN";if(o<=-1e21||o>=1e21)return l(o);if(o<0&&(p="-",o=-o),o>1e-21)if(n=(e=function(t){for(var e=0,n=t;n>=4096;)e+=12,n/=4096;for(;n>=2;)e+=1,n/=2;return e}(o*h(2,69,1))-69)<0?o*h(2,-e,1):o/h(2,e,1),n*=4503599627370496,(e=52-e)>0){for(m(c,0,n),a=d;a>=7;)m(c,1e7,0),a-=7;for(m(c,h(10,a,1),0),a=e-1;a>=23;)v(c,1<<23),a-=23;v(c,1<<a),m(c,1,1),v(c,2),w=b(c)}else m(c,0,n),m(c,1<<-e,0),w=b(c)+f("0",d);return w=d>0?p+((r=w.length)<=d?"0."+f("0",d-r)+w:g(w,0,r-d)+"."+g(w,r-d)):p+w}})},80927:function(t,e,n){n.d(e,{Z:function(){return g}});var a=n(66252),r=n(3577),i={class:"chart-card-header"},s={class:"meta"},o={class:"chart-card-title"},d={class:"chart-card-action"},u={key:0,class:"total"},l={class:"content-fix"},c={key:0,class:"chart-card-footer"};var f={name:"ChartCard",props:["title","hideTotal","loading","notFt","height","padding"]};var g=(0,n(83744).Z)(f,[["render",function(t,e,n,f,g,p){var h=(0,a.up)("a-card");return(0,a.wg)(),(0,a.j4)(h,{loading:n.loading,"body-style":{padding:n.padding?n.padding:"8px 24px 8px"},bordered:!1},{default:(0,a.w5)((function(){return[(0,a._)("div",i,[(0,a._)("div",s,[(0,a._)("span",o,(0,r.zw)(n.title),1),(0,a._)("span",d,[(0,a.WI)(t.$slots,"action",{},void 0,!0)])]),n.hideTotal?(0,a.kq)("",!0):((0,a.wg)(),(0,a.iD)("div",u,[(0,a.WI)(t.$slots,"total",{},void 0,!0)]))]),(0,a._)("div",{class:(0,r.C_)(["chart-card-content",n.hideTotal?"hideTotal":""]),style:(0,r.j5)({height:n.height?n.height:"66px"})},[(0,a._)("div",l,[(0,a.WI)(t.$slots,"default",{},void 0,!0)])],6),n.notFt?(0,a.kq)("",!0):((0,a.wg)(),(0,a.iD)("div",c,[(0,a.WI)(t.$slots,"footer",{},void 0,!0)]))]})),_:3},8,["loading","body-style"])}],["__scopeId","data-v-909bd9a2"]])},16822:function(t,e,n){n.d(e,{Z:function(){return p}});var a=n(66252),r={class:"statusIcon"},i={href:"javascript:void(0)"},s={key:5,class:"icon svg","aria-hidden":"true"},o=["xlink:href"];var d=n(74353),u=n(50320),l=n(70001),c=n(58721),f=n(13868),g={name:"Status",components:{StopOutlined:d.Z,LoadingOutlined:u.Z,CheckCircleFilled:l.Z,CloseCircleFilled:c.Z,WarningFilled:f.Z},props:["d"],i18n:n(89234),data:function(){return{iconStatus:{running:"success",pending:"pending",success:"success",stop:"stop",failed:"error",Normal:"success",Pending:"pending",Succeeded:"success",Success:"success",Completed:"success",Complete:"success",Running:"success",Warning:"warning",ImagePullBackOff:"error",ErrImagePull:"error","Init: CrashLoopBackOff":"error","Init:Error":"error","Error: ErrImagePull":"error","Back-off restarting failed container":"error"}}},computed:{status:function(){return this.iconStatus[this.d?this.d.status||(this.d[0]?this.d[0].status:null):"Success"]}}};var p=(0,n(83744).Z)(g,[["render",function(t,e,n,d,u,l){var c=(0,a.up)("LoadingOutlined"),f=(0,a.up)("StopOutlined"),g=(0,a.up)("CloseCircleFilled"),p=(0,a.up)("CheckCircleFilled"),h=(0,a.up)("WarningFilled"),m=(0,a.up)("a-tooltip");return(0,a.wg)(),(0,a.iD)("div",r,[(0,a.Wm)(m,{placement:"topLeft",title:n.d?n.d.message||n.d[0]&&n.d[0].message:""},{default:(0,a.w5)((function(){return[(0,a._)("a",i,["pending"==l.status?((0,a.wg)(),(0,a.j4)(c,{key:0,class:"font-18 font-primary svg"})):"stop"==l.status?((0,a.wg)(),(0,a.j4)(f,{key:1,class:"danger font-18 svg"})):"error"==l.status?((0,a.wg)(),(0,a.j4)(g,{key:2,class:"danger font-18 svg"})):"success"==l.status?((0,a.wg)(),(0,a.j4)(p,{key:3,class:"font-18 success svg"})):"warning"==l.status?((0,a.wg)(),(0,a.j4)(h,{key:4,class:"font-18 svg warning"})):((0,a.wg)(),(0,a.iD)("svg",s,[(0,a._)("use",{"xlink:href":l.status},null,8,o)]))])]})),_:1},8,["title"])])}],["__scopeId","data-v-5c100524"]])},60818:function(t,e,n){n.r(e),n.d(e,{default:function(){return p}});var a=n(66252);var r=n(95082),i=(n(74916),n(64765),n(77469)),s=n(96991),o=n(61103),d=n(33907),u=n(39176),l=n(44044),c=n(54140),f=n(38251),g={name:"StatefulSetDetail",i18n:n(89234),components:{PageLayout:o.Z,EventList:i.Z,PodList:s.Z,RollingUpdateCard:u.Z,PodStatusCard:l.Z,DetailHeader:c.Z,ResourceInfoCard:f.Z},data:function(){return{detail:{metadata:{labels:{},annotations:{}},typeMeta:{},podInfo:{},containerImages:[],selector:{},statusInfo:{},conditions:[],rollingUpdateStrategy:{}},loading:!0,pid:"",namespace:"",isMounted:!1,metrics:[],params:{key:"",pageNo:1,pageSize:10,total:0}}},computed:(0,r.Z)({},(0,d.rn)("setting",["isMobile"])),created:function(){this.pid=this.$route.params.id||"",this.namespace=this.$route.params.namespace||localStorage.getItem("NAMESPACE")},mounted:function(){this.isMounted=!0,""!=this.pid?this.search():(this.detail={metadata:{labels:{},annotations:{}},typeMeta:{},podInfo:{},containerImages:[],selector:{},statusInfo:{},conditions:[],rollingUpdateStrategy:{}},this.loading=!1)},methods:{onTabChange:function(t){},search:function(){var t=this;this.loading=!0,this.$request(this.URL(),this.$METHOD.GET).then((function(e){t.detail=e.data,t.loading=!1}))},URL:function(){var t="/"+this.pid;return this.$REST.K8S.encode(this.$REST.K8S.STATEFULSET,t,this.namespace)},valid:function(){return!0},save:function(){this.valid()&&(""!=this.pid?(this.$message.success(this.$t("Save successfully"),3),this.$closePage(this.$route)):(this.$message.success(this.$t("Created successfully"),3),this.$closePage(this.$route)))},handleChange:function(){}}};var p=(0,n(83744).Z)(g,[["render",function(t,e,n,r,i,s){var o=(0,a.up)("DetailHeader"),d=(0,a.up)("ResourceInfoCard"),u=(0,a.up)("RollingUpdateCard"),l=(0,a.up)("PodStatusCard"),c=(0,a.up)("a-tab-pane"),f=(0,a.up)("PodList"),g=(0,a.up)("a-card"),p=(0,a.up)("EventList"),h=(0,a.up)("a-tabs"),m=(0,a.up)("a-col"),v=(0,a.up)("a-row"),b=(0,a.up)("PageLayout");return(0,a.wg)(),(0,a.j4)(b,{title:t.$t("Stateful Sets")},{headerContent:(0,a.w5)((function(){return[(0,a.Wm)(o,{d:i.detail},null,8,["d"])]})),action:(0,a.w5)((function(){return[]})),default:(0,a.w5)((function(){return[(0,a.Wm)(v,{class:"row-mg"},{default:(0,a.w5)((function(){return[(0,a.Wm)(m,{class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,a.w5)((function(){return[(0,a.Wm)(h,{type:"card"},{default:(0,a.w5)((function(){return[(0,a.Wm)(c,{key:"1",tab:t.$t("Overview")},{default:(0,a.w5)((function(){var t;return[(0,a.Wm)(d,{loading:i.loading,d:i.detail},null,8,["loading","d"]),(0,a.Wm)(u,{loading:i.loading,d:null===(t=i.detail.spec)||void 0===t?void 0:t.updateStrategy},null,8,["loading","d"]),(0,a.Wm)(l,{loading:i.loading,d:i.detail.podInfo},null,8,["loading","d"])]})),_:1},8,["tab"]),(0,a.Wm)(c,{key:"3",tab:t.$t("Pods")},{default:(0,a.w5)((function(){return[(0,a.Wm)(g,{class:"card nopd",bordered:!1,loading:i.loading},{default:(0,a.w5)((function(){return[(0,a.Wm)(f,{embed:!0,"has-search":!1,d:i.detail.pods},null,8,["d"])]})),_:1},8,["loading"])]})),_:1},8,["tab"]),(0,a.Wm)(c,{key:"4",tab:t.$t("Events")},{default:(0,a.w5)((function(){return[(0,a.Wm)(g,{class:"card nopd",bordered:!1,loading:i.loading},{default:(0,a.w5)((function(){return[(0,a.Wm)(p,{namespace:i.namespace,"has-search":!1,url:t.$REST.K8S.STATEFULSET+"/"+i.pid+"/event"},null,8,["namespace","url"])]})),_:1},8,["loading"])]})),_:1},8,["tab"])]})),_:1})]})),_:1})]})),_:1})]})),_:1},8,["title"])}]])}}]);