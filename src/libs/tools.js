/**
 * @param {Array} arr1 目标数组
 * @param {function} fn 回调函数
 * @description 数组循环
 */
 export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

/**
 * @param {Array} arg
 * @description 判别数组是否是有效的数组
 */
export const isValidArray = (arg) => {
  if (isArray(arg) && arg.length > 0) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @param {String } ken
 * @param {String or Number} tageretValue
 * @description 判别数组是否是有效的数组
 */
export const findOne = (arr, keyName, tageretValue) => {
  if (!isValidArray(arr)) {
    return null
  }
  return arr.find(p => p[keyName] === tageretValue)
}

/**
 * @param {Array} _arr
 * @param {Object } _obj
 * @description 数组中移除某个数组对象
 */
export const removeArray = (_arr, _obj) => {
  let length = _arr.length
  for (var i = 0; i < length; i++) {
    if (_arr[i] === _obj) {
      if (i === 0) {
        _arr.shift() // 删除并返回数组的第一个元素
        return _arr
      } else if (i === length - 1) {
        _arr.pop() // 删除并返回数组的最后一个元素
        return _arr
      } else {
        _arr.splice(i, 1) // 删除下标为i的元素
        return _arr
      }
    }
  }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length)
  let i = -1
  let res = []
  while (++i < len) {
    const item = arr2[i]
    if (arr1.indexOf(item) > -1) res.push(item)
  }
  return res
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (target, arr) => {
  return target.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表 是否存在列表中
 */
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 * 判断时间是不是毫秒 还是秒
 */
const isMillisecond = timeStamp => {
  const timeStr = String(timeStamp)
  return timeStr.length > 10
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
const isEarly = (timeStamp, currentTime) => {
  return timeStamp < currentTime
}

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0 注意这里只是补2位的
 */
const getHandledValue = num => {
  return num < 10 ? '0' + num : num
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
  const d = new Date(timeStamp * 1000)
  const year = d.getFullYear()
  const month = getHandledValue(d.getMonth() + 1)
  const date = getHandledValue(d.getDate())
  const hours = getHandledValue(d.getHours())
  const minutes = getHandledValue(d.getMinutes())
  const second = getHandledValue(d.getSeconds())
  let resStr = ''
  if (startType === 'year') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
  else resStr = month + '-' + date + ' ' + hours + ':' + minutes
  return resStr
}

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
  // 判断当前传入的时间戳是秒格式还是毫秒
  const IS_MILLISECOND = isMillisecond(timeStamp)
  // 如果是毫秒格式则转为秒格式
  if (IS_MILLISECOND) Math.floor(timeStamp /= 1000)
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStamp = Number(timeStamp)
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date()) / 1000)
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = isEarly(timeStamp, currentTime)
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff
  let resStr = ''
  const dirStr = IS_EARLY ? '前' : '后'
  // 少于等于59秒
  if (diff <= 59) resStr = diff + '秒' + dirStr
  // 多于59秒，少于等于59分钟59秒
  else if (diff > 59 && diff <= 3599) resStr = Math.floor(diff / 60) + '分钟' + dirStr
  // 多于59分钟59秒，少于等于23小时59分钟59秒
  else if (diff > 3599 && diff <= 86399) resStr = Math.floor(diff / 3600) + '小时' + dirStr
  // 多于23小时59分钟59秒，少于等于29天59分钟59秒
  else if (diff > 86399 && diff <= 2623859) resStr = Math.floor(diff / 86400) + '天' + dirStr
  // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getDate(timeStamp)
  else resStr = getDate(timeStamp, 'year')
  return resStr
}

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1
  }
  if (isExplorer('MSIE')) return 'IE'
  else if (isExplorer('Firefox')) return 'Firefox'
  else if (isExplorer('Chrome')) return 'Chrome'
  else if (isExplorer('Opera')) return 'Opera'
  else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj
  else {
    let keysArr = Object.keys(obj)
    return keysArr.length
  }
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
}

/**
 * 获取设备
 */
