// pages/index/index.js
Page({
  data: {
    userInfo: null,
    isAuthorized: false,
    onlineCount: 0
  },

  onLoad() {
    this.getOnlineCount();
  },

  // 获取在线人数（模拟）
  getOnlineCount() {
    setTimeout(() => {
      this.setData({ onlineCount: Math.floor(Math.random() * 1000) })
    }, 500)
  },

  // 获取用户信息
  getUserInfo() {
    if (typeof wx.getUserProfile !== 'function') {
      wx.showToast({ title: '请升级微信版本', icon: 'none' })
      return
    }

    wx.getUserProfile({
      desc: '用于游戏内展示',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          isAuthorized: true
        })
        wx.setStorageSync('userInfo', res.userInfo)
      },
      fail: (err) => {
        console.error('授权失败:', err)
        wx.showToast({ title: '授权失败', icon: 'none' })
      }
    })
  },

  // 进入游戏
  enterRoom() {
    if (!this.data.isAuthorized) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    wx.showLoading({ title: '加载中...' })
    wx.navigateTo({
      url: '/pages/room/room',
      success: () => {
        wx.hideLoading()
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({ title: '进入失败', icon: 'none' })
        console.error('跳转失败:', err)
      }
    })
  }
})