import axios from 'axios'
import { getToken, getBasicAuthorization } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import store from '@/store'
import { Notification, MessageBox, Message } from 'element-ui'

axios.defaults.headers['Content-Type'] = 'multipart/form-data'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000
})
service.interceptors.request.use(config => {
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = getBasicAuthorization()
  }
  if (config.url == '/swagger/v1/swagger.json') { config.baseURL = process.env.VUE_APP_BASE_API_CORE; }
  if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && typeof (value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            url += subPart + encodeURIComponent(value[key]) + "&";
          }
        } else {
          url += part + encodeURIComponent(value) + "&";
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(res => {
  const code = res.data.code || 200;
  const msg = errorCode[code] || res.data.msg || errorCode['default']
  if (code === 401) {
    MessageBox.confirm('401 Lỗi trái phép!', 'Thông báo', {
      confirmButtonText: 'Đăng nhập lại',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning'
    }
    ).then(() => {
      store.dispatch('LogOut').then(() => {
        location.href = '/index';
      })
    })
  } else if (code === 500) {
    Message({
      message: msg,
      type: 'error'
    })
    return Promise.reject(new Error(msg))
  } else if (code !== 200) {
    Notification.error({
      title: msg
    })
    return Promise.reject('error')
  } else {
    return res.data
  }
},
  error => {
    let { message } = error;
    if (message == "Network Error") {
      message = "Kết nối internet không được ổn định";
    }
    else if (message.includes("timeout")) {
      message = "Yêu cầu vượt quá thời gian";
    }
    else if (message.includes("Request failed with status code")) {
      message = message.substr(message.length - 3) + " Internal server error";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service