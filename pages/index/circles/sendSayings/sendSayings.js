// pages/index/circles/sendSayings/sendSayings.js
//获取应用实例
const app = getApp()

Page({
  data: {
    img_url: [],
    content: ''
  },
  onLoad: function (options) {

  },
  input: function (e) {
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

        if (res.tempFilePaths.length > 0) {

          //图如果满了9张，不显示加图
          if (res.tempFilePaths.length == 9) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }

          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })

        }

      }
    })
  },

  //图片上传
  img_upload: function (sayingId) {
    
    let that = this
    let img_url = that.data.img_url
    let img_url_ok = []
    //由于图片只能一张一张地上传，所以用循环
    for (let i = 0; i < img_url.length; i++) {
      console.log('本地：上传图片  ' + img_url[i] + ' 到说说' + sayingId)
      wx.uploadFile({
        //路径填你上传图片方法的地址
        url: 'https://www.foodiesnotalone.cn/uploadImage.php',
        filePath: img_url[i],
        name: 'image',
        formData: {
          'session3rd': wx.getStorageSync('session3rd'),
          'sayingId': sayingId
        },
        success: function (res) {
          var data = JSON.parse(res.data)
          console.log('服务器：上传完成 ' + data.url)
          console.log(data)
          //把上传成功的图片的地址放入数组中
          img_url_ok.push(data.url)
        }
      })
    }
  },

  sendSayings: function (e) {
    var that = this

    console.log("本地：发送说说：", this.data.content)
    var text = this.data.content;
    if (text == '') {
      wx.showToast({
        title: '消息不可为空！',
        icon: 'none'
      })
      return -1;
    }

    //发送说说
    wx.request({
      url: 'https://www.foodiesnotalone.cn/friendService.php',
      data: {
        'opcode': 'sendSaying',
        'session3rd': wx.getStorageSync('session3rd'),
        'text': text
      },
      method: 'POST',
      success(res) {
        console.log("服务器：", res.data)
        //发送图片
        that.img_upload(res.data['new_saying']['id']);
      }
    })
    
    this.setData({
      sayingContent: ''
    })
    wx.navigateBack({
      delta: 1
    })
  }
})
