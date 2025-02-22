Page({
  data: {
    // seats: [], // 座位状态
    seats: [
      { "seatId": 1, "user": { "nickName": "用户1", "avatarUrl": "url1" } },
      { "seatId": 2, "user": null },
      { "seatId": 3, "user": null }
    ],
    mySeat: null // 当前用户座位
  },
  onLoad() {
    this.loadRoomData(); // 加载房间数据
  },
  // 从云数据库加载房间数据
  // loadRoomData() {
  //   const db = wx.cloud.database();
  //   db.collection('room').doc('room_001').get({
  //     success: (res) => {
  //       this.setData({
  //         seats: res.data.seats
  //       });
  //     }
  //   });
  // },
  // 点击座位
  selectSeat(e) {
    const seatId = e.currentTarget.dataset.seatId;
    const userInfo = getApp().globalData.userInfo; // 从全局获取用户信息
    // const db = wx.cloud.database();

    // 如果已有座位，先清空
    if (this.data.mySeat) {
      this.clearSeat(this.data.mySeat);
    }

    // 检查座位是否为空
    if (!this.data.seats[seatId - 1].user) {
      db.collection('room').doc('room_001').update({
        data: {
          [`seats.${seatId - 1}.user`]: userInfo // 更新座位信息
        },
        success: () => {
          this.setData({
            [`seats.${seatId - 1}.user`]: userInfo,
            mySeat: seatId
          });
          wx.showToast({ title: `已入座 ${seatId}` });
        }
      });
    } else {
      wx.showToast({ title: '座位已被占用', icon: 'none' });
    }
  },
  // 清空当前座位
  clearSeat(seatId) {
    const db = wx.cloud.database();
    db.collection('room').doc('room_001').update({
      data: {
        [`seats.${seatId - 1}.user`]: null
      },
      success: () => {
        this.setData({
          [`seats.${seatId - 1}.user`]: null,
          mySeat: null
        });
      }
    });
  }
});