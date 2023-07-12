
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "entry",
    "model": model,
    "modelName": "Entry",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name":"trackingCode","type":"string"},
                {"name":"form","type":"reference","reference":"Form"},
                {"name": "updatedAt","type":"date"},
                {"name": "actions","type":"actions","edit":true,"delete":true},

            ]
        },
        "create": {
            "fields": [{"name": "title", "type": "string"},]
        },
        "edit": {
            "fields": [
                {"name": "statusCode", "type": "string"},
                {"name": "amount", "type": "string"},
                {"name": "Authority", "type": "string"},
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