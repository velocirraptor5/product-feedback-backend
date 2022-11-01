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

//get user by nikname
export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ nikname: req.params.nikname })
      .lean()
      .exec()

    if (!user) {
      return res.status(400).end()
    }

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}