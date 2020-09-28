/**
 * @Author AivenLi
 * @Date 2020-9-24
 * 基于BLE的智能家居控制协议
 */

var ledProtocol = new ArrayBuffer(5)
var dataView = new DataView(ledProtocol)
dataView.setUint8(0, 4)
dataView.setUint8(2, 0)
dataView.setUint8(3, 0)
dataView.setUint8(4, 8)

/**
 * 设置LED状态
 * @param {boolean} status led的状态，true亮，false灭
 * @return led的控制协议数据
 */
function mySetLedStatus(status) {

  dataView.setUint8(1, status ? 49 : 48)
  dataView.setUint8(2, 0)
  dataView.setUint8(3, 0)
  return ledProtocol
}

/**
 * @brief 设置定时器
 * @param {Number} status 定时到之后的动作。1：开，0：关
 * @param {Number} timing 定时时长
 */
function mySetTimingLed(status, timing) {

  let hightBit = 0
  let lowBit   = 0
  
  console.log("定时时间: ", timing)
  if (timing >= 65535) {

    hightBit = lowBit = 255
  } else if ( timing <= 0 ) {

    hightBit = lowBit = 0
  } else if ( timing <= 255 ) {
   
    lowBit = timing
  } else {

    hightBit = parseInt(timing / 256)
    lowBit = parseInt(timing % 256)
  }
  console.log("高位：", hightBit)
  console.log("低位: ", lowBit)
  dataView.setUint8(1, status == 1 ? 51 : 50)
  dataView.setUint8(2, hightBit);
  dataView.setUint8(3, lowBit);
  return ledProtocol
}

/**
 * 取消定时任务
 */
function myCancelTiming() {

  dataView.setUint8(1, 52);
  dataView.setUint8(2, 0);
  dataView.setUint8(3, 0)
  return ledProtocol;
}

/**
 * 设置LED状态
 */
function myGetLedStatus() {

  dataView.setUint8(1, 53)
  dataView.setUint8(2, 0)
  dataView.setUint8(3, 0)
  return ledProtocol
}

/**
 * 解析底层回传的数据
 * @param {ArrayBuffer} buffer 
 */
function parseLedProtocolData(buffer) {

  return dataTohex(buffer)
}

/**
 * 十进制转16进制
 * @param {ArrayBuffer} buffer 存放十进制的ArrayBuffer
 * @params List字符串
 */
function dataTohex(buffer) {

  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join(',');
}

module.exports = {

  setLedStatus: mySetLedStatus,
  getLedStatus: myGetLedStatus,
  setTiming: mySetTimingLed,
  cancelTiming: myCancelTiming,
  parseData: parseLedProtocolData,
}