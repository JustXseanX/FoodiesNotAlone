// pages/index/self/self.js

const app = getApp()

var newMotto = "";

Page({
  data: {
    name: '暂未使用字段',
    image: '暂未使用字段',
    preference: [],
    depValue: [],
    isDep: false,
    sex: '',
    motto: '',
    isMottoEdit: false
  },

  onLoad: function(options) {
    this.getSelfInfo()
  },

  onPullDownRefresh: function(){
    this.getSelfInfo()
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '已刷新'
    })
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
  },

  add_index: function () {
    this.setData({
      isDep: true,
    })
  },

  confirm: function () {// 确定
    // 更新信息
    var that = this
    this.setData({
      isDep: false,
    })
    console.log("本地：设置喜好标签")
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'setTags',
        'session3rd': wx.getStorageSync('session3rd'),
        'tags': that.data.preference
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)
      }
    })
  },

  checkbox: function (e) {
    var index = e.currentTarget.dataset.index;//获取当前点击的下标
    var preference = this.data.preference;//选项集合
    preference[index].checked = !preference[index].checked;//改变当前选中的checked值
    this.setData({
      preference: preference
    });
  },

  myCollectionClick: function(e){
    wx.navigateTo({
      url: '/pages/store/storeList?mode=collection',
    })
  },

  myFootstepClick: function (e) {
    wx.navigateTo({
      url: '/pages/store/storeList?mode=history',
    })
  },

  

  myMottoClick: function (e) {
    // 初始化newMotto
    newMotto = this.data.motto
    // 显示界面
    this.setData({
      isMottoEdit: true
    })
  },
  
  mottoChange: function (e) {
    newMotto = e.detail.value
  },

  mottoConfirmClick: function (e) {
    var that = this
    console.log("本地：设置个性签名", newMotto)
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'setMotto',
        'session3rd': wx.getStorageSync('session3rd'),
        'motto': newMotto
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)
        that.getSelfInfo()
        that.setData({
          isMottoEdit: false
        })
      }
    })
    
  },
})


