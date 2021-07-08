import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const TokenUserInfoKey = 'UserInfo'
const TokenMenu = 'Menu'
const AuthenAPI = 'Basic a2QwMUBzbWFydF9idWRkeS52bjpQNzhKRDQ5MDNFMzJDNDkwQjM3NDY1MTExSzE1NDgxSg==';

export function getUserInfo() {
  var info = Cookies.get(TokenUserInfoKey);
  if(info != undefined){
    const userInfo = JSON.parse(Cookies.get(TokenUserInfoKey));
    return userInfo;
  }
  else return null;
}

export function setUserInfo(info) {
  return Cookies.set(TokenUserInfoKey, info)
}

export function generator(length) {
  return (Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1)).toUpperCase();
}

export function getBasicAuthorization() {
  return "Bearer " +getToken();
}
export function setListMenuInfo(info) {
  return localStorage.setItem(TokenMenu, JSON.stringify(info));
}
export function removeListMenuInfo(info) {
  return localStorage.removeItem(TokenMenu);
}
export function getListMenuInfo() {
  var info = localStorage.getItem(TokenMenu);
  if(info != undefined){
    const menu = JSON.parse(info);
    return menu;
  }
  else return null;
}
export function getToken() {
  if(getUserInfo() == null) return '';
  else return getUserInfo().token;
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function removeUserInfo() {
  return Cookies.remove(TokenUserInfoKey)
}
