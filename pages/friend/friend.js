Page({

  /**
   * 页面的初始数据
   */
  // data: {
  //   id: -1,
  //   sex:"男",
  //   motto: '食べていく',
  //   image: 'https://www.foodiesnotalone.cn/resources/UI/icon/love.png',
  //   name:'绿谷迈特',
  // },
  data: {
    id: -1,
    sex: "",
    motto: '',
    image: '',
    name: '加载中...',
    friendState: true,
    friendStateText: '加好友',
    buttonColor: "background: #00a742"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if ('id' in options) {
      this.setData({
        id: options.id,
      })
    }
    this.getFriendInfo()
  },

  onPullDownRefresh: function () {
    this.getFriendInfo()
  },

  getFriendInfo: function() {
    var that = this
    console.log("本地：获取好友 " + that.data.id + " 信息")
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'getFriendInfo',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': that.data.id
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        var info = res.data.data
        that.setData({
          name: info.name,
          image: info.image,
          sex: info.sex,
          motto: info.motto,
          friendState: info.friendState
        })
        
        wx.setNavigationBarTitle({      //设置标题栏文字
          title: info.name
        })

        // 设置添加/删除好友按钮
        that.updateButtonColor();
      }
    })
  },

  updateButtonColor: function(){
    if (this.data.friendState) { // 添加好友，改成删除好友
      this.setData({
        friendStateText: '删除好友',
        buttonColor: "background: #FF001F"
      })
    }
    else { // 删除好友，改成添加好友
      this.setData({
        friendStateText: '加好友',
        buttonColor: "background: #00A742"
      })
    }
  },

  changeFriendState: function(){
    var that = this
    var action = ''
    if (!that.data.friendState){
      console.log("本地：添加好友", that.data.id)
      action = 'add'
    }
    else{
      console.log("本地：删除好友", that.data.id)
      action = 'delete'
    }
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'changeFriendState',
        'session3rd': wx.getStorageSync('session3rd'),
        'friendId': that.data.id,
        'action': action
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        var currentFriendState = res.data.currentFriendState
        that.setData({
          friendState: currentFriendState
        })
        // 设置添加/删除好友按钮
        that.updateButtonColor();
      }
    })
  }

})