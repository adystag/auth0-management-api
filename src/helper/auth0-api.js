const request = require('request')
const config = require('config')

const requestOptions = {
  method: 'POST',
  url: config.get('auth0Api.url'),
  headers: {
    'content-type': 'application/json'
  },
  body: `{ "client_id": "${config.get('auth0Api.clientId')}", "client_secret": "${config.get('auth0Api.clientSecret')}", "audience": "${config.get('auth0Api.audience')}", "grant_type": "client_credentials" }`
}

module.exports = {
  getAccessToken () {
    return new Promise((resolve, reject) => {
      request(requestOptions, (error, response, body) => {
        if (error) reject(error)

        resolve(JSON.parse(body))
      })
    })
  },

  silentCheck (cb, time) {
    setTimeout(() => {
      this.getAccessToken()
        .then(body => {
          cb(null, body)
        })
        .catch(err => {
          cb(err, null)
        })

      this.silentCheck(cb, time)
    }, time || (8 * 60 * 60 * 1000))
  }
}
