import http from 'http'
import https from 'https'

const encodeding1 = (data, process, path = 'api23win/default') => {
    const url = `https://internal.silkspan.com/nop/encoding/fnc_encode_decode.asp?dbserver=&dbname=&process=${process}&data=${data.replace(/\+/g, '%2B')}&path=${path}`
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
  
  const encodeding2 = (data, process, path = 'api23win/default') => {
    const url = `http://192.168.0.4/nop/encoding/fnc_encode_decode.asp?dbserver=&dbname=&process=${process}&data=${data.replace(/\+/g, '%2B')}&path=${path}`
    return new Promise((resolve) => {
      http.get(url, (response) => {
        response.on('data', (chunk) => {
          const datatemp = chunk.toString()
          resolve(datatemp)
        })
        response.on('end', () => {})
      })
    })
  }

  export default { encodeding1, encodeding2 }