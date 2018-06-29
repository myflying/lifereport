// pages/home/home.js
var username
var sexType = 1
var simg = ''
var stitle = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  inputname: function(e) {
    username = e.detail.value
    console.log('用户输入的名字--->' + e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '人生成绩单'
    })

    wx.request({
      url: 'https://cj.198254.com/api/v1.game/getAppInfo',
      method: 'POST',
      data: {
        'app_id': 1
      },
      success: function (res) {
        //console.log(res.data.data.share_title)
        var index = Math.floor(Math.random() * 2);
        if (res.data.data && res.data.data.share_ico){
          var simgs = res.data.data.share_ico;
          var stitles = res.data.data.share_title;
          if (simgs && simgs.length > 1 && stitles && stitles.length > 1){
            simg = simgs[index]
            stitle = stitles[index]
          }
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })

  },

  radioChange: function(e) {
    sexType = e.detail.value
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  create: function() {
    if (!username) {
      wx.showToast({
        title: '请输入姓名',
      })
      return;
    }

    wx.showLoading({
      title: '人生很长,慢慢等',
    })

    var Page$this = this;
    wx.request({
      url: 'https://cj.198254.com/api/v1.test/setScore',
      method: 'POST',
      data: {
        'app_id': 1,
        'username': username,
        'sex': sexType
      },
      success: function(res) {
        wx.hideLoading()
        var img = res.data.data.img;
        if(res.data.data){
          wx.navigateTo({
            url: '../result/result?img=' + img + '&simg=' + simg + '&stitle='+ stitle
          })
        }
      },
      fail: function(res) {
        wx.hideLoading()
        console.log(res)
      }
    })
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
  }
})