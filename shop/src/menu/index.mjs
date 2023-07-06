import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "menu",
    "model": model,
    "modelName": "Menu",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "name", "type": "multiLang"},
                {"name": "slug", "type": "string"},
                {"name": "order", "type": "number"},
                {"name": "parent", "type": "string"},
                {"name": "actions", "type": "actions", "edit": true}

            ],
        },
        "create": {
            "fields": [
                {name: "name", type: "object"},
                {name: "slug", type: "string"},
                {name: "image", type: "string"},
                {name: "order", type: "number"},
                {name: "kind", type: "string"},
                {name: "link", type: "string"},
                {name: "icon", type: "string"},
                {name: "data", type: "object"},
                // {name: "parent", type: "reference", reference: "Menu"}
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