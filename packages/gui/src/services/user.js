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

export async function login(identifier, password, verificationCode) {
  logout();
  let input = { identifier, password };
  let isPass = process.env.VUE_APP_LOGIN_CODE == "pass";
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
    `changePasswordByCode(input: $input)`,
    { input }
  );
}

export async function register(username, email, password) {
  const input = { username, email, password };
  return mutation(
    `register(input: $input){jwt,user{id,username,email,role{id,name,type,description}}}`,
    { input },
    { input: "UsersPermissionsRegisterInput!" },
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
  removeAuthorization();
}

export async function getUserInfo() {
  return query(
    `getUser{id,login_at,username,type,email,phone,role{id,name,type,permissions{id,type,controller,action,enabled}},userProjects{id,name},userOrganizations{id,name}}`,
  );
}

export const DEFAULT_PREFERENCE =
  "workload.dashboard.DEPLOYMENT,workload.dashboard.STATEFULSET,workload.dashboard.JOB,workload.dashboard.POD,flb.dashboard.SANKEY,flb.dashboard.RANKING";

export async function getUserPreference() {
  return query(`getUser{id,widget}`);
}

export async function setUserPreference(widget) {
  const user = JSON.parse(localStorage.getItem(process.env.VUE_APP_USER_KEY));
  return mutation(
    `updateUser(input:{where:{id:${user.id}},data:{ widget: "${widget}" }}){user{id}}`,
  );
}

export async function getUserWidgets() {
  return query(`widgets{id,name,shared,user_id,content}`);
}

export async function editUserInfo(savedata) {
  const id = savedata.id;
  delete savedata.id;
  return mutation(
    `updateUser(input: $input){user{id}}`,
    { input: { where: { id }, data: savedata } },
    { input: "updateUserInput" },
  );
}

export async function addUserWidget(content) {
  return mutation(
    `createWidget(input: $input){widget{id}}`,
    {
      input: {
        data: {
          content,
          name: content.id,
          shared: 0,
        },
      },
    },
    { input: "createWidgetInput" },
  );
}

export async function editUserWidget(id, content) {
  delete content.uid;
  return mutation(
    `updateWidget(input: $input){widget{id}}`,
    {
      input: { where: { id }, data: { content, name: content.id } },
    },
    { input: "updateWidgetInput" },
  );
}

export async function deleteUserWidget(id) {
  return mutation(`deleteWidget(input:{where:{id:${id}}}){widget{id}}`);
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
