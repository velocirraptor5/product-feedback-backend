import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
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
    replies: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'comment'
      }
    ],
  },
  { timestamps: true }
)

export const Comment = mongoose.model('comment', commentSchema)
