Page({

  /**
   * 页面的初始数据
   */
  /*
  data: {
    "admin": ["1", "2", "3"]
    "id": "1"
    "img": "https://www.foodiesnotalone.cn/resources/UI/icon/default.png"
    "inGroupState": true
    "memberList": [
      { "id": "1", "userName": "AllocBlock", "userImg": "xxx", "isAdmin": true }
      { "id": "2", "userName": "帅一", "userImg": "xxx", "isAdmin": true }
      { "id": "3", "userName": "Never", "userImg": "xxx", "isAdmin": true }
      { "id": "4", "userName": "null", "userImg": "xxx", "isAdmin": false }
    ]
    "name": "组！"
  },
  */
  data: {
    id: -1,
    name: '',
    image: '',
    memberList: [],
    inGroupState: false,
    inGroupStateText: '加入组',
    name: '加载中...',
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
    this.getGroupInfo()
  },

  onPullDownRefresh: function () {
    this.getGroupInfo()
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '已刷新'
    })
  },

  getGroupInfo: function () {
    var that = this
    console.log("本地：获取群聊 " + that.data.id + " 信息")
    wx.request({
      url: 'https://www.foodiesnotalone.cn/groupService.php',
      data: {
        'opcode': 'getGroupInfo',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': that.data.id
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        var info = res.data.data
        that.setData({
          name: info.name,
          image: info.img,
          memberList: info.memberList,
          admin: info.admin,
          inGroupState: info.inGroupState
        })

        wx.setNavigationBarTitle({      //设置标题栏文字
          title: info.name
        })

        // 设置加入、退出组按钮
        that.updateButtonColor();
      }
    })
  },

  updateButtonColor: function () {
    if (this.data.inGroupState) {
      this.setData({
        inGroupStateText: '退出组',
        buttonColor: "background: #FF001F"
      })
    }
    else {
      this.setData({
        inGroupStateText: '加入组',
        buttonColor: "background: #00A742"
      })
    }
  },

  changeInGroupState: function () {
    var that = this
    var action = ''
    if (!that.data.inGroupState) {
      console.log("本地：加入组", that.data.id)
      action = 'join'
    }
    else {
      console.log("本地：退出组", that.data.id)
      action = 'quit'
    }
    wx.request({
      url: 'https://www.foodiesnotalone.cn/groupService.php',
      data: {
        'opcode': 'changeGroupState',
        'session3rd': wx.getStorageSync('session3rd'),
        'groupId': that.data.id,
        'action': action
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        var currentInGroupState = res.data.currentInGroupState
        that.setData({
          inGroupState: currentInGroupState
        })
        // 设置加入、退出组按钮
        that.updateButtonColor();
      }
    })
  },

  clickAvatar: function (e) {
    var userId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/friend/friend?id=' + userId
    })
  }

})