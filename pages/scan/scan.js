// pages/scan/scan.js
Page({
  scanCode: function () {
    const self = this
    wx.scanCode({
      scanType: 'qrCode',
      success(res) {
        self.setData({
          scanRes: res.result
        })
      }
    })
  }
})