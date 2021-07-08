import { login, logout, getInfo } from '@/api/login'
import { removeUserInfo, setUserInfo, getUserInfo, setListMenuInfo } from '@/utils/auth'
import { getListMenuInfo, removeListMenuInfo, getToken } from '../../utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid

      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          if(!res.isError && res.statusCode == 200){
            res.result.avatar = res.result.avatar == "" ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + res.result.avatar;
            const roles = [];
            roles.push(res.result.role);
            var info = {
              id: res.result.id,
              userName: res.result.userName,
              avatar: res.result.avatar,
              email: res.result.email,
              roles: roles,
              token: res.result.token,
              permissions: res.result.permissions
            }
            setUserInfo(info)
            setListMenuInfo(res.result.menuCmses)
            commit('SET_TOKEN',res.result.token)
            //commit('SET_AVATAR',res.result.avatar)
            resolve()
          }
          else{
            reject(res)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // GetInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo(state.token).then(res => {
    //       const user = res.user
    //       const avatar = user.avatar == "" ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
    //       if (res.roles && res.roles.length > 0) { 
    //         commit('SET_ROLES', res.roles)
    //         commit('SET_PERMISSIONS', res.permissions)
    //       } else {
    //         commit('SET_ROLES', ['ROLE_DEFAULT'])
    //       }
    //       commit('SET_NAME', user.userName)
    //       commit('SET_AVATAR', avatar)
    //       resolve(res)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    
    GetInfo({ commit }) {
      return new Promise((resolve) => {
        const user = getUserInfo();
        if (user.roles && user.roles.length > 0) { 
          commit('SET_ROLES', user.roles)
          commit('SET_PERMISSIONS', user.permissions)
        } else {
          commit('SET_ROLES', ['ROLE_DEFAULT'])
        }
        commit('SET_NAME', user.userName)
        commit('SET_AVATAR', user.avatar)
        resolve(user)
      })
    },

    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
           commit('SET_TOKEN', '')
           commit('SET_ROLES','')
           commit('SET_PERMISSIONS', [])
          removeUserInfo()
          resolve()
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })
    },

    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeUserInfo()
        removeListMenuInfo()
        resolve()
      })
    }
  }
}

export default user
