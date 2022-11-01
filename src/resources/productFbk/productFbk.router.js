import { Router } from 'express'
import controllers, { setId } from './productFbk.controllers'


const router = Router()

// /api/product
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)

// /api/product/:id
router
  .route('/:id')
  .all(setId)
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)

export default router
