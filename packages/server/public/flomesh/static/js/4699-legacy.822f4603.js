"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[4699],{71900:function(t,e,a){a.d(e,{Z:function(){return u}});var n=a(66252),i=a(3577),o={class:"head-info"};var s={name:"HeadInfo",props:["title","content"]};var u=(0,a(83744).Z)(s,[["render",function(t,e,a,s,u,r){return(0,n.wg)(),(0,n.iD)("div",o,[(0,n._)("span",null,(0,i.zw)(a.title),1),(0,n._)("p",null,[(0,n.Uk)((0,i.zw)(a.content),1),(0,n.WI)(t.$slots,"body",{},void 0,!0)])])}],["__scopeId","data-v-00006846"]])},75444:function(t,e,a){a.r(e),a.d(e,{default:function(){return h}});a(47941);var n=a(66252),i=a(3577);var o=a(95082),s=(a(74916),a(64765),a(41539),a(54747),a(75505),a(87714),a(82801),a(1174),a(61103)),u=a(1299),r=a(33907),d=a(71900),l=a(13589),c=a(54140),f={name:"SecretsDetail",i18n:a(89234),components:{HeadInfo:d.Z,DetailListItem:l.Z,DetailList:u.Z,PageLayout:s.Z,DetailHeader:c.Z},data:function(){return{detail:{data:{},metadata:{labels:{},annotations:{}},typeMeta:{},podInfo:{},containerImages:[],selector:{},statusInfo:{},conditions:[],rollingUpdateStrategy:{}},loading:!0,pid:"",namespace:"",isMounted:!1,metrics:[]}},computed:(0,o.Z)({},(0,r.rn)("setting",["isMobile"])),created:function(){this.pid=this.$route.params.id||"",this.namespace=this.$route.params.namespace||localStorage.getItem("NAMESPACE")},mounted:function(){this.isMounted=!0,""!=this.pid?this.search():(this.detail={data:"",metadata:{labels:{},annotations:{}},typeMeta:{},podInfo:{},containerImages:[],selector:{},statusInfo:{},conditions:[],rollingUpdateStrategy:{}},this.loading=!1)},methods:{onTabChange:function(t){},search:function(){var t=this;this.loading=!0,this.$request(this.URL(),this.$METHOD.GET).then((function(e){t.detail=e.data,Object.keys(t.detail.data).forEach((function(e){t.detail.data[e]=t.decodeBase64(t.detail.data[e])})),t.loading=!1}))},URL:function(){var t="/"+this.pid;return this.$REST.K8S.encode(this.$REST.K8S.SECRET,t,this.namespace)},valid:function(){return!0},save:function(){this.valid()&&(""!=this.pid?(this.$message.success(this.$t("Save successfully"),3),this.$closePage(this.$route)):(this.$message.success(this.$t("Created successfully"),3),this.$closePage(this.$route)))},handleChange:function(){},decodeBase64:function(t){return decodeURIComponent(atob(t))}}};var h=(0,a(83744).Z)(f,[["render",function(t,e,a,o,s,u){var r=(0,n.up)("DetailHeader"),d=(0,n.up)("HeadInfo"),l=(0,n.up)("DetailListItem"),c=(0,n.up)("DetailList"),f=(0,n.up)("a-card"),h=(0,n.up)("a-tab-pane"),m=(0,n.up)("a-tabs"),p=(0,n.up)("a-col"),g=(0,n.up)("a-row"),w=(0,n.up)("PageLayout");return(0,n.wg)(),(0,n.j4)(w,{title:t.$t("Secrets")},(0,n.Nv)({headerContent:(0,n.w5)((function(){return[(0,n.Wm)(r,{d:s.detail},null,8,["d"])]})),action:(0,n.w5)((function(){return[]})),default:(0,n.w5)((function(){return[(0,n.Wm)(g,{class:"row-mg"},{default:(0,n.w5)((function(){return[(0,n.Wm)(p,{class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,n.w5)((function(){return[(0,n.Wm)(m,{type:"card"},{default:(0,n.w5)((function(){return[(0,n.Wm)(h,{key:"1",tab:t.$t("Overview")},{default:(0,n.w5)((function(){return[(0,n.Wm)(f,{class:"card mb-20",bordered:!1,loading:s.loading,title:t.$t("Resource Info")},{default:(0,n.w5)((function(){return[(0,n.Wm)(c,{size:"small",col:1},{default:(0,n.w5)((function(){return[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(Object.keys(s.detail.data),(function(e,a){return(0,n.wg)(),(0,n.j4)(l,{key:a,term:t.$t(e)},{default:(0,n.w5)((function(){return[(0,n._)("blockquote",null,(0,i.zw)(s.detail.data[e]),1)]})),_:2},1032,["term"])})),128))]})),_:1})]})),_:1},8,["loading","title"])]})),_:1},8,["tab"])]})),_:1})]})),_:1})]})),_:1})]})),_:2},[""!=s.pid?{name:"extra",fn:(0,n.w5)((function(){return[(0,n.Wm)(d,{title:t.$t("UID"),content:s.detail.metadata.uid},null,8,["title","content"])]})),key:"0"}:void 0]),1032,["title"])}]])}}]);