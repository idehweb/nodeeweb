import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "discount",
    "model": model,
    "modelName": "Discount",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "name", "type": "multiLang"},
                {"name": "slug","type": "string"},
                {"name": "price","type": "number"},
                {"name": "percent","type": "number"},
                {"name": "count","type": "number"},
                {"name": "createdAt","type": "date"},
                {"name": "updatedAt","type": "date"},
                {"name":"actions","type":"actions","edit":true,"delete":true},

            ]
        },
        "create": {
            "fields": [
                {"name": "name", "type": "string"},
                {"name": "slug", "type": "string"},
                {"name": "count", "type": "string"},
                {"name": "price", "type": "string"},
                {"name": "createdAt", "type": "date"},
                {"name": "updatedAt", "type": "date"},
            ]
        },
        "edit": {
            "fields": [
                {"name": "name", "type": "string"},
                {"name": "slug", "type": "string"},
                {"name": "count", "type": "string"},
                {"name": "price", "type": "string"},
                {"name": "createdAt", "type": "date"},
                {"name": "updatedAt", "type": "date"},
            ]
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