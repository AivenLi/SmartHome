// pages/home/components/led/led.js

var protocol = require("../../../../utils/protocol.js")

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * LED状态
     */
    status: {
      type: Boolean,
      value: false
    },
    /**
     * 是否启用定时
     */
    timing: {
      type: Boolean,
      value: false
    },
    /**
     * 定时还剩余多少秒
     */
    seconds: {
      type: Number,
      value: 0
    },
    /**
     * 定时的动作：开(1)/关(0)灯
     */
    action: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ledOnImg: "../../../../images/led_on.png",
    ledOffImg: "../../../../images/led_off.png",
    timer: [
      [
        {
          time: "0时", 
          index: 0
        }, {
          time: "1时",
          index: 1
        }, {
          time: "2时",
          index: 2
        }, {
          time: "3时",
          index: 3
        }, {
          time: "4时",
          index: 4
        }, {
          time: "5时",
          index: 5
        }, {
          time: "6时",
          index: 6
        }, {
          time: "7时",
          index: 7
        }, {
          time: "8时",
          index: 8
        }, {
          time: "9时",
          index: 9
        }, {
          time: "10时",
          index: 10
        }, {
          time: "11时",
          index: 11
        }, {
          time: "12时",
          index: 12
        }, {
          time: "13时",
          index: 13
        }, {
          time: "14时",
          index: 14
        }, {
          time: "15时",
          index: 15
        }, {
          time: "16时",
          index: 16
        }, {
          time: "17时",
          index: 17
        }/*, {
          time: "18时",
          index: 18
        }, {
          time: "19时",
          index: 19
        }, {
          time: "20时",
          index: 20
        }, {
          time: "21时",
          index: 21
        }, {
          time: "22时",
          index: 22
        }, {
          time: "23时",
          index: 23
        }, {
          time: "24时",
          index: 24
        }, {
          time: "25时",
          index: 25
        }, {
          time: "26时",
          index: 26
        }, {
          time: "27时",
          index: 27
        }, {
          time: "28时",
          index: 28
        }, {
          time: "29时",
          index: 29
        }, {
          time: "30时",
          index: 30
        }, {
          time: "31时",
          index: 31
        }, {
          time: "32时",
          index: 32
        }, {
          time: "33时",
          index: 33
        }, {
          time: "34时",
          index: 34
        }, {
          time: "35时",
          index: 35
        }, {
          time: "36时",
          index: 36
        }, {
          time: "37时",
          index: 37
        }, {
          time: "38时",
          index: 38
        }, {
          time: "39时",
          index: 39
        }, {
          time: "40时",
          index: 40
        }, {
          time: "41时",
          index: 41
        }, {
          time: "42时",
          index: 42
        }, {
          time: "43时",
          index: 43
        }, {
          time: "44时",
          index: 44
        }, {
          time: "45时",
          index: 45
        }, {
          time: "46时",
          index: 46
        }, {
          time: "47时",
          index: 47
        }, {
          time: "48时",
          index: 48
        }*/ /** 根据计算，2字节的数据最多可以定时65535秒 = 18小时12分5秒种*/
      ], [
        { time: "0分", index: 0 }, { time: "1分", index: 1 }, { time: "2分", index: 2 }, { time: "3分", index: 3 }, { time: "4分", index: 4 }, { time: "5分", index: 5 }, { time: "6分", index: 6 }, { time: "7分", index: 7 }, { time: "8分", index: 8 }, { time: "9分", index: 9 }, { time: "10分", index: 10 }, { time: "11分", index: 11 }, { time: "12分", index: 12 }, { time: "13分", index: 13 }, { time: "14分", index: 14 }, { time: "15分", index: 15 }, { time: "16分", index: 16 }, { time: "17分", index: 17 }, { time: "18分", index: 18 }, { time: "19分", index: 19 }, { time: "20分", index: 20 }, { time: "21分", index: 21 }, { time: "22分", index: 22 }, { time: "23分", index: 23 }, { time: "24分", index: 24 }, { time: "25分", index: 25 }, { time: "26分", index: 26 }, { time: "27分", index: 27 }, { time: "28分", index: 28 }, { time: "29分", index: 29 }, { time: "30分", index: 30 }, { time: "31分", index: 31 }, { time: "32分", index: 32 }, { time: "33分", index: 33 }, { time: "34分", index: 34 }, { time: "35分", index: 35 }, { time: "36分", index: 36 }, { time: "37分", index: 37 }, { time: "38分", index: 38 }, { time: "39分", index: 39 }, { time: "40分", index: 40 }, { time: "41分", index: 41 }, { time: "42分", index: 42 }, { time: "43分", index: 43 }, { time: "44分", index: 44 }, { time: "45分", index: 45 }, { time: "46分", index: 46 }, { time: "47分", index: 47 }, { time: "48分", index: 48 }, { time: "49分", index: 49 }, { time: "50分", index: 50 }, { time: "51分", index: 51 }, { time: "52分", index: 52 }, { time: "53分", index: 54 }, { time: "55分", index: 55 }, { time: "56分", index: 56 }, { time: "57分", index: 57 }, { time: "58分", index: 58 }, { time: "59分", index: 59 }
      ], [
        { time: "0秒", index: 0 }, { time: "1秒", index: 1 }, { time: "2秒", index: 2 }, { time: "3秒", index: 3 }, { time: "4秒", index: 4 }, { time: "5秒", index: 5 }, { time: "6秒", index: 6 }, { time: "7秒", index: 7 }, { time: "8秒", index: 8 }, { time: "9秒", index: 9 }, { time: "10秒", index: 10 }, { time: "11秒", index: 11 }, { time: "12秒", index: 12 }, { time: "13秒", index: 13 }, { time: "14秒", index: 14 }, { time: "15秒", index: 15 }, { time: "16秒", index: 16 }, { time: "17秒", index: 17 }, { time: "18秒", index: 18 }, { time: "19秒", index: 19 }, { time: "20秒", index: 20 }, { time: "21秒", index: 21 }, { time: "22秒", index: 22 }, { time: "23秒", index: 23 }, { time: "24秒", index: 24 }, { time: "25秒", index: 25 }, { time: "26秒", index: 26 }, { time: "27秒", index: 27 }, { time: "28秒", index: 28 }, { time: "29秒", index: 29 }, { time: "30秒", index: 30 }, { time: "31秒", index: 31 }, { time: "32秒", index: 32 }, { time: "33秒", index: 33 }, { time: "34秒", index: 34 }, { time: "35秒", index: 35 }, { time: "36秒", index: 36 }, { time: "37秒", index: 37 }, { time: "38秒", index: 38 }, { time: "39秒", index: 39 }, { time: "40秒", index: 40 }, { time: "41秒", index: 41 }, { time: "42秒", index: 42 }, { time: "43秒", index: 43 }, { time: "44秒", index: 44 }, { time: "45秒", index: 45 }, { time: "46秒", index: 46 }, { time: "47秒", index: 47 }, { time: "48秒", index: 48 }, { time: "49秒", index: 49 }, { time: "50秒", index: 50 }, { time: "51秒", index: 51 }, { time: "52秒", index: 52 }, { time: "53秒", index: 54 }, { time: "55秒", index: 55 }, { time: "56秒", index: 56 }, { time: "57秒", index: 57 }, { time: "58秒", index: 58 }, { time: "59秒", index: 59 }
      ]
    ],
    timeClose: [0, 30, 0],
    timeOpen:  [0, 30, 0],
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 改变LED状态
     * @param {Event} e 
     */
    ledStatusChange: function(e) {

      this.triggerEvent('changeLedStatus')
    },

    /**
     * 设置定时关闭
     * @param {Event} e 
     */
    selectClosePicker: function(e) {

      var seconds = this.getSeconds(e.detail.value)
      this.setData({
        timeClose: e.detail.value
      })
      this.triggerEvent("timingClose", {seconds})
    },

    /**
     * 设置定时开启
     * @param {Event} e 
     */
    selectOpenPicker: function(e) {

      var seconds = this.getSeconds(e.detail.value)
      this.setData({
        timeOpen: e.detail.value
      })
      this.triggerEvent("timingOpen", {seconds})
    },

    /**
     * 取消定时
     * @param {Event} e 
     */
    stopTimingClick: function(e) {

      this.triggerEvent("timingCancel")
    },

    /**
     * 改变LED状态
     * @param {Event} e 
     */
    ledStatusChange: function(e) {

      this.triggerEvent("changeLedStatus", protocol.setLedStatus(this.properties.status))
    },
  
    /**
     * 将时分秒转化为秒
     * @param {Array} array picker中的三列数值（时分秒）
     * @returns seconds
     */
    getSeconds: function(hms) {
  
      let s = parseInt(hms[0]) * 3600 + parseInt(hms[1]) * 60 + parseInt(hms[2])
      /**
       * 由于底层bug，定时设置时长为0s时会导致溢出，故在此控制定时时长最短为1s。
       */
      if ( s <= 0 ) {

        s = 1
      }
      return s
    }
  }
})
