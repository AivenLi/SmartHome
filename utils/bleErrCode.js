const bleErrorStr = [{
  code: -2,
  value: "搜索不到任何设备"
}, {
  code: -1,
  value: "已连接"
}, {
  code: 0,
  value: "正常"
}, {
  code: 10000,
  value: "未初始化蓝牙适配器"
}, {
  code: 10001,
  value: "当前蓝牙适配器不可用，请打开蓝牙设备"
}, {
  code: 10002,
  value: "没有找到指定设备"
}, {
  code: 10003,
  value: "连接失败"
}, {
  code: 10004,
  value: "没有找到指定服务"
}, {
  code: 10005,
  value: "没有找到指定特征值"
}, {
  code: 10006,
  value: "当前连接已断开"
}, {
  code: 10007,
  value: "当前特征值不支持此操作"
}, {
  code: 10008,
  value: "其余所有系统上报的异常"
}, {
  code: 10009,
  value: "Android系统特有，系统版本低于4.3不支持BLE"
}, {
  code: 10012,
  value: "连接超时"
}, {
  code: 10013,
  value: "连接deviceId为空或者是格式不正确"
}]

function getBLEErrStr(code) {

  for (let i = 0, len = bleErrorStr.length; i < len; ++i) {

    if (code === bleErrorStr[i].code) {

      return bleErrorStr[i].value
    }
  }
  return "未知错误"
}

module.exports = {

  getBleErrStr: getBLEErrStr
}