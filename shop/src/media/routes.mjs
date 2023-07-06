import controller from './controller.mjs'
export default [{
        "path": "/fileUpload",
        "method": "post",
        "access": "admin_user",
        "controller": controller.fileUpload,

    }
]