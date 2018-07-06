// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import WinningUI from 'winning-ui'
import 'winning-ui/lib/theme-default/index.css'
import UIEditorItem from './views/EditorItem'
import editorDynComponent from './views/EditorDynView'

Vue.config.productionTip = false
Vue.component('ui-editor-item', UIEditorItem)
Vue.use(WinningUI)
Vue.component('editor-dyn-container', editorDynComponent)

/* eslint-disable no-new */
new Vue({ 
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
