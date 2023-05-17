"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[3842],{9294:function(e,t,a){a.d(t,{Z:function(){return n}});var i=a(66252);var s=a(29764);(0,a(25552).H)({id:"javascript",extensions:[".js",".es6",".jsx",".mjs"],firstLine:"^#!.*\\bnode",filenames:["jakefile"],aliases:["JavaScript","javascript","js"],mimetypes:["text/javascript"],loader:function(){return a.e(6015).then(a.bind(a,6015))}});var l={name:"JsEditor",components:{monacoeditor:s.Z},props:["value","height","isReadonly","id","theme"],data(){return{code:"",cmOptions:{lineNumbers:!0,mode:"javascript",readOnly:!1,lint:!0}}},watch:{value(e,t){e!==t&&this.setValue()}},mounted(){this.setValue()},methods:{change(e){"string"==typeof e&&(this.$emit("update:value",e),this.$emit("change",e))},setValue(){null!=this.value.replace&&(this.code=this.value)}}};var n=(0,a(83744).Z)(l,[["render",function(e,t,a,s,l,n){const o=(0,i.up)("monacoeditor");return(0,i.wg)(),(0,i.iD)("div",null,[(0,i.Wm)(o,{id:a.id||"JsEditor",content:l.code,"onUpdate:content":t[0]||(t[0]=e=>l.code=e),option:l.cmOptions,onChange:n.change,height:a.height,theme:a.theme,"is-readonly":a.isReadonly},null,8,["id","content","option","onChange","height","theme","is-readonly"])])}]])},15199:function(e,t,a){a.d(t,{Z:function(){return y}});var i=a(66252),s=a(3577);const l={key:1},n={key:0},o={key:0},d=["onClick"],r={key:1},u=["onClick"],c={key:1},p=["onClick"],m={class:"pd-20"};a(57658);var h=a(44218),f=a(76550);const w=[{key:"Type",dataIndex:"type",id:"type",width:"20%"},{key:"IP Pool",dataIndex:"a",id:"a",width:"40%"},{key:"Action",id:"operation",dataIndex:"operation"}];var g={name:"IPList",i18n:a(89234),components:{PlusOutlined:h.Z,IPRange:f.Z},props:["list","title","fixedType"],data(){return{columns:w,options_keyset:["","0.0.0.x IP","0.0.0.x - 0.0.0.y IP","0.0.0.x/y IP","Fixed IP","::x - ::y IPv6","::x/y IPv6"],options:[{value:2,label:"0.0.0.x - 0.0.0.y IP"},{value:3,label:"0.0.0.x/y IP"},{value:5,label:"::x - ::y IPv6"},{value:6,label:"::x/y IPv6"}],address:[]}},computed:{dataColumns(){return this.fixedType&&"type"==this.columns[0].id&&this.columns.splice(0,1),this.columns.map((e=>(e.title=this.$t(e.key),e)))}},watch:{list(){this.address=this.list}},created(){this.address=this.list},methods:{newMember(){this.address.push({id:this.address.length+1,type:this.fixedType?this.fixedType:2,a:0,b:0,c:0,d:0,suffix:0,editable:!0,isNew:!0})},remove(e){this.address.filter((t=>t.id!==e)),this.address.splice(e,1)},saveRow(e){let t=this.address.filter((t=>t.id===e))[0];t.editable=!1,t.isNew=!1},toggle(e){let t=null,a=this.address.filter(((a,i)=>(a.id===e&&(t=i),a.id===e)))[0];a.editable=!a.editable,this.$set(this.address,t,a)},cancle(e){let t=null,a=this.address.filter(((a,i)=>(a.id===e&&(t=i),a.id===e)))[0];a.editable=!1,this.$set(this.address,t,a)},handleIpChange(e,t){const a=[...this.address],i=a.filter((e=>t===e.id))[0];i&&(i.a=e.a,i.b=e.b,i.c=e.c,i.d=e.d,i.suffix=e.suffix,this.address=a),this.$emit("update:list",this.address)},handleChange(e,t,a){const i=[...this.address],s=i.filter((e=>t===e.id))[0];s&&(5==s.type?(s.a="::ffff:0",s.suffix="ffff"):6==s.type&&(s.a="::ffff:0:0",s.suffix="120"),s[a]=e,this.address=i),this.$emit("update:list",this.address)},valid(){for(let e=0;e<this.address.length;e++){let t=this.address[e];if(t.type<=4&&(""===t.a||""===t.b||""===t.c))return this.$message.error(e+1+" row IP not set",3),!1;if(t.type>4&&""===t.a)return this.$message.error(e+1+" row IP not set",3),!1;if(!(2!=t.type&&5!=t.type||""!==t.d&&""!==t.suffix))return this.$message.error(e+1+" row IP not set",3),!1;if(!(3!=t.type&&6!=t.type||""!==t.d&&""!==t.suffix))return this.$message.error(e+1+" row IP not set",3),!1;if(4==t.type&&""===t.d)return this.$message.error(e+1+" row IP not set",3),!1;if(2==t.type&&1*t.d>=1*t.suffix)return this.$message.error(e+1+" invalid row IP segment range",3),!1}return!0}}};var y=(0,a(83744).Z)(g,[["render",function(e,t,a,h,f,w){const g=(0,i.up)("a-select-option"),y=(0,i.up)("a-select"),k=(0,i.up)("IPRange"),b=(0,i.up)("a-divider"),v=(0,i.up)("a-popconfirm"),$=(0,i.up)("a-table"),C=(0,i.up)("PlusOutlined"),_=(0,i.up)("a-button"),I=(0,i.up)("a-card");return(0,i.wg)(),(0,i.j4)(I,{class:"card nopd",bordered:!1,title:a.title},{default:(0,i.w5)((()=>[(0,i.Wm)($,{"row-key":"id",columns:w.dataColumns,"data-source":f.address,pagination:!1},{bodyCell:(0,i.w5)((({column:t,record:a,index:m})=>["type"===t.dataIndex?((0,i.wg)(),(0,i.iD)(i.HY,{key:0},[a.editable?((0,i.wg)(),(0,i.j4)(y,{key:0,class:"ip-selector width-200",value:a.type,"onUpdate:value":e=>a.type=e,onChange:e=>w.handleChange(a.type,a.id,"type")},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(f.options,((e,t)=>((0,i.wg)(),(0,i.j4)(g,{value:e.value,key:t},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.label),1)])),_:2},1032,["value"])))),128))])),_:2},1032,["value","onUpdate:value","onChange"])):((0,i.wg)(),(0,i.iD)("span",l,(0,s.zw)(f.options_keyset[a.type]),1))],64)):"a"===t.dataIndex?((0,i.wg)(),(0,i.j4)(k,{key:1,ip:a,editable:a.editable,type:a.type,onHandleChange:e=>w.handleIpChange(e,a.id)},null,8,["ip","editable","type","onHandleChange"])):"operation"===t.dataIndex?((0,i.wg)(),(0,i.iD)(i.HY,{key:2},[a.editable?((0,i.wg)(),(0,i.iD)("span",n,[a.isNew?((0,i.wg)(),(0,i.iD)("span",o,[(0,i._)("a",{onClick:e=>w.saveRow(a.id,!0)},(0,s.zw)(e.$t("Ok")),9,d),(0,i.Wm)(b,{type:"vertical"}),(0,i.Wm)(v,{title:e.$t("deleteConfirm"),onConfirm:e=>w.remove(m)},{default:(0,i.w5)((()=>[(0,i._)("a",null,(0,s.zw)(e.$t("delete")),1)])),_:2},1032,["title","onConfirm"])])):((0,i.wg)(),(0,i.iD)("span",r,[(0,i._)("a",{onClick:e=>w.cancle(a.id)},(0,s.zw)(e.$t("Ok")),9,u),(0,i.Wm)(b,{type:"vertical"}),(0,i.Wm)(v,{title:e.$t("deleteConfirm"),onConfirm:e=>w.remove(m)},{default:(0,i.w5)((()=>[(0,i._)("a",null,(0,s.zw)(e.$t("delete")),1)])),_:2},1032,["title","onConfirm"])]))])):((0,i.wg)(),(0,i.iD)("span",c,[(0,i._)("a",{onClick:e=>w.toggle(a.id)},(0,s.zw)(e.$t("edit")),9,p),(0,i.Wm)(b,{type:"vertical"}),(0,i.Wm)(v,{title:e.$t("deleteConfirm"),onConfirm:e=>w.remove(m)},{default:(0,i.w5)((()=>[(0,i._)("a",null,(0,s.zw)(e.$t("delete")),1)])),_:2},1032,["title","onConfirm"])]))],64)):(0,i.kq)("",!0)])),_:1},8,["columns","data-source"]),(0,i._)("div",m,[(0,i.Wm)(_,{class:"full",type:"dashed",onClick:w.newMember},{icon:(0,i.w5)((()=>[(0,i.Wm)(C)])),default:(0,i.w5)((()=>[(0,i.Uk)(" "+(0,s.zw)(e.$t("new")),1)])),_:1},8,["onClick"])])])),_:1},8,["title"])}],["__scopeId","data-v-72990012"]])},48397:function(e,t,a){a.r(t),a.d(t,{default:function(){return C}});var i=a(66252),s=a(3577),l=a(49963);const n={key:0},o={class:"font-primary",href:"javascript:void(0)"},d={key:1},r={class:"font-primary",href:"javascript:void(0)"},u={key:2};var c=a(21936),p=a(9294),m=a(61103),h=a(1299),f=a(13589),w=a(33907),g=a(15199),y=a(84722),k=a(44218),b=a(96486),v=a.n(b),$={name:"EgressDetail",i18n:a(89234),components:{JsEditor:p.Z,IPList:g.Z,JsonEditor:c.Z,DetailListItem:f.Z,DetailList:h.Z,PageLayout:m.Z,PlusOutlined:k.Z},data(){return{labelVisible:!1,labelValue:"",annotationVisible:!1,creationTimestamp:"-",annotationValue:"",pjsConfig:"",detail:{metadata:{name:"",protocol:"Socks",labels:{},annotations:{}},typeMeta:{},selector:{}},loading:!0,port:"",pid:"",namespace:"",whiteAddress:[],blackAddress:[],isMounted:!1,metrics:[]}},computed:{...(0,w.rn)({rules:e=>e.rules.rules,isMobile:e=>e.setting.isMobile})},created(){this.pid=this.$route.params.id||"",this.namespace=this.$route.params.namespace||localStorage.getItem("NAMESPACE"),this.getDefaultPjsConfig()},mounted(){this.isMounted=!0,""!=this.pid?this.search():(this.detail={metadata:{name:"",namespace:this.namespace,protocol:"Socks",labels:{},annotations:{}},typeMeta:{},selector:{}},this.loading=!1)},methods:{handleClose(e,t){delete e[t]},pjsChange(e){this.pjsConfig=e},getDefaultPjsConfig(){fetch("pipy-4lb.js").then((e=>e.text())).then((e=>{this.pjsConfig=e})).catch((e=>{}))},labelShowInput(){this.labelVisible=!0,this.$nextTick().then((()=>{this.$refs.labelRef.focus()}))},labelInputConfirm(){if(""==this.labelValue)return void(this.labelVisible=!1);let e=this.labelValue.split(":");e.length<2?this.$message.error({content:this.$t("Please enter the format of [key]:[value]")}):(this.detail.metadata.labels=this.detail.metadata.labels||{},this.detail.metadata.labels[e.shift()]=e.join(":"),this.labelValue="",this.labelVisible=!1)},annotationShowInput(){this.annotationVisible=!0,this.$nextTick().then((()=>{this.$refs.annotationRef.focus()}))},annotationInputConfirm(){if(""==this.annotationValue)return void(this.annotationVisible=!1);let e=this.annotationValue.split(":");e.length<2?this.$message.error({content:this.$t("Please enter the format of [key]:[value]")}):(this.detail.metadata.annotations=this.detail.metadata.annotations||{},this.detail.metadata.annotations[e.shift()]=e.join(":"),this.annotationValue="",this.annotationVisible=!1)},search(){this.loading=!0,this.$gql.query(`getEgress(id: ${this.pid}){data{id,attributes{content,createdAt}}}`).then((e=>{let t=e.data;this.loading=!1,this.creationTimestamp=new Date(t.createdAt).toLocaleString(),this.detail=t.content,"Socks"==this.detail.metadata.protocol&&(this.port=this.detail.socks.port,this.whiteAddress=(0,y.Oy)(this.detail.socks.whiteAddress),this.blackAddress=(0,y.Oy)(this.detail.socks.blackAddress))}))},valid(){return""==this.detail.metadata.name?(this.$message.error(this.$t("The name cannot be empty"),3),!1):"Socks"==this.detail.metadata.protocol&&""==this.port?(this.$message.error(this.$t("Port is required"),3),!1):"Socks"==this.detail.metadata.protocol&&isNaN(this.port)?(this.$message.error(this.$t("The port can only enter numbers"),3),!1):this.$refs.whiteip.valid()&&this.$refs.blackip.valid()},save(){if(!this.valid())return;let e=v().cloneDeep(this.detail);"Socks"==this.detail.metadata.protocol&&(e.socks={port:this.port,whiteAddress:(0,y.H)(this.whiteAddress),blackAddress:(0,y.H)(this.blackAddress)}),""!=this.pid?this.$gql.mutation(`updateEgressSync(id:${this.pid}, data: $data){data{id}}`,{data:{name:this.detail.metadata.name,content:e}},{data:"EgressInput!"}).then((()=>{this.$message.success(this.$t("Save successfully"),3),this.$closePage(this.$route)})):this.$gql.mutation("createEgressSync(data: $data){data{id}}",{data:{name:this.detail.metadata.name,content:e}},{data:"EgressInput!"}).then((e=>{this.pid=e.data.id,this.$message.success(this.$t("Created successfully"),3),this.$closePage(this.$route)}))},validate(){this.$refs.layout.$refs.form.validateFields().then((()=>{this.save()})).catch((()=>{}))}}};var C=(0,a(83744).Z)($,[["render",function(e,t,a,c,p,m){const h=(0,i.up)("DetailListItem"),f=(0,i.up)("a-input"),w=(0,i.up)("a-select-option"),g=(0,i.up)("a-select"),y=(0,i.up)("DetailList"),k=(0,i.up)("a-tag"),b=(0,i.up)("PlusOutlined"),v=(0,i.up)("a-tooltip"),$=(0,i.up)("JsonEditor"),C=(0,i.up)("a-popover"),_=(0,i.up)("a-button"),I=(0,i.up)("IPList"),P=(0,i.up)("a-col"),x=(0,i.up)("a-row"),W=(0,i.up)("a-card"),j=(0,i.up)("a-tab-pane"),V=(0,i.up)("JsEditor"),z=(0,i.up)("a-tabs"),D=(0,i.up)("PageLayout"),T=(0,i.Q2)("permission");return(0,i.wg)(),(0,i.j4)(D,{title:e.$t("Egress"),"form-state":p.detail.metadata,ref:"layout"},{headerContent:(0,i.w5)((()=>[(0,i.Wm)(y,{size:"small",col:1},{default:(0,i.w5)((()=>[""!=p.pid?((0,i.wg)(),(0,i.j4)(h,{key:0,term:e.$t("UID")},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(p.detail.metadata.uid),1)])),_:1},8,["term"])):(0,i.kq)("",!0),(0,i.Wm)(h,{term:e.$t("as"),rules:e.rules.name,name:"name"},{default:(0,i.w5)((()=>[(0,i.Wm)(f,{placeholder:e.$t("unset"),value:p.detail.metadata.name,"onUpdate:value":t[0]||(t[0]=e=>p.detail.metadata.name=e),class:"bold width-300"},null,8,["placeholder","value"])])),_:1},8,["term","rules"]),(0,i.Wm)(h,{term:e.$t("Namespace")},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(p.detail.metadata.namespace),1)])),_:1},8,["term"]),(0,i.Wm)(h,{term:e.$t("protocol")},{default:(0,i.w5)((()=>[(0,i.Wm)(g,{value:p.detail.metadata.protocol,"onUpdate:value":t[1]||(t[1]=e=>p.detail.metadata.protocol=e),class:"width-200"},{default:(0,i.w5)((()=>[(0,i.Wm)(w,{value:"HTTP"},{default:(0,i.w5)((()=>[(0,i.Uk)(" HTTP ")])),_:1}),(0,i.Wm)(w,{value:"Socks"},{default:(0,i.w5)((()=>[(0,i.Uk)(" Socks ")])),_:1}),(0,i.Wm)(w,{value:"TCP"},{default:(0,i.w5)((()=>[(0,i.Uk)(" TCP ")])),_:1})])),_:1},8,["value"])])),_:1},8,["term"]),p.pid?((0,i.wg)(),(0,i.j4)(h,{key:1,term:e.$t("Creation Timestamp")},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(p.creationTimestamp),1)])),_:1},8,["term"])):(0,i.kq)("",!0)])),_:1}),p.pid?((0,i.wg)(),(0,i.j4)(y,{key:0,size:"small",col:1},{default:(0,i.w5)((()=>[(0,i.Wm)(h,{term:e.$t("Labels")},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(Object.keys(p.detail.metadata.labels||[]),((e,t)=>((0,i.wg)(),(0,i.j4)(k,{key:t,onClose:t=>m.handleClose(p.detail.metadata.labels,e),closable:!0},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e)+":"+(0,s.zw)(p.detail.metadata.labels[e]),1)])),_:2},1032,["onClose"])))),128)),(0,i.wy)((0,i.Wm)(f,{ref:"labelRef",type:"text",size:"small",class:"width-100",placeholder:"[KEY:VALUE]",value:p.labelValue,"onUpdate:value":t[2]||(t[2]=e=>p.labelValue=e),onBlur:m.labelInputConfirm,onKeyup:(0,l.D2)(m.labelInputConfirm,["enter"])},null,8,["value","onBlur","onKeyup"]),[[l.F8,p.labelVisible]]),p.labelVisible?(0,i.kq)("",!0):((0,i.wg)(),(0,i.j4)(k,{key:0,onClick:m.labelShowInput,class:"dashed-tag"},{default:(0,i.w5)((()=>[(0,i.Wm)(b),(0,i.Uk)(" { {$t('add') }} ")])),_:1},8,["onClick"]))])),_:1},8,["term"]),(0,i.Wm)(h,{term:e.$t("Annotations")},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(Object.keys(p.detail.metadata.annotations||[]),((e,t)=>((0,i.wg)(),(0,i.j4)(k,{key:t,closable:!0,onClose:t=>m.handleClose(p.detail.metadata.annotations,e),class:"mb-5"},{default:(0,i.w5)((()=>["objectset.rio.cattle.io/applied"==e?((0,i.wg)(),(0,i.iD)("span",n,[(0,i.Wm)(v,{placement:"topLeft",title:p.detail.metadata.annotations[e]},{default:(0,i.w5)((()=>[(0,i._)("a",o,(0,s.zw)(e),1)])),_:2},1032,["title"])])):"kubectl.kubernetes.io/last-applied-configuration"==e?((0,i.wg)(),(0,i.iD)("span",d,[(0,i.Wm)(C,{trigger:"click",title:e},{content:(0,i.w5)((()=>[(0,i.Wm)($,{"is-json":!0,value:p.detail.metadata.annotations[e]},null,8,["value"])])),default:(0,i.w5)((()=>[(0,i._)("a",r,(0,s.zw)(e),1)])),_:2},1032,["title"])])):((0,i.wg)(),(0,i.iD)("span",u,(0,s.zw)(e)+":"+(0,s.zw)(p.detail.metadata.annotations[e]),1))])),_:2},1032,["onClose"])))),128)),(0,i.wy)((0,i.Wm)(f,{ref:"annotationRef",type:"text",size:"small",class:"width-100",placeholder:"[KEY:VALUE]",value:p.annotationValue,"onUpdate:value":t[3]||(t[3]=e=>p.annotationValue=e),onBlur:m.annotationInputConfirm,onKeyup:(0,l.D2)(m.annotationInputConfirm,["enter"])},null,8,["value","onBlur","onKeyup"]),[[l.F8,p.annotationVisible]]),p.annotationVisible?(0,i.kq)("",!0):((0,i.wg)(),(0,i.j4)(k,{key:0,onClick:m.annotationShowInput,class:"dashed-tag"},{default:(0,i.w5)((()=>[(0,i.Wm)(b),(0,i.Uk)(" "+(0,s.zw)(e.$t("add")),1)])),_:1},8,["onClick"]))])),_:1},8,["term"])])),_:1})):(0,i.kq)("",!0)])),action:(0,i.w5)((()=>[""!=p.pid?(0,i.wy)(((0,i.wg)(),(0,i.j4)(_,{key:0,type:"primary",onClick:m.validate},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.$t("save")),1)])),_:1},8,["onClick"])),[[T,["egress:update"]]]):(0,i.wy)(((0,i.wg)(),(0,i.j4)(_,{key:1,type:"primary",onClick:m.validate},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.$t("create")),1)])),_:1},8,["onClick"])),[[T,["egress:create"]]])])),default:(0,i.w5)((()=>[(0,i.Wm)(x,{class:"row-mg"},{default:(0,i.w5)((()=>[(0,i.Wm)(P,{class:"col-pd",xl:24,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((()=>[(0,i.Wm)(z,{type:"card"},{default:(0,i.w5)((()=>[(0,i.Wm)(j,{key:"1",tab:e.$t("Overview")},{default:(0,i.w5)((()=>["Socks"==p.detail.metadata.protocol?((0,i.wg)(),(0,i.j4)(W,{key:0,class:"card mb-20",bordered:!1,loading:p.loading,title:e.$t("Socks")},{default:(0,i.w5)((()=>[(0,i.Wm)(y,{size:"small",col:1},{default:(0,i.w5)((()=>[(0,i.Wm)(h,{term:e.$t("port")},{default:(0,i.w5)((()=>[(0,i.Wm)(f,{placeholder:e.$t("unset"),value:p.port,"onUpdate:value":t[4]||(t[4]=e=>p.port=e),class:"wdith-300"},null,8,["placeholder","value"])])),_:1},8,["term"])])),_:1}),(0,i.Wm)(x,{class:"row-mg"},{default:(0,i.w5)((()=>[(0,i.Wm)(P,{class:"col-pd",xl:12,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((()=>[(0,i.Wm)(I,{"fixed-type":4,title:e.$t("IP White List"),list:p.whiteAddress,ref:"whiteip"},null,8,["title","list"])])),_:1}),(0,i.Wm)(P,{class:"col-pd",xl:12,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((()=>[(0,i.Wm)(I,{"fixed-type":4,title:e.$t("IP Black List"),list:p.blackAddress,ref:"blackip"},null,8,["title","list"])])),_:1})])),_:1})])),_:1},8,["loading","title"])):(0,i.kq)("",!0),"HTTP"==p.detail.metadata.protocol?((0,i.wg)(),(0,i.j4)(W,{key:1,class:"card mb-20",bordered:!1,loading:p.loading,title:e.$t("HTTP")},null,8,["loading","title"])):(0,i.kq)("",!0),"TCP"==p.detail.metadata.protocol?((0,i.wg)(),(0,i.j4)(W,{key:2,class:"card mb-20",bordered:!1,loading:p.loading,title:e.$t("TCP")},null,8,["loading","title"])):(0,i.kq)("",!0)])),_:1},8,["tab"]),(0,i.Wm)(j,{key:"3",tab:e.$t("Strategy")},{default:(0,i.w5)((()=>[(0,i.Wm)(W,{class:"card mb-24",bordered:!1},{title:(0,i.w5)((()=>[(0,i.Wm)(_,{onClick:m.getDefaultPjsConfig},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.$t("reset")),1)])),_:1},8,["onClick"])])),default:(0,i.w5)((()=>[(0,i.Wm)(V,{value:p.pjsConfig,onInput:m.pjsChange},null,8,["value","onInput"])])),_:1})])),_:1},8,["tab"])])),_:1})])),_:1})])),_:1})])),_:1},8,["title","form-state"])}]])}}]);