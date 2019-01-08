const config = require('config').get('auth0')
const jwksRsa = require('jwks-rsa')
const jwt = require('express-jwt')

module.exports = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.jwksUri
  }),
  audience: config.appId,
  issuer: `${config.domain}/`,
  algorithms: ['RS256']
})
