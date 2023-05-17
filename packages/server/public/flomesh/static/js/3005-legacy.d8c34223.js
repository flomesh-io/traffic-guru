"use strict";(self.webpackChunkflomesh_load_balancer=self.webpackChunkflomesh_load_balancer||[]).push([[3005],{30541:function(t,e,n){var i=n(82109),a=n(47908),r=n(26244),l=n(83658),o=n(85117),u=n(7207),d=1!==[].unshift(0),s=!function(){try{Object.defineProperty([],"length",{writable:!1}).unshift()}catch(t){return t instanceof TypeError}}();i({target:"Array",proto:!0,arity:1,forced:d||s},{unshift:function(t){var e=a(this),n=r(e),i=arguments.length;if(i){u(n+i);for(var d=n;d--;){var s=d+i;d in e?e[s]=e[d]:o(e,s)}for(var c=0;c<i;c++)e[c]=arguments[c]}return l(e,n+i)}})},71900:function(t,e,n){n.d(e,{Z:function(){return o}});var i=n(66252),a=n(3577),r={class:"head-info"};var l={name:"HeadInfo",props:["title","content"]};var o=(0,n(83744).Z)(l,[["render",function(t,e,n,l,o,u){return(0,i.wg)(),(0,i.iD)("div",r,[(0,i._)("span",null,(0,a.zw)(n.title),1),(0,i._)("p",null,[(0,i.Uk)((0,a.zw)(n.content),1),(0,i.WI)(t.$slots,"body",{},void 0,!0)])])}],["__scopeId","data-v-00006846"]])},83005:function(t,e,n){n.r(e),n.d(e,{default:function(){return $}});n(68309);var i=n(66252),a=n(3577),r=function(t){return(0,i.dD)("data-v-cf31ed4c"),t=t(),(0,i.Cn)(),t}((function(){return(0,i._)("div",null,null,-1)})),l={class:"min-width-200"},o={class:"font-16"},u={key:0},d={class:"min-width-200"},s={key:0};var c=n(88478),h=n(95082),f=(n(41539),n(54747),n(40561),n(30541),n(38862),n(92222),n(57658),n(69826),n(21826)),p=n(62611),m=n(30631),y=n(10973),g={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M893.3 293.3L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 184h256v104H384V184zm456 656H184V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V840zM512 442c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 224c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"}}]},name:"save",theme:"outlined"},b=n(33058);function v(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?Object(arguments[e]):{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable})))),i.forEach((function(e){w(t,e,n[e])}))}return t}function w(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var k=function(t,e){var n=v({},t,e.attrs);return(0,i.Wm)(b.Z,v({},n,{icon:g}),null)};k.displayName="SaveOutlined",k.inheritAttrs=!1;var S=k,O=n(61103),E=n(71900),_=n(33907),P=n(85263),N={name:"RouterSetting",components:{HeadInfo:E.Z,PageLayout:O.Z,SyncOutlined:f.Z,PartitionOutlined:p.Z,EyeOutlined:m.Z,EyeInvisibleOutlined:y.Z,SaveOutlined:S},i18n:n(89234),data:function(){return{users:[],menus:[],checkedKeys:[],menuTree:[],PartitionOutlined:p.Z,isEdit:!1,selectProjects:[],selectUsers:[],roles:[],expandedKeys:[],visible:!1,payload:{id:"",name:"",parent:null,description:""},hasRouterSettingMenu:!1,routerSettingMenu:{showEnv:!0,showZone:!0},bindTarget:{},workload:[],projects:[],loading:!0,activities:[],config:{},teams:[],simpleImage:P.Z.PRESENTED_IMAGE_SIMPLE}},computed:(0,h.Z)({},(0,_.Se)("account",["user"])),mounted:function(){this.loaddata()},methods:{onDragEnter:function(){},displayNameChange:function(t,e){this.menuTree.forEach((function(n){n.fullPath==t.fullPath&&(n.displayName=e),n.children&&n.children.forEach((function(n){n.fullPath==t.fullPath&&(n.displayName=e)}))}))},onDrop:function(t){var e,n=t.node.key,i=t.dragNode.key,a=t.node.pos.split("-"),r=t.dropPosition-1*a[a.length-1],l=function t(e,n,i){e.forEach((function(a,r){return a.key===n?i(a,r,e):a.children?t(a.children,n,i):void 0}))},o=(0,c.Z)(this.menuTree);if(l(o,i,(function(t,n,i){i.splice(n,1),e=t})),t.dropToGap)if((t.node.children||[]).length>0&&t.node.expanded&&1===r)l(o,n,(function(t){t.children=t.children||[],t.children.unshift(e)}));else{var u=[],d=0;l(o,n,(function(t,e,n){u=n,d=e})),-1===r?u.splice(d,0,e):u.splice(d+1,0,e)}else l(o,n,(function(t){t.children=t.children||[],t.children.unshift(e)}))},add:function(){this.isEdit=!1,this.handleOk()},edit:function(){this.isEdit=!0,this.handleOk()},handleOk:function(){var t=this;this.loading=!0;var e=[];if(this.isEdit)e=this.resetRouterOptions(this.menuTree);else{n(75688)("./config".concat(".pro")).default.initRoutes.forEach((function(n){"/"==n.path&&(e=t.buildRouterOptions(n.children,"",1))}))}this.$gql.mutation("batchCreateRouterSetting(data: $data)",{data:e},{data:"JSON"}).then((function(){t.visible=!1,t.menuTree=[],t.isEdit?t.$message.success(t.$t("Save successfully"),3):t.$message.success(t.$t("Created successfully"),3),t.loaddata()})),this.saveRouterSettingMenu()},saveRouterSettingMenu:function(){var t=JSON.parse(JSON.stringify(this.routerSettingMenu));this.hasRouterSettingMenu?(delete t.id,this.$gql.mutation("updateSystemSetting(id:".concat(this.routerSettingMenu.id,", data: $data){data{id}}"),{data:{type:"RouterSetting",content:t}},{data:"SystemSettingInput!"}).then((function(){}))):this.$gql.mutation("createSystemSetting(data: $data){data{id}}",{data:{type:"RouterSetting",content:t}},{data:"SystemSettingInput!"}).then((function(){}))},setTreeKey:function(t){var e=this;return t?(t.forEach((function(t){t.key="".concat(t.level,"-").concat(t.id),t.enabled=!t.disabled,t.displayName=t.displayName?t.displayName:"",delete t.disabled,t.children&&t.enabled&&t.children.forEach((function(e){e.disabled&&(t.enabled=!1)})),t.enabled&&e.checkedKeys.push(t.key),t.children&&(t.children=e.setTreeKey(t.children))})),t):[]},loaddata:function(){var t=this;this.menuTree=[],this.checkedKeys=[],this.loading=!0,this.$gql.query('routerSettings(sort: "sort:asc", pagination: {limit: 9999 }, filters: { level: { eq: 1 } }){data{id,attributes{\n\t\t\t\t\t\tname,\n\t\t\t\t\t\tdisplayName,\n\t\t\t\t\t\tpath,\n\t\t\t\t\t\tfullPath,\n\t\t\t\t\t\tdisabled,\n\t\t\t\t\t\tauthority,\n\t\t\t\t\t\tinvisible,\n\t\t\t\t\t\tsort,\n\t\t\t\t\t\tlevel,\n\t\t\t\t\t\tparent{data{id,attributes{name,displayName,path,fullPath,disabled,authority,invisible,sort,level}}},\n\t\t\t\t\t\tchildren(pagination: {limit: 9999}){data{id,attributes{name,displayName,path,fullPath,disabled,authority,invisible,sort,level}}}\n\t\t\t\t\t}}}').then((function(e){t.menuTree=t.setTreeKey(JSON.parse(JSON.stringify(e.data))),t.loading=!1,e=[]})),this.$gql.query('systemSettings(filters:{type:{eq:"RouterSetting"}}){data{id,attributes{mode,content}}}').then((function(e){var n=e.data;t.hasRouterSettingMenu=n&&n.length>0,t.hasRouterSettingMenu?t.routerSettingMenu=(0,h.Z)((0,h.Z)({},n[0].content),{},{id:n[0].id}):t.routerSettingMenu={showEnv:!0,showZone:!0}}))},resetRouterOptions:function(t){var e=this,n=[],i=this.checkedKeys;return t&&t.forEach((function(t,a){var r="router-setting"!=t.path&&!i.find((function(e){return e==t.key}));t.children&&r&&t.children.forEach((function(t){t.enabled&&(r=!1)})),n.push({name:t.name,displayName:t.displayName,path:t.path,sort:a,authority:t.authority||"*",fullPath:t.fullPath,invisible:!!t.invisible,disabled:r,level:t.level,children:e.resetRouterOptions(t.children)})})),n},buildRouterOptions:function(t,e,n){var i=this,a=[],r=["/flb/dashboard","/flb/4lb/list","/flb/4lb/detail/:id","/flb/4lb/create","/flb/address/detail/:id","/flb/address/create","/flb/address/list","/flb/lbevent/list"];return t&&t.forEach((function(t,l){var o=t.meta?t.meta:{},u="".concat(e,"/").concat(t.path),d=!!o.disabled;"/flb"==e&&-1==r.indexOf(u)&&(d=!0),a.push({name:t.name,displayName:"",path:t.path,sort:l,authority:o.authority&&o.authority.permission?o.authority.permission:"string"==typeof o.authority?o.authority:"",fullPath:u,invisible:!!o.invisible,disabled:d,level:n,children:i.buildRouterOptions(t.children,u,n+1)})})),a}}};var $=(0,n(83744).Z)(N,[["render",function(t,e,n,c,h,f){var p=(0,i.up)("SyncOutlined"),m=(0,i.up)("HeadInfo"),y=(0,i.up)("SaveOutlined"),g=(0,i.up)("a-typography-paragraph"),b=(0,i.up)("a-tree"),v=(0,i.up)("a-card"),w=(0,i.up)("a-col"),k=(0,i.up)("EyeOutlined"),S=(0,i.up)("EyeInvisibleOutlined"),O=(0,i.up)("a-switch"),E=(0,i.up)("a-descriptions-item"),_=(0,i.up)("a-descriptions"),P=(0,i.up)("a-row"),N=((0,i.up)("PartitionOutlined"),(0,i.up)("PageLayout")),$=(0,i.Q2)("permission");return(0,i.wg)(),(0,i.j4)(N,{avatar:h.PartitionOutlined},{headerContent:(0,i.w5)((function(){return[r]})),extra:(0,i.w5)((function(){return[(0,i.wy)(((0,i.wg)(),(0,i.j4)(m,{class:"split-right",title:t.$t("Initialization Menu")},{body:(0,i.w5)((function(){return[(0,i._)("div",null,[(0,i.Wm)(p,{onClick:f.add,class:"font-primary icon-menu rotate-icon"},null,8,["onClick"])])]})),_:1},8,["title"])),[[$,["admin"]]]),(0,i.wy)(((0,i.wg)(),(0,i.j4)(m,{class:"split-right",title:t.$t("Save")},{body:(0,i.w5)((function(){return[(0,i._)("div",null,[(0,i.Wm)(y,{onClick:f.edit,class:"font-primary icon-menu"},null,8,["onClick"])])]})),_:1},8,["title"])),[[$,["admin"]]])]})),default:(0,i.w5)((function(){return[(0,i.Wm)(P,{class:"row-mg"},{default:(0,i.w5)((function(){return[(0,i.Wm)(w,{class:"col-pd",xl:12,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((function(){return[(0,i.Wm)(v,{title:t.$t("Menu Tree"),loading:h.loading},{extra:(0,i.w5)((function(){return[(0,i.Uk)((0,a.zw)(t.$t("Drag to change level")),1)]})),default:(0,i.w5)((function(){return[(0,i.Wm)(b,{"show-line":!0,class:"full",draggable:!0,checkedKeys:h.checkedKeys,"onUpdate:checkedKeys":e[0]||(e[0]=function(t){return h.checkedKeys=t}),checkable:"",onDragenter:f.onDragEnter,onDrop:f.onDrop,"default-expand-all":!1,"tree-data":h.menuTree},{title:(0,i.w5)((function(e){return[(0,i._)("div",l,[(0,i._)("b",o,[e.displayName?(0,i.kq)("",!0):((0,i.wg)(),(0,i.iD)("span",u,(0,a.zw)(t.$t(e.name)),1)),(0,i.Wm)(g,{class:"inline-block",content:e.displayName,"onUpdate:content":function(t){return e.displayName=t},editable:{onChange:f.displayNameChange(e,e.displayName)}},null,8,["content","onUpdate:content","editable"])])]),(0,i._)("div",d,[(0,i.Uk)((0,a.zw)(t.$t("Full Path"))+" : "+(0,a.zw)(e.fullPath)+" ",1),e.authority?((0,i.wg)(),(0,i.iD)("span",s,[(0,i.Uk)(" | "+(0,a.zw)(t.$t("Authority"))+": ",1),(0,i.Wm)(g,{class:"inline-block",content:e.authority,"onUpdate:content":function(t){return e.authority=t},editable:""},null,8,["content","onUpdate:content"])])):(0,i.kq)("",!0)])]})),_:1},8,["checkedKeys","onDragenter","onDrop","tree-data"])]})),_:1},8,["title","loading"])]})),_:1}),(0,i.Wm)(w,{class:"col-pd",xl:12,lg:24,md:24,sm:24,xs:24},{default:(0,i.w5)((function(){return[(0,i.Wm)(v,{class:"nopd",title:t.$t("Other Settings"),loading:h.loading},{default:(0,i.w5)((function(){return[(0,i.Wm)(_,{bordered:"",style:{"min-height":"650px"}},{default:(0,i.w5)((function(){return[(0,i.Wm)(E,{label:t.$t("Zone"),span:3},{default:(0,i.w5)((function(){return[(0,i.Wm)(O,{checked:h.routerSettingMenu.showZone,"onUpdate:checked":e[1]||(e[1]=function(t){return h.routerSettingMenu.showZone=t})},{checkedChildren:(0,i.w5)((function(){return[(0,i.Wm)(k)]})),unCheckedChildren:(0,i.w5)((function(){return[(0,i.Wm)(S)]})),_:1},8,["checked"])]})),_:1},8,["label"]),(0,i.Wm)(E,{label:t.$t("ENV"),span:3},{default:(0,i.w5)((function(){return[(0,i.Wm)(O,{checked:h.routerSettingMenu.showEnv,"onUpdate:checked":e[2]||(e[2]=function(t){return h.routerSettingMenu.showEnv=t})},{checkedChildren:(0,i.w5)((function(){return[(0,i.Wm)(k)]})),unCheckedChildren:(0,i.w5)((function(){return[(0,i.Wm)(S)]})),_:1},8,["checked"])]})),_:1},8,["label"])]})),_:1})]})),_:1},8,["title","loading"])]})),_:1})]})),_:1}),(0,i.kq)("",!0)]})),_:1},8,["avatar"])}],["__scopeId","data-v-cf31ed4c"]])}}]);