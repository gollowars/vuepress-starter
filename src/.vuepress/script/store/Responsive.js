const state = {
  winW: 1000,
  winH: 0,
}

const getters = {
  responsiveTarget: (state) =>{
    if(state.winW > 900){
      return 'isPC'
    }else{
      return 'isSP'
    }
  },
  deviceOrientation: (state) => {
    if (state.winW > state.winH) {
      return 'landscape'
    } else {
      return 'portrait'
    }
  },
}

const mutations = {
  setWidth(state, winW) {
    state.winW = winW
  },
  setHeight(state, winH) {
    state.winH = winH
  },
}

const actions = {
  setWinWidth: ({ commit }, width ) => commit('setWidth', width),
  setWinHeight: ({ commit }, height ) => commit('setHeight', height),
}

export default {
  state,
  mutations,
  actions,
  getters
}
