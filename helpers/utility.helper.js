import axios from 'axios'
import http from 'http'

const utilHelper = {
  clientIp: (req) => {
    let ip = (req.headers['x-client-wp'] || '') || (req.headers['x-forwarded-for'] || '').split(',').pop() || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
    if (ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7)
    }
    return ip
  },
  formatRegno: (noregis) => {
    const noregister = (noregis) ? noregis.replace(/ /g, '').replace(/-/g, '') : ''
    const regex = !isNaN(parseInt(noregister[0])) ? ((!isNaN(noregister)) ? /([1-9]{1,2})([0-9]{1,4})/ : /([1-9]{1,1})([ก-ฮ]{1,3})([0-9]{1,4})/) : /([ก-ฮ]{1,3})([0-9]{1,4})/
    const arrRegNo = (noregister.indexOf('ป้าย') > -1 || noregister.indexOf('แดง') > -1 ? 'ป้ายแดง' : noregister.match(regex))
    let regNo = noregister
    if (arrRegNo) {
      regNo = (arrRegNo.length === 3 ? ((!isNaN(parseInt(arrRegNo[1]))) ? arrRegNo[1] + '-' + arrRegNo[2] : arrRegNo[1] + ' ' + arrRegNo[2]) : (arrRegNo.length === 4 ? arrRegNo[1] + arrRegNo[2] + ' ' + arrRegNo[3] : noregister))
    }
    return regNo
  },
  formatDbRegno: (noregis) => {
    const noregister = (noregis) ? noregis.replace(' ', '').replace('-', '') : ''
    return noregister
  },
  conv: (text, singlequote) => {
    return (text !== '' && text != null) ? (singlequote) ? "'" + text + "'" : text : 'null'
  },
  fnCryptTID: (action, val) => {
    let result = ''
    if (action === 'e' && val) {
      const ranstart = ((Math.floor(Math.random() * 16) + 65) - 48)
      result += 'K' + ranstart.toString()[0] + '-'
      for (let i = 0; i < val.length; i++) {
        result += String.fromCharCode(val.charCodeAt(i) + ranstart)
        result += String.fromCharCode(Math.floor(Math.random() * 26) + 97)
      }
      result += '-' + ranstart.toString()[1] + 'C'
    } else if (action === 'd' && val && val[0] === 'K' && val[val.length - 1] === 'C') {
      const newval = (val.replace(/[a-z]/g, ''))
      const arr = newval.split('-')
      const ranstart = parseInt(arr[0][1] + arr[2][0])
      for (let i = 0; i < arr[1].length; i++) {
        result += String.fromCharCode(arr[1].charCodeAt(i) - ranstart)
      }
    } else {
      result = val || ''
    }
    return result
  },
  fnGetBathText: (inputNumber) => {
    const getText = (input) => {
      const toNumber = input.toString()
      const numbers = toNumber.split('').reverse()
      const numberText = '/หนึ่ง/สอง/สาม/สี่/ห้า/หก/เจ็ด/แปด/เก้า/สิบ'.split('/')
      const unitText = '/สิบ/ร้อย/พ้น/หมื่น/แสน/ล้าน'.split('/')
      let output = ''
      for (let i = 0; i < numbers.length; i++) {
        const number = parseInt(numbers[i])
        const text = numberText[number]
        const unit = unitText[i]

        if (number === 0) continue

        if (i === 1 && number === 2) {
          output = 'ยี่สิบ' + output
          continue
        }

        if (i === 1 && number === 1) {
          output = 'สิบ' + output
          continue
        }
        output = text + unit + output
      }
      return output
    }

    const fullNumber = Math.floor(inputNumber)
    let decimal = inputNumber - fullNumber
    if (decimal === 0) {
      return getText(fullNumber) + 'บาทถ้วน'
    }

    decimal *= 100
    decimal = Math.round(decimal)
    return getText(fullNumber) + 'บาท' + getText(decimal) + 'สตางค์'
  },
  isNumericString (str) {
    if (typeof str !== 'string') return false
    return !isNaN(str) && !isNaN(parseFloat(str))
  },
  isDate (input) {
    if (this.isNumericString(input)) {
      input = Number(input)
    }

    const d = new Date(input)
    return d.getTime() === d.getTime()
  },
  dayBetween (startDate, endDate) {
    const sDate = new Date(startDate)
    const eDate = new Date(endDate)
    const oneDay = 1000 * 60 * 60 * 24
    const diff = Math.ceil((eDate - sDate) / (oneDay)) + 1
    return diff
  },
  addDays (date, days) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  },
  timeBetween (startDate, endDate) {
    if (this.isNumericString(startDate)) {
      startDate = Number(startDate)
    }

    if (this.isNumericString(endDate)) {
      endDate = Number(endDate)
    }

    const sDate = new Date(startDate)
    const eDate = new Date(endDate)

    const diff = (eDate.getTime() - sDate.getTime()) / 1000
    return diff
  },
  isJson (item) {
    item = typeof item !== 'string' ? JSON.stringify(item) : item

    try {
      item = JSON.parse(item)
    } catch (e) {
      return false
    }

    if (typeof item === 'object' && item !== null) {
      return true
    }

    return false
  },
  encodeding (data, process) {
    var url =
    'http://192.168.0.53/nop/encoding/encode_decode.asp?process=' +
    process +
    '&data=' +
    data.replace(/\+/g, '%2B')
    
    return new Promise(function (resolve,reject) {
      axios.get(url).then((response) => {
        resolve(response.data.toString())
      })
      .catch((error) => {
        reject(error)
      });
    })
  },
  fnCheckIfValidUUID (str) {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
    return regexExp.test(str)
  },
  fnValidatePhone (value) {
    let str = value || ''
    str = str.replace(/-/g, '')
    str = str.replace(/ /g, '')
    str = str.replace(/g\?/g, '')
    const phone = /0(6|8|9)\d{8}/g
    const strPhone = (str.match(phone) || []).join('')

    if (strPhone.length !== 10) {
      return false
    } else {
      return true
    }
  },
  fnReplaceSpecialAlphabet (input) {
    const result = input.replace(/[`~%^&*!@#$()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
    return result
  },
  fnConvertStringKeyLower: (arr) => {
    for (const key in arr) {
      if (arr.hasOwnProperty(key)) {
        arr[key] = Object.keys(arr[key]).reduce((c, k) => (c[k.toLowerCase()] = arr[key][k], c), {})
        for (const key1 in arr[key]) {
          if (arr[key].hasOwnProperty(key1)) {
            if (arr[key][key1] instanceof Date && !isNaN(arr[key][key1].valueOf())) {
              const unixTimestamp = (arr[key][key1].getTime() + arr[key][key1].getTimezoneOffset() * 60 * 1000) / 1000
              const jsonDate = new Date(unixTimestamp * 1000).toString()

              const currentDateTime = new Date(jsonDate)
              const month = `0${(currentDateTime.getMonth() + 1)}`
              const day = `0${currentDateTime.getDate()}`
              const year = currentDateTime.getFullYear()
              const hour = `0${currentDateTime.getHours()}`
              const minute = `0${currentDateTime.getMinutes()}`
              const second = `0${currentDateTime.getSeconds()}`
              const date = `${year}-${month.substr(month.length - 2)}-${day.substr(day.length - 2)} ${hour.substr(hour.length - 2)}:${minute.substr(minute.length - 2)}:${second.substr(second.length - 2)}`
              arr[key][key1] = date
            } else if (arr[key][key1] === null) {
              arr[key][key1] = ''
            } else {
              arr[key][key1] = arr[key][key1].toString()
            }
          }
        }
      }
    }
    return arr
  },
  fnGetKeyItemInArray: (array, fnCheck, key = null) => {
    const isExist = array.filter(item => fnCheck(item))
    if (isExist && isExist.length > 0) {
      if (key) {
        console.log('key : ' + key)
        console.log(isExist[0][key])
        return isExist[0][key]
      } else {
        return isExist
      }
    } else {
      return null
    }
  },
  fnJsonformatData: (date, merge) => {
    const jDate = (date ? new Date(date) : new Date())
    const jDay = '0' + jDate.getDate()
    const jMonth = '0' + (jDate.getMonth() + 1).toString()
    const jYear = jDate.getFullYear()
    const jHour = '0' + jDate.getHours()
    const jMinute = '0' + jDate.getMinutes()
    const jSec = '0' + jDate.getSeconds()
    const reDate = jYear + merge + jMonth.substr(jMonth.length - 2) + merge + jDay.substr(jDay.length - 2) + ' ' + jHour.substr(jHour.length - 2) + ':' + jMinute.substr(jMinute.length - 2) + ':' + jSec.substr(jSec.length - 2)
    return reDate
  },
  fnEncodeding: function (data, process) {
    const url = 'http://192.168.0.53/nop/encoding/encode_decode.asp?process=' + process + '&data=' + data.replace(/\+/g, '%2B')
    return new Promise(function (resolve) {
      http.get(url, function (response) {
        response.on('data', function (chunk) {
          data = chunk.toString()
          resolve(data)
        })
        response.on('end', function () {})
      })
    })
  }
}

export default utilHelper
