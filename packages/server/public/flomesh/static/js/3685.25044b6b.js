"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[3685],{53685:function(e,a,t){t.r(a),t.d(a,{default:function(){return F}});var l=t(66252),s=t(3577),r=t(49963);const i=e=>((0,l.dD)("data-v-4b6953bb"),e=e(),(0,l.Cn)(),e),o={class:"search-input"},n=["innerHTML"],d={class:"form-row"},u={class:"label"},c={class:"content flex"},p={class:"flex-item"},w=i((()=>(0,l._)("em",null," ~ ",-1))),m={class:"flex-item font-right"},g={class:"sortby"},h=["onClick"],_={key:0,class:"icon square-30","aria-hidden":"true"},v=["xlink:href"],f={key:1,class:"icon square-30","aria-hidden":"true"},k=[i((()=>(0,l._)("use",{"xlink:href":"#icon-info"},null,-1)))],b={href:"javascript:void(0)"},y={class:"content"},D={class:"flex"},z={class:"flex-item"},S={key:0},W={key:1},C={key:0},q=i((()=>(0,l._)("b",null,"Service",-1))),x=i((()=>(0,l._)("b",null,"Headers",-1))),T={key:0,class:"relative",style:{top:"5px"}},U={key:1},$={class:"flex-item"},B={key:0},P=i((()=>(0,l._)("em",null," ~ ",-1))),j={key:1},H=i((()=>(0,l._)("b",null,"Pod",-1))),L={key:0},A={key:1};var E=t(84471),O=t(26917),Y=t(21936),M=t(87849),N=t(13471),R=t(49506),Z=t(33907),J=t(61103);const K={" ":O.S6,AND:O.S6,OR:O.S6,and:O.S6,or:O.S6,"=":["http","tcp","GET","POST","PUT","DELETE"]};var I={name:"LogList",i18n:t(89234),components:{DownOutlined:M.Z,PageLayout:J.Z,FieldTimeOutlined:N.Z,SearchOutlined:R.Z,JsonEditor:Y.Z},data(){return{date:"",endDate:"",log:"{}",arrow:"desc",visible:!1,select_keys:O.S6,WHERE_DATA:K,sortBy:"timestamp",prefix:" ",filter:"",loading:!0,params:{pageNo:1,pageSize:10,total:0},data:[]}},computed:{...(0,Z.rn)("setting",["layout","pageWidth"])},created(){this.getData()},methods:{getParse(e){return JSON.parse(e.replace(/\\\\"/g,"'"))},getData(e,a){e&&(this.params.pageNo=e,this.params.pageSize=a),this.loading=!0,this.data=[],(0,O.hT)(this.params.pageNo,this.params.pageSize,this.filter,this.sortBy,this.arrow,this.date,this.endDate).then((0,E.hw)(((e,a)=>{this.loading=!1,this.params.total=1*e.data,this.data=(0,O.OI)(a)}))).catch((e=>{}))},detail(e){this.visible=!0,this.log=(0,O.Ny)({data:e})},onSearch(e,a){this.prefix=a},orderBy(e,a){this.sortBy=e.replace(/\./g,"_"),this.arrow=a,this.getData()},onClose(){this.visible=!1}}};var F=(0,t(83744).Z)(I,[["render",function(e,a,t,i,E,O){const Y=(0,l.up)("a-mentions-option"),M=(0,l.up)("a-mentions"),N=(0,l.up)("SearchOutlined"),R=(0,l.up)("a-button"),Z=(0,l.up)("a-date-picker"),J=(0,l.up)("a-form-item"),K=(0,l.up)("DownOutlined"),I=(0,l.up)("a-menu-item"),F=(0,l.up)("a-menu"),Q=(0,l.up)("a-dropdown"),G=(0,l.up)("a-form"),V=(0,l.up)("a-card"),X=(0,l.up)("JsonEditor"),ee=(0,l.up)("a-drawer"),ae=(0,l.up)("a-tag"),te=(0,l.up)("a-list-item-meta"),le=(0,l.up)("a-badge"),se=(0,l.up)("a-tooltip"),re=(0,l.up)("FieldTimeOutlined"),ie=(0,l.up)("a-list-item"),oe=(0,l.up)("a-list"),ne=(0,l.up)("PageLayout");return(0,l.wg)(),(0,l.j4)(ne,{title:e.$t("log")},{headerContent:(0,l.w5)((()=>[(0,l._)("div",{class:(0,s.C_)(["search-head",e.layout,e.pageWidth])},[(0,l._)("div",o,[(0,l.Wm)(M,{class:"a-mentions search-ipt",value:E.filter,"onUpdate:value":a[0]||(a[0]=e=>E.filter=e),rows:"3",placeholder:e.$t("Please input filter"),prefix:[" "],onSearch:O.onSearch},{default:(0,l.w5)((()=>[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(E.WHERE_DATA[E.prefix]||[],(e=>((0,l.wg)(),(0,l.j4)(Y,{key:e,value:e},{default:(0,l.w5)((()=>[(0,l.Uk)((0,s.zw)(e),1)])),_:2},1032,["value"])))),128))])),_:1},8,["value","placeholder","onSearch"]),(0,l.Wm)(R,{type:"primary",onClick:a[1]||(a[1]=e=>O.getData()),shape:"circle",class:"border-round ml-15"},{default:(0,l.w5)((()=>[(0,l.Wm)(N)])),_:1}),(0,l._)("div",{class:"div-msg",innerHTML:e.$t("Input <b>SPACE</b> to add filter, <b>AND</b>/<b>OR</b> to concat. eg: feild1 = 'A' or feild2 = 'B'")},null,8,n)]),(0,l.Wm)(V,{bordered:!1,class:"search-form"},{default:(0,l.w5)((()=>[(0,l.Wm)(G,null,{default:(0,l.w5)((()=>[(0,l._)("div",d,[(0,l._)("div",u,[(0,l._)("span",null,(0,s.zw)(e.$t("Time screening")),1)]),(0,l._)("div",c,[(0,l._)("div",p,[(0,l.Wm)(J,null,{default:(0,l.w5)((()=>[(0,l.Wm)(Z,{value:E.date,"onUpdate:value":a[2]||(a[2]=e=>E.date=e),"show-time":"",format:"YYYY-MM-DD HH:mm:ss",placeholder:e.$t("Start Date"),onChange:a[3]||(a[3]=e=>O.getData())},null,8,["value","placeholder"]),w,(0,l.Wm)(Z,{value:E.endDate,"onUpdate:value":a[4]||(a[4]=e=>E.endDate=e),"show-time":"",format:"YYYY-MM-DD HH:mm:ss",placeholder:e.$t("End Date"),onChange:a[5]||(a[5]=e=>O.getData())},null,8,["value","placeholder"])])),_:1})]),(0,l._)("div",m,[(0,l._)("span",g,(0,s.zw)(e.$t("Sort By"))+" : ",1),(0,l.Wm)(Q,null,{overlay:(0,l.w5)((()=>[(0,l.Wm)(F,null,{default:(0,l.w5)((()=>[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(E.select_keys,((e,a)=>((0,l.wg)(),(0,l.j4)(I,{key:a},{default:(0,l.w5)((()=>[(0,l._)("a",{href:"javascript:void(0);",onClick:a=>O.orderBy(e,E.arrow),class:"uppercase"},(0,s.zw)(e.replace(/\./g," ")),9,h)])),_:2},1024)))),128))])),_:1})])),default:(0,l.w5)((()=>[(0,l._)("b",{class:"ant-dropdown-link sortby-value",onClick:a[6]||(a[6]=(0,r.iM)((()=>{}),["prevent"]))},[(0,l.Uk)((0,s.zw)(E.sortBy)+" ",1),(0,l.Wm)(K)])])),_:1}),(0,l.Wm)(Q,null,{overlay:(0,l.w5)((()=>[(0,l.Wm)(F,null,{default:(0,l.w5)((()=>[(0,l.Wm)(I,null,{default:(0,l.w5)((()=>[(0,l._)("a",{href:"javascript:void(0);",onClick:a[8]||(a[8]=e=>O.orderBy(E.sortBy,"desc")),class:"uppercase"},(0,s.zw)(e.$t("desc")),1)])),_:1}),(0,l.Wm)(I,null,{default:(0,l.w5)((()=>[(0,l._)("a",{href:"javascript:void(0);",onClick:a[9]||(a[9]=e=>O.orderBy(E.sortBy,"asc")),class:"uppercase"},(0,s.zw)(e.$t("asc")),1)])),_:1})])),_:1})])),default:(0,l.w5)((()=>[(0,l._)("b",{class:"ant-dropdown-link sortby-value",onClick:a[7]||(a[7]=(0,r.iM)((()=>{}),["prevent"]))},[(0,l.Uk)((0,s.zw)(e.$t(E.arrow))+" ",1),(0,l.Wm)(K)])])),_:1})])])])])),_:1})])),_:1})],2)])),default:(0,l.w5)((()=>[(0,l.Wm)(V,{class:"search-content",loading:E.loading},{default:(0,l.w5)((()=>[E.visible?((0,l.wg)(),(0,l.j4)(ee,{key:0,"get-container":!1,title:e.$t("log"),placement:"bottom",height:"600",closable:!1,visible:E.visible,onClose:O.onClose},{default:(0,l.w5)((()=>[(0,l.Wm)(X,{"is-readonly":!0,value:E.log},null,8,["value"])])),_:1},8,["title","visible","onClose"])):(0,l.kq)("",!0),(0,l.Wm)(oe,{"item-layout":"vertical",pagination:{showSizeChanger:!1,showQuickJumper:!1,onShowSizeChange:O.getData,onChange:O.getData,current:E.params.pageNo,pageSize:E.params.pageSize,showTotal:(a,t)=>`${e.$t("Total")} ${a}`,total:E.params.total}},{default:(0,l.w5)((()=>[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(E.data,((a,t)=>((0,l.wg)(),(0,l.j4)(ie,{key:t,onClick:e=>O.detail(a.message)},{actions:(0,l.w5)((()=>[(0,l._)("span",null,[(0,l.Wm)(re),(0,l.Uk)(" "+(0,s.zw)(a.timestamp),1)]),a.remoteAddr?((0,l.wg)(),(0,l.iD)("span",L,"Remote "+(0,s.zw)(a.remoteAddr)+" : "+(0,s.zw)(a.remotePort),1)):(0,l.kq)("",!0),a.localAddr?((0,l.wg)(),(0,l.iD)("span",A,"Local "+(0,s.zw)(a.localAddr)+" : "+(0,s.zw)(a.localPort),1)):(0,l.kq)("",!0)])),default:(0,l.w5)((()=>[(0,l.Wm)(te,null,{avatar:(0,l.w5)((()=>[1*a["res.status"]>=200&&1*a["res.status"]<600?((0,l.wg)(),(0,l.iD)("svg",_,[(0,l._)("use",{"xlink:href":["#icon-success","#icon-success","#icon-success","#icon-warning","#icon-error","#icon-error"][1*(a["res.status"]+"").substr(0,1)]},null,8,v)])):((0,l.wg)(),(0,l.iD)("svg",f,k))])),title:(0,l.w5)((()=>[(0,l._)("a",b,(0,s.zw)(a["req.path"]||"-"),1)])),description:(0,l.w5)((()=>["4LB"!=a["req.protocol"]?((0,l.wg)(),(0,l.j4)(ae,{key:0},{default:(0,l.w5)((()=>[(0,l.Uk)(" Method:"+(0,s.zw)(a["req.method"]||"-"),1)])),_:2},1024)):(0,l.kq)("",!0),"4LB"!=a["req.protocol"]?((0,l.wg)(),(0,l.j4)(ae,{key:1},{default:(0,l.w5)((()=>[(0,l.Uk)(" Size:"+(0,s.zw)(a.resSize>0?a.resSize/1e3:"-")+" kb ",1)])),_:2},1024)):(0,l.kq)("",!0)])),_:2},1024),(0,l._)("div",y,[(0,l._)("div",D,[(0,l._)("div",z,[(0,l._)("div",null,[(0,l._)("b",null,(0,s.zw)(e.$t("Status")),1),(0,l.Uk)(" : "),"dubbo"==a["req.protocol"]?((0,l.wg)(),(0,l.iD)("span",S,[(0,l.Wm)(le,{color:1*a["res.status"]>20?"red":"green",text:a["res.status"]},null,8,["color","text"])])):((0,l.wg)(),(0,l.iD)("span",W,[(0,l.Wm)(le,{color:["processing","processing","green","gold","red","red","red","red","red","red","red","red"][a["res.status"].substr(0,1)],text:0==a["res.status"]?"-":a["res.status"]},null,8,["color","text"])]))]),a["service.name"]?((0,l.wg)(),(0,l.iD)("div",C,[q,(0,l.Uk)(" : "),(0,l._)("span",null,(0,s.zw)(a["service.name"]),1)])):(0,l.kq)("",!0),(0,l._)("div",null,[x,(0,l.Uk)(" : "),a["req.headers"]?((0,l.wg)(),(0,l.iD)("span",T,[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(Object.keys(O.getParse(a["req.headers"])),((e,t)=>((0,l.wg)(),(0,l.j4)(se,{placement:"topRight",key:t},{title:(0,l.w5)((()=>[(0,l._)("span",null,(0,s.zw)(e)+":"+(0,s.zw)(O.getParse(a["req.headers"])[e]),1)])),default:(0,l.w5)((()=>[(0,l.Wm)(ae,{class:"ellipsis"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,s.zw)(e)+":"+(0,s.zw)(O.getParse(a["req.headers"])[e]),1)])),_:2},1024)])),_:2},1024)))),128))])):((0,l.wg)(),(0,l.iD)("span",U,"-"))])]),(0,l._)("div",$,["4LB"!=a["req.protocol"]?((0,l.wg)(),(0,l.iD)("div",B,[(0,l._)("b",null,(0,s.zw)(e.$t("Time Quantum")),1),(0,l.Uk)(" : "),(0,l._)("em",null,(0,s.zw)(new Date(1*a.reqTime).toLocaleString()),1),P,(0,l._)("em",null,(0,s.zw)(new Date(1*a.resTime).toLocaleString()),1)])):(0,l.kq)("",!0),a["pod.name"]?((0,l.wg)(),(0,l.iD)("div",j,[H,(0,l.Uk)(" : "),(0,l._)("span",null,(0,s.zw)(a["pod.name"]),1)])):(0,l.kq)("",!0),(0,l._)("div",null,[(0,l._)("b",null,(0,s.zw)(e.$t("Protocol")),1),(0,l.Uk)(" : "),(0,l._)("span",null,(0,s.zw)(a["req.protocol"]||"-"),1)])])])])])),_:2},1032,["onClick"])))),128))])),_:1},8,["pagination"])])),_:1},8,["loading"])])),_:1},8,["title"])}],["__scopeId","data-v-4b6953bb"]])}}]);