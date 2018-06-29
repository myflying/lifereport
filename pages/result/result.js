// pages/result/result.js
var simg = ''
var stitle = ''
var pre_img
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: '',
    is_show : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var Page$this = this;

    wx.getStorage({
      key: 'show_tip',
      success: function (res) {
        var show_tip = res.data;
        console.log(show_tip);
        Page$this.setData({
          is_show: show_tip
        })
      }
    })

    simg = options.simg
    stitle = options.stitle
    pre_img = options.img

    console.log('result img --->' + pre_img)
    wx.setNavigationBarTitle({
      title: '你的人生成绩单',
    })

    if (pre_img) {
      this.setData({
        img_url: pre_img
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: stitle,
      path: '/pages/home/home',
      imageUrl: simg
    }
  },

  showconfig: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;

    //显示
    if (currentStatu == "close") {
      wx.setStorage({
        key: "show_tip",
        data: false
      })
    }
    this.setData({
      is_show : false
    })
  },

  imgShow: function () {
    wx.previewImage({
      urls: [pre_img],
      current: pre_img
    })
  }

})