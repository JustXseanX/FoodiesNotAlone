// pages/store/storeInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: '',
    info: 'loading...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if ('storeId' in options){
      this.data.storeId = options.storeId
      console.log("本地：获取店铺信息", options.storeId)
      wx.request({
        url: 'https://www.foodiesnotalone.cn/storeService.php',
        data: {
          'opcode': 'getStoreInfo',
          'id': that.data.storeId
        },
        method: 'GET',
        success(res) {
          console.log("服务器：", res.data)
          if ('error' in res.data){
            info = 'store not exist'
          }
          else{
          var info = ''
            info += 'id: ' + res.data.storeInfo['id'] + '\n'
            info += 'name: ' + res.data.storeInfo['name'] + '\n'
            info += 'address: ' + res.data.storeInfo['address'] + '\n'
            info += 'contact: ' + res.data.storeInfo['contact'] + '\n'
            info += 'heat: ' + res.data.storeInfo['heat'] + '\n'
          }
          that.setData({
            info: info
          })
        }
      })
    }
    else{
      //TODO:
    }
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