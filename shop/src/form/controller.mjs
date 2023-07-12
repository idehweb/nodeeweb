let self = ({
    addEntry: function (req, res, next) {
        let Form = req.mongoose.model('Form');
        let Entry = req.mongoose.model('Entry');
        if (!req.params.form) {
            return res.json({
                success: false
            })
        }
        Form.findById(req.params.form, '_id', function (err, form) {
            if (err && !form) {
                res.json({
                    err: err,
                    success: false,
                    message: "error"
                });
            }
            let trackingCode = Math.floor(10000 + Math.random() * 90000);

            Entry.create({
                form: form._id,
                trackingCode: trackingCode,
                data: req.body
            }, function (err, entry) {
                if (err && !entry) {
                    res.json({
                        err: err,
                        success: false,
                        message: "error"
                    });
                }
                return res.json({
                    success: true,
                    trackingCode: trackingCode,
                    message: 'submitted successfully!'

                })

            })

        })
    }
});
export default self;