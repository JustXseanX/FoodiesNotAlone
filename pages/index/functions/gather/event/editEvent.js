var util = require('../../../../../utils/util.js');

Page({
  data: {
    currentEventId: -1,
    img_url: [],
    title: '',
    content: '',
    People: '',
    Address: '',
    Date: '',
    Time: '12:00',
    people: false,
    where: false,
    isTime: false,
    isDate: false,
    dateStart: '',
    dateEnd: '',
  },
  onLoad: function (options) {
    if ('id' in options) {
      this.setData({
        currentEventId: options.id,
      })
    }
    this.getEventInfo()
    // 设置日期范围
    var limitDays = 7
    var timestamp = Date.parse(new Date());
    var dateStart = util.formatDate(new Date(timestamp))

    var newTimestamp = timestamp + limitDays * 24 * 60 * 60 * 1000;
    var dateEnd = util.formatDate(new Date(newTimestamp))
    this.setData({
      dateStart,
      dateEnd,
      Date: dateStart
    })
  },
  getEventInfo: function () {
    console.log("本地：获取攒局信息")
    var that = this
    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/gather.php',
      data: {
        'opcode': 'getEventInfo',
        'session3rd': wx.getStorageSync('session3rd'),
        'id': that.data.currentEventId
      },
      method: 'GET',
      success(res) {
        console.log("服务器：攒局详细信息", res.data)
        that.setData({
          img_url: res.data.eventInfo.imgsList,
          title: res.data.eventInfo.title,
          content: res.data.eventInfo.detail,
          People: res.data.eventInfo.sumPeople,
          Address: res.data.eventInfo.address,
          Date: res.data.eventInfo.date,
          Time: res.data.eventInfo.time,
        })
        //设置标题栏文字
        wx.setNavigationBarTitle({
          title: res.data.eventInfo.title
        })
      },

    })
  },

  deleteClick: function(){
    var that = this
    console.log("本地：删除攒局")
    wx.showModal({
      title: '提示',
      content: '确认要删除该攒局？',
      success: function (res) {
        wx.request({
          url: 'https://www.foodiesnotalone.cn/functions/gather.php',
          data: {
            'opcode': 'deleteEvent',
            'session3rd': wx.getStorageSync('session3rd'),
            'id': that.data.currentEventId
          },
          method: 'GET',
          success(res) {
            console.log("服务器：删除攒局", res.data)
            wx.showToast({
              title: '删除成功！'
            })
            setTimeout(()=>
              {
                wx.navigateBack({
                  delta: 2
                })
              }
            , 600)
          },
        })
      }
    })
  },

  inputTitle: function (e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },
  inputDetail: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  

      success: function (res) {
        //把每次选择的图push进数组
        let img_url = that.data.img_url;
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          img_url.push(res.tempFilePaths[i])
        }
        that.setData({
          img_url: img_url
        })
        if (img_url.length > 0) {

          if (img_url.length == 3) {

            that.setData({
              hideAdd: 1
            })
          } else {
            console.log(res.tempFilePaths.length)
            that.setData({
              hideAdd: 0
            })
          }
        }
      }
    })
  },

  _isInt: function(str){
    for (var i = 0; i < str.length; i++){
      if (str[i] < '0' || str[i] > '9') return false
    }
    return true
  },
  //发布按钮事件
  save: function () {
    var that = this
    // 获取与检测
    var title = that.data.title
    var detail = that.data.content
    var sumPeople = that.data.People
    var address = that.data.Address
    var date = that.data.Date
    var time = that.data.Time
    if (title == ''){
      wx.showToast({
        title: '标题不能为空！',
        icon: 'none'
      })
      return
    }
    if (sumPeople == '' || !that._isInt(sumPeople)) {
      if (sumPeople == ''){
        wx.showToast({
          title: '人数不能为空！',
          icon: 'none'
        })
      }
      else {
        wx.showToast({
          title: '人数请填写数字！',
          icon: 'none'
        })
      }
      return
    }
    if (date == '') {
      wx.showToast({
        title: '日期不能为空！',
        icon: 'none'
      })
      return
    }
    if (time == '') {
      wx.showToast({
        title: '时间不能为空！',
        icon: 'none'
      })
      return
    }

    var that = this;
    var user_id = wx.getStorageSync('userid')
    that.img_upload()

    wx.request({
      url: 'https://www.foodiesnotalone.cn/functions/gather.php',
      data: {
        'opcode': 'editEvent',
        'eventId': that.data.currentEventId,
        'session3rd': wx.getStorageSync('session3rd'),
        'title' : title,
        'detail' : detail,
        'sumPeople' : sumPeople,
        'address' : address,
        'date' : date,
        'time' : time,
      },
      method: 'POST',
      success(res) {
        console.log("服务器：更新攒局", res.data)
        that.img_upload(res.data.eventId);
        if ('error' in res.data){
          wx.showToast({
            title: '未知错误！',
            icon: 'none'
          })
          return
        }
        if (res.data.result == 'success') {
          wx.showToast({
            title: '创建成功！'
          })
          wx.navigateBack({})
        }
      },
    })
  },
  //图片上传
  //图片上传
  img_upload: function (eventId) {

    let that = this
    let img_url = that.data.img_url
    let img_url_ok = []
    //由于图片只能一张一张地上传，所以用循环
    for (let i = 0; i < img_url.length; i++) {
      console.log('本地：上传图片  ' + img_url[i] + ' 到攒局' + eventId)
      wx.uploadFile({
        //路径填你上传图片方法的地址
        url: 'https://www.foodiesnotalone.cn/uploadImage.php',
        filePath: img_url[i],
        name: 'image',
        formData: {
          'session3rd': wx.getStorageSync('session3rd'),
          'eventId': eventId
        },
        success: function (res) {
          var data = JSON.parse(res.data)
          console.log('服务器：上传完成 ' + res)
          //把上传成功的图片的地址放入数组中
          img_url_ok.push(data.url)
        }
      })
    }
  },
  people: function () {
    this.setData({
      people: true,
    })
  },
  where: function () {
    this.setData({
      where: true,
    })
  },
  isDate: function (e) {
    this.setData({
      isDate: true,
    })
  },
  isTime: function () {
    this.setData({
      isTime: true,
    })
  },
  confirm: function () {// 确定
    this.setData({
      people: false,
      isTime: false,
      where: false,
      isDate: false,
    })
  },

  dateChange(e) {
    this.setData({
      Date: e.detail.value,
    })
  },

  timeChange(e) {
    this.setData({
      Time: e.detail.value,
    })
  },

  peopleChange(e) {
    this.setData({
      People: e.detail.value,
    })
  },
  whereChange(e) {
    this.setData({
      Address: e.detail.value,
    })
  }
})
