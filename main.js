const auth0 = require('./src/helper/auth0-management-api')
const middleware = require('./src/middleware')
const routes = require('./src/routes')
const express = require('express')
const config = require('config')

let accessToken
const app = express()

app.use((req, res, next) => {
  req.accessToken = accessToken

  next()
})
app.use(middleware)
app.use(routes)

const server = app.listen(config.get('port'))
console.log('Server is listening...')

const handleError = (err) => {
  console.log(err)
  console.log('Server is closing...')
  server.close()
}

auth0.getAccessToken()
  .then(body => {
    accessToken = body.access_token

    auth0.silentCheck((err, body) => {
      if (err) return handleError(err)

      accessToken = body.access_token
      console.log('Access token renewed!')
    })
  })
  .catch(err => {
    handleError(err)
  })
