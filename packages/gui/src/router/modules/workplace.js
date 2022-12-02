import { LaptopOutlined } from "@ant-design/icons-vue";

const workplace = {
  path: "workplace",
  name: "Workplace",
  meta: {
    icon: LaptopOutlined,
  },
  component: () => import("@/pages/workplace/WorkPlace"),
};

export default workplace;
