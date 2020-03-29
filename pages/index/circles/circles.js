// pages/index/circles/circles.js

const app = getApp();
var keyHeight = 0;
var commentId = -1;
var comment = '';
Page({

  data: {
    statusBarHeight: 0,
    fontSizeSetting: 12,
    circles: [],
    shareCircle: [],
    inputBottom: 0,
    inputFocus: false,
    /*新添*/
    navbar: ['好友', '推荐'],
    currentTab: 0,
  },

  onLoad: function (options) {
    //获取全局变量 导航栏的高度statusBarHeight
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      fontSizeSetting: app.globalData.fontSizeSetting,
    })
    this.getFriendsCircle()
    this.getShareCircle()
  },

  getFriendsCircle: function () {
    var that = this
    console.log("本地：获取朋友圈说说");
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'getFriendsCircle',
        'session3rd': wx.getStorageSync('session3rd'),
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        // 检查错误
        if ('error' in res.data) {
          wx.showToast({
            title: '未知错误！',
            icon: 'none'
          })
        }
        //显示数据
        var circles = res.data.friends_circle;
        that.setData({
          circles
        })
        //console.log("本地：朋友圈已显示", friendsCircleData)
        console.log("本地：朋友圈已显示")
      },
      fail(){
        wx.showToast({
          title: '未知错误！',
          icon: 'none'
        })
      }
    })
  },

  getShareCircle: function () {
    var that = this
    console.log("本地：获取朋友圈说说");
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'getShareCircle',
        'session3rd': wx.getStorageSync('session3rd'),
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        // 检查错误
        if ('error' in res.data) {
          wx.showToast({
            title: '未知错误！',
            icon: 'none'
          })
        }
        //显示数据
        var shareCircle = res.data.sayings_list;
        that.setData({
          shareCircle
        })
        console.log("本地：朋友圈已显示")
      },
      fail() {
        wx.showToast({
          title: '未知错误！',
          icon: 'none'
        })
      }
    })
  },

  sendSayings: function () {
    wx.navigateTo({
      url: './sendSayings/sendSayings',
    })
  },

  refresh: function () {
    this.getFriendsCircle()
    this.getShareCircle()
    wx.showToast({
      title: '已刷新'
    })
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
    var id = e.currentTarget.dataset.id
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'clickLike',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': id
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        that.getFriendsCircle() // 完成后更新
        that.getShareCircle()
      }
    })
  },

  clickAvatar: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/friend/friend?id=' + that.data.circles[index].userId,
    })
  },

  writeComment: function (e) {
    var id = e.currentTarget.dataset.id
    if (commentId != id){
      comment = ''
      commentId = id
    }
    this.setData({
      isShow: true,
      inputFocus: true

    })
  },

  blur: function (e) {
    this.setData({
      isShow: false,
    })
  },

  input: function (e) {
    comment = e.detail.value
  },

  sendComment: function(e){
    var that = this
    // 检查
    if (commentId == -1){
      wx.showToast({
        title: '错误！',
        icon: 'none'
      })
      return
    }
    if (comment == '') {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none'
      })
      return
    }

    console.log("本地：评论 - ", comment)
    var index = e.currentTarget.dataset.index
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'replySaying',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': commentId,
        'text': comment,
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)
        that.getFriendsCircle() // 完成后更新
        that.getShareCircle()
        // 清空
        commentId = -1
        comment = ''
        // 关闭
        that.setData({
          isShow: false,
        })
        // 刷新
        that.getFriendsCircle() // 完成后更新
        that.getShareCircle()
        // 提示
        wx.showToast({
          title: '评论成功',
          icon: 'succuess'
        })
      }
    })
    
  },



  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    //全局变量
    app.globalData.currentTab = e.currentTarget.dataset.idx;
  },
  onShow() {
    this.setData({
      currentTab: app.globalData.currentTab
    })
  },
})