const ua = navigator.userAgent
export const device = {
  isAndroid: /(Android);?[\s/]+([\d.]+)?/.test(ua),
  isIpad: /(iPad).*OS\s([\d_]+)/.test(ua),
  isIpod: /(iPod)(.*OS\s([\d_]+))?/.test(ua),
  isIphone: !/(iPad).*OS\s([\d_]+)/.test(ua) && /(iPhone\sOS)\s([\d_]+)/.test(ua),
  isWechat: /micromessenger/i.test(ua),
  isQB: /(?:MQQBrowser|QQ)/.test(ua),
  isUC: /(?:UCWEB|UCBrowser)/.test(ua),
  isIOS: /(iPhone|iPad|iPod)/i.test(ua)
}

/**
 * 图形验证码生成UUID
 */
export const UUID = () => {
  var guid = ''
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16)
    guid += n
  }
  guid += new Date().getTime()
  return guid.toUpperCase()
}

/**
 * 检查字符串是否为空
 *
 * @param {String}
 *            val
 * @return {Boolean}
 */
export const isNull = (val) => {
  if (typeof val === 'undefined' || val === 'undefined') {
    return true
  } else if (typeof val === 'string') {
    return val == null || val === '' || val === 'null'
  } else {
    return val == null
  }
}

/**
 * 检查字符串是否不为空
 *
 * @param {String}
 *            val
 * @return {Boolean}
 */
export const isNotNull = (val) => {
  return !isNull(val)
}

/**
 * [isEmptyObject 空对象检查]
 *
 * @param {[type]}
 *            obj [description]
 * @return {Boolean} [description]
 */
export const isEmptyObject = (obj) => {
  if (isObject(obj)) {
    var name = null
    for (name in obj) {
      if (name) {
        return false
      }
    }
  }
  return true
}

export const isObject = (obj) => {
  return obj !== null && typeof obj === 'object'
}

/**
 * Array type check.
 *
 * @param {*}
 *            obj
 * @return {Boolean}
 */
export const isArray = (arg) => {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

/**
 * 判断不是空数组
 */
export const isNotEmptyArray = (arg) => {
  return isArray(arg) && arg.length > 0
}

/* eslint-disable */
/**
 * 判断2个对象值是否相等
 * @param {*} a
 * @param {*} b
 */
export function isObjectValueEqual(a, b) {
  if ((a == null && b != null) || (b == null && a != null)) {
    return false
  }
  console.info((a instanceof Array) + '<-array-x>' + (b instanceof Array));
  if (a instanceof Array && b instanceof Array) {
    if (a.length != b.length) {
      return false
    }
    for (var i = 0; i < a.length; i++) {
      var aEle = a[i]
      var bEle = b[i]
      console.info(aEle + '<-xx>' + bEle);
      if (aEle.constructor == Object && bEle.constructor == Object) {
        if (!isObjectValueEqual(aEle, bEle)) {
          return false
        }
      } else if (aEle !== bEle) {
        return false
      }
    }
    for (var i = 0; i < b.length; i++) {
      var aEle = a[i]
      var bEle = b[i]
      console.info(aEle + "<-xxx>" + bEle)
      if (aEle.constructor == Object && bEle.constructor == Object) {
        if (!isObjectValueEqual(aEle, bEle)) {
          return false
        }
      } else if (aEle !== bEle) {
        return false
      }
    }
  } else if (a.constructor == Object && b.constructor == Object) {
    var aProps = Object.getOwnPropertyNames(a)
    var bProps = Object.getOwnPropertyNames(b)
    if (aProps.length != bProps.length) {
      return false
    }
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i]
      console.info(propName + ':' + a[propName] + '<->' + b[propName], a[propName].constructor, b[propName].constructor)
      if (a[propName].constructor == Object && b[propName].constructor == Object) {
        if (!isObjectValueEqual(a[propName], b[propName])) {
          return false
        }
      } else if (a[propName] instanceof Array && b[propName] instanceof Array) {
        if (!isObjectValueEqual(a[propName], b[propName])) {
          return false
        }
      } else if (a[propName] !== b[propName]) {
        return false
      }
    }
    for (var i = 0; i < bProps.length; i++) {
      var propName = bProps[i];
      console.info(propName + ':' + a[propName] + '<-->' + b[propName])
      if (a[propName].constructor == Object && b[propName].constructor == Object) {
        if (!isObjectValueEqual(a[propName], b[propName])) {
          return false
        }
      } else if (a[propName] instanceof Array && b[propName] instanceof Array) {
        if (!isObjectValueEqual(a[propName], b[propName])) {
          return false
        }
      } else if (a[propName] !== b[propName]) {
        return false
      }
    }
  }
  return true
}

/**
 * js 判断数据是否为空
 * @param {*} params
 */
export function isNullValue (a) {
  // var a = "";
  // var a = " ";
  // var a = null;
  // var a = undefined;
  // var a = [];
  // var a = {};
  // var a = NaN;
  let isNull = false

  if (a === undefined) { // 只能用 === 运算来测试某个值是否是未定义的
    // 为undefined
    isNull = true
  } else if (a == null) { // 等同于 a === undefined || a === null
    isNull = true
  } else if (a == '' || a == null || a == undefined) { // "",null,undefined
    isNull = true
  } else if (!a) { // "",null,undefined,NaN
    isNull = true
  } else if (isArray(a)) {
    if (a.length == 0) { // "",[]
      isNull = true
    }
    if (!a.length) { // "",[]
      isNull = true
    }
  } else if (a.constructor == Object) {
    if(isEmptyObject(a)) { // 普通对象使用 for...in 判断，有 key 即为 false
      isNull = true
    }
  }
  console.log('isNullValue:', a, ' --> ',isNull)
  return isNull
}

/**
 *深度拷贝
 * @param {深度拷贝  } obj
 */
export const cloneObj = (obj) => {
  let str
  let newobj = obj.constructor === Array ? [] : {}
  if (typeof obj !== 'object') {
    return
  } else if (JSON) {
    str = JSON.stringify(obj) // 序列化对象
    newobj = JSON.parse(str) // 还原
  } else { // 如果不支持以上方法
    for (var i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i]
    }
  }
  return newobj
}

/**
 * 去抖的方法
 * @param {*} method 执行行数
 * @param {*} delay 延迟时间
 */
export const debounce = (method, delay) => {
  var timer = null
  return () => {
    var context = this
    var args = arguments
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(function () {
      method.apply(context, args)
    }, delay)
  }
}

function typeOf (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

/**
 * 拷贝
 * @param {*} data
 */
export const deepCopy = (data) => {
  const t = typeOf(data)
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (let i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}

/**
 * 判断是否含有某属性
 * @param {*} obj
 * @param {*} key
 * 如果没有的话返回 true 否则返回 false
 */
export const unDef = (obj, key) => {
  return !obj.hasOwnProperty(key)
}

/**
 * 除100
 * @param {*} value
 */
export const flowFormat = (value) => {
  if (!value) {
    return 0
  }
  if (isNaN(value)) {
    return 0
  }
  var temp = value / 100
  return parseFloat(temp)
}

/**
 * 将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date(), ("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()), ("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param {*} date 时间戳或者字符串
 * @param {*} fmt 格式化
 */
export const dateFormat = (date, fmt) => {
  var thisDate = new Date(date)
  var o = {
    'M+': thisDate.getMonth() + 1, // 月份
    'd+': thisDate.getDate(), // 日
    'h+': thisDate.getHours(), // 小时
    'm+': thisDate.getMinutes(), // 分
    's+': thisDate.getSeconds(), // 秒
    'q+': Math.floor((thisDate.getMonth() + 3) / 3), // 季度
    'S': thisDate.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (thisDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 测试字符串长度
 * zhLength：中文长度  英文长度为中文长度的2倍
 * value: 测试的值
 * msgPrex： 值判断前缀名称
 */
export const checkStrLength = (opts) => {
  let zhLength = opts.max
  let minLength = opts.min
  let msgPrex = opts.msgPrex || ''
  let result = {
    check: false,
    msg: ''
  }
  let flag = 1
  let v = opts.value
  // [\u4e00-\u9fa5]为汉字的unicode编码，/i表示匹配的时候不区分大小写。
  let rx = /[a-z\d]/i
  let rxcn = /[\u4e00-\u9fa5]/
  let num = 0
  let chr

  if (v) {
    for (let i = 0, j = v.length; i < j; i++) {
      chr = v.charAt(i)
      if (rx.test(chr)) num += 1
      else if (rxcn.test(chr)) num += 2
      else {
        // 不属于汉字或者字母的  即特殊符号 这里就算加1
        num += 1
      }
    }
  }

  if (flag !== 3) {
    if (num > zhLength * 2) {
      result.msg = msgPrex + '长度最多为' + zhLength + '个汉字或' + (zhLength * 2) + '个字母数字！'
      return result
    } else if (num < 1) {
      result.msg = msgPrex + '不能为空！'
      return result
    }
    if (typeof minLength !== 'undefined') {
      if (num < minLength) {
        result.msg = msgPrex + '不能为小于' + minLength + '个汉字或' + (minLength * 2) + '个字母数字'
        return result
      }
    }
    result.check = true
    return result
  } else {
    // 未使用
    result.msg = msgPrex + '不能包含特殊符号！'
    return result
  }
}

/**
 * 判断>=0的数字
 */
export const isIntNumIncludeZero = (val) => {
  let regPos = /^\d+$/ // 非负整数
  if (regPos.test(val)) {
    return true
  } else {
    return false
  }
}

/**
 * 是否是正整数
 * @param val
 * @returns {boolean}
 */
export const isPureIntNum = (val) => {
  var type = '^[0-9]*[1-9][0-9]*$'
  var r = new RegExp(type)
  var flag = r.test(val)
  if (!flag) {
    return false
  }
  return true
}

/**
 * 是否是现金 有小数的那种2位
 * @param {*} val
 */
export const isMoneyValue = (val) => {
  var type = '^\\d+(\\.\\d{1,2})?$'
  var r = new RegExp(type)
  if (val !== '') {
    if (!r.test(val)) {
      return false
    }
    return true
  }
  return false
}

/**
 * 数字 小数点位数校验
 * val 目标校验值
 * fixNum 小数点位数
 * negative 是否可以输入负数
*/
export const validFloatByFixed = (val, fixNum, negative) => {
  var type = `^\\d+(\\.\\d{1,${fixNum}})?$`
  if (negative) {
    type = `(^-?(?:\\d+|\\d{1,3}(?:,\\d{3})+)(?:\\.\\d{1,${fixNum}})?$)`
  }
  var r = new RegExp(type)
  if (val !== '') {
    if (!r.test(val)) {
      return false
    }
    return true
  }
  return false
}

/**
 * Uri校验规则
 */
export const validateUri = (val) => {
  let pattern = /[a-zA-z]+:\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)?$/
  if (pattern.test(val)) {
    return true
  } else {
    return false
  }
}

/**
 * 六位色值校验规则
 */
export const validateColor = (val) => {
  let pattern = /[0-9a-fA-F]{6}$/
  if (pattern.test(val)) {
    return true
  } else {
    return false
  }
}

/**
 * 判断是否未定义
*/
export const isUn = (val) => {
  return typeof val === 'undefined'
}

export const removeArrayEmptyValue = (array) => {
  return array.filter(item => !isNull(item) && isEmptyObject(item))
}

/** 输入过长检验是否是金钱的 包括最后一个小数点的 */
export const isInputMoney = (value) => {
  let patrn = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[1-9]([0-9]+)?(\.)?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  return patrn.test(value)
}

/**
 * 将数组转拼接字符串
*/
export const arrayJoinToStr = (array, joinStr) => {
  if (isValidArray(array) && array.length > 0) {
    let temp = array.join(joinStr)
    return temp.substring(0, temp.length - 1)
  }
  return ''
}

/**
 * 回调
 * @param {} cb
 * @param {*} param
 */
export const cbMid = (cb, param) => {
  typeof cb === 'function' && cb(param)
}

/**
 * 树形结果获取当前item
*/
export const getTreeItemById = (list, id) => {
  let result

  const getItem = (tempList, id) => {
    for (let i in tempList) {
      let item = tempList[i]
      if (item.id === id) {
        result = item
        break
      } else if (item.children) {
        getItem(item.children, id)
      }
    }
  }
  getItem(list, id)

  return result
}

/**
 * 获取随机数
 * @param {*} n
 */
export const randomn = (n) => {
  if (n > 21) return null
  var re = new RegExp('(\\d{' + n + '})(\\.|$)')
  var num = (Array(n - 1).join(0) + Math.pow(10, n) * Math.random()).match(re)[1]
  return num
}

/**
 * 对象转url 参数
 * eg:
 * data: {
 *  c:1,
 *  d:2
 * }
 * return c=1&d=2
 * @param {*} data
 */
export const objectToUrlParam = (data) => {
  let _result = []
  for (let key in data) {
    let value = data[key]
    if (value.constructor === Array) {
      value.forEach(function (_value) {
        _result.push(key + '=' + _value)
      })
    } else {
      _result.push(key + '=' + value)
    }
  }
  return _result.join('&')
}

/* eslint-disable */
/**
 * 对象数组根据某个属性去重
 * @param {*} data
 * @param {*} name
 *
 * reduce 前一个值，当前值，项的索引，数组对象
 */
export const uniqObjectListByName = (data, name) => {
  let hash = {}
  const data2 = data.reduce((preVal, curVal) => {
    hash[curVal[name]] ? '' : hash[curVal[name]] = true && preVal.push(curVal)
    return preVal
  }, [])
  return data2
}
/* eslint-enable */

/**
 * 获取对象数组中的某个树形 并转为数组
 * @param {*} list
 * @param {*} key
 */
export const getValudListFromObjetArray = (list, key) => {
  if (!isValidArray(list)) {
    return
  }
  let newList = []

  list.forEach(item => {
    !isUn(item[key]) && newList.push(item[key])
  })

  return newList
}

/**
 * 正则验证
 *
 * @param {String}
 *            type idCard: 身份证, phone: 手机号码 password: 密码 smCode： 短信验证码
 * @param {String}
 *            val 验证字符串 /^[A-Za-z0-9]{6,20}$/
 * @return {Boolean}
 * 密码分开来注释一下：
^ 匹配一行的开头位置
(?![0-9]+$) 预测该位置后面不全是数字
(?![a-zA-Z]+$) 预测该位置后面不全是字母
[0-9A-Za-z] {9,12} 由9-12位数字或这字母组成
$ 匹配行结尾位置

注：(?!xxxx) 是正则表达式的负向零宽断言一种形式，标识预该位置后不是xxxx字符。
 */
export const regMfTest = (type, val) => {
  var regType = {
    idCard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
    phone: /^1\d{10}$/,
    smCode: /^[0-9]{4}$/,
    smCode6: /^[0-9]{6}$/,
    picCode: /^[A-Za-z0-9]{6}$/,
    password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{9,12}$/
  }
  return regType[type] && regType[type].test(val)
}

/**
 * 手机号验证
 * @param phone 输入手机号
 * @param cb result: status 0 为空， 1 正确 ， -1 错误,msg: 提示信息, phone 处理后的手机号
 */
export const checkPhone = (phone, title, cb) => {
  var result = {
    status: 0,
    msg: '请输入' + title,
    phone: ''
  }
  if (isNull(phone)) {
    typeof cb === 'function' && cb(result)
    return result
  }
  var tempPhone = phone.trim()
  if (tempPhone.length !== 11) {
    result = {
      status: -1,
      msg: title + '为11位数字',
      phone: tempPhone
    }
    typeof cb === 'function' && cb(result)
    return result
  }
  if (regMfTest('phone', tempPhone)) {
    result = {
      status: 1,
      msg: '验证正确',
      phone: tempPhone
    }
    typeof cb === 'function' && cb(result)
    return result
  } else {
    result = {
      status: -1,
      msg: '请输入正确的' + title,
      phone: tempPhone
    }
    typeof cb === 'function' && cb(result)
  }
  return result
}

/**
 * 校验短信验证码
 * @param {*} picCode
 * @param {*} cb
 */
export const checkPicCode = (picCode, title, cb) => {
  let result = {
    status: 0,
    msg: '请输入' + title,
    picCode: ''
  }
  if (isNull(picCode)) {
    typeof cb === 'function' && cb(result)
    return result
  }
  var tempPicCode = picCode.trim()
  if (regMfTest('picCode', tempPicCode)) {
    result = {
      status: 1,
      msg: '验证正确',
      picCode: tempPicCode
    }
    typeof cb === 'function' && cb(result)
    return result
  } else {
    result = {
      status: -1,
      msg: title + '为6位数字字母组成',
      picCode: tempPicCode
    }
    typeof cb === 'function' && cb(result)
  }
  return result
}

/**
 * 校验短信验证码
 * @param {*} smsCode
 * @param {*} cb
 */
export const checkSmsCode = (smsCode, title, cb) => {
  let result = {
    status: 0,
    msg: '请输入' + title,
    smsCode: ''
  }
  if (isNull(smsCode)) {
    typeof cb === 'function' && cb(result)
    return result
  }
  var tempSmsCode = smsCode.trim()
  if (regMfTest('smCode', tempSmsCode)) {
    result = {
      status: 1,
      msg: '验证正确',
      smsCode: tempSmsCode
    }
    typeof cb === 'function' && cb(result)
    return result
  } else {
    result = {
      status: -1,
      msg: title + '为4位数字组成',
      smsCode: tempSmsCode
    }
    typeof cb === 'function' && cb(result)
  }
  return result
}
/**
 * 校验短信验证码6位
 * @param {*} smsCode6
 * @param {*} cb
 */
export const checkSmsCode6 = (smsCode, title, cb) => {
  let result = {
    status: 0,
    msg: '请输入' + title,
    smsCode: ''
  }
  if (isNull(smsCode)) {
    typeof cb === 'function' && cb(result)
    return result
  }
  let tempSmsCode = smsCode.trim()
  if (regMfTest('smCode6', tempSmsCode)) {
    result = {
      status: 1,
      msg: '验证正确',
      smsCode: tempSmsCode
    }
    typeof cb === 'function' && cb(result)
    return result
  } else {
    result = {
      status: -1,
      msg: title + '为6位数字组成',
      smsCode: tempSmsCode
    }
    typeof cb === 'function' && cb(result)
  }
  return result
}
/**
 * 密码校验
 * @param {*} value
 * @param {*} cb
 */
export const checkPassword = (value, title, cb) => {
  let result = {
    status: 0,
    msg: '请输入' + title,
    value: ''
  }
  if (isNull(value)) {
    typeof cb === 'function' && cb(result)
    return result
  }
  var tempValue = value.trim()
  if (regMfTest('password', tempValue)) {
    result = {
      status: 1,
      msg: '验证正确',
      value: tempValue
    }
    typeof cb === 'function' && cb(result)
    return result
  } else {
    result = {
      status: -1,
      msg: title + '必须包含字母、数字，不少于9位，最多12位',
      value: tempValue
    }
    typeof cb === 'function' && cb(result)
  }
  return result
}

/**
 * 是否是手机端
 */
export const isMobile = () => {
  let ua = navigator.userAgent
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
  let isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/)
  let isAndroid = ua.match(/(Android)\s+([\d.]+)/)
  let isMobile = isIphone || isAndroid
  return isMobile
}

/**
 * 加载js
 */
export const loadScript = (url) => { // 动态加载js
  return new Promise((resolve, reject) => {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null
          resolve()
        } else {
          reject()
        }
      }
    } else {
      script.onload = function () {
        resolve()
      }
      script.onerror = function () {
        reject()
      }
    }
    script.src = url
    document.body.appendChild(script)
  })
}

