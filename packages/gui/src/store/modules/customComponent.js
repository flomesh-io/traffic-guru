export default {
  namespaced: true,
  state: {
    components: null,
  },
  getters: {
    components: (state) => {
      if (!state.components) {
        try {
          const components = localStorage.getItem("COMPONENTS");
          state.components = components ? JSON.parse(components) : {};
        } catch (e) {
          console.error(e);
        }
      }
      return state.components;
    },
  },
  mutations: {
    setComponents(state, components) {
      state.components = components;
      localStorage.setItem("COMPONENTS", JSON.stringify(components));
    },
  },
};
