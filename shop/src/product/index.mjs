import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "product",
    "model": model,
    "modelName": "Product",
    "routes": routes,

    "admin": {
        "list": {
            "header": [
                {"name": "thumbnail", "type": "image"},
                {"name": "title", "type": "multiLang"},
                {"name": "productCategory", "type": "object"},

                {"name": "createdAt", "type": "date"},
                {"name": "updatedAt", "type": "date"},
                {"name": "actions", "type": "actions", "edit": true, "delete": true},
            ]
        },
        "create": {
            "fields": [
                {"name": "title", "type": "object", "kind": "multiLang", "size": {"lg": 12, "sm": 12}},
                {"name": "slug", "type": "string", "size": {"lg": 6, "sm": 12}},
                {
                    "name": "productCategory",
                    "label": "Category",
                    "type": "checkbox",
                    "entity": "productCategory",
                    "limit": 2000,
                    "size": {"lg": 6, "sm": 12}
                },
                {"name": "excerpt", "type": "object", "kind": "multiLang", "size": {"lg": 12, "sm": 12}},
                {"name": "description", "type": "object", "kind": "multiLang", "size": {"lg": 12, "sm": 12}},
                {
                    "name": "type",
                    "type": "select",
                    "options": [{"label": "normal", "value": "normal", "name": "normal"}, {
                        "label": "variable",
                        "value": "variable",
                        "name": "variable"
                    }]
                },
                {"name": "price", "type": "price"},
                {"name": "salePrice", "type": "price"},
                {"name": "in_stock", "type": "boolean"},
                {"name": "quantity", "type": "number"},
                {
                    "name": "options",
                    "type": "array",
                    "size": {"lg": 12, "sm": 12},
                    "child": [
                        {
                            "name": "name", "type": "select",
                            "entity": "attributes",
                            "limit": 2000,
                            "size": {"lg": 6, "sm": 6}
                        },
                        {"name": "values", "type": "multiSelect", "size": {"lg": 6, "sm": 6}},
                    ]
                },
                {
                    "name": "combinations", "type": "array",
                    "size": {"lg": 12, "sm": 12},
                    "child": [
                        {"name": "options", "type": "object", "size": {"lg": 3, "sm": 6}},
                        {"name": "price", "type": "price", "size": {"lg": 3, "sm": 6}},
                        {"name": "salePrice", "type": "price", "size": {"lg": 3, "sm": 6}},
                        {
                            "name": "in_stock",
                            "type": "boolean", "size": {"lg": 3, "sm": 6}
                        },
                        {"name": "quantity", "type": "number", "size": {"lg": 3, "sm": 6}},
                        {"name": "weight", "type": "number", "size": {"lg": 3, "sm": 6}},
                        {"name": "thumbnail", "type": "image", "size": {"lg": 3, "sm": 6}},
                    ]
                },
                {
                    "name": "attributes",
                    "type": "checkboxes",
                    "entity": "attributes",
                    "initialChild" :{
                        "attribute": "",
                        "values": []
                    },
                    "size": {"lg": 12, "sm": 12},
                    "child": [
                        {
                            "name": "attribute",
                            "type": "select",
                            "entity": "attributes",
                            "optionName": "slug",
                            "optionValue": "slug",
                            "defaultValue": null,
                            "limit": 1000, "size": {"lg": 6, "sm": 6}
                        },
                        {"name": "values", "type": "checkbox", "size": {"lg": 6, "sm": 6}},
                    ]
                },
                {
                    "name": "status",
                    "type": "select",
                    "options": [{
                        "label": "published",
                        "value": "published",
                        "name": "published"
                    }, {"label": "processing", "value": "processing", "name": "processing"}, {
                        "label": "draft",
                        "value": "draft",
                        "name": "draft"
                    }],
                    "size": {"lg": 12, "sm": 12}
                },
                {"name": "thumbnail","label":"Thumbnail", "type": "images", "size": {"lg": 12, "sm": 12}},
                {"name": "photos","label":"Gallery", "type": "arrayOfImages", "size": {"lg": 12, "sm": 12}},


            ]
        },
        "edit": {
            "fields": [
                {"name": "_id", "type": "string", "disabled": true},
                {"name": "title", "type": "object", "kind": "multiLang", "size": {"lg": 12, "sm": 12}},
                {"name": "slug", "type": "string", "size": {"lg": 6, "sm": 12}},
                {
                    "name": "productCategory",
                    "label": "Category",
                    "type": "checkbox",
                    "entity": "productCategory",
                    "limit": 2000,
                    "size": {"lg": 6, "sm": 12}
                },
                {"name": "excerpt", "type": "object", "kind": "multiLang", "size": {"lg": 12, "sm": 12}},
                {"name": "description", "type": "object", "kind": "multiLang", "size": {"lg": 12, "sm": 12}},
                {
                    "name": "type",
                    "type": "select",
                    "options": [{"label": "normal", "value": "normal", "name": "normal"}, {
                        "label": "variable",
                        "value": "variable",
                        "name": "variable"
                    }]
                },
                {"name": "price", "type": "price"},
                {"name": "salePrice", "type": "price"},
                {"name": "in_stock", "type": "boolean"},
                {"name": "quantity", "type": "number"},
                {
                    "name": "options",
                    "type": "array",
                    "size": {"lg": 12, "sm": 12},
                    "child": [
                        {
                            "name": "name", "type": "select",
                            "entity": "attributes",
                            "limit": 2000,
                        },
                        {"name": "values", "type": "multiSelect"},
                    ]
                },
                {
                    "name": "combinations", "type": "array",
                    "size": {"lg": 12, "sm": 12},
                    "child": [
                        {"name": "options", "type": "object", "size": {"lg": 3, "sm": 6}},
                        {"name": "price", "type": "price", "size": {"lg": 3, "sm": 6}},
                        {"name": "salePrice", "type": "price", "size": {"lg": 3, "sm": 6}},
                        {"name": "in_stock", "type": "boolean", "size": {"lg": 3, "sm": 6}},
                        {"name": "quantity", "type": "number", "size": {"lg": 3, "sm": 6}},
                        {"name": "weight", "type": "number", "size": {"lg": 3, "sm": 6}},
                        {"name": "thumbnail", "type": "image", "size": {"lg": 3, "sm": 6}},
                    ]
                },

                {
                    "name": "attributes",
                    "type": "checkboxes",
                    "size": {"lg": 12, "sm": 12},
                    "entity": "attributes",
                    "initialChild" :{
                        "attribute": "",
                        "values": []
                    },
                    "child": [
                        {
                            "name": "attribute",
                            "type": "select",
                            "entity": "attributes",
                            "optionName": "slug",
                            "optionValue": "_id",
                            "defaultValue": null,
                            "limit": 1000, "size": {"lg": 6, "sm": 6}
                        },
                        {"name": "values", "type": "checkbox", "size": {"lg": 6, "sm": 6}},
                    ]
                },
                {
                    "name": "status",
                    "type": "select",
                    "options": [{
                        "label": "published",
                        "value": "published",
                        "name": "published"
                    }, {"label": "processing", "value": "processing", "name": "processing"}, {
                        "label": "draft",
                        "value": "draft",
                        "name": "draft"
                    }],
                    "size": {"lg": 12, "sm": 12}
                },
                {"name": "thumbnail","label":"Thumbnail", "type": "image", "size": {"lg": 12, "sm": 12}},

                {"name": "photos","label":"Gallery", "type": "images", "size": {"lg": 12, "sm": 12}},

            ]
        },
    },
    "front": [{
        "routes": (req, res, next) => {
        }
    }],
    "views": [{
        "func": (req, res, next) => {
        }
    }],
    "edits": [{
        "func": (req, res, next) => {
        }
    }],
    "sitemap":true

}