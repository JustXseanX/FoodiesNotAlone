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
        iconPath: '/resources/UI/icon/func_recommend.png',
        funcName: '美食推荐',
        //url: './foodRecommend/foodRecommend'
        url: '/pages/store/storeList?mode=foodRecommend'
      },
      {
        iconPath: '/resources/UI/icon/func_map.png',
        funcName: '美食地图',
        url: './foodMap/foodMap'
      },
      {
        iconPath: '/resources/UI/icon/func_route.png',
        funcName: '游玩路线',
        url: './routeArrange/selectRestriction'
      },
      {
        iconPath: '/resources/UI/icon/func_find_friends.png',
        funcName: '同好结交',
        url: './addFriend/addFriend'
      },
      {
        iconPath: '/resources/UI/icon/func_food_help.png',
        funcName: '辅助美食挑选',
        url: './foodHelp/foodHelp'
      },
      {
        iconPath: '/resources/UI/icon/func_gather.png',
        funcName: '攒局',
        url: './gather/gather'
      },
      
      // {
      //   iconPath: '/resources/UI/icon/func_others.png',
      //   funcName: '其他', // 轰趴厨房、美食拓荒
      //   url: ''
      // }
    ]
    this.setData({
      funcList: funcList
    })
  },

  clickOther: function(e){
    wx.showToast({
      title: '其他功能还在开发中！',
      icon: 'none'
    })
  },

  clickFunc: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },

})