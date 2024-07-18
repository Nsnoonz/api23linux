import errorHelper from '../helpers/error.helper.js'; 
import http from 'http'
import https from 'https'

const isParameterized = (value) => {
  let result = true
  const subStrings = ['\'--', 'select ', 'drop ', 'truncate ', 'or ', 'and ', ' like ', 'script ']

  if (result === true && (new RegExp(/'\s*(and|or|xor|&&|\|\|)\s*.*/gi).test(value))) {
    result = false
  } else if (result === true && (new RegExp(/(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*\/)\*\/)/gi).test(value))) {
    result = false
  } else if (result === true && (new RegExp(/(sysobjects|information_schema|table_)/gi).test(value))) {
    result = false
  } else if (result === true && (new RegExp(/(\b(alter|create|delete|drop|exec(ute){0,1}|insert( +into){0,1}|merge|rename|script|select|truncate|update)\b)/gi).test(value))) {
    result = false
  } else if  (result === false && (new RegExp(/('\'--'|select|drop|truncate|or|and|like|script)[^a-z]*=/gi).test(value)))  {
    result = false
  }

  return result
}

const functionName = (func) => {
  const myInstanceArray = Object.values(func)
  const myInstance = myInstanceArray[0]
  const myName = myInstance.name

  return myName
}

const dbHelper = {
  preparedQuery (query, params) {
    try {
      if (!query.header) {
        throw Error(`Query.header is undefined`)
      }
  
      if (!query.header.system) {
        throw Error(`Query.header.system is undefined`)
      }
  
      if (!query.header.description) {
        throw Error(`Query.header.description is undefined`)
      }
  
      if (!query.header.createdate) {
        throw Error(`Query.header.createdate is undefined`)
      }
  
      if (!query.header.updatedate) {
        throw Error(`Query.header.updatedate is undefined`)
      }
  
      if (!query.header.contactname) {
        throw Error(`Query.header.contactname is undefined`)
      }
  
      if (!query.sql) {
        throw Error(`Query.sql is undefined`)
      }
  
      if (!query.params) {
        throw Error(`Query.params is undefined`)
      }
  
      if (Array.isArray(query.params.callerfnc) === false) {
        throw Error('Query.params.callerfnc is not an array')
      }
  
      let result = {}      
      let prepareQuery = query.sql    
      result.status = 'fail'
  
      const arrParam = prepareQuery.match(/:[A-Za-z]+\w+[A-Za-z0-9]/g)
  
      if (arrParam != null) {
        arrParam.forEach((item, index) => {
          const param = item.replace(':', '')
          const paramValue = query.params[param]
  
          if (paramValue === undefined) {
            throw Error('No value given to parameter ' + item)
          } else if (isParameterized(paramValue) === false) {
            throw Error('Given value is not accept for parameter ' + item)
          } else {
            const value = ((paramValue && paramValue.toString().toLowerCase() !== 'null') ? `'${paramValue}'` : 'null')
            
            const replace = item + '\\b'
            const regExp = new RegExp(replace, 'g')
  
            prepareQuery = prepareQuery.replace(regExp, value)
          }
        })
      }
  
      result.status = 'success'
      result.header = `system : `+ query.header.system +` | description : `+ query.header.description +` | createdate : `+ query.header.createdate +` | updatedate : `+ query.header.updatedate +` | contactname : `+ query.header.contactname +` | url : `+ query.params.originalUrl +` | function : `+ query.params.callerfnc.join(' > ')
      result.sql = prepareQuery
  
      return result
    } catch (err) {
      throw errorHelper.createError(err)
    }
  },
  createParameter (method, req) {
    const params = {}
    params.originalUrl = req.originalUrl
    params.callerfnc = []
    if (method !== undefined) {
      params.callerfnc.push(functionName(method))
    }
    return params
  },
  addParameterMethod (method, params) {
    if (params.callerfnc === undefined) {
      params.callerfnc = []
    }
  
    if (method !== undefined) {
      if(!~params.callerfnc.indexOf(functionName(method))){
        params.callerfnc.push(functionName(method))
      }
    } 
  
    return params
  },
  encodeding1 (data, process) {
    const url = `https://internal.silkspan.com/nop/encoding/encode_decode.asp?process=${process}&data=${data.replace(/\+/g, '%2B')}`
    return new Promise((resolve) => {
      https.get(url, (response) => {
        response.on('data', (chunk) => {
          const datatemp = chunk.toString()
          resolve(datatemp)
        })
        response.on('end', () => {})
      })
    })
  }
}

export default dbHelper