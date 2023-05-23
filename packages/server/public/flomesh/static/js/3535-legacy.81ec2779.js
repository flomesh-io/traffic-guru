"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[3535],{3535:function(t,e,n){n.r(e),n.d(e,{default:function(){return h}});n(74916),n(64765),n(92222),n(2707),n(68309);var a=n(66252),i=n(3577),o={key:0},r=["onClick"],s=["onClick"],c={key:2};n(21249),n(38862),n(15306),n(41539),n(54747),n(57658);var l=n(21936),d=[{key:"user",dataIndex:["user","username"]},{key:"IP",dataIndex:"loginIp"},{key:"Action",dataIndex:"action"},{key:"as",dataIndex:"name"},{key:"updTime",sorter:!0,dataIndex:"updatedAt"},{key:"content",dataIndex:"data"}],u={name:"EventList",components:{JsonEditor:l.Z},i18n:n(89234),data:function(){return{key:"",keyAction:"",visible:!1,pageSize:10,pageNo:1,total:0,loading:!0,advanced:!0,sorter:"updatedAt",sortOrder:"end$desc",columns:d,events:[]}},computed:{dataColumns:function(){var t=this;return this.columns.map((function(e){return e.title=t.$t(e.key),e.sorter&&t.sorter==e.dataIndex&&(e.sortOrder=t.sortOrder),e}))},start:function(){return(this.pageNo-1)*this.pageSize}},created:function(){this.search()},methods:{sort:function(t,e,n){this.sorter=n.field,this.sortOrder=n.order,this.search()},onClose:function(){this.visible=!1},detail:function(t){this.visible=!0,this.log=JSON.stringify(t||{})},detailInterface:function(t){this.visible=!0,this.log=t},search:function(t,e){var n=this;t&&(this.pageNo=t,this.pageSize=e);var a={start:this.start,limit:this.pageSize};this.loading=!0;var i=this.keyAction.replace(/\s*/g,""),o={user:{username:{contains:this.key}},action:{contains:i}},r="updatedAt:desc";this.sorter&&this.sortOrder&&(r=(r=this.sortOrder.replace(/\$/g,"")).replace(/end/g,""),r="".concat(this.sorter,":").concat(r)),this.$gql.query('events(filters: $filters, pagination: $pagination, sort: "'.concat(r,'"){\n\t\t\t\t\t\tdata{id,attributes{\n\t\t\t\t\t\t\tupdatedAt,\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\taction,\n\t\t\t\t\t\t\tdata,\n\t\t\t\t\t\t\tloginIp,\n              content,\n              from,\n\t\t\t\t\t\t\tuser{data{id,attributes{username}}}\n\t\t\t\t\t\t}},\n\t\t\t\t\t\tmeta{pagination{total}}\n\t\t\t\t\t}'),{filters:o,pagination:a},{filters:"EventFiltersInput",pagination:"PaginationArg"}).then((function(t){n.events=t.data,t.data.forEach((function(t){t.actions=[],0==t.action.indexOf("create")?(t.actions.push("create"),t.actions.push(t.action.replace(/^create/,""))):0==t.action.indexOf("update")?(t.actions.push("update"),t.actions.push(t.action.replace(/^update/,""))):0==t.action.indexOf("delete")?(t.actions.push("delete"),t.actions.push(t.action.replace(/^delete/,""))):t.actions.push(t.action)})),n.total=t.pagination.total,n.loading=!1}))}}};var h=(0,n(83744).Z)(u,[["render",function(t,e,n,l,d,u){var h=(0,a.up)("a-input-search"),p=(0,a.up)("a-table"),g=(0,a.up)("a-card"),f=(0,a.up)("JsonEditor"),v=(0,a.up)("a-drawer");return(0,a.wg)(),(0,a.iD)("div",null,[(0,a.Wm)(g,{title:t.$t("Operating record"),class:"nopd",loading:d.loading},{extra:(0,a.w5)((function(){return[(0,a._)("div",null,[(0,a.Wm)(h,{value:d.keyAction,"onUpdate:value":e[0]||(e[0]=function(t){return d.keyAction=t}),onSearch:e[1]||(e[1]=function(t){return u.search()}),class:"right-search-input",style:{width:"200px"},placeholder:t.$t("search")+" "+t.$t("Action")},null,8,["value","placeholder"]),(0,a.Wm)(h,{value:d.key,"onUpdate:value":e[2]||(e[2]=function(t){return d.key=t}),onSearch:e[3]||(e[3]=function(t){return u.search()}),class:"right-search-input",style:{width:"200px"},placeholder:t.$t("search")+" "+t.$t("User")},null,8,["value","placeholder"])])]})),default:(0,a.w5)((function(){return[(0,a._)("div",null,[(0,a.Wm)(p,{columns:u.dataColumns,"data-source":d.events,pagination:{showSizeChanger:!0,showQuickJumper:!1,onShowSizeChange:u.search,onChange:u.search,current:d.pageNo,pageSize:d.pageSize,showTotal:function(e,n){return"".concat(t.$t("Total")," ").concat(e)},total:d.total},onChange:u.sort},{bodyCell:(0,a.w5)((function(e){var n=e.column,l=e.record;return["action"===n.dataIndex?((0,a.wg)(),(0,a.iD)(a.HY,{key:0},[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(l.actions,(function(t,e){return(0,a.wg)(),(0,a.iD)("b",{class:"mr-10",key:e},(0,i.zw)(t),1)})),128)),l.target?((0,a.wg)(),(0,a.iD)("div",o,[(0,a.Uk)((0,i.zw)(l.target.name)+" : [",1),(0,a._)("b",null,(0,i.zw)(l.target.id),1),(0,a.Uk)("] ")])):(0,a.kq)("",!0)],64)):"data"===n.dataIndex?((0,a.wg)(),(0,a.iD)(a.HY,{key:1},[(0,a._)("div",null,[(0,a._)("a",{onClick:function(t){return u.detailInterface(l.content)}},(0,i.zw)(t.$t("Interface")),9,r)]),(0,a._)("div",null,[(0,a._)("a",{onClick:function(t){return u.detail(l.data)}},(0,i.zw)(t.$t("Data")),9,s)])],64)):"updatedAt"===n.dataIndex?((0,a.wg)(),(0,a.iD)("div",c,(0,i.zw)(new Date(l.updatedAt).toLocaleString()),1)):(0,a.kq)("",!0)]})),_:1},8,["columns","data-source","pagination","onChange"])])]})),_:1},8,["title","loading"]),d.visible?((0,a.wg)(),(0,a.j4)(v,{key:0,"get-container":!1,title:t.$t("content"),placement:"bottom",height:"600",closable:!1,visible:d.visible,onClose:u.onClose},{default:(0,a.w5)((function(){return[(0,a.Wm)(f,{"is-readonly":!0,value:t.log},null,8,["value"])]})),_:1},8,["title","visible","onClose"])):(0,a.kq)("",!0)])}],["__scopeId","data-v-54da7cf8"]])}}]);