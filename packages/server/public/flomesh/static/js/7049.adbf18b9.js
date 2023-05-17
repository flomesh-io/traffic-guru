"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[7049],{990:function(e,t,a){a.d(t,{Z:function(){return d}});var l=a(66252);const i={class:"DashboardCore"};var s=a(56912),n={name:"Dashboard",i18n:a(89234),components:{DashboardCore:s.Z},props:["pageId","prometheus","apply","params","hideAdd","init","defaultWidget"],data(){return{prometheusVal:null}},computed:{},watch:{prometheus(e){this.prometheusVal=e}},created(){},mounted(){this.prometheusVal=this.prometheus},methods:{prometheusChange(){this.$emit("update:prometheus",this.prometheusVal),this.$emit("prometheusChange",this.prometheusVal)}}};var d=(0,a(83744).Z)(n,[["render",function(e,t,a,s,n,d){const o=(0,l.up)("DashboardCore");return(0,l.wg)(),(0,l.iD)("div",i,[(0,l.Wm)(o,{"hide-add":a.hideAdd,init:a.init,"hide-head":!0,"page-id":a.pageId,params:a.params,kind:a.apply,prometheus:n.prometheusVal,"onUpdate:prometheus":t[0]||(t[0]=e=>n.prometheusVal=e),onPrometheusChange:d.prometheusChange,apply:a.apply+"."+a.pageId,embed:!0,"default-widget":a.defaultWidget},null,8,["hide-add","init","page-id","params","kind","prometheus","onPrometheusChange","apply","default-widget"])])}]])},16524:function(e,t,a){a.d(t,{Z:function(){return d}});var l=a(66252),i=a(3577),s=a(49963);var n={name:"TagList",components:{PlusOutlined:a(44218).Z},props:["placeholder","name","list","type"],i18n:a(89234),data(){return{value:"",visible:!1}},methods:{showInput(){this.visible=!0,this.$nextTick().then((()=>{this.$refs[this.name].focus()}))},handleClose(e){const t=this.list.filter((t=>t!==e));this.$emit("update:list",t),this.$emit("change",t)},inputConfirm(){if(""==this.value)return void(this.visible=!1);const e=[...this.list,this.value];this.value="",this.visible=!1,this.$emit("update:list",e),this.$emit("change",e)}}};var d=(0,a(83744).Z)(n,[["render",function(e,t,a,n,d,o){const r=(0,l.up)("a-tag"),c=(0,l.up)("a-input-number"),u=(0,l.up)("a-input"),p=(0,l.up)("PlusOutlined");return(0,l.wg)(),(0,l.iD)(l.HY,null,[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(a.list,((e,t)=>((0,l.wg)(),(0,l.j4)(r,{key:t,onClose:t=>o.handleClose(e),closable:!0},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(e),1)])),_:2},1032,["onClose"])))),128)),"number"==a.type?(0,l.wy)(((0,l.wg)(),(0,l.j4)(c,{key:0,min:0,ref:a.name,size:"small",class:"width-100",placeholder:a.placeholder,value:d.value,"onUpdate:value":t[0]||(t[0]=e=>d.value=e),onBlur:o.inputConfirm,onKeyup:(0,s.D2)(o.inputConfirm,["enter"])},null,8,["placeholder","value","onBlur","onKeyup"])),[[s.F8,d.visible]]):(0,l.wy)(((0,l.wg)(),(0,l.j4)(u,{key:1,ref:a.name,type:"text",size:"small",class:"width-100",placeholder:a.placeholder,value:d.value,"onUpdate:value":t[1]||(t[1]=e=>d.value=e),onBlur:o.inputConfirm,onKeyup:(0,s.D2)(o.inputConfirm,["enter"])},null,8,["placeholder","value","onBlur","onKeyup"])),[[s.F8,d.visible]]),d.visible?(0,l.kq)("",!0):((0,l.wg)(),(0,l.j4)(r,{key:2,onClick:o.showInput,class:"dashed-tag"},{default:(0,l.w5)((()=>[(0,l.Wm)(p),(0,l.Uk)(" "+(0,i.zw)(e.$t("add")),1)])),_:1},8,["onClick"]))],64)}]])},1299:function(e,t,a){a.d(t,{Z:function(){return d}});var l=a(66252),i=a(3577);const s={key:0,class:"title"};var n={name:"DetailList",props:{title:{type:String,required:!1,default:""},col:{type:Number,required:!1,default:3},size:{type:String,required:!1,default:"large"},layout:{type:String,required:!1,default:"horizontal"}}};var d=(0,a(83744).Z)(n,[["render",function(e,t,a,n,d,o){const r=(0,l.up)("a-row");return(0,l.wg)(),(0,l.iD)("div",{class:(0,i.C_)(["detail-list","small"===a.size?"small":"large","vertical"===a.layout?"vertical":"horizontal"]),style:(0,i.j5)("flex-"+a.col)},[a.title?((0,l.wg)(),(0,l.iD)("div",s,(0,i.zw)(a.title),1)):(0,l.kq)("",!0),(0,l.Wm)(r,null,{default:(0,l.w5)((()=>[(0,l.WI)(e.$slots,"default")])),_:3})],6)}]])},13589:function(e,t,a){a.d(t,{Z:function(){return o}});var l=a(66252),i=a(3577);const s={class:"detail-content"};const n={1:{xs:24},2:{xs:24,sm:12},3:{xs:24,sm:12,md:8},4:{xs:24,sm:12,md:6}};var d={name:"DetailListItem",i18n:a(39945),props:{name:{type:String,required:!1,default:""},rules:{type:Array,required:!1,default(){return[]}},term:{type:String,required:!1,default:""},termTop:{type:Boolean}},data(){return{col:2,responsive:n}},computed:{getRules(){return this.rules.map((e=>(e.message=this.$t(e.message),e))),this.rules}},created(){this.$parent&&this.$parent.$parent&&this.$parent.$parent.col>0&&(this.col=this.$parent.$parent.col)},methods:{}};var o=(0,a(83744).Z)(d,[["render",function(e,t,a,n,d,o){const r=(0,l.up)("a-form-item"),c=(0,l.up)("a-col");return(0,l.wg)(),(0,l.j4)(c,(0,l.dG)({class:"detail-list-content flex"},d.responsive[d.col]),{default:(0,l.w5)((()=>[(0,l._)("div",{class:(0,i.C_)(a.termTop?"term top":"term")},(0,i.zw)(a.term),3),(0,l._)("div",s,[a.rules?((0,l.wg)(),(0,l.j4)(r,{key:0,name:a.name,rules:o.getRules},{default:(0,l.w5)((()=>[(0,l.WI)(e.$slots,"default")])),_:3},8,["name","rules"])):(0,l.WI)(e.$slots,"default",{key:1})])])),_:3},16)}]])},90523:function(e,t,a){a.r(t),a.d(t,{default:function(){return E}});var l=a(66252),i=a(3577);const s={class:"absolute",style:{left:"30px","margin-top":"-10px"}};var n=a(990);const d={href:"#"},o={class:"breakall"},r={class:"list-content"},c={class:"list-content-item"},u={key:0},p={class:"list-content-item"};a(57658);var m=a(84471),h=a(2692),f=a(99684),g=a(22159),b={name:"NamespaceList",i18n:a(89234),components:{MoreOutlined:h.Z,PlusCircleTwoTone:f.Z,BorderOutlined:g.Z},props:["bindMesh","registry"],data(){return{key:"",pageSize:10,pageNo:1,total:0,addBindVal:[],loading:!0,list:[],allNamespaces:[]}},computed:{start(){return(this.pageNo-1)*this.pageSize}},created(){this.loadAll(),this.search()},methods:{addBind(){if(!this.addBindVal?.length)return;let e=[];for(let t of this.addBindVal){const a=this.$gql.mutation(`updateNamespace(id:${t}, data:{bindMesh: ${this.bindMesh}}){data{id}}`);e.push(a)}(0,m.TS)(e).then((0,m.hw)((()=>{this.addBindVal=[],this.$message.success(this.$t("Bind successfully"),3),this.$emit("change",{}),this.search(),this.loadAll()})))},remove(e){this.$gql.mutation(`updateNamespace(id:${e},data:{bindMesh:null}){data{id}}`).then((()=>{this.$message.success(this.$t("Unbind successfully"),3),this.$emit("change",{}),this.search(),this.loadAll()}))},newLb(){this.$router.push({path:"/flb/4lb/create"})},detail(e){this.$router.push({path:"/flb/4lb/detail/"+e})},search(e,t){e&&(this.pageNo=e,this.pageSize=t);let a={start:this.start,limit:this.pageSize};this.loading=!0;const l={name:{contains:this.key},bindMesh:{id:{eq:this.bindMesh}},registry:{id:{eq:this.registry}}};this.$gql.query("namespaces(filters: $filters, pagination: $pagination){\n\t\t\t\t\t\tdata{id,attributes{\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\tregistry{data{id,attributes{name}}},\n\t\t\t\t\t\t\torganization{data{id,attributes{name}}},\n\t\t\t\t\t\t\tupdatedAt, \n\t\t\t\t\t\t\tmesh{data{id,attributes{name}}}, \n\t\t\t\t\t\t\tbindMesh{data{id,attributes{name}}}\n\t\t\t\t\t\t}},\n\t\t\t\t\t\tmeta{pagination{total}}\n\t\t\t\t\t}",{filters:l,pagination:a},{filters:"NamespaceFiltersInput",pagination:"PaginationArg"}).then((e=>{this.list=e.data,this.total=e.pagination.total,this.loading=!1}))},loadAll(){this.loading=!0;const e={bindMesh:{id:{null:!0}},registry:{id:{eq:this.registry}}};this.$gql.query(`namespaces( filters: $filters, pagination: {start: 0, limit: ${this.$DFT_LIMIT}} ){\n\t\t\t\t\t\tdata{id,attributes{\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\tregistry{data{id,attributes{name}}},\n\t\t\t\t\t\t\torganization{data{id,attributes{name}}},\n\t\t\t\t\t\t\tupdatedAt, \n\t\t\t\t\t\t\tmesh{data{id,attributes{name}}}, \n\t\t\t\t\t\t\tbindMesh{data{id,attributes{name}}}\n\t\t\t\t\t\t}},\n\t\t\t\t\t\tmeta{pagination{total}}\n\t\t\t\t\t}`,{filters:e},{filters:"NamespaceFiltersInput"}).then((e=>{this.allNamespaces=e.data}))}}},w=a(83744);var v=(0,w.Z)(b,[["render",function(e,t,a,s,n,m){const h=(0,l.up)("a-input-search"),f=(0,l.up)("a-divider"),g=(0,l.up)("a-select-option"),b=(0,l.up)("a-select"),w=(0,l.up)("PlusCircleTwoTone"),v=(0,l.up)("a-popconfirm"),y=(0,l.up)("BorderOutlined"),k=(0,l.up)("a-list-item-meta"),$=(0,l.up)("a-menu-item"),_=(0,l.up)("a-menu"),W=(0,l.up)("MoreOutlined"),P=(0,l.up)("a-dropdown"),C=(0,l.up)("a-tag"),x=(0,l.up)("a-list-item"),U=(0,l.up)("a-list"),M=(0,l.up)("a-card"),S=(0,l.Q2)("permission");return(0,l.wg)(),(0,l.iD)("div",null,[(0,l.Wm)(M,{bordered:!1,title:e.$t("Namespace"),loading:n.loading},{extra:(0,l.w5)((()=>[(0,l._)("div",null,[(0,l.Wm)(h,{value:n.key,"onUpdate:value":t[0]||(t[0]=e=>n.key=e),onSearch:t[1]||(t[1]=e=>m.search()),class:"right-search-input",placeholder:e.$t("search")},null,8,["value","placeholder"]),(0,l.Wm)(f,{type:"vertical"}),(0,l.Wm)(v,{"ok-text":e.$t("Add Bind"),onConfirm:m.addBind},{title:(0,l.w5)((()=>[(0,l._)("p",null,(0,i.zw)(e.$t("Please select namespace")),1),(0,l.Wm)(b,{class:"width-220",mode:"multiple","show-search":!1,value:n.addBindVal,"onUpdate:value":t[2]||(t[2]=e=>n.addBindVal=e),ref:"select"},{default:(0,l.w5)((()=>[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(n.allNamespaces,((e,t)=>((0,l.wg)(),(0,l.j4)(g,{value:e.id,key:t},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(e.name),1)])),_:2},1032,["value"])))),128))])),_:1},8,["value"])])),default:(0,l.w5)((()=>[(0,l.wy)(((0,l.wg)(),(0,l.iD)("a",d,[(0,l.Wm)(w,{class:"font-20 icon-menu-sm rotate-icon"})])),[[S,["mesh:update"]]])])),_:1},8,["ok-text","onConfirm"])])])),default:(0,l.w5)((()=>[(0,l.Wm)(U,{size:"large",pagination:{showQuickJumper:!1,onChange:m.search,current:n.pageNo,pageSize:n.pageSize,showTotal:(t,a)=>`${e.$t("Total")} ${t}`,total:n.total}},{default:(0,l.w5)((()=>[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(n.list,((t,a)=>((0,l.wg)(),(0,l.j4)(x,{key:a},{actions:(0,l.w5)((()=>[(0,l._)("div",null,[(0,l.Wm)(P,null,{overlay:(0,l.w5)((()=>[(0,l.Wm)(_,null,{default:(0,l.w5)((()=>[(0,l.Wm)($,null,{default:(0,l.w5)((()=>[(0,l.Wm)(v,{placement:"topLeft","ok-text":e.$t("Yes"),"cancel-text":e.$t("No"),onConfirm:e=>m.remove(t.id)},{title:(0,l.w5)((()=>[(0,l._)("p",null,(0,i.zw)(e.$t("Tip")),1),(0,l._)("p",null,(0,i.zw)(e.$t("Are you sure to delete this?")),1)])),default:(0,l.w5)((()=>[(0,l.wy)(((0,l.wg)(),(0,l.iD)("a",null,[(0,l.Uk)((0,i.zw)(e.$t("Unbind")),1)])),[[S,["mesh:update"]]])])),_:2},1032,["ok-text","cancel-text","onConfirm"])])),_:2},1024)])),_:2},1024)])),default:(0,l.w5)((()=>[(0,l._)("a",null,[(0,l.Wm)(W)])])),_:2},1024)])])),default:(0,l.w5)((()=>[(0,l.Wm)(k,{description:t.registry?.name},{avatar:(0,l.w5)((()=>[(0,l.Wm)(y,{class:"font-24 font-primary"})])),title:(0,l.w5)((()=>[(0,l._)("span",o,(0,i.zw)(t.name?t.name:"Unnamed"),1)])),_:2},1032,["description"]),(0,l._)("div",r,[(0,l._)("div",c,[t.bindMesh?((0,l.wg)(),(0,l.iD)("span",u,[(0,l.Wm)(C,null,{default:(0,l.w5)((()=>[(0,l.Uk)("Mesh:"+(0,i.zw)(t.bindMesh?.name),1)])),_:2},1024)])):(0,l.kq)("",!0)]),(0,l._)("div",p,[(0,l._)("span",null,(0,i.zw)(e.$t("updTime")),1),(0,l._)("p",null,(0,i.zw)(new Date(t.updatedAt).toLocaleString()),1)])])])),_:2},1024)))),128))])),_:1},8,["pagination"])])),_:1},8,["title","loading"])])}],["__scopeId","data-v-0c609d04"]]),y=a(13554),k=a(96486),$=a.n(k),_=a(61103),W=a(1299),P=a(13589),C=a(16524),x=a(49963);var U={name:"TagMap",components:{PlusOutlined:a(44218).Z},props:["placeholder","name","map"],i18n:a(89234),data(){return{value:"",visible:!1}},methods:{showInput(){this.visible=!0,this.$nextTick().then((()=>{this.$refs[this.name].focus()}))},handleClose(e){let t=this.map;delete t[e],this.$emit("update:map",t),this.$emit("change",t)},inputConfirm(){if(""==this.value)return void(this.visible=!1);let e=this.value.split(":");if(e.length<2)this.$message.error({content:this.$t("Please enter the format of [key]:[value]")});else{let t=this.map||{};t[e.shift()]=e.join(":"),this.value="",this.visible=!1,this.$emit("update:map",t),this.$emit("change",t)}}}};var M=(0,w.Z)(U,[["render",function(e,t,a,s,n,d){const o=(0,l.up)("a-tag"),r=(0,l.up)("a-input"),c=(0,l.up)("PlusOutlined");return(0,l.wg)(),(0,l.iD)(l.HY,null,[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(Object.keys(a.map||[]),((e,t)=>((0,l.wg)(),(0,l.j4)(o,{key:t,onClose:t=>d.handleClose(e),closable:!0},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(e)+":"+(0,i.zw)(a.map[e]),1)])),_:2},1032,["onClose"])))),128)),(0,l.wy)((0,l.Wm)(r,{ref:a.name,type:"text",size:"small",class:"width-100",placeholder:a.placeholder,value:n.value,"onUpdate:value":t[0]||(t[0]=e=>n.value=e),onBlur:d.inputConfirm,onKeyup:(0,x.D2)(d.inputConfirm,["enter"])},null,8,["placeholder","value","onBlur","onKeyup"]),[[x.F8,n.visible]]),n.visible?(0,l.kq)("",!0):((0,l.wg)(),(0,l.j4)(o,{key:0,onClick:d.showInput,class:"dashed-tag"},{default:(0,l.w5)((()=>[(0,l.Wm)(c),(0,l.Uk)(" "+(0,i.zw)(e.$t("add")),1)])),_:1},8,["onClick"]))],64)}]]),S=a(33907),z=a(47556),L=a(49702),D=a(16822),I={name:"MeshDetail",i18n:a(89234),components:{ServiceList:y.Z,NamespaceList:v,PageLayout:_.Z,DetailList:W.Z,DetailListItem:P.Z,LogViewer:L.Z,TagList:C.Z,TagMap:M,EmbedDashboard:n.Z,Status:D.Z},data(){return{DEFAULT_MESH_DETAIL:z.k5,activeKey:"1",detail:{name:"",prometheus:{id:null}},isEdit:!1,loading:!0,pid:""}},computed:{...(0,S.rn)({rules:e=>e.rules.rules,isMobile:e=>e.setting.isMobile})},created(){this.pid=this.$route.params.id||"",this.namespace=this.$route.params.namespace||""},mounted(){""!=this.pid?this.search():(this.detail={name:"",prometheus:{id:null},switchType:0,virtualServices:[]},this.loading=!1)},methods:{search(){this.loading=!0,this.$gql.query(`mesh(id:${this.pid}){data{id,attributes{\n\t\t\t\t\t\tconfig,\n\t\t\t\t\t\tfsmMessage,\n\t\t\t\t\t\tprometheus{data{id,attributes{name}}},\n\t\t\t\t\t\tnamespace{data{id,attributes{\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\tregistry{data{id,attributes{name}}}\n\t\t\t\t\t\t}}},\n\t\t\t\t\t\tstatus,\n\t\t\t\t\t\tname,\n\t\t\t\t\t\tbindNamespaces{data{id,attributes{name}}},\n\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t}}}`).then((e=>{this.detail=e.data,this.detail.prometheus=this.detail.prometheus||{id:null},this.loading=!1}))},prometheusChange(){""!=this.pid&&this.$gql.mutation(`updateMesh(id:${this.pid}, data: $data){data{id}}`,{data:{prometheus:this.detail.prometheus?.id}},{data:"MeshInput!"}).then((()=>{this.$message.success(this.$t("Save successfully"),3)}))},save(){let e=$().cloneDeep(this.detail);""!=this.pid&&this.$gql.mutation(`updateMesh(id:${this.pid}, data: $data){data{id}}`,{data:{config:e.config}},{data:"MeshInput!"}).then((()=>{this.$message.success(this.$t("Save successfully"),3),this.search()}))},validate(){this.$refs.layout.$refs.form.validateFields().then((()=>{this.save()})).catch((()=>{}))}}};var E=(0,w.Z)(I,[["render",function(e,t,a,n,d,o){const r=(0,l.up)("DetailListItem"),c=(0,l.up)("Status"),u=(0,l.up)("DetailList"),p=(0,l.up)("EmbedDashboard"),m=(0,l.up)("a-tab-pane"),h=(0,l.up)("NamespaceList"),f=(0,l.up)("ServiceList"),g=(0,l.up)("a-switch"),b=(0,l.up)("a-descriptions-item"),w=(0,l.up)("a-descriptions"),v=(0,l.up)("a-card"),y=(0,l.up)("a-input-number"),k=(0,l.up)("TagList"),$=(0,l.up)("a-col"),_=(0,l.up)("a-radio"),W=(0,l.up)("a-radio-group"),P=(0,l.up)("a-row"),C=(0,l.up)("a-input"),x=(0,l.up)("TagMap"),U=(0,l.up)("LogViewer"),M=(0,l.up)("a-button"),S=(0,l.up)("a-tabs"),z=(0,l.up)("PageLayout"),L=(0,l.Q2)("permission");return(0,l.wg)(),(0,l.j4)(z,{title:e.$t("Mesh Detail"),"form-state":d.detail,ref:"layout"},{headerContent:(0,l.w5)((()=>[(0,l.Wm)(u,{size:"small",col:1},{default:(0,l.w5)((()=>[d.detail.name?((0,l.wg)(),(0,l.j4)(r,{key:0,term:e.$t("Mesh")},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(d.detail.name),1)])),_:1},8,["term"])):(0,l.kq)("",!0),(0,l.Wm)(r,{term:e.$t("Mesh Config")},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(d.detail.config?.metadata?.name),1)])),_:1},8,["term"]),(0,l.Wm)(r,{term:e.$t("Namespace")},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(d.detail.namespace?d.detail.namespace?.registry?.name+"/"+d.detail.namespace?.name:"-"),1)])),_:1},8,["term"]),d.detail.status?.mcs?((0,l.wg)(),(0,l.j4)(r,{key:1,term:e.$t("MCS")},{default:(0,l.w5)((()=>[(0,l.Wm)(c,{d:{status:d.detail.status?.mcs,message:d.detail.fsmMessage}},null,8,["d"])])),_:1},8,["term"])):(0,l.kq)("",!0),(0,l.Wm)(r,{term:e.$t("Creation Timestamp")},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(new Date(d.detail.config?.metadata?.creationTimestamp).toLocaleString()),1)])),_:1},8,["term"])])),_:1})])),action:(0,l.w5)((()=>[])),default:(0,l.w5)((()=>[(0,l.Wm)(P,{class:"row-mg"},{default:(0,l.w5)((()=>[(0,l.Wm)($,{class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,l.w5)((()=>[""!=d.pid&&d.detail.namespace?((0,l.wg)(),(0,l.j4)(S,{key:0,type:"card",activeKey:d.activeKey,"onUpdate:activeKey":t[29]||(t[29]=e=>d.activeKey=e)},{rightExtra:(0,l.w5)((()=>[""!=d.pid&&"4"==d.activeKey?(0,l.wy)(((0,l.wg)(),(0,l.j4)(M,{key:0,type:"primary",onClick:o.validate},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(e.$t("save")),1)])),_:1},8,["onClick"])),[[L,["mesh:update"]]]):(0,l.kq)("",!0)])),default:(0,l.w5)((()=>[(0,l.Wm)(m,{key:"1",tab:e.$t("Dashboard")},{default:(0,l.w5)((()=>[(0,l.Wm)(p,{init:!1,"page-id":d.detail.namespace?.name+"-"+d.pid,apply:"mesh",params:{name:d.detail.name,where:"",mesh:d.pid,namespace:d.detail.namespace?.name,namespaceId:d.detail.namespace?.id,namespaces:d.detail.bindNamespaces,registry:d.detail.namespace?.registry.id},"default-widget":d.DEFAULT_MESH_DETAIL,"hide-add":"1"!=d.activeKey,prometheus:d.detail.prometheus.id,"onUpdate:prometheus":t[0]||(t[0]=e=>d.detail.prometheus.id=e),onPrometheusChange:o.prometheusChange},null,8,["page-id","params","default-widget","hide-add","prometheus","onPrometheusChange"])])),_:1},8,["tab"]),(0,l.Wm)(m,{key:"2",tab:e.$t("Bind Namespaces")},{default:(0,l.w5)((()=>[(0,l.Wm)(h,{registry:d.detail.namespace.registry.id,"bind-mesh":d.pid,onChange:o.search},null,8,["registry","bind-mesh","onChange"])])),_:1},8,["tab"]),(0,l.Wm)(m,{key:"3",tab:e.$t("Services")},{default:(0,l.w5)((()=>[(0,l.Wm)(f,{mode:"mesh",namespaces:d.detail.bindNamespaces,embed:!0,metric:!1,"has-search":!1},{extra:(0,l.w5)((()=>[])),_:1},8,["namespaces"])])),_:1},8,["tab"]),(0,l.Wm)(m,{key:"4",tab:e.$t("Mesh Config")},{default:(0,l.w5)((()=>[d.detail.config?((0,l.wg)(),(0,l.j4)(v,{key:0,title:e.$t("Feature Flags"),class:"card nopd"},{default:(0,l.w5)((()=>[(0,l.Wm)(w,{bordered:""},{default:(0,l.w5)((()=>[(0,l.Wm)(b,{label:e.$t("Async Proxy Service Mapping"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.featureFlags.enableAsyncProxyServiceMapping,"onUpdate:checked":t[1]||(t[1]=e=>d.detail.config.spec.featureFlags.enableAsyncProxyServiceMapping=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Egress Policy"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.featureFlags.enableEgressPolicy,"onUpdate:checked":t[2]||(t[2]=e=>d.detail.config.spec.featureFlags.enableEgressPolicy=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Sidecar Active Health Checks"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.featureFlags.enableSidecarActiveHealthChecks,"onUpdate:checked":t[3]||(t[3]=e=>d.detail.config.spec.featureFlags.enableSidecarActiveHealthChecks=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Ingress Backend Policy"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.featureFlags.enableIngressBackendPolicy,"onUpdate:checked":t[4]||(t[4]=e=>d.detail.config.spec.featureFlags.enableIngressBackendPolicy=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Retry Policy"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.featureFlags.enableRetryPolicy,"onUpdate:checked":t[5]||(t[5]=e=>d.detail.config.spec.featureFlags.enableRetryPolicy=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Snapshot Cache Mode"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.featureFlags.enableSnapshotCacheMode,"onUpdate:checked":t[6]||(t[6]=e=>d.detail.config.spec.featureFlags.enableSnapshotCacheMode=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("WASM Stats"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.featureFlags.enableWASMStats,"onUpdate:checked":t[7]||(t[7]=e=>d.detail.config.spec.featureFlags.enableWASMStats=e)},null,8,["checked"])])),_:1},8,["label"])])),_:1})])),_:1},8,["title"])):(0,l.kq)("",!0),d.detail.config?((0,l.wg)(),(0,l.j4)(v,{key:1,title:e.$t("Traffic"),class:"card mt-15 nopd"},{default:(0,l.w5)((()=>[(0,l.Wm)(w,{bordered:""},{default:(0,l.w5)((()=>[(0,l.Wm)(b,{label:e.$t("Egress"),span:2},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.traffic.enableEgress,"onUpdate:checked":t[8]||(t[8]=e=>d.detail.config.spec.traffic.enableEgress=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Permissive Traffic Policy Mode"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.traffic.enablePermissiveTrafficPolicyMode,"onUpdate:checked":t[9]||(t[9]=e=>d.detail.config.spec.traffic.enablePermissiveTrafficPolicyMode=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{span:3},{default:(0,l.w5)((()=>[(0,l._)("span",s,(0,i.zw)(e.$t("Inbound External Authorization")),1)])),_:1}),(0,l.Wm)(b,{label:e.$t("Enabled"),span:2},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.traffic.inboundExternalAuthorization.enable,"onUpdate:checked":t[10]||(t[10]=e=>d.detail.config.spec.traffic.inboundExternalAuthorization.enable=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Failure Mode Allow"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.traffic.inboundExternalAuthorization.failureModeAllow,"onUpdate:checked":t[11]||(t[11]=e=>d.detail.config.spec.traffic.inboundExternalAuthorization.failureModeAllow=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Stat Prefix"),span:2},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(d.detail.config.spec.traffic.inboundExternalAuthorization.statPrefix),1)])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Timeout")+"(s)",span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(y,{min:0,value:d.detail.config.spec.traffic.inboundExternalAuthorization.timeout,"onUpdate:value":t[12]||(t[12]=e=>d.detail.config.spec.traffic.inboundExternalAuthorization.timeout=e),placeholder:e.$t("unset")},null,8,["value","placeholder"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Inbound Port (Exclusion)"),span:2},{default:(0,l.w5)((()=>[(0,l.Wm)(k,{list:d.detail.config.spec.traffic.inboundPortExclusionList,"onUpdate:list":t[13]||(t[13]=e=>d.detail.config.spec.traffic.inboundPortExclusionList=e),name:"inboundPortExclusionList",placeholder:"Port"},null,8,["list"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Outbound Port (Exclusion)"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(k,{list:d.detail.config.spec.traffic.outboundPortExclusionList,"onUpdate:list":t[14]||(t[14]=e=>d.detail.config.spec.traffic.outboundPortExclusionList=e),name:"outboundPortExclusionList",placeholder:"Port"},null,8,["list"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Outbound IP Range (Exclusion)"),span:2},{default:(0,l.w5)((()=>[(0,l.Wm)(k,{list:d.detail.config.spec.traffic.outboundIPRangeExclusionList,"onUpdate:list":t[15]||(t[15]=e=>d.detail.config.spec.traffic.outboundIPRangeExclusionList=e),name:"outboundIPRangeExclusionList",placeholder:"0.0.0.0/n"},null,8,["list"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Outbound IP Range (Inclusion)"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(k,{list:d.detail.config.spec.traffic.outboundIPRangeInclusionList,"onUpdate:list":t[16]||(t[16]=e=>d.detail.config.spec.traffic.outboundIPRangeInclusionList=e),name:"outboundIPRangeInclusionList",placeholder:"0.0.0.0/n"},null,8,["list"])])),_:1},8,["label"])])),_:1})])),_:1},8,["title"])):(0,l.kq)("",!0),(0,l.Wm)(P,{class:"row-mg"},{default:(0,l.w5)((()=>[(0,l.Wm)($,{class:"col-pd",xl:12,lg:24,md:24,sm:24,xs:24},{default:(0,l.w5)((()=>[d.detail.config?((0,l.wg)(),(0,l.j4)(v,{key:0,title:e.$t("Certificate"),class:"card mt-15 nopd"},{default:(0,l.w5)((()=>[(0,l.Wm)(w,{bordered:""},{default:(0,l.w5)((()=>[(0,l.Wm)(b,{label:e.$t("Cert Key Bit Size"),span:3},{default:(0,l.w5)((()=>[(0,l.Wm)(y,{min:0,value:d.detail.config.spec.certificate.certKeyBitSize,"onUpdate:value":t[17]||(t[17]=e=>d.detail.config.spec.certificate.certKeyBitSize=e),placeholder:"Bit"},null,8,["value"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Service Cert Validity Duration")+"(h)",span:3},{default:(0,l.w5)((()=>[(0,l.Wm)(y,{min:0,value:d.detail.config.spec.certificate.serviceCertValidityDuration,"onUpdate:value":t[18]||(t[18]=e=>d.detail.config.spec.certificate.serviceCertValidityDuration=e),placeholder:"h"},null,8,["value"])])),_:1},8,["label"])])),_:1})])),_:1},8,["title"])):(0,l.kq)("",!0)])),_:1}),(0,l.Wm)($,{class:"col-pd",xl:12,lg:24,md:24,sm:24,xs:24},{default:(0,l.w5)((()=>[d.detail.config?((0,l.wg)(),(0,l.j4)(v,{key:0,title:e.$t("Observability"),class:"card mt-15 nopd"},{default:(0,l.w5)((()=>[(0,l.Wm)(w,{bordered:""},{default:(0,l.w5)((()=>[(0,l.Wm)(b,{label:e.$t("Log Level"),span:3},{default:(0,l.w5)((()=>[(0,l.Wm)(W,{value:d.detail.config.spec.observability.osmLogLevel,"onUpdate:value":t[19]||(t[19]=e=>d.detail.config.spec.observability.osmLogLevel=e),name:"radioGroup"},{default:(0,l.w5)((()=>[(0,l.Wm)(_,{value:"error"},{default:(0,l.w5)((()=>[(0,l.Uk)(" Error ")])),_:1}),(0,l.Wm)(_,{value:"info"},{default:(0,l.w5)((()=>[(0,l.Uk)(" Info ")])),_:1})])),_:1},8,["value"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Debug Server"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.observability.enableDebugServer,"onUpdate:checked":t[20]||(t[20]=e=>d.detail.config.spec.observability.enableDebugServer=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Tracing"),span:2},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.observability.tracing.enable,"onUpdate:checked":t[21]||(t[21]=e=>d.detail.config.spec.observability.tracing.enable=e)},null,8,["checked"])])),_:1},8,["label"])])),_:1})])),_:1},8,["title"])):(0,l.kq)("",!0)])),_:1})])),_:1}),d.detail.config?((0,l.wg)(),(0,l.j4)(v,{key:2,title:e.$t("Sidecar"),class:"card mt-15 nopd"},{default:(0,l.w5)((()=>[(0,l.Wm)(w,{bordered:""},{default:(0,l.w5)((()=>[(0,l.Wm)(b,{label:e.$t("Log Level"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(W,{value:d.detail.config.spec.sidecar.logLevel,"onUpdate:value":t[22]||(t[22]=e=>d.detail.config.spec.sidecar.logLevel=e),name:"radioGroup"},{default:(0,l.w5)((()=>[(0,l.Wm)(_,{value:"error"},{default:(0,l.w5)((()=>[(0,l.Uk)(" Error ")])),_:1}),(0,l.Wm)(_,{value:"info"},{default:(0,l.w5)((()=>[(0,l.Uk)(" Info ")])),_:1})])),_:1},8,["value"])])),_:1},8,["label"]),d.detail.config.spec.sidecar.localProxyMode?((0,l.wg)(),(0,l.j4)(b,{key:0,label:e.$t("Local Proxy Mode"),span:1},{default:(0,l.w5)((()=>[(0,l.Uk)((0,i.zw)(d.detail.config.spec.sidecar.localProxyMode),1)])),_:1},8,["label"])):(0,l.kq)("",!0),(0,l.Wm)(b,{label:e.$t("Privileged Init Container"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.sidecar.enablePrivilegedInitContainer,"onUpdate:checked":t[23]||(t[23]=e=>d.detail.config.spec.sidecar.enablePrivilegedInitContainer=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Config Resync Interval")+"(s)",span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(y,{min:0,value:d.detail.config.spec.sidecar.configResyncInterval,"onUpdate:value":t[24]||(t[24]=e=>d.detail.config.spec.sidecar.configResyncInterval=e),placeholder:e.$t("unset")},null,8,["value","placeholder"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Tls Protocol Version (Min)"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(C,{value:d.detail.config.spec.sidecar.tlsMinProtocolVersion,"onUpdate:value":t[25]||(t[25]=e=>d.detail.config.spec.sidecar.tlsMinProtocolVersion=e),placeholder:e.$t("unset")},null,8,["value","placeholder"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Tls Protocol Version (Max)"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(C,{value:d.detail.config.spec.sidecar.tlsMaxProtocolVersion,"onUpdate:value":t[26]||(t[26]=e=>d.detail.config.spec.sidecar.tlsMaxProtocolVersion=e),placeholder:e.$t("unset")},null,8,["value","placeholder"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Local DNS Proxy"),span:1},{default:(0,l.w5)((()=>[(0,l.Wm)(g,{checked:d.detail.config.spec.sidecar.localDNSProxy.enable,"onUpdate:checked":t[27]||(t[27]=e=>d.detail.config.spec.sidecar.localDNSProxy.enable=e)},null,8,["checked"])])),_:1},8,["label"]),(0,l.Wm)(b,{label:e.$t("Resources"),span:2},{default:(0,l.w5)((()=>[(0,l.Wm)(x,{map:d.detail.config.spec.sidecar.resources,"onUpdate:map":t[28]||(t[28]=e=>d.detail.config.spec.sidecar.resources=e),name:"resources",placeholder:"[key]:[value]"},null,8,["map"])])),_:1},8,["label"])])),_:1})])),_:1},8,["title"])):(0,l.kq)("",!0)])),_:1},8,["tab"]),""!=d.pid?((0,l.wg)(),(0,l.j4)(m,{key:"13",tab:e.$t("log")},{default:(0,l.w5)((()=>[(0,l.Wm)(U,{uid:d.pid,params:{name:d.detail.name},type:"mesh"},null,8,["uid","params"])])),_:1},8,["tab"])):(0,l.kq)("",!0)])),_:1},8,["activeKey"])):(0,l.kq)("",!0)])),_:1})])),_:1})])),_:1},8,["title","form-state"])}]])}}]);