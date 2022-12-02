const cssResolve = {
  ".ant-checkbox-checked .ant-checkbox-inner::after": {
    resolve(cssText, cssObj) {
      cssObj.rules.push("border-top:0", "border-left:0");
      return cssObj.toText();
    },
  },
  ".ant-tree-checkbox-checked .ant-tree-checkbox-inner::after": {
    resolve(cssText, cssObj) {
      cssObj.rules.push("border-top:0", "border-left:0");
      return cssObj.toText();
    },
  },
  ".ant-checkbox-checked .ant-checkbox-inner:after": {
    resolve(cssText, cssObj) {
      cssObj.rules.push("border-top:0", "border-left:0");
      return cssObj.toText();
    },
  },
  ".ant-tree-checkbox-checked .ant-tree-checkbox-inner:after": {
    resolve(cssText, cssObj) {
      cssObj.rules.push("border-top:0", "border-left:0");
      return cssObj.toText();
    },
  },
  ".ant-menu-dark .ant-menu-inline.ant-menu-sub": {
    resolve(cssText, cssObj) {
      cssObj.rules = cssObj.rules.filter(
        (rule) => rule.indexOf("box-shadow") == -1,
      );
      return cssObj.toText();
    },
  },
  ".ant-menu-horizontal>.ant-menu-item:hover,.ant-menu-horizontal>.ant-menu-submenu:hover,.ant-menu-horizontal>.ant-menu-item-active,.ant-menu-horizontal>.ant-menu-submenu-active,.ant-menu-horizontal>.ant-menu-item-open,.ant-menu-horizontal>.ant-menu-submenu-open,.ant-menu-horizontal>.ant-menu-item-selected,.ant-menu-horizontal>.ant-menu-submenu-selected":
    {
      resolve(cssText, cssObj) {
        cssObj.selector = cssObj.selector.replace(
          /.ant-menu-horizontal/g,
          ".ant-menu-horizontal:not(.ant-menu-dark)",
        );
        return cssObj.toText();
      },
    },
  ".ant-menu-horizontal>.ant-menu-item-active,.ant-menu-horizontal>.ant-menu-item-open,.ant-menu-horizontal>.ant-menu-item-selected,.ant-menu-horizontal>.ant-menu-item:hover,.ant-menu-horizontal>.ant-menu-submenu-active,.ant-menu-horizontal>.ant-menu-submenu-open,.ant-menu-horizontal>.ant-menu-submenu-selected,.ant-menu-horizontal>.ant-menu-submenu:hover":
    {
      resolve(cssText, cssObj) {
        cssObj.selector = cssObj.selector.replace(
          /.ant-menu-horizontal/g,
          ".ant-menu-horizontal:not(.ant-menu-dark)",
        );
        return cssObj.toText();
      },
    },
  ".ant-layout-sider": {
    resolve(cssText, cssObj) {
      cssObj.selector = ".ant-layout-sider-dark";
      return cssObj.toText();
    },
  },
  "/keyframes/": false,
};

module.exports = cssResolve;
