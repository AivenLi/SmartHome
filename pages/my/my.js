// pages/my/my.js

Page({

  /**
   * 页面的初始数据
   */
  data: {

    swiperParam: {
      duration: 300,
      current: 0,
    },
    tabbar: [
      {
        title: "LED",
        index: 0
      }, {
        title: "调试",
        index: 1
      }
    ],
    clientHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
/*
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight - 177
        })
      },
    })*/
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

  tabbarClick: function(e) {

    this.setCurrentTab(e.currentTarget.dataset.index)
  },

  swiperChange: function(e) {

    this.setCurrentTab(e.detail.current)
  },

  setCurrentTab: function(index) {

    var current = "swiperParam.current"
    this.setData({
      [current]: index
    })
  }
})