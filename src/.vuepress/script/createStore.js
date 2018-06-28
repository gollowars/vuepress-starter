import Vuex from 'vuex'
import { state, getters, mutations, actions } from './store/store'

export default function ({
  Vue,
  options
}) {
  Vue.use(Vuex)

  const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
  })
  Object.assign(options, {
    store
  })
}
