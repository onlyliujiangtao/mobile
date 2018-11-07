import axios from 'axios'
import store from '../vuex/store'

// axios 配置
axios.defaults.timeout = 30 * 1000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
axios.defaults.baseURL = '/' // 你的接口地址

const doPost = (url, params) => {
  return new Promise((resolve, reject) => {
    store.commit('SET_PAGE_LOADING', { isLoading: true, text: '加载中' })
    let formData = new FormData()
    Object.keys(params).forEach(item => {
      formData.append(item, params[item])
    })
    axios.post(url, formData)
      .then(response => {
        resolve(response.data)
        console.info(response.data)
        store.commit('SET_PAGE_LOADING', { isLoading: false })
      }, (err) => {
        if (err) {}
        let errMsg = {
          status: false,
          msg: '请求超时，服务器未响应'
        }
        store.commit('SET_PAGE_LOADING', { isLoading: false })
        resolve(errMsg)
      })
      .catch((err) => {
        if (err) {}
        let errMsg = {
          status: false,
          msg: '请求超时，服务器未响应'
        }
        store.commit('SET_PAGE_LOADING', { isLoading: false })
        resolve(errMsg)
      })
  })
}

// 登录
export const login = params => doPost('/zjjh/uaas/login/mobil/login', params)
export const todayMerchAmountAndSum = params => doPost('/zjjh/epay/merchant/todayMerchAmountAndSum', params)
export const getMerchantGrid = params => doPost('/zjjh/epay/merchant/getMerchantGrid', params)
export const todayPipeSumByMerchantId = params => doPost('/zjjh/epay/tranline/todayPipeSumByMerchantId', params)
