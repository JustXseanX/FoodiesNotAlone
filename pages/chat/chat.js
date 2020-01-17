// pages/index/chat/chat.js

const app = getApp();
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;


Page({
  data: {
    MAXLENGTH: 10,
    inputVal: '',
    targetUserId: -1,
    messages: '',
    scrollHeight: '100vh',
    inputBottom: 0,
    msgList: [],
    cusHeadIcon: '',
    serHeadIcon: ''
  },

  onLoad: function (options) { //options里包含了上一页页面传来的参数
    wx.setNavigationBarTitle({      //设置标题栏文字
      title: options.friendName
    })
    if ('friendId' in options && 'friendName' in options && 'friendImg' in options) {
      this.setData({
        targetUserId: options.friendId,
        targetUserName: options.friendName,
        serHeadIcon: options.friendImg
      })
    }
    else {
      console.log("未找到用户")
      wx.navigateBack({})
    }
    // 初始化数据
    if (!app.globalData.messagesList[options.friendId]){
      app.globalData.messagesList[options.friendId] = []
    }
    this.setData({
      msgList: app.globalData.messagesList[options.friendId],  // 从全局变量获取数据
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
    wx.onSocketMessage(function (res) {
      var obj = JSON.parse(res.data)
      if (obj.opcode == "tips")
        console.log("服务器WebSocket：", obj.text)
      else {
        console.log("收到服务器WebSocket未知消息：", obj)
      }

    })
    // 滑动到最底部
    this.scrollToBottom();
  },

  updateMessage: function () {
    var that = this
    //接收消息
    //console.log("本地：从服务器接受消息")
    wx.request({
      url: 'https://www.foodiesnotalone.cn/chat/getMessage.php',
      data: {
        "session3rd": wx.getStorageSync('session3rd'),
        "get_history": false
      },
      method: 'POST',
      success(res) {
        //console.log("服务器：", res.data)
        //显示消息
        if (res.data.data.length > 0) console.log("本地：从服务器接受消息", res.data.data)
        var msgList = that.data.msgList
        res.data.data.forEach(function (message) {
          app.globalData.messagesList[message.fromId].push({
            speaker: 'server',
            contentType: 'text',
            text: message.text
          })
        })
        that.setData({
          msgList: app.globalData.messagesList[that.data.targetUserId]
        })
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
    //计算msg高度
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
    var msgList = that.data.msgList
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      text: that.data.inputVal
    })
    
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
      url: 'https://www.foodiesnotalone.cn/chat/sendMessage.php',
      data: {
        "session3rd": wx.getStorageSync('session3rd'),
        "to": this.data.targetUserId,
        "text": text
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)
      }
    })
    this.setData({
      inputVal: '',
      msgList: msgList
    })
    app.globalData.messagesList[that.data.targetUserId] = msgList;
  },

  toBackClick: function () {
    wx.navigateBack({})
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
})

