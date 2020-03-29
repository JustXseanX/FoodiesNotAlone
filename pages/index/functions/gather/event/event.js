// pages/CircleFriends/CircleFriends.js
var app = getApp()
var that
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var inputVal = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentEventId: -1,
    eventInfo: {
      "owner": {
        "id": -1,
        "userImg": "",
        "userName": ".",
      },
      "title": "加载中...",
      "detail": "",
      "address": "",
      "time": "",
      "sumPeople": null,
      "already": null,
      "morePeople": null,
      "imgsList": [],
      "AList": [],
      "userState": -1
    },
    /*
    {
      "owner":{
        'id':'xx',
        "userImg": 'xx',
        "userName": "xx",
      },
      "title":"xx",
      "detail":"xxx",
      "address":"xx",
      "time":"xx",
      "sumPeople":100,
      "already":99,
      "morePeople":1,
      "imgsList":['xxx','xxx'],
      "AList":['xx','xxx','xx','xx','xx'],
      "userState": 0
    }
    */
    photoWidth: wx.getSystemInfoSync().windowWidth*0.8,
  },


  onLoad: function(options) {
    if ('id' in options) {
      this.setData({
        currentEventId: options.id,
      })
    }
    else{
      wx.showToast({
        title: '攒局不存在！',
        icon: 'none'
      })
    }
    this.getEventInfo()
  },

  // 点击图片进行大图查看
  LookPhoto: function(e) {
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = e.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  getEventInfo: function () {
    console.log("本地：获取攒局信息")
    var that = this
    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/gather.php',
      data: {
        'opcode': 'getEventInfo',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': that.data.currentEventId
      },
      method: 'GET',
      success(res) {
        console.log("服务器：攒局详细信息", res.data)
        that.setData({
          eventInfo: res.data.eventInfo
        })
        //设置标题栏文字
        wx.setNavigationBarTitle({      
          title: res.data.eventInfo.title
        })
      },

    })
  },

  onPullDownRefresh: function () {
    this.getEventInfo()
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '已刷新'
    })
  },

  changeEventState: function(){
    var that = this
    var userState = this.data.eventInfo.userState
    var action = ''
    if (userState == 1){
      action = 'join'
      if (that.data.eventInfo.already >= that.data.eventInfo.sumPeople){
        wx.showToast({
          title: '人数已满！',
          icon: 'none'
        })
        return
      }
    }
    else if (userState == 2){
      action = 'quit'
    }
    else{
      wx.showToast({
        title: '未知的错误！',
        icon: 'none'
      })
      return
    }

    

    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/gather.php',
      data: {
        'opcode': 'changeEventState',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': that.data.currentEventId,
        'action': action
      },
      method: 'GET',
      success(res) {
        console.log("服务器：改变攒局状态", res.data)
        // 刷新状态
        that.getEventInfo()
      },

    })

    
  },

  editEvent: function(){
    var eventId = this.data.currentEventId
    wx.navigateTo({
      url: './editEvent?id=' + eventId
    })
  }
})