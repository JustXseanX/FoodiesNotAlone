

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Restaurant: [],
    isEmpty: true,
    //{ img_src: 'https://www.foodiesnotalone.cn/images/rest/default_store_image.png', id: '1', name: '华莱士', address: '川大路', contact: '?', heat: '1234' },
  },

  onLoad: function (options) {
    var that = this
    if ('mode' in options){
      if (options.mode == 'foodRecommend'){
        console.log("本地：获取推荐列表")
        // 修改标题
        wx.setNavigationBarTitle({
          title: '美食推荐',
        }) 
        wx.showLoading({
          title: '获取中...',
        })
        // 获取列表
        wx.request({
          url: 'https://www.foodiesnotalone.cn/functions/foodRecommend.php',
          data: {
            'opcode': 'getStoreRecommend',
            'session3rd': wx.getStorageSync('session3rd'),
            'latitude': 30.552659,
            'longitude': 103.992726,
          },
          method: 'GET',
          success(res) {
            wx.hideLoading()
            console.log("服务器：", res.data)
            if ('error' in res.data) {
              wx.showToast({
                title: '未知错误！',
              })
            }
            else {
              var rests = []
              res.data.storeList.forEach(function (storeInfo) {
                var store = {}
                store.id = storeInfo.id
                store.name = storeInfo.name
                store.address = storeInfo.address
                store.contact = storeInfo.contact
                store.heat = storeInfo.heat
                store.img_src = 'https://www.foodiesnotalone.cn/images/rest/' + storeInfo.image
                rests.push(store)
              })

              console.log('本地：更新店铺列表', rests)
              var isEmpty = (rests.length == 0)
              that.setData({
                Restaurant: rests,
                isEmpty: isEmpty
              })
            }
          }
        })
      }
      else if (options.mode == 'collection' || options.mode == 'history') {
        if (options.mode == 'collection'){
          console.log("本地：获取收藏列表")
          // 修改标题
          wx.setNavigationBarTitle({
            title: '我的收藏',
          })
          var op = 'getCollectionList'
        }
        else if (options.mode == 'history'){
          console.log("本地：获取足迹列表")
          // 修改标题
          wx.setNavigationBarTitle({
            title: '我的足迹',
          })
          var op = 'getHistoryList'
        }
        wx.request({
          url: 'https://www.foodiesnotalone.cn/storeService.php',
          data: {
            'opcode': op,
            'session3rd': wx.getStorageSync('session3rd'),
          },
          method: 'GET',
          success(res) {
            console.log("服务器：", res.data)
            var rests = []
            res.data.storeList.forEach(function (storeInfo) {
              var store = {}
              store.id = storeInfo.id
              store.name = storeInfo.name
              store.address = storeInfo.address
              store.contact = storeInfo.contact
              store.heat = storeInfo.heat
              store.img_src = 'https://www.foodiesnotalone.cn/images/rest/' + storeInfo.image
              rests.push(store)
            })

            console.log('本地：更新店铺列表', rests)
            var isEmpty = (rests.length == 0)
            that.setData({
              Restaurant: rests,
              isEmpty: isEmpty
            })
          }
        })
      }
    }
    else{
      wx.showToast({
        title: '缺少参数！',
        icon: 'None'
      })
    }
  },

  details: function (e) {
    var storeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/store/store?storeId=' + storeId,
    })
  }
})