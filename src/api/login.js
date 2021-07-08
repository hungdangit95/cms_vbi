import request from '@/utils/request'

export function login(username, password, code, uuid) {
  const data = {
    userName: username,
    password: password,
    code,
    uuid
  }
  return request({
    url: '/api/Identity/login-cms',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

export function logout(token) {
  const data = {
    token: token
  }
  return request({
    url: '/api/User/signout-cms',
    method: 'post',
    data: data
  })
}

export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}