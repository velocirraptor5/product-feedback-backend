import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },
    productFbk: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'productFbk',
      required: false
    },
    replies: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'comment'
      }
    ],
    repliesTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'comment',
      required: false
    }
  },
  { timestamps: true }
)

// pre save hook
commentSchema.pre('save', function (next) {
  //verify productFbk exists
  if (this.productFbk) {
    mongoose.model('productFbk').findById(this.productFbk, (err, productFbk) => {
      if (err) {
        return next(err)
      }
      if (!productFbk) {
        const err = new Error('productFbk not found')
        err.status = 404
        return next(err)
      }
    })
  }
  // verify if parent comment exists
  if (this.repliesTo) {
    mongoose.model('comment').findById(this.repliesTo, (err, comment) => {
      if (err) {
        return next(err)
      }
      if (!comment) {
        const err = new Error('comment not found')
        err.status = 404
        return next(err)
      }
    })
  }
  next()
})


// post save hook
commentSchema.post('save', function (comment, next) {
  // add comment to parent comment
  if (comment.repliesTo) {
    mongoose.model('comment').findByIdAndUpdate(
      comment.repliesTo,
      { $push: { replies: comment._id } },
      { new: true },
      (err, comment) => {
        if (err) {
          return next(err)
        }
        if (!comment) {
          const err = new Error('comment not found')
          err.status = 404
          return next(err)
        }
      }
    )
  }
  // add comment to productFbk
  if (comment.productFbk) {
    mongoose.model('productFbk').findByIdAndUpdate(
      comment.productFbk,
      { $push: { comments: comment._id } },
      { new: true },
      (err, productFbk) => {
        if (err) {
          return next(err)
        }
        if (!productFbk) {
          const err = new Error('productFbk not found')
          err.status = 404
          return next(err)
        }
      }
    )
  }
  next()
})

//post remove hook
commentSchema.post('findOneAndRemove', function (comment, next) {
  // remove comment from parent comment
  if (comment.repliesTo) {
    mongoose.model('comment').findByIdAndUpdate(
      comment.repliesTo,
      { $pull: { replies: comment._id } },
      { new: true },
      (err, comment) => {
        if (err) {
          return next(err)
        }
        if (!comment) {
          const err = new Error('comment not found')
          err.status = 404
          return next(err)
        }
      }
    )
  }
  // remove comment from productFbk
  if (comment.productFbk) {
    mongoose.model('productFbk').findByIdAndUpdate(
      comment.productFbk,
      { $pull: { comments: comment._id } },
      { new: true },
      (err, productFbk) => {
        if (err) {
          return next(err)
        }
        if (!productFbk) {
          const err = new Error('productFbk not found')
          err.status = 404
          return next(err)
        }
      }
    )
  }
  // remove replies
  if (comment.replies.length > 0) {
    mongoose.model('comment').deleteMany(
      { _id: { $in: comment.replies } },
      (err, comments) => {
        if (err) {
          return next(err)
        }
        if (!comments) {
          const err = new Error('comments not found')
          err.status = 404
          return next(err)
        }
      }
    )
  }

  next()
})

export const Comment = mongoose.model('comment', commentSchema)
