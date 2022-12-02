import store from "@/store";
import _ from "lodash";

function hasRole(authority, roles) {
  return hasAnyRole(authority, roles);
}

function hasAnyRole(required, roles) {
  const user = store.getters["account/user"];
  if (
    !required ||
    required.permission === "*" ||
    (user.role && user.role.type == "authenticated")
  ) {
    return true;
  } else if (
    required.permission === "admin" &&
    user.role &&
    user.role.type == "authenticated"
  ) {
    return true;
  } else {
    let hasPermission = false;
    roles.forEach((role) => {
      role.actions.forEach((action) => {
        let permissionRoles = Array.isArray(required.permission)
          ? required.permission
          : [required.permission];
        const isIncludeA = permissionRoles.includes(
          `${role.name}:${action.name}`,
        );
        const isIncludeB =
          role.type == "project" && role.project.id
            ? permissionRoles.includes(
                `${role.name}:${action.name}:project:${role.project.id}`,
              )
            : false;
        const isIncludeC =
          role.type == "organization" && role.organization.id
            ? permissionRoles.includes(
                `${role.name}:${action.name}:organization:${role.organization.id}`,
              )
            : false;
        if (action.enabled && (isIncludeA || isIncludeB || isIncludeC)) {
          hasPermission = true;
        }
      });
    });
    return hasPermission;
  }
}

function hasAuthority(route, permissions, roles) {
  const authorities = [
    ...(route.meta.pAuthorities || []),
    route.meta.authority || "",
  ];
  for (let authority of authorities) {
    if (!hasRole(authority, roles)) {
      return false;
    }
  }
  return true;
}

function filterMenu(menuData, permissions, roles) {
  if (menuData) {
    return _.cloneDeep(menuData).filter((menu) => {
      if (menu.meta && !menu.meta.invisible) {
        if (!hasAuthority(menu, permissions, roles)) {
          return false;
        }
      }
      if (menu.children && menu.children.length > 0) {
        menu.children = filterMenu(menu.children, permissions, roles);
      }
      return true;
    });
  } else {
    return [];
  }
}

export { filterMenu, hasAuthority };
