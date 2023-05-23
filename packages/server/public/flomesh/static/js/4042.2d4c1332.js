"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[4042],{38718:function(t,e,i){i.d(e,{Z:function(){return g}});var a=i(66252),l=i(3577),n=i(87932);const s=(t=>((0,a.dD)("data-v-357cff26"),t=t(),(0,a.Cn)(),t))((()=>(0,a._)("img",{src:n,style:{width:"300px"}},null,-1))),d=["src"],o={key:1};var r=i(75255),u=i(54367),c=i(50976),p=i(1006),h=i(9294),m={name:"PluginConfig",i18n:i(89234),components:{AutoForm:c.Z,CheckOutlined:r.Z,CloseOutlined:u.Z,JsEditor:h.Z},props:["type","addText","plugins","disabled"],data(){return{DEFAULT_BASE_URL:p.DEFAULT_BASE_URL,tabList:[{key:"Config",tab:"Config"},{key:"Script",tab:"Script"}],loading:!0}},computed:{},watch:{plugins:{handler(){this.plugins&&this.plugins.forEach((t=>{t.content.tabVal||(t.content.tabVal="Config")}))},immediate:!0,deep:!0}},mounted(){},created(){this.loading=!1},methods:{onTabChange(t,e){this.plugins[e].content.tabVal=t},remove(t){this.plugins.splice(t,1)},add(){this.$emit("add",{})}}};var g=(0,i(83744).Z)(m,[["render",function(t,e,i,n,r,u){const c=(0,a.up)("a-button"),p=(0,a.up)("a-result"),h=(0,a.up)("CheckOutlined"),m=(0,a.up)("a-switch"),g=(0,a.up)("CloseOutlined"),v=(0,a.up)("AutoForm"),f=(0,a.up)("JsEditor"),y=(0,a.up)("a-card"),b=(0,a.Q2)("permission");return(0,a.wg)(),(0,a.iD)(a.HY,null,[0==i.plugins.length?((0,a.wg)(),(0,a.j4)(p,{key:0,title:t.$t("No data")},{icon:(0,a.w5)((()=>[s])),extra:(0,a.w5)((()=>[i.addText&&"service"==i.type?(0,a.wy)(((0,a.wg)(),(0,a.j4)(c,{key:0,disabled:i.disabled,type:"primary",onClick:u.add},{default:(0,a.w5)((()=>[(0,a.Uk)((0,l.zw)(t.$t(i.addText)),1)])),_:1},8,["disabled","onClick"])),[[b,["service:update"]]]):i.addText?((0,a.wg)(),(0,a.j4)(c,{key:1,disabled:i.disabled,type:"primary",onClick:u.add},{default:(0,a.w5)((()=>[(0,a.Uk)((0,l.zw)(t.$t(i.addText)),1)])),_:1},8,["disabled","onClick"])):(0,a.kq)("",!0)])),_:1},8,["title"])):(0,a.kq)("",!0),((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(i.plugins,((e,n)=>((0,a.wg)(),(0,a.j4)(y,{key:n,class:(0,l.C_)(["card mb-24","Script"==e.content.tabVal?"nopd":""]),"tab-list":r.tabList,"active-tab-key":e.content.tabVal,onTabChange:t=>u.onTabChange(t,n),bordered:!1,loading:r.loading},{customTab:(0,a.w5)((e=>[(0,a.Uk)((0,l.zw)(t.$t(e.key)),1)])),title:(0,a.w5)((()=>[e.icon?((0,a.wg)(),(0,a.iD)("img",{key:0,src:r.DEFAULT_BASE_URL+e.icon.url,alt:"avatar",class:"card-img"},null,8,d)):(0,a.kq)("",!0),(0,a.Uk)(" "+(0,l.zw)(e.name)+" ",1),e.content.displayName&&e.name!=e.content.displayName?((0,a.wg)(),(0,a.iD)("span",o," ( "+(0,l.zw)(e.content.displayName)+" ) ",1)):(0,a.kq)("",!0)])),extra:(0,a.w5)((()=>[(0,a.Wm)(m,{checked:e.enable,"onUpdate:checked":t=>e.enable=t,disabled:i.disabled},{checkedChildren:(0,a.w5)((()=>[(0,a.Wm)(h)])),unCheckedChildren:(0,a.w5)((()=>[])),_:2},1032,["checked","onUpdate:checked","disabled"]),(0,a.Wm)(g,{class:(0,l.C_)([i.disabled?"disabled":"","gray"]),onClick:t=>u.remove(n)},null,8,["class","onClick"])])),default:(0,a.w5)((()=>["Config"==e.content.tabVal?((0,a.wg)(),(0,a.iD)("div",{key:0,class:(0,l.C_)(i.disabled?"disabled":"")},[(0,a.Wm)(v,{fields:[e.content.fields],col:3},null,8,["fields"])],2)):((0,a.wg)(),(0,a.j4)(f,{key:1,"is-readonly":i.disabled,id:"pluginScript"+n,value:e.content.script,"onUpdate:value":t=>e.content.script=t},null,8,["is-readonly","id","value","onUpdate:value"]))])),_:2},1032,["class","tab-list","active-tab-key","onTabChange","loading"])))),128))],64)}],["__scopeId","data-v-357cff26"]])},9294:function(t,e,i){i.d(e,{Z:function(){return s}});var a=i(66252);var l=i(29764);(0,i(25552).H)({id:"javascript",extensions:[".js",".es6",".jsx",".mjs"],firstLine:"^#!.*\\bnode",filenames:["jakefile"],aliases:["JavaScript","javascript","js"],mimetypes:["text/javascript"],loader:function(){return i.e(6015).then(i.bind(i,6015))}});var n={name:"JsEditor",components:{monacoeditor:l.Z},props:["value","height","isReadonly","id","theme"],data(){return{code:"",cmOptions:{lineNumbers:!0,mode:"javascript",readOnly:!1,lint:!0}}},watch:{value(t,e){t!==e&&this.setValue()}},mounted(){this.setValue()},methods:{change(t){"string"==typeof t&&(this.$emit("update:value",t),this.$emit("change",t))},setValue(){null!=this.value.replace&&(this.code=this.value)}}};var s=(0,i(83744).Z)(n,[["render",function(t,e,i,l,n,s){const d=(0,a.up)("monacoeditor");return(0,a.wg)(),(0,a.iD)("div",null,[(0,a.Wm)(d,{id:i.id||"JsEditor",content:n.code,"onUpdate:content":e[0]||(e[0]=t=>n.code=t),option:n.cmOptions,onChange:s.change,height:i.height,theme:i.theme,"is-readonly":i.isReadonly},null,8,["id","content","option","onChange","height","theme","is-readonly"])])}]])},1299:function(t,e,i){i.d(e,{Z:function(){return d}});var a=i(66252),l=i(3577);const n={key:0,class:"title"};var s={name:"DetailList",props:{title:{type:String,required:!1,default:""},col:{type:Number,required:!1,default:3},size:{type:String,required:!1,default:"large"},layout:{type:String,required:!1,default:"horizontal"}}};var d=(0,i(83744).Z)(s,[["render",function(t,e,i,s,d,o){const r=(0,a.up)("a-row");return(0,a.wg)(),(0,a.iD)("div",{class:(0,l.C_)(["detail-list","small"===i.size?"small":"large","vertical"===i.layout?"vertical":"horizontal"]),style:(0,l.j5)("flex-"+i.col)},[i.title?((0,a.wg)(),(0,a.iD)("div",n,(0,l.zw)(i.title),1)):(0,a.kq)("",!0),(0,a.Wm)(r,null,{default:(0,a.w5)((()=>[(0,a.WI)(t.$slots,"default")])),_:3})],6)}]])},13589:function(t,e,i){i.d(e,{Z:function(){return o}});var a=i(66252),l=i(3577);const n={class:"detail-content"};const s={1:{xs:24},2:{xs:24,sm:12},3:{xs:24,sm:12,md:8},4:{xs:24,sm:12,md:6}};var d={name:"DetailListItem",i18n:i(39945),props:{name:{type:String,required:!1,default:""},rules:{type:Array,required:!1,default(){return[]}},term:{type:String,required:!1,default:""},termTop:{type:Boolean}},data(){return{col:2,responsive:s}},computed:{getRules(){return this.rules.map((t=>(t.message=this.$t(t.message),t))),this.rules}},created(){this.$parent&&this.$parent.$parent&&this.$parent.$parent.col>0&&(this.col=this.$parent.$parent.col)},methods:{}};var o=(0,i(83744).Z)(d,[["render",function(t,e,i,s,d,o){const r=(0,a.up)("a-form-item"),u=(0,a.up)("a-col");return(0,a.wg)(),(0,a.j4)(u,(0,a.dG)({class:"detail-list-content flex"},d.responsive[d.col]),{default:(0,a.w5)((()=>[(0,a._)("div",{class:(0,l.C_)(i.termTop?"term top":"term")},(0,l.zw)(i.term),3),(0,a._)("div",n,[i.rules?((0,a.wg)(),(0,a.j4)(r,{key:0,name:i.name,rules:o.getRules},{default:(0,a.w5)((()=>[(0,a.WI)(t.$slots,"default")])),_:3},8,["name","rules"])):(0,a.WI)(t.$slots,"default",{key:1})])])),_:3},16)}]])},71900:function(t,e,i){i.d(e,{Z:function(){return d}});var a=i(66252),l=i(3577);const n={class:"head-info"};var s={name:"HeadInfo",props:["title","content"]};var d=(0,i(83744).Z)(s,[["render",function(t,e,i,s,d,o){return(0,a.wg)(),(0,a.iD)("div",n,[(0,a._)("span",null,(0,l.zw)(i.title),1),(0,a._)("p",null,[(0,a.Uk)((0,l.zw)(i.content),1),(0,a.WI)(t.$slots,"body",{},void 0,!0)])])}],["__scopeId","data-v-00006846"]])},6496:function(t,e,i){i.r(e),i.d(e,{default:function(){return b}});var a=i(66252),l=i(3577),n=i(49963);const s=(t=>((0,a.dD)("data-v-aaedaf84"),t=t(),(0,a.Cn)(),t))((()=>(0,a._)("div",{class:"template-div"},null,-1))),d={key:0},o={key:1,class:"gray"};i(57658);var r=i(96486),u=i.n(r),c=i(38718),p=i(79954),h=i(61103),m=i(1299),g=i(33907),v=i(71900),f=i(13589),y={name:"PolicyDetail",i18n:i(89234),components:{HeadInfo:v.Z,DetailListItem:f.Z,DetailList:m.Z,PageLayout:h.Z,PluginConfig:c.Z,PluginList:p.Z},props:["embed","name"],data(){return{detail:{project:null,name:"",content:{plugins:[]}},projects:[],type:"Policy",visible:!1,labelVisible:!1,labelValue:"",visibleReview:!1,visibleRevise:!1,visibleDeploy:!1,visibleStop:!1,visibleRestart:!1,description1:"",description2:"",description3:"",description4:"",activeKey:"1",bindPolicy:null,visiblelog:!1,visibleEndpoint:!1,visibleProvider:!1,loading:!0,logloading:!0,swaggerLoading:!0,logs:[],log:"{}",pid:"",filter:"",params:{pageNo:1,pageSize:10,total:0},profiles:[],clusters:[],tps:[],tpsCnt:0,activeTabKey:"2"}},computed:{...(0,g.rn)({rules:t=>t.rules.rules,isMobile:t=>t.setting.isMobile})},created(){this.pid=this.$route.params.id||"",this.type="Policy",this.embed&&(this.pid="")},mounted(){this.$gql.query("projects{data{id,attributes{name}}}").then((t=>{this.projects=t.data})),""!=this.pid?(this.loading=!1,this.$gql.query(`policy(id: ${this.pid}){data{id,attributes{\n\t\t\t\t\t\tname,\n\t\t\t\t\t\tcontent,\n\t\t\t\t\t\tproject{data{id}},\n\t\t\t\t\t\tplugins{data{id,attributes{\n\t\t\t\t\t\t\tname,\n\t\t\t\t\t\t\ticon{data{id,attributes{url,previewUrl}}},\n\t\t\t\t\t\t\ttype{data{id,attributes{name}}},\n\t\t\t\t\t\t\tdesc,\n\t\t\t\t\t\t\tcontent\n\t\t\t\t\t\t}}},\n\t\t\t\t\t\tcreatedAt,\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}}}`).then((t=>{this.loading=!1,this.detail=t.data,this.detail.project=t.data.project.id,this.detail.content.plugins||(this.detail.content.plugins=[]);let e={};this.detail.content.plugins&&this.detail.content.plugins.forEach((t=>{e[t.id]=t,e[t.id].content.script||(e[t.id].content.script="")})),this.detail.content.plugins=[],this.detail.plugins&&this.detail.plugins.forEach((t=>{t.content.script=e[t.id].content.script,e[t.id]?(e[t.id].content.fields&&t.content.fields&&t.content.fields.forEach((i=>{e[t.id].content.fields.forEach((t=>{i.name==t.name&&(i.value=t.value)}))})),t.enable=e[t.id].enable):t.enable=!1,this.detail.content.plugins.push(t)}))}))):(this.detail={project:null,name:"",content:{plugins:[]}},this.loading=!1),this.embed&&(this.detail.name=this.name)},methods:{selectPlugin(t){this.detail.content.plugins.push({...t,switch:!0}),this.visible=!1,this.$message.success(this.$t("Added successfully"),3)},showPluginBox(){this.visible=!0},handleClose(t,e){delete t[e]},onTabChange(t){},valid(){return""!=this.detail.name||(this.$message.error(this.$t("The name cannot be empty"),3),!1)},validate(){this.$refs.layout.$refs.form.validateFields().then((()=>{this.save()})).catch((()=>{}))},save(){if(!this.valid())return;let t=u().cloneDeep(this.detail);delete t.createdAt,delete t.updatedAt,delete t.id,t.plugins=[],t.content.plugins&&t.content.plugins.forEach((e=>{t.plugins.push(e.id)})),""!=this.pid?this.$gql.mutation(`updatePolicy(id:${this.pid}, data: $data){data{id}}`,{data:t},{data:"PolicyInput!"}).then((()=>{this.$message.success(this.$t("Save successfully"),3),this.$closePage(this.$route)})):this.$gql.mutation("createPolicy(data: $data){data{id}}",{data:t},{data:"PolicyInput!"}).then((t=>{this.pid=t.data.id,this.$message.success(this.$t("Created successfully"),3),this.$closePage(this.$route)}))},handleChange(){},hide(){this.visible=!1}}};var b=(0,i(83744).Z)(y,[["render",function(t,e,i,r,u,c){const p=(0,a.up)("a-input"),h=(0,a.up)("DetailListItem"),m=(0,a.up)("a-select-option"),g=(0,a.up)("a-select"),v=(0,a.up)("DetailList"),f=((0,a.up)("HeadInfo"),(0,a.up)("a-button")),y=(0,a.up)("PluginConfig"),b=(0,a.up)("a-col"),w=(0,a.up)("a-row"),k=(0,a.up)("a-tab-pane"),$=(0,a.up)("a-tabs"),_=(0,a.up)("PluginList"),C=(0,a.up)("a-modal"),j=(0,a.up)("PageLayout"),P=(0,a.Q2)("permission");return(0,a.wg)(),(0,a.j4)(j,{"hide-breadcrumb":i.embed,title:i.embed?" ":u.detail.name?u.detail.name:t.$t("new")+t.$t("Policy"),"form-state":u.detail,ref:"layout"},(0,a.Nv)({headerContent:(0,a.w5)((()=>[s,(0,a.Wm)(v,{size:"small",col:1},{default:(0,a.w5)((()=>[i.embed?(0,a.kq)("",!0):((0,a.wg)(),(0,a.j4)(h,{key:0,term:t.$t("as"),rules:t.rules.uniqueName("policies",{id:u.pid,project:u.detail.project}),name:"name"},{default:(0,a.w5)((()=>[(0,a.Wm)(p,{placeholder:t.$t("unset"),value:u.detail.name,"onUpdate:value":e[0]||(e[0]=t=>u.detail.name=t),class:"width-200"},null,8,["placeholder","value"])])),_:1},8,["term","rules"])),(0,a.Wm)(h,{term:t.$t("Project"),rules:t.rules.required,name:"project"},{default:(0,a.w5)((()=>[(0,a.Wm)(g,{placeholder:t.$t("unallocated"),class:"width-200",value:u.detail.project,"onUpdate:value":e[1]||(e[1]=t=>u.detail.project=t),onChange:e[2]||(e[2]=t=>c.handleChange())},{default:(0,a.w5)((()=>[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(u.projects,((t,e)=>((0,a.wg)(),(0,a.j4)(m,{key:e,value:t.id},{default:(0,a.w5)((()=>[t.id?((0,a.wg)(),(0,a.iD)("span",d,(0,l.zw)(t.name),1)):(0,a.kq)("",!0),t.id?(0,a.kq)("",!0):((0,a.wg)(),(0,a.iD)("i",o,(0,l.zw)(t.name),1))])),_:2},1032,["value"])))),128))])),_:1},8,["placeholder","value"])])),_:1},8,["term","rules"])])),_:1})])),default:(0,a.w5)((()=>[(0,a.Wm)(w,{class:"row-mg"},{default:(0,a.w5)((()=>[(0,a.Wm)(b,{class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)($,{type:"card",activeKey:u.activeKey,"onUpdate:activeKey":e[4]||(e[4]=t=>u.activeKey=t)},{rightExtra:(0,a.w5)((()=>[(0,a.wy)((0,a.Wm)(f,{type:"primary",onClick:c.showPluginBox},{default:(0,a.w5)((()=>[(0,a.Uk)((0,l.zw)(t.$t("Add Plugin")),1)])),_:1},8,["onClick"]),[[n.F8,u.detail.content.plugins.length>0]])])),default:(0,a.w5)((()=>[(0,a.Wm)(k,{key:"1",tab:t.$t("Policy")},{default:(0,a.w5)((()=>[(0,a.Wm)(w,{class:"row-mg"},{default:(0,a.w5)((()=>[(0,a.Wm)(b,{class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,a.w5)((()=>[(0,a._)("div",null,[(0,a.Wm)(y,{plugins:u.detail.content.plugins,"onUpdate:plugins":e[3]||(e[3]=t=>u.detail.content.plugins=t),onAdd:c.showPluginBox,"add-text":"Add Plugin"},null,8,["plugins","onAdd"])])])),_:1})])),_:1})])),_:1},8,["tab"])])),_:1},8,["activeKey"])])),_:1})])),_:1}),(0,a.Wm)(C,{footer:null,width:800,visible:u.visible,"onUpdate:visible":e[5]||(e[5]=t=>u.visible=t),title:t.$t("Add Plugin"),onOk:t.handleOk},{default:(0,a.w5)((()=>[(0,a.Wm)(_,{onSelectPlugin:c.selectPlugin,"hide-head":!0},null,8,["onSelectPlugin"])])),_:1},8,["visible","title","onOk"])])),_:2},[void 0,i.embed?void 0:{name:"action",fn:(0,a.w5)((()=>[""!=u.pid?(0,a.wy)(((0,a.wg)(),(0,a.j4)(f,{key:0,type:"default",onClick:c.validate},{default:(0,a.w5)((()=>[(0,a.Uk)((0,l.zw)(t.$t("save")),1)])),_:1},8,["onClick"])),[[P,["policy:update"]]]):(0,a.wy)(((0,a.wg)(),(0,a.j4)(f,{key:1,type:"primary",onClick:c.validate},{default:(0,a.w5)((()=>[(0,a.Uk)((0,l.zw)(t.$t("create")),1)])),_:1},8,["onClick"])),[[P,["policy:create"]]])])),key:"1"}]),1032,["hide-breadcrumb","title","form-state"])}],["__scopeId","data-v-aaedaf84"]])}}]);