// pages/index/functions/others/others.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  test: function () {
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'replySaying',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': 1,
        'text': '测试！'
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)
        
      }
    })
  },
})