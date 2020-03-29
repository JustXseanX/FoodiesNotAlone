// pages/index/functions/routeArrange/routeArrange.js
var map;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    polylines: [],
    markers: [],
    isDep: true,
    arrangeList: [],
    //  { name: '猫咖', time: '13:00-16:00', img_src: 'image/cat.jpg', nextStat: '5' },
    //  { name: '电影院', time: '17:00-19:00', img_src: 'image/cinema.jpg', nextStat: '' }

  },

  onLoad: function (options) {
    var that = this
    // 初始化坐标
    this.setData({
      latitude: 30.552659,
      longitude: 103.992726
    })
    // 获取参数并发送请求
    if ('data' in options && options.data != '') {
      var data = JSON.parse(options.data)
      console.log("本地：路线规划约束数据", data)
      that.getArrage(data.prefers, data.startTime, data.endTime, data.budget)
    }
    else {
      wx.showToast({
        title: '未知错误！',
        icon: 'None'
      })
    }
  },

  onReady: function (options) {
    // 初始化MapContext
    map = wx.createMapContext('map')

    
  },

  getArrage: function (prefers, startTime, endTime, budget) {
    var that = this

    console.log("本地：获取店铺数据")
    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/routeArrange.php',
      data: {
        'opcode': 'getArrange',
        'session3rd': wx.getStorageSync('session3rd'),
        'latitude': that.data.latitude,
        'longitude': that.data.longitude,
        'startTime': startTime,
        'endTime': endTime,
        'prefers': prefers,
        'budget': budget
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)
        // 在地图上绘制连线
        var points = []
        res.data.arrangeList.forEach(function (arrage) {
          var point = {
            latitude: arrage.shop.latitude,
            longitude: arrage.shop.longitude
          }
          points.push(point)
        })
        // 初始化连线图形
        var polylines = [{
          points: points,
          color: '#ffaaaa',
          width: 8,
          arrowLine: true,
          borderWidth: 2
        }]
        
        // console.log(polylines)
        // 创建列表
        var arrangeList = []
        res.data.arrangeList.forEach(function (shopInfo) {
          var newShop = {};
          newShop.id = shopInfo.shop.id
          newShop.name = shopInfo.shop.name
          newShop.img_src = 'https://www.foodiesnotalone.cn/images/shop/' + shopInfo.shop.image
          newShop.time = shopInfo.time
          newShop.avgPrice = shopInfo.shop.avgPrice != 0 ? shopInfo.shop.avgPrice : '未知'
          newShop.nextStat = shopInfo.distance
          arrangeList.push(newShop)
        })
        // 绘制markers
        var markers = []
        res.data.arrangeList.forEach(function (shopInfo) {
          var newMarker = {};
          newMarker.iconPath = "/resources/UI/icon/mark.png"
          newMarker.id = shopInfo.shop.id
          newMarker.latitude = shopInfo.shop.latitude
          newMarker.longitude = shopInfo.shop.longitude
          newMarker.width = 30
          newMarker.height = 30
          newMarker.anchor = {x:0.5, y:0.5}
          markers.push(newMarker)
        })
        // 更新数据
        that.setData({
          polylines: polylines,
          markers: markers,
          arrangeList: arrangeList,
          latitude: parseFloat(points[0].latitude),
          longitude: parseFloat(points[0].longitude)
        })
      }
    })
  },

  mapMarkerClick(e) {
    console.log("本地：点击便签", e.markerId)
    var shopId = e.markerId
    wx.navigateTo({
      url: '/pages/shop/shop?shopId=' + shopId,
    })
  },

  routeShopClick(e) {
    console.log("本地：点击路线店铺", e.currentTarget.dataset.id)
    var shopId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/shop/shop?shopId=' + shopId,
    })
  },

  isDep: function () {
    this.setData({
      isDep: true,
    })
  },
  confirm: function () {// 确定
    this.setData({
      isDep: false,
    })
  },
})