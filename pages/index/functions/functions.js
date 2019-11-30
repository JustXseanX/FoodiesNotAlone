// pages/functions/functions.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    funcList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var funcList = [
      {
        iconPath: '/resources/UI/icon/func_share_circle.png',
        funcName: '分享圈',
        url: './shareCircle/shareCircle'
      },
      {
        iconPath: '/resources/UI/icon/func_recommend.png',
        funcName: '美食推送、推荐',
        url: './'
      },
      {
        iconPath: '/resources/UI/icon/func_map.png',
        funcName: '美食地图',
        url: './foodMap/foodMap'
      },
      {
        iconPath: '/resources/UI/icon/func_route.png',
        funcName: '游玩路线',
        url: './'
      },
      {
        iconPath: '/resources/UI/icon/func_find_friends.png',
        funcName: '同好结交',
        url: './'
      },
      {
        iconPath: '/resources/UI/icon/func_food_search.png',
        funcName: '辅助美食挑选',
        url: './'
      },

      {
        iconPath: '/resources/UI/icon/func_budget_match.png',
        funcName: '预算匹配',
        url: './'
      },
      {
        iconPath: '/resources/UI/icon/func_others.png',
        funcName: '轰趴厨房、美食拓荒',
        url: './'
      }
    ]
    this.setData({
      funcList: funcList
    })
  },

  clickFunc: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },

})