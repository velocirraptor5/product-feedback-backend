import mongoose from 'mongoose'

const productFbkSchema = new mongoose.Schema(
  {
    seq: {
      type: Number,
      default: 0
    },
    name: {
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

export const ProductFbk = mongoose.model('productFbk', productFbkSchema)
