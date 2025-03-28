// pages/room/room.js
Page({
  data: {
    seats: [],
    mySeat: null,
    userId: 'user_' + Math.random().toString(36).substr(2, 5)
  },

  onLoad() {
    this.loadRoomData();
  },

  loadRoomData() {
    // 模拟初始化准备状态
    const roomData = {
      seats: [
        { seatId: 0, user: 'abc12', isReady: true },  // 示例：已准备用户
        { seatId: 1, user: null, isReady: false },
        { seatId: 2, user: 'def34', isReady: false },
        { seatId: 3, user: null, isReady: false },
        { seatId: 4, user: null, isReady: false },
        { seatId: 5, user: null, isReady: false },
        { seatId: 6, user: null, isReady: false },
      ]
    };
    this.setData({ seats: roomData.seats });
  },

  // 点击准备按钮
  toggleReady() {
    if (this.data.mySeat === null) {
      wx.showToast({ title: '请先选择座位', icon: 'none' });
      return;
    }

    const newReadyState = !this.data.seats[this.data.mySeat].isReady;
    this.setData({
      [`seats[${this.data.mySeat}].isReady`]: newReadyState
    });
    
    wx.showToast({
      title: newReadyState ? '已准备' : '已取消准备',
      icon: 'none'
    });
  },

  // 点击座位（原有逻辑优化）
  selectSeat(e) {
    const seatId = parseInt(e.currentTarget.dataset.seatId, 10);
    const targetSeat = this.data.seats[seatId];

    if (seatId === this.data.mySeat) return;

    if (targetSeat.user && targetSeat.user !== this.data.userId) {
      wx.showToast({ title: `座位 ${seatId} 已被占用`, icon: 'none' });
      return;
    }

    // 换座时清除原座位状态
    if (this.data.mySeat !== null) {
      this.clearSeat(this.data.mySeat);
    }

    // 设置新座位
    this.setData({
      [`seats[${seatId}].user`]: this.data.userId,
      [`seats[${seatId}].isReady`]: false, // 新座位默认未准备
      mySeat: seatId
    });
  },

  clearSeat(seatId) {
    this.setData({
      [`seats[${seatId}].user`]: null,
      [`seats[${seatId}].isReady`]: false, // 离座时自动取消准备
    });
  }
});