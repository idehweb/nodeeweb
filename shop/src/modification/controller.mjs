var self = ( {
    all: function (req, res, next) {
        console.log('get all actions...')
        let Action = req.mongoose.model('Action');

        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (req.query.user) {

            search['user']=req.query.user;

        }
        if (req.query.product) {

            search['product']=req.query.product;

        }
        console.log('search:',search,'limit:',req.params.limit,'offset:',offset)

        Action.find(search,'_id user product order page title action createdAt updatedAt', function (err, actions) {
            console.log('err',err)
            console.log('actions',actions)
            if (err) {
                return res.json({
                    success: false,
                    message: 'error!',
                    actions: actions
                });
            }
            Action.countDocuments({}, function (err, count) {
                if (err || !count) {
                    return res.json({
                        success: false,
                        message: 'error!'
                    });
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                return res.json(actions);


            });

        }).populate('customer','phoneNumber firstName lastName _id').populate('product','title _id').populate('user','username _id nickname').skip(offset).sort({createdAt: -1,_id: -1}).limit(parseInt(req.params.limit));
    },
});
export default self;