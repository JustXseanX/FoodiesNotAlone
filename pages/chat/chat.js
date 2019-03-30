//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    MAXLENGTH: 10,
    inputText: '',
    targetUser: 'null'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    if ('target' in options){
      this.setData({
        targetUser: options.target
      })
    }
    else{
      console.log("未找到用户")
      wx.navigateBack({
        delta: 1
      })
    }
  },

  onReady: function() {
    
  },

  updateMessage: function() {
    var pack = {
      "opcode": "getMessage",
      "session3rd": wx.getStorageSync('session3rd'),
    }
    wx.sendSocketMessage({
      data: JSON.stringify(pack),
      success: function(res) {
        console.log("请求已发给服务器")
      }
    })
  },

  inputUpdate: function(e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  sendMessage: function(e) {
    console.log(this.data.inputText);
    var text = this.data.inputText;
    if (text == ''){
      wx.showToast({
        title: '消息不可为空！',
        icon: 'none'
      })
      return -1;
    }
    var pack = {
      "opcode": "sendMessage",
      "session3rd": wx.getStorageSync('session3rd'),
      "to": wx.getStorageSync('session3rd'),
      "text": text
    }
    wx.sendSocketMessage({
      data: JSON.stringify(pack),
      success: function(res) {
        // console.log("消息已发给服务器")
      }
    })
    this.setData({
      inputText: ''
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

})