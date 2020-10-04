// pages/home/components/debug/debug.js

const errorImg = "../../../../../images/error_icon.png"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 接收到的数据
     */
    receive: {
      type: Array,
      value: []
    },
    /**
     * 服务UUID，每一个服务UUID都包含了
     * 其特征值UUID
     */
    SUUID: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

    /** 是否显示十六进制 */
    hexShow: false,
    /** 是否十六进制发送 */
    hexSend: false,
    /** 要发送的数据 */
    sendData: "",
    /** 显示个用户的数据 */
    sendDataShow: "",
    /** 是否定时发送数据 */
    timingSend: false,
    /** 定时时长(ms) */
    timing: 1000,
    /** 默认定时时长 */
    defaultTiming: 9,
    /** 可选的定时时长 */
    timer: [{
      time: 100
    }, {
      time: 200
    }, {
      time: 300
    }, {
      time: 400
    }, {
      time: 500
    }, {
      time: 600
    }, {
      time: 700
    }, {
      time: 800
    }, {
      time: 900
    }, {
      time: 1000
    }, {
      time: 1500
    }, {
      time: 2000
    }, {
      time: 2500
    }, {
      time: 3000
    }, {
      time: 3500
    }, {
      time: 4000
    }, {
      time: 4500
    }, {
      time: 5000
    }, {
      time: 6000
    }, {
      time: 7000
    }, {
      time: 8000
    }, {
      time: 9000
    }, {
      time: 10000
    }],
    /** 十六进制数据 */
    hexArr: [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 设置是否十六进制显示
     * @param {Event} e 
     */
    hexShowChange: function (e) {

      console.log(e)
      this.setData({
        hexShow: e.detail.value
      })
    },

    /**
     * 设置是否十六进制发送
     * @param {Event} e 
     */
    hexSendChange: function (e) {

      console.log(e)
      this.setData({
        hexSend: e.detail.value
      })
    },

    /**
     * 输入框的值发生改变时事件
     * @param {Event} e 
     */
    inputChange: function (e) {

      console.log(e)
        this.setData({
          sendData: e.detail.value,
          sendDataShow: e.detail.value
        })
    },

    /**
     * 十六进制输入事件
     * @param {Event} e 
     */
    hexInputChange: function(e) {

      console.log(e)
      var hex = this.data.hexArr
      var data = this.data.sendDataShow;
      data = data + hex[e.currentTarget.dataset.index]
      var temp = data.replace(/\s+/g, "")
      if ( temp.length % 2 == 0 ) {
        
        data = data + " "
      }
      this.setData({
        sendData: temp,
        sendDataShow: data
      })
    },

    /**
     * 十六进制输入时的退格事件
     * @param {Event} e 
     */
    hexInputBack: function(e) {

      var data = this.data.sendDataShow
      if ( data.length == 1 ) {

        this.setData({
          sendDataShow: "",
          sendData: ""
        })
      } else if ( data.length > 1 ) {

        var temp = data.substring(0, data.length-1)
        if ( temp.length > 1 && temp.substring(temp.length-1, temp.length) == " " ) {

          temp = temp.substring(0, temp.length-1)
          this.setData({
            sendDataShow: temp
          })
        }
      }
    },

    /**
     * 清空接收区点击事件
     * @param {Event} e 
     */
    clearReceiveClick: function (e) {

      console.log("清空接收区")
    },

    /**
     * 清空发送区点击事件
     * @param {Event} e 
     */
    clearSendClick: function (e) {

      console.log("清空发送区");
      this.setData({
        sendData: "",
        sendDataShow: ""
      })
    },

    /**
     * 设置定时发送数据
     * @param {Event} e 
     */
    timingSendDataClick: function (e) {

      if (this.data.sendData == "") {

        wx.showToast({
          title: '请输入数据',
          image: errorImg
        })
      } else {

        console.log("定时发送数据")
        var times = this.data.timer
        this.setData({
          timingSend: true,
          timing: times[e.detail.value].time
        })
        console.log(this.data.timing)
      }
    },

    /**
     * 关闭定时发送
     * @param {Event} e 
     */
    closeTimingSendDataClick: function (e) {

      console.log("关闭定时发送")
      this.setData({
        timingSend: false
      })
    }
  }
})