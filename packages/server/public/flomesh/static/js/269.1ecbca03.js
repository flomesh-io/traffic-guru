"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[269],{34340:function(e,t,i){i.d(t,{Z:function(){return l}});var n=i(66252),o=i(3577);const s={class:"exception-page"},c={class:"img"},r=["src"],a={class:"content"},p={class:"desc"},u={class:"action"};i(57658);var g={403:{img:i(96850),title:"403",desc:"Sorry, you don't have permission to access this page"},404:{img:i(86465),title:"404",desc:"Sorry, the page you visited does not exist or is still under development"},500:{img:i(85798),title:"500",desc:"Sorry, something went wrong with the server"}},h={name:"ExceptionPage",props:["type","homeRoute"],data(){return{config:g}},methods:{backHome(){this.homeRoute&&this.$router.push(this.homeRoute),this.$emit("backHome",this.type)}}};var l=(0,i(83744).Z)(h,[["render",function(e,t,i,g,h,l){const m=(0,n.up)("a-button");return(0,n.wg)(),(0,n.iD)("div",s,[(0,n._)("div",c,[(0,n._)("img",{src:h.config[i.type].img},null,8,r)]),(0,n._)("div",a,[(0,n._)("h1",null,(0,o.zw)(h.config[i.type].title),1),(0,n._)("div",p,(0,o.zw)(h.config[i.type].desc),1),(0,n._)("div",u,[(0,n.Wm)(m,{type:"primary",onClick:l.backHome},{default:(0,n.w5)((()=>[(0,n.Uk)(" Back Home ")])),_:1},8,["onClick"])])])])}],["__scopeId","data-v-3c24701e"]])},616:function(e,t,i){i.r(t),i.d(t,{default:function(){return a}});var n=i(66252),o=i(3577);var s=i(34340),c=i(33907),r={name:"Exp404",components:{ExceptionPage:s.Z},computed:{...(0,c.rn)("setting",["pageMinHeight"]),minHeight(){return this.pageMinHeight?this.pageMinHeight+"px":"100vh"}}};var a=(0,i(83744).Z)(r,[["render",function(e,t,i,s,c,r){const a=(0,n.up)("ExceptionPage");return(0,n.wg)(),(0,n.j4)(a,{"home-route":"/workplace",style:(0,o.j5)(`min-height: ${r.minHeight}`),type:"404"},null,8,["style"])}]])},96850:function(e,t,i){e.exports=i.p+"static/img/403.d66555e5.svg"},86465:function(e,t,i){e.exports=i.p+"static/img/404.27e32482.svg"},85798:function(e,t,i){e.exports=i.p+"static/img/500.46c83673.svg"}}]);