import mongoose from 'mongoose'

const productFbkSchema = new mongoose.Schema(
  {
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

export const ProductFbk = mongoose.model('productFbk', productFbkSchema)
