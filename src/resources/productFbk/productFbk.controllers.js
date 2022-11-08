import { crudControllers } from '../../utils/crud'
import { ProductFbk } from './productFbk.model'

// change id to seq
export const setId = async (req, res, next) => {
    try {
        // get doc thats being requested
        const doc = await ProductFbk
            .findOne({ seq: req.params.id })
            .lean()
            .exec()

        if (!doc) {
            return res.status(400).send("No productFbk found with id: " + req.params.id)
        }

        req.params.id = doc._id
        next()

    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export default crudControllers(ProductFbk)
