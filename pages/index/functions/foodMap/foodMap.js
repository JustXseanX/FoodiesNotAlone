// pages/functions/foodMap/foodMap.js
var QQMapWX = require('../../../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      iconPath: "/pages/images/icon/fire.png",
      id: 0,
      latitude: 30.671517,
      longitude: 103.772049,
      width: 20,
      height: 30,
      callout: {
        content: "裕洋大酒店",
        padding: 10,
        display: 'ALWAYS',
        textAlign: 'center',
        // borderRadius: 10,
        // borderColor:'#ff0000',
        // borderWidth: 2,
      }
    }],
    latitude: 0,
    longitude: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getLocation({
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })

    wx.getLocation({
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        wx.request({
          url: 'https://www.foodiesnotalone.cn/storeService.php',
          data: {
            'opcode': 'getStoresList',
            'latitude': res.latitude,
            'longitude': res.longitude
          },
          method: 'POST',
          success(res) {
            console.log("服务器：", res.data)
            var newMarkers = [];
            var id = 0;
            res.data.storesList.forEach(function (storeInfo) {
              var newMarker = {};
              newMarker.iconPath = "/pages/images/icon/fire.png"
              newMarker.id = id++
              newMarker.latitude = storeInfo.latitude
              newMarker.longitude = storeInfo.longitude
              newMarker.width = Math.max(storeInfo.heat * 20, 20)
              newMarker.height = Math.max(storeInfo.heat * 30, 30)
              newMarker.callout = {}
              newMarker.callout.content = storeInfo.name
              newMarker.callout.padding = 10
              newMarker.callout.display = 'ALWAYS'
              newMarker.callout.textAlign = 'center'
              newMarkers.push(newMarker)
            })
            that.setData({
              markers: newMarkers
            })
          }
        })
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