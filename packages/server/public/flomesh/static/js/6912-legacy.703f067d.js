(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[6912],{82481:function(e,t,n){n(82109)({target:"String",proto:!0},{repeat:n(38415)})},56912:function(e,t,n){"use strict";n.d(t,{Z:function(){return G}});n(68309),n(57327),n(41539),n(82481);var i=n(66252),a=n(3577),s=n(49963),o=n(87932),r={style:{margin:"-12px -16px"}},c={key:0,class:"title"},u={key:1},d=function(e){return(0,i.dD)("data-v-71c9b5b4"),e=e(),(0,i.Cn)(),e}((function(){return(0,i._)("img",{src:o,style:{width:"300px"}},null,-1)})),l={key:1,class:"mb-20 pt-20"},p={key:1},h={key:0},f={class:"mg-x-20"},m={key:0},b={key:1,class:"mg-x-20"},g={class:"mb-3"},w={key:0,class:"card-avatar icon svg","aria-hidden":"true"},y=["xlink:href"],k={class:"meta-content"};var v=n(95082),C=(n(54747),n(57658),n(74916),n(15306),n(40561),n(47941),n(96486)),O=n.n(C),W=n(61103),_=n(71900),E=n(66316),Z=n(26917),j=n(17582),S=n(69596),$=n(47556),D=n(79566),q=n(60459),P=n(33907),F=n(84722),A=n(934),z=n(9980),U=n.n(z),x=n(35316),L=n(75255),V=n(64167),M=n(46981),I={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M603.3 327.5l-246 178a7.95 7.95 0 000 12.9l246 178c5.3 3.8 12.7 0 12.7-6.5V643c0-10.2-4.9-19.9-13.2-25.9L457.4 512l145.4-105.2c8.3-6 13.2-15.6 13.2-25.9V334c0-6.5-7.4-10.3-12.7-6.5z"}},{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"}}]},name:"left-circle",theme:"outlined"},T=n(33058);function H(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?Object(arguments[t]):{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),i.forEach((function(t){Q(e,t,n[t])}))}return e}function Q(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var B=function(e,t){var n=H({},e,t.attrs);return(0,i.Wm)(T.Z,H({},n,{icon:I}),null)};B.displayName="LeftCircleOutlined",B.inheritAttrs=!1;var Y=B,K=!(0,F._y)(),N={name:"Dashboard",components:{HeadInfo:_.Z,PageLayout:W.Z,AutoCard:E.Z,draggable:U(),CardList:S.Z,InfoCircleOutlined:x.Z,CheckOutlined:L.Z,FilterOutlined:V.Z,EnvSelector:q.Z,Timeline:D.Z,EditOutlined:M.Z,LeftCircleOutlined:Y},props:["editable","hideHead","avatar","pageId","kind","dashboardId","title","apply","params","desc","defaultWidget","embed","hideAdd","prometheus"],i18n:n(89234),data:function(){return{pid:null,did:null,oid:"",prometheusVal:null,prometheusList:[],name:"",dateVal:[60,100],screenWidth:document.body.clientWidth,timer:!1,subscribes:[],refresh:1,loading:!0,isEdit:!1,namespace:null,namespaceFilter:!1,visible:!1,dragging:!1,enabled:!0,dashboards:[],env:{},userWidgets:{},subscribesConfigs:[],icons:A.Z.baseComponents,flb:[],fsm:[],openapi:[],workload:[],projects:[],customComponents:[],inPreview:!1,previewSubscribe:"",previewSubscribeWidth:"300",activities:[],teams:[],isFree:K,isK8S:"k8s"==localStorage.getItem("SCHEMA_TYPE")}},computed:(0,v.Z)((0,v.Z)((0,v.Z)({},(0,P.Se)("account",["user"])),(0,P.rn)("setting",["lang"])),{},{namespaceQL:function(){var e="";return this.namespaceFilter&&(e+=this.namespace),e},timelineQL:function(){return(0,j.xI)(this.dateVal[0],this.dateVal[1])||""},where:function(){var e=(0,Z.M0)(this.dateVal[0],this.dateVal[1]);return this.namespaceFilter&&(e+=(0,Z.w4)(this.namespace)),e||""}}),watch:{prometheus:function(e){this.prometheusVal=e},screenWidth:function(){if(!this.timer){this.timer=!0,this.refresh=this.refresh+1;var e=this;setTimeout((function(){e.timer=!1}),600)}},subscribes:function(){var e=this,t=[];this.subscribes.forEach((function(n){var i=e.getConfig(n);((0,F._y)()&&(0,F.wP)(n)&&i&&i.col>-1||!(0,F._y)()&&(0,F.Ed)(n)&&(0,F.wP)(n)&&i&&i.col>-1)&&t.push({name:n,config:i})})),this.subscribesConfigs=t}},created:function(){this.subscribeChange(!0),this.setEditPageData(),"mesh"==this.kind&&this.getPrometheus()},mounted:function(){var e=this;window&&(window.onresize=function(){window.screenWidth=document.body.clientWidth,e.screenWidth=window.screenWidth}),this.prometheusVal=this.prometheus},methods:{getPrometheus:function(){var e=this;this.$gql.query('fleets(filters:{type:{eq:"prometheus"}}){data{id,attributes{name,apply,content}}}').then((function(t){e.prometheusList=t.data}))},dateChange:function(e){},envChange:function(e){this.env=e,this.namespace=e.namespace},handleApplyChange:function(e){this.replace({pid:e})},changeTitle:function(e){this.apply||this.name==e||this.save({name:e})},getConfig:function(e){var t=e.split(".");return"custom"==t[0]?this.userWidgets?this.userWidgets[t[2]]:null:this.getSubscribe(t,null,0)},showModal:function(){this.isEdit=!this.isEdit},showAddModal:function(){this.visible=!0,this.setEditPageData()},handleOk:function(e){this.visible=!1},previewBack:function(){this.inPreview=!1,this.previewSubscribe=""},goComponents:function(){this.$router.push({path:"/ops-center/components"})},handleProChange:function(){this.$emit("update:prometheus",this.prometheusVal),this.$emit("prometheusChange",this.prometheusVal)},preview:function(e,t,n){var i="custom"==t?t:n.root,a="custom"==t?n.tag.name:n.key1,s="custom"==t?n.id:n.key2;this.inPreview=!0,this.previewSubscribe=i+"."+a+"."+s,this.previewSubscribeWidth="custom"==t?50*userWidgets[s].col:50*subscribe[i][a][s].col},pin:function(e){if("undefined"!=typeof window){var t=O().cloneDeep(this.subscribes)||[];t.push(e),this.save({subscribes:t},!0),this.$message.success(this.$t("Added successfully"),3)}},unpin:function(e){if("undefined"!=typeof window){var t=O().cloneDeep(this.subscribes);t.forEach((function(n,i){n==e&&t.splice(i,1)})),this.save({subscribes:t},!0),this.$message.success(this.$t("Removed successfully"),3)}},switchAction:function(e,t,n){var i="custom"==t?t:n.root,a="custom"==t?n.tag.name:n.key1,s="custom"==t?n.id:n.key2;n.checked=!0,n.checked?this.pin(i+"."+a+"."+s):this.unpin(i+"."+a+"."+s)},addAction:function(e,t,n){var i="custom"==t?t:n.root,a="custom"==t?n.tag.name:n.key1,s="custom"==t?n.id:n.key2;this.pin(i+"."+a+"."+s)},dragstart:function(){this.dragging=!0},dragend:function(){var e=this;setTimeout((function(){e.subscribes=[],e.subscribesConfigs.forEach((function(t){e.subscribes.push(t.name)})),e.save({subscribes:e.subscribes})}),300),this.dragging=!1},unchoose:function(){},getSubscribe:function(e,t,n){var i=t||A.Z;return e.length>n?this.getSubscribe(e,i[e[n]],++n):i},isOpen:function(e,t,n){return!!this.subscribes&&this.subscribes.indexOf(e+"."+t+"."+n)>-1},getDashboards:function(e){var t=this;this.loading=!0,this.$gql.query("dashboards{data{id,attributes{name,apply,content,updatedAt}}}").then((function(n){t.loading=!1,t.dashboards=n.data,t.dashboards.forEach((function(e){e.widgets=[],e.content.widget&&(e.widgets=e.content.widget.replace(/^,/g,"").split(","))})),e&&e()}))},setUserWidgets:function(e){var t=this;(0,$.US)().then((function(n){t.userWidgets={},n.data.forEach((function(e){e.content&&(t.userWidgets[e.content.id]=(0,v.Z)((0,v.Z)({},e.content),{},{uid:e.id}))})),t.customComponents=[],Object.keys(t.userWidgets).forEach((function(e){t.customComponents.push((0,v.Z)({root:"custom",key1:t.userWidgets[e].tag.name,key2:e,checked:t.isOpen("custom",t.userWidgets[e].tag.name,e)},t.userWidgets[e]))})),e&&e()}))},setEditPageData:function(){var e=this;this.system=[],Object.keys(A.Z.system).forEach((function(t){Object.keys(A.Z.system[t]).forEach((function(n){e.system.push((0,v.Z)({root:"system",key1:t,key2:n,checked:e.isOpen("system",t,n)},A.Z.system[t][n]))}))})),this.workload=[],Object.keys(A.Z.workload).forEach((function(t){Object.keys(A.Z.workload[t]).forEach((function(n){e.workload.push((0,v.Z)({root:"workload",key1:t,key2:n,checked:e.isOpen("workload",t,n)},A.Z.workload[t][n]))}))})),this.flb=[],Object.keys(A.Z.flb).forEach((function(t){Object.keys(A.Z.flb[t]).forEach((function(n){e.flb.push((0,v.Z)({root:"flb",key1:t,key2:n,checked:e.isOpen("flb",t,n)},A.Z.flb[t][n]))}))})),this.fsm=[],Object.keys(A.Z.fsm).forEach((function(t){Object.keys(A.Z.fsm[t]).forEach((function(n){e.fsm.push((0,v.Z)({root:"fsm",key1:t,key2:n,checked:e.isOpen("fsm",t,n)},A.Z.fsm[t][n]))}))})),this.openapi=[],Object.keys(A.Z.openapi).forEach((function(t){Object.keys(A.Z.openapi[t]).forEach((function(n){e.openapi.push((0,v.Z)({root:"openapi",key1:t,key2:n,checked:e.isOpen("openapi",t,n)},A.Z.openapi[t][n]))}))})),this.setUserWidgets((function(){e.getDashboards((function(){e.loading=!1}))}))},replace:function(){var e=this;this.oid?(0,$.qF)(this.oid,{apply:""}).then((function(){(0,$.qF)(e.did,{apply:e.apply}).then((function(){e.subscribeChange()}))})):(0,$.qF)(this.did,{apply:this.apply}).then((function(){e.subscribeChange()}))},save:function(e,t){var n=this;this.did?(0,$.qF)(this.did,e).then((function(){t&&n.subscribeChange()})):this.$message.warn(this.$t("Please click the right menu to bind a dashboard"),3)},initDashboard:function(){var e=this;this.oid&&(0,$.qF)(this.oid,{apply:""}).then((function(){})),(0,$.DB)({name:this.apply,widget:this.defaultWidget,apply:this.apply}).then((function(){(0,$.ud)(e.apply).then((function(t){if(0!=t.data.length){e.$message.success(e.$t("Init dashboard successful"),3);var n=t.data[0];e.did=n.id,e.oid=n.id,e.name=n.name;var i=n.content.widget||e.defaultWidget;e.subscribes=i?i.replace(/^,/g,"").split(","):[]}else e.$message.warn(e.$t("Please click the right menu to bind a dashboard"),3)})),e.getDashboards()}))},subscribeChange:function(e){var t=this;this.loading=!0,this.pid=this.pageId,this.did=this.dashboardId,this.apply?(0,$.ud)(this.apply).then((function(n){if(1!=e&&(t.loading=!1),0==n.data.length&&t.defaultWidget)t.embed||t.initDashboard();else{var i=n.data[0];t.did=i.id,t.oid=i.id,t.name=i.name;var a=i.content.widget||t.defaultWidget;t.subscribes=a?a.replace(/^,/g,"").split(","):[]}})):(0,$.l1)(this.did).then((function(n){1!=e&&(t.loading=!1),t.name=n.data.name;var i=n.data.content.widget;t.subscribes=i?i.replace(/^,/g,"").split(","):[]}))}}};const R=(0,n(83744).Z)(N,[["render",function(e,t,n,o,v,C){var O=(0,i.up)("EditOutlined"),W=(0,i.up)("CheckOutlined"),_=(0,i.up)("a-tooltip"),E=(0,i.up)("Timeline"),Z=(0,i.up)("a-descriptions-item"),j=(0,i.up)("a-switch"),S=(0,i.up)("EnvSelector"),$=(0,i.up)("a-descriptions"),D=(0,i.up)("FilterOutlined"),q=(0,i.up)("a-popover"),P=(0,i.up)("InfoCircleOutlined"),F=((0,i.up)("a-badge"),(0,i.up)("HeadInfo"),(0,i.up)("a-button")),A=(0,i.up)("a-result"),z=(0,i.up)("a-typography-title"),U=(0,i.up)("a-select-option"),x=(0,i.up)("a-select"),L=(0,i.up)("AutoCard"),V=(0,i.up)("a-col"),M=(0,i.up)("draggable"),I=(0,i.up)("a-row"),T=(0,i.up)("a-card-meta"),H=(0,i.up)("CardList"),Q=(0,i.up)("a-tab-pane"),B=(0,i.up)("a-tabs"),Y=(0,i.up)("LeftCircleOutlined"),K=(0,i.up)("a-modal"),N=(0,i.up)("PageLayout"),R=(0,i.Q2)("permission");return(0,i.wg)(),(0,i.iD)(i.HY,null,[(0,i.wy)((0,i.Wm)(_,{placement:"top",title:e.$t("Edit Page")},{default:(0,i.w5)((function(){return[(0,i.wy)(((0,i.wg)(),(0,i.iD)("div",{onClick:t[0]||(t[0]=function(){return C.showModal&&C.showModal.apply(C,arguments)}),class:(0,a.C_)(["fullscreen header-fullscreen",n.embed?"embed":"normal"])},[v.isEdit?(0,i.kq)("",!0):((0,i.wg)(),(0,i.j4)(O,{key:0,class:"icon"})),v.isEdit?((0,i.wg)(),(0,i.j4)(W,{key:1,class:"font-green icon"})):(0,i.kq)("",!0)],2)),[[R,["dashboard:update"]]])]})),_:1},8,["title"]),[[s.F8,!n.hideAdd]]),(0,i.Wm)(q,{placement:"left",trigger:"click",class:"nopd"},{content:(0,i.w5)((function(){return[(0,i._)("div",r,[(0,i.Wm)($,{bordered:""},{default:(0,i.w5)((function(){return[(0,i.Wm)(Z,{label:e.$t("Timeline"),span:3},{default:(0,i.w5)((function(){return[(0,i.Wm)(E,{dateVal:v.dateVal,"onUpdate:dateVal":t[1]||(t[1]=function(e){return v.dateVal=e}),onDateChange:C.dateChange},null,8,["dateVal","onDateChange"])]})),_:1},8,["label"]),(0,i.Wm)(Z,{label:e.$t("Namespace"),span:3},{default:(0,i.w5)((function(){return[(0,i.Wm)(j,{size:"small",checked:v.namespaceFilter,"onUpdate:checked":t[2]||(t[2]=function(e){return v.namespaceFilter=e})},null,8,["checked"]),v.namespaceFilter?((0,i.wg)(),(0,i.j4)(S,{key:0,"no-all":!0,"is-filter":!0,onEnvChange:C.envChange},null,8,["onEnvChange"])):(0,i.kq)("",!0)]})),_:1},8,["label"])]})),_:1})])]})),default:(0,i.w5)((function(){return[(0,i.wy)((0,i._)("div",{class:(0,a.C_)(["filter fullscreen header-fullscreen",n.embed?"embed":"normal"])},[(0,i.Wm)(_,{placement:"left",title:e.$t("Filter")},{default:(0,i.w5)((function(){return[(0,i.Wm)(D,{class:"icon"})]})),_:1},8,["title"])],2),[[s.F8,!n.hideAdd]])]})),_:1}),(0,i.Wm)(N,{"hide-head":n.hideHead,avatar:n.avatar,editable:n.editable,title:v.name,onChangeTitle:C.changeTitle},{headerContent:(0,i.w5)((function(){return[(0,i._)("div",null,[n.title?((0,i.wg)(),(0,i.iD)("div",c,(0,a.zw)(n.title),1)):(0,i.kq)("",!0),n.desc?((0,i.wg)(),(0,i.iD)("div",u,(0,a.zw)(n.desc),1)):(0,i.kq)("",!0)])]})),extra:(0,i.w5)((function(){return[(0,i.Wm)(_,{title:e.$t("You can subscribe to modules of interest on other dashboard pages")},{action:(0,i.w5)((function(){return[(0,i.Wm)(P,{class:"info-circle"})]})),_:1},8,["title"]),(0,i.kq)("",!0)]})),default:(0,i.w5)((function(){return[v.isEdit||!v.loading&&v.subscribes&&0!=v.subscribes.length?(0,i.kq)("",!0):((0,i.wg)(),(0,i.j4)(A,{key:0,class:"mt-20",title:e.$t("My Dashboard"),"sub-title":v.loading?e.$t("The system is reading your preferences")+"...":""},(0,i.Nv)({icon:(0,i.w5)((function(){return[d]})),_:2},[v.loading?void 0:{name:"extra",fn:(0,i.w5)((function(){return[n.apply?(0,i.wy)(((0,i.wg)(),(0,i.j4)(F,{key:0,type:"primary",onClick:C.showModal},{default:(0,i.w5)((function(){return[(0,i.Uk)((0,a.zw)(e.$t("Select a dashboard")),1)]})),_:1},8,["onClick"])),[[R,["dashboard:update"]]]):(0,i.wy)(((0,i.wg)(),(0,i.j4)(F,{key:1,type:"primary",onClick:C.showAddModal},{default:(0,i.w5)((function(){return[(0,i.Uk)((0,a.zw)(e.$t("Add a component")),1)]})),_:1},8,["onClick"])),[[R,["dashboard:update"]]])]})),key:"0"}]),1032,["title","sub-title"])),v.isEdit?((0,i.wg)(),(0,i.iD)("div",l,["mesh"==n.kind?(0,i.wy)(((0,i.wg)(),(0,i.j4)(z,{key:0,level:5},{default:(0,i.w5)((function(){return[(0,i.Uk)((0,a.zw)(e.$t("Select a prometheus"))+": ",1)]})),_:1})),[[R,["mesh:update"]]]):(0,i.kq)("",!0),"mesh"==n.kind?((0,i.wg)(),(0,i.iD)("div",p,[(0,i.wy)(((0,i.wg)(),(0,i.j4)(x,{placeholder:e.$t("unallocated"),class:"width-200",value:v.prometheusVal,"onUpdate:value":t[3]||(t[3]=function(e){return v.prometheusVal=e}),onChange:C.handleProChange},{default:(0,i.w5)((function(){return[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(v.prometheusList,(function(e,t){return(0,i.wg)(),(0,i.j4)(U,{key:t,value:e.id},{default:(0,i.w5)((function(){return[e.id?((0,i.wg)(),(0,i.iD)("span",h,(0,a.zw)(e.name),1)):(0,i.kq)("",!0)]})),_:2},1032,["value"])})),128))]})),_:1},8,["placeholder","value","onChange"])),[[R,["mesh:update"]]]),(0,i.wy)(((0,i.wg)(),(0,i.iD)("span",f,[(0,i.Uk)((0,a.zw)(e.$t("Or")),1)])),[[R,["mesh:update"]]]),(0,i.wy)(((0,i.wg)(),(0,i.j4)(F,{type:"primary",onClick:C.goComponents},{default:(0,i.w5)((function(){return[(0,i.Uk)((0,a.zw)(e.$t("Add a prometheus")),1)]})),_:1},8,["onClick"])),[[R,["mesh:update"]]])])):(0,i.kq)("",!0),n.apply?((0,i.wg)(),(0,i.j4)(z,{key:2,level:5},{default:(0,i.w5)((function(){return[(0,i.Uk)((0,a.zw)(e.$t("Select a dashboard"))+": ",1)]})),_:1})):(0,i.kq)("",!0),(0,i._)("div",null,[n.apply?(0,i.wy)(((0,i.wg)(),(0,i.j4)(x,{key:0,placeholder:e.$t("unallocated"),class:"width-200",value:v.did,"onUpdate:value":t[4]||(t[4]=function(e){return v.did=e}),onChange:C.handleApplyChange},{default:(0,i.w5)((function(){return[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(v.dashboards,(function(e,t){return(0,i.wg)(),(0,i.j4)(U,{disabled:e.apply.length>0&&n.apply!=e.apply,key:t,value:e.id},{default:(0,i.w5)((function(){return[e.id?((0,i.wg)(),(0,i.iD)("span",m,(0,a.zw)(e.name),1)):(0,i.kq)("",!0)]})),_:2},1032,["disabled","value"])})),128))]})),_:1},8,["placeholder","value","onChange"])),[[R,["dashboard:update"]]]):(0,i.kq)("",!0),n.apply?(0,i.wy)(((0,i.wg)(),(0,i.iD)("span",b,[(0,i.Uk)((0,a.zw)(e.$t("Or")),1)])),[[R,["dashboard:update"]]]):(0,i.kq)("",!0),n.apply?(0,i.wy)(((0,i.wg)(),(0,i.j4)(F,{key:2,type:"primary",onClick:C.initDashboard},{default:(0,i.w5)((function(){return[(0,i.Uk)((0,a.zw)(e.$t("New Dashboard")),1)]})),_:1},8,["onClick"])),[[R,["dashboard:create"]]]):(0,i.kq)("",!0),(0,i.wy)(((0,i.wg)(),(0,i.j4)(F,{type:"primary",class:"ml-15",onClick:C.showAddModal},{default:(0,i.w5)((function(){return[(0,i.Uk)((0,a.zw)(e.$t("Add UI Component")),1)]})),_:1},8,["onClick"])),[[R,["dashboard:update"]]])])])):(0,i.kq)("",!0),v.subscribes&&v.subscribes.length>0&&!v.loading&&v.did?((0,i.wg)(),(0,i.j4)(I,{key:2,class:"row-mg"},{default:(0,i.w5)((function(){return[(0,i.Wm)(M,{handle:".handle",list:v.subscribesConfigs,"onUpdate:list":t[5]||(t[5]=function(e){return v.subscribesConfigs=e}),disabled:!v.enabled,"ghost-class":"ghost",onStart:C.dragstart,onEnd:C.dragend,onUnchoose:C.unchoose,tag:"transition-group","component-data":{name:"flip-list",type:"transition",pull:"clone"}},{item:(0,i.w5)((function(e){var t=e.element;return[""!=t.name?((0,i.wg)(),(0,i.j4)(V,{key:t.name,class:"list-group-item pd-12",xl:t.config.col,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((function(){return[(0,i.Wm)(L,{subscribes:v.subscribes,did:v.did,pid:v.pid,kind:n.kind,params:n.params,where:C.where,filters:{timelineQL:C.timelineQL,namespaceQL:C.namespaceQL},"is-edit":v.isEdit,apply:n.apply?n.apply.split(".")[0]:null,ismove:!0,onSubscribeChange:C.subscribeChange,ver:"ver."+v.refresh,config:t.config,n:t.name},null,8,["subscribes","did","pid","kind","params","where","filters","is-edit","apply","onSubscribeChange","ver","config","n"])]})),_:2},1032,["xl"])):(0,i.kq)("",!0)]})),_:1},8,["list","disabled","onStart","onEnd","onUnchoose"])]})),_:1})):(0,i.kq)("",!0),(0,i.Wm)(K,{visible:v.visible,"onUpdate:visible":t[6]||(t[6]=function(e){return v.visible=e}),title:e.$t("Workplace Setting"),footer:null,width:"95%",onCancel:C.handleOk},{default:(0,i.w5)((function(){return[v.did&&!v.inPreview?((0,i.wg)(),(0,i.j4)(B,{key:0,type:"card","tab-position":"left"},{default:(0,i.w5)((function(){return[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(v.isK8S?v.isFree?[{data:v.workload,title:"Workload",type:"component"},{data:v.fsm,title:"FSM",type:"component"},{data:e.system,title:"Common",type:"component"},{data:v.customComponents,title:"Custom",type:"custom"}]:[{data:v.workload,title:"Workload",type:"component"},{data:v.flb,title:"FLB",type:"component"},{data:v.fsm,title:"FSM",type:"component"},{data:v.openapi,title:"Open API",type:"component"},{data:e.system,title:"Common",type:"component"},{data:v.customComponents,title:"Custom",type:"custom"}]:v.isFree?[{data:v.fsm,title:"FSM",type:"component"},{data:e.system,title:"Common",type:"component"},{data:v.customComponents,title:"Custom",type:"custom"}]:[{data:v.flb,title:"FLB",type:"component"},{data:v.fsm,title:"FSM",type:"component"},{data:v.openapi,title:"Open API",type:"component"},{data:e.system,title:"Common",type:"component"},{data:v.customComponents,title:"Custom",type:"custom"}],(function(t,n){return(0,i.wg)(),(0,i.j4)(Q,{key:n,tab:t.title},{default:(0,i.w5)((function(){return[(0,i.Wm)(H,{loading:v.loading,col:3,"data-source":t.data.filter((function(e){return-1!=e.col})),type:"component",actions:[{icon:"EyeOutlined",text:"Preview",call:C.preview,showFun:function(e){return!e.nopreview}},{icon:"PlusOutlined",text:"add",call:C.addAction,showFun:function(e){return e.repeat}},{icon:"PlusOutlined",text:"add",call:C.switchAction,showFun:function(e){return!e.repeat&&!e.checked}},{icon:"CheckOutlined",text:"Added",showFun:function(e){return!e.repeat&&e.checked}}]},{default:(0,i.w5)((function(t){var n=t.item;return[(0,i.Wm)(T,null,{title:(0,i.w5)((function(){return[(0,i._)("div",g,(0,a.zw)(e.$t(n.title)),1)]})),avatar:(0,i.w5)((function(){return[v.icons[n.tag.name]?((0,i.wg)(),(0,i.iD)("svg",w,[(0,i._)("use",{"xlink:href":"#"+v.icons[n.tag.name].icon},null,8,y)])):(0,i.kq)("",!0)]})),description:(0,i.w5)((function(){return[(0,i._)("div",k,(0,a.zw)(e.$t("Component type"))+"："+(0,a.zw)(n.tag.name),1)]})),_:2},1024)]})),_:2},1032,["loading","data-source","actions"])]})),_:2},1032,["tab"])})),128))]})),_:1})):(0,i.kq)("",!0),v.inPreview?((0,i.wg)(),(0,i.j4)(Y,{key:1,onClick:C.previewBack,class:"left-circle"},null,8,["onClick"])):(0,i.kq)("",!0),v.inPreview&&v.previewSubscribe&&""!=v.previewSubscribe?((0,i.wg)(),(0,i.j4)(L,{key:2,n:v.previewSubscribe,ver:"ver."+v.refresh,config:v.userWidgets[v.previewSubscribe.split(".")[2]],class:"auto-card",style:(0,a.j5)("width:"+v.previewSubscribeWidth+"px")},null,8,["n","ver","config","style"])):(0,i.kq)("",!0)]})),_:1},8,["visible","title","onCancel"])]})),_:1},8,["hide-head","avatar","editable","title","onChangeTitle"])],64)}],["__scopeId","data-v-71c9b5b4"]]);var G=R}}]);