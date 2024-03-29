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
 *    2020-9-23 00:35:45注：
 *         可以发送消息，但是还不能接收消息。
 *    2020-9-24 00:12注：
 *        已经可以收发消息。流程如下：
 *        wx.getBLEDeviceCharacteristics ==> wx.notifyBLECharacteristicValueChange ==>
 *    wx.readBLECharacteristicValue ==> wx.onBLECharacteristicValueChange
 *    2020-9-28 22:20:45注：
 *        点击定时之后不能立即显示倒计时，过了一秒底层回传数据回来才会显示，我在点击事件回调设置了
 *    但还是不能立即显示，尚不知原因。
 *    2020-9-28 22:26:37注：
 *        提莫的，先设置hasTiming后设置timingSeconds不能立刻显示，反过来就可以了。
 *    2020-9-28 22:32:15注：
 *        发现更严重的问题，如果快速切换tabbar（swiper实现），然后程序current会疯狂切换导致页面
 *    也疯狂切换，今天就到这里，我想今天早点睡。^_^
 */

var ledP = require("../../../utils/protocol.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 当前显示哪个tab */
    current: 0,
    /** 切换tab的时间 */
    duration: 300,
    /** 两个tab页面 */
    tabbar: [{
      title: "LED",
      index: 0
    }, {
      title: "调试",
      index: 1
    }],
    /** 当前连接的ble设备信息（name，deviceId， RSSI） */
    ble: {},
    /** 设备ID，由底层页面传递 */
    deviceId: "",
    /** 蓝牙服务UUID列表 */
    servicesUUID: [],
    /** 
     * 可用的特征值UUID，可用是指read、write和notify均为true。
     * groupUUID结构：
     *               [
     *                  { SUUID: "123", CUUID: "321"},
     *                  { SUUID: "456", CUUID: "654"}
     *               ]
     */
    groupUUID: [],
    /** 使用哪一组服务UUID和特征值UUID进行通信 */
    uIndex: 0,
    /** 当前使用的蓝牙特征值UUID */
    characteristicId: '0000FFE1-0000-1000-8000-00805F9B34FB',
    /** 蓝牙特征值对应服务的UUID */
    serviceId: '0000FFE0-0000-1000-8000-00805F9B34FB',
    /** 正在显示加载框框 */
    mIsLoading: false,
    /** 连接状态 */
    connected: true,
    /*************************************************/
    /** led状态 */
    ledOn: false,
    /** 是否有定时 */
    hasTiming: false,
    /** 定时时长 */
    timingSeconds: 0,
    /** 定时执行的动作 */
    timingAction: 0,
    /** 订阅特征值UUID状态 */
    notifyStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    console.log(JSON.parse(options.ble))
    this.myShowLoading("正在初始化...")
    this.setData({
      ble: JSON.parse(options.ble),
      deviceId: that.data.ble.deviceId
    })
    wx.setNavigationBarTitle({
      title: that.data.ble.localName + '（已连接）',
    })
    /**
     * 监听蓝牙连接状态
     */
    wx.onBLEConnectionStateChange((result) => {

      if (!result.connected) {

        that.setData({
          connected: false
        })
        that.myHideLoading()
        wx.setNavigationBarTitle({
          title: that.data.ble.localName + '（已断开）',
        })
        wx.showToast({
          title: "已断开连接",
          image: "../../../images/error_icon.png"
        })
      }
    })
    that.myHideLoading()
    that.myShowLoading("获取服务UUID")
    console.log("获取UUID")
    wx.getBLEDeviceServices({

      deviceId: that.data.ble.deviceId,
      success: res => {

        console.log(res)
        that.setData({
          servicesUUID: res.services
        })
        console.log("得到的服务UUID")
        console.log(that.data.servicesUUID)
        setTimeout(function () {
          that.myHideLoading()
          that.myShowLoading("获取特征值UUID")
          that.getBLECharaceter()
        }, 100)
      },
      fail: err => {

        that.myHideLoading()
        wx.showToast({
          title: err.errMsg,
          image: "../../../images/error_icon.png"
        })
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
    this.myHideLoading()
    wx.offBLECharacteristicValueChange()
    wx.offBLEConnectionStateChange()
    wx.closeBLEConnection({
      deviceId: that.data.ble.deviceId,
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

  getBLECharaceter: function () {

    var that = this
    console.log("获取服务UUID")
    var gIndex = 0
    for (let i = 0, len = that.data.servicesUUID.length; i < len; ++i) {

      if (that.data.servicesUUID[i].isPrimary) {

        console.log("第" + i + "次")
        wx.getBLEDeviceCharacteristics({

          deviceId: that.data.ble.deviceId,
          serviceId: that.data.servicesUUID[i].uuid,
          success: res => {

            console.log(res)
            for (let j = 0, clen = res.characteristics.length; j < clen; ++j) {

              let read = res.characteristics[j].properties.read
              let write = res.characteristics[j].properties.write
              let notify = res.characteristics[j].properties.notify
              let groupCSUUID = "groupUUID[" + gIndex + "].SUUID"
              let groupCCUUID = "groupUUID[" + gIndex + "].CUUID"
              console.log("读写订阅" + read + "," + write + "," + notify)
              if (read && write && notify) {

                that.setData({

                  [groupCCUUID]: res.characteristics[j].uuid,
                  [groupCSUUID]: that.data.servicesUUID[i].uuid
                  //serviceId: UUIDS[i].uuid,
                  //characteristicId: res.characteristics[j].uuid
                })
                gIndex += 1
                console.log("得到的特征值UUID")
                console.log(that.data.groupUUID)
              }
            }
            if (i === (len - 1)) {

              console.log("可用的UUID")
              console.log(that.data.groupUUID)
              that.myHideLoading()
              if (that.data.groupUUID.length <= 0) {

                that.myShowToast("无可用的UUID")
              } else {

                that.notifyBLE(that.data.uIndex)
              }
            }
          },
          fail: err => {

            console.log("读取特征值UUID错误")
            console.error(err)
          }
        })
      }
    }
  },

  /**
   * 订阅BLE特征值UUID
   * @param {Number} mIndex 
   */
  notifyBLE: function (mIndex) {

    var that = this
    that.myShowLoading("开始订阅消息" + mIndex)
    console.log("开始订阅消息")
    wx.notifyBLECharacteristicValueChange({
      characteristicId: that.data.groupUUID[mIndex].CUUID,
      deviceId: that.data.ble.deviceId,
      serviceId: that.data.groupUUID[mIndex].SUUID,
      state: true,
      success: res => {

        console.log("订阅消息成功")
        console.log(res)
        that.myHideLoading()
        wx.showToast({
          title: '订阅成功',
        })
        /** 订阅成功，发送查询指令以初始化界面 */
        setTimeout(function () {
          that.sendDataToBLE(ledP.getLedStatus())
        }, 50)
        setTimeout(function() {
          that.setData({
            notifyStatus: true
          })
        }, 300)
        that.readDataFromBle()
      },
      fail: err => {

        that.myHideLoading()
        console.log("订阅消息失败")
        console.log(err)
        if (mIndex <= (that.data.groupUUID.length - 1)) {

          that.setData({
            uIndex: that.data.uIndex + 1
          })
          that.notifyBLE(that.data.uIndex)
        } else {

          that.showToast("无法进行通信")
        }
      }
    })
  },

  /**
   * 读取BLE特征值
   */
  readDataFromBle: function () {

    var that = this
    var uIndex = that.data.uIndex
    wx.readBLECharacteristicValue({
      characteristicId: that.data.groupUUID[uIndex].CUUID,
      deviceId: that.data.ble.deviceId,
      serviceId: that.data.groupUUID[uIndex].SUUID,
      success: res => {

        console.log("来自BLE消息（成功）")
        console.log(res)
        that.onBLECharaecter()
      },
      fail: err => {

        console.error("来自BLE消息（失败）")
        console.error(err)
      }
    })
  },

  /**
   * 监听BLE特征值改变
   */
  onBLECharaecter: function () {

    var that = this
    wx.onBLECharacteristicValueChange((result) => {

      console.log("接受到数据")
      var ledData = ledP.parseData(result.value).split(",");
      console.log(ledData)
      if (ledData.length > 0 && ledData.length % 5 == 0) {

        for (let i = 0, len = ledData.length; i < len; i = i + 5) {

          let tempData = []
          for (let j = i; j < 5 + i; ++j) {

            tempData.push(ledData[j])
          }
          that.paramCmdData(tempData)
        }
      }
    })
  },

  /**
   * 解析底层回传的数据并作出相应的动作
   * @param {Array} ledData 数据帧
   */
  paramCmdData: function (ledData) {

    var that = this
    console.log("解析数据")
    console.log(ledData)
    if (ledData.length == 5 && ledData[0] == "04" && ledData[4] == "08") {

      var cmd = ledData[1]
      if (cmd == "00") {

        that.setData({
          ledOn: false
        })
      } else if (cmd == "01") {

        that.setData({
          ledOn: true
        })
      } else if (cmd == "32" || cmd == "33") {

        var h = parseInt(ledData[2], 16)
        var l = parseInt(ledData[3], 16)
        var s = parseInt((h * 256 + l))
        var action = cmd == "32" ? 0 : 1
        console.log("开灯定时", action)
        if (s == 0) {

          that.setData({
            hasTiming: false
          })
        } else {

          that.setData({
            timingAction: action, 
            timingSeconds: s,
            hasTiming: true,
          })
        }
      } else if (cmd == "34") {

        wx.showToast({
          title: '取消定时任务',
        })
        that.setData({
          hasTiming: false
        })
      }
    }
  },

  /**
   * 发送数据给蓝牙设备
   * @param {ArrayBuffer} ledProtocolData 控制协议数组
   */
  sendDataToBLE: function (ledProtocolData) {

    var that = this
    var uIndex = that.data.uIndex
    console.log("发送数据")
    console.log(ledProtocolData)
    wx.writeBLECharacteristicValue({
      characteristicId: that.data.groupUUID[uIndex].CUUID,
      deviceId: that.data.ble.deviceId,
      serviceId: that.data.groupUUID[uIndex].SUUID,
      value: ledProtocolData,
      success: res => {

        console.log(res)
        wx.readBLECharacteristicValue({
          characteristicId: that.data.groupUUID[uIndex].CUUID,
          deviceId: that.data.ble.deviceId,
          serviceId: that.data.groupUUID[uIndex].SUUID,
          success: res => {
            console.log("读取数据")
            console.log(res)
          }
        })
      },
      fail: err => {

        console.error(err)
        that.myShowToast("发送数据失败")
      }
    })
  },

  /**
   * 弹窗提示
   */
  myShowToast: function (mTitle) {

    wx.showToast({
      title: mTitle,
      image: "../../../images/error_icon.png"
    })
  },
  /**
   * 显示加载框框
   */
  myShowLoading: function (mTitle) {

    if (!this.data.mIsLoading) {

      wx.showLoading({
        title: mTitle,
      })
      this.setData({
        mIsLoading: true
      })
    }
  },

  /**
   * 隐藏加载框框
   */
  myHideLoading: function () {

    if (this.data.mIsLoading) {

      wx.hideLoading()
      this.setData({
        mIsLoading: false
      })
    }
  },

  /**
   * 点击右上方的tab事件
   * @param {Event} e
   */
  tabbarClick: function (e) {

    console.log("点击切换")
    this.setCurrentTab(e.currentTarget.dataset.index)
  },

  /**
   * 左右滑动切换tab
   * @param {Event} e
   */
  swiperChange: function (e) {

    console.log("滑动切换")
    this.setCurrentTab(e.detail.current)
  },

  /**
   * 设置当前页面
   * @param {Number} index 第几页
   */
  setCurrentTab: function (index) {

    this.setData({
      current: index
    })
  },

  /**
   * 定时关闭回调
   * @param {Event} e 
   */
  timingClose: function (e) {

    console.log("定时开启sdfsd")
    console.log(e)
    this.setData({
      timingAction: 0,
      timingSeconds: parseInt(e.detail.seconds),
      hasTiming: true,
    })
    this.sendDataToBLE(ledP.setTiming(0, e.detail.seconds))
  },

  /**
   * 定时开启回调
   * @param {Event} e 
   */
  timingOpen: function (e) {

    console.log("定时关闭sdfsdf")
    console.log(e)
    this.setData({
      timingAction: 1,
      timingSeconds: parseInt(e.detail.seconds),
      hasTiming: true,
    })
    this.sendDataToBLE(ledP.setTiming(1, e.detail.seconds))
  },

  /**
   * 取消定时回调
   * @param {Event} e 
   */
  timingCancel: function (e) {

    console.log("取消定时sdfs")
    this.setData({
      hasTiming: false
    })
    this.sendDataToBLE(ledP.cancelTiming())
  },

  /**
   * 改变LED状态回调
   * @param {Event} e 
   */
  changeLedStatus: function (e) {

    console.log("改变LED回调")
    this.sendDataToBLE(ledP.setLedStatus(!this.data.ledOn))
    this.setData({
      ledOn: !this.data.ledOn
    })
  }
})