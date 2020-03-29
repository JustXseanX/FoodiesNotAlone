// pages/index/functions/foodHelp/foodHelp.js
Page({
  data: {
    Person:[],
    //{ img_src:'image/nantong.png', id: '1', name: 'xxx', sex: '男' , motto:'xxx' },
    depValue: [],
    d_id: [],//游玩项目id集合
  },


  onLoad: function(options){
    this.getRecommendFriend()
  },

  getRecommendFriend: function(){
    var that = this
    console.log("本地：获取推荐好友列表")
    wx.showLoading({
      title: '获取中...',
    })
    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/addFriend.php',
      data: {
        'opcode': 'getRecommendFriend',
        'session3rd': wx.getStorageSync('session3rd')
      },
      method: 'GET',
      success(res) {
        wx.hideLoading()
        console.log("服务器：", res.data)
        if ('error' in res.data) {
          wx.showToast({
            title: '未知错误！',
            icon: 'none'
          })
        }
        else {
          console.log('本地：更新推荐好友列表', res.data.userList)
          that.setData({
            Person: res.data.userList
          })
        }
        
      }
    })
  },

  details: function (e) {
    var userId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/friend/friend?id=' + userId,
    })
  },

  onPullDownRefresh: function () {
    this.getRecommendFriend()
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '已刷新'
    })
  },
})
