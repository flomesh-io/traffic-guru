const getRoutePermission = (permissions, route) =>
  permissions.find((item) => item.id === route.meta.authority.permission);

const getRouteRole = (roles, route) => {
  const requiredRoles = route.meta.authority.role;
  return requiredRoles
    ? roles.filter(
        (item) =>
          requiredRoles.findIndex((required) => required === item.id) !== -1,
      )
    : [];
};

const hasInjected = (method) =>
  method.toString().indexOf("//--auth-inject") !== -1;

const auth = function (authConfig, permission, role, permissions, roles) {
  const { check, type } = authConfig;
  if (check && typeof check === "function") {
    return check.apply(this, [permission, role, permissions, roles]);
  }
  if (type === "permission") {
    return checkFromPermission(check, permission);
  } else if (type === "role") {
    return checkFromRoles(check, role);
  } else {
    return (
      checkFromPermission(check, permission) || checkFromRoles(check, role)
    );
  }
};

const checkFromPermission = function (check, permission) {
  return (
    permission &&
    permission.operation &&
    permission.operation.indexOf(check) !== -1
  );
};

const checkFromRoles = function (check, roles) {
  if (!roles) {
    return false;
  }
  for (let role of roles) {
    const { operation } = role;
    if (operation && operation.indexOf(check) !== -1) {
      return true;
    }
  }
  return false;
};

const checkInject = function (el, binding, vnode) {
  const type = binding.arg;
  const check = binding.value;
  const instance = vnode.context;
  const $auth = instance.$auth;
  if (!$auth || !$auth(check, type)) {
    addDisabled(el);
  } else {
    removeDisabled(el);
  }
};

const addDisabled = function (el) {
  if (el.tagName === "BUTTON") {
    el.disabled = true;
  } else {
    el.classList.add("disabled");
  }
  el.setAttribute("title", "No permission");
};

const removeDisabled = function (el) {
  el.disabled = false;
  el.classList.remove("disabled");
  el.removeAttribute("title");
};

const AuthorityPlugin = {
  install(Vue) {
    Vue.directive("auth", {
      bind(el, binding, vnode) {
        setTimeout(() => checkInject(el, binding, vnode), 10);
      },
      componentUpdated(el, binding, vnode) {
        setTimeout(() => checkInject(el, binding, vnode), 10);
      },
      unbind(el) {
        removeDisabled(el);
      },
    });
    Vue.mixin({
      beforeCreate() {
        if (this.$options.authorize) {
          const authorize = this.$options.authorize;
          Object.keys(authorize).forEach((key) => {
            if (this.$options.methods[key]) {
              const method = this.$options.methods[key];
              if (!hasInjected(method)) {
                let authConfig = authorize[key];
                authConfig =
                  typeof authConfig === "string"
                    ? { check: authConfig }
                    : authConfig;
                const { check, type, onFailure } = authConfig;
                this.$options.methods[key] = function () {
                  //--auth-inject
                  if (this.$auth(check, type)) {
                    return method.apply(this, arguments);
                  } else {
                    if (onFailure && typeof onFailure === "function") {
                      this[`$${check}Failure`] = onFailure;
                      return this[`$${check}Failure`](check);
                    } else {
                      this.$message.error(
                        `Sorry, you have no operation permission: ${check}`,
                      );
                    }
                    return 0;
                  }
                };
              }
            }
          });
        }
      },

      methods: {
        $auth(check, type) {
          const permissions = this.$store.getters["account/permissions"];
          const accountRole = this.$store.getters["account/roles"];
          const permission = getRoutePermission(permissions, this.$route);
          const role = getRouteRole(accountRole.permissions, this.$route);
          return auth.apply(this, [
            { check, type },
            permission,
            role,
            permissions,
            roles,
          ]);
        },
      },
    });
  },
};

export default AuthorityPlugin;
