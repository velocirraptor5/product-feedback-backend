import { Router } from 'express'
import { me, updateMe, getUser } from './user.controllers'

const router = Router()

// /api/user
router.get('/', me)
router.put('/', updateMe)

// /api/user/:nikname
router
    .route('/:nikname')
    .get(getUser)
export default router
