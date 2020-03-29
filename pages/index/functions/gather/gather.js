const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    fontSizeSetting: 12,
    posts:[],
    /*
    {
        "owner":0,
        "title":"xx",
        "detail":"xxxxx",
        "address":"xxxxxx",
        "date": "xxx",
        "time":"xxx",
        "sumPeople":100,
        "already":99,
        "morePeople":1,
        "imgsList":['xxxx', 'xxxx'],
        "AList":['xx','xxxx','xx','xx','xx'],
      }
      */
  },

  onLoad: function (options) {
    //获取全局变量 导航栏的高度statusBarHeight
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      fontSizeSetting: app.globalData.fontSizeSetting,
    })
    this.getEventList()
  },

  returnClick: function () {
    wx.navigateBack({})
  },

  refreshClick: function () {
    this.getEventList()
    wx.showToast({
      title: '已刷新'
    })
  },

  newEventClick: function () {
    wx.navigateTo({
      url: './event/addEvent'
    })
  },

  detailClick: function (e) {
    var eventId = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: './event/event?id=' + eventId
    })
  },

  getEventList: function () {
    console.log("本地：获取攒局列表")
    var that = this
    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/gather.php',
      data: {
        'opcode': 'getEventList',
        'session3rd': wx.getStorageSync('session3rd')
      },
      method: 'GET',
      success(res) {
        console.log("服务器：攒局列表", res.data)
        that.setData({
          posts: res.data.eventList
        })
      },

    })
  },

  onPullDownRefresh: function () {
    this.refreshClick()
  },

  
})