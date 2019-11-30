// pages/index/friends/friends.js
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
    groups: [
      {
        groupName: 'B',
        list:
          [
            // {
            //   friendId: 1,
            //   userName: '啊吼',
            //   userImg: 'http://img1.imgtn.bdimg.com/it/u=105692044,3597038919&fm=27&gp=0.jpg'
            // },
            // {
            //   friendId: 2,
            //   userName:'啊尼玛',
            //   userImg: 'http://img1.imgtn.bdimg.com/it/u=105692044,3597038919&fm=27&gp=0.jpg'
            // }
          ]
      },
      
    ]
  },

  onLoad: function () {
    var that = this
    wx.onSocketError(function (res) {
      console.log('WebSocket出现错误！')
      that.websocketReconnect(false)
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket已关闭！正在尝试重连...')
      that.websocketReconnect(false)
    })
    // 更改在线状态
    var pack = {
      'opcode': 'online',
      'session3rd': wx.getStorageSync('session3rd')
    }
    wx.sendSocketMessage({
      data: JSON.stringify(pack),
      success: function (res) {
        console.log("本地：上线消息已发给服务器")
      }
    })
    // 获取好友列表
    this.getFriendsList();
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
  goDetail: function (e) {
    wx.navigateTo({
      url: 'detail/detail?id=' + e.currentTarget.dataset.id,
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

  onReady: function (){
    // 心跳 
    var timerTem = setInterval(function () {
      wx.sendSocketMessage({
        data: JSON.stringify({ "opcode": "heartbeat" }),
        success: function (res) {
          console.log("本地：发送心跳")
        },
        fail: function () {
          console.log("本地：连接失败")
          // 断线重连
          /*
          wx.connectSocket({
            url: 'wss://www.foodiesnotalone.cn:2350',
            success: function (res) {
              console.log("本地：Websocket正在重新链接", res)
            }
          })
          */
        }
      })
    }, this.data.HEARTBEAT_TIME)
    // websocket接受信息
    wx.onSocketMessage(function (res) {
      var obj = JSON.parse(res.data);
      if (obj.opcode == "tips")
        console.log("服务器WebSocket：", obj.text);
      // else if (obj.opcode == "getMessage"){
      //   console.log("收到消息：", obj.content);
      //   //显示消息
      // }
    })
  },
  send: function (){
    wx.navigateTo({
      url: '../circles/sendSayings/sendSayings',
    })
  },

  websocketReconnect: function(event){
    var that = this
    if (event) {
      console.log("本地：ws手动重连中，已重启断线重连")
      this.data.reconnectTimes = 0;
    }
    if (this.data.reconnectTimes <= this.data.reconnectLimit) {
      wx.connectSocket({
        url: 'wss://www.foodiesnotalone.cn:2350',
        success: function (res) {
          console.log("本地：Websocket正在重新链接，第", that.data.reconnectTimes, "次", res)
        },
        fail: function() {
          console.log("本地：Websocket断线重连失败")
        }
      })
      this.setData({
        reconnectTimes: this.data.reconnectTimes + 1
      })
    }
    else{
      console.log("本地：ws断线重连超过限制，已停止自动重连")
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getFriendsList();
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
      method: 'POST',
      success(res) {
        console.log("服务器：好友列表", res.data)
        //var updateGroups = that.data.groups; // 使用js内数据
        var updateGroups = [] // 不使用js内数据
        if (res.data.data)
          updateGroups.push(res.data.data)
        that.setData({ groups: updateGroups })
        // console.log(updateGroups)
      },

    })
  },
})