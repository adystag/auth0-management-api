const auth0Api = require('./src/helper/auth0-api')
const express = require('express')
const config = require('config')

auth0Api.getAccessToken()
  .then((body) => {
    let accessToken = body.access_token
    const app = express()

    app.use((req, res, next) => {
      req.accessToken = body.access_token

      next()
    })
    app.get('/', (req, res, next) => {
      res.send({
        accessToken: accessToken
      })
    })

    const server = app.listen(config.get('port'))
    console.log('Server listening...')

    auth0Api.silentCheck((err, body) => {
      if (err) {
        console.log(err)
        console.log('Server closing...')

        return server.close()
      }

      accessToken = body.access_token
    })
  })
  .catch(err => {
    console.log(err)
  })
