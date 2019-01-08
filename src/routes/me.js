const auth0 = require('../helper/auth0-management-api')
const express = require('express')
const joi = require('joi')

const router = express.Router()

router.post('/email', (req, res, next) => {
  const { error } = joi.validate(req.body, {
    email: joi.string().email().required()
  })

  if (error) {
    return next(error)
  }

  next()
}, async (req, res, next) => {
  try {
    const result = await auth0.updateEmail(req.accessToken, req.user.sub, req.body.email)

    res.send(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