/**
 * 校验输入是否是中文
 */
export const validChinese = (text) => {
  let reg = /[\u4e00-\u9fa5]/
  if (reg.test(text)) {
    return true
  }
  return false
}

/**
 * 手机号或者座机校验规则
 */
export const validateTel = (val) => {
  let pattern = /^[0-9]{2,4}-[0-9]{5,10}$/
  if (pattern.test(val)) {
    return true
  } else {
    return false
  }
}

/**
 * 去除前后空格
 * @param {String} val 字符串
 * @return {String}
 */
export const trim = (val) => {
  return val.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * 测试字符串长度 不可以是特殊字符
 * value: 测试的值
 * msgPrex： 值判断前缀名称
 */
export const checkStrLengthNormal = (opts) => {
  let maxLength = opts.max
  let minLength = opts.min
  let isSperical = !!opts.sper // 是否可以特殊的
  let msgPrex = opts.msgPrex || ''
  let result = {
    check: false,
    msg: ''
  }
  let flag = 1
  let v = opts.value
  // [\u4e00-\u9fa5]为汉字的unicode编码，/i表示匹配的时候不区分大小写。
  let rx = /[a-z\d]/i
  let rxcn = /[\u4e00-\u9fa5]/
  let num = 0
  let chr

  if (v) {
    for (let i = 0, j = v.length; i < j; i++) {
      chr = v.charAt(i)
      if (rx.test(chr)) num += 1
      else if (rxcn.test(chr)) num += 1
      else {
        // 不属于汉字或者字母的  即特殊符号
        if (isSperical) {
          num += 1
        } else {
          flag = 3
        }
      }
    }
  }

  if (flag !== 3) {
    if (num > maxLength) {
      result.msg = msgPrex + '长度最多为' + maxLength + '个字'
      return result
    } else if (num < 1) {
      result.msg = msgPrex + '不能为空！'
      return result
    }
    if (typeof minLength !== 'undefined') {
      if (num < minLength) {
        result.msg = msgPrex + '不能为小于' + minLength + '个字'
        return result
      }
    }
    result.check = true
    return result
  } else {
    result.msg = msgPrex + '不能包含特殊符号！'
    return result
  }
}

/**
 * 去除一级对象的属性值 前后空格
 * @param {*} obj
 */
export const trimLevelOne = (obj) => {
  let keys = Object.keys(obj)
  if (isValidArray(keys)) {
    keys.forEach(key => {
      if (typeof obj[key] === 'string') {
        obj[key] = trim(obj[key])
      }
    })
  }
  return obj
}

/* eslint-disable */
export const getQueryString = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  let r = window.location.search.substr(1).match(reg)
  if (r != null)
    return unescape(r[2])
  return null
}
/* eslint-enable */

