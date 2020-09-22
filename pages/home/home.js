// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bleList: [],
    hasBle: false,
    bleConnected: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    wx.openBluetoothAdapter({
      mode: 'central',
      success: res => {

        console.log(res)
        that.setData({
          bleInit: true
        })
        that.discoveryBLE()
      },
      fail: err => {

        console.error("初始化蓝牙失败")
        console.error(err)
        let code = err.errCode
        if (code != 0) {

          wx.showToast({
            image: '../../images/error_icon.png',
            title: '请先打开蓝牙',
          })
          that.setData({
            bleState: false
          })
        } else {

          that.setData({
            bleInit: true
          })
          that.discoveryBLE()
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

  discoveryBLE: function () {

    console.log("搜索蓝牙")
    var that = this

    wx.startBluetoothDevicesDiscovery({
      services:['FFF0'],
      allowDuplicatesKey: false,
      interval: 0,
      success: res => {
        /**
         * 当执行成功之后先获取蓝牙列表，然后再获取蓝牙设备信息，最后停止discovery
         */
        setTimeout(function() {

          that.getBLEDevicesInfo()
        }, 300)
        that.foundBLEDevices()
        setTimeout(function() {
          wx.stopBluetoothDevicesDiscovery({
            success: (res) => {},
          })
        }, 20000)
      },
      fail: err => {

        console.error(err)
      }
    })

  },

  foundBLEDevices: function() {

    var that = this
    console.log("查找蓝牙")
    wx.onBluetoothDeviceFound((result) => {

      console.log(result)
    })
  },

  getBLEDevicesInfo: function () {

    var that = this
    var mHasBle = false
    console.log("获取蓝牙设备信息")
    wx.getBluetoothDevices({
      success: (result) => {

        console.log(result)
        let devices = result.devices
        mHasBle = devices.length <= 0 ? false : true
        that.setData({
          bleList: result.devices
        })
      },
      fail: (err) => {

        console.error(err)
      },
      complete: cres => {

        that.setData({
          hasBle: mHasBle
        })
      }
    })
  },

  connectBle: function(e) {

    console.log("连接蓝牙")
    console.log(e)
    var that = this
    var mdeviceId = e.currentTarget.dataset.deviceid
    console.log(mdeviceId)
    wx.createBLEConnection({
      deviceId: mdeviceId,
      timeout: 5000,
      success: res => {

        console.log("连接成功")
        console.log(res)
        wx.stopBluetoothDevicesDiscovery({
          success: (res) => {},
        })
        wx.navigateTo({
          url: './smart-home/smart-home?deviceId=' + mdeviceId,
        })
      },
      fail: err => {

        console.error("连接失败")
        console.error(err)
        that.setData({
          bleConnected: false
        })
      }
    })
  }
})