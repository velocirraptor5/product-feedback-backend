import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Need email and password' })
  }
  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.log(e)
    return res.status(400).end()
  }
}

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'Need email and password' })
  }
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(401).send({ message: 'Not auth' })
  }

  try {
    const match = await user.checkPassword(req.body.password)
    if (!match) {
      return res.status(401).send({ message: 'Not auth' })
    }
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.error(e)
    return res.status(401).send({ message: 'Not auth' })

  }
}

export const protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end()
  }

  let token = req.headers.authorization.split('Bearer ')[1]

  if (!token) {
    return res.status(401).end()
  }
  try {
    const payload = await verifyToken(token)

    const user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()
    req.user = user
    next()
  } catch (e) {
    return res.status(401).end()
  }
}

// check user charmander role
export const checkCharmander = (req, res, next) => {
  if (req.user.role !== 'charmander') {
    return res.status(401).send('Puto no sos admin')
  }
  next()
}

// reset user password
export const resetPassword = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({ message: 'Need email' })
  }
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(401).send({ message: 'Not auth' })
  }
  // verify password in req.body
  if (!req.body.newPassword) {
    return res.status(400).send({ message: 'Need  new password' })
  }

  try {
    // update password
    user.password = req.body.newPassword
    await user.save()
    const { password, ...rest } = user.toObject()
    return res.status(201).send({ user: rest }) // return user without password
  } catch (e) {
    console.error(e)
    return res.status(500).send(e)
  }
}

// delete user
export const deleteUser = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({ message: 'Need email' })
  }
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(401).send({ message: 'Not user with email' + req.body.email })
  }
  try {
    await user.remove()
    return res.status(201).send({ message: 'User deleted' })
  } catch (e) {
    console.error(e)
    return res.status(500).send(e)
  }
}