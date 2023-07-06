
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "media",
    "model": model,
    "modelName": "Media",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "url", "type": "string"},
                {"name": "createdAt", "type": "string"},
                {"name": "updatedAt", "type": "string"},
                {"name": "actions", "type": "actions", "edit": true}

            ],
        },
        "create": {
            "fields": [
                {name: "url", type: "string"},
                {name: "type", type: "string"},
            ]
        }
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