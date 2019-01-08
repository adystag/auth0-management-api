const auth = require('../middleware/auth')
const express = require('express')
const me = require('./me')

const router = express.Router()

router.get('/', (req, res) => {
  res.send({
    code: 200,
    message: 'Hello world!',
    data: [
      'Hello',
      'world',
      '!'
    ],
    meta: {}
  })
})

router.use('/me', auth, me)

router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({
      code: 401,
      message: err.message,
      data: {},
      meta: {}
    })
  }

  console.log(err)

  res.status(500).send({
    code: 500,
    message: 'Internal server error',
    data: [],
    meta: {}
  })
})

module.exports = router
