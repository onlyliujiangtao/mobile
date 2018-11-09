import axios from 'axios'
import Vue from 'vue'
import store from '../vuex/store'

let vm = new Vue()
// axios 配置
axios.defaults.timeout = 30 * 1000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencodedcharset=utf-8'
axios.defaults.baseURL = '/'

const doPost = (url, params) => {
  store.commit('SET_PAGE_LOADING', { isLoading: true, text: '加载中' })
  return new Promise((resolve, reject) => {
    let formData = new FormData()
    if (params) {
      Object.keys(params).forEach(item => {
        formData.append(item, params[item])
      })
    }
    axios.post(url, formData)
      .then(response => {
        resolve(response.data)
        store.commit('SET_PAGE_LOADING', { isLoading: false })
        console.info(response.data)
      })
      .catch((err, a) => {
        store.commit('SET_PAGE_LOADING', { isLoading: false })
        if (err) {
          vm.$toast('登录超时', 'warn')
          window.location.href = '#/login'
        }
      })
  })
}

// 登录
// export const login = params => doPost('/zjjh/uaas/login/mobil/login', params)
export const login = params => doPost('/posp_etcsx/uaas/login/mobileLogin', params)
// export const todayMerchAmountAndSum = params => doPost('/zjjh/epay/merchant/todayMerchAmountAndSum', params)
export const todayMerchAmountAndSum = params => doPost('/posp_etcsx/epay/tranline/getTranlineFlowByMobile', params)

// export const getMerchantGrid = params => doPost('/zjjh/epay/merchant/getMerchantGrid', params)
export const getMerchantGrid = params => doPost('/posp_etcsx/epay/merchant/getMerchantGrid', params)
// export const todayPipeSumByMerchantId = params => doPost('/zjjh/epay/tranline/todayPipeSumByMerchantId', params)
export const todayPipeSumByMerchantId = params => doPost('/posp_etcsx/epay/tranline/getTranlineTermFlowByMobile', params)
// export const getTranlineGrid = params => doPost('/zjjh/epay/tranline/getTranlineGrid', params)
export const getTranlineGrid = params => doPost('/posp_etcsx/epay/tranline/getTranlineGrid', params)
// export const getTranlineGrid = params => doPost('/zjjh/epay/tranline/getTranlineGrid', params)
export const getTerminalGrid = params => doPost('posp_etcsx/epay/terminal/getTerminalGrid', params)
