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
 * @param {boolean} status 定时到之后的动作
 * @param {number} timing 定时时长
 */
function mySetTimingCloseLed(status, timing) {

  let hightBit = 0
  let lowBit   = 0
  if (timing > 65535) {

    hightBit = lowBit = 255
  } else if ( timing > 255 ) {

    lowBit   = 255
    hightBit = parseInt(timing / 256) + ( timing % 256 )
  } else if ( timing <= 0 ) {

    hightBit = lowBit = 0
  } else {

    lowBit   = timing
    hightBit = 0
  }
  dataView.setUint8(1, status ? 51 : 50)
  dataView.setUint8(2, 7);
  dataView.setUint8(3, 8);
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

function myGetLedStatus() {

  dataView.setUint8(1, 53)
  dataView.setUint8(2, 0)
  dataView.setUint8(3, 0)
  return ledProtocol
}

function parseLedProtocolData(buffer) {

  return dataTohex(buffer)
}

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
  setTiming: mySetTimingCloseLed,
  cancelTiming: myCancelTiming,
  parseData: parseLedProtocolData,
}