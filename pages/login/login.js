// pages/index/index.js

// 获取应用实例
const app = getApp()

Page({
  data: {
    text: "获取你的昵称和头像",
    userImg: ""
  },
  loginButton: function (){
    var that = this
    wx.getUserInfo({
      success(res) {
        // 更新页面
        that.setData({
          text: '登陆成功',
          userImg: res.userInfo.avatarUrl
        })
        //更新用户信息
        app.globalData.userInfo = res.userInfo //设置全局变量
        wx.request({
          url: 'https://www.foodiesnotalone.cn/friendService.php',
          data: {
            'opcode': 'getUserInfo',
            'session3rd': wx.getStorageSync('session3rd'),
            'userInfo': res.userInfo
          },
          method: 'POST',
          success(res) {
            console.log("本地：服务器内用户信息更新成功", res)
            // 跳转到主页
            setTimeout(function () {
              wx.reLaunch({
                url: "/pages/index/friends/friends"
              })
            }, 1000)
          }
        })
      },
      fail() {
        console.log("本地：用户信息获取失败")
      }
    })
  },
})
