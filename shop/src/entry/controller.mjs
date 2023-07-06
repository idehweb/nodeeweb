import _ from "lodash";

var self = ({
    all: function (req, res, next) {
        let Model = req.mongoose.model('Entry');
        let offset = 0,limit=1000;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        if (req.params.limit) {
            limit = req.params.limit;
        }
        let fields = 'updatedAt trackingCode createdAt _id form';

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
        _.forEach(tt, (item) => {
            // console.log("item => ",item);
            if (Model.schema.paths[item]) {
                // console.log("item exists ====>> ",item);
                // console.log("instance of item ===> ",Model.schema.paths[item].instance);
                let split = req.query[item].split(',');
                if (req.mongoose.isValidObjectId(split[0])) {
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
            if (req.query['date_gte']) {

                search['createdAt'] = {$gt: new Date(req.query['date_gte'])};
                delete search.date_gte;
            }
            if (req.query['date_lte']) {

                search['createdAt']['$lt'] = new Date(req.query['date_lte']);
                delete search.date_lte;

            }
        }
        console.log('search',search);
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
            }).populate('form','_id slug title').skip(offset).sort({_id: -1}).limit(parseInt(limit));
    },
});
export default self;