// pages/index/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // onPullDownRefresh: function () {
    //   wx.stopPullDownRefresh()
    // },
    myinfo: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var stu = wx.getStorageSync('student');
    this.setData({ myinfo: stu });
    // console.log(this.data.myinfo);
  },
  // exit: function (e) {
  //   wx.showModal({
  //     title: '提示',
  //     content: '是否确认退出登陆',
  //     success: function (res) {
  //       if (res.confirm) {
  //         console.log('已删除登录状态')
  //         wx.clearStorage({ // 删除所有缓存，包括授权缓存
  //           success(){
  //             // 回到登录页
  //             wx.reLaunch({
  //               url: "/pages/startup/startup"
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  // gotoFunctions: function() {
  //   wx.navigateTo({ //关闭当前页面，跳转到应用内的某个页面
  //     url: "/pages/functions/functions"
  //   })
  // }
})
