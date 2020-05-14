/* eslint-disable no-debugger */
/*eslint new-cap: ["off"]*/
import axios from 'axios'
import qs from 'qs'
import { Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import UsbKey from '@/utils/usbkey'
import encodeUrl from '@/utils/encodeUrl'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_HOST, // api的base_url
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    timeout: 50000 // request timeout
})
const errCode = function(key, message, title) {
    let elKey = `glb-notify-error-${encodeURI([key, message, title].join('-')).replace(/\W/g, '')}`
    let isShow = document.querySelector(`.${elKey}`)
    if (isShow) {
        return
    }
    if (message.includes('用户正在使用中')) {
        message = '系统繁忙，请稍后再试！'
    }
    let config = {
        message: message,
        customClass: elKey,
        duration: 5 * 1000
    }
    if (title) {
        config.title = title
    }
    Notification.error(config)
}
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
            config.headers['userToken'] = getToken()
        }
        return config
    },
    error => {
        console.log('request-error: ', error)
        return Promise.reject(error)
    }
)

// respone interceptor
service.interceptors.response.use(
    res => {
        if (res.headers.timestamp) {
            store.commit('SET_TIME', new Date().valueOf() - res.headers.timestamp)
        }
        if ('data' in res) {
            let data = res.data || {}
            if (data && typeof data == 'string') {
                data = JSON.parse(res.data)
            }
            if ('success' in data) {
                if (!data.success) {
                    errCode(data.code, data.message, '提示')
                    // -2表示登录失效，重新登录
                    if (data.code == -2) {
                        store.dispatch('FedLogOut')
                    }
                    return Promise.reject(data)
                }
            }
            return data
        }
        return res
    },
    error => {
        console.log('response-err: ', error) // for debug
        error.response && errCode(error.response.status, error.message, error.response.statusText)
        return Promise.reject(error)
    }
)

service.$get = function(url, params = {}) {
    let form = []
    // query-list的mixins里面处理表单提交私有变量
    Object.keys(params).forEach(key => {
        form.push([key.replace(/^_/, ''), encodeUrl(params[key])].join('='))
    })
    form = form.join('&')
    let query = (url.includes('?') ? '&' : '?') + form
    return service.get(url + (form ? query : ''))
}

service.$post = function(url, params) {
    return service.post(url, qs.stringify(params))
}

export default service
