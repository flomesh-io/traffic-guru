"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[9689],{73267:function(t,a,e){e.d(a,{Z:function(){return l}});var s=e(66252),i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M752 100c-61.8 0-112 50.2-112 112 0 47.7 29.9 88.5 72 104.6v27.6L512 601.4 312 344.2v-27.6c42.1-16.1 72-56.9 72-104.6 0-61.8-50.2-112-112-112s-112 50.2-112 112c0 50.6 33.8 93.5 80 107.3v34.4c0 9.7 3.3 19.3 9.3 27L476 672.3v33.6c-44.2 15-76 56.9-76 106.1 0 61.8 50.2 112 112 112s112-50.2 112-112c0-49.2-31.8-91-76-106.1v-33.6l226.7-291.6c6-7.7 9.3-17.3 9.3-27v-34.4c46.2-13.8 80-56.7 80-107.3 0-61.8-50.2-112-112-112zM224 212a48.01 48.01 0 0196 0 48.01 48.01 0 01-96 0zm336 600a48.01 48.01 0 01-96 0 48.01 48.01 0 0196 0zm192-552a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"}}]},name:"fork",theme:"outlined"},r=e(33058);function h(t){for(var a=1;a<arguments.length;a++){var e=null!=arguments[a]?Object(arguments[a]):{},s=Object.keys(e);"function"==typeof Object.getOwnPropertySymbols&&(s=s.concat(Object.getOwnPropertySymbols(e).filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})))),s.forEach((function(a){n(t,a,e[a])}))}return t}function n(t,a,e){return a in t?Object.defineProperty(t,a,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[a]=e,t}var o=function(t,a){var e=h({},t,a.attrs);return(0,s.Wm)(r.Z,h({},e,{icon:i}),null)};o.displayName="ForkOutlined",o.inheritAttrs=!1;var l=o},12205:function(t,a,e){e.d(a,{Z:function(){return o}});var s=e(66252);const i={ref:"areaChart",class:"full height-240"};e(57658);var r=e(84722),h=e(26917),n={name:"AreaChart",props:{pid:{type:String,default:""},apply:{type:String,default:""},params:{type:Object,default(){return{}}},where:{type:String,default:""},date:{type:String,default:""}},i18n:e(89234),data(){return{name:"",type:"",areaData:{day:"",success:[],failed:[],xaxis:[]}}},watch:{where:{handler(){this.loadData()},deep:!0}},mounted(){this.loadData()},methods:{renderChart(){let t=(0,r.jU)(this.date),a=this.$refs.areaChart;this.$echarts.dispose(a);let e=this.$echarts.init(a),s={title:{},tooltip:{trigger:"axis",axisPointer:{type:"cross",label:{backgroundColor:"#6a7985"}}},color:["#8bd4a1","#fb9690"],grid:{top:"0",left:"0px",right:"0px",bottom:"0px",containLabel:!0},xAxis:[{type:"category",boundaryGap:!1,nameGap:30,minorSplitLine:{show:!0},axisLabel:{margin:0,backgroundColor:"rgba(240,240,240,0.7)",padding:[2,3,2,3],textStyle:{color:"#6a7985"},inside:!0,borderRadius:[3,3,0,0],minInterval:20},axisTick:{show:!1},axisLine:{show:!1},z:10}],yAxis:{axisLine:{show:!1},axisTick:{show:!1},z:10,splitLine:{show:!1},minInterval:1,axisLabel:{margin:0,formatter:"{value} Req/"+t,showMinLabel:!1,showMaxLabel:!1,inside:!0,backgroundColor:"rgba(240,240,240,0.7)",padding:[2,3,2,3],borderRadius:[0,3,3,0],textStyle:{color:"#6a7985"},textStyle:{color:"#999"}}},series:[{name:"Success",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},lineStyle:{width:0},showSymbol:!1,data:this.areaData.success},{name:"Failed",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},lineStyle:{width:0},showSymbol:!1,data:this.areaData.failed}]};e.setOption(s,{lazyUpdate:!0}),e.hideLoading()},loadData(){let t=this.$refs.areaChart;this.$echarts.init(t).showLoading();let a=(0,r.VS)(this.date),e="";this.pid&&("openapi"==this.apply?e+=` AND x_parameters.aid = '${this.pid}'`:"project"==this.apply?e+=` AND x_parameters.pid = '${this.pid}'`:"mesh"==this.apply?e+=` AND meshName = '${this.params.name}'`:"service"==this.apply&&(e+=(0,h.lh)("and",this.params.name,this.params.namespace,this.params.domain)));let s=`select count() as count ,count(CASE WHEN res.status<'400' THEN 1 END) as succss_count ,count(CASE WHEN res.status>='400' THEN 1 END) as error_count ,${a} as min from log where 1=1 AND bondType != 'outbound' ${this.where} ${e} group by min order by min;`;this.categories=[],this.links=[],this.$request(this.$REST.CLICKHOUSE.QUERY(s),this.$METHOD.GET).then((t=>{this.areaData={day:"",success:[],failed:[],xaxis:[]};let a=t.data.split("\n"),e=0;a.map((t=>{let s=t.split("\t");if(e++,s[3]){let t=new Date(s[3]).getTime(),i=(0,r.Fw)(t,this.date);this.areaData.success.push([i,s[1]]),this.areaData.failed.push([i,s[2]]),this.areaData.xaxis.push(i),1==e?this.areaData.day=i:e+1==a.length&&this.areaData.day!=i&&(this.areaData.day+=" ~ "+i)}return t})),0==this.areaData.success.length&&this.areaData.success.push(0),0==this.areaData.failed.length&&this.areaData.failed.push(0),0==this.areaData.xaxis.length&&this.areaData.xaxis.push((0,r.Fw)((new Date).getTime(),this.date)),this.renderChart()})).catch((t=>{}))}}};var o=(0,e(83744).Z)(n,[["render",function(t,a,e,r,h,n){return(0,s.wg)(),(0,s.iD)("div",null,[(0,s._)("div",i,null,512)])}],["__scopeId","data-v-0c052188"]])},33222:function(t,a,e){e.d(a,{Z:function(){return o}});var s=e(66252);const i={ref:"bpsChart",class:"full height-240"};e(57658);var r=e(84722),h=e(26917),n={name:"BpsChart",props:{pid:{type:String,default:""},apply:{type:String,default:""},params:{type:Object,default(){return{}}},where:{type:String,default:""},date:{type:String,default:""}},i18n:e(89234),data(){return{name:"",type:"",maxCnt:0,unit:"B",bpsData:{day:"",success:[],failed:[],xaxis:[]}}},watch:{where:{handler(){this.loadData()},deep:!0}},mounted(){this.loadData()},methods:{renderChart(){let t=this.$refs.bpsChart;this.$echarts.dispose(t);let a=this.$echarts.init(t),e={title:{},tooltip:{axisPointer:{type:"cross",label:{backgroundColor:"#6a7985"}}},color:["#8bd4a1"],legend:{data:["Success"],bottom:0},grid:{top:"0px",left:"0px",right:"0px",bottom:"0px",containLabel:!0},xAxis:[{type:"category",boundaryGap:!1,nameGap:30,axisLabel:{backgroundColor:"rgba(240,240,240,0.7)",padding:[2,3,2,3],textStyle:{color:"#6a7985"},inside:!0,borderRadius:2,minInterval:20},axisTick:{show:!1},axisLine:{show:!1},z:10}],yAxis:{axisLine:{show:!1},axisTick:{show:!1},z:10,splitLine:{show:!1},minInterval:1,axisLabel:{margin:0,showMinLabel:!1,showMaxLabel:!1,inside:!0,backgroundColor:"rgba(240,240,240,0.7)",padding:[2,3,2,3],textStyle:{color:"#6a7985"},textStyle:{color:"#999"},formatter:"{value} "+this.unit}},series:[{type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},lineStyle:{width:0},data:this.bpsData.success}]};a.setOption(e,{lazyUpdate:!0}),a.hideLoading()},loadData(){let t=this.$refs.bpsChart;this.$echarts.init(t).showLoading();let a=(0,r.VS)(this.date),e="";this.pid?"openapi"==this.apply?e+=` AND x_parameters.aid = '${this.pid}'`:"project"==this.apply?e+=` AND x_parameters.pid = '${this.pid}'`:"mesh"==this.apply?e+=` AND meshName = '${this.params.name}'`:"service"==this.apply&&(e+=(0,h.lh)("and",this.params.name,this.params.namespace,this.params.domain)):e+=" AND timestamp > subtractWeeks(now(),1)";let s=`select sum(reqSize+resSize) as bps,${a} as time from log where 1=1 AND bondType != 'outbound' ${this.where} ${e} group by time order by time;`;this.categories=[],this.links=[],this.maxCnt=0,this.$request(this.$REST.CLICKHOUSE.QUERY(s),this.$METHOD.GET).then((t=>{this.bpsData={day:"",success:[],xaxis:[]};let a=t.data.split("\n"),e=0;a.map((t=>{let s=t.split("\t");if(e++,s[1]){let t=new Date(s[1]).getTime();this.maxCnt=1*s[0]>this.maxCnt?1*s[0]:this.maxCnt;let i=(0,r.Fw)(t,this.date);this.bpsData.success.push([i,1*s[0]]),this.bpsData.xaxis.push(i),1==e?this.bpsData.day=i:e+1==a.length&&this.bpsData.day!=i&&(this.bpsData.day+=" ~ "+i)}return t})),0==this.bpsData.success.length?this.bpsData.success.push(0):this.maxCnt>1073741824?(this.bpsData.success.forEach(((t,a)=>{this.bpsData.success[a]=t/1073741824})),this.unit="GB"):this.maxCnt>1048576?(this.bpsData.success.forEach(((t,a)=>{this.bpsData.success[a]=t/1048576})),this.unit="MB"):this.maxCnt>1024?(this.bpsData.success.forEach(((t,a)=>{this.bpsData.success[a]=t/1024})),this.unit="KB"):this.unit="B",0==this.bpsData.xaxis.length&&this.bpsData.xaxis.push((0,r.Fw)((new Date).getTime(),this.date)),this.renderChart()})).catch((t=>{}))}}};var o=(0,e(83744).Z)(n,[["render",function(t,a,e,r,h,n){return(0,s.wg)(),(0,s.iD)("div",null,[(0,s._)("div",i,null,512)])}],["__scopeId","data-v-373258ca"]])},52795:function(t,a,e){e.d(a,{Z:function(){return o}});var s=e(66252);const i=["title"],r={ref:"delayChart",class:"full height-240"};e(57658);var h=e(26917),n={name:"DelayChart",props:{pid:{type:String,default:""},apply:{type:String,default:""},params:{type:Object,default(){return{}}},where:{type:String,default:""}},i18n:e(89234),data(){return{name:"",type:"",latency:[],maxCnt:0,delayData:{data:[],xaxis:[]}}},watch:{where:{handler(){this.loadData()},deep:!0}},mounted(){this.loadData()},methods:{renderChart(){let t=this.$refs.delayChart;this.$echarts.dispose(t);let a=this.$echarts.init(t),e={title:{},xAxis:{data:this.delayData.xaxis,axisLabel:{backgroundColor:"rgba(240,240,240,0.7)",padding:[2,3,2,3],textStyle:{color:"#6a7985"},inside:!0,borderRadius:2,minInterval:20},axisTick:{show:!1},axisLine:{show:!1},z:10},tooltip:{trigger:"axis",axisPointer:{type:"cross",label:{backgroundColor:"#6a7985"}}},grid:{top:"0px",right:"10px",left:"30px",bottom:"0px"},yAxis:{splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1},axisLabel:{showMinLabel:!1,showMaxLabel:!1,inside:!0,margin:-30,backgroundColor:"rgba(240,240,240,0.7)",padding:[2,3,2,3],textStyle:{color:"#6a7985"},formatter:"{value} "+(this.maxCnt>1e3?"k":"")},z:10},dataZoom:[{type:"inside"}],series:[{type:"bar",showBackground:!0,itemStyle:{color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"#73bdef"},{offset:.5,color:"#73bdef"},{offset:1,color:"#73bdef"}])},emphasis:{itemStyle:{color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"#73bdef"},{offset:.7,color:"#73bdef"},{offset:1,color:"#73bdef"}])}},data:this.delayData.data}]};a.on("click",(function(t){a.dispatchAction({type:"dataZoom",startValue:dataAxis[Math.max(t.dataIndex-3,0)],endValue:dataAxis[Math.min(t.dataIndex+3,data.length-1)]})})),a.setOption(e,{lazyUpdate:!0}),a.hideLoading()},loadData(){let t=this.$refs.delayChart;this.$echarts.init(t).showLoading();let a="";this.pid&&("openapi"==this.apply?a+=` AND x_parameters.aid = '${this.pid}'`:"project"==this.apply?a+=` AND x_parameters.pid = '${this.pid}'`:"mesh"==this.apply?a+=` AND meshName = '${this.params.name}'`:"service"==this.apply&&(a+=(0,h.lh)("and",this.params.name,this.params.namespace,this.params.domain)));let e=`select (ceil((resTime - reqTime)/10)) as latency ,count() as count from log where resTime > 0 and (resTime - reqTime) > 0 AND bondType != 'outbound' ${this.where} ${a} group by latency order by latency;`;this.categories=[],this.maxCnt=0,this.links=[],this.$request(this.$REST.CLICKHOUSE.QUERY(e),this.$METHOD.GET).then((t=>{this.delayData={data:[],xaxis:[]},t.data.split("\n").map((t=>{let a=t.split("\t");return a[1]&&(this.maxCnt=1*a[1]>this.maxCnt?1*a[1]:this.maxCnt,this.delayData.data.push(1*a[1]),this.delayData.xaxis.push(10*a[0]+"ms")),t})),0==this.delayData.data.length?this.delayData.data.push(0):this.maxCnt>1e3&&this.delayData.data.forEach(((t,a)=>{this.delayData.data[a]=t/1e3})),0==this.delayData.xaxis.length&&this.delayData.xaxis.push("0ms"),this.renderChart()})).catch((t=>{}))}}};var o=(0,e(83744).Z)(n,[["render",function(t,a,e,h,n,o){return(0,s.wg)(),(0,s.iD)("div",{title:t.$t("Latency")},[(0,s._)("div",r,null,512)],8,i)}],["__scopeId","data-v-4bc36717"]])},29495:function(t,a,e){e.d(a,{Z:function(){return o}});var s=e(66252);const i={ref:"streamChart",class:"full height-240"};e(57658);var r=e(84722),h=e(26917),n={name:"QoSSummaryChart",props:{pid:{type:String,default:""},apply:{type:String,default:""},params:{type:Object,default(){return{}}},where:{type:String,default:""},date:{type:String,default:""}},i18n:e(89234),data(){return{name:"",type:"",streamData:{day:"",error:[],success:[]}}},watch:{where:{handler(){this.loadData()},deep:!0}},mounted(){this.loadData()},methods:{renderChart(){let t=this.$refs.streamChart;this.$echarts.dispose(t);let a=this.$echarts.init(t),e={title:{},color:["#fb9690","#8bd4a1"],grid:{left:"0px",right:"0px",top:"45px",bottom:"0px"},tooltip:{showDelay:0,formatter:t=>t.color?`<span style="background:${t.color};width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:10px"></span>`+(0,r.Fw)(t.data[0],this.date)+" / "+Math.ceil(t.data[1])+"ms":`${t.name}: ${Math.ceil(t.value)}ms`,axisPointer:{show:!0,type:"cross",lineStyle:{type:"dashed",width:1}}},toolbox:{feature:{dataZoom:{},brush:{type:["rect","polygon","clear"]}}},brush:{},xAxis:[{type:"category",scale:!0,nameGap:30,axisPointer:{label:{formatter:t=>(0,r.Fw)(t.value,this.date)}},axisLabel:{showMinLabel:!1,showMaxLabel:!1,borderRadius:2,margin:0,minInterval:20,inside:!0,backgroundColor:"rgba(240,240,240,0.7)",padding:[2,3,2,3],textStyle:{color:"#6a7985"},hideOverlap:!0,interval:"auto",borderRadius:2,inside:!0,formatter:t=>(0,r.Fw)(t,this.date)},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1},z:10}],yAxis:[{type:"value",scale:!0,min:0,z:10,axisLabel:{showMinLabel:!1,showMaxLabel:!1,inside:!0,margin:0,backgroundColor:"rgba(240,240,240,0.7)",padding:[2,3,2,3],textStyle:{color:"#6a7985"},formatter:"{value} ms"},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}}],series:[{name:"Failed",type:"scatter",emphasis:{focus:"series"},data:this.streamData.error,markArea:{silent:!0,itemStyle:{color:"transparent",borderWidth:1,borderType:"dashed"},data:[[{xAxis:"min",yAxis:"min"},{xAxis:"max",yAxis:"max"}]]},markLine:{lineStyle:{type:"solid"},data:[{type:"average",name:"Average"}]}},{name:"Success",type:"scatter",emphasis:{focus:"series"},data:this.streamData.success,markArea:{silent:!0,itemStyle:{color:"transparent",borderWidth:1,borderType:"dashed"},data:[[{xAxis:"min",yAxis:"min"},{xAxis:"max",yAxis:"max"}]]},markLine:{lineStyle:{type:"solid"},data:[{type:"average",name:"Average"}]}}]};a.setOption(e,{lazyUpdate:!0}),a.hideLoading()},loadData(){let t=this.$refs.streamChart;this.$echarts.init(t).showLoading();let a=(0,r.En)(this.date),e="";this.pid?"openapi"==this.apply?e+=` AND x_parameters.aid = '${this.pid}'`:"project"==this.apply?e+=` AND x_parameters.pid = '${this.pid}'`:"mesh"==this.apply?e+=` AND meshName = '${this.params.name}'`:"service"==this.apply&&(e+=(0,h.lh)("and",this.params.name,this.params.namespace,this.params.domain)):e+=" AND timestamp > subtractWeeks(now(),1)";let s=`select ${a} as x,avg(resTime - reqTime) as latency,res.status as status from log where resTime > 0 AND bondType != 'outbound' ${this.where} ${e} group by x,status order by x;`;this.categories=[],this.links=[],this.$request(this.$REST.CLICKHOUSE.QUERY(s),this.$METHOD.GET).then((t=>{this.streamData={day:"",error:[],success:[]};let a=t.data.split("\n"),e=0;a.map((t=>{let s=t.split("\t");if(e++,s[2]){let t=new Date(s[0]).getTime();s[2]<400?this.streamData.success.push([t,1*s[1]]):s[2]>=400&&this.streamData.error.push([t,1*s[1]]),1==e?this.streamData.day=(0,r.Fw)(t,this.date):e+1==a.length&&this.streamData.day!=(0,r.Fw)(t,this.date)&&(this.streamData.day+=" ~ "+(0,r.Fw)(t,this.date))}return t})),0==this.streamData.success.length&&this.streamData.success.push([(new Date).getTime(),0]),0==this.streamData.error.length&&this.streamData.error.push([(new Date).getTime(),0]),this.renderChart()})).catch((t=>{}))}}};var o=(0,e(83744).Z)(n,[["render",function(t,a,e,r,h,n){return(0,s.wg)(),(0,s.iD)("div",null,[(0,s._)("div",i,null,512)])}],["__scopeId","data-v-2de345c9"]])},36657:function(t,a,e){e.d(a,{Z:function(){return n}});var s=e(66252);const i={ref:"statusChart",class:"full height-240"};e(57658);var r=e(26917),h={name:"StatusChart",props:{pid:{type:String,default:""},apply:{type:String,default:""},params:{type:Object,default(){return{}}},where:{type:String,default:""}},i18n:e(89234),data(){return{name:"",type:"",maxCnt:0,statusData:{data:[],xaxis:[]}}},watch:{where:{handler(){this.loadData()},deep:!0}},mounted(){this.loadData()},methods:{renderChart(){let t=this.$refs.statusChart;this.$echarts.dispose(t);let a=this.$echarts.init(t),e={title:{},xAxis:{data:this.statusData.xaxis,axisLabel:{backgroundColor:"rgba(240,240,240,0.7)",padding:[2,3,2,3],textStyle:{color:"#6a7985"},inside:!0,borderRadius:2,minInterval:20},axisTick:{show:!1},axisLine:{show:!1},z:10},tooltip:{trigger:"axis",axisPointer:{type:"cross",label:{backgroundColor:"#6a7985"}}},grid:{bottom:"0px",right:"10px",top:"0px",left:"40px"},yAxis:{splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1},axisLabel:{showMinLabel:!1,showMaxLabel:!1,inside:!0,margin:-40,backgroundColor:"rgba(240,240,240,0.7)",padding:[2,3,2,3],textStyle:{color:"#6a7985"},formatter:"{value} "+(this.maxCnt>1e3?"k":"")}},dataZoom:[{type:"inside"}],series:[{type:"bar",showBackground:!0,data:this.statusData.data}]};a.on("click",(function(t){a.dispatchAction({type:"dataZoom",startValue:dataAxis[Math.max(t.dataIndex-3,0)],endValue:dataAxis[Math.min(t.dataIndex+3,data.length-1)]})})),a.setOption(e,{lazyUpdate:!0}),a.hideLoading()},loadData(){let t=this.$refs.statusChart;this.$echarts.init(t).showLoading();let a="";this.pid&&("openapi"==this.apply?a+=` AND x_parameters.aid = '${this.pid}'`:"project"==this.apply?a+=` AND x_parameters.pid = '${this.pid}'`:"mesh"==this.apply?a+=` AND meshName = '${this.params.name}'`:"service"==this.apply&&(a+=(0,r.lh)("and",this.params.name,this.params.namespace,this.params.domain)));let e=`select count() as count,res.status from log where res.status>'0' AND bondType != 'outbound' ${this.where} ${a} group by res.status order by res.status`;this.categories=[],this.maxCnt=0,this.links=[],this.$request(this.$REST.CLICKHOUSE.QUERY(e),this.$METHOD.GET).then((t=>{this.statusData={data:[],xaxis:[]},t.data.split("\n").map((t=>{let a=t.split("\t");if(a[1]){let t="";t=a[1]<300?"#8bd4a1":a[1]<400?"#fac858":"#fb9690",this.maxCnt=1*a[0]>this.maxCnt?1*a[0]:this.maxCnt,this.statusData.data.push({value:1*a[0],itemStyle:{color:t}}),this.statusData.xaxis.push(a[1])}return t})),0==this.statusData.data.length?this.statusData.data.push({value:0}):this.maxCnt>1e3&&this.statusData.data.forEach((t=>{t.value=t.value/1e3})),0==this.statusData.xaxis.length&&this.statusData.xaxis.push("-"),this.renderChart()})).catch((t=>{}))}}};var n=(0,e(83744).Z)(h,[["render",function(t,a,e,r,h,n){return(0,s.wg)(),(0,s.iD)("div",null,[(0,s._)("div",i,null,512)])}],["__scopeId","data-v-7f39997f"]])}}]);