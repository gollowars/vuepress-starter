import headerMixin from './script/headerMixin'
import createStore from './script/createStore'

export default ({
  Vue,
  options,
  router,
  siteData
}) => {
  createStore({ Vue, options })
  Vue.mixin(headerMixin)
}
