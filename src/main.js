// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from '@/router/index'
import App from './App'
import store from './vuex/store'
import { AlertPlugin, ToastPlugin } from 'vux'

Vue.use(VueRouter)

FastClick.attach(document.body)

// 提示框插件
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)

// 提示插件
Vue.prototype.$alert = function (content, title) {
  this.$vux.alert.show({
    title: title || '提示',
    content: content
  })
}

// 提示插件
Vue.prototype.$toast = function (msg, type = 'success') {
  this.$vux.toast.show({
    text: msg,
    type: type
  })
}

// 返回
Vue.prototype.$back = function () {
  this.$router ? this.$router.back() : window.history.back()
}

// 显示载入中
Vue.prototype.$showLoading = function (text = '加载中') {
  store.commit('SET_PAGE_LOADING', { isLoading: true, text: text })
}

// 隐藏载入中
Vue.prototype.$hideLoading = function () {
  store.commit('SET_PAGE_LOADING', { isLoading: false })
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  data () {
    return {
      eventHub: new Vue(),
      currentScroll: [] // 当前滚动条
    }
  },
  router,
  store,
  mounted () {
    let self = this
    window.addEventListener('resize', function () {
      setTimeout(() => {
        if (self.currentScroll.length > 0) {
          self.currentScroll.forEach((scroll) => {
            scroll.refresh()
          })
        }
      }, 300)
    }, false)
  },
  render: h => h(App)
}).$mount('#app-box')
