import storage from './storage'
import request from './request'
import prompt from '@system.prompt'
import router from '@system.router'
const userKey = 'user'

export default class User {
  // 判断用户是否登录
  static async isLogined() {
    const storageUser = await storage.getJSON(userKey)
    return !!storageUser && !!storageUser.phone
  }
  constructor() {
  }
  /**
   * 获取本地storage保存的用户信息
   */
  async getLocal() {
    const storageUser = await storage.get(userKey)
    if (!storageUser || storageUser === null) {
      // throw new Error('用户未登录')
      return router.push({
        uri: '/Login',
        params: {}
      })
    }
    return JSON.parse(storageUser)
  }
  /**
   * 注册并登录保存用户到获取本地storage保存的用户信息
   */
  async login(phone, code) {
    const res = await request.post('login', { phone, captcha: code })
    const userInfo = res.data?(res.data.user || {}):{}

    if (res.err && !res.code) { 
      prompt.showToast({ message: res.msg})
      return
    }
    if (userInfo && typeof storage === 'object') { 
      await storage.set(userKey, JSON.stringify(userInfo))
    }
    return res
  }
  /**
   * 退出登录
   */
  logout() {
    storage.delete('user')
    storage.delete('create')
    storage.delete('selectAddr')
    storage.delete('loginInfo')
    router.replace({
      uri: '/Login'
    })
  }
}

export {
  User,
}