/**
 * 百度地图加载时视协议类型而定;
 * 注意：在加载地图脚本前加载此方法
 */
export const isAddHostType = function () {
  const protocolStr = document.location.protocol
  switch (protocolStr) {
    case 'https:':
      // 指定https访问类型，具体见百度地图API加载方式：http://www.jiazhengblog.com/blog/2011/06/28/284/
      window.HOST_TYPE = '2'
      break
    case 'http:':
      break
    default:
      break;
  }
}

/**
 * 获取最后一部分，即文件名和参数
 * @param {*} url
 */
export const getUrlLastName = (url) => {
  let tmp = [] // 临时变量，保存分割字符串
  tmp = url.split('/') // 按照"/"分割
  let pp = tmp[tmp.length - 1] // 获取最后一部分，即文件名和参数
  tmp = pp.split('?') // 把参数和文件名分割开
  return tmp[0]
}

/**
 * 浅层遍历 空值属性值转为null
 * @param {*} map
 */
export const shallowMapEmptyToNull = (map) => {
  let newMap = Object.assign({}, map)
  let keys = Object.keys(newMap)
  if (isValidArray(keys)) {
    keys.forEach(key => {
      newMap[key] = typeof newMap[key] === 'string' ? newMap[key].trim() : newMap[key]
      if (isNull(newMap[key])) {
        newMap[key] = null
      }
    })
  }
  return newMap
}

/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
*/

export function randomWord (randomFlag, min, max) {
  let str = ''
  let range = min
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  for (let i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

/**
 * 手机号隐私
 * @param {*} phone
 */
export function privacyPhone (phone) {
  return phone.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
}
