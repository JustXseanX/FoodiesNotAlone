// pages/startup/startup.js

// 获取应用实例
const app = getApp()

Page({
  onReady: function () {
    var that = this
    // 登录，在这里处理登陆，解决异步的问题
    wx.login({ //获取临时令牌和session3rd，并建立websocket链接
      success(res) {
        console.log("本地：获取临时令牌成功", res.code)
        // 登陆服务器
        wx.request({
          url: 'https://www.foodiesnotalone.cn/friendService.php',
          data: {
            'opcode': 'getLogin',
            'code': res.code
          },
          method: 'GET',
          success(res) {
            console.log("本地：获取用户信息以及生成3rd成功", res.data)
            // 存储session3rd
            wx.setStorageSync('session3rd', res.data.session3rd)
            // 建立ws链接
            wx.connectSocket({
              url: 'wss://www.foodiesnotalone.cn:2350',
              success: function (res) {
                console.log("本地：Websocket正在链接", res)
              }
            })
            // 检查登陆态
            wx.getSetting({
              success(res) {
                if (res.authSetting['scope.userInfo']) {
                  // 有登录状态
                  console.log("本地：存在登陆态")
                  
                  // 更新用户信息
                  wx.getUserInfo({
                    success(res) {
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
                          console.log("本地：用户信息更新成功", res.data)
                          // 跳转到主页
                          wx.reLaunch({
                            url: "/pages/index/friends/friends"
                          })
                        }
                      })
                      
                    },
                    fail() {
                      console.log("本地：用户信息获取失败")
                    }
                  })
                }
                else {
                  console.log("本地：无登陆态")
                  // 跳转到登陆页面
                  wx.reLaunch({
                    url: "/pages/login/login"
                  })
                }
              }
            })
          }
        })
      },
      fail(res) {
        console.log("本地：获取临时令牌失败", res.code)
      }
    })
  },


})