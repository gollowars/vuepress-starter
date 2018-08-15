const state = {
  target: null
}

const getters = {
}

const mutations = {
  setTarget(state, identify) {
    state.target = identify
  },
}

const actions = {
  smoothScrollSet: ({ commit }, identify ) => commit('setTarget', identify),
}

export default {
  state,
  mutations,
  actions,
  getters
}
