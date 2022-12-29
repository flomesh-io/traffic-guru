import rules from "@/rules/common";

export default {
  namespaced: true,
  state: {
    rules,
  },
  getters: {
    rules(state) {
      return state.rules;
    },
  },
};
