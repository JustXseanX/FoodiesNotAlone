// pages/index/friends/friends.js
const app = getApp();

Page({
  data: {
    HEARTBEAT_TIME: 55000,
    reconnectTimes: 0,
    reconnectLimit: 5,
    focus: false,
    val: '',
    selected: 0,
    // 选择字母视图滚动的位置id
    scrollIntoView: 'A',
    // 导航字母
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    toView: 5,
    friends: [],
    // {
    //     groupName: 'B',
    //     list:
    //       [
    //         // {
    //         //   friendId: 1,
    //         //   userName: '啊吼',
    //         //   userImg: 'http://img1.imgtn.bdimg.com/it/u=105692044,3597038919&fm=27&gp=0.jpg'
    //         // },
    //         // {
    //         //   friendId: 2,
    //         //   userName:'啊尼玛',
    //         //   userImg: 'http://img1.imgtn.bdimg.com/it/u=105692044,3597038919&fm=27&gp=0.jpg'
    //         // }
    //       ]
    //   },
    groups: []
  },

  onLoad: function () {
    var that = this
    wx.onSocketError(function (res) {
      console.log('本地ws：WebSocket出现错误！')
      setTimeout(that.websocketReconnect, 200, false)
    })
    wx.onSocketClose(function (res) {
      console.log('本地ws：WebSocket已关闭！')
    })
    wx.onSocketMessage(function (res) {
      var obj = JSON.parse(res.data);
      if (obj.opcode == "tips")
        console.log("服务器WebSocket：", obj.text);
      // else if (obj.opcode == "getMessage"){
      //   console.log("收到消息：", obj.content);
      //   //显示消息
      // }
    })
    wx.onSocketOpen(function(res){
      console.log('本地ws：WebSocket已开启！')
      // 更改在线状态
      that.updateOnlineMark();
    })
    // 获取好友列表
    this.getFriendsList()
    // 获取群聊列表
    this.getGroupList()
    // 获取历史消息
    this.getHistoryMessage()
    // 连接websocket
    this.websocketReconnect(true);
  },
  setFocus: function () {
    this.setData({
      focus: !this.data.focus,
      val: ''
    })
  },
  search: function (e) {
    console.log(e.detail.value)
  },
  toView: function (e) {
    let i = parseInt(e.currentTarget.dataset.i) + 2;
    this.setData({
      toView: i
    })
  },
  onShow: function () {

  },
  startChat: function (event) {
    var friendId = event.currentTarget.dataset.id
    var friendName = event.currentTarget.dataset.name
    var friendImg = event.currentTarget.dataset.img

    console.log("本地：正在与朋友聊天，", friendId)
    wx.navigateTo({
      url: '/pages/chat/chat?friendId=' + friendId + '&friendName=' + friendName +'&friendImg=' + friendImg,
    })
  },

  startGroupChat: function (event) {
    var groupId = event.currentTarget.dataset.id
    var groupName = event.currentTarget.dataset.name
    var groupImg = event.currentTarget.dataset.img

    console.log("本地：正在群聊，", groupId)
    wx.navigateTo({
      url: '/pages/groupChat/groupChat?groupId=' + groupId + '&groupName=' + groupName + '&groupImg=' + groupImg,
    })
  },

  onReady: function (){
    // 心跳 
    var that = this
    var timerTem = setInterval(function () {
      wx.sendSocketMessage({
        data: JSON.stringify({ "opcode": "heartbeat" }),
        success: function (res) {
          console.log("本地ws：发送心跳")
        },
        fail: function () {
          console.log("本地ws：连接失败")
          // 断线重连
          //that.websocketReconnect(false)
        }
      })
    }, this.data.HEARTBEAT_TIME)
    
  },
  send: function (){
    wx.navigateTo({
      url: '../circles/sendSayings/sendSayings',
    })
  },

  updateOnlineMark: function(){
    var that = this
    // 更改在线状态
    var pack = {
      'opcode': 'online',
      'session3rd': wx.getStorageSync('session3rd')
    }
    wx.sendSocketMessage({
      data: JSON.stringify(pack),
      success: function (res) {
        console.log("本地ws：上线消息已发给服务器")
      },
      fail: function (res) {
        console.log("本地ws：上线消息发送失败")
        //setTimeout(that.updateOnlineMark, 200)
      }
    })
  },

  websocketReconnect: function(event){
    var that = this
    if (event) {
      console.log("本地ws：ws手动重连中，已重启断线重连")
      this.data.reconnectTimes = 0
    }
    if (this.data.reconnectTimes <= this.data.reconnectLimit) {
      console.log("本地ws：Websocket正在重新链接，第", that.data.reconnectTimes + 1, "次")
      wx.connectSocket({
        url: 'wss://www.foodiesnotalone.cn:2350',
        success: function (res) {
          console.log("本地ws：发送心跳")
          setTimeout(function(){
              wx.sendSocketMessage({
              data: JSON.stringify({ "opcode": "heartbeat" }),
              success: function (res) {
                console.log("本地ws：Websocket断线重连完成, 计数器清零", res)
                that.data.reconnectTimes = 0
              },
              fail: function () {
                console.log("本地ws：Websocket断线重连失败", res)
              }
            })
          }, 500)
        }
      })
      this.setData({
        reconnectTimes: this.data.reconnectTimes + 1
      })
    }
    else{
      console.log("本地ws：ws断线重连超过限制，已停止自动重连")
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getFriendsList()
    this.getGroupList()
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '已刷新'
    })
  },

  getFriendsList: function () {
    console.log("本地：获取好友列表")
    var that = this
    //console.log("s3rd:", wx.getStorageSync('session3rd'));
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'getFriendsList',
        'session3rd': wx.getStorageSync('session3rd')
      },
      method: 'GET',
      success(res) {
        console.log("服务器：好友列表", res.data)
        //var updateGroups = that.data.groups; // 使用js内数据
        var updateFriends = [] // 不使用js内数据
        if (res.data.data)
          updateFriends.push(res.data.data)
        that.setData({ 
          friends: updateFriends
        })
        // console.log(updateFriends)
      },

    })
  },

  getGroupList: function () {
    console.log("本地：获取群聊列表")
    var that = this
    //console.log("s3rd:", wx.getStorageSync('session3rd'));
    wx.request({
      url: 'https://www.foodiesnotalone.cn/groupService.php',
      data: {
        'opcode': 'getGroupList',
        'session3rd': wx.getStorageSync('session3rd')
      },
      method: 'GET',
      success(res) {
        console.log("服务器：群聊列表", res.data)
        //var updateGroups = that.data.groups; // 使用js内数据
        var updateGroups = [] // 不使用js内数据
        if (res.data.data)
          updateGroups.push(res.data.data)
        that.setData({
          groups: updateGroups,
        })
        // console.log(updateGroups)
      },

    })
  },

  getHistoryMessage: function () {
    var that = this
    //接收消息
    console.log("本地：从服务器获取历史消息")
    wx.request({
      url: 'https://www.foodiesnotalone.cn/chat/getMessage.php',
      data: {
        "session3rd": wx.getStorageSync('session3rd'),
        "get_history": true
      },
      method: 'POST',
      success(res) {
        //console.log("服务器：", res.data)
        //显示消息
        console.log("服务器：好友历史消息", res.data)
        var msgList = that.data.msgList
        res.data.data.forEach(function (message) {
          if (message.fromId == app.globalData.userId && message.fromId != message.toId){ // 自己发的消息，且不是自己给自己发的
            // 为空则初始化为数组
            if (!app.globalData.messagesList[message.toId]) {
              app.globalData.messagesList[message.toId] = []
            }
            // 添加
            app.globalData.messagesList[message.toId].push({
              speaker: 'customer',
              contentType: 'text',
              text: message.text
            })
          }
          else{ // 好友发的消息
            // 为空则初始化为数组
            if (!app.globalData.messagesList[message.fromId]){
              app.globalData.messagesList[message.fromId] = []
            }
            // 添加
            app.globalData.messagesList[message.fromId].push({
              speaker: 'server',
              contentType: 'text',
              text: message.text
            })
          }
        })
      }
    })

    // 群组历史消息
    wx.request({
      url: 'https://www.foodiesnotalone.cn/groupService.php',
      data: {
        "opcode": "getHistoryMessage",
        "session3rd": wx.getStorageSync('session3rd')
      },
      method: 'GET',
      success(res) {
        //console.log("服务器：", res.data)
        //显示消息
        console.log("服务器：群聊历史消息", res.data.data)
        var msgList = that.data.msgList
        res.data.data.forEach(function (message) {
          if (message.fromId == app.globalData.userId) { // 自己发的消息
            // 为空则初始化为数组
            if (!app.globalData.groupMessagesList[message.toId]) {
              app.globalData.groupMessagesList[message.toId] = []
            }
            // 添加
            app.globalData.groupMessagesList[message.toId].push({
              speaker: 'customer',
              contentType: 'text',
              text: message.text,
              userImg: message.userImg
            })
          }
          else { // 好友发的消息
            // 为空则初始化为数组
            if (!app.globalData.groupMessagesList[message.toId]) {
              app.globalData.groupMessagesList[message.toId] = []
            }
            // 添加
            app.globalData.groupMessagesList[message.toId].push({
              speaker: 'server',
              contentType: 'text',
              text: message.text,
              userImg: message.userImg
            })
          }
        })
      }
    })
  },
})