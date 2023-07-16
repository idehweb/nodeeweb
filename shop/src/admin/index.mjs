import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "admin",
    "model": model,
    "modelName": "Admin",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "email", "type": "string"},
                {"name": "username", "type": "string"},
                {"name": "nickname", "type": "string"},
                {"name": "active", "type": "boolean"},
                {"name": "createdAt", "type": "date"},
                {"name": "updatedAt", "type": "date"},
                {"name": "actions", "type": "actions", "edit": true, "delete": true}
            ],

        },

        "create": {
            "fields": [
                {name: "email", type: "string"},
                {name: "username", type: "string"},
                {name: "nickname", type: "string"},
                {name: "password", type: "string"},
                {name: "type", type: "string"}
            ]
        },
        "edit": {
            "fields": [
                {name: "email", type: "string"},
                {name: "username", type: "string"},
                {name: "nickname", type: "string"},
                {name: "password", type: "string"},
                {name: "type", type: "string"}
            ]
        },
    },

    "access": ["admin"],

    "views": [{
        "func": (req, res, next) => {
        }
    }],
    "edits": [{
        "func": (req, res, next) => {
        }
    }],

}