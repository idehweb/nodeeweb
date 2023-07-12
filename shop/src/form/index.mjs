
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "form",
    "model": model,
    "modelName": "Form",
    "routes": routes,

    "admin": {
        "list": {
            "header":[
                {"name":"title","type":"string"},
                {"name": "updatedAt","type":"date"},
                {"name": "actions","type":"actions","edit":true,"delete":true,"pageBuilder":true},

            ]
        },
        "create": {
            "fields":[{"name":"title","type":"string"},]
        },
        "edit": {
            "fields":[{"name":"title","type":"string"},]

        },
    },
    "views": {
        "builder":[ {
            "label": "one line - text field",
            "name": "textfield",
            "addable": false,
            "settings": {
                "general": {},
                "design": [{"name": "padding", "type": "string"}],
            }
        },{
            "label": "multi line - text area",
            "name": "textarea",
            "addable": false,
            "settings": {
                "general": {},
                "design": [{"name": "padding", "type": "string"}],
            }
        },{
            "label": "select - options",
            "name": "selectoptions",
            "addable": false,
            "settings": {
                "general": {},
                "design": [{"name": "padding", "type": "string"}],
            }
        },{
            "label": "checkbox",
            "name": "checkbox",
            "addable": false,
            "settings": {
                "general": {},
                "design": [{"name": "padding", "type": "string"}],
            }
        },{
            "label": "radio buttons",
            "name": "radio",
            "addable": false,
            "settings": {
                "general": {},
                "design": [{"name": "padding", "type": "string"}],
            }
        }]
    },
    "edits": [{
        "func": (req, res, next) => {
        }
    }],

}