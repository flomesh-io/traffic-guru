import BlankView from "@/layouts/BlankView";
import { SettingOutlined } from "@ant-design/icons-vue";

const usercenter = {
  path: "user-center",
  name: "User Center",
  component: BlankView,
  meta: {
    icon: SettingOutlined,
    invisible: true,
  },
  children: [
    {
      path: "info",
      name: "User Center",
      meta: {
        keepAlive: true,
      },
      component: () => import("@/pages/usercenter/UserInfo"),
    },
  ],
};

export default usercenter;
