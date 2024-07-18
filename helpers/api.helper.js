import axios from '../node_modules/axios'

const get = async (url, config) => {
  try {
    let options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }

    if (config !== undefined) {
      options = config
    }

    let result = await axios.get(url, options).catch((error) => {
      result = {}
    })

    if (result && result.status === 200 && result.statusText === 'OK') {
      result = result.data
    } else {
      result = {}
    }

    return result
  } catch (error) {
    throw error
  }
}

const post = async (url, data, config) => {
  try {
    let options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }

    if (config !== undefined) {
      options = config
    }

    let result = await axios.post(url, data, options).catch((error) => {
    })
    if (result && result.status === 200 && result.statusText === 'OK') {
      result = result.data
    } else if (result && result.status === 202 && result.data === 'accepted') {
      result = result.data
    } else {
      result = {}
    }

    return result
  } catch (error) {
    throw error
  }
}

export default { get, post }
