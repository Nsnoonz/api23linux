import requestpromise from 'request-promise'
import request from 'request'

const bfnSendLineNotify = async (params) => {
  let bodyJson = {}
  const tokenId = (params.securetoken || process.env.LINE_SECURETOKEN)
  if (params.type === 'flex') {
    bodyJson = JSON.stringify({
      to: params.lineid,
      secureToken: tokenId,
      name: params.linename,
      username: params.username,
      messages: [{
        type: params.type,
        text: 'flex',
        altText: params.altText,
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: params.text,
                wrap: true
              },
              {
                type: 'separator'
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: params.textlink,
                action: {
                  type: 'uri',
                  label: 'action',
                  uri: params.linkweb
                },
                align: 'center',
                offsetTop: 'md',
                weight: 'bold',
                color: '#1a6fc2'
              }
            ],
            offsetBottom: 'lg'
          }
        }
      }]
    })
  } else if (params.type === 'image') {
    bodyJson = JSON.stringify({ secureToken: tokenId, to: params.lineid, name: params.linename, username: params.username, messages: [{ type: 'image', text: '', originalContentUrl: params.originalcontenturl, previewImageUrl: params.previewimageurl }] })
  } else if (params.type === 'video') {
    bodyJson = JSON.stringify({ secureToken: tokenId, to: params.lineid, name: params.linename, username: params.username, messages: [{ type: 'video', text: '', originalContentUrl: params.originalcontenturl, previewImageUrl: params.previewimageurl }] })
  } else if (params.type === 'sticker') {
    bodyJson = JSON.stringify({ secureToken: tokenId, to: params.lineid, name: params.linename, username: params.username, messages: [{ type: 'sticker', text: '', packageId: params.packageId, stickerId: params.stickerId }] })
  } else if (params.type === 'location') {
    bodyJson = JSON.stringify({ secureToken: tokenId, to: params.lineid, name: params.linename, username: params.username, messages: [{ type: 'location', text: '', title: params.title, address: params.address, latitude: params.latitude, longitude: params.longitude }] })
  } else if (params.type === 'imagemap') {
    if (params.checkuri === 2) {
      bodyJson = JSON.stringify({
        to: params.lineid,
        secureToken: tokenId,
        text: params.baseUrl + '?w=auto',
        name: params.linename,
        username: params.username,
        messages: [{
          type: 'imagemap',
          text: '',
          baseUrl: params.baseUrl + '?w=auto',
          altText: params.altText,
          baseSize: {
            width: params.imgsize_w,
            height: params.imgsize_h
          },
          actions:
        [
          {
            type: 'uri',
            linkUri: params.linkUri1,
            area: {
              x: params.location_x,
              y: params.location_y,
              width: params.width,
              height: params.height
            }
          },
          {
            type: 'uri',
            linkUri: params.linkUri2,
            area: {
              x: params.location_x2,
              y: params.location_y2,
              width: params.width2,
              height: params.height2
            }
          }
        ]
        }]
      })
    } else {
      bodyJson = JSON.stringify({
        to: params.lineid,
        secureToken: tokenId,
        text: params.baseUrl + '?w=auto',
        name: params.linename,
        username: params.username,
        messages: [{
          type: 'imagemap',
          text: '',
          baseUrl: params.baseUrl + '?w=auto',
          altText: params.altText,
          baseSize: {
            width: params.imgsize_w,
            height: params.imgsize_h
          },
          actions:
            [
              {
                type: 'uri',
                linkUri: params.linkUri3,
                area: {
                  x: params.location_x3,
                  y: params.location_y3,
                  width: params.width3,
                  height: params.height3
                }
              }
            ]
        }]
      })
    }
  } else {
    bodyJson = JSON.stringify({ secureToken: tokenId, to: params.lineid, name: params.linename, username: params.username, messages: [{ type: 'text', text: params.message }] })
  }
  const postOption = {
    headers: { 'content-type': 'application/json' },
    uri: process.env.URL_LINE_PUSH_MESSAGE,
    method: 'post',
    strictSSL: false,
    body: bodyJson
  }

  let result = await requestpromise(postOption)
  if (typeof result !== 'object') {
    result = JSON.parse(result)
  }
  return result
}

const bfnSendLine1on1 = async (params) => {
  const data = {}
  try {
    let resData = {}
    const token = params.token
    const message = params.message
    request({
      method: 'POST',
      uri: 'https://notify-api.line.me/api/notify',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
        bearer: token
      },
      form: {
        message
      }
    }, (err, httpResponse, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      } else {
        resData = {
          httpResponse,
          body
        }
      }
    })

    data.data = resData
    data.message = 'OK'
    data.success = true
    data.status = 200
  } catch (err) {
    data.data = null
    data.message = err.message
    data.success = false
    data.status = 501
  }
  return data
}

export default { bfnSendLineNotify, bfnSendLine1on1 }
