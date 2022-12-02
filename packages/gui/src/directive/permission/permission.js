import store from "@/store";
/**
	Like v-permission="
	[
		'service:find',
		'egress:delete',
		'api:update:project:1',
		'project:update:organization:1'
	]"`);
*/
function checkPermission(el, binding) {
  const { value } = binding;
  const user = store.getters["account/user"];
  const roles = store.getters["account/roles"];
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value;
      let hasPermission = false;
      let hasAdmin = false;
      if (user.role.type == "authenticated") {
        hasAdmin = true;
      }
      if (
        permissionRoles.includes("admin") &&
        user.role.type == "authenticated"
      ) {
        hasPermission = true;
      } else {
        console.log("checkPermission4");
        roles.forEach((role) => {
          role.actions.forEach((action) => {
            const isIncludeA = permissionRoles.includes(
              `${role.name}:${action.name}`,
            );
            const isIncludeB =
              role.type == "project" && role.project && role.project.id
                ? permissionRoles.includes(
                    `${role.name}:${action.name}:project:${role.project.id}`,
                  )
                : false;
            const isIncludeC =
              role.type == "organization" &&
              role.organization &&
              role.organization.id
                ? permissionRoles.includes(
                    `${role.name}:${action.name}:organization:${role.organization.id}`,
                  )
                : false;
            if (action.enabled && (isIncludeA || isIncludeB || isIncludeC)) {
              hasPermission = true;
            }
          });
        });
      }
      if (!hasAdmin && permissionRoles.includes("!admin")) {
        hasPermission = true;
      }
      if (hasAdmin && permissionRoles.includes("!admin")) {
        hasPermission = false;
      }
      if (!hasAdmin && permissionRoles.includes("admin")) {
        hasPermission = false;
      }
      if (hasAdmin && !permissionRoles.includes("!admin")) {
        hasPermission = true;
      }
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  }
}

export default {
  mounted(el, binding) {
    checkPermission(el, binding);
  },
  updated(el, binding) {
    checkPermission(el, binding);
  },
};
