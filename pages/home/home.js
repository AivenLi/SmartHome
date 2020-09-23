// pages/home/home.js

var bleCode = require("../../utils/bleErrCode.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 搜索到的蓝牙列表 */
    bleList: [],
    /** 适配器打开成功 */
    openAdapter: false,
    /** 是否搜索到蓝牙设备 */
    hasBle: false,
    /** 正在扫描 */
    isLoading: false,
    /** 错误信息 */
    errData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.openBleAdapter()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

    wx.closeBluetoothAdapter({
      success: function(res) {},
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

    if (!this.data.isLoading) {

      this.openBleAdapter()
    } else {

      wx.stopPullDownRefresh()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /*************************************************************************************************************/

  /**
   * 设置适配器标志
   */
  setOpenAdapter: function(open) {

    this.setData({
      openAdapter: open
    })
  },
  /**
   * 显示正在搜索
   */
  showOnLoading: function() {

    wx.showLoading({
      title: '正在搜索...',
    })
    wx.showNavigationBarLoading()
    this.setData({
      isLoading: true
    })
  },

  /**
   * 隐藏正在搜索
   */
  hideOnLoading: function() {

    wx.hideLoading()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
    this.setData({
      isLoading: false
    })
  },

  /**
   * 打开蓝牙适配器
   */
  openBleAdapter: function() {

    var that = this
    wx.openBluetoothAdapter({
      /** 以主设备的角色 */
      mode: 'central',
      success: res => {
        /** 初始化成功，搜索附近的蓝牙设备 */
        console.log(res)
        that.setOpenAdapter(true)
      },
      fail: err => {

        console.error("初始化蓝牙失败")
        console.error(err)
        let code = err.errCode
        if (code != 0) {

          that.setOpenAdapter(false)
          that.setBLEErrorStr(code)
          that.hideOnLoading()
        } else {

          that.setOpenAdapter(false)
          that.discoveryBLE()
        }
      }
    })
  },

  /**
   * 发现附近的蓝牙设备
   */
  discoveryBLE: function() {

    console.log("搜索蓝牙")
    var that = this
    wx.startBluetoothDevicesDiscovery({

      services: ['FFF0'],
      /** 允许上报同一设备，主要用于更新设备的RSSI */
      allowDuplicatesKey: true,
      /** 立即上报设备信息 */
      interval: 0,
      success: res => {
        /**
         * 当执行成功之后先获取蓝牙列表，然后再获取蓝牙设备信息，最后停止discovery
         */
        that.foundBLEDevices()
        setTimeout(function() {

          that.getBLEDevicesInfo()
        }, 300)
      },
      fail: err => {

        console.error(err)
        let code = err.errCode
        if (code != 0) {

          that.setBLEErrorStr(err.errCode)
          that.hideOnLoading()
          wx.stopBluetoothDevicesDiscovery({
            success: function(res) {},
          })
        } else {

          that.foundBLEDevices()
          setTimeout(function() {

            that.getBLEDevicesInfo()
          }, 300)
        }
      }
    })
  },

  /**
   * 监听寻找新设备的事件
   */
  foundBLEDevices: function() {

    var that = this
    console.log("监听查找蓝牙事件")
    wx.onBluetoothDeviceFound((result) => {

      console.log(result)
    })
  },

  /**
   * 获取蓝牙设备信息
   */
  getBLEDevicesInfo: function() {

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
        let code = err.errCode
        if (code != 0) {

          that.setBLEErrorStr(code)
        }
      },
      complete: cres => {

        that.setData({
          hasBle: mHasBle
        })
        if (!mHasBle) {

          that.setBLEErrorStr(-2)
        }
      }
    })
  },

  /**
   * 连接蓝牙事件
   */
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
        let code = err.errCode
        if (code != 0) {

          that.setBLEErrorStr(code)
        }
        that.setData({
          bleConnected: false
        })
      }
    })
  },

  /** 
   * 错误页面点击重试回调
   */
  tryAgainCallback: function(e) {

    console.log("回调")
  },

  /**
   * 根据蓝牙相关接口返回的错误码获取
   * 相应的错误信息
   */
  setBLEErrorStr: function(code) {

    var title = "errData.errTitle"
    var content = "errData.errContent"
    var errBtn = "errData.errBtn"
    var eTitle = bleCode.getBleErrStr(code)
    var mBtn = ""
    var mContent = ""
    /**
     * 未打开蓝牙需要特殊处理
     */
    console.log("错误码 ")
    console.log(code)
    if (eTitle == bleCode.getBleErrStr(10001)) {

      mBtn = "打开蓝牙后点我"
      mContent = "请打开手机蓝牙，否则不能正常使用本小程序"
    } else {

      mBtn = "点我重试"
    }
    this.setData({
      [title]: eTitle,
      [content]: mContent,
      [errBtn]: mBtn
    })
  }
})