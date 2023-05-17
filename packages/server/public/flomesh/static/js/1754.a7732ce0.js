"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[1754],{11754:function(t,e,a){a.r(e),a.d(e,{default:function(){return c}});var i=a(66252),l=a(3577);const n=["onClick"],o=["onClick"],s={class:"list-content"},r={class:"list-content-item"};a(57658);var u=a(2692),p=a(99684),d={name:"List",i18n:a(89234),components:{MoreOutlined:u.Z,PlusCircleTwoTone:p.Z},data(){return{key:"",loading:!0,pageSize:10,pageNo:1,total:0,profiles:[]}},computed:{start(){return(this.pageNo-1)*this.pageSize}},created(){this.search()},methods:{remove(t){this.$gql.mutation(`deleteProfile(id:${t}){data{id}}`).then((()=>{this.$message.success(this.$t("Deleted successfully"),3),this.search()}))},detail(t){this.$router.push({path:"/flb/profile/detail/"+t})},newProfile(){this.$router.push({path:"/flb/profile/create"})},search(t,e){t&&(this.pageNo=t,this.pageSize=e),this.loading=!0;let a={name:{contains:this.key}};this.$gql.query(`profiles(filters: $filters, pagination:{start: ${this.start}, limit: ${this.pageSize}}){\n\t\t\t\t\t\tvalues{data{id,attributes{name,updatedAt}}},\n\t\t\t\t\t\tmeta{pagination{total}}\n\t\t\t\t\t}`,{filters:a},{filters:"ProfileFiltersInput"}).then((t=>{this.profiles=t.data,this.total=t.pagination.total,this.loading=!1}))}}};var c=(0,a(83744).Z)(d,[["render",function(t,e,a,u,p,d){const c=(0,i.up)("a-input-search"),h=(0,i.up)("a-divider"),m=(0,i.up)("PlusCircleTwoTone"),f=(0,i.up)("a-button"),w=(0,i.up)("a-list-item-meta"),g=(0,i.up)("a-menu-item"),_=(0,i.up)("a-popconfirm"),$=(0,i.up)("a-menu"),k=(0,i.up)("MoreOutlined"),v=(0,i.up)("a-dropdown"),z=(0,i.up)("a-list-item"),C=(0,i.up)("a-list"),W=(0,i.up)("a-card");return(0,i.wg)(),(0,i.iD)("div",null,[(0,i.Wm)(W,{bordered:!1,title:t.$t("profile")+t.$t("list"),loading:p.loading},{extra:(0,i.w5)((()=>[(0,i._)("div",null,[(0,i.Wm)(c,{value:p.key,"onUpdate:value":e[0]||(e[0]=t=>p.key=t),onSearch:e[1]||(e[1]=t=>d.search()),class:"right-search-input",placeholder:t.$t("search")},null,8,["value","placeholder"]),(0,i.Wm)(h,{type:"vertical"}),(0,i.Wm)(f,{type:"link",shape:"circle",onClick:d.newProfile},{icon:(0,i.w5)((()=>[(0,i.Wm)(m,{class:"font-20 icon-menu-sm rotate-icon"})])),_:1},8,["onClick"])])])),default:(0,i.w5)((()=>[(0,i.Wm)(C,{size:"large",pagination:{showSizeChanger:!0,showQuickJumper:!1,onShowSizeChange:d.search,onChange:d.search,current:p.pageNo,pageSize:p.pageSize,showTotal:(e,a)=>`${t.$t("Total")} ${e}`,total:p.total}},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(p.profiles,((e,a)=>((0,i.wg)(),(0,i.j4)(z,{key:a},{actions:(0,i.w5)((()=>[(0,i._)("div",null,[(0,i.Wm)(v,null,{overlay:(0,i.w5)((()=>[(0,i.Wm)($,null,{default:(0,i.w5)((()=>[(0,i.Wm)(g,null,{default:(0,i.w5)((()=>[(0,i._)("a",{onClick:t=>d.detail(e.id)},(0,l.zw)(t.$t("edit")),9,o)])),_:2},1024),(0,i.Wm)(g,null,{default:(0,i.w5)((()=>[(0,i.Wm)(_,{placement:"topLeft","ok-text":t.$t("Yes"),"cancel-text":t.$t("No"),onConfirm:t=>d.remove(e.id)},{title:(0,i.w5)((()=>[(0,i._)("p",null,(0,l.zw)(t.$t("Tip")),1),(0,i._)("p",null,(0,l.zw)(t.$t("Are you sure to delete this?")),1)])),default:(0,i.w5)((()=>[(0,i._)("a",null,(0,l.zw)(t.$t("delete")),1)])),_:2},1032,["ok-text","cancel-text","onConfirm"])])),_:2},1024)])),_:2},1024)])),default:(0,i.w5)((()=>[(0,i._)("a",null,[(0,i.Wm)(k)])])),_:2},1024)])])),default:(0,i.w5)((()=>[(0,i.Wm)(w,{description:"ID:"+e.id},{title:(0,i.w5)((()=>[(0,i._)("a",{onClick:t=>d.detail(e.id)},(0,l.zw)(e.name),9,n)])),_:2},1032,["description"]),(0,i._)("div",s,[(0,i._)("div",r,[(0,i._)("span",null,(0,l.zw)(t.$t("updTime")),1),(0,i._)("p",null,(0,l.zw)(e.updatedAt?new Date(e.updatedAt).toLocaleString():"-"),1)])])])),_:2},1024)))),128))])),_:1},8,["pagination"])])),_:1},8,["title","loading"])])}],["__scopeId","data-v-07217ccb"]])}}]);