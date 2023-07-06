
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "entity",
    "model": model,
    "modelName": "Entity",
    "routes": routes,
    "admin": {
        "list": {
            "header":[{"name":"title","type":"object","key":"fa"},{"name":"createdAt"},{"name":"updatedAt"}]
        },
        "create": {
            "fields":[{"name":"title"},]
        },
        "edit": {
            "fields":[{"name":"title"},]
        },
    },
    "views": [{
        "func": (req, res, next) => {
        }
    }],
    "edits": [{
        "func": (req, res, next) => {
        }
    }],

}