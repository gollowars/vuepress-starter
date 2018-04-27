import headerMixin from './script/headerMixin'
export default ({
  Vue,
  options,
  router
}) => {
  Vue.mixin(headerMixin)
}
