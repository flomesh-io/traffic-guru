import { ROUTES } from "@/services/api";
import {
  request,
  METHOD,
  removeAuthorization,
} from "@/utils/request";
import { query, mutation } from "@/services/graphql";
import { notification } from "ant-design-vue";
import { CheckOutlined } from "@ant-design/icons-vue";
import { h } from "vue";

export function verificationCode(identifier, $t, call) {
  mutation(`generateVerificationCode(identifier: "${identifier}")`).then(
    (res) => {
      notification.open({
        message: $t("Verification code has been sent to") + " " + res.email,
        icon: h(CheckOutlined, { style: "color: #23b899" }),
        placement: "bottomRight",
        description:
          $t("Expires in") + " " + res.timeout / 60 + " " + $t("minutes"),
      });
      if (call) {
        call();
      }
    },
  );
}

export async function login(identifier, password, verificationCode, isPass) {
  logout();
  let input = { identifier, password };
  if (!isPass) {
    input.verificationCode = verificationCode;
  }
  let loginFun = !isPass ? "loginByCode" : "login";
  return mutation(
    `${loginFun}(input: $input){jwt,user{id,username,email,role{id,name,type,description}}}`,
    { input },
    {
      input: !isPass
        ? "UsersPermissionsLoginByCodeInput!"
        : "UsersPermissionsLoginInput!",
    },
    null,
    true,
  );
}

export async function forget(email, newPassword, verificationCode) {
  const input = {
    email,
    newPassword,
    verificationCode,
  };
  return mutation(
    `changePasswordByCode(data: $input)`,
    { input }
  );
}

export async function register(username, email, password, verificationCode) {
  const input = { username, email, password };
  let isPass = process.env.VUE_APP_LOGIN_CODE == "pass";
  if (!isPass) {
    input.verificationCode = verificationCode;
  }
  let _fun = !isPass ? "registerByCode" : "register";
  return mutation(
    `${_fun}(input: $input){jwt,user{id,username,email,role{id,name,type,description}}}`,
    { input },
    {
      input: !isPass
        ? "UsersPermissionsRegisterByCodeInput!"
        : "UsersPermissionsRegisterInput!",
    },
    null,
    true,
  );
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET);
}

export function getStaticRoutesConfig() {
  let _append = process.env.VUE_APP_VERSION == "pro" ? ".pro" : "";
  const options = require(`@/router/config${_append}`).default;
  return options;
}

export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY);
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY);
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY);
  localStorage.removeItem(process.env.VUE_APP_USER_KEY);
  removeAuthorization();
}

export async function getUserInfo() {
  return query(
    `getUser{data{id,attributes{
			login_at,
			username,
			type,
			email,
			phone,
			role{data{id,attributes{
				name,
				type
			}}},
			userProjects{data{id,attributes{name}}},
			userOrganizations{data{id,attributes{name}}}
		}}}`,
  );
}
export function resetPermission(d) {
	let resources = [];
	Object.keys(d.permissions).forEach((_key)=>{
		if(_key.split("::")[0] == "api"){
			let mode = _key.split("::")[1];
			let map = {};
			if(mode){
				let actions = d.permissions[_key].controllers[mode];
				map.actions = [];
				Object.keys(actions).forEach((action_key)=>{
					map.actions.push({
						name: action_key,
						enabled: actions[action_key].enabled
					})
				})
				map.name = mode;
				resources.push(map);
			}
		}
	});
	d.permissions = resources;
	return d;
}
export function buildPermission(resources) {
	let pers = {};
	resources.forEach((resource)=>{
		if(resource.actions){
			let _key = `api::${resource.name}`;
			pers[_key] = { controllers:{} };
			pers[_key].controllers[resource.name] = {};
			resource.actions.forEach((action)=>{
				pers[_key].controllers[resource.name][action.name] = { enabled: action.enabled };
			})
		}
	});
	return pers;
}
export function getPermission(options) {
	if(options && options.id){
		return new Promise((resolve, reject) => {
			query(`getRoleResourcePermission(id:${options.id}){name,description,type,content,permissions}`).then((res) => {
				resolve(resetPermission(res));
			}).catch((e) => {
				reject(e);
			});
		});
	} else if(options && options.type){
		return new Promise((resolve, reject) => {
			query(`getRoleResourcePermission(type:"${options.type}"){name,description,type,content,permissions}`).then((res) => {
				resolve(resetPermission(res));
			}).catch((e) => {
				reject(e);
			});
		});
	} else {
		return new Promise((resolve, reject) => {
			query(`getRoleResourcePermission{name,description,type,content,permissions}`).then((res) => {
				resolve(resetPermission(res));
			}).catch((e) => {
				reject(e);
			});
		});
	}
}
export const DEFAULT_PREFERENCE =
  "workload.dashboard.DEPLOYMENT,workload.dashboard.STATEFULSET,workload.dashboard.JOB,workload.dashboard.POD,flb.dashboard.SANKEY,flb.dashboard.RANKING";

export async function getUserPreference() {
  return query(`getUser{data{id,attributes{widget}}}`);
}

export async function setUserPreference(widget) {
  const user = JSON.parse(localStorage.getItem(process.env.VUE_APP_USER_KEY));
  return mutation(
    `updateUsersPermissionsUser(id:${user.id},data:{ widget: "${widget}" }){data{id}}`,
  );
}

export async function getUserWidgets() {
  return query(`widgets{data{id,attributes{name,shared,user_id,content}}}`);
}

export async function editUserInfo(savedata) {
  const id = savedata.id;
  delete savedata.id;
  return mutation(
    `updateUsersPermissionsUser(id:${id}, data: $data){data{id}}`,
    { data: savedata },
    { data: "UsersPermissionsUserInput!" },
  );
}

export async function addUserWidget(content) {
  return mutation(
    `createWidget(data: $data){data{id}}`,
    {
			data: {
				content,
				name: content.id,
				shared: 0,
			},
    },
    { data: "WidgetInput!" },
  );
}

export async function editUserWidget(id, content) {
  delete content.uid;
  return mutation(
    `updateWidget(id:${id}, data: $data){data{id}}`,
    {
      data: { content, name: content.id }
    },
    { data: "WidgetInput!" },
  );
}

export async function deleteUserWidget(id) {
  return mutation(`deleteWidget(id:${id}){data{id}}`);
}

export const SAMPLE_WIDGET = {
  id: "TEST-CUSTOM",
  title: "This is a Sample",
  tag: { name: "Gauge" },
  service: {
    path: "hk.flomesh.cn:8090/kube-dashboard/?url=%2Fapi%2Fv1%2Fjob%2Fdefault%3FitemsPerPage%3D0%26page%3D1%26sortBy%3Dd%2CcreationTimestamp",
    method: "GET",
    payload: "{}",
  },
  col: 6,
  data: `res => {
	let _data = res.data;
	function getPercentage(current,status){
		let per = (status.running+status.succeeded+status.failed);
		return per ==0 ?0 :Math.round(current*100/per);
	}
	return {
		id:'WP-CUSTOM',
		vals:[
			getPercentage(_data.status.running,_data.status),
			getPercentage(_data.status.succeeded,_data.status),
			getPercentage(_data.status.failed,_data.status)
		]
	}
}`,
};

export default {
  login,
  logout,
  forget,
  register,
  getRoutesConfig,
  getUserInfo,
  getUserPreference,
  setUserPreference,
  getUserWidgets,
  editUserInfo,
  addUserWidget,
  editUserWidget,
  deleteUserWidget,
  DEFAULT_PREFERENCE,
  SAMPLE_WIDGET,
};
