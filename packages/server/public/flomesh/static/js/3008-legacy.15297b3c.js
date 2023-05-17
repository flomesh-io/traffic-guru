"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[3008],{1299:function(e,t,a){a.d(t,{Z:function(){return u}});var i=a(66252),l=a(3577),n={key:0,class:"title"};a(9653);var s={name:"DetailList",props:{title:{type:String,required:!1,default:""},col:{type:Number,required:!1,default:3},size:{type:String,required:!1,default:"large"},layout:{type:String,required:!1,default:"horizontal"}}};var u=(0,a(83744).Z)(s,[["render",function(e,t,a,s,u,r){var c=(0,i.up)("a-row");return(0,i.wg)(),(0,i.iD)("div",{class:(0,l.C_)(["detail-list","small"===a.size?"small":"large","vertical"===a.layout?"vertical":"horizontal"]),style:(0,l.j5)("flex-"+a.col)},[a.title?((0,i.wg)(),(0,i.iD)("div",n,(0,l.zw)(a.title),1)):(0,i.kq)("",!0),(0,i.Wm)(c,null,{default:(0,i.w5)((function(){return[(0,i.WI)(e.$slots,"default")]})),_:3})],6)}]])},13589:function(e,t,a){a.d(t,{Z:function(){return r}});a(68309);var i=a(66252),l=a(3577),n={class:"detail-content"};a(21249);var s={1:{xs:24},2:{xs:24,sm:12},3:{xs:24,sm:12,md:8},4:{xs:24,sm:12,md:6}},u={name:"DetailListItem",i18n:a(39945),props:{name:{type:String,required:!1,default:""},rules:{type:Array,required:!1,default:function(){return[]}},term:{type:String,required:!1,default:""},termTop:{type:Boolean}},data:function(){return{col:2,responsive:s}},computed:{getRules:function(){var e=this;return this.rules.map((function(t){return t.message=e.$t(t.message),t})),this.rules}},created:function(){this.$parent&&this.$parent.$parent&&this.$parent.$parent.col>0&&(this.col=this.$parent.$parent.col)},methods:{}};var r=(0,a(83744).Z)(u,[["render",function(e,t,a,s,u,r){var c=(0,i.up)("a-form-item"),d=(0,i.up)("a-col");return(0,i.wg)(),(0,i.j4)(d,(0,i.dG)({class:"detail-list-content flex"},u.responsive[u.col]),{default:(0,i.w5)((function(){return[(0,i._)("div",{class:(0,l.C_)(a.termTop?"term top":"term")},(0,l.zw)(a.term),3),(0,i._)("div",n,[a.rules?((0,i.wg)(),(0,i.j4)(c,{key:0,name:a.name,rules:r.getRules},{default:(0,i.w5)((function(){return[(0,i.WI)(e.$slots,"default")]})),_:3},8,["name","rules"])):(0,i.WI)(e.$slots,"default",{key:1})])]})),_:3},16)}]])},79097:function(e,t,a){a.r(t),a.d(t,{default:function(){return h}});a(68309);var i=a(66252),l=a(3577);var n=a(95082),s=a(61103),u=a(1299),r=a(33907),c=a(50976),d=a(13589),o={name:"Detail",i18n:a(89234),components:{DetailListItem:d.Z,DetailList:u.Z,PageLayout:s.Z,AutoForm:c.Z},data:function(){return{type:"7",Active:[{label:"Active Healthcheck - Healthy",data:[[{label:"HTTP Statuses",value:[200,302]}]]},{label:"Active Healthcheck - Unhealthy",data:[[{label:"HTTP Statuses",value:[404,429,500,501,502,503,504,505]}]]}],Passive:[{label:"Passive Healthcheck - Healthy",data:[[{label:"HTTP Statuses",value:[200,201,202,203,204,205,206,300]}]]},{label:"Passive Healthcheck - Unhealthy",data:[[{label:"HTTP Statuses",value:[404,500,503]}]]}],visible:!1,visible2:!1,detail:{isActive:!0,content:[],name:""},loading:!0,logs:[],pid:"",param:{lbId:"",query:"",startTime:"",endTime:"",pageNo:1,pageSize:10},profiles:[],clusters:[],tps:[],activeTabKey:"2"}},computed:(0,n.Z)({},(0,r.rn)({rules:function(e){return e.rules.rules},isMobile:function(e){return e.setting.isMobile}})),created:function(){var e=this;this.pid=this.$route.params.id||"",""!=this.pid?(this.loading=!0,this.$gql.query("healthcheck(id: ".concat(this.pid,"){data{id,attributes{content,name,createdAt}}}")).then((function(t){e.detail=t.data,e.detail.isActive=!0,e.Active[0].data[0][0].value=e.detail.content.success,e.Active[1].data[0][0].value=e.detail.content.failure,e.loading=!1}))):(this.detail={isActive:!0,name:""},this.loading=!1)},methods:{onTabChange:function(e){},validForm:function(){return""==this.detail.name?(this.$message.error(this.$t("The name cannot be empty"),3),!1):0==this.Active[0].data[0][0].value.length?(this.$message.error(this.$t("The HTTP Statuses cannot be empty"),3),!1):0!=this.Active[1].data[0][0].value.length||(this.$message.error(this.$t("The HTTP Statuses cannot be empty"),3),!1)},valid:function(){var e=this;this.$refs.layout.$refs.form.validateFields().then((function(){e.save()})).catch((function(){}))},save:function(){var e=this;if(this.validForm()){var t={};this.detail.isActive?(t.success=this.Active[0].data[0][0].value,t.failure=this.Active[1].data[0][0].value):(t.success=this.Passive[0].data[0][0].value,t.failure=this.Passive[1].data[0][0].value),""!=this.pid?this.$gql.mutation("updateHealthcheck(id:".concat(this.pid,", data: $data){data{id}}"),{data:{name:this.detail.name,content:t}},{data:"HealthcheckInput!"}).then((function(){e.$message.success(e.$t("Save successfully"),3),e.$closePage(e.$route)})):this.$gql.mutation("createHealthcheck(data: $data){data{id}}",{data:{name:this.detail.name,content:t}},{data:"HealthcheckInput!"}).then((function(t){e.pid=t.data.id,e.$message.success(e.$t("Created successfully"),3),e.$closePage(e.$route)}))}},handleChange:function(){},hide:function(){this.visible=!1,this.save()}}};var h=(0,a(83744).Z)(o,[["render",function(e,t,a,n,s,u){var r=(0,i.up)("a-input"),c=(0,i.up)("DetailListItem"),d=(0,i.up)("a-switch"),o=(0,i.up)("a-typography-text"),h=(0,i.up)("DetailList"),f=(0,i.up)("a-button"),m=(0,i.up)("AutoForm"),v=(0,i.up)("a-card"),p=(0,i.up)("a-col"),g=(0,i.up)("a-row"),y=(0,i.up)("PageLayout");return(0,i.wg)(),(0,i.j4)(y,{title:s.detail.name?s.detail.name:e.$t("Healthcheck"),"form-state":s.detail,ref:"layout"},{headerContent:(0,i.w5)((function(){return[(0,i.Wm)(h,{size:"small",col:1},{default:(0,i.w5)((function(){return[(0,i.Wm)(c,{term:e.$t("as"),rules:e.rules.uniqueName("healthchecks",{id:s.pid}),name:"name"},{default:(0,i.w5)((function(){return[(0,i.Wm)(r,{placeholder:e.$t("unset"),value:s.detail.name,"onUpdate:value":t[0]||(t[0]=function(e){return s.detail.name=e}),class:"width-200"},null,8,["placeholder","value"])]})),_:1},8,["term","rules"]),(0,i.Wm)(c,{term:e.$t("Type")},{default:(0,i.w5)((function(){return[(0,i.Wm)(d,{size:"small",checked:s.detail.isActive,"onUpdate:checked":t[1]||(t[1]=function(e){return s.detail.isActive=e}),class:"a-switch"},null,8,["checked"]),(0,i.Wm)(o,{type:"secondary"},{default:(0,i.w5)((function(){return[(0,i.Uk)((0,l.zw)(s.detail.isActive?e.$t("Active Healthcheck"):e.$t("Passive Healthcheck")),1)]})),_:1})]})),_:1},8,["term"])]})),_:1})]})),action:(0,i.w5)((function(){return[(0,i.Wm)(f,{type:"primary",onClick:u.valid},{default:(0,i.w5)((function(){return[(0,i.Uk)((0,l.zw)(""!=s.pid?e.$t("save"):e.$t("create")),1)]})),_:1},8,["onClick"])]})),default:(0,i.w5)((function(){return[(0,i.Wm)(g,{class:"row-mg"},{default:(0,i.w5)((function(){return[s.detail.isActive?((0,i.wg)(),(0,i.j4)(p,{key:0,class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((function(){return[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(s.Active,(function(t,a){return(0,i.wg)(),(0,i.j4)(v,{key:a,class:"card mb-24",title:e.$t(t.label),bordered:!1,loading:s.loading},{default:(0,i.w5)((function(){return[(0,i.Wm)(m,{fields:t.data},null,8,["fields"])]})),_:2},1032,["title","loading"])})),128))]})),_:1})):(0,i.kq)("",!0),s.detail.isActive?(0,i.kq)("",!0):((0,i.wg)(),(0,i.j4)(p,{key:1,class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((function(){return[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(s.Passive,(function(t,a){return(0,i.wg)(),(0,i.j4)(v,{key:a,class:"card mb-24",title:e.$t(t.label),bordered:!1,loading:s.loading},{default:(0,i.w5)((function(){return[(0,i.Wm)(m,{fields:t.data},null,8,["fields"])]})),_:2},1032,["title","loading"])})),128))]})),_:1}))]})),_:1})]})),_:1},8,["title","form-state"])}],["__scopeId","data-v-35e2abac"]])}}]);