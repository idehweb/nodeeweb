import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import mime from 'mime'
import https from 'https'

var self = ({
    all: function (req, res, next) {
        // console.log('==> all()', Model);
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        let fields = '';
        if (req.headers && req.headers.fields) {
            fields = req.headers.fields
        }
        let search = {};
        if (req.params.search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.params.search,
                "$options": "i"
            };
        }
        if (req.query.search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.search,
                "$options": "i"
            };
        }
        if (req.query.Search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.Search,
                "$options": "i"
            };
        }
        if (req.query) {
            console.log(req.query);
        }
        // return res.json(Model.schema.paths);
        // console.log("Model.schema => ",Model.schema.paths);
        // console.log(Object.keys(req.query));
        let tt = Object.keys(req.query);
        // console.log('type of tt ==> ', typeof tt);
        // console.log("tt => ", tt);
        let Model = req.mongoose.model('Post');

        _.forEach(tt, (item) => {
            // console.log("item => ",item);
            if (Model.schema.paths[item]) {
                // console.log("item exists ====>> ",item);
                // console.log("instance of item ===> ",Model.schema.paths[item].instance);
                let split = req.query[item].split(',');
                if (mongoose.isValidObjectId(split[0])) {
                    search[item] = {
                        $in: split
                    }
                }

            }
            else {
                console.log("filter doesnot exist => ", item);
            }
        });
        console.log('search', search);
        let thef = '';
        if (req.query.filter) {
            if (JSON.parse(req.query.filter)) {
                thef = JSON.parse(req.query.filter);
            }
        }
        console.log('thef', thef);
        if (thef && thef != '')
            search = thef;
        // console.log(req.mongoose.Schema(Model))
        console.log('search', search)
        if(req.query){
            search={...search,...req.query}
        }
        Model.find(search, fields,
            function (err, model) {
                // console.log('req',req.method)
                if (req.headers.response !== "json") {
                    return res.show()

                }
                if (err || !model)
                    return res.json([]);
                Model.countDocuments(search, function (err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        res.json([]);
                        return 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    return res.json(model);

                })
            }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
    },

    importFromWebzi:
        async function (req, res, next) {
//             // return;
//             let Post = req.mongoose.model('Post');
//             let Media = req.mongoose.model('Media');
//
//             console.log('importProducts');
//             const __dirname = path.resolve();
//             let filePath = path.join(__dirname, "./gamihaco.json")
// // console.log('filePath',filePath);
//             fs.readFile(filePath, 'utf8', function (err, data) {
//                 if (err) throw res.json(err);
//                 let allItems = JSON.parse(data);
//                 let parsedBody = allItems.items;
//                 // return res.json(parsedBody);
//
//                 // console.log('parsbody');
//                 var keys = Object.keys(parsedBody);
//                 // res.json(keys);
//                 //
//                 // return;
//                 var start = parseInt(req.params.offset),
//                     end = start + parseInt(req.params.limit);
//                 // console.log();
//
//                 // console.log(typeof parsedBody);
//                 var x = _.range(start, end);
//                 // console.log('x', x);
//
//                 if (parsedBody)
//                     _.map(x, function (key) {
//                         console.log('value', key, parsedBody[key].id);
//                         //
//
//                         req.httpRequest({
//                             method: "get",
//                             url: 'https://gamiha.co/api/blog/post/item?id=' + parsedBody[key].id,
//                         }).then(function (response) {
//                             response = response.data
//                             // console.log('response',response)
//                             if (response.status == 'found') {
//                                 let productt = {
//                                     title: {
//                                         'fa': parsedBody[key].title || null,
//                                     },
//                                     excerpt: {
//                                         'fa': parsedBody[key].excerpt || null,
//                                     },
//                                     description: {
//                                         'fa': response.content || null,
//                                     },
//                                     status: 'published',
//                                     data: parsedBody[key],
//                                     // thumbnail: parsedBody[key].thumbnail,
//
//                                 };
//                                 if (parsedBody[key].thumbnail) {
//
//                                     // console.log('images[', cx, ']', c.src);
//                                     let mainUrl = encodeURI(parsedBody[key].thumbnail);
//                                     let filename =
//                                             parsedBody[key].thumbnail.split('/').pop(),
//                                         name = (global.getFormattedTime() + filename).replace(/\s/g, ''),
//                                         type = path.extname(name),
//                                         mimtype = mime.getType(type),
//                                         filePath = path.join(__dirname, "./public_media/customer/", name),
//                                         fstream = fs.createWriteStream(filePath);
//                                     // console.log('cx', cx);
//
//                                     https.get(mainUrl, function (response) {
//                                         // console.log('getting mainUrl', mainUrl);
//                                         response.pipe(fstream);
//                                     });
//
//                                     // console.log('cx', cx);
//
//                                     fstream.on("close", function () {
//                                         // console.log('images[' + cx + '] saved');
//                                         let url = "customer/" + name,
//                                             obj = [{name: name, url: url, type: mimtype}];
//                                         Media.create({
//                                             name: obj[0].name,
//                                             url: obj[0].url,
//                                             type: obj[0].type
//
//                                         }, function (err, media) {
//                                             if (err) {
//                                                 // console.log({
//                                                 //     err: err,
//                                                 //     success: false,
//                                                 //     message: 'error'
//                                                 // })
//                                             } else {
//                                                 // console.log(cx, ' imported');
//
//                                                 productt.thumbnail = (media.url);
//
//                                                 Post.create(productt, function (err, product) {
//                                                     // console.log('creating product...');
//                                                     if (err || !product) {
//                                                         console.log({
//                                                             err: err,
//                                                             success: false,
//                                                             message: 'error!'
//                                                         });
//                                                         // return 0;
//                                                     }
//                                                     // console.log('img /key ', key, ' created', product._id);
//                                                     res.json({
//                                                         success: true
//                                                     });
//                                                     return;
//                                                 });
//
//                                             }
//                                         });
//
//                                     });
//
//
//                                 } else {
//                                     Post.create(productt, function (err, product) {
//                                         // console.log('creating product with no images...');
//
//                                         if (err || !product) {
//                                             console.log({
//                                                 err: err,
//                                                 success: false,
//                                                 message: 'error!'
//                                             });
//                                             // return 0;
//                                         }
//                                         // console.log('noimg key ', key, ' created', product._id);
//                                         res.json({
//                                             success: true
//                                         });
//                                         return;
//                                     });
//                                 }
//                             }
//                         });
//
//
//                         // const promis2 =
//                         // Promise.all([promis1, promis2]).then((vals) => {
//                         //     console.log('vals', vals);
//                         // })
//
//                     });
//
//
//             });

        },
    importFromWordpress: function (req, res, next) {
        let url = '';
        if (req.query.url) {
            url = req.query.url;
        }


        if (req.query.per_page) {
            url += '?per_page=' + req.query.per_page;
        }
        if (req.query.page) {
            url += '&page=' + req.query.page;
        }
        url += '&type=post';
        // url += '&_embed';

        console.log('importFromWordpress', url);
        let count = 0;
        req.httpRequest({
            method: "get",
            url: url,
        }).then(function (response) {
            count++;
            let x = count * parseInt(req.query.per_page)
            let Post = req.mongoose.model('Post');

            response.data.forEach((dat) => {
                let obj = {};
                if (dat.title) {
                    obj['title'] = {
                        fa: dat.title.rendered

                    }
                }
                if (dat.content) {
                    obj['description'] = {
                        fa: dat.content

                    }
                }

                if (dat.slug) {
                    obj['slug'] = dat.slug + 'x' + x;
                } else {
                    obj['slug'] = dat.title.rendered + 'x' + x;

                }
                // delete dat.yoast_head;
                // delete dat.yoast_head_json;
                obj['data'] = dat;
                obj['status'] = 'published';
                Post.create(obj)
            });
            // return res.json(response.data)
        });


    },
    rewriteProductsImages: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        let Media = req.mongoose.model('Media');
        Product.find({}, function (err, products) {
            _.forEach(products, (item) => {
                // console.log('item', item.data.short_description)
                // console.log('item', item.data.sku)
                // console.log('item', item.data.regular_price)
                // console.log('item', item.data.sale_price)
                // console.log('item', item.data.total_sales)
                // console.log('item', item.data.images)
                let photos = [];
                if (item.photos) {
                    _.forEach((item.photos ? item.photos : []), async (c, cx) => {
                        let mainUrl = encodeURI(c);
                        console.log('images[', cx, ']', mainUrl);

                        let filename =
                                c.split('/').pop(),
                            __dirname = path.resolve(),
                            // name = (req.global.getFormattedTime() + filename).replace(/\s/g, ''),
                            name = filename,
                            type = path.extname(name),
                            mimtype = mime.getType(type),
                            filePath = path.join(__dirname, "./public_media/customer/", name),
                            fstream = fs.createWriteStream(filePath);
                        console.log('name', filename)
                        console.log('getting mainUrl', req.query.url + mainUrl);

                        https.get(req.query.url + mainUrl, function (response) {
                            response.pipe(fstream);
                        });

                        // console.log('cx', cx);

                        fstream.on("close", function () {
                            // console.log('images[' + cx + '] saved');
                            let url = "customer/" + name,
                                obj = [{name: name, url: url, type: mimtype}];
                            // Media.create({
                            //     name: obj[0].name,
                            //     url: obj[0].url,
                            //     type: obj[0].type
                            //
                            // }, function (err, media) {
                            //     if (err) {
                            //         // console.log({
                            //         //     err: err,
                            //         //     success: false,
                            //         //     message: 'error'
                            //         // })
                            //     } else {
                            // console.log(cx, ' imported');

                            // photos.push(media.url);
                            // if (photos.length == item.photos.length) {
                            //     Product.findByIdAndUpdate(item._id, {photos: photos}, function (err, products) {
                            //     })
                            // }
                            //     }
                            // });

                        });


                    });
                } else {
                }
                // if (item.photos)
                //     Product.findByIdAndUpdate(item._id, {thumbnail: item.photos[0]}, function (err, products) {
                //     })

            })
        })
    },

    rewritePosts: function (req, res, next) {
        let Post = req.mongoose.model('Post');
        let Media = req.mongoose.model('Media');
        Post.find({}, function (err, products) {
            _.forEach(products, (item) => {
                // console.log('item', item.data.short_description)
                // console.log('item', item.data.sku)
                // console.log('item', item.data.regular_price)
                // console.log('item', item.data.sale_price)
                // console.log('item', item.data.total_sales)
                // console.log('item', item.data.images)
                let photos = [];
                if (item.data && item.data.yoast_head_json && item.data.yoast_head_json.og_image) {
                    _.forEach((item.data.yoast_head_json.og_image ? item.data.yoast_head_json.og_image : []), async (c, cx) => {
                        let mainUrl = encodeURI(c.url);
                        console.log('images[', cx, ']', mainUrl);

                        let filename =
                                c.url.split('/').pop(),
                            __dirname = path.resolve(),
                            name = (req.global.getFormattedTime() + filename).replace(/\s/g, ''),
                            type = path.extname(name),
                            mimtype = mime.getType(type),
                            filePath = path.join(__dirname, "./public_media/customer/", name),
                            fstream = fs.createWriteStream(filePath);

                        https.get(mainUrl, function (response) {
                            console.log('getting mainUrl', mainUrl);
                            response.pipe(fstream);
                        });

                        // console.log('cx', cx);

                        fstream.on("close", function () {
                            // console.log('images[' + cx + '] saved');
                            let url = "customer/" + name,
                                obj = [{name: name, url: url, type: mimtype}];
                            Media.create({
                                name: obj[0].name,
                                url: obj[0].url,
                                type: obj[0].type

                            }, function (err, media) {
                                if (err) {
                                    // console.log({
                                    //     err: err,
                                    //     success: false,
                                    //     message: 'error'
                                    // })
                                } else {
                                    // console.log(cx, ' imported');

                                    photos.push(media.url);
                                    if (photos.length == item.data.yoast_head_json.og_image.length) {
                                        Post.findByIdAndUpdate(item._id, {photos: photos}, function (err, products) {
                                        })
                                    }
                                }
                            });

                        });


                    });
                } else {
                }
                // if (item.photos)
                //     Post.findByIdAndUpdate(item._id, {thumbnail: item.photos[0]}, function (err, products) {
                //     })

            })
        })
    },
    setPostsThumbnail: function (req, res, next) {
        let Post = req.mongoose.model('Post');
        let Media = req.mongoose.model('Media');
        Post.find({}, function (err, products) {
            _.forEach(products, (item) => {
                // console.log('item', item.data.short_description)
                // console.log('item', item.data.sku)
                // console.log('item', item.data.regular_price)
                // console.log('item', item.data.sale_price)
                // console.log('item', item.data.total_sales)
                // console.log('item', item.data.images)
                // let photos = [];
                // if (item.data && item.data.yoast_head_json && item.data.yoast_head_json.og_image ) {
                //     _.forEach((item.data.yoast_head_json.og_image  ? item.data.yoast_head_json.og_image  : []), async (c, cx) => {
                //         let mainUrl = encodeURI(c.url);
                //         console.log('images[', cx, ']', mainUrl);
                //
                //         let filename =
                //                 c.url.split('/').pop(),
                //             __dirname = path.resolve(),
                //             name = (req.global.getFormattedTime() + filename).replace(/\s/g, ''),
                //             type = path.extname(name),
                //             mimtype = mime.getType(type),
                //             filePath = path.join(__dirname, "./public_media/customer/", name),
                //             fstream = fs.createWriteStream(filePath);
                //
                //         https.get(mainUrl, function (response) {
                //             console.log('getting mainUrl', mainUrl);
                //             response.pipe(fstream);
                //         });
                //
                //         // console.log('cx', cx);
                //
                //         fstream.on("close", function () {
                //             // console.log('images[' + cx + '] saved');
                //             let url = "customer/" + name,
                //                 obj = [{name: name, url: url, type: mimtype}];
                //             Media.create({
                //                 name: obj[0].name,
                //                 url: obj[0].url,
                //                 type: obj[0].type
                //
                //             }, function (err, media) {
                //                 if (err) {
                //                     // console.log({
                //                     //     err: err,
                //                     //     success: false,
                //                     //     message: 'error'
                //                     // })
                //                 } else {
                //                     // console.log(cx, ' imported');
                //
                //                     photos.push(media.url);
                //                     if (photos.length == item.data.yoast_head_json.og_image.length) {
                //                         Post.findByIdAndUpdate(item._id, {photos: photos}, function (err, products) {
                //                         })
                //                     }
                //                 }
                //             });
                //
                //         });
                //
                //
                //     });
                // } else {
                // }
                if (item.photos)
                    Post.findByIdAndUpdate(item._id, {thumbnail: item.photos[0]}, function (err, products) {
                    })

            })
        })
    }

});
export default self;