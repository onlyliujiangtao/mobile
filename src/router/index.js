import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex/store'
// import HelloWorld from '@/components/HelloWorld'
// const login = r => require.ensure([], () => r(require('@/view/login')), 'login')
const login = () => import('@/view/login').then(m => m.default)
const main = () => import('@/view/main').then(m => m.default)
const LeaderboardMmerchants = () => import('@/view/Leaderboard/merchants').then(m => m.default)
const LeaderboardStore = () => import('@/view/Leaderboard/store').then(m => m.default)
const InquireWater = () => import('@/view/Inquire/water').then(m => m.default)

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      component: login
    },
    {
      path: '/main',
      name: '首页',
      component: main,
      meta: { headerLeftText: '注销' }
    },
    {
      path: '/merchants',
      name: '服务区排行榜',
      component: LeaderboardMmerchants
    },
    {
      path: '/store',
      name: '门店排行榜',
      component: LeaderboardStore
    },
    {
      path: '/water',
      name: '流水查询',
      component: InquireWater
    }
  ]
})

router.beforeEach(function (to, from, next) {
  store.commit('SET_PAGE_LOADING', { isLoading: true, text: '加载中' })
  // const useragent = navigator.userAgent
  // if (useragent.match(/MicroMessenger/i) !== 'MicroMessenger') {
  //   // 这里警告框会阻塞当前页面继续加载
  //   alert('已禁止本次访问：您必须使用微信内置浏览器访问本页面！')
  //   // 以下代码是用javascript强行关闭当前页面
  //   const opened = window.open('about:blank', '_self')
  //   opened.opener = null
  //   opened.close()
  // } else {
  // }
  next()
})

router.afterEach(function (to) {
  store.commit('SET_PAGE_LOADING', {isLoading: false})
})
export default router
