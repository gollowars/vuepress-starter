const state = {
  value: 0,
}

const getters = {
  scrollAmount: (state) => {
    return state.value
  },
}

const mutations = {
  setValue(state, value) {
    state.value = value
  }
}

const actions = {
  setScrollValue: ({ commit }, value ) => commit('setValue', value),
}

export default {
  state,
  mutations,
  actions,
  getters
}
