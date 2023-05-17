"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[5018],{86614:function(t,e,a){a.d(e,{Z:function(){return f}});var s=a(66252),i=a(49963),n=a(3577),o=a(87932);const r={class:"Echarts relative"},l=(t=>((0,s.dD)("data-v-d9c6c386"),t=t(),(0,s.Cn)(),t))((()=>(0,s._)("img",{src:o,style:{width:"300px"}},null,-1))),h={class:"iconfont-btn-group"};a(57658);var d=a(96486),u=a.n(d),c=a(85263),m=a(60695),p=a(62611),g=a(73267),y={name:"TopologyChart",i18n:a(89234),components:{DeploymentUnitOutlined:m.Z,PartitionOutlined:p.Z,ForkOutlined:g.Z},props:{where:{type:String,default:""},height:{type:String,default:""},categories:{type:Array,default(){return[]}},nodes:{type:Array,default(){return[]}},state:{type:Number,default:0},loading:{type:Boolean},links:{type:Array,default(){return[]}},nodePos:{type:Object,default(){return{}}}},data(){return{isMounted:!1,simpleImage:c.Z.PRESENTED_IMAGE_SIMPLE,layout:"none"}},watch:{where:{handler(){this.loadData()},deep:!0},nodes:{handler(){this.isMounted&&setTimeout((()=>{this.renderEcharts()}),100)},deep:!0}},mounted(){this.isMounted=!0;let t=this.$refs.main,e=this.$echarts.init(t);e.showLoading(),this.renderEcharts(),e.on("click","series.graph",(t=>{t.data.name&&this.$emit("destChange",{name:t.data.name,type:t.data.parent?"pod":"service"})}))},methods:{loadData(){let t=this.$refs.main;this.$echarts.init(t).showLoading(),this.renderEcharts()},changeLayout(t){this.layout=t;let e=this.$refs.main;this.$echarts.init(e).showLoading(),this.renderEcharts()},setPos(t){let e=[];(t||[]).forEach((t=>{"service"==this.nodePos[t.id].type&&e.push(t.id)})),this.setPos2(e,-1,1)},setPos2(t,e,a){let s=e;return t&&t.forEach((t=>{(2==a&&null==this.nodePos[t].parent||2!=a)&&(this.nodePos[t].y=s,this.nodePos[t].x=a,s=this.setPos2(this.nodePos[t].children,s,a+1),s++,1==a&&s++)})),s},renderEcharts(){let t=this.$refs.main,e=this.$echarts.init(t);e.hideLoading();let a=u().cloneDeep(this.nodes);this.setPos(a),(a||[]).forEach((t=>{"none"==this.layout&&(t.x=350*(this.nodePos[t.id].x?this.nodePos[t.id].x:1),t.y=80*(this.nodePos[t.id].y?this.nodePos[t.id].y:1)),t.label={normal:{show:"none"==this.layout||t.symbolSize>30,width:100,overflow:"truncate",ellipsis:"...",position:"bottom"}}}));let s={title:{text:"",subtext:"",top:"bottom",left:"right"},tooltip:{triggerOn:"mousemove|click"},legend:[{type:"scroll",orient:"vertical",right:"30px",data:(this.categories||[]).map((function(t){return t.name})),formatter:function(t){return t.length>18?t.substr(0,18)+"...":t}}],animationDuration:1500,animationEasingUpdate:"quinticInOut",series:[{name:"Les Miserables",type:"graph",layout:this.layout,data:a,circular:{rotateLabel:!0},force:{initLayout:"circular",repulsion:300,gravity:"0.1",edgeLength:[10,300]},links:this.links,categories:this.categories,roam:!0,focusNodeAdjacency:!0,edgeSymbol:["circle","arrow"],draggabled:!0,label:{position:"right",formatter:"{b}"},itemStyle:{normal:{borderColor:"#fff",borderWidth:1,shadowBlur:10,shadowColor:"rgba(0, 0, 0, 0.3)"}},tooltip:{formatter:function(t){return t.name+" "+t.value}},lineStyle:{type:"solid",color:"source",curveness:"none"==this.layout?0:.3},emphasis:{focus:"adjacency",lineStyle:{width:10}}}]};e.setOption(s,{lazyUpdate:!0})}}};var f=(0,a(83744).Z)(y,[["render",function(t,e,a,o,d,u){const c=(0,s.up)("a-skeleton"),m=(0,s.up)("a-result"),p=(0,s.up)("PartitionOutlined"),g=(0,s.up)("DeploymentUnitOutlined"),y=(0,s.up)("ForkOutlined");return(0,s.wg)(),(0,s.iD)("div",r,[(0,s.wy)((0,s.Wm)(c,{avatar:"",active:"",paragraph:{rows:6},style:{padding:"100px 50px"}},null,512),[[i.F8,a.loading]]),a.loading||0!=a.state?(0,s.kq)("",!0):((0,s.wg)(),(0,s.j4)(m,{key:0,class:"relative result",style:{"margin-bottom":"100px"},title:t.$t("No data"),"sub-title":t.$t("Check other time periods.")},{icon:(0,s.w5)((()=>[l])),_:1},8,["title","sub-title"])),(0,s._)("div",h,[(0,s.Wm)(p,{onClick:e[0]||(e[0]=t=>u.changeLayout("none")),class:(0,n.C_)(["iconfont-btn","none"==d.layout?"active":""])},null,8,["class"]),(0,s.Wm)(g,{onClick:e[1]||(e[1]=t=>u.changeLayout("circular")),class:(0,n.C_)(["iconfont-btn","circular"==d.layout?"active":""])},null,8,["class"]),(0,s.Wm)(y,{onClick:e[2]||(e[2]=t=>u.changeLayout("force")),class:(0,n.C_)(["iconfont-btn","force"==d.layout?"active":""])},null,8,["class"])]),(0,s.wy)((0,s._)("div",{ref:"main",class:"topology-main",style:(0,n.j5)(a.height?"height:"+a.height:"")},null,4),[[i.F8,!a.loading&&a.state>0]])])}],["__scopeId","data-v-d9c6c386"]])},79566:function(t,e,a){a.d(e,{Z:function(){return l}});var s=a(66252);const i={class:"flex",style:{"min-width":"550px"}},n={class:"pl-10"},o={class:"flex-item2 pr-20"};var r={name:"Timeline",components:{FieldTimeOutlined:a(13471).Z},i18n:a(89234),props:["dateVal"],data(){return{sqlDateMap:{0:"1 month",10:"15 day",20:"7 day",30:"3 day",40:"1 day",50:"12 hour",60:"6 hour",70:"1 hour",80:"30 minute",90:"5 minute",100:"1 second"},marks:{}}},computed:{datamarks(){return this.marks={0:"1"+this.$t(" Mths"),10:"15"+this.$t(" d"),20:"7"+this.$t(" d"),30:"3"+this.$t(" d"),40:"1"+this.$t(" d"),50:"12"+this.$t(" h"),60:"6"+this.$t(" h"),70:"1"+this.$t(" h"),80:"30"+this.$t(" m"),90:"5"+this.$t(" m"),100:this.$t(" Just")},this.marks}},watch:{},mounted(){},methods:{onDateChange(t){this.$emit("update:dateVal",t),this.$emit("dateChange",{value:t,from:this.sqlDateMap[t[0]],to:this.sqlDateMap[t[1]]})}}};var l=(0,a(83744).Z)(r,[["render",function(t,e,a,r,l,h){const d=(0,s.up)("FieldTimeOutlined"),u=(0,s.up)("a-slider");return(0,s.wg)(),(0,s.iD)("div",i,[(0,s._)("div",n,[(0,s.Wm)(d,{class:"FieldTimeOutlined"})]),(0,s._)("div",o,[(0,s.Wm)(u,{range:"",class:"slider-dot",onChange:h.onDateChange,"tooltip-visible":!1,marks:h.datamarks,step:null,"default-value":a.dateVal},null,8,["onChange","marks","default-value"])])])}],["__scopeId","data-v-44491d74"]])},69107:function(t,e,a){a.r(e),a.d(e,{default:function(){return v}});var s=a(66252);const i={class:"flex"},n={class:"flex-item topology-warpper"},o={class:"noborder scrollbar scrollbar-div"};var r=a(79566),l=a(86614);var h=a(12205),d=a(33222),u=a(52795),c=a(29495),m=a(36657),p={name:"RightBar",i18n:a(89234),components:{AreaChart:h.Z,BpsChart:d.Z,DelayChart:u.Z,QoSSummaryChart:c.Z,StatusChart:m.Z},props:["where","msg"],data(){},mounted(){},methods:{}},g=a(83744);var y=(0,g.Z)(p,[["render",function(t,e,a,i,n,o){const r=(0,s.up)("QoSSummaryChart"),l=(0,s.up)("a-card"),h=(0,s.up)("DelayChart"),d=(0,s.up)("StatusChart"),u=(0,s.up)("AreaChart"),c=(0,s.up)("BpsChart"),m=(0,s.up)("a-space");return(0,s.wg)(),(0,s.j4)(m,{direction:"vertical",class:"full pd-15 relative"},{default:(0,s.w5)((()=>[(0,s.Wm)(l,{class:"nopd",title:t.$t("QoS Summary")},{default:(0,s.w5)((()=>[(0,s.Wm)(r,{msg:a.msg,where:a.where},null,8,["msg","where"])])),_:1},8,["title"]),(0,s.Wm)(l,{class:"nopd",title:t.$t("Latency")},{default:(0,s.w5)((()=>[(0,s.Wm)(h,{msg:a.msg,where:a.where},null,8,["msg","where"])])),_:1},8,["title"]),(0,s.Wm)(l,{class:"nopd",title:t.$t("Load Status")},{default:(0,s.w5)((()=>[(0,s.Wm)(d,{msg:a.msg,where:a.where},null,8,["msg","where"])])),_:1},8,["title"]),(0,s.Wm)(l,{class:"nopd",title:t.$t("TPS/Error")},{default:(0,s.w5)((()=>[(0,s.Wm)(u,{msg:a.msg,where:a.where},null,8,["msg","where"])])),_:1},8,["title"]),(0,s.Wm)(l,{class:"nopd",title:t.$t("BPS")},{default:(0,s.w5)((()=>[(0,s.Wm)(c,{msg:a.msg,where:a.where},null,8,["msg","where"])])),_:1},8,["title"])])),_:1})}]]),f=a(26917),w={name:"Topology",components:{TopologyChart:l.Z,RightBar:y,Timeline:r.Z},i18n:a(89234),props:{},data(){return{dateVal:[60,100],topoData:{},marks:{},loading:!0,topoWhere:"",name:"",type:""}},computed:{where(){return(0,f._y)(this.type,this.name,this.dateVal[0],this.dateVal[1])||""}},mounted(){this.loaddata()},methods:{clearName(){this.name="",this.type=""},destChange(t){this.name=t.name,this.type=t.type},loaddata(){this.loading=!0,this.setTopoWhere(),f.ZP.getTopoData({where:this.topoWhere}).then((t=>{this.loading=!1;let e=f.ZP.setTopoData()(t);this.topoData=e}))},setTopoWhere(){this.topoWhere=(0,f.FS)(this.dateVal[0],this.dateVal[1])||""},dateChange(){this.loaddata()}}};var v=(0,g.Z)(w,[["render",function(t,e,a,r,l,h){const d=(0,s.up)("Timeline"),u=(0,s.up)("TopologyChart"),c=(0,s.up)("a-page-header"),m=(0,s.up)("RightBar"),p=(0,s.up)("a-card");return(0,s.wg)(),(0,s.j4)(p,{title:t.$t("Dashboard"),class:"bg-white card nopd"},{extra:(0,s.w5)((()=>[(0,s.Wm)(d,{dateVal:l.dateVal,"onUpdate:dateVal":e[0]||(e[0]=t=>l.dateVal=t),onDateChange:h.dateChange},null,8,["dateVal","onDateChange"])])),default:(0,s.w5)((()=>[(0,s._)("div",i,[(0,s._)("div",n,[(0,s.Wm)(u,(0,s.dG)({height:"600px",where:l.topoWhere,loading:l.loading},{...l.topoData},{onDestChange:h.destChange}),null,16,["where","loading","onDestChange"])]),(0,s._)("div",o,[""!=l.name?((0,s.wg)(),(0,s.j4)(c,{key:0,title:l.name,"sub-title":t.$t(l.type),onBack:h.clearName},null,8,["title","sub-title","onBack"])):(0,s.kq)("",!0),""==l.name?((0,s.wg)(),(0,s.j4)(c,{key:1,title:"","sub-title":t.$t("Overview")},null,8,["sub-title"])):(0,s.kq)("",!0),(0,s.Wm)(m,{where:h.where,onDestChange:h.destChange},null,8,["where","onDestChange"])])])])),_:1},8,["title"])}],["__scopeId","data-v-8d4490b0"]])}}]);