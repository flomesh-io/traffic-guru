"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[9702],{49702:function(t,e,a){a.d(e,{Z:function(){return Z}});a(68309),a(92222);var i=a(66252),n=a(3577),s=a(49963),l={class:"mb-10"},r={class:"log-filter-title"},o={class:"flex"},u={class:"pl-30"},c={class:"flex-item2 pr-20"},d={key:0,class:"flex-item search-warpper"},h={class:"inline-block"},p={key:1,class:"inline-block"},g=["onClick"],f={class:"flex"},m={class:"flex-item pd-x-15"},v={key:0,class:"icon","aria-hidden":"true"},w=["xlink:href"],y={key:1,class:"icon","aria-hidden":"true"},k=[function(t){return(0,i.dD)("data-v-072864cc"),t=t(),(0,i.Cn)(),t}((function(){return(0,i._)("use",{"xlink:href":"#icon-info"},null,-1)}))],_=["onClick"],D={key:0},b={key:1},S={key:2},C={key:3};var q=a(95082),z=(a(41539),a(54747),a(57658),a(69600),a(57327),a(74916),a(15306),a(50128)),W=a(48551),$=a(49568),x=a(84471),V=a(26917),L=a(21936),M=a(87849),A=a(13471),E=a(33907),N=a(72167),T={" ":V.S6,AND:V.S6,OR:V.S6,and:V.S6,or:V.S6,"=":["http","tcp","GET","POST","PUT","DELETE"]},j={name:"LogViewer",i18n:a(89234),components:{DownOutlined:M.Z,FieldTimeOutlined:A.Z,JsonEditor:L.Z,MiniArea:W.Z,MiniBar:z.Z,MiniSector:$.Z},props:["type","uid","noSearch","params","logLevel","selected","hideChart","pageSize"],data:function(){return{pipy:null,logLevels:["None","Main","All"],logLevelVal:null,selectedVal:null,pipys:[],dateVal:[60,100],sqlDateMap:{0:"1 month",10:"15 day",20:"7 day",30:"3 day",40:"1 day",50:"12 hour",60:"6 hour",70:"1 hour",80:"30 minute",90:"5 minute",100:"1 second"},marks:{},name:"",date:"",log:"{}",arrow:"desc",visible:!1,select_keys:V.S6,WHERE_DATA:T,endDate:"",sortBy:"timestamp",prefix:" ",filter:"",loading:!0,tps:[],latency:[],status:[],statusColors:[],tpsCnt:0,pagging:{pageNo:1,total:0},data:[],key:[]}},computed:(0,q.Z)((0,q.Z)({},(0,E.rn)("setting",["layout","pageWidth"])),{},{datamarks:function(){return this.marks={0:"1"+this.$t(" Mths"),10:"15"+this.$t(" D"),20:"7"+this.$t(" D"),30:"3"+this.$t(" D"),40:"1"+this.$t(" D"),50:"12"+this.$t(" H"),60:"6"+this.$t(" H"),70:"1"+this.$t(" H"),80:"30"+this.$t(" M"),90:"5"+this.$t(" M"),100:this.$t(" At present")},this.marks}}),watch:{logLevelVal:{deep:!0,handler:function(){this.$emit("update:logLevel",this.logLevelVal)}}},created:function(){this.logLevelVal=this.logLevel,this.selectedVal=this.selected,this.getData()},methods:{changeSelected:function(t){var e=this;this.$emit("update:selected",t);var a=[];t.forEach((function(t){a.push(e.data[t])})),this.$emit("changeSelected",a)},emitSave:function(t){this.$emit("save",{logLevel:t.target.value})},onDateChange:function(t){this.dateVal=t,this.getData()},setPipy:function(t){this.pipy=t,this.getData()},getWhere:function(){var t=[];if(this.uid)switch(this.type){case"4lb":t.push("x_parameters.a4lbid ='".concat(this.uid,"'"));break;case"7lb":t.push("x_parameters.7lbid ='".concat(this.uid,"'"));break;case"api":t.push("x_parameters.aid ='".concat(this.uid,"'"));break;case"mesh":t.push("meshName ='".concat(this.params.name,"'"));break;case"service":t.push((0,V.lh)(null,this.params.name,this.params.namespace,this.params.domain));break;case"app":t.push("x_parameters.appid ='".concat(this.uid,"'"))}return this.pipy&&t.push("x_parameters.igid = '".concat(this.pipy.id,"'")),this.key&&t.push("message like '%".concat(this.key,"%'")),t.join(" AND ")},getData:function(t){var e=this;if(t&&(this.pagging.pageNo=t),this.loading=!0,this.data=[],this.filter=this.getWhere(),(0,V.hT)(this.pagging.pageNo,this.pageSize||10,this.filter,this.sortBy,this.arrow,null,null,this.sqlDateMap[this.dateVal[0]],this.sqlDateMap[this.dateVal[1]],this.type,this.uid).then((0,x.hw)((function(t,a){e.loading=!1,e.pagging.total=1*t.data,e.data=(0,V.OI)(a),e.logLevelVal=e.logLevel,e.selectedVal=e.selected}))).catch((function(t){})),this.$gql.query('fleets(filters:{type:{eq:"pipy"}}){data{id,attributes{name}}}').then((function(t){e.pipys=t.data})),!this.hideChart){(0,V.lD)(this.pagging.pageNo,this.pageSize||10,this.filter,this.sortBy,this.arrow,null,null,this.sqlDateMap[this.dateVal[0]],this.sqlDateMap[this.dateVal[1]],this.type,this.uid).then((function(t){var a=(0,V.tl)(t);e.latency=[],a.forEach((function(t){var a={};a.type=e.type,a.value=t[1],a.date=500*t[0]+"ms",e.latency.push(a)}))}));var a=["#8bd4a1","#8bd4a1","#8bd4a1","#fac858","#fb9690","#fb9690"];(0,V.NL)(this.pagging.pageNo,this.pageSize||10,this.filter,this.sortBy,this.arrow,null,null,this.sqlDateMap[this.dateVal[0]],this.sqlDateMap[this.dateVal[1]],this.type,this.uid).then((function(t){var i=(0,V.tl)(t);e.status=[],i.forEach((function(t){var i={};i.type=e.type,i.value=t[0],i.name=t[1],e.status.push(i),e.statusColors.push(a[1*(t[1]+"").substr(0,1)])}))})),(0,V.PT)(this.pagging.pageNo,this.pageSize||10,this.filter,this.sortBy,this.arrow,null,null,this.sqlDateMap[this.dateVal[0]],this.sqlDateMap[this.dateVal[1]],this.type,this.uid).then((0,x.hw)((function(t,a){var i=(0,V.tl)(t);e.tpsCnt=a.data,e.tps=[],i.forEach((function(t){var a={};a.type=e.type,a.value=t[0],a.date=(0,N.Z)(new Date(t[1]),"yyyy-MM-dd HH:mm"),e.tps.push(a)}))}))).catch((function(t){}))}},detail:function(t){this.visible=!0,this.log=(0,V.Ny)({data:t})},onSearch:function(){this.getData()},orderBy:function(t,e){this.sortBy=t.replace(/\./g,"_"),this.arrow=e,this.getData()},onClose:function(){this.visible=!1}}};var Z=(0,a(83744).Z)(j,[["render",function(t,e,a,q,z,W){var $=(0,i.up)("a-radio"),x=(0,i.up)("a-radio-group"),V=(0,i.up)("FieldTimeOutlined"),L=(0,i.up)("a-slider"),M=(0,i.up)("a-input-search"),A=(0,i.up)("a-divider"),E=(0,i.up)("DownOutlined"),N=(0,i.up)("a-menu-item"),T=(0,i.up)("a-menu"),j=(0,i.up)("a-dropdown"),Z=(0,i.up)("JsonEditor"),H=(0,i.up)("a-drawer"),B=(0,i.up)("a-tag"),P=(0,i.up)("a-list-item-meta"),O=(0,i.up)("a-checkbox"),U=(0,i.up)("a-list-item"),F=(0,i.up)("a-list"),R=(0,i.up)("a-checkbox-group"),Y=(0,i.up)("a-card"),J=(0,i.up)("a-col"),K=(0,i.up)("MiniSector"),G=(0,i.up)("MiniArea"),I=(0,i.up)("MiniBar"),Q=(0,i.up)("a-row");return(0,i.wg)(),(0,i.iD)(i.HY,null,[(0,i.wy)((0,i._)("div",l,[(0,i._)("span",r,(0,n.zw)(t.$t("Log Record Level"))+":",1),(0,i.Wm)(x,{onChange:W.emitSave,value:z.logLevelVal,"onUpdate:value":e[0]||(e[0]=function(t){return z.logLevelVal=t})},{default:(0,i.w5)((function(){return[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(z.logLevels,(function(e,a){return(0,i.wg)(),(0,i.j4)($,{key:a,value:e},{default:(0,i.w5)((function(){return[(0,i.Uk)((0,n.zw)(t.$t(e)),1)]})),_:2},1032,["value"])})),128))]})),_:1},8,["onChange","value"])],512),[[s.F8,z.logLevelVal]]),(0,i.Wm)(Q,{class:"row-mg"},{default:(0,i.w5)((function(){return[(0,i.Wm)(J,{class:"col-pd",xl:a.hideChart?24:16,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((function(){return[(0,i.Wm)(Y,{class:"search-content",loading:z.loading},{title:(0,i.w5)((function(){return[(0,i._)("div",o,[(0,i._)("div",u,[(0,i.Wm)(V,{class:"FieldTimeOutlined"})]),(0,i._)("div",c,[(0,i.Wm)(L,{range:"",class:"slider-dot",onChange:W.onDateChange,"tooltip-visible":!1,marks:W.datamarks,step:null,"default-value":z.dateVal},null,8,["onChange","marks","default-value"])]),a.noSearch?(0,i.kq)("",!0):((0,i.wg)(),(0,i.iD)("div",d,[(0,i._)("div",h,[(0,i.Wm)(M,{value:z.key,"onUpdate:value":e[1]||(e[1]=function(t){return z.key=t}),onSearch:W.onSearch,class:"right-search-input",placeholder:t.$t("search")},null,8,["value","onSearch","placeholder"])]),"api"==a.type?((0,i.wg)(),(0,i.j4)(A,{key:0,type:"vertical"})):(0,i.kq)("",!0),"api"==a.type?((0,i.wg)(),(0,i.iD)("div",p,[(0,i.Wm)(j,null,{overlay:(0,i.w5)((function(){return[(0,i.Wm)(T,null,{default:(0,i.w5)((function(){return[(0,i.Wm)(N,null,{default:(0,i.w5)((function(){return[(0,i._)("a",{href:"javascript:void(0);",onClick:e[3]||(e[3]=function(t){return W.setPipy(null)}),class:"uppercase"},(0,n.zw)(t.$t("All")),1)]})),_:1}),((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(z.pipys,(function(t,e){return(0,i.wg)(),(0,i.j4)(N,{key:e},{default:(0,i.w5)((function(){return[(0,i._)("a",{href:"javascript:void(0);",onClick:function(e){return W.setPipy(t)},class:"uppercase"},(0,n.zw)(t.name),9,g)]})),_:2},1024)})),128))]})),_:1})]})),default:(0,i.w5)((function(){return[(0,i._)("b",{class:"ant-dropdown-link font-primary uppercase",onClick:e[2]||(e[2]=(0,s.iM)((function(){}),["prevent"]))},[(0,i.Uk)((0,n.zw)(z.pipy&&z.pipy.name||t.$t("Pipy"))+" ",1),(0,i.Wm)(E)])]})),_:1})])):(0,i.kq)("",!0)]))])]})),default:(0,i.w5)((function(){return[(0,i._)("div",f,[z.visible?((0,i.wg)(),(0,i.j4)(H,{key:0,"get-container":!1,title:t.$t("log"),placement:"bottom",height:"600",closable:!1,visible:z.visible,onClose:W.onClose},{default:(0,i.w5)((function(){return[(0,i.Wm)(Z,{"is-readonly":!0,value:z.log},null,8,["value"])]})),_:1},8,["title","visible","onClose"])):(0,i.kq)("",!0),(0,i._)("div",m,[(0,i.Wm)(R,{onChange:W.changeSelected,value:z.selectedVal,"onUpdate:value":e[4]||(e[4]=function(t){return z.selectedVal=t}),style:{width:"100%"}},{default:(0,i.w5)((function(){return[(0,i.Wm)(F,{"item-layout":"vertical",pagination:{showSizeChanger:!1,showQuickJumper:!1,onShowSizeChange:W.getData,onChange:W.getData,current:z.pagging.pageNo,pageSize:a.pageSize||10,showTotal:function(e,a){return"".concat(t.$t("Total")," ").concat(e)},total:z.pagging.total}},{default:(0,i.w5)((function(){return[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(z.data,(function(t,e){return(0,i.wg)(),(0,i.j4)(U,{key:t},{actions:(0,i.w5)((function(){return[t["res.status"]>0?((0,i.wg)(),(0,i.iD)("span",D,"Status "+(0,n.zw)(t["res.status"]),1)):(0,i.kq)("",!0),(0,i._)("span",null,[(0,i.Wm)(V),(0,i.Uk)(" "+(0,n.zw)(t.timestamp),1)]),t.remoteAddr?((0,i.wg)(),(0,i.iD)("span",b,"Remote "+(0,n.zw)(t.remoteAddr)+" : "+(0,n.zw)(t.remotePort),1)):(0,i.kq)("",!0),t.localAddr?((0,i.wg)(),(0,i.iD)("span",S,"Local "+(0,n.zw)(t.localAddr)+" : "+(0,n.zw)(t.localPort),1)):(0,i.kq)("",!0),t.resSize&&t.resSize>0?((0,i.wg)(),(0,i.iD)("span",C,"Size:"+(0,n.zw)(t.resSize/1e3)+" kb ",1)):(0,i.kq)("",!0)]})),extra:(0,i.w5)((function(){return[null!=a.selected?((0,i.wg)(),(0,i.j4)(O,{key:0,value:e},null,8,["value"])):(0,i.kq)("",!0)]})),default:(0,i.w5)((function(){return[(0,i.Wm)(P,{class:"log-viewer-list-meta"},{avatar:(0,i.w5)((function(){return[1*t["res.status"]>=200&&1*t["res.status"]<600?((0,i.wg)(),(0,i.iD)("svg",v,[(0,i._)("use",{"xlink:href":["#icon-success","#icon-success","#icon-success","#icon-warning","#icon-error","#icon-error"][1*(t["res.status"]+"").substr(0,1)]},null,8,w)])):((0,i.wg)(),(0,i.iD)("svg",y,k))]})),title:(0,i.w5)((function(){return[(0,i._)("a",{href:"javascript:void(0)",class:"mr-16 pointer",onClick:function(e){return W.detail(t.message)}},(0,n.zw)(t["req.path"]||t["pod.name"]),9,_),t["req.method"]?((0,i.wg)(),(0,i.j4)(B,{key:0,color:"GET"==t["req.method"]?"green":"blue"},{default:(0,i.w5)((function(){return[(0,i.Uk)((0,n.zw)(t["req.method"]),1)]})),_:2},1032,["color"])):(0,i.kq)("",!0)]})),description:(0,i.w5)((function(){return[]})),_:2},1024)]})),_:2},1024)})),128))]})),_:1},8,["pagination"])]})),_:1},8,["onChange","value"])])])]})),_:1},8,["loading"])]})),_:1},8,["xl"]),a.hideChart?(0,i.kq)("",!0):((0,i.wg)(),(0,i.j4)(J,{key:0,class:"col-pd",xl:8,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((function(){return[(0,i.Wm)(Y,{class:"card mb-15 nopd",loading:z.loading,title:t.$t("Load Status")},{default:(0,i.w5)((function(){return[(0,i.Wm)(K,{colors:z.statusColors,dv:z.status,height:200,padding:[0,0,0,0]},null,8,["colors","dv"])]})),_:1},8,["loading","title"]),(0,i.Wm)(Y,{class:"card mb-15 nopd",loading:z.loading,title:t.$t("tps")},{default:(0,i.w5)((function(){return[(0,i.Wm)(G,{id:a.type,colors:["#8be4c1"],dv:z.tps,height:200,padding:[0,0,0,0],axis:!1,unit:"",showy:!1},null,8,["id","dv"])]})),_:1},8,["loading","title"]),(0,i.Wm)(Y,{class:"card nopd",loading:z.loading,title:t.$t("Latency")},{default:(0,i.w5)((function(){return[(0,i.Wm)(I,{colors:["#8be4c1"],id:a.type,dv:z.latency,height:200,padding:[0,0,0,0],showy:!1,axis:!1},null,8,["id","dv"])]})),_:1},8,["loading","title"])]})),_:1}))]})),_:1})],64)}],["__scopeId","data-v-072864cc"]])}}]);