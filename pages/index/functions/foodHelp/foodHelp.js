// pages/index/functions/foodHelp/foodHelp.js
Page({
  data: {
    preferences: [],
    /*
    {
      id: 0,
      checked: false,
      name: "麻辣",
    },
    {
      id: 1,
      checked: false,
      name: "香辣",
    },
    {
      id: 2,
      checked: false,
      name: "女人",
    },
    {
      id: 3,
      checked: false,
      name: "热腾腾的火锅",
    },
    {
      id: 4,
      checked: false,
      name: "性感的御姐",
    },
    {
      id: 5,
      checked: false,
      name: "超级无敌可爱的萝莉",
    },
    {
      id: 6,
      checked: false,
      name: "炒菜",
    },
    {
      id: 7,
      checked: false,
      name: "窝窝头",
    },
    */
    Restaurant: [],
    //  { img_scr: 'image/icon.jpg', id: '1', name: '华莱士', addr//ess: '川大路', contract: '?', heat: '1234' },
    //  { img_scr: 'image/icon.jpg', id: '1', name: '华莱士', addr//ess: '川大路', contract: '?', heat: '1234' },
    //  { img_scr: 'image/icon.jpg', id: '1', name: '华莱士', addr//ess: '川大路', contract: '?', heat: '1234' },
    //  { img_scr: 'image/icon.jpg', id: '1', name: '华莱士', addr//ess: '川大路', contract: '?', heat: '1234' },
    //  { img_scr: 'image/icon.jpg', id: '1', name: '华莱士', addr//ess: '川大路', contract: '?', heat: '1234' },
    //  { img_scr: 'image/icon.jpg', id: '1', name: '华莱士', addr//ess: '川大路', contract: '?', heat: '1234' },
    //  { img_scr: 'image/icon.jpg', id: '1', name: '华莱士', addr//ess: '川大路', contract: '?', heat: '1234' },
    //  { img_scr: 'image/icon.jpg', id: '1', name: '华莱士', address: '川大路', contract: '?', heat: '1234' },
    depValue: [],
    d_id: [],//游玩项目id集合
  },



  checkbox: function (e) {
    var index1 = e.currentTarget.dataset.index1;//获取当前点击的下标
    var index2 = e.currentTarget.dataset.index2;//获取当前点击的下标
    var preferences = this.data.preferences;//选项集合
    preferences[index1][index2].checked = !preferences[index1][index2].checked;//改变当前选中的checked值
    this.setData({
      preferences: preferences
    });
    // 更新推荐列表
    this.getFoodHelp(this.getCheckedStrings())
  },

  onLoad: function(options){
    this.getRemcommendTags()
    this.getFoodHelp(this.getCheckedStrings())
  },

  getCheckedStrings: function(){
    var res = []
    this.data.preferences.forEach(function (preference){
      var list = []
      preference.forEach(function(prefer) {
        if (prefer.checked) list.push(prefer.name)
      })
      res.push(list)
    })
    return res
  },

  getRemcommendTags: function(){
    var that = this
    console.log("本地：获取推荐标签列表")
    // 获取标签列表
    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/foodHelp.php',
      data: {
        'opcode': 'getTagTable',
        'session3rd': wx.getStorageSync('session3rd')
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        // 格式化并更新本地数据
        var preferences = []
        var id = 0
        res.data.tagTable.forEach(
          function (tagList) {
            var list = []
            tagList.forEach(function (tagName) {
              var tag = {}
              tag.id = id
              tag.name = tagName
              tag.checked = false
              id++
              list.push(tag)
          })
          preferences.push(list)
        })
        that.setData({
          preferences: preferences
        })

      }
    })
  },

  getFoodHelp: function(tags){
    var that = this
    console.log("本地：获取推荐列表", tags)
    wx.showLoading({
      title: '获取中...',
    })
    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/foodHelp.php',
      data: {
        'opcode': 'getFoodHelp',
        'session3rd': wx.getStorageSync('session3rd'),
        'latitude': 30.552659,
        'longitude': 103.992726,
        'tags': JSON.stringify(tags),
      },
      method: 'GET',
      success(res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        console.log("服务器：", res.data)
        if ('error' in res.data) {
          wx.showToast({
            title: '未知错误！',
            icon: 'none'
          })
        }
        else {
          var rests = []
          res.data.storeList.forEach(function (storeInfo) {
            var store = {}
            store.id = storeInfo.id
            store.name = storeInfo.name
            store.address = storeInfo.address
            store.contact = storeInfo.contact
            store.heat = storeInfo.heat
            store.img_src = 'https://www.foodiesnotalone.cn/images/rest/' + storeInfo.image
            rests.push(store)
          })

          console.log('本地：更新店铺列表', rests)
          that.setData({
            Restaurant: rests
          })
          
        }
      }
    })
  },

  details: function (e) {
    var storeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/store/store?storeId=' + storeId,
    })
  },

  onPullDownRefresh: function () {
    this.getFoodHelp(this.getCheckedStrings())
  },
})
