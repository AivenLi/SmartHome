// pages/home/smart-home/smart-home.js

/**
 * @Author AivenLi
 * @Date 2020-9-22
 * BLE收发数据
 */
/**
 * 2020-9-22注：
 *    根据微信小程序开发文档，当连接到BLE之后，需要按顺序做以下事情：
 *        1. wx.getBLEDeviceServices， 根据设备ID获取设备服务UUID列表。
 *    该UUID列表记录了哪些UUID是主服务（isPrimary)。
 *        2. wx.getBLEDeviceCharacteristics， 根据设备ID以及UUID获取该服务
 *    的详细信息。再properties字段中可以得到该服务UUID是否具有读写权限以及订阅
 *    （notify）等功能。
 *        3. 读写数据（还没做）
 *    猜想：
 *         根据第二步来得到服务UUID的读写权限以及订阅功能，如果该服务UUID同时有读写权限和能
 *    够订阅功能，那么该服务UUID即为小程序与BLE通信的UUID。
 *         根据测试结果（汇承HC-08）得到三组服务UUID：
 *         1. 0000180A-0000-1000-8000-00805F9B34FB（所有子服务UUID只有读权限）
 *         2. 0000FFF0-0000-1000-8000-00805F9B34FB（各种权限都有，但同一子UUID只有一个权限）
 *         3. 0000FFE0-0000-1000-8000-00805F9B34FB（只有一个子UUID且同时拥有读写、订阅权限，而且和
 *    汇承HC-08文档说明一致）
 *    2020-9-23 00:35:45注：可以发送消息，但是还不能接收消息。
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {

    deviceId: "",
    servicesUUID:[],
    recv: "",
    characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB',
    serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    var mDeviceId = options.deviceId
    console.log(options)
    this.setData({
      deviceId: options.deviceId
    })
    console.log("获取UUDID")
    wx.getBLEDeviceServices({
      deviceId: mDeviceId,
      success: res => {

        console.log(res)
        that.setData({
          servicesUUID: res.services
        })
        setTimeout(function() {
          that.getBLECharaceter()
          that.notifyBLE()
        }, 100)
      },
      fail: err => {

        console.error(err)
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

    var that = this
    wx.closeBLEConnection({
      deviceId: that.data.deviceId,
    })
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

  getBLECharaceter: function() {

    var that = this
    var UUIDS = that.data.servicesUUID
    console.log("获取服务UUID")
    for ( let i = 0, len = UUIDS.length; i < len; ++i ) {

      console.log("第" + i + "次")
      wx.getBLEDeviceCharacteristics({
        deviceId: that.data.deviceId,
        serviceId: UUIDS[i].uuid,
        success: res => {

          console.log(res)
        },
        fail: err => {

          console.error(err)
        }
      })
    }
  },

  notifyBLE: function() {

    var that = this
    console.log("开始订阅消息")
    wx.notifyBLECharacteristicValueChange({
      characteristicId: that.data.characteristicId,
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      state: true,
      success: res => {

        console.log("订阅消息成功")
        console.log(res)
        that.onBLECharaecter()
      },
      fail: err => {

        console.log("订阅消息失败")
        console.log(err)
      }
    })
  },

  onBLECharaecter: function() {

    var that = this
    wx.onBLECharacteristicValueChange((result) => {

      console.log("接受到数据")
      console.log(result)
      that.readDataFromBle()
    })
  },

  readDataFromBle: function() {

    var that = this
    wx.readBLECharacteristicValue({
      characteristicId: that.data.characteristicId,
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      success: res => {

        console.log("来自BLE消息")
        console.log(res)
      },
      fail: err => {

        console.error("来自BLE消息")
        console.error(err)
      }
    })
  },

  sendDataToBLE: function(e) {

    var that = this
    var x = new ArrayBuffer(2)
    var dataView = new DataView(x)
    dataView.setUint8(0, 49)
    wx.writeBLECharacteristicValue({
      characteristicId: that.data.characteristicId,
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      value: x,
      success: res => {

        console.log(res)
      },
      fail: err => {

        console.error(err)
      }
    })
  },
})