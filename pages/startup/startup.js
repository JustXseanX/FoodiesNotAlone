// pages/startup/startup.js
Page({

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.login({ //获取临时令牌
      success: function (loginRes) {
        if (loginRes.code) {
          console.log(loginRes.code);
          
          wx.request({
            url: 'http://45.40.200.208/getUserData.php',
            data: {
              code: loginRes.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              wx.setStorageSync('session3rd', res.data.session3rd)
              wx.connectSocket({
                url: 'ws://45.40.200.208:2350',
                success: function (res) {
                  console.log("本地：Websocket正在链接", res)
                }
              })
            }
          })
        }
      }
    })

    setTimeout(function(){
      wx.reLaunch({ //关闭当前页面，跳转到应用内的某个页面
        url: "/pages/index/index"
      })
    }, 2000)
  }

})