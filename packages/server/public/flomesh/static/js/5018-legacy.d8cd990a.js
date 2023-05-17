"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[5018],{86614:function(t,e,a){a.d(e,{Z:function(){return y}});var n=a(66252),i=a(49963),o=a(3577),r=a(87932),s={class:"Echarts relative"},l=function(t){return(0,n.dD)("data-v-d9c6c386"),t=t(),(0,n.Cn)(),t}((function(){return(0,n._)("img",{src:r,style:{width:"300px"}},null,-1)})),u={class:"iconfont-btn-group"};a(9653),a(68309),a(41539),a(54747),a(57658),a(21249);var d=a(96486),h=a.n(d),c=a(85263),m=a(60695),p=a(62611),f=a(73267),g={name:"TopologyChart",i18n:a(89234),components:{DeploymentUnitOutlined:m.Z,PartitionOutlined:p.Z,ForkOutlined:f.Z},props:{where:{type:String,default:""},height:{type:String,default:""},categories:{type:Array,default:function(){return[]}},nodes:{type:Array,default:function(){return[]}},state:{type:Number,default:0},loading:{type:Boolean},links:{type:Array,default:function(){return[]}},nodePos:{type:Object,default:function(){return{}}}},data:function(){return{isMounted:!1,simpleImage:c.Z.PRESENTED_IMAGE_SIMPLE,layout:"none"}},watch:{where:{handler:function(){this.loadData()},deep:!0},nodes:{handler:function(){var t=this;this.isMounted&&setTimeout((function(){t.renderEcharts()}),100)},deep:!0}},mounted:function(){var t=this;this.isMounted=!0;var e=this.$refs.main,a=this.$echarts.init(e);a.showLoading(),this.renderEcharts(),a.on("click","series.graph",(function(e){e.data.name&&t.$emit("destChange",{name:e.data.name,type:e.data.parent?"pod":"service"})}))},methods:{loadData:function(){var t=this.$refs.main;this.$echarts.init(t).showLoading(),this.renderEcharts()},changeLayout:function(t){this.layout=t;var e=this.$refs.main;this.$echarts.init(e).showLoading(),this.renderEcharts()},setPos:function(t){var e=this,a=[];(t||[]).forEach((function(t){"service"==e.nodePos[t.id].type&&a.push(t.id)})),this.setPos2(a,-1,1)},setPos2:function(t,e,a){var n=this,i=e;return t&&t.forEach((function(t){(2==a&&null==n.nodePos[t].parent||2!=a)&&(n.nodePos[t].y=i,n.nodePos[t].x=a,i=n.setPos2(n.nodePos[t].children,i,a+1),i++,1==a&&i++)})),i},renderEcharts:function(){var t=this,e=this.$refs.main,a=this.$echarts.init(e);a.hideLoading();var n=h().cloneDeep(this.nodes);this.setPos(n),(n||[]).forEach((function(e){"none"==t.layout&&(e.x=350*(t.nodePos[e.id].x?t.nodePos[e.id].x:1),e.y=80*(t.nodePos[e.id].y?t.nodePos[e.id].y:1)),e.label={normal:{show:"none"==t.layout||e.symbolSize>30,width:100,overflow:"truncate",ellipsis:"...",position:"bottom"}}}));var i={title:{text:"",subtext:"",top:"bottom",left:"right"},tooltip:{triggerOn:"mousemove|click"},legend:[{type:"scroll",orient:"vertical",right:"30px",data:(this.categories||[]).map((function(t){return t.name})),formatter:function(t){return t.length>18?t.substr(0,18)+"...":t}}],animationDuration:1500,animationEasingUpdate:"quinticInOut",series:[{name:"Les Miserables",type:"graph",layout:this.layout,data:n,circular:{rotateLabel:!0},force:{initLayout:"circular",repulsion:300,gravity:"0.1",edgeLength:[10,300]},links:this.links,categories:this.categories,roam:!0,focusNodeAdjacency:!0,edgeSymbol:["circle","arrow"],draggabled:!0,label:{position:"right",formatter:"{b}"},itemStyle:{normal:{borderColor:"#fff",borderWidth:1,shadowBlur:10,shadowColor:"rgba(0, 0, 0, 0.3)"}},tooltip:{formatter:function(t){return t.name+" "+t.value}},lineStyle:{type:"solid",color:"source",curveness:"none"==this.layout?0:.3},emphasis:{focus:"adjacency",lineStyle:{width:10}}}]};a.setOption(i,{lazyUpdate:!0})}}};var y=(0,a(83744).Z)(g,[["render",function(t,e,a,r,d,h){var c=(0,n.up)("a-skeleton"),m=(0,n.up)("a-result"),p=(0,n.up)("PartitionOutlined"),f=(0,n.up)("DeploymentUnitOutlined"),g=(0,n.up)("ForkOutlined");return(0,n.wg)(),(0,n.iD)("div",s,[(0,n.wy)((0,n.Wm)(c,{avatar:"",active:"",paragraph:{rows:6},style:{padding:"100px 50px"}},null,512),[[i.F8,a.loading]]),a.loading||0!=a.state?(0,n.kq)("",!0):((0,n.wg)(),(0,n.j4)(m,{key:0,class:"relative result",style:{"margin-bottom":"100px"},title:t.$t("No data"),"sub-title":t.$t("Check other time periods.")},{icon:(0,n.w5)((function(){return[l]})),_:1},8,["title","sub-title"])),(0,n._)("div",u,[(0,n.Wm)(p,{onClick:e[0]||(e[0]=function(t){return h.changeLayout("none")}),class:(0,o.C_)(["iconfont-btn","none"==d.layout?"active":""])},null,8,["class"]),(0,n.Wm)(f,{onClick:e[1]||(e[1]=function(t){return h.changeLayout("circular")}),class:(0,o.C_)(["iconfont-btn","circular"==d.layout?"active":""])},null,8,["class"]),(0,n.Wm)(g,{onClick:e[2]||(e[2]=function(t){return h.changeLayout("force")}),class:(0,o.C_)(["iconfont-btn","force"==d.layout?"active":""])},null,8,["class"])]),(0,n.wy)((0,n._)("div",{ref:"main",class:"topology-main",style:(0,o.j5)(a.height?"height:"+a.height:"")},null,4),[[i.F8,!a.loading&&a.state>0]])])}],["__scopeId","data-v-d9c6c386"]])},79566:function(t,e,a){a.d(e,{Z:function(){return l}});var n=a(66252),i={class:"flex",style:{"min-width":"550px"}},o={class:"pl-10"},r={class:"flex-item2 pr-20"};var s={name:"Timeline",components:{FieldTimeOutlined:a(13471).Z},i18n:a(89234),props:["dateVal"],data:function(){return{sqlDateMap:{0:"1 month",10:"15 day",20:"7 day",30:"3 day",40:"1 day",50:"12 hour",60:"6 hour",70:"1 hour",80:"30 minute",90:"5 minute",100:"1 second"},marks:{}}},computed:{datamarks:function(){return this.marks={0:"1"+this.$t(" Mths"),10:"15"+this.$t(" d"),20:"7"+this.$t(" d"),30:"3"+this.$t(" d"),40:"1"+this.$t(" d"),50:"12"+this.$t(" h"),60:"6"+this.$t(" h"),70:"1"+this.$t(" h"),80:"30"+this.$t(" m"),90:"5"+this.$t(" m"),100:this.$t(" Just")},this.marks}},watch:{},mounted:function(){},methods:{onDateChange:function(t){this.$emit("update:dateVal",t),this.$emit("dateChange",{value:t,from:this.sqlDateMap[t[0]],to:this.sqlDateMap[t[1]]})}}};var l=(0,a(83744).Z)(s,[["render",function(t,e,a,s,l,u){var d=(0,n.up)("FieldTimeOutlined"),h=(0,n.up)("a-slider");return(0,n.wg)(),(0,n.iD)("div",i,[(0,n._)("div",o,[(0,n.Wm)(d,{class:"FieldTimeOutlined"})]),(0,n._)("div",r,[(0,n.Wm)(h,{range:"",class:"slider-dot",onChange:u.onDateChange,"tooltip-visible":!1,marks:u.datamarks,step:null,"default-value":a.dateVal},null,8,["onChange","marks","default-value"])])])}],["__scopeId","data-v-44491d74"]])},69107:function(t,e,a){a.r(e),a.d(e,{default:function(){return C}});var n=a(95082),i=(a(68309),a(66252)),o={class:"flex"},r={class:"flex-item topology-warpper"},s={class:"noborder scrollbar scrollbar-div"};var l=a(79566),u=a(86614);var d=a(12205),h=a(33222),c=a(52795),m=a(29495),p=a(36657),f={name:"RightBar",i18n:a(89234),components:{AreaChart:d.Z,BpsChart:h.Z,DelayChart:c.Z,QoSSummaryChart:m.Z,StatusChart:p.Z},props:["where","msg"],data:function(){},mounted:function(){},methods:{}},g=a(83744);var y=(0,g.Z)(f,[["render",function(t,e,a,n,o,r){var s=(0,i.up)("QoSSummaryChart"),l=(0,i.up)("a-card"),u=(0,i.up)("DelayChart"),d=(0,i.up)("StatusChart"),h=(0,i.up)("AreaChart"),c=(0,i.up)("BpsChart"),m=(0,i.up)("a-space");return(0,i.wg)(),(0,i.j4)(m,{direction:"vertical",class:"full pd-15 relative"},{default:(0,i.w5)((function(){return[(0,i.Wm)(l,{class:"nopd",title:t.$t("QoS Summary")},{default:(0,i.w5)((function(){return[(0,i.Wm)(s,{msg:a.msg,where:a.where},null,8,["msg","where"])]})),_:1},8,["title"]),(0,i.Wm)(l,{class:"nopd",title:t.$t("Latency")},{default:(0,i.w5)((function(){return[(0,i.Wm)(u,{msg:a.msg,where:a.where},null,8,["msg","where"])]})),_:1},8,["title"]),(0,i.Wm)(l,{class:"nopd",title:t.$t("Load Status")},{default:(0,i.w5)((function(){return[(0,i.Wm)(d,{msg:a.msg,where:a.where},null,8,["msg","where"])]})),_:1},8,["title"]),(0,i.Wm)(l,{class:"nopd",title:t.$t("TPS/Error")},{default:(0,i.w5)((function(){return[(0,i.Wm)(h,{msg:a.msg,where:a.where},null,8,["msg","where"])]})),_:1},8,["title"]),(0,i.Wm)(l,{class:"nopd",title:t.$t("BPS")},{default:(0,i.w5)((function(){return[(0,i.Wm)(c,{msg:a.msg,where:a.where},null,8,["msg","where"])]})),_:1},8,["title"])]})),_:1})}]]),v=a(26917),w={name:"Topology",components:{TopologyChart:u.Z,RightBar:y,Timeline:l.Z},i18n:a(89234),props:{},data:function(){return{dateVal:[60,100],topoData:{},marks:{},loading:!0,topoWhere:"",name:"",type:""}},computed:{where:function(){return(0,v._y)(this.type,this.name,this.dateVal[0],this.dateVal[1])||""}},mounted:function(){this.loaddata()},methods:{clearName:function(){this.name="",this.type=""},destChange:function(t){this.name=t.name,this.type=t.type},loaddata:function(){var t=this;this.loading=!0,this.setTopoWhere(),v.ZP.getTopoData({where:this.topoWhere}).then((function(e){t.loading=!1;var a=v.ZP.setTopoData()(e);t.topoData=a}))},setTopoWhere:function(){this.topoWhere=(0,v.FS)(this.dateVal[0],this.dateVal[1])||""},dateChange:function(){this.loaddata()}}};var C=(0,g.Z)(w,[["render",function(t,e,a,l,u,d){var h=(0,i.up)("Timeline"),c=(0,i.up)("TopologyChart"),m=(0,i.up)("a-page-header"),p=(0,i.up)("RightBar"),f=(0,i.up)("a-card");return(0,i.wg)(),(0,i.j4)(f,{title:t.$t("Dashboard"),class:"bg-white card nopd"},{extra:(0,i.w5)((function(){return[(0,i.Wm)(h,{dateVal:u.dateVal,"onUpdate:dateVal":e[0]||(e[0]=function(t){return u.dateVal=t}),onDateChange:d.dateChange},null,8,["dateVal","onDateChange"])]})),default:(0,i.w5)((function(){return[(0,i._)("div",o,[(0,i._)("div",r,[(0,i.Wm)(c,(0,i.dG)({height:"600px",where:u.topoWhere,loading:u.loading},(0,n.Z)({},u.topoData),{onDestChange:d.destChange}),null,16,["where","loading","onDestChange"])]),(0,i._)("div",s,[""!=u.name?((0,i.wg)(),(0,i.j4)(m,{key:0,title:u.name,"sub-title":t.$t(u.type),onBack:d.clearName},null,8,["title","sub-title","onBack"])):(0,i.kq)("",!0),""==u.name?((0,i.wg)(),(0,i.j4)(m,{key:1,title:"","sub-title":t.$t("Overview")},null,8,["sub-title"])):(0,i.kq)("",!0),(0,i.Wm)(p,{where:d.where,onDestChange:d.destChange},null,8,["where","onDestChange"])])])]})),_:1},8,["title"])}],["__scopeId","data-v-8d4490b0"]])}}]);