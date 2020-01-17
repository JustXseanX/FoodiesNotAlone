// pages/index/self/self.js

const app = getApp()
Page({
  // data: {
  //   name: '暂未使用字段',
  //   image: '暂未使用字段',
  //   preference: ["麻辣", "香辣", "女人", "热腾腾的火锅", "性感的御姐", "超级无敌可爱的萝莉", "炒菜", "窝窝头"],
  //   sex: "男",
  //   motto: 'Hello World',
  // },
  data: {
    name: '暂未使用字段',
    image: '暂未使用字段',
    preference: [],
    sex: '',
    motto: '',
  },

  onLoad: function(options) {
    this.getSelfInfo()
  },

  onPullDownRefresh: function(){
    this.getSelfInfo()
  },

  getSelfInfo: function(){
    var that = this
    console.log("本地：获取用户本人信息")
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'getSelfInfo',
        'session3rd': wx.getStorageSync('session3rd'),
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
          preference: info.preference
        })
      }
    })
  }
})


