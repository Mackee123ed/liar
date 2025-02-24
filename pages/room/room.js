Page({
  data: {
    seats: [
      { seatId: 0, user: null },
      { seatId: 1, user: null },
      { seatId: 2, user: null }
    ],
    mySeat: null // 当前用户座位
  },

  onLoad() {
    this.loadRoomData(); // 加载房间数据
  },

  // 从云数据库加载房间数据
  loadRoomData() {
    // 假设从云数据库获取数据并更新座位状态
    // 这里模拟从云数据库获取数据
    const roomData = {
      seats: [
        { seatId: 0, user: null },
        { seatId: 1, user: null },
        { seatId: 2, user: null },
        { seatId: 3, user: null },
        { seatId: 4, user: null },
        { seatId: 5, user: null },
        { seatId: 6, user: null },
      ]
    };
    this.setData({
      seats: roomData.seats
    });
  },

  // 点击座位
  selectSeat(e) {
    const seatId = e.currentTarget.dataset.seatId;

    // 如果用户已经坐在某个座位上，先清空原座位
    if (this.data.mySeat !== null) {
      this.clearSeat(this.data.mySeat);
    }

    // 检查座位是否为空
    if (!this.data.seats[seatId].user) {
      this.setData({
        [`seats.${seatId}.user`]: "有人",
        mySeat: seatId
      });
      wx.showToast({ title: `已入座 ${seatId}` });
    }
  },

  // 清空当前座位
  clearSeat(seatId) {
    this.setData({
      [`seats.${seatId}.user`]: null,
      mySeat: null
    });
    wx.showToast({ title: `已离开座位 ${seatId}` });
  }
});