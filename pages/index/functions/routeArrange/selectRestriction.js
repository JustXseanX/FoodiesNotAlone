const app = getApp()

Page({
  data: {
    checkboxArr: [],//部门列表
    // {
    //     checked: false,//是否选中
    //     id: "1",//部门能id
    //     name: "ktv",
    //   },
    //   {
    //     checked: false,//是否选中
    //     id: "2",//部门能id
    //     name: "电影",
    //   },
    //   {
    //     checked: false,//是否选中
    //     id: "3",//部门能id
    //     name: "猫咖",
    //   },
    //   {
    //     checked: false,//是否选中
    //     id: "4",//部门能id
    //     name: "游乐园",
    //   },
    //   {
    //     checked: false,//是否选中
    //     id: "5",//部门能id
    //     name: "火锅",
    //   },
    //   {
    //     checked: false,//是否选中
    //     id: "6",//部门能id
    //     name: "炸鸡",
    //   },
    checkValue: [],
    depValue: [],
    isDep: false,//控制游玩项目的显隐
    isWlt: false,
    budget: '0',
    isTime:false,//显示时间选择
    d_id: [],//游玩项目id集合
    time1: '08:00',//默认起始时间  
    time2: '22:00',//默认结束时间 
  },

  onLoad: function(){
    var that = this
    console.log("本地：获取店铺标签列表")
    // 获取标签列表
    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/routeArrange.php',
      data: {
        'opcode': 'getShopTypeList',
        'session3rd': wx.getStorageSync('session3rd')
      },
      method: 'GET',
      success(res) {
        console.log("服务器：", res.data)
        // 格式化并更新本地数据
        var checkboxArr = []
        var id = 0
        res.data.typeList.forEach(function (typeName){
          var tag = {}
          tag.id = id
          tag.name = typeName
          tag.checked = false
          id++
          checkboxArr.push(tag)
        })
        that.setData({
          checkboxArr: checkboxArr
        })

      }
    })
    
  },

  //控制游玩项目的显隐
  isDep: function () {
    this.setData({
      isDep: true,
    })
  },
  isTime: function () {
    this.setData({
      isTime: true,
    })
  },

  //取消按钮
  cancel: function () {
    this.setData({
      isDep: false,
      isPer: false
    })
  },

  checkbox: function (e) {
    var index = e.currentTarget.dataset.index;//获取当前点击的下标
    var checkboxArr = this.data.checkboxArr;//选项集合
    checkboxArr[index].checked = !checkboxArr[index].checked;//改变当前选中的checked值
    this.setData({
      checkboxArr: checkboxArr
    });
  },
  checkboxChange: function (e) {
    var checkValue = e.detail.value;
    console.log(checkValue)
    this.setData({
      checkValue: checkValue
    });
  },
  confirm: function () {// 确定
    this.setData({
      isDep: false,
      isTime:false,
      isWlt: false
    })
    
  },

  bindTimeChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      time1: e.detail.value,
    })
    if (that.data.time2 < e.detail.value){
      that.setData({
        time2: e.detail.value,
      })
    }
  },
  bindTimeChange2(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      time2: e.detail.value,
    }) 
  },
  getArrange: function(e){
    var data = {}
    data.prefers = []
    this.data.checkboxArr.forEach(function (tagInfo){
      if (tagInfo.checked) data.prefers.push(tagInfo.name)
    })
    data.startTime = this.data.time1
    data.endTime = this.data.time2
    data.budget = this.data.budget
    var dataJson = JSON.stringify(data)
    wx.navigateTo({
      url: './routeArrange?data=' + dataJson,
    })
  },
  isWlt: function () {
    this.setData({
      isWlt: true,
    })
  },
  budgetChange(e) {
    this.setData({
      budget: e.detail.value,
    })
  }

})