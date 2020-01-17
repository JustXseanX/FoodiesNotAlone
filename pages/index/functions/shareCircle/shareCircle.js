// pages/functions/sharedCircle/sharedCircle.js

const app = getApp();
var msgList = [];
var keyHeight = 0;

Page({
 
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
  },

  onLoad: function (options) {
    this.getShareCircle()
  },

  getShareCircle: function () {
    var that = this
    console.log("本地：获取分享圈说说");
    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/shareCircle.php',
      data: {
        'session3rd': wx.getStorageSync('session3rd'),
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)
        //显示数据
        msgList = res.data.sayings_list;
        that.setData({
          msgList
        })
      }
    })
  },

  onPullDownRefresh: function () {
    this.getShareCircle();
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
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        that.getFriendsCircle() // 完成后更新
      }
    })
  },

  clickAvatar: function (e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/friend/friend?id=' + msgList[index].userId,
    })
  }
})

