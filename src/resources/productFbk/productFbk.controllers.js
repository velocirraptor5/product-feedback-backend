import { crudControllers } from '../../utils/crud'
import { ProductFbk } from './productFbk.model'

// change id to seq
export const setId = async (req, res, next) => {
    try {
        // get doc thats being requested
        console.log("req.params.id in controller", req.params.id);
        const doc = await ProductFbk
            .findOne({ seq: req.params.id })
            .lean()
            .exec()

        if (!doc) {
            return res.status(400).send("No productFbk found with that seq")
        }

        req.params.id = doc._id
        console.log("req.params.id in controller", req.params.id);
        next()

    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export default crudControllers(ProductFbk)
