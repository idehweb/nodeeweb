import _ from 'lodash'
import path from 'path'
import mime from 'mime'
import fs from 'fs'
import https from 'https'
import requestIp from "request-ip";

let self = ({

    getAll: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        if (req.headers.response !== "json") {
            return res.show()

        }
        let sort = { in_stock: -1,updatedAt: -1}

        console.log('getAll()');
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
        if (req.query && req.query.status) {
            search = {...search, status: req.query.status}
            // console.log('****************req.query', req.query);
        }

        // return res.json(Product.schema.paths);
        // console.log("Product.schema => ",Product.schema.paths);
        // console.log(Object.keys(req.query));
        let tt = Object.keys(req.query);
        // console.log('type of tt ==> ', typeof tt);
        // console.log("tt => ", tt);
        _.forEach(tt, (item) => {
            // console.log("item => ",item);
            if (Product.schema.paths[item]) {
                // console.log("item exists ====>> ",item);
                // console.log("instance of item ===> ",Product.schema.paths[item].instance);
                let split = req.query[item].split(',');
                if (req.mongoose.isValidObjectId(split[0])) {
                    search[item] = {
                        $in: split
                    }
                }

            }
            else {
                // console.log("filter doesnot exist => ", item);
            }
        });
        // console.log('search', search);
        let thef = '';

        function isStringified(jsonValue) { // use this function to check
            try {
                // console.log("need to parse");
                return JSON.parse(jsonValue);
            } catch (err) {
                // console.log("not need o parse");

                return jsonValue;
            }
        }

        // console.log('req.query.filter', req.query.filter)
        if (req.query.filter) {
            const json = isStringified(req.query.filter);

            if (typeof json == "object") {
                // console.log("string is a valid json");
                thef = JSON.parse(req.query.filter);
                if (thef.search) {

                    thef["title." + req.headers.lan] = {
                        $exists: true,
                        "$regex": thef.search,
                        "$options": "i"
                    };
                    delete thef.search
                }
            } else {
                console.log("string is not a valid json")
            }
            // if (JSON.parse(req.query.filter)) {
            //     thef = JSON.parse(req.query.filter);
            // }
        }
        // console.log('thef', thef);
        if (thef && thef != '')
            search = thef;
        // console.log(req.mongoose.Schema(Product))
        var q;
        if (search['productCategory.slug']) {
            let ProductCategory = req.mongoose.model('ProductCategory');

            // console.log('search[\'productCategory.slug\']', search['productCategory.slug'])

            ProductCategory.findOne({slug: search['productCategory.slug']}, function (err, productcategory) {
                // console.log('err', err)
                // console.log('req', productcategory)
                if (err || !productcategory)
                    return res.json([]);
                if (productcategory._id) {
                    // console.log({productCategory: {
                    //         $in:[productcategory._id]
                    //     }})
                    let ss = {"productCategory": productcategory._id};
                    if (thef.device) {
                        ss['attributes.values'] = thef.device
                    }
                    if (thef.brand) {
                        ss['attributes.values'] = thef.brand
                    }
                    Product.find(ss, function (err, products) {

                        Product.countDocuments(ss, function (err, count) {
                            if (err || !count) {
                                res.json([]);
                                return 0;
                            }
                            res.setHeader(
                                "X-Total-Count",
                                count
                            );
                            return res.json(products);

                        })
                    }).populate('productCategory', '_id slug').skip(offset).sort(sort).limit(parseInt(req.params.limit));
                }

            });
            // console.log('q', q)
        } else {
            // console.log('no \'productCategory.slug\'')
            if (!search['status'])
                search['status'] = 'published'
            // console.log('search q.exec', search)

            q = Product.find(search, fields).populate('productCategory', '_id slug').skip(offset).sort(sort).limit(parseInt(req.params.limit));
            q.exec(function (err, model) {

                // console.log('err', err)
                if (err || !model)
                    return res.json([]);
                Product.countDocuments(search, function (err, count) {
                    // console.log('countDocuments', count, model ? model.length : '');
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
            });
        }

    },

    createByAdmin: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        if (!req.body) {
            req.body = {}
        }
        if (!req.body.type) {
            req.body.type = 'normal';
        }
        if (req.body && req.body.slug) {
            req.body.slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
        }

        if (req.body.type == 'variable') {
            req.body.in_stock = false;
            if (req.body.combinations) {
                _.forEach(req.body.combinations, (comb) => {
                    if (comb.in_stock && comb.quantity != 0) {
                        req.body.in_stock = true;
                    }

                });
            }
        }
        if (req.body.type == 'normal') {
            // delete req.body.options;
            delete req.body.combinations;
        }
        Product.create(req.body, function (err, product) {
            if (err || !product) {
                res.json({
                    err: err,
                    success: false,
                    message: 'error!'
                });
                return 0;
            }

            if (req.headers._id && req.headers.token) {
                delete req.body.views;
                let action = {
                    user: req.headers._id,
                    title: "create product " + product._id,
                    action: "create-product",
                    data: product,
                    history: req.body,
                    product: product._id
                };
                req.submitAction(action);
            }
            res.json(product);
            return 0;

        });
    },

    editByAdmin: function (req, res, next) {
        let Product = req.mongoose.model('Product');

        if (!req.params.id) {

            return res.json({
                success: false,
                message: 'send /edit/:id please, you did not enter id',
            });


        }
        if (!req.body) {
            req.body = {}
        }
        if (!req.body.type) {
            req.body.type = 'normal';
        }
        //export new object saved
        if (req.body.slug) {
            req.body.slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
        }
        if (req.body.type == 'variable') {
            req.body.in_stock = false;
            if (req.body.combinations) {
                _.forEach(req.body.combinations, (comb) => {
                    if (comb.in_stock && comb.quantity != 0) {
                        req.body.in_stock = true;
                    }

                });
            }
        }
        if (req.body.type == 'normal') {
            delete req.body.options;
            delete req.body.combinations;
        }
        if (req.body.like) {
            // delete req.body.options;
            delete req.body.like;
        }
        if (!req.body.status || req.body.status == '') {
            // delete req.body.options;
            req.body.status = 'processings';
        }
        req.body.updatedAt = new Date();

        Product.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, product) {
            if (err || !product) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: err
                });
                return 0;
            }
            if (req.headers._id && req.headers.token) {
                delete req.body.views;
                // delete req.body.views;
                let action = {
                    user: req.headers._id,
                    title: "edit product " + product._id,
                    action: "edit-product",
                    data: product,
                    history: req.body,
                    product: product._id
                };
                req.submitAction(action);
            }

            res.json(product);
            return 0;

        });
    }
    ,
    importFromWordpress: function (req, res, next) {
        let url = '';
        if (req.query.url) {
            url = req.query.url;
        }
        if (req.query.consumer_secret) {
            url += '?consumer_secret=' + req.query.consumer_secret;
        }
        if (req.query.consumer_key) {
            url += '&consumer_key=' + req.query.consumer_key;
        }

        if (req.query.per_page) {
            url += '&per_page=' + req.query.per_page;
        }
        if (req.query.page) {
            url += '&page=' + req.query.page;
        }
        // console.log('importFromWordpress', url);
        let count = 0;
        req.httpRequest({
            method: "get",
            url: url,
        }).then(function (response) {
            count++;
            let x = count * parseInt(req.query.per_page)
            let Product = req.mongoose.model('Product');

            response.data.forEach((dat) => {
                let obj = {};
                if (dat.name) {
                    obj['title'] = {
                        fa: dat.name

                    }
                }
                if (dat.description) {
                    obj['description'] = {
                        fa: dat.description

                    }
                }

                if (dat.slug) {
                    obj['slug'] = dat.name.split(' ').join('-') + 'x' + x;
                }
                obj['data'] = dat;
                Product.create(obj)
            });
            // return res.json(response.data)
        });


    },
    importFromWebzi: function (req, res, next) {
        let url = '';
        if (req.query.url) {
            url = req.query.url;
        }
        if (req.query.consumer_secret) {
            url += '?consumer_secret=' + req.query.consumer_secret;
        }
        if (req.query.consumer_key) {
            url += '&consumer_key=' + req.query.consumer_key;
        }

        if (req.query.per_page) {
            url += '&per_page=' + req.query.per_page;
        }
        if (req.query.page) {
            url += '&page=' + req.query.page;
        }
        // console.log('importFromWordpress', url);
        let count = 0;
        req.httpRequest({
            method: "get",
            url: url,
        }).then(function (response) {
            count++;
            let x = count * parseInt(req.query.per_page)
            let Product = req.mongoose.model('Product');

            response.data.forEach((dat) => {
                let obj = {};
                if (dat.name) {
                    obj['title'] = {
                        fa: dat.name

                    }
                }
                if (dat.description) {
                    obj['description'] = {
                        fa: dat.description

                    }
                }

                if (dat.slug) {
                    obj['slug'] = dat.name.split(' ').join('-') + 'x' + x;
                }
                obj['data'] = dat;
                Product.create(obj)
            });
            // return res.json(response.data)
        });


    },
    rewriteProducts: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        let p = 0;
        // let Media = req.mongoose.model('Media');
        Product.find({}, function (err, products) {
            _.forEach(products, (item) => {
                let obj = {};
                if (item['slug']) {
                    // obj['slug'] = item['slug'].replace(/\s+/g, '-').toLowerCase();
                    item['slug'] = item['slug'].replace(/\s+/g, '-').toLowerCase();

                    if (item.type == 'variable') {
                        item.in_stock = false;
                        if (item.combinations) {
                            _.forEach(item.combinations, (comb) => {
                                if (comb.in_stock && comb.quantity != 0) {
                                    item.in_stock = true;
                                }

                            });
                        }
                    }
                    if (item.type == 'normal') {
                        // delete item.options;
                        delete item.combinations;
                    }
                    // if (item.price) {
                    //     obj['price'] = (item.price /109) * 100
                    // }
                    // if (item.salePrice) {
                    //     obj['salePrice'] = (item.salePrice/109) * 100
                    // }
                    // if (item.data.regular_price) {
                    //     obj['price'] = item.data.regular_price;
                    // }
                    // if (item.data.regular_price) {
                    //     obj['salePrice'] = item.data.sale_price;
                    // }
                    Product.findByIdAndUpdate(item._id, item, function (err, pro) {
                        p++;
                        // console.log('p: ', p, ' products.length:', products.length)
                        if (p == products.length) {
                            return res.json({
                                success: true
                            })
                        }

                    })
                }
            })
        })
    },

    torob: function (req, res, next) {
        console.log("----- torob -----");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        let searchf = {};
        searchf["title.fa"] = {
            $exists: true
        };
        let Product = req.mongoose.model('Product');
        let Settings = req.mongoose.model('Settings');

        // _id:'61d71cf4365a2313a161456c'
        Settings.findOne({}, "tax taxAmount", function (err, setting) {
            Product.find({}, "_id title price type salePrice in_stock combinations firstCategory secondCategory thirdCategory slug", function (err, products) {
                // console.log('err', err)
                // console.log('products', products)
                if (err || !products) {
                    return res.json([]);
                }

                function arrayMin(t) {
                    var arr = [];
                    t.map((item) => (item != 0) ? arr.push(item) : false);
                    if (arr && arr.length > 0)
                        return arr.reduce(function (p, v) {
                            // console.log("p", p, "v", v);
                            return (p < v ? p : v);
                        });
                    else
                        return false;
                }

                let modifedProducts = [];
                _.forEach(products, (c, cx) => {
                    let price_array = [];
                    let sale_array = [];
                    let price_stock = [];
                    let last_price = 0;
                    let last_sale_price = 0;

                    if (c.combinations && c.type == "variable") {
                        _.forEach(c.combinations, (comb, cxt) => {
                            if (comb.price && comb.price != null && parseInt(comb.price) != 0) {
                                price_array.push(parseInt(comb.price));
                            } else {
                                price_array.push(0);

                            }
                            if (comb.salePrice && comb.salePrice != null && parseInt(comb.salePrice) != 0) {
                                sale_array.push(parseInt(comb.salePrice));

                            } else {
                                sale_array.push(0);
                            }
                            if (comb.in_stock && !comb.quantity) {
                                comb.in_stock = false;
                            }
                            price_stock.push(comb.in_stock);
                            //
                            // if (parseInt(comb.price) < parseInt(last_price))
                            //     last_price = parseInt(comb.price);
                        });
                    }
                    if (c.type == "normal") {
                        price_array = [];
                        sale_array = [];
                        price_stock = [];
                        if (c.price && c.price != null)
                            price_array.push(c.price);
                    }
                    last_price = arrayMin(price_array);
                    last_sale_price = arrayMin(sale_array);
                    // console.log("last price", last_price, last_sale_price);

                    if ((last_price !== false && last_sale_price !== false) && (last_price < last_sale_price)) {
                        // console.log("we have got here");
                        var cd = price_array.indexOf(last_price);
                        if (sale_array[cd] && sale_array[cd] != 0)
                            last_sale_price = sale_array[cd];
                        else
                            last_sale_price = false;
                        // if(sale_array[cd] && (sale_array[cd]<last_sale_price)){
                        //
                        // }

                    } else if ((last_price !== false && last_sale_price !== false) && (last_price > last_sale_price)) {
                        // console.log("we have got there");

                        // last_price = last_sale_price;
                        // last_sale_price = tem;

                        var cd = sale_array.indexOf(last_sale_price);
                        if (price_array[cd] && price_array[cd] != 0)
                            last_price = price_array[cd];
                        // else {
                        // last_sale_price = false;
                        var tem = last_price;

                        last_price = last_sale_price;
                        last_sale_price = tem;
                        // }
                    }

                    //
                    // if (last_sale_price) {
                    //     var tem = last_price;
                    //     last_price = last_sale_price;
                    //     last_sale_price = tem;
                    //
                    // }
                    if (c.type == "normal") {
                        price_array = [];
                        sale_array = [];
                        price_stock = [];
                        if (c.in_stock) {
                            price_stock.push(true);
                        }
                        if (c.price && c.price != null)
                            price_array.push(c.price);
                    }
                    // console.log("price_stock", price_stock);


                    let slug = c.slug;
                    let cat_inLink = "";
                    if (c.firstCategory && c.firstCategory.slug)
                        cat_inLink = c.firstCategory.slug;
                    if (c.secondCategory && c.secondCategory.slug)
                        cat_inLink = c.secondCategory.slug;
                    if (c.thirdCategory && c.thirdCategory.slug)
                        cat_inLink = c.thirdCategory.slug;
                    // console.log('tax', setting)
                    if (setting && (setting.tax && setting.taxAmount)) {
                        if (last_price) {
                            let n = (parseInt(setting.taxAmount) * last_price) / 100
                            last_price = last_price + parseInt(n);
                        }

                        if (last_sale_price) {
                            let x = (parseInt(setting.taxAmount) * last_sale_price) / 100
                            last_sale_price = last_sale_price + parseInt(x);
                        }
                        // last_price
                    }
                    modifedProducts.push({
                        product_id: c._id,
                        name: ((c.title && c.title.fa) ? c.title.fa : ""),

                        // page_url: CONFIG.SHOP_URL + "p/" + c._id + "/" + encodeURIComponent(c.title.fa),
                        page_url: process.env.BASE_URL + "/product/" + c._id + "/" + c.slug,
                        price: last_price,
                        old_price: last_sale_price,
                        availability: (price_stock.indexOf(true) >= 0 ? "instock" : "outofstock")
                        // comb: price_array,
                        // combSale: sale_array,
                        // price_stock: price_stock,

                    });
                });
                return res.json(modifedProducts);


            }).skip(offset).sort({
                in_stock: -1,
                updatedAt: -1,
                createdAt: -1
                // "combinations.in_stock": -1,
            }).limit(parseInt(req.params.limit)).lean();
        })
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
                        // console.log('images[', cx, ']', mainUrl);

                        let filename =
                                c.split('/').pop(),
                            __dirname = path.resolve(),
                            // name = (req.global.getFormattedTime() + filename).replace(/\s/g, ''),
                            name = filename,
                            type = path.extname(name),
                            mimtype = mime.getType(type),
                            filePath = path.join(__dirname, "./public_media/customer/", name),
                            fstream = fs.createWriteStream(filePath);
                        // console.log('name', filename)
                        // console.log('getting mainUrl', req.query.url + mainUrl);

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
    viewOneS: function (req, res, next) {
        console.log("----- viewOne -----");
        return new Promise(function (resolve, reject) {
            // console.log('req.params._id', req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return (p < v ? p : v);
                    });
            };
            let obj = {};
            if (req.mongoose.isValidObjectId(req.params._slug)) {
                obj["_id"] = req.params._slug;
            } else {
                obj["slug"] = req.params._slug;

            }
            if (req.mongoose.isValidObjectId(req.params._id)) {
                obj["_id"] = req.params._id;
                delete obj["slug"];
            }
            let Product = req.mongoose.model('Product');

            Product.findOne(obj, "title metadescription keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                function (err, product) {
                    if (err || !product) {
                        resolve({});
                        return 0;
                    }
                    let in_stock = "outofstock";
                    let product_price = 0;
                    let product_old_price = 0;
                    let product_prices = [];
                    let product_sale_prices = [];
                    if (product.type === "variable") {
                        if (product.combinations)
                            _.forEach(product.combinations, (c) => {
                                if (c.in_stock) {
                                    in_stock = "instock";
                                    product_prices.push(parseInt(c.price) || 1000000000000);
                                    product_sale_prices.push(parseInt(c.salePrice) || 1000000000000);
                                }

                            });
                        // console.log("gfdsdf");
                        // console.log(product_prices);
                        // console.log(product_sale_prices);
                        let min_price = arrayMin(product_prices);
                        let min_sale_price = arrayMin(product_sale_prices);
                        // console.log("min_price", min_price);
                        // console.log("min_sale_price", min_sale_price);
                        product_price = min_price;
                        if (min_sale_price > 0 && min_sale_price < min_price) {
                            product_price = min_sale_price;
                            product_old_price = min_price;
                        }
                    }
                    if (product.type === "normal") {
                        if (product.in_stock) {
                            in_stock = "instock";
                        }
                        if (product.price) {
                            product_price = product.price;
                        }
                        if (product.price && product.salePrice) {
                            product_price = product.salePrice;
                            product_old_price = product.price;
                        }
                    }

                    // product.title = product['title'][req.headers.lan] || '';
                    // product.description = '';
                    // console.log(c);
                    // });
                    delete product.data;
                    delete product.transaction;
                    // console.log(" product", product);
                    let img = '';
                    if (product.photos && product.photos[0]) {
                        img = product.photos[0]

                    }
                    if (product.thumbnail) {
                        img = product.thumbnail
                    }

                    let obj = {
                        _id: product._id,
                        product_price: product_price || "",
                        product_old_price: product_old_price || "",
                        availability: in_stock || "",
                        image: img,
                        keywords: "",
                        metadescription: "",
                    };
                    if (product["keywords"]) {
                        obj["keywords"] = product["keywords"][req.headers.lan] || product["keywords"];

                    }
                    if (product["metadescription"]) {
                        obj["metadescription"] = product["metadescription"][req.headers.lan] || product["metadescription"];

                    }
                    if (product["title"]) {
                        obj["title"] = product["title"][req.headers.lan] || product["title"];
                    } else {
                        obj["title"] = "";
                    }
                    if (product["product_name"]) {
                        obj["product_name"] = product["product_name"][req.headers.lan] || product["product_name"];
                    } else {
                        obj["product_name"] = "";
                    }
                    if (product["description"]) {
                        obj["description"] = product["description"][req.headers.lan] || product["description"];
                    } else {
                        obj["description"] = "";
                    }
                    if (product["slug"]) {
                        obj["slug"] = product["slug"];
                    }
                    if (product["labels"]) {
                        obj["labels"] = product["labels"];
                    }
                    resolve(obj);
                    return 0;

                }).lean();
        });
    },
    viewOne: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        const ObjectId = req.mongoose.Types.ObjectId;

