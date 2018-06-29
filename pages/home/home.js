// pages/home/home.js
var username
var sexType = 1
var simg = ''
var stitle = ''
var rtitle = ''
var share_id = ''

var new_app_id
var new_pre_img
var float_img = '../images/float.gif'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app_id: '',
    is_nav: true,
    floatImg: float_img,
    isUse: true
  },
  inputname: function(e) {
    username = e.detail.value
    console.log('用户输入的名字--->' + e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var Page$this = this;
    wx.getSystemInfo({
      success: function(res) {
        var result = Page$this.compareVersion(res.SDKVersion, '2.0.7')
        Page$this.setData({
          isUse: result >= 0 ? true : false
        })
      },
    })

    wx.setNavigationBarTitle({
      title: '人生成绩单'
    })
    var Page$this = this;
    wx.request({
      url: 'https://cj.198254.com/api/v1.game/getAppInfo',
      method: 'POST',
      data: {
        'app_id': 1
      },
      success: function(res) {
        if (res.data.data.more_app_info){
          float_img = res.data.data.more_app_info[0].img
          new_app_id = res.data.data.more_app_info[0].url;
          new_pre_img = res.data.data.more_app_info[0].xcx_img
          if (new_app_id) {
            Page$this.setData({
              is_nav: true,
              app_id: new_app_id
            })
          } else {
            Page$this.setData({
              is_nav: false
            })
          }

          if (float_img) {
            Page$this.setData({
              floatImg: float_img
            })
          }

          var index = Math.floor(Math.random() * 2);
          if (res.data.data && res.data.data.share_ico) {
            var simgs = res.data.data.share_ico;
            var stitles = res.data.data.share_title;
            share_id = res.data.data.share_id
            if (simgs && simgs.length > 1 && stitles && stitles.length > 1) {
              simg = simgs[index]
              stitle = stitles[index]
              rtitle = stitles[2]
            }
          }
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  newApp: function(e) {
    if (!new_app_id) {
      wx.previewImage({
        urls: [new_pre_img],
        current: new_pre_img
      })
    }else{
      wx.navigateToMiniProgram({
        appId: new_app_id
      })
    }
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
        console.log(res.data)
        wx.hideLoading()
        var img = res.data.data.img;
        if (res.data.data) {
          wx.navigateTo({
            url: '../result/result?img=' + img + '&rtitle=' + rtitle + "&share_id=" + share_id
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
  },
  compareVersion: function(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }

    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i])
      var num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }

    return 0
  }

})