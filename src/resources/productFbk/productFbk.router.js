import { Router } from 'express'
import controllers from './productFbk.controllers'

const router = Router()

// /api/product
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)

// /api/product/:id
router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router