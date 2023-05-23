"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[6912],{56912:function(e,t,s){s.d(t,{Z:function(){return N}});var i=s(66252),a=s(3577),n=s(49963),d=s(87932);const o={style:{margin:"-12px -16px"}},l={key:0,class:"title"},r={key:1},c=(e=>((0,i.dD)("data-v-71c9b5b4"),e=e(),(0,i.Cn)(),e))((()=>(0,i._)("img",{src:d,style:{width:"300px"}},null,-1))),h={key:1,class:"mb-20 pt-20"},p={key:1},u={key:0},m={class:"mg-x-20"},b={key:0},g={key:1,class:"mg-x-20"},w={class:"mb-3"},y={key:0,class:"card-avatar icon svg","aria-hidden":"true"},f=["xlink:href"],k={class:"meta-content"};s(57658);var v=s(96486),C=s.n(v),O=s(61103),W=s(71900),_=s(66316),E=s(26917),j=s(17582),S=s(69596),$=s(47556),D=s(79566),q=s(60459),P=s(33907),Z=s(84722),F=s(934),A=s(9980),z=s.n(A),U=s(35316),x=s(75255),L=s(64167),V=s(46981),M={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M603.3 327.5l-246 178a7.95 7.95 0 000 12.9l246 178c5.3 3.8 12.7 0 12.7-6.5V643c0-10.2-4.9-19.9-13.2-25.9L457.4 512l145.4-105.2c8.3-6 13.2-15.6 13.2-25.9V334c0-6.5-7.4-10.3-12.7-6.5z"}},{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"}}]},name:"left-circle",theme:"outlined"},I=s(33058);function T(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?Object(arguments[t]):{},i=Object.keys(s);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(s).filter((function(e){return Object.getOwnPropertyDescriptor(s,e).enumerable})))),i.forEach((function(t){H(e,t,s[t])}))}return e}function H(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var Q=function(e,t){var s=T({},e,t.attrs);return(0,i.Wm)(I.Z,T({},s,{icon:M}),null)};Q.displayName="LeftCircleOutlined",Q.inheritAttrs=!1;var B=Q;const Y=!(0,Z._y)();var K={name:"Dashboard",components:{HeadInfo:W.Z,PageLayout:O.Z,AutoCard:_.Z,draggable:z(),CardList:S.Z,InfoCircleOutlined:U.Z,CheckOutlined:x.Z,FilterOutlined:L.Z,EnvSelector:q.Z,Timeline:D.Z,EditOutlined:V.Z,LeftCircleOutlined:B},props:["editable","hideHead","avatar","pageId","kind","dashboardId","title","apply","params","desc","defaultWidget","embed","hideAdd","prometheus"],i18n:s(89234),data(){return{pid:null,did:null,oid:"",prometheusVal:null,prometheusList:[],name:"",dateVal:[60,100],screenWidth:document.body.clientWidth,timer:!1,subscribes:[],refresh:1,loading:!0,isEdit:!1,namespace:null,namespaceFilter:!1,visible:!1,dragging:!1,enabled:!0,dashboards:[],env:{},userWidgets:{},subscribesConfigs:[],icons:F.Z.baseComponents,flb:[],fsm:[],openapi:[],workload:[],projects:[],customComponents:[],inPreview:!1,previewSubscribe:"",previewSubscribeWidth:"300",activities:[],teams:[],isFree:Y,isK8S:"k8s"==localStorage.getItem("SCHEMA_TYPE")}},computed:{...(0,P.Se)("account",["user"]),...(0,P.rn)("setting",["lang"]),namespaceQL(){let e="";return this.namespaceFilter&&(e+=this.namespace),e},timelineQL(){return(0,j.xI)(this.dateVal[0],this.dateVal[1])||""},where(){let e=(0,E.M0)(this.dateVal[0],this.dateVal[1]);return this.namespaceFilter&&(e+=(0,E.w4)(this.namespace)),e||""}},watch:{prometheus(e){this.prometheusVal=e},screenWidth(){if(!this.timer){this.timer=!0,this.refresh=this.refresh+1;let e=this;setTimeout((function(){e.timer=!1}),600)}},subscribes(){const e=[];this.subscribes.forEach((t=>{let s=this.getConfig(t);((0,Z._y)()&&(0,Z.wP)(t)&&s&&s.col>-1||!(0,Z._y)()&&(0,Z.Ed)(t)&&(0,Z.wP)(t)&&s&&s.col>-1)&&e.push({name:t,config:s})})),this.subscribesConfigs=e}},created(){this.subscribeChange(!0),this.setEditPageData(),"mesh"==this.kind&&this.getPrometheus()},mounted(){const e=this;window&&(window.onresize=()=>{window.screenWidth=document.body.clientWidth,e.screenWidth=window.screenWidth}),this.prometheusVal=this.prometheus},methods:{getPrometheus(){this.$gql.query('fleets(filters:{type:{eq:"prometheus"}}){data{id,attributes{name,apply,content}}}').then((e=>{this.prometheusList=e.data}))},dateChange(e){},envChange(e){this.env=e,this.namespace=e.namespace},handleApplyChange(e){this.replace({pid:e})},changeTitle(e){this.apply||this.name==e||this.save({name:e})},getConfig(e){let t=e.split(".");if("custom"==t[0])return this.userWidgets?this.userWidgets[t[2]]:null;return this.getSubscribe(t,null,0)},showModal(){this.isEdit=!this.isEdit},showAddModal(){this.visible=!0,this.setEditPageData()},handleOk(e){this.visible=!1},previewBack(){this.inPreview=!1,this.previewSubscribe=""},goComponents(){this.$router.push({path:"/ops-center/components"})},handleProChange(){this.$emit("update:prometheus",this.prometheusVal),this.$emit("prometheusChange",this.prometheusVal)},preview(e,t,s){const i="custom"==t?t:s.root,a="custom"==t?s.tag.name:s.key1,n="custom"==t?s.id:s.key2;this.inPreview=!0,this.previewSubscribe=i+"."+a+"."+n,this.previewSubscribeWidth="custom"==t?50*userWidgets[n].col:50*subscribe[i][a][n].col},pin(e){if("undefined"!=typeof window){let t=C().cloneDeep(this.subscribes)||[];t.push(e),this.save({subscribes:t},!0),this.$message.success(this.$t("Added successfully"),3)}},unpin(e){if("undefined"!=typeof window){let t=C().cloneDeep(this.subscribes);t.forEach(((s,i)=>{s==e&&t.splice(i,1)})),this.save({subscribes:t},!0),this.$message.success(this.$t("Removed successfully"),3)}},switchAction(e,t,s){const i="custom"==t?t:s.root,a="custom"==t?s.tag.name:s.key1,n="custom"==t?s.id:s.key2;s.checked=!0,s.checked?this.pin(i+"."+a+"."+n):this.unpin(i+"."+a+"."+n)},addAction(e,t,s){const i="custom"==t?t:s.root,a="custom"==t?s.tag.name:s.key1,n="custom"==t?s.id:s.key2;this.pin(i+"."+a+"."+n)},dragstart(){this.dragging=!0},dragend(){setTimeout((()=>{this.subscribes=[],this.subscribesConfigs.forEach((e=>{this.subscribes.push(e.name)})),this.save({subscribes:this.subscribes})}),300),this.dragging=!1},unchoose(){},getSubscribe(e,t,s){let i=t||F.Z;return e.length>s?this.getSubscribe(e,i[e[s]],++s):i},isOpen(e,t,s){return!!this.subscribes&&this.subscribes.indexOf(e+"."+t+"."+s)>-1},getDashboards(e){this.loading=!0,this.$gql.query("dashboards{data{id,attributes{name,apply,content,updatedAt}}}").then((t=>{this.loading=!1,this.dashboards=t.data,this.dashboards.forEach((e=>{e.widgets=[],e.content.widget&&(e.widgets=e.content.widget.replace(/^,/g,"").split(","))})),e&&e()}))},setUserWidgets(e){(0,$.US)().then((t=>{this.userWidgets={},t.data.forEach((e=>{e.content&&(this.userWidgets[e.content.id]={...e.content,uid:e.id})})),this.customComponents=[],Object.keys(this.userWidgets).forEach((e=>{this.customComponents.push({root:"custom",key1:this.userWidgets[e].tag.name,key2:e,checked:this.isOpen("custom",this.userWidgets[e].tag.name,e),...this.userWidgets[e]})})),e&&e()}))},setEditPageData(){this.system=[],Object.keys(F.Z.system).forEach((e=>{Object.keys(F.Z.system[e]).forEach((t=>{this.system.push({root:"system",key1:e,key2:t,checked:this.isOpen("system",e,t),...F.Z.system[e][t]})}))})),this.workload=[],Object.keys(F.Z.workload).forEach((e=>{Object.keys(F.Z.workload[e]).forEach((t=>{this.workload.push({root:"workload",key1:e,key2:t,checked:this.isOpen("workload",e,t),...F.Z.workload[e][t]})}))})),this.flb=[],Object.keys(F.Z.flb).forEach((e=>{Object.keys(F.Z.flb[e]).forEach((t=>{this.flb.push({root:"flb",key1:e,key2:t,checked:this.isOpen("flb",e,t),...F.Z.flb[e][t]})}))})),this.fsm=[],Object.keys(F.Z.fsm).forEach((e=>{Object.keys(F.Z.fsm[e]).forEach((t=>{this.fsm.push({root:"fsm",key1:e,key2:t,checked:this.isOpen("fsm",e,t),...F.Z.fsm[e][t]})}))})),this.openapi=[],Object.keys(F.Z.openapi).forEach((e=>{Object.keys(F.Z.openapi[e]).forEach((t=>{this.openapi.push({root:"openapi",key1:e,key2:t,checked:this.isOpen("openapi",e,t),...F.Z.openapi[e][t]})}))})),this.setUserWidgets((()=>{this.getDashboards((()=>{this.loading=!1}))}))},replace(){this.oid?(0,$.qF)(this.oid,{apply:""}).then((()=>{(0,$.qF)(this.did,{apply:this.apply}).then((()=>{this.subscribeChange()}))})):(0,$.qF)(this.did,{apply:this.apply}).then((()=>{this.subscribeChange()}))},save(e,t){this.did?(0,$.qF)(this.did,e).then((()=>{t&&this.subscribeChange()})):this.$message.warn(this.$t("Please click the right menu to bind a dashboard"),3)},initDashboard(){this.oid&&(0,$.qF)(this.oid,{apply:""}).then((()=>{})),(0,$.DB)({name:this.apply,widget:this.defaultWidget,apply:this.apply}).then((()=>{(0,$.ud)(this.apply).then((e=>{if(0==e.data.length)return void this.$message.warn(this.$t("Please click the right menu to bind a dashboard"),3);this.$message.success(this.$t("Init dashboard successful"),3);const t=e.data[0];this.did=t.id,this.oid=t.id,this.name=t.name;const s=t.content.widget||this.defaultWidget;this.subscribes=s?s.replace(/^,/g,"").split(","):[]})),this.getDashboards()}))},subscribeChange(e){this.loading=!0,this.pid=this.pageId,this.did=this.dashboardId,this.apply?(0,$.ud)(this.apply).then((t=>{if(1!=e&&(this.loading=!1),0==t.data.length&&this.defaultWidget)return void(this.embed||this.initDashboard());const s=t.data[0];this.did=s.id,this.oid=s.id,this.name=s.name;const i=s.content.widget||this.defaultWidget;this.subscribes=i?i.replace(/^,/g,"").split(","):[]})):(0,$.l1)(this.did).then((t=>{1!=e&&(this.loading=!1),this.name=t.data.name;const s=t.data.content.widget;this.subscribes=s?s.replace(/^,/g,"").split(","):[]}))}}};var N=(0,s(83744).Z)(K,[["render",function(e,t,s,d,v,C){const O=(0,i.up)("EditOutlined"),W=(0,i.up)("CheckOutlined"),_=(0,i.up)("a-tooltip"),E=(0,i.up)("Timeline"),j=(0,i.up)("a-descriptions-item"),S=(0,i.up)("a-switch"),$=(0,i.up)("EnvSelector"),D=(0,i.up)("a-descriptions"),q=(0,i.up)("FilterOutlined"),P=(0,i.up)("a-popover"),Z=(0,i.up)("InfoCircleOutlined"),F=((0,i.up)("a-badge"),(0,i.up)("HeadInfo"),(0,i.up)("a-button")),A=(0,i.up)("a-result"),z=(0,i.up)("a-typography-title"),U=(0,i.up)("a-select-option"),x=(0,i.up)("a-select"),L=(0,i.up)("AutoCard"),V=(0,i.up)("a-col"),M=(0,i.up)("draggable"),I=(0,i.up)("a-row"),T=(0,i.up)("a-card-meta"),H=(0,i.up)("CardList"),Q=(0,i.up)("a-tab-pane"),B=(0,i.up)("a-tabs"),Y=(0,i.up)("LeftCircleOutlined"),K=(0,i.up)("a-modal"),N=(0,i.up)("PageLayout"),R=(0,i.Q2)("permission");return(0,i.wg)(),(0,i.iD)(i.HY,null,[(0,i.wy)((0,i.Wm)(_,{placement:"top",title:e.$t("Edit Page")},{default:(0,i.w5)((()=>[(0,i.wy)(((0,i.wg)(),(0,i.iD)("div",{onClick:t[0]||(t[0]=(...e)=>C.showModal&&C.showModal(...e)),class:(0,a.C_)(["fullscreen header-fullscreen",s.embed?"embed":"normal"])},[v.isEdit?(0,i.kq)("",!0):((0,i.wg)(),(0,i.j4)(O,{key:0,class:"icon"})),v.isEdit?((0,i.wg)(),(0,i.j4)(W,{key:1,class:"font-green icon"})):(0,i.kq)("",!0)],2)),[[R,["dashboard:update"]]])])),_:1},8,["title"]),[[n.F8,!s.hideAdd]]),(0,i.Wm)(P,{placement:"left",trigger:"click",class:"nopd"},{content:(0,i.w5)((()=>[(0,i._)("div",o,[(0,i.Wm)(D,{bordered:""},{default:(0,i.w5)((()=>[(0,i.Wm)(j,{label:e.$t("Timeline"),span:3},{default:(0,i.w5)((()=>[(0,i.Wm)(E,{dateVal:v.dateVal,"onUpdate:dateVal":t[1]||(t[1]=e=>v.dateVal=e),onDateChange:C.dateChange},null,8,["dateVal","onDateChange"])])),_:1},8,["label"]),(0,i.Wm)(j,{label:e.$t("Namespace"),span:3},{default:(0,i.w5)((()=>[(0,i.Wm)(S,{size:"small",checked:v.namespaceFilter,"onUpdate:checked":t[2]||(t[2]=e=>v.namespaceFilter=e)},null,8,["checked"]),v.namespaceFilter?((0,i.wg)(),(0,i.j4)($,{key:0,"no-all":!0,"is-filter":!0,onEnvChange:C.envChange},null,8,["onEnvChange"])):(0,i.kq)("",!0)])),_:1},8,["label"])])),_:1})])])),default:(0,i.w5)((()=>[(0,i.wy)((0,i._)("div",{class:(0,a.C_)(["filter fullscreen header-fullscreen",s.embed?"embed":"normal"])},[(0,i.Wm)(_,{placement:"left",title:e.$t("Filter")},{default:(0,i.w5)((()=>[(0,i.Wm)(q,{class:"icon"})])),_:1},8,["title"])],2),[[n.F8,!s.hideAdd]])])),_:1}),(0,i.Wm)(N,{"hide-head":s.hideHead,avatar:s.avatar,editable:s.editable,title:v.name,onChangeTitle:C.changeTitle},{headerContent:(0,i.w5)((()=>[(0,i._)("div",null,[s.title?((0,i.wg)(),(0,i.iD)("div",l,(0,a.zw)(s.title),1)):(0,i.kq)("",!0),s.desc?((0,i.wg)(),(0,i.iD)("div",r,(0,a.zw)(s.desc),1)):(0,i.kq)("",!0)])])),extra:(0,i.w5)((()=>[(0,i.Wm)(_,{title:e.$t("You can subscribe to modules of interest on other dashboard pages")},{action:(0,i.w5)((()=>[(0,i.Wm)(Z,{class:"info-circle"})])),_:1},8,["title"]),(0,i.kq)("",!0)])),default:(0,i.w5)((()=>[v.isEdit||!v.loading&&v.subscribes&&0!=v.subscribes.length?(0,i.kq)("",!0):((0,i.wg)(),(0,i.j4)(A,{key:0,class:"mt-20",title:e.$t("My Dashboard"),"sub-title":v.loading?e.$t("The system is reading your preferences")+"...":""},(0,i.Nv)({icon:(0,i.w5)((()=>[c])),_:2},[v.loading?void 0:{name:"extra",fn:(0,i.w5)((()=>[s.apply?(0,i.wy)(((0,i.wg)(),(0,i.j4)(F,{key:0,type:"primary",onClick:C.showModal},{default:(0,i.w5)((()=>[(0,i.Uk)((0,a.zw)(e.$t("Select a dashboard")),1)])),_:1},8,["onClick"])),[[R,["dashboard:update"]]]):(0,i.wy)(((0,i.wg)(),(0,i.j4)(F,{key:1,type:"primary",onClick:C.showAddModal},{default:(0,i.w5)((()=>[(0,i.Uk)((0,a.zw)(e.$t("Add a component")),1)])),_:1},8,["onClick"])),[[R,["dashboard:update"]]])])),key:"0"}]),1032,["title","sub-title"])),v.isEdit?((0,i.wg)(),(0,i.iD)("div",h,["mesh"==s.kind?(0,i.wy)(((0,i.wg)(),(0,i.j4)(z,{key:0,level:5},{default:(0,i.w5)((()=>[(0,i.Uk)((0,a.zw)(e.$t("Select a prometheus"))+": ",1)])),_:1})),[[R,["mesh:update"]]]):(0,i.kq)("",!0),"mesh"==s.kind?((0,i.wg)(),(0,i.iD)("div",p,[(0,i.wy)(((0,i.wg)(),(0,i.j4)(x,{placeholder:e.$t("unallocated"),class:"width-200",value:v.prometheusVal,"onUpdate:value":t[3]||(t[3]=e=>v.prometheusVal=e),onChange:C.handleProChange},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(v.prometheusList,((e,t)=>((0,i.wg)(),(0,i.j4)(U,{key:t,value:e.id},{default:(0,i.w5)((()=>[e.id?((0,i.wg)(),(0,i.iD)("span",u,(0,a.zw)(e.name),1)):(0,i.kq)("",!0)])),_:2},1032,["value"])))),128))])),_:1},8,["placeholder","value","onChange"])),[[R,["mesh:update"]]]),(0,i.wy)(((0,i.wg)(),(0,i.iD)("span",m,[(0,i.Uk)((0,a.zw)(e.$t("Or")),1)])),[[R,["mesh:update"]]]),(0,i.wy)(((0,i.wg)(),(0,i.j4)(F,{type:"primary",onClick:C.goComponents},{default:(0,i.w5)((()=>[(0,i.Uk)((0,a.zw)(e.$t("Add a prometheus")),1)])),_:1},8,["onClick"])),[[R,["mesh:update"]]])])):(0,i.kq)("",!0),s.apply?((0,i.wg)(),(0,i.j4)(z,{key:2,level:5},{default:(0,i.w5)((()=>[(0,i.Uk)((0,a.zw)(e.$t("Select a dashboard"))+": ",1)])),_:1})):(0,i.kq)("",!0),(0,i._)("div",null,[s.apply?(0,i.wy)(((0,i.wg)(),(0,i.j4)(x,{key:0,placeholder:e.$t("unallocated"),class:"width-200",value:v.did,"onUpdate:value":t[4]||(t[4]=e=>v.did=e),onChange:C.handleApplyChange},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(v.dashboards,((e,t)=>((0,i.wg)(),(0,i.j4)(U,{disabled:e.apply.length>0&&s.apply!=e.apply,key:t,value:e.id},{default:(0,i.w5)((()=>[e.id?((0,i.wg)(),(0,i.iD)("span",b,(0,a.zw)(e.name),1)):(0,i.kq)("",!0)])),_:2},1032,["disabled","value"])))),128))])),_:1},8,["placeholder","value","onChange"])),[[R,["dashboard:update"]]]):(0,i.kq)("",!0),s.apply?(0,i.wy)(((0,i.wg)(),(0,i.iD)("span",g,[(0,i.Uk)((0,a.zw)(e.$t("Or")),1)])),[[R,["dashboard:update"]]]):(0,i.kq)("",!0),s.apply?(0,i.wy)(((0,i.wg)(),(0,i.j4)(F,{key:2,type:"primary",onClick:C.initDashboard},{default:(0,i.w5)((()=>[(0,i.Uk)((0,a.zw)(e.$t("New Dashboard")),1)])),_:1},8,["onClick"])),[[R,["dashboard:create"]]]):(0,i.kq)("",!0),(0,i.wy)(((0,i.wg)(),(0,i.j4)(F,{type:"primary",class:"ml-15",onClick:C.showAddModal},{default:(0,i.w5)((()=>[(0,i.Uk)((0,a.zw)(e.$t("Add UI Component")),1)])),_:1},8,["onClick"])),[[R,["dashboard:update"]]])])])):(0,i.kq)("",!0),v.subscribes&&v.subscribes.length>0&&!v.loading&&v.did?((0,i.wg)(),(0,i.j4)(I,{key:2,class:"row-mg"},{default:(0,i.w5)((()=>[(0,i.Wm)(M,{handle:".handle",list:v.subscribesConfigs,"onUpdate:list":t[5]||(t[5]=e=>v.subscribesConfigs=e),disabled:!v.enabled,"ghost-class":"ghost",onStart:C.dragstart,onEnd:C.dragend,onUnchoose:C.unchoose,tag:"transition-group","component-data":{name:"flip-list",type:"transition",pull:"clone"}},{item:(0,i.w5)((({element:e})=>[""!=e.name?((0,i.wg)(),(0,i.j4)(V,{key:e.name,class:"list-group-item pd-12",xl:e.config.col,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((()=>[(0,i.Wm)(L,{subscribes:v.subscribes,did:v.did,pid:v.pid,kind:s.kind,params:s.params,where:C.where,filters:{timelineQL:C.timelineQL,namespaceQL:C.namespaceQL},"is-edit":v.isEdit,apply:s.apply?s.apply.split(".")[0]:null,ismove:!0,onSubscribeChange:C.subscribeChange,ver:"ver."+v.refresh,config:e.config,n:e.name},null,8,["subscribes","did","pid","kind","params","where","filters","is-edit","apply","onSubscribeChange","ver","config","n"])])),_:2},1032,["xl"])):(0,i.kq)("",!0)])),_:1},8,["list","disabled","onStart","onEnd","onUnchoose"])])),_:1})):(0,i.kq)("",!0),(0,i.Wm)(K,{visible:v.visible,"onUpdate:visible":t[6]||(t[6]=e=>v.visible=e),title:e.$t("Workplace Setting"),footer:null,width:"95%",onCancel:C.handleOk},{default:(0,i.w5)((()=>[v.did&&!v.inPreview?((0,i.wg)(),(0,i.j4)(B,{key:0,type:"card","tab-position":"left"},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(v.isK8S?v.isFree?[{data:v.workload,title:"Workload",type:"component"},{data:v.fsm,title:"FSM",type:"component"},{data:e.system,title:"Common",type:"component"},{data:v.customComponents,title:"Custom",type:"custom"}]:[{data:v.workload,title:"Workload",type:"component"},{data:v.flb,title:"FLB",type:"component"},{data:v.fsm,title:"FSM",type:"component"},{data:v.openapi,title:"Open API",type:"component"},{data:e.system,title:"Common",type:"component"},{data:v.customComponents,title:"Custom",type:"custom"}]:v.isFree?[{data:v.fsm,title:"FSM",type:"component"},{data:e.system,title:"Common",type:"component"},{data:v.customComponents,title:"Custom",type:"custom"}]:[{data:v.flb,title:"FLB",type:"component"},{data:v.fsm,title:"FSM",type:"component"},{data:v.openapi,title:"Open API",type:"component"},{data:e.system,title:"Common",type:"component"},{data:v.customComponents,title:"Custom",type:"custom"}],((t,s)=>((0,i.wg)(),(0,i.j4)(Q,{key:s,tab:t.title},{default:(0,i.w5)((()=>[(0,i.Wm)(H,{loading:v.loading,col:3,"data-source":t.data.filter((e=>-1!=e.col)),type:"component",actions:[{icon:"EyeOutlined",text:"Preview",call:C.preview,showFun:e=>!e.nopreview},{icon:"PlusOutlined",text:"add",call:C.addAction,showFun:e=>e.repeat},{icon:"PlusOutlined",text:"add",call:C.switchAction,showFun:e=>!e.repeat&&!e.checked},{icon:"CheckOutlined",text:"Added",showFun:e=>!e.repeat&&e.checked}]},{default:(0,i.w5)((({item:t})=>[(0,i.Wm)(T,null,{title:(0,i.w5)((()=>[(0,i._)("div",w,(0,a.zw)(e.$t(t.title)),1)])),avatar:(0,i.w5)((()=>[v.icons[t.tag.name]?((0,i.wg)(),(0,i.iD)("svg",y,[(0,i._)("use",{"xlink:href":"#"+v.icons[t.tag.name].icon},null,8,f)])):(0,i.kq)("",!0)])),description:(0,i.w5)((()=>[(0,i._)("div",k,(0,a.zw)(e.$t("Component type"))+"："+(0,a.zw)(t.tag.name),1)])),_:2},1024)])),_:2},1032,["loading","data-source","actions"])])),_:2},1032,["tab"])))),128))])),_:1})):(0,i.kq)("",!0),v.inPreview?((0,i.wg)(),(0,i.j4)(Y,{key:1,onClick:C.previewBack,class:"left-circle"},null,8,["onClick"])):(0,i.kq)("",!0),v.inPreview&&v.previewSubscribe&&""!=v.previewSubscribe?((0,i.wg)(),(0,i.j4)(L,{key:2,n:v.previewSubscribe,ver:"ver."+v.refresh,config:v.userWidgets[v.previewSubscribe.split(".")[2]],class:"auto-card",style:(0,a.j5)("width:"+v.previewSubscribeWidth+"px")},null,8,["n","ver","config","style"])):(0,i.kq)("",!0)])),_:1},8,["visible","title","onCancel"])])),_:1},8,["hide-head","avatar","editable","title","onChangeTitle"])],64)}],["__scopeId","data-v-71c9b5b4"]])}}]);