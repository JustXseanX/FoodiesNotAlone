// pages/store/storeInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {
      restInfo: {
        id: -1,
        name: '',
        address: '',
        contact: '',
        heat: 0,
        img_src: '',
        isCollected: false,
      },

      // 商品列表
      items: []
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if ('storeId' in options){
      that.getStoreInfo(options.storeId)
    }
    else{
      wx.showToast({
        title: '店铺不存在！',
        icon: 'none'
      })
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var storeId = this.data.restInfo.id
    this.getStoreInfo(storeId)
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '已刷新'
    });
  },

  getStoreInfo: function(storeId){
    var that = this
    console.log("本地：获取店铺信息", storeId)
    wx.request({
      url: 'https://www.foodiesnotalone.cn/storeService.php',
      data: {
        'opcode': 'getStoreInfo',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': storeId
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        var restInfo = {}
        restInfo.id = storeId
        restInfo.name = res.data.storeInfo.name
        restInfo.address = res.data.storeInfo.address
        restInfo.contact = res.data.storeInfo.contact
        restInfo.heat = res.data.storeInfo.heat
        restInfo.img_src = 'https://www.foodiesnotalone.cn/images/rest/' + res.data.storeInfo.image
        restInfo.isCollected = res.data.storeInfo.isCollected
        that.setData({
          restInfo: restInfo
        })
        // 修改标题
        wx.setNavigationBarTitle({
          title: restInfo.name,
        }) 
        that.getStoreFoodList(storeId)
      }

    })
  },

  getStoreFoodList: function (storeId){
    var that = this
    console.log("本地：获取店铺食物信息", storeId)
    wx.request({
      url: 'https://www.foodiesnotalone.cn/storeService.php',
      data: {
        'opcode': 'getStoreFoodList',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': storeId
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        var foodList = []
        res.data.foodList.forEach(function(foodInfo){
          var food = {}
          food.id = foodInfo.id
          food.title = foodInfo.name
          food.price = foodInfo.price
          food.img_src = 'https://www.foodiesnotalone.cn/images/rest/' + foodInfo.image
          foodList.push(food)
        })
        that.setData({
          items: foodList
        })
      }
    })
  },

  clickCollect: function (e) {
    var that = this
    var storeId = this.data.restInfo.id
    console.log("本地：收藏店铺 ", storeId)
    
    wx.request({
      url: 'https://www.foodiesnotalone.cn/storeService.php',
      data: {
        'opcode': 'collectStore',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': storeId
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        that.getStoreInfo(storeId) // 完成后更新
      }
    })
  },

  

})