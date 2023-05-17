"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[6574],{71900:function(t,e,a){a.d(e,{Z:function(){return r}});var n=a(66252),i=a(3577),o={class:"head-info"};var l={name:"HeadInfo",props:["title","content"]};var r=(0,a(83744).Z)(l,[["render",function(t,e,a,l,r,s){return(0,n.wg)(),(0,n.iD)("div",o,[(0,n._)("span",null,(0,i.zw)(a.title),1),(0,n._)("p",null,[(0,n.Uk)((0,i.zw)(a.content),1),(0,n.WI)(t.$slots,"body",{},void 0,!0)])])}],["__scopeId","data-v-00006846"]])},96574:function(t,e,a){a.r(e),a.d(e,{default:function(){return $}});a(74916),a(64765),a(68309);var n=a(66252),i=a(3577),o=a(49963),l={class:"search-input"},r={class:"content flex"},s={class:"flex-item"},c={class:"form-row"},u={class:"label"},p={class:"content"},d={class:"search-content"},h={class:"project-selection"},g={class:"font-22"},f={class:"font-16"},v={class:"font-20 primary"};var w=a(95082),m=(a(57658),a(92222),a(71900)),y=a(99684),_=a(33907),j=a(66022),k=a(61103),z={name:"ApiList",i18n:a(89234),components:{PageLayout:k.Z,ApplicationListResults:j.Z,PlusCircleTwoTone:y.Z,HeadInfo:m.Z},data:function(){return{pageSize:12,pageNo:1,total:0,key:"",projects:[],viewtypevalue:0,viewtypeproject:null,viewtype:[{value:0,label:"All"},{value:1,label:"Goup By Project"}],apps:[],categray:[{value:!0,label:"All"},{value:!1,label:"Success"},{value:!1,label:"Pending"},{value:!1,label:"Error"}],loading:!0}},computed:(0,w.Z)((0,w.Z)({},(0,_.rn)("setting",["layout","pageWidth"])),{},{start:function(){return(this.pageNo-1)*this.pageSize}}),mounted:function(){this.search()},methods:{add:function(){this.$router.push({path:"/openapi/application/create"})},detail:function(t,e,a){this.$router.push({path:"/openapi/application/detail/"+a.id})},remove:function(t,e,a){var n=this;this.$gql.mutation("deleteApplication(id:".concat(a.id,"){data{id}}")).then((function(){n.$message.success(n.$t("Deleted successfully"),3),n.search()}))},getData:function(){},removeViewtypeproject:function(){this.viewtypeproject=null,this.searchProject()},filterData:function(t){this.viewtypeproject=t,this.search()},changeView:function(){this.viewtypeproject=null,0==this.viewtypevalue?this.search():this.searchProject()},search:function(t){var e=this;this.pageNo=t||1,this.loading=!0;var a={name:{contains:this.key}};this.viewtypeproject&&(a.project={id:{eq:this.viewtypeproject.id}}),this.$gql.query("applications(filters: $filters, pagination:{start: ".concat(this.start,", limit: ").concat(this.pageSize,"}){\n\t\t\t\t\t\tdata{id,attributes{\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\tproject{data{id,attributes{name}}},\n\t\t\t\t\t\t\tapis{data{id,attributes{name}}},\n\t\t\t\t\t\t\tcontent,\n\t\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t\t}},\n\t\t\t\t\t\tmeta{pagination{total}}\n\t\t\t\t\t}"),{filters:a},{filters:"ApplicationFiltersInput"}).then((function(t){e.apps=t.data,e.total=t.pagination.total,e.loading=!1}))},searchProject:function(t){var e=this;this.pageNo=t||1,this.loading=!0,this.$gql.query("projects(pagination:{start: ".concat(this.start,", limit: ").concat(this.pageSize,"}){\n\t\t\t\t\t\tdata{id,attributes{\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\tapplications{data{id,attributes{name}}},\n\t\t\t\t\t\t\tcontent,\n\t\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t\t}}\n\t\t\t\t\t}")).then((function(t){e.projects=t.data,e.loading=!1}))}}};var $=(0,a(83744).Z)(z,[["render",function(t,e,a,w,m,y){var _=(0,n.up)("a-input-search"),j=(0,n.up)("a-radio-button"),k=(0,n.up)("a-radio-group"),z=(0,n.up)("a-tag"),$=(0,n.up)("a-form-item"),b=(0,n.up)("a-form"),C=(0,n.up)("PlusCircleTwoTone"),N=(0,n.up)("HeadInfo"),W=(0,n.up)("a-card"),A=(0,n.up)("a-col"),S=(0,n.up)("a-row"),P=(0,n.up)("ApplicationListResults"),Z=(0,n.up)("a-pagination"),q=(0,n.up)("PageLayout"),D=(0,n.Q2)("permission");return(0,n.wg)(),(0,n.j4)(q,{title:t.$t("Application")},{headerContent:(0,n.w5)((function(){return[(0,n._)("div",{class:(0,i.C_)(["search-head",t.layout,t.pageWidth])},[(0,n._)("div",l,[(0,n.Wm)(_,{value:m.key,"onUpdate:value":e[0]||(e[0]=function(t){return m.key=t}),class:"search-ipt",onSearch:e[1]||(e[1]=function(t){return y.search()}),placeholder:t.$t("Please input")+"...",size:"large"},null,8,["value","placeholder"])]),(0,n.Wm)(W,{bordered:!1,class:"search-form"},{default:(0,n.w5)((function(){return[(0,n._)("div",r,[(0,n._)("div",s,[(0,n.Wm)(b,null,{default:(0,n.w5)((function(){return[(0,n._)("div",c,[(0,n._)("div",u,[(0,n._)("span",null,(0,i.zw)(t.$t("Card View")),1)]),(0,n._)("div",p,[(0,n.Wm)($,null,{default:(0,n.w5)((function(){return[(0,n.Wm)(k,{size:"small",onChange:y.changeView,value:m.viewtypevalue,"onUpdate:value":e[2]||(e[2]=function(t){return m.viewtypevalue=t}),"button-style":"solid"},{default:(0,n.w5)((function(){return[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(m.viewtype,(function(e,a){return(0,n.wg)(),(0,n.j4)(j,{value:e.value,key:a},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,i.zw)(t.$t(e.label)),1)]})),_:2},1032,["value"])})),128))]})),_:1},8,["onChange","value"]),m.viewtypeproject?((0,n.wg)(),(0,n.j4)(z,{key:0,class:"ml-10",closable:"",onClose:y.removeViewtypeproject},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,i.zw)(m.viewtypeproject.name),1)]})),_:1},8,["onClose"])):(0,n.kq)("",!0)]})),_:1})])])]})),_:1})]),(0,n.wy)(((0,n.wg)(),(0,n.iD)("div",null,[(0,n.Wm)(N,{class:"pd-0 split-right",title:t.$t("Create application")},{body:(0,n.w5)((function(){return[(0,n._)("div",null,[(0,n.Wm)(C,{onClick:y.add,class:"font-primary icon-menu rotate-icon"},null,8,["onClick"])])]})),_:1},8,["title"])])),[[D,["application:create"]]])])]})),_:1})],2)]})),default:(0,n.w5)((function(){return[(0,n._)("div",d,[(0,n.wy)((0,n.Wm)(S,{gutter:[16,8],class:"mb-10"},{default:(0,n.w5)((function(){return[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(m.projects,(function(e,a){return(0,n.wg)(),(0,n.j4)(A,{key:a,span:4,onClick:function(t){return y.filterData(e)}},{default:(0,n.w5)((function(){return[(0,n._)("div",h,[(0,n._)("p",g,(0,i.zw)(e.name),1),(0,n._)("p",f,[(0,n.Uk)((0,i.zw)(t.$t("Application"))+" ",1),(0,n._)("span",v,(0,i.zw)(e.applications.length),1),(0,n.Uk)(" "+(0,i.zw)(t.$t("unitge")),1)])])]})),_:2},1032,["onClick"])})),128))]})),_:1},512),[[o.F8,1==m.viewtypevalue&&!m.viewtypeproject]]),(0,n.wy)((0,n.Wm)(P,{ref:"result",loading:m.loading,apps:m.apps,"page-no":m.pageNo,total:m.total,onSearch:y.search,"page-size":m.pageSize},null,8,["loading","apps","page-no","total","onSearch","page-size"]),[[o.F8,0==m.viewtypevalue||m.viewtypeproject]]),(0,n.wy)((0,n.Wm)(Z,{onChange:y.searchProject,current:m.pageNo,"onUpdate:current":e[3]||(e[3]=function(t){return m.pageNo=t}),total:m.total,"page-size":m.pageSize,"show-less-items":""},null,8,["onChange","current","total","page-size"]),[[o.F8,1==m.viewtypevalue&&!m.viewtypeproject]])])]})),_:1},8,["title"])}],["__scopeId","data-v-3cd215dd"]])},66022:function(t,e,a){a.d(e,{Z:function(){return p}});a(68309),a(74916),a(64765);var n=a(66252),i=a(3577),o={class:"search-content"},l={class:"mb-5"},r={class:"content"};a(57658);var s=a(60234),c=a(69596),u={name:"ApplicationListResults",i18n:a(89234),components:{CardList:c.Z},props:["apps","total","pageNo","pageSize","loading"],data:function(){return{BookmarkSvg:s,pageNoVal:0,key:"",projects:[]}},computed:{},watch:{pageNoVal:{deep:!0,handler:function(){this.$emit("update:pageNo",this.pageNoVal)}}},mounted:function(){this.pageNoVal=this.pageNo},methods:{detail:function(t,e,a){this.$router.push({path:"/openapi/application/detail/"+a.id})},remove:function(t,e,a){var n=this;this.$gql.mutation("deleteApplication(id:".concat(a.id,"){data{id}}")).then((function(){n.$message.success(n.$t("Deleted successfully"),3),n.search()}))},search:function(t,e,a){this.$emit("search",t,e,a)}}};var p=(0,a(83744).Z)(u,[["render",function(t,e,a,s,c,u){var p=(0,n.up)("a-tag"),d=(0,n.up)("a-avatar"),h=(0,n.up)("a-card-meta"),g=(0,n.up)("CardList"),f=(0,n.up)("a-pagination");return(0,n.wg)(),(0,n.iD)("div",o,[(0,n.Wm)(g,{"result-empty":{status:404,title:t.$t("No data")},loading:a.loading,"data-source":a.apps||[],"hide-action-title":!0,type:"component",actions:[{icon:"EditOutlined",text:t.$t("edit"),call:u.detail},{icon:"DeleteOutlined",text:t.$t("delete"),call:u.remove,hide:!0,permissionWhere:["application:delete:project:","project","application:delete"]}]},{default:(0,n.w5)((function(e){var a=e.item;return[(0,n.Wm)(h,null,{title:(0,n.w5)((function(){return[(0,n._)("div",l,[(0,n.Uk)((0,i.zw)(a.name)+" ",1),a.project?((0,n.wg)(),(0,n.j4)(p,{key:0,color:"pink",class:"result-tag"},{default:(0,n.w5)((function(){return[(0,n.Uk)((0,i.zw)(a.project.name),1)]})),_:2},1024)):(0,n.kq)("",!0)])]})),avatar:(0,n.w5)((function(){return[(0,n.Wm)(d,{class:"CodeSandboxOutlined avatar-img primary",size:"small",shape:"square",src:c.BookmarkSvg},null,8,["src"])]})),description:(0,n.w5)((function(){return[]})),_:2},1024),(0,n._)("div",r,[(0,n._)("div",null,[(0,n._)("p",null,"API "+(0,i.zw)(t.$t("Running")),1),(0,n._)("p",null,(0,i.zw)(a.apis?a.apis.length:0),1)]),(0,n._)("div",null,[(0,n._)("p",null,"API "+(0,i.zw)(t.$t("total")),1),(0,n._)("p",null,(0,i.zw)(a.apis?a.apis.length:0),1)])])]})),_:1},8,["result-empty","loading","data-source","actions"]),a.pageNo>=0?((0,n.wg)(),(0,n.j4)(f,{key:0,onChange:u.search,current:c.pageNoVal,"onUpdate:current":e[0]||(e[0]=function(t){return c.pageNoVal=t}),total:a.total,"page-size":a.pageSize,"show-less-items":""},null,8,["onChange","current","total","page-size"])):(0,n.kq)("",!0)])}],["__scopeId","data-v-1e49c432"]])}}]);