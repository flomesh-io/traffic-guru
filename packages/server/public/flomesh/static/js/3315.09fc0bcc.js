"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[3315],{15199:function(e,t,a){a.d(t,{Z:function(){return y}});var i=a(66252),s=a(3577);const d={key:1},l={key:0},o={key:0},n=["onClick"],r={key:1},u=["onClick"],p={key:1},h=["onClick"],c={class:"pd-20"};a(57658);var m=a(44218),f=a(76550);const g=[{key:"Type",dataIndex:"type",id:"type",width:"20%"},{key:"IP Pool",dataIndex:"a",id:"a",width:"40%"},{key:"Action",id:"operation",dataIndex:"operation"}];var w={name:"IPList",i18n:a(89234),components:{PlusOutlined:m.Z,IPRange:f.Z},props:["list","title","fixedType"],data(){return{columns:g,options_keyset:["","0.0.0.x IP","0.0.0.x - 0.0.0.y IP","0.0.0.x/y IP","Fixed IP","::x - ::y IPv6","::x/y IPv6"],options:[{value:2,label:"0.0.0.x - 0.0.0.y IP"},{value:3,label:"0.0.0.x/y IP"},{value:5,label:"::x - ::y IPv6"},{value:6,label:"::x/y IPv6"}],address:[]}},computed:{dataColumns(){return this.fixedType&&"type"==this.columns[0].id&&this.columns.splice(0,1),this.columns.map((e=>(e.title=this.$t(e.key),e)))}},watch:{list(){this.address=this.list}},created(){this.address=this.list},methods:{newMember(){this.address.push({id:this.address.length+1,type:this.fixedType?this.fixedType:2,a:0,b:0,c:0,d:0,suffix:0,editable:!0,isNew:!0})},remove(e){this.address.filter((t=>t.id!==e)),this.address.splice(e,1)},saveRow(e){let t=this.address.filter((t=>t.id===e))[0];t.editable=!1,t.isNew=!1},toggle(e){let t=null,a=this.address.filter(((a,i)=>(a.id===e&&(t=i),a.id===e)))[0];a.editable=!a.editable,this.$set(this.address,t,a)},cancle(e){let t=null,a=this.address.filter(((a,i)=>(a.id===e&&(t=i),a.id===e)))[0];a.editable=!1,this.$set(this.address,t,a)},handleIpChange(e,t){const a=[...this.address],i=a.filter((e=>t===e.id))[0];i&&(i.a=e.a,i.b=e.b,i.c=e.c,i.d=e.d,i.suffix=e.suffix,this.address=a),this.$emit("update:list",this.address)},handleChange(e,t,a){const i=[...this.address],s=i.filter((e=>t===e.id))[0];s&&(5==s.type?(s.a="::ffff:0",s.suffix="ffff"):6==s.type&&(s.a="::ffff:0:0",s.suffix="120"),s[a]=e,this.address=i),this.$emit("update:list",this.address)},valid(){for(let e=0;e<this.address.length;e++){let t=this.address[e];if(t.type<=4&&(""===t.a||""===t.b||""===t.c))return this.$message.error(e+1+" row IP not set",3),!1;if(t.type>4&&""===t.a)return this.$message.error(e+1+" row IP not set",3),!1;if(!(2!=t.type&&5!=t.type||""!==t.d&&""!==t.suffix))return this.$message.error(e+1+" row IP not set",3),!1;if(!(3!=t.type&&6!=t.type||""!==t.d&&""!==t.suffix))return this.$message.error(e+1+" row IP not set",3),!1;if(4==t.type&&""===t.d)return this.$message.error(e+1+" row IP not set",3),!1;if(2==t.type&&1*t.d>=1*t.suffix)return this.$message.error(e+1+" invalid row IP segment range",3),!1}return!0}}};var y=(0,a(83744).Z)(w,[["render",function(e,t,a,m,f,g){const w=(0,i.up)("a-select-option"),y=(0,i.up)("a-select"),v=(0,i.up)("IPRange"),$=(0,i.up)("a-divider"),k=(0,i.up)("a-popconfirm"),P=(0,i.up)("a-table"),b=(0,i.up)("PlusOutlined"),C=(0,i.up)("a-button"),I=(0,i.up)("a-card");return(0,i.wg)(),(0,i.j4)(I,{class:"card nopd",bordered:!1,title:a.title},{default:(0,i.w5)((()=>[(0,i.Wm)(P,{"row-key":"id",columns:g.dataColumns,"data-source":f.address,pagination:!1},{bodyCell:(0,i.w5)((({column:t,record:a,index:c})=>["type"===t.dataIndex?((0,i.wg)(),(0,i.iD)(i.HY,{key:0},[a.editable?((0,i.wg)(),(0,i.j4)(y,{key:0,class:"ip-selector width-200",value:a.type,"onUpdate:value":e=>a.type=e,onChange:e=>g.handleChange(a.type,a.id,"type")},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(f.options,((e,t)=>((0,i.wg)(),(0,i.j4)(w,{value:e.value,key:t},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.label),1)])),_:2},1032,["value"])))),128))])),_:2},1032,["value","onUpdate:value","onChange"])):((0,i.wg)(),(0,i.iD)("span",d,(0,s.zw)(f.options_keyset[a.type]),1))],64)):"a"===t.dataIndex?((0,i.wg)(),(0,i.j4)(v,{key:1,ip:a,editable:a.editable,type:a.type,onHandleChange:e=>g.handleIpChange(e,a.id)},null,8,["ip","editable","type","onHandleChange"])):"operation"===t.dataIndex?((0,i.wg)(),(0,i.iD)(i.HY,{key:2},[a.editable?((0,i.wg)(),(0,i.iD)("span",l,[a.isNew?((0,i.wg)(),(0,i.iD)("span",o,[(0,i._)("a",{onClick:e=>g.saveRow(a.id,!0)},(0,s.zw)(e.$t("Ok")),9,n),(0,i.Wm)($,{type:"vertical"}),(0,i.Wm)(k,{title:e.$t("deleteConfirm"),onConfirm:e=>g.remove(c)},{default:(0,i.w5)((()=>[(0,i._)("a",null,(0,s.zw)(e.$t("delete")),1)])),_:2},1032,["title","onConfirm"])])):((0,i.wg)(),(0,i.iD)("span",r,[(0,i._)("a",{onClick:e=>g.cancle(a.id)},(0,s.zw)(e.$t("Ok")),9,u),(0,i.Wm)($,{type:"vertical"}),(0,i.Wm)(k,{title:e.$t("deleteConfirm"),onConfirm:e=>g.remove(c)},{default:(0,i.w5)((()=>[(0,i._)("a",null,(0,s.zw)(e.$t("delete")),1)])),_:2},1032,["title","onConfirm"])]))])):((0,i.wg)(),(0,i.iD)("span",p,[(0,i._)("a",{onClick:e=>g.toggle(a.id)},(0,s.zw)(e.$t("edit")),9,h),(0,i.Wm)($,{type:"vertical"}),(0,i.Wm)(k,{title:e.$t("deleteConfirm"),onConfirm:e=>g.remove(c)},{default:(0,i.w5)((()=>[(0,i._)("a",null,(0,s.zw)(e.$t("delete")),1)])),_:2},1032,["title","onConfirm"])]))],64)):(0,i.kq)("",!0)])),_:1},8,["columns","data-source"]),(0,i._)("div",c,[(0,i.Wm)(C,{class:"full",type:"dashed",onClick:g.newMember},{icon:(0,i.w5)((()=>[(0,i.Wm)(b)])),default:(0,i.w5)((()=>[(0,i.Uk)(" "+(0,s.zw)(e.$t("new")),1)])),_:1},8,["onClick"])])])),_:1},8,["title"])}],["__scopeId","data-v-72990012"]])},84793:function(e,t,a){a.r(t),a.d(t,{default:function(){return f}});var i=a(66252),s=a(3577);const d={key:0,class:"width-180"};var l=a(96486),o=a.n(l),n=a(61103),r=a(15199),u=a(84722),p=a(1299),h=a(13589),c=a(33907),m={name:"Address",i18n:a(89234),components:{PageLayout:n.Z,IPList:r.Z,DetailList:p.Z,DetailListItem:h.Z},data(){return{pid:"",name:"",orgs:[],address:[],organization:{},organizationName:"",pool:{name:"",organization:null},loading:!0}},computed:{...(0,c.rn)("rules",["rules"])},created(){this.pid=this.$route.params.id||"",this.pid?(this.loading=!0,this.$gql.query(`addressPool(id: ${this.pid}){data{id,attributes{name,organization{data{id,attributes{name}}},content}}}`).then((e=>{this.pool=e.data,this.organization=e.data.organization,this.pool.organization=e.data.organization&&e.data.organization.id?e.data.organization.id:null,this.address=(0,u.Oy)(e.data.content);for(let e=0;e<this.address.length;e++)this.address[e].editable=!1,this.address[e].isNew=!1;this.loading=!1}))):this.loading=!1,this.$gql.query("myOrganizations{data{id,attributes{name}}}").then((e=>{this.orgs=e.data}))},methods:{validForm(){return""==this.pool.name?(this.$message.error(this.$t("Please enter a name"),3),!1):0==this.address.length?(this.$message.error(this.$t("Please enter a address pool"),3),!1):this.$refs.ip.valid()},valid(){this.$refs.layout.$refs.form.validateFields().then((()=>{this.save()})).catch((()=>{}))},save(){if(!this.validForm())return;let e=(0,u.H)(this.address);this.pool.addressField=e,""!=this.pid?this.$gql.mutation(`updateAddressPool(id:${this.pid}, data: $data){data{id}}`,{data:{name:this.pool.name,organization:this.pool.organization,content:o().cloneDeep(this.pool.addressField)}},{data:"AddressPoolInput!"}).then((()=>{this.$message.success(this.$t("Save successfully"),3),this.$closePage(this.$route)})):this.$gql.mutation("createAddressPool(data: $data){data{id,attributes{name}}}",{data:{id:this.pool.id,name:this.pool.name,organization:this.pool.organization,content:o().cloneDeep(this.pool.addressField)}},{data:"AddressPoolInput!"}).then((e=>{this.pid=e.data.id,this.$message.success(this.$t("Created successfully"),3),this.$closePage(this.$route)}))}}};var f=(0,a(83744).Z)(m,[["render",function(e,t,a,l,o,n){const r=(0,i.up)("a-input"),u=(0,i.up)("DetailListItem"),p=(0,i.up)("a-select-option"),h=(0,i.up)("a-select"),c=(0,i.up)("a-tag"),m=(0,i.up)("DetailList"),f=(0,i.up)("a-button"),g=(0,i.up)("IPList"),w=(0,i.up)("PageLayout"),y=(0,i.Q2)("permission");return(0,i.wg)(),(0,i.j4)(w,{title:e.$t("addressPool"),bordered:!1,"form-state":o.pool,ref:"layout"},{headerContent:(0,i.w5)((()=>[(0,i.Wm)(m,{size:"small",col:2},{default:(0,i.w5)((()=>[(0,i.Wm)(u,{term:e.$t("as"),name:"name",rules:e.rules.uniqueName("addressPools",{id:o.pid})},{default:(0,i.w5)((()=>[(0,i.Wm)(r,{placeholder:e.$t("Name"),value:o.pool.name,"onUpdate:value":t[0]||(t[0]=e=>o.pool.name=e),class:"width-200"},null,8,["placeholder","value"])])),_:1},8,["term","rules"]),(0,i.Wm)(u,{term:e.$t("Organization"),rules:e.rules.required,name:"organization"},{default:(0,i.w5)((()=>[(0,i.wy)(((0,i.wg)(),(0,i.j4)(h,{placeholder:e.$t("unset"),value:o.pool.organization,"onUpdate:value":t[1]||(t[1]=e=>o.pool.organization=e),class:"width-180",ref:"select"},{default:(0,i.w5)((()=>[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(o.orgs,((e,t)=>((0,i.wg)(),(0,i.j4)(p,{value:e.id,key:t},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.name),1)])),_:2},1032,["value"])))),128))])),_:1},8,["placeholder","value"])),[[y,o.pid?["admin"]:""]]),o.pid?((0,i.wg)(),(0,i.iD)("div",d,[(0,i.wy)(((0,i.wg)(),(0,i.j4)(c,null,{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(o.organization?.name),1)])),_:1})),[[y,["!admin"]]])])):(0,i.kq)("",!0)])),_:1},8,["term","rules"])])),_:1})])),action:(0,i.w5)((()=>[""!=o.pid?(0,i.wy)(((0,i.wg)(),(0,i.j4)(f,{key:0,type:"primary",onClick:n.valid},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.$t("save")),1)])),_:1},8,["onClick"])),[[y,["address-pool:update"]]]):(0,i.wy)(((0,i.wg)(),(0,i.j4)(f,{key:1,type:"primary",onClick:n.valid},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.$t("create")),1)])),_:1},8,["onClick"])),[[y,["address-pool:create"]]])])),default:(0,i.w5)((()=>[(0,i.Wm)(g,{list:o.address,"onUpdate:list":t[2]||(t[2]=e=>o.address=e),ref:"ip"},null,8,["list"])])),_:1},8,["title","form-state"])}]])}}]);