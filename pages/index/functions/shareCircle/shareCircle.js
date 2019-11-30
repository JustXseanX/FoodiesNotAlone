// pages/functions/sharedCircle/sharedCircle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendsCircle: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/shareCircle.php',
      data: {
        'session3rd': wx.getStorageSync('session3rd'),
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)

        var friendsCircleData = ''
        res.data.sayings_list.forEach(function (saying) {
          friendsCircleData += '来自：' + saying.userName + '\n' + '时间：' + saying.time.substring(0, 4) + '年' + saying.time.substring(4, 6) + '月' + saying.time.substring(6, 8) + '日 ' + saying.time.substring(8, 10) + ':' + saying.time.substring(10, 12) + ':' + saying.time.substring(12, 14) + '\n' + saying.content + '\n\n'
          saying.reply.forEach(function (reply) {
            friendsCircleData += '&nbsp;&nbsp;&nbsp;&nbsp;评论来自：' + reply.userName + '\n&nbsp;&nbsp;&nbsp;&nbsp;' + '时间：' + reply.time.substring(0, 4) + '年' + reply.time.substring(4, 6) + '月' + reply.time.substring(6, 8) + '日 ' + reply.time.substring(8, 10) + ':' + reply.time.substring(10, 12) + ':' + reply.time.substring(12, 14) + '\n&nbsp;&nbsp;&nbsp;&nbsp;' + reply.content + '\n\n'
          })
        })
        that.setData({
          friendsCircle: friendsCircleData
        })

        console.log("本地：分享圈已显示")
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})