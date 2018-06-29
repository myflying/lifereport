// pages/result/result.js
var rtitle = ''
var pre_img = ''
var share_id = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: '../images/def_bg.png',
    is_show : true,
    is_load_done:false,
    is_share : true
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

    pre_img = options.img
    rtitle = options.rtitle
    share_id = options.share_id

    if (options.isShare && options.isShare == 1){
      this.setData({
        is_share : false
      })
    }

    console.log('result img --->' + pre_img)
    wx.setNavigationBarTitle({
      title: '你的人生成绩单',
    })

    wx.showLoading({
      title: '打印中···',
    })

    if (pre_img) {
      // this.setData({
      //   img_url: pre_img
      // })
      wx.getImageInfo({
        src: pre_img,
        success:function(res){
          wx.hideLoading()
          console.log(res)
          Page$this.setData({
            is_load_done:true,
            img_url: res.path
          })
        },
        fail:function(e){
          wx.hideLoading()
        }
      })
    }
  },
  home:function(e){
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: rtitle,
      path: '/pages/result/result?img=' + pre_img + "&rtitle=" + rtitle + "&share_id=" + share_id + "&isShare=1"
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
  },
  saveImg:function(){
    var Page$this = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope:
            'scope.writePhotosAlbum',
            success() {
              Page$this.downimage();
            }
          })
        }else{
          Page$this.downimage();
        }
      },
      fail(err){
        console.log(err)
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("用户一开始拒绝了，我们想再次发起授权")
          console.log('打开设置窗口')
          wx.openSetting({
            success(settingdata) {
              console.log(settingdata)
              if (settingdata.authSetting['scope.writePhotosAlbum']) {
                console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                Page$this.downimage();
              }
              else {
                console.log('获取权限失败，给出不给权限就无法正常使用的提示')
              }
            }
          })
        }
      }
    })
  },
  downimage: function () {
    
    if(pre_img){
      wx.showLoading({
        title: '文件下载中',
      })
      //文件下载
      wx.downloadFile({
        url: pre_img,
        success:
        function (res) {
          console.log(res);
          //图片保存到本地
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              wx.hideLoading()
              console.log("save success--->" + data);
              wx.showToast({
                title: '图片已保存',
              })
            },
            fail: function (err) {
              wx.hideLoading()
              console.log(err);
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                console.log("用户一开始拒绝了，我们想再次发起授权")
                console.log('打开设置窗口')
                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                    }
                    else {
                      console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                    }
                  }
                })
              }
            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '保存失败，请稍后再试',
      })
    }
  }

})