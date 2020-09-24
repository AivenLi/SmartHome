// pages/home/home.js

var bleCode = require("../../utils/bleErrCode.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 搜索到的蓝牙列表 */
    bleList: [],
    /** 适配器标识符 */
    openAdapter: true,
    /** 扫描状态标识符*/
    discover: false,
    /** 下拉刷新标志 */
    isRefresh: false,
    /** 错误信息 */
    errData: {
      title: "蓝牙设备未打开，请打开蓝牙设备，如已打开，请点击重新搜索",
      errBtn: "搜索蓝牙设备"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    wx.onBluetoothAdapterStateChange((result) => {

      console.log("监听适配器状态")
      console.log(result)
      that.setData({
        openAdapter: result.available,
        discover: result.discovering
      })
    })
    this.openBleAdapter()
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

    wx.closeBluetoothAdapter({
      success: function (res) {},
    })
    wx.offBluetoothAdapterStateChange(callback)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    /**
     * 如果正在搜索或适配器打开失败，则不搜索
     */
    if (this.data.discover) {

      console.log("正在搜索")
      wx.stopPullDownRefresh()
    } else {

      this.setData({
        isRefresh: true
      })
      wx.showNavigationBarLoading()
      this.discoveryBLE()
    }
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

  /*************************************************************************************************************/

  /**
   * 设置适配器标志
   */
  setOpenAdapter: function (open) {

    this.setData({
      openAdapter: open
    })
  },

  /**
   * 打开蓝牙适配器
   */
  openBleAdapter: function () {

    var that = this
    wx.openBluetoothAdapter({
      /** 以主设备的角色 */
      mode: 'central',
      success: res => {
        console.log("打开蓝牙适配器成功")
        console.log(res)
        that.setOpenAdapter(true)
        that.discoveryBLE()
      },
      fail: err => {

        console.error("打开蓝牙适配器失败")
        console.error(err)
        let code = err.errCode
        if (code != 0) {

          that.setOpenAdapter(false)
        } else {

          that.setOpenAdapter(true)
          that.discoveryBLE()
        }
      }
    })
  },

  /**
   * 发现附近的蓝牙设备
   */
  discoveryBLE: function () {

    console.log("搜索蓝牙")
    var that = this
    wx.startBluetoothDevicesDiscovery({

     // services: ['FFF0'],
      /** 允许上报同一设备，主要用于更新设备的RSSI */
      allowDuplicatesKey: true,
      /** 立即上报设备信息 */
      interval: 500,
      success: res => {
        /**
         * 当执行成功之后先获取蓝牙列表，最后停止discovery
         */
        that.foundBLEDevices()
        setTimeout(function () {

          console.log("停止搜索")
          wx.stopBluetoothDevicesDiscovery({
            success: (res) => {},
          })
          wx.offBluetoothDeviceFound()
        }, 30000)
      },
      fail: err => {

        console.error("搜索失败")
        console.error(err)
        let code = err.errCode
        if (code != 0) {

          wx.stopBluetoothDevicesDiscovery({
            success: function (res) {},
          })
          wx.offBluetoothDeviceFound()
        } else {

          that.foundBLEDevices()
        }
      }
    })
  },

  /**
   * 监听寻找新设备的事件
   */
  foundBLEDevices: function () {

    var that = this
    console.log("监听查找蓝牙事件")
    if (this.data.isRefresh) {

      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }
    wx.onBluetoothDeviceFound((result) => {

      console.log("监听事件")
      console.log(that.data.discover)
      console.log(result)
      that.setData({
        bleList: result.devices
      })
    })
  },

  /**
   * 点击停止搜索事件
   */
  stopDicoveryClick: function(e) {

    var that = this
    if ( this.data.discover ) {

      wx.stopBluetoothDevicesDiscovery({
        success: (res) => {
          that.setData({
            discover: false
          })
        },
      })
      wx.offBluetoothDeviceFound(function() {
        that.setData({
          discover: false
        })
      })
    }
  },

  /**
   * 连接蓝牙事件
   */
  connectBle: function (e) {

    wx.showLoading({
      title: '正在连接',
    })
    console.log("连接蓝牙")
    console.log(e)
    var that = this
    var mdeviceId = e.currentTarget.dataset.item.deviceId
    console.log(mdeviceId)
    wx.createBLEConnection({
      deviceId: mdeviceId,
      timeout: 5000,
      success: res => {
        /** 连接成功，停止搜索和监听事件 */
        console.log("连接成功")
        console.log(res)
        wx.offBluetoothDeviceFound()
        wx.stopBluetoothDevicesDiscovery({
          success: (res) => {},
        })
        wx.navigateTo({
          url: './smart-home/smart-home?ble=' + JSON.stringify(e.currentTarget.dataset.item),
        })
      },
      fail: err => {

        console.error("连接失败")
        console.error(err)
        let code = err.errCode
        if (code != 0) {

          wx.showToast({
            title: bleCode.getBleErrStr(code),
            image: "../../images/error_icon.png"
          })
        }
      },
      complete: cres => {

        wx.hideLoading()
      }
    })
  },

  /** 
   * 错误页面点击重试回调
   */
  tryAgainCallback: function (e) {

    this.openBleAdapter()
  },
})