"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[2184],{74353:function(t,e,n){n.d(e,{Z:function(){return u}});var a=n(66252),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884zm288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z"}}]},name:"stop",theme:"outlined"},i=n(33058);function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?Object(arguments[e]):{},a=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable})))),a.forEach((function(e){s(t,e,n[e])}))}return t}function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var l=function(t,e){var n=o({},t,e.attrs);return(0,a.Wm)(i.Z,o({},n,{icon:r}),null)};l.displayName="StopOutlined",l.inheritAttrs=!1;var u=l},16822:function(t,e,n){n.d(e,{Z:function(){return g}});var a=n(66252),r={class:"statusIcon"},i={href:"javascript:void(0)"},o={key:5,class:"icon svg","aria-hidden":"true"},s=["xlink:href"];var l=n(74353),u=n(50320),c=n(70001),d=n(58721),p=n(13868),h={name:"Status",components:{StopOutlined:l.Z,LoadingOutlined:u.Z,CheckCircleFilled:c.Z,CloseCircleFilled:d.Z,WarningFilled:p.Z},props:["d"],i18n:n(89234),data:function(){return{iconStatus:{running:"success",pending:"pending",success:"success",stop:"stop",failed:"error",Normal:"success",Pending:"pending",Succeeded:"success",Success:"success",Completed:"success",Complete:"success",Running:"success",Warning:"warning",ImagePullBackOff:"error",ErrImagePull:"error","Init: CrashLoopBackOff":"error","Init:Error":"error","Error: ErrImagePull":"error","Back-off restarting failed container":"error"}}},computed:{status:function(){return this.iconStatus[this.d?this.d.status||(this.d[0]?this.d[0].status:null):"Success"]}}};var g=(0,n(83744).Z)(h,[["render",function(t,e,n,l,u,c){var d=(0,a.up)("LoadingOutlined"),p=(0,a.up)("StopOutlined"),h=(0,a.up)("CloseCircleFilled"),g=(0,a.up)("CheckCircleFilled"),f=(0,a.up)("WarningFilled"),m=(0,a.up)("a-tooltip");return(0,a.wg)(),(0,a.iD)("div",r,[(0,a.Wm)(m,{placement:"topLeft",title:n.d?n.d.message||n.d[0]&&n.d[0].message:""},{default:(0,a.w5)((function(){return[(0,a._)("a",i,["pending"==c.status?((0,a.wg)(),(0,a.j4)(d,{key:0,class:"font-18 font-primary svg"})):"stop"==c.status?((0,a.wg)(),(0,a.j4)(p,{key:1,class:"danger font-18 svg"})):"error"==c.status?((0,a.wg)(),(0,a.j4)(h,{key:2,class:"danger font-18 svg"})):"success"==c.status?((0,a.wg)(),(0,a.j4)(g,{key:3,class:"font-18 success svg"})):"warning"==c.status?((0,a.wg)(),(0,a.j4)(f,{key:4,class:"font-18 svg warning"})):((0,a.wg)(),(0,a.iD)("svg",o,[(0,a._)("use",{"xlink:href":c.status},null,8,s)]))])]})),_:1},8,["title"])])}],["__scopeId","data-v-5c100524"]])},62184:function(t,e,n){n.r(e),n.d(e,{default:function(){return f}});n(74916),n(64765),n(92222),n(2707),n(68309);var a=n(66252),r=n(3577),i=function(t){return(0,a.dD)("data-v-0bd6d015"),t=t(),(0,a.Cn)(),t}((function(){return(0,a._)("em",null," ~ ",-1)})),o={key:1},s={key:2},l=["onClick"],u={key:3};n(21249),n(57658),n(38862),n(15306),n(41539),n(54747);var c=n(21936),d=n(16822),p=[{key:" ",dataIndex:"t",width:30},{key:"Type",dataIndex:"type"},{key:"as",dataIndex:"as"},{key:"time",sorter:!0,dataIndex:"updatedAt"},{key:"content",dataIndex:"content"}],h=[{key:" ",dataIndex:"t",width:30},{key:"time",sorter:!0,dataIndex:"updatedAt"},{key:"content",dataIndex:"content"}],g={name:"EventList",components:{JsonEditor:c.Z,Status:d.Z},props:["pid","mode"],i18n:n(89234),data:function(){return{date:"",endDate:"",visible:!1,pageSize:10,pageNo:1,total:0,loading:!0,advanced:!0,sorter:"updatedAt",sortOrder:"end$desc",type:"l4Lb",typeOptions:[{tab:"4LB",key:"l4Lb"},{tab:"Upstream",key:"upstream"}],columns:p,embedColumns:h,list:[]}},computed:{dataColumns:function(){var t=this;return(this.mode?this.embedColumns:this.columns).map((function(e){return e.title=t.$t(e.key),e.sorter&&t.sorter==e.dataIndex&&(e.sortOrder=t.sortOrder),e}))},start:function(){return(this.pageNo-1)*this.pageSize}},created:function(){this.mode&&(this.type=this.mode),this.search()},methods:{onTabChange:function(t){this.type=t,this.search()},sort:function(t,e,n){this.sorter=n.field,this.sortOrder=n.order,this.search()},onClose:function(){this.visible=!1},goTarget:function(t,e){"l4Lb"==e&&this.$router.push({path:"/flb/4lb/detail/"+t})},detail:function(t){this.visible=!0,this.log=JSON.stringify(t||{})},detailInterface:function(t){this.visible=!0,this.log=t},search:function(t,e){var n=this;t&&(this.pageNo=t,this.pageSize=e);var a={start:this.start,limit:this.pageSize};this.loading=!0;var r={type:{eq:this.type},isCluster:{eq:!1}};this.endDate&&(r.updatedAt={lte:this.endDate}),this.date&&(r.createdAt={gte:this.date}),this.pid&&("l4Lb"==this.type?r.l4Lb={id:{eq:this.pid}}:"upstream"==this.type&&(r.checkpoint={id:{eq:this.pid}}));var i="updatedAt:desc";this.sorter&&this.sortOrder&&(i=(i=this.sortOrder.replace(/\$/g,"")).replace(/end/g,""),i="".concat(this.sorter,":").concat(i)),this.$gql.query('healthcheckResults(filters: $filters, pagination: $pagination, sort: "'.concat(i,'"){\n\t\t\t\t\t\tdata{id,attributes{\n\t\t\t\t\t\t\tupdatedAt,\n              content,\n\t\t\t\t\t\t\ttype,\n\t\t\t\t\t\t\tl4Lb{data{id,attributes{name}}},\n\t\t\t\t\t\t\tcheckpoint{data{id,attributes{name}}},\n\t\t\t\t\t\t}},\n\t\t\t\t\t\tmeta{pagination{total}}\n\t\t\t\t\t}'),{filters:r,pagination:a},{filters:"HealthcheckResultFiltersInput",pagination:"PaginationArg"}).then((function(t){n.list=t.data,t.data.forEach((function(t){t.t=t.content.unhealthy.length>0?"failed":"success"})),n.total=t.pagination.total,n.loading=!1}))}}};var f=(0,n(83744).Z)(g,[["render",function(t,e,n,c,d,p){var h=(0,a.up)("a-date-picker"),g=(0,a.up)("Status"),f=(0,a.up)("a-tag"),m=(0,a.up)("a-table"),v=(0,a.up)("a-card"),k=(0,a.up)("JsonEditor"),b=(0,a.up)("a-drawer");return(0,a.wg)(),(0,a.iD)("div",null,[(0,a.Wm)(v,{class:"nopd",title:n.mode?t.$t("healthcheck"):null,"tab-list":n.mode?null:d.typeOptions,"active-tab-key":d.type,loading:d.loading,onTabChange:e[8]||(e[8]=function(t){return p.onTabChange(t)})},(0,a.Nv)({customTab:(0,a.w5)((function(e){return[(0,a._)("span",null,(0,r.zw)(t.$t(e.tab))+" "+(0,r.zw)(t.$t("healthcheck")),1)]})),default:(0,a.w5)((function(){return[(0,a._)("div",null,[(0,a.Wm)(m,{columns:p.dataColumns,"data-source":d.list,pagination:{showSizeChanger:!0,showQuickJumper:!1,onShowSizeChange:p.search,onChange:p.search,current:d.pageNo,pageSize:d.pageSize,showTotal:function(e,n){return"".concat(t.$t("Total")," ").concat(e)},total:d.total},onChange:p.sort},{bodyCell:(0,a.w5)((function(e){var n=e.column,i=e.record;return["t"===n.dataIndex?((0,a.wg)(),(0,a.j4)(g,{key:0,d:{status:i.t}},null,8,["d"])):"as"===n.dataIndex?((0,a.wg)(),(0,a.iD)("div",o,["l4Lb"==i.type?((0,a.wg)(),(0,a.j4)(f,{key:0,onClick:function(t){return p.goTarget(i.l4Lb.id,i.type)}},{default:(0,a.w5)((function(){var t;return[(0,a.Uk)((0,r.zw)(null===(t=i.l4Lb)||void 0===t?void 0:t.name),1)]})),_:2},1032,["onClick"])):"upstream"==i.type?((0,a.wg)(),(0,a.j4)(f,{key:1,onClick:function(t){return p.goTarget(i.l4Lb.id,i.type)}},{default:(0,a.w5)((function(){var t,e;return[(0,a.Uk)((0,r.zw)(null!==(t=i.checkpoint)&&void 0!==t&&t.name?null===(e=i.checkpoint)||void 0===e?void 0:e.name:"checkpoint"),1)]})),_:2},1032,["onClick"])):(0,a.kq)("",!0)])):"content"===n.dataIndex?((0,a.wg)(),(0,a.iD)("div",s,[(0,a._)("a",{onClick:function(t){return p.detail(i.content)}},(0,r.zw)(t.$t("detail")),9,l)])):"createdAt"===n.dataIndex?((0,a.wg)(),(0,a.iD)("div",u,(0,r.zw)(new Date(i.createdAt).toLocaleString()),1)):(0,a.kq)("",!0)]})),_:1},8,["columns","data-source","pagination","onChange"])])]})),_:2},[n.mode?{name:"extra",fn:(0,a.w5)((function(){return[(0,a._)("div",null,[(0,a.Wm)(h,{value:d.date,"onUpdate:value":e[0]||(e[0]=function(t){return d.date=t}),"show-time":"",format:"YYYY-MM-DD HH:mm:ss",placeholder:t.$t("Start Date"),onChange:e[1]||(e[1]=function(t){return p.search()})},null,8,["value","placeholder"]),i,(0,a.Wm)(h,{value:d.endDate,"onUpdate:value":e[2]||(e[2]=function(t){return d.endDate=t}),"show-time":"",format:"YYYY-MM-DD HH:mm:ss",placeholder:t.$t("End Date"),onChange:e[3]||(e[3]=function(t){return p.search()})},null,8,["value","placeholder"])])]})),key:"0"}:{name:"tabBarExtraContent",fn:(0,a.w5)((function(){return[(0,a._)("div",null,[(0,a.Wm)(h,{value:d.date,"onUpdate:value":e[4]||(e[4]=function(t){return d.date=t}),"show-time":"",format:"YYYY-MM-DD HH:mm:ss",placeholder:t.$t("Start Date"),onChange:e[5]||(e[5]=function(t){return p.search()})},null,8,["value","placeholder"]),(0,a._)("em",null," ~ "),(0,a.Wm)(h,{value:d.endDate,"onUpdate:value":e[6]||(e[6]=function(t){return d.endDate=t}),"show-time":"",format:"YYYY-MM-DD HH:mm:ss",placeholder:t.$t("End Date"),onChange:e[7]||(e[7]=function(t){return p.search()})},null,8,["value","placeholder"])])]})),key:"1"}]),1032,["title","tab-list","active-tab-key","loading"]),d.visible?((0,a.wg)(),(0,a.j4)(b,{key:0,"get-container":!1,title:t.$t("content"),placement:"bottom",height:"600",closable:!1,visible:d.visible,onClose:p.onClose},{default:(0,a.w5)((function(){return[(0,a.Wm)(k,{"is-readonly":!0,value:t.log},null,8,["value"])]})),_:1},8,["title","visible","onClose"])):(0,a.kq)("",!0)])}],["__scopeId","data-v-0bd6d015"]])}}]);