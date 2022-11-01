import { ProductFbk } from '../productFbk.model'
import mongoose from 'mongoose'

describe('ProductFbk model', () => {
  describe('schema', () => {
    test('name', () => {
      const name = ProductFbk.schema.obj.name
      expect(name).toEqual({
        type: String,
        required: true,
        trim: true,
        maxlength: 50
      })
    })

    test('status', () => {
      const status = ProductFbk.schema.obj.status
      expect(status).toEqual({
        type: String,
        required: true,
        enum: ['active', 'complete', 'pastdue'],
        default: 'active'
      })
    })

    test('notes', () => {
      const notes = ProductFbk.schema.obj.notes
      expect(notes).toEqual(String)
    })

    test('due', () => {
      const due = ProductFbk.schema.obj.due
      expect(due).toEqual(Date)
    })

    test('createdBy', () => {
      const createdBy = ProductFbk.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      })
    })

    test('list', () => {
      const list = ProductFbk.schema.obj.list
      expect(list).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'list',
        required: true
      })
    })
  })
})