// Validator function
        function isValidObjectId(id) {

            if (ObjectId.isValid(id)) {
                if ((String)(new ObjectId(id)) === id)
                    return true;
                return false;
            }
            return false;
        }

        let obj = {};
        // console.log('req.params.id', req.params.id)
        if (isValidObjectId(req.params.id)) {
            obj["_id"] = req.params.id;
        } else {
            obj["slug"] = req.params.id;

        }
        // console.log('get product: ', obj)
        Product.findOne(obj,
            function (err, product) {
                if (err || !product) {
                    res.json({
                        success: false,
                        message: "error!",
                        err: err
                    });
                    return 0;
                }

                let views = product.views;
                if (!views) {
                    views = [];
                }

                views.push({
                    userIp: requestIp.getClientIp(req),
                    createdAt: new Date()
                });
                Product.findByIdAndUpdate(req.params.id, {
                        "$set": {
                            // getContactData: product.getContactData,
                            views: views
                        }
                    },
                    {
                        "fields": {"_id": 1}
                    }, function (err, updatedProduct) {
                    });
                // delete product.views;
                if (product.views) {
                    product.views = product.views.length;
                } else {
                    product.views = 0;
                }
                if (product.like) {
                    product.like = product.like.length;
                } else {
                    product.like = 0;
                }
                delete product.getContactData;
                delete product.transaction;
                delete product.relatedProducts;
                delete product.firstCategory;
                // Product.findOne({_id: {$lt: req.params.id}}, "_id title", function (err, pl) {
                //     if (pl && pl._id && pl.title)
                //         product.nextProduct = {_id: pl._id, title: pl.title[req.headers.lan]};
                //     res.json(product);
                //     return 0;
                // }).sort({_id: 1}).limit(1);

                res.json(product);

            }).lean();
    },
    destroy: function (req, res, next) {
        let Product = req.mongoose.model('Product');

        Product.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    status: "trash"
                }
            },
            function (err, product) {
                if (err || !product) {
                    return res.json({
                        success: false,
                        message: 'error!'
                    });
                }
                if (req.headers._id && req.headers.token) {
                    let action = {
                        user: req.headers._id,
                        title: 'delete product ' + product._id,
                        // data:order,
                        action: "delete-product",

                        history: product,
                        product: product._id,
                    };
                    req.submitAction(action);
                }
                return res.json({
                    success: true,
                    message: 'Deleted!'
                });


            }
        );
    }


});
export default self;