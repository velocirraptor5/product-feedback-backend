import { User } from './user.model'
import { merge } from 'lodash'


export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}

export const updateMe = async (req, res) => {
  try {
    // merge req.body with req.user
    const updatedUser = merge(req.user, req.body)

    const user = await User.findByIdAndUpdate(req.user._id, updatedUser, {
      new: true
    })
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
