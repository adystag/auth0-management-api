const config = require('config').get('auth0')
const axios = require('axios')

module.exports = {
  async getAccessToken () {
    try {
      const { data } = await axios.post(
        `${config.domain}/oauth/token`,
        {
          'client_id': `${config.clientId}`,
          'client_secret': `${config.clientSecret}`,
          'audience': `${config.domain}/api/v2/`,
          'grant_type': 'client_credentials'
        },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )

      return data
    } catch (err) {
      throw err.response ? err.response.data : err
    }
  },

  async updateEmail (accessToken, id, email) {
    try {
      const { data } = await axios.patch(
        `${config.domain}/api/v2/users/${id}`,
        {
          email: email,
          email_verified: false
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      axios.post(
        `${config.domain}/api/v2/jobs/verification-email`,
        {
          user_id: id
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      ).catch(err => {
        console.log(err.response ? err.response.data : err)
      })

      return data
    } catch (err) {
      throw err.response ? err.response.data : err
    }
  },

  silentCheck (cb, time) {
    setTimeout(() => {
      this.getAccessToken()
        .then(data => {
          cb(null, data)
        })
        .catch(err => {
          cb(err, null)
        })

      this.silentCheck(cb, time)
    }, time || (8 * 60 * 60 * 1000))
  }
}
