import { SlidersOutlined } from "@ant-design/icons-vue";

const routersetting = {
  path: "router-setting",
  name: "RouterSetting",
  meta: {
    icon: SlidersOutlined,
    authority: "admin",
  },
  component: () => import("@/pages/system/RouterSetting"),
};

export default routersetting;
