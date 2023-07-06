import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "attributes",
    "model": model,
    "modelName": "Attributes",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "name", "type": "multiLang"},
                {"name": "slug", "type": "string"},
                {"name": "type", "type": "string"},
                {"name": "actions", "type": "actions", "edit": true, "delete": true}

            ],
        },
        "create": {
            "fields": [
                {"name": "name", "type": "object", "kind": "multiLang", "size": {"lg": 12, "sm": 12}},
                {"name": "slug", "type": "string"},
                {"name": "order", "type": "number"},
                {"name": "kind", "type": "string"},
                {
                    "name": "values",
                    "type": "array",
                    "child": [
                        {"name": "name", "type": "object", "kind": "multiLang",},
                        {"name": "slug", "type": "string"},
                        {"name": "color", "type": "color"},

                    ],
                    "size": {"lg": 12, "sm": 12}
                },
                {"name": "image", "type": "image"}
            //     {
            //         "name": "parent",
            //         "type": "select",
            //         "entity": "attributes",
            //         "optionName": "slug",
            //         "optionValue": "_id",
            //         "defaultValue": null,
            //         "limit": 2000,
            //     },
            ]
        },
        "edit": {
            "fields": [
                {"name": "_id", "type": "string", "disabled": true},
                {"name": "name", "type": "object", "kind": "multiLang", "size": {"lg": 12, "sm": 12}},
                {"name": "slug", "type": "string"},
                {"name": "order", "type": "number"},
                {"name": "kind", "type": "string"},
                {
                    "name": "values",
                    "type": "array",
                    "child": [
                        {"name": "name", "type": "object", "kind": "multiLang",},
                        {"name": "slug", "type": "string"},
                        {"name": "color", "type": "color"},

                    ],
                    "size": {"lg": 12, "sm": 12}
                },
                {"name": "image", "type": "image"},
                // {
                //     "name": "parent",
                //     "type": "select",
                //     "entity": "attributes",
                //     "optionName": "slug",
                //     "optionValue": "_id",
                //     "defaultValue": null,
                //     "limit": 2000,
                // },
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