import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "template",
    "model": model,
    "modelName": "Template",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "title", "type": "string"},
                {"name": "type", "type": "string"},
                {"name": "createdAt", "type": "date"},
                {"name": "updatedAt", "type": "date"},
                {"name": "actions", "type": "actions", "edit": true,"delete":true,"pageBuilder":true}

            ],
        },

        "create": {
            "fields": [
                {"name": "title", "type": "string"},
                {"name": "type", "type": "string"},
                {"name": "maxWidth", "type": "string"},
                {"name": "classes", "type": "string"},
                {"name": "padding", "type": "string"},
                {"name": "backgroundColor", "type": "string"},
            ]
        },
        "edit": {
            "fields": [
                {"name": "title", "type": "string"},
                {"name": "type", "type": "string"},
                {"name": "maxWidth", "type": "string"},
                {"name": "classes", "type": "string"},
                {"name": "padding", "type": "string"},
                {"name": "backgroundColor", "type": "string"},

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