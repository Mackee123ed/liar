// pages/index/index.js
Page({
  data: {
    userInfo: null, // 存储用户信息
    isAuthorized: false // 是否已授权
  },
  // 获取用户信息
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于展示您的头像和昵称', // 授权提示
      success: (res) => {
        this.setData({
          userInfo: res.userInfo, // 包含 nickName 和 avatarUrl
          isAuthorized: true
        });
        wx.showToast({ title: '授权成功', icon: 'success' });
        this.enterRoom(); // 授权成功后进入房间
      },
      fail: () => {
        wx.showToast({ title: '授权失败', icon: 'none' });
      }
    });
  },
  // 进入房间逻辑
  enterRoom() {
    wx.navigateTo({
      url: '/pages/room/room' // 跳转到房间页面
    });
  }
});