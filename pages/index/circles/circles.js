// pages/index/circles/circles.js

const app = getApp();
var msgList = [];
var keyHeight = 0;

Page({

  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
  },

  onLoad: function (options) {
    this.getFriendsCircle()
  },

  getFriendsCircle: function() {
    var that = this
    console.log("本地：获取朋友圈说说");
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'getFriendsCircle',
        'session3rd': wx.getStorageSync('session3rd'),
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)
        //显示数据
        msgList = res.data.friends_circle;
        that.setData({
          msgList
        })
        //console.log("本地：朋友圈已显示", friendsCircleData)
        console.log("本地：朋友圈已显示")
      }
    })
  },

  sendSayings: function() {
    wx.navigateTo({
      url: './sendSayings/sendSayings',
    })
  },
  
  onPullDownRefresh: function () {
    this.getFriendsCircle();
  },

  toBackClick: function () {
    wx.navigateBack({})
  },

  clickImg: function (e) {
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = e.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  clickLike: function (e) {
    var that = this
    console.log("本地：点赞")
    var index = e.currentTarget.dataset.index
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'clickLike',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': msgList[index].id
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)
        that.getFriendsCircle() // 完成后更新
      }
    })
  }
})



