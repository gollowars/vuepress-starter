import Vuex from 'vuex'
import Responsive from './store/Responsive'
import Scroll from './store/Scroll'

export default function ({
  Vue,
  options
}) {
  Vue.use(Vuex)

  const store = new Vuex.Store({
    modules: {
      Responsive: {
        namespaced: true,
        ...Responsive
      },
      Scroll: {
        namespaced: true,
        ...Scroll
      },
    }
   })
  Object.assign(options, {
    store
  })
}
