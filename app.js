//app.js
App({
  onLaunch: function () {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.statusBarHeight = res.statusBarHeight
        that.globalData.fontSizeSetting = res.fontSizeSetting
      }
    })
  },
  globalData: {
    userId: -1,
    loginComplete: false,
    userInfo: null,
    messagesList:[],
    groupMessagesList: [],
    statusBarHeight: 0,
    fontSizeSetting: 12
  }
})