import mongoose from 'mongoose'

const productFbkSchema = new mongoose.Schema(
  {
    seq: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'complete', 'pastdue'],
      default: 'active'
    },
    upvotes: {
      type: Number,
      required: true,
      default: 0
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['UI', 'UX', 'Enhacement', 'bug', 'feature', 'other'],
      default: 'other'
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    comments: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'comment',
    }]
  },
  { timestamps: true }
)
// increment seq on new productFbk
productFbkSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next()
  }
  // get last seq
  this.constructor.findOne()
    .sort({ seq: -1 })
    .exec((err, doc) => {
      if (err) {
        return next(err)
      }
      // set seq to last seq + 1
      this.seq = doc ? doc.seq + 1 : 1
      next()
    })
})

// delete all comments and replies when productFbk is deleted
productFbkSchema.post('findOneAndRemove', (productFbk, next) => {
  // get all comments
  mongoose.model('comment').find({ productFbk: productFbk._id }, (err, comments) => {
    if (err) {
      return next(err)
    }

    // function to delete all comments replies
    const deleteReplies = (comment, cb) => {
      // get all replies
      mongoose.model('comment').find({ repliesTo: comment._id }, (err, replies) => {
        if (err) {
          return cb(err)
        }
        // delete all replies
        mongoose.model('comment').deleteMany({ repliesTo: comment._id }, (err, result) => {
          if (err) {
            return cb(err)
          }
          // if there are replies, delete their replies
          if (replies.length) {
            replies.forEach(reply => {
              deleteReplies(reply, cb)
            })
          }
          cb()
        })
      })
    }
    // delete all comments replies
    comments.forEach(comment => {
      deleteReplies(comment, err => {
        if (err) {
          return next(err)
        }
      })
    })


    // delete all comments
    mongoose.model('comment').deleteMany({ productFbk: productFbk._id }, (err, res) => {
      if (err) {
        return next(err)
      }
    })
  })
  next()
})

export const ProductFbk = mongoose.model('productFbk', productFbkSchema)
