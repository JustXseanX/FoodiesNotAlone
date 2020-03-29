// pages/shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {
      shopInfo: {
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
    if ('shopId' in options){
      that.getShopInfo(options.shopId)
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
    var shopId = this.data.shopInfo.id
    this.getShopInfo(shopId)
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '已刷新'
    });
  },

  getShopInfo: function(shopId){
    var that = this
    console.log("本地：获取店铺信息", shopId)
    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/routeArrange.php',
      data: {
        'opcode': 'getShopInfo',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': shopId
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        var shopInfo = {}
        shopInfo.id = shopId
        shopInfo.name = res.data.shopInfo.name
        shopInfo.address = res.data.shopInfo.address
        shopInfo.img_src = 'https://www.foodiesnotalone.cn/images/shop/' + res.data.shopInfo.image
        that.setData({
          shopInfo: shopInfo
        })
      }

    })
  },
  

})