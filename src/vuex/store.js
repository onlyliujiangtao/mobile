import Vue from 'vue'
import Vuex from 'vuex'

import page from './modules/page'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { // 模块
    page
  }
})
