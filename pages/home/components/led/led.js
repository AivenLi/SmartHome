// pages/home/components/led/led.js
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
    /*timer: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", 
            "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63"],*/
    timeClose: "00:30",
    timeOpen:  "00:30",
  },

  /**
   * 组件的方法列表
   */
  methods: {

    ledStatusChange: function(e) {

      console.log("改变led状态")
    },

    selectClosePicker: function(e) {

      console.log("关灯定时时间: ", e.detail.value)
      this.setData({
        timeClose: e.detail.value
      })
    },

    selectOpenPicker: function(e) {

      console.log("开灯定时时间: ", e.detail.value)
      this.setData({
        timeOpen: e.detail.value
      })
    },

    stopTimingClick: function(e) {

      console.log("取消定时")
    },

    sliderCloseChangeDone: function(e) {

      this.setData({
        closeValue: e.detail.value
      })
    },

    sliderCloseChanging: function(e) {

      this.setData({
        closeValue: e.detail.value
      })
    },

    sliderOpenChangeDone: function(e) {

      this.setData({
        openValue: e.detail.value
      })
    },

    sliderOpenChanging: function(e) {

      this.setData({
        openValue: e.detail.value
      })
    }
  }
})
