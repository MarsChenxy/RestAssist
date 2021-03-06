// pages/operation/operation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaId: undefined,
    areaName: '',
    priority: '',
    addUrl: "http://127.0.0.1:8080/RestAssis/superadmin/addarea",
    editUrl: "http://127.0.0.1:8080/RestAssis/superadmin/editarea",
    imageUrl: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.areaId != undefined) {
      this.setData({
        areaId: options.areaId
      })
    } else {
      return
    }
    wx.request({
      url: "http://127.0.0.1:8080/RestAssis/superadmin/getareabyid",
      data: { "areaId": options.areaId },
      method: 'GET',
      success: function (res) {
        var area = res.data.area;
        if (area == undefined) {
          var toastText = '获取数据失败' + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000
          });
        } else {
          that.setData({
            areaName: area.areaName,
            priority: area.priority,
            imageUrl: "http://127.0.0.1:8080/RestAssis/superadmin/getimage/" + area.areaId
          });

        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    var url = that.data.addUrl;
    var getimageUrl = that.data.imageUrl;
    if (that.data.areaId != undefined) {
      formData.areaId = that.data.areaId;
      formData.image = that.data.image;
      url = that.data.editUrl;
    }
    wx.request({
      url: url,
      data: JSON.stringify(formData),
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var thisid = res.data.areaId;
        if (getimageUrl.indexOf("http://127.0.0.1:8080/RestAssis") == -1) {
          wx.uploadFile({
            url: 'http://127.0.0.1:8080/RestAssis/superadmin/upload/' + thisid,
            filePath: getimageUrl,
            name: 'fileup',
            success: function (res) {
              console.log("上传图片成功");
            }
          })
        }

        var result = res.data.success;
        var toastText = "操作成功!";
        if (result!= true) {
          result.log("result不是true");
          toastText = "操作失败" + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000
          });
        }else{
          wx.redirectTo({
            url: '../list/list'
          })
        }
      
         
      }
    })

  },
  uploadImage: function () {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        that.setData({
          imageUrl: res.tempFilePaths[0]
        });
      }
    })
  }
})