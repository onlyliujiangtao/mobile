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
  methods: {
    dateFormat (fmt, str) {
      var o = {
        'M+': str.substr(4, 2), // 月份
        'd+': str.substr(6, 2), // 日
        'h+': str.substr(8, 2),  // 小时
        'm+': str.substr(10, 2), // 分
        's+': str.substr(12, 2) // 秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (str.substr(0, 4) + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    },
    formatDate (fmt, date) { // author: meizz
      // formatDate('yyyyMMddhhmmss',时间戳)
      if (date) {
        date = date.replace(/-/g, '/')
        date = new Date(date)
      } else {
        date = new Date()
      }
      var o = {
        'M+': date.getMonth() + 1,                 // 月份
        'd+': date.getDate(),                    // 日
        'h+': date.getHours(),                   // 小时
        'm+': date.getMinutes(),                 // 分
        's+': date.getSeconds(),                 // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds()             // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    }
  },
  render: h => h(App)
}).$mount('#app-box')
