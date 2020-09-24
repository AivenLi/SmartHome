/**
 * @Author AivenLi
 * @Date 2020-9-24
 * 基于BLE的智能家居控制协议
 */

var ledProtocol = new ArrayBuffer(4)
var dataView    = new DataView(ledProtocol)
dataView.setUint8(0, 4)
dataView.setUint8(2, 48)
dataView.setUint8(3, 8)

 /**
  * @param {boolean} ledStatus led的状态，true亮，false灭
  * @param {timing} timing 定时关闭/开启，0表示不定时，单位为分钟
  * @return led的控制协议数据
  */
function mySetLedStatus(ledStatus, timing) {

    dataView.setUint8(1, ledStatus ? 49 : 48)
    dataView.setUint8(2, timing <= 0 ? 48 : timing > 255 ? 255 : timing)
    return ledProtocol
}

function myGetLedStatus() {

  dataView.setUint8(1, 50)
  dataView.setUint8(2, 48)
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
  parseData:    parseLedProtocolData,
}