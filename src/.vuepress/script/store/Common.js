const state = {
  didInitLoad: false,
  prev: null,
  current: null,
  gnavIsOpen: false,
  whileNavTransition: false,
  pagePageExitQue: null,
  canvasMode: 'hide', //'hide' || 'slide' || 'nav',
  scroll: 0,
  windowHeight: `100vh`,
  windowWidth: `100vw`,
  platform: null
}

const getters = {
  isSP (state){
    return state.windowWidth < 1000
  }
}

const mutations = {
  setCurrent(state, current) {
    state.prev = state.current
    state.current = current
  },
  setInitLoadingState(state, flag) {
    state.didInitLoad = flag
  },
  gnavOpen(state) {
    state.gnavIsOpen = true
  },
  gnavClose(state) {
    state.gnavIsOpen = false
  },
  navTransiteStart(state) {
    state.whileNavTransition = true
  },
  navTransiteEnd(state) {
    state.whileNavTransition = false
  },
  appendPageExitQue(state, que) {
    state.pagePageExitQue = que
  },
  clearBeforeQue(state) {
    state.pagePageExitQue = null
  },
  setCanvasMode(state, mode) {
    state.canvasMode = mode
  },
  setScrollAmount(state, value) {
    state.scroll = value
  },
  setWindowWidth(state, width) {
    state.windowWidth = width
  },
  setWindowHeigth(state, height) {
    state.windowHeight = height
  },
  setPlatform(state, platform) {
    state.platform = platform
  }
}

const actions = {
  setCurrent: ({ commit }, current) => commit('setCurrent', current),
  didInitLoadingState: ({ commit }, flag) => commit('setInitLoadingState', flag),
  gnavOpen: ({ commit }) => commit('gnavOpen'),
  gnavClose: ({ commit }) => commit('gnavClose'),
  navTransiteStart: ({ commit }) => commit('navTransiteStart'),
  navTransiteEnd: ({ commit }) => commit('navTransiteEnd'),
  appendPageExitQue: ({ commit }, que) => commit('appendPageExitQue', que),
  clearBeforeQue: ({ commit }) => commit('clearBeforeQue'),
  setCanvasMode: ({ commit }, mode ) => commit('setCanvasMode', mode),
  setScrollAmount: ({ commit }, value ) => commit('setScrollAmount', value),
  setWindowWidth: ({ commit }, width ) => commit('setWindowWidth', width),
  setWindowHeigth: ({ commit }, height ) => commit('setWindowHeigth', height),
  setPlatform: ({ commit }, platform ) => commit('setPlatform', platform),
}

export default {
  state,
  mutations,
  actions,
  getters
}
