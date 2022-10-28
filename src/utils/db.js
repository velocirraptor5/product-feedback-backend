import mongoose from 'mongoose'
import options from '../config'


export const connect = (url = options.dbUrl, opts = {}) => {
  return mongoose.connect(
    url,
    // { ...opts, useNewUrlParser: true }
    {
      useNewUrlParser: true,
      autoIndex: true,
      auth: {
        authSource: "admin" //TODO check mongo db to create user whit out root
      }
    }
  )
}
