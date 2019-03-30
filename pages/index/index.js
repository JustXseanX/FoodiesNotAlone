//pages/index/index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    text: "获取你的昵称和头像",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function () {
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //websocket接受信息
    wx.onSocketMessage(function (res) {
      var obj = JSON.parse(res.data);
      if (obj.opcode == "tips")
        console.log("服务器：", obj.text);
      else if (obj.opcode == "getMessage")
        console.log("收到消息：", obj.content);
    })

    var pack = {
      "opcode": "online",
      "session3rd": wx.getStorageSync('session3rd')
    }
    wx.sendSocketMessage({
      data: JSON.stringify(pack),
      success: function (res) {
        console.log("本地：上线消息已发给服务器")
      }
    })
  },

  onReady: function(){
    
  },

  jump: function(){
    wx.navigateTo({
      url: '../chat/chat?target=1',
    })
  },

  getUserInfo: function(e) {
    const self = this
    wx.getUserInfo({
      success(res) {
        app.globalData.userInfo = res.userInfo
        self.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          userhead: res.userInfo.avatarUrl,
          text: "已登录"
        })
      
        wx.request({
          url: 'http://45.40.200.208/getUserInfo.php',
          data: {
            userInfo: res.userInfo,
            session3rd: wx.getStorageSync('session3rd')
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          method: 'POST',
          success(res) {
            console.log("本地：用户数据获取成功，并已发送至服务器")
          },
         
        })
      },
      fail() {
        console.log("本地：用户数据获取失败")
      }
    })
  },
  fuck: function() {
    wx.closeSocket()
  }
})
