"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[7167],{76550:function(e,a,i){i.d(a,{Z:function(){return Z}});var l=i(66252),n=i(3577);const p=e=>((0,l.dD)("data-v-4d73146c"),e=e(),(0,l.Cn)(),e),t={key:0},u={key:1},s=p((()=>(0,l._)("span",null,".",-1))),d={key:3},r=p((()=>(0,l._)("span",null,".",-1))),f={key:5},o=p((()=>(0,l._)("span",null,".",-1))),c={key:1},h={key:1},g={key:2},w={key:3},k={key:1},y={key:3},m={key:4},v={key:1},x={key:3},b={key:5},C={key:1},q={key:6},z=p((()=>(0,l._)("span",null," : ",-1))),D={key:1},_={key:3},j={key:7},$=p((()=>(0,l._)("span",null," / ",-1))),U={key:1};var I={name:"IPRange",i18n:i(89234),props:["type","editable","ip"],data(){return{}},created(){},methods:{handleChange(e,a){let i=this.ip;i&&(5==this.type?(i.a||(i.a="::ffff:0"),i.suffix||(i.suffix="ffff")):6==i.type&&(i.a||(i.a="::ffff:0:0"),i.suffix||(i.suffix="120")),i[a]=e,this.$emit("update:ip",i),this.$emit("handleChange",i))}}};var Z=(0,i(83744).Z)(I,[["render",function(e,a,i,p,I,Z){const S=(0,l.up)("a-input-number"),W=(0,l.up)("a-input");return(0,l.wg)(),(0,l.iD)(l.HY,null,[i.type<=4?((0,l.wg)(),(0,l.iD)("span",t,[i.editable?((0,l.wg)(),(0,l.j4)(S,{key:"a",min:0,max:999,class:"ipunit",value:i.ip.a,"onUpdate:value":a[0]||(a[0]=e=>i.ip.a=e),placeholder:i.ip.a,onChange:a[1]||(a[1]=e=>Z.handleChange(i.ip.a,"a"))},null,8,["value","placeholder"])):((0,l.wg)(),(0,l.iD)("span",u,(0,n.zw)(i.ip.a),1)),s,i.editable?((0,l.wg)(),(0,l.j4)(S,{key:"b",type:"number",min:0,max:999,class:"ipunit",value:i.ip.b,"onUpdate:value":a[2]||(a[2]=e=>i.ip.b=e),placeholder:i.ip.b,onChange:a[3]||(a[3]=e=>Z.handleChange(i.ip.b,"b"))},null,8,["value","placeholder"])):((0,l.wg)(),(0,l.iD)("span",d,(0,n.zw)(i.ip.b),1)),r,i.editable?((0,l.wg)(),(0,l.j4)(S,{key:"c",min:0,max:999,class:"ipunit",value:i.ip.c,"onUpdate:value":a[4]||(a[4]=e=>i.ip.c=e),placeholder:i.ip.c,onChange:a[5]||(a[5]=e=>Z.handleChange(i.ip.c,"c"))},null,8,["value","placeholder"])):((0,l.wg)(),(0,l.iD)("span",f,(0,n.zw)(i.ip.c),1)),o])):((0,l.wg)(),(0,l.iD)("span",c,[i.editable?((0,l.wg)(),(0,l.j4)(W,{key:"a",class:"ipunit width-200",value:i.ip.a,"onUpdate:value":a[6]||(a[6]=e=>i.ip.a=e),placeholder:i.ip.a,onChange:a[7]||(a[7]=e=>Z.handleChange(i.ip.a,"a"))},null,8,["value","placeholder"])):((0,l.wg)(),(0,l.iD)("span",h,(0,n.zw)(i.ip.a),1))])),1==i.type?((0,l.wg)(),(0,l.iD)("span",g,"x")):(0,l.kq)("",!0),2==i.type?((0,l.wg)(),(0,l.iD)("span",w,[i.editable?((0,l.wg)(),(0,l.j4)(S,{key:"d",min:0,max:i.ip.suffix?i.ip.suffix-1:999,class:"ipunit",value:i.ip.d,"onUpdate:value":a[8]||(a[8]=e=>i.ip.d=e),placeholder:i.ip.d,onChange:a[9]||(a[9]=e=>Z.handleChange(i.ip.d,"d"))},null,8,["max","value","placeholder"])):(0,l.kq)("",!0),i.editable?((0,l.wg)(),(0,l.iD)("span",k,"- "+(0,n.zw)(i.ip.a)+" . "+(0,n.zw)(i.ip.b)+" . "+(0,n.zw)(i.ip.c)+" .",1)):(0,l.kq)("",!0),i.editable?((0,l.wg)(),(0,l.j4)(S,{key:"suffix",min:1*i.ip.d+1,max:999,class:"ipunit",value:i.ip.suffix,"onUpdate:value":a[10]||(a[10]=e=>i.ip.suffix=e),placeholder:i.ip.suffix,onChange:a[11]||(a[11]=e=>Z.handleChange(i.ip.suffix,"suffix"))},null,8,["min","value","placeholder"])):(0,l.kq)("",!0),i.editable?(0,l.kq)("",!0):((0,l.wg)(),(0,l.iD)("span",y,(0,n.zw)(i.ip.d)+" - "+(0,n.zw)(i.ip.a)+" . "+(0,n.zw)(i.ip.b)+" . "+(0,n.zw)(i.ip.c)+" . "+(0,n.zw)(i.ip.suffix),1))])):(0,l.kq)("",!0),3==i.type?((0,l.wg)(),(0,l.iD)("span",m,[i.editable?((0,l.wg)(),(0,l.j4)(S,{key:"d",min:0,max:999,class:"ipunit",value:i.ip.d,"onUpdate:value":a[12]||(a[12]=e=>i.ip.d=e),placeholder:i.ip.d,onChange:a[13]||(a[13]=e=>Z.handleChange(i.ip.d,"d"))},null,8,["value","placeholder"])):(0,l.kq)("",!0),i.editable?((0,l.wg)(),(0,l.iD)("span",v,"/")):(0,l.kq)("",!0),i.editable?((0,l.wg)(),(0,l.j4)(S,{key:"suffix",type:"number",min:0,max:999,class:"ipunit",value:i.ip.suffix,"onUpdate:value":a[14]||(a[14]=e=>i.ip.suffix=e),placeholder:i.ip.suffix,onChange:a[15]||(a[15]=e=>Z.handleChange(i.ip.suffix,"suffix"))},null,8,["value","placeholder"])):(0,l.kq)("",!0),i.editable?(0,l.kq)("",!0):((0,l.wg)(),(0,l.iD)("span",x,(0,n.zw)(i.ip.d)+" / "+(0,n.zw)(i.ip.suffix),1))])):(0,l.kq)("",!0),4==i.type?((0,l.wg)(),(0,l.iD)("span",b,[i.editable?((0,l.wg)(),(0,l.j4)(S,{key:"d",type:"number",min:0,max:999,class:"ipunit",value:i.ip.d,"onUpdate:value":a[16]||(a[16]=e=>i.ip.d=e),placeholder:i.ip.d,onChange:a[17]||(a[17]=e=>Z.handleChange(i.ip.d,"d"))},null,8,["value","placeholder"])):(0,l.kq)("",!0),i.editable?(0,l.kq)("",!0):((0,l.wg)(),(0,l.iD)("span",C,(0,n.zw)(i.ip.d),1))])):(0,l.kq)("",!0),5==i.type?((0,l.wg)(),(0,l.iD)("span",q,[z,i.editable?((0,l.wg)(),(0,l.j4)(W,{key:"d",class:"ipunit",value:i.ip.d,"onUpdate:value":a[18]||(a[18]=e=>i.ip.d=e),placeholder:i.ip.d,onChange:a[19]||(a[19]=e=>Z.handleChange(i.ip.d,"d"))},null,8,["value","placeholder"])):(0,l.kq)("",!0),i.editable?((0,l.wg)(),(0,l.iD)("span",D,"- "+(0,n.zw)(i.ip.a)+" :",1)):(0,l.kq)("",!0),i.editable?((0,l.wg)(),(0,l.j4)(W,{key:"suffix",class:"ipunit",value:i.ip.suffix,"onUpdate:value":a[20]||(a[20]=e=>i.ip.suffix=e),placeholder:i.ip.suffix,onChange:a[21]||(a[21]=e=>Z.handleChange(i.ip.suffix,"suffix"))},null,8,["value","placeholder"])):(0,l.kq)("",!0),i.editable?(0,l.kq)("",!0):((0,l.wg)(),(0,l.iD)("span",_,(0,n.zw)(i.ip.d)+" - "+(0,n.zw)(i.ip.a)+" : "+(0,n.zw)(i.ip.suffix),1))])):(0,l.kq)("",!0),6==i.type?((0,l.wg)(),(0,l.iD)("span",j,[$,i.editable?((0,l.wg)(),(0,l.j4)(S,{key:"suffix",min:0,max:999,class:"ipunit",value:i.ip.suffix,"onUpdate:value":a[22]||(a[22]=e=>i.ip.suffix=e),placeholder:i.ip.suffix,onChange:a[23]||(a[23]=e=>Z.handleChange(i.ip.suffix,"suffix"))},null,8,["value","placeholder"])):(0,l.kq)("",!0),i.editable?(0,l.kq)("",!0):((0,l.wg)(),(0,l.iD)("span",U,(0,n.zw)(i.ip.suffix),1))])):(0,l.kq)("",!0)],64)}],["__scopeId","data-v-4d73146c"]])},1299:function(e,a,i){i.d(a,{Z:function(){return u}});var l=i(66252),n=i(3577);const p={key:0,class:"title"};var t={name:"DetailList",props:{title:{type:String,required:!1,default:""},col:{type:Number,required:!1,default:3},size:{type:String,required:!1,default:"large"},layout:{type:String,required:!1,default:"horizontal"}}};var u=(0,i(83744).Z)(t,[["render",function(e,a,i,t,u,s){const d=(0,l.up)("a-row");return(0,l.wg)(),(0,l.iD)("div",{class:(0,n.C_)(["detail-list","small"===i.size?"small":"large","vertical"===i.layout?"vertical":"horizontal"]),style:(0,n.j5)("flex-"+i.col)},[i.title?((0,l.wg)(),(0,l.iD)("div",p,(0,n.zw)(i.title),1)):(0,l.kq)("",!0),(0,l.Wm)(d,null,{default:(0,l.w5)((()=>[(0,l.WI)(e.$slots,"default")])),_:3})],6)}]])},13589:function(e,a,i){i.d(a,{Z:function(){return s}});var l=i(66252),n=i(3577);const p={class:"detail-content"};const t={1:{xs:24},2:{xs:24,sm:12},3:{xs:24,sm:12,md:8},4:{xs:24,sm:12,md:6}};var u={name:"DetailListItem",i18n:i(39945),props:{name:{type:String,required:!1,default:""},rules:{type:Array,required:!1,default(){return[]}},term:{type:String,required:!1,default:""},termTop:{type:Boolean}},data(){return{col:2,responsive:t}},computed:{getRules(){return this.rules.map((e=>(e.message=this.$t(e.message),e))),this.rules}},created(){this.$parent&&this.$parent.$parent&&this.$parent.$parent.col>0&&(this.col=this.$parent.$parent.col)},methods:{}};var s=(0,i(83744).Z)(u,[["render",function(e,a,i,t,u,s){const d=(0,l.up)("a-form-item"),r=(0,l.up)("a-col");return(0,l.wg)(),(0,l.j4)(r,(0,l.dG)({class:"detail-list-content flex"},u.responsive[u.col]),{default:(0,l.w5)((()=>[(0,l._)("div",{class:(0,n.C_)(i.termTop?"term top":"term")},(0,n.zw)(i.term),3),(0,l._)("div",p,[i.rules?((0,l.wg)(),(0,l.j4)(d,{key:0,name:i.name,rules:s.getRules},{default:(0,l.w5)((()=>[(0,l.WI)(e.$slots,"default")])),_:3},8,["name","rules"])):(0,l.WI)(e.$slots,"default",{key:1})])])),_:3},16)}]])}}]);