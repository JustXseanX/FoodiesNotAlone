// pages/index/chat/chat.js

const app = getApp();
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;


Page({
  data: {
    statusBarHeight: 0,
    fontSizeSetting: 12,
    title: '加载中...',
    MAXLENGTH: 10,
    inputVal: '',
    targetGroupId: -1,
    messages: '',
    scrollHeight: '100vh',
    inputBottom: 0,
    msgList: [],
    cusHeadIcon: ''
  },

  onLoad: function (options) { //options里包含了上一页页面传来的参数
    //获取全局变量 导航栏的高度statusBarHeight
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      fontSizeSetting: app.globalData.fontSizeSetting,
      title: options.groupName //设置标题栏文字
    })
    if ('groupId' in options && 'groupName' in options && 'groupImg' in options) {
      this.setData({
        targetGroupId: options.groupId,
        targetGroupName: options.groupName
      })
    }
    else {
      console.log("未找到群聊")
      wx.navigateBack({})
    }
    // 初始化数据
    if (!app.globalData.groupMessagesList[options.groupId]){
      app.globalData.groupMessagesList[options.groupId] = []
    }
    this.setData({
      msgList: app.globalData.groupMessagesList[options.groupId],  // 从全局变量获取数据
      cusHeadIcon: app.globalData.userInfo.avatarUrl,
    });
    var that = this
    const UPDATE_INTERVAL = 300

    setInterval(function () { //定时更新消息
      that.updateMessage()
    }, UPDATE_INTERVAL)
    
  },

  onReady: function () {
    var that = this
    // wx.onSocketMessage(function (res) {
    //   var obj = JSON.parse(res.data)
    //   if (obj.opcode == "tips")
    //     console.log("服务器WebSocket：", obj.text)
    //   else {
    //     console.log("收到服务器WebSocket未知消息：", obj)
    //   }

    // })
    // 滑动到最底部
    this.scrollToBottom();
  },

  updateMessage: function () {
    var that = this
    //接收消息
    wx.request({
      url: 'https://www.foodiesnotalone.cn/groupService.php',
      data: {
        "opcode": "getMessage",
        "session3rd": wx.getStorageSync('session3rd'),
        "groupId": that.data.targetGroupId
      },
      method: 'GET',
      success(res) {
        // console.log("服务器：", res.data)
        //显示消息
        if (res.data.data.length > 0){
          console.log("本地：从服务器接受群聊消息", res.data.data)
          var msgList = that.data.msgList
          res.data.data.forEach(function (message) {
            var speaker = 'server'
            if (message.fromId == app.globalData.userId) speaker = 'client'
            app.globalData.groupMessagesList[message.toId].push({
              speaker: speaker,
              contentType: 'text',
              text: message.text,
              userImg: message.userImg
            })
          })
          that.setData({
            msgList: app.globalData.groupMessagesList[that.data.targetGroupId]
          })
          // 移动页面到底端
          that.scrollToBottom();
        }
      }
    })

  },

  /**
   * 获取聚焦
   */
  focus: function (e) {
    var that = this
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (that.data.msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    // 计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    var that = this
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (that.data.msgList.length - 1)
    })

  },

  sendClick: function (e) {
    var that = this

    console.log(this.data.inputVal)
    var text = this.data.inputVal
    if (text == '') {
      wx.showToast({
        title: '消息不可为空！',
        icon: 'none'
      })
      return -1
    }
    //发送消息
    console.log("本地：聊天消息已发给服务器")
    wx.request({
      url: 'https://www.foodiesnotalone.cn/groupService.php',
      data: {
        "opcode": "sendMessage",
        "session3rd": wx.getStorageSync('session3rd'),
        "to": this.data.targetGroupId,
        "text": text
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)
        if ('errorCode' in res.data && res.data.errorCode == 0){
          wx.showToast({
            title: '你不是组的成员！',
            icon: 'none'
          })
        }
      }
    })
    this.setData({
      inputVal: ''
    })
    this.scrollToBottom();
  },

  returnClick: function () {
    wx.navigateBack({})
  },

  detailClick: function () {
    var that = this
    wx.navigateTo({
      url: '/pages/group/group?id=' + that.data.targetGroupId
    })
  },

  updateInput: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },

  scrollToBottom: function () {
    var that = this
    this.setData({
      toView: 'msg-' + (that.data.msgList.length - 1),
    })
  },

  clickAvatar: function (e) {
    var that = this
    if (e.currentTarget.dataset.own == 'friend'){
      wx.navigateTo({
        url: '/pages/friend/friend?id=' + that.data.targetGroupId
      })
    }
    else if (e.currentTarget.dataset.own == 'self'){
      wx.navigateTo({
        url: '/pages/friend/friend?id=' + app.globalData.userId
      })
    }
    
  }
})

