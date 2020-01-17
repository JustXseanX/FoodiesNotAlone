// pages/functions/foodMap/foodMap.js
var QQMapWX = require('../../../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 16,
    // markers: [{
    //   iconPath: "/resources/UI/icon/mark.png",
    //   id: 0,
    //   latitude: 30.671517,
    //   longitude: 103.772049,
    //   centerLatitude: 30.671517,
    //   centerLongitude: 103.772049,
    //   width: 20,
    //   height: 30,
    //   callout: {
    //     content: "裕洋大酒店",
    //     padding: 10,
    //     display: 'ALWAYS',
    //     textAlign: 'center',
    //     // borderRadius: 10,
    //     // borderColor:'#ff0000',
    //     // borderWidth: 2,
    //   }
    // }],
    // latitude: 0,
    // longitude: 0,
    latitude: 30.552659,
    longitude: 103.992726,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.centerLatitude = this.data.latitude
    this.data.centerLongitude = this.data.longitude
    this.updateRestList();
    /*
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
    */
    
  },

  updateRestList() {
    var that = this
    console.log('la: ' + this.data.latitude + ', long: ' + this.data.longitude)
    wx.request({
      url: 'https://www.foodiesnotalone.cn/storeService.php',
      data: {
        'opcode': 'getStoresList',
        'latitude': this.data.centerLatitude,
        'longitude': this.data.centerLongitude,
        'scale': that.data.scale
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        var newMarkers = [];
        var id = 0;
        res.data.storesList.forEach(function (storeInfo) {
          var newMarker = {};
          newMarker.iconPath = "/resources/UI/icon/mark.png"
          newMarker.id = id++
          newMarker.storeId = storeInfo.id
          newMarker.latitude = storeInfo.latitude
          newMarker.longitude = storeInfo.longitude
          newMarker.width = Math.min(storeInfo.heat / 200, 40)
          newMarker.height = Math.min(storeInfo.heat / 200, 40)
          // newMarker.callout = {}
          // newMarker.callout.content = storeInfo.name
          // newMarker.callout.padding = 10
          // newMarker.callout.display = 'ALWAYS'
          // newMarker.callout.textAlign = 'center'
          newMarkers.push(newMarker)
        })
        that.setData({
          markers: newMarkers
        })
      }
    })
  },

  regionChange(e) {
    var that = this
    if (e.type == 'end' && e.causedBy == 'scale'){
      var map = wx.createMapContext('map')
      map.getCenterLocation({
        success(res) {
          that.data.centerLongitude = res.longitude
          that.data.centerLatitude = res.latitude
          that.updateRestList();
        }
      })
      
    }
  },

  mapMarkerClick(e) {
    console.log("本地：点击便签", e.markerId)
    var storeId = this.data.markers[e.markerId].storeId
    wx.navigateTo({
      url: '/pages/store/storeInfo?storeId=' + storeId
    })
  },
})