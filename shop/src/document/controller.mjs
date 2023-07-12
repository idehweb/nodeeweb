import path from "path"
import fs from "fs"
var self = ( {
    fileUpload: function (req, res, next) {
        if (req.busboy) {
            req.pipe(req.busboy);

            req.busboy.on("file", function (
                fieldname,
                file,
                filename,
                encoding,
                mimetype
            ) {
                let fstream;
                const __dirname = path.resolve();

                console.log("global.getFormattedTime() + filename", req.global.getFormattedTime(), filename["filename"]);
                let name = (req.global.getFormattedTime() + filename.filename).replace(/\s/g, "");
                let Media = req.mongoose.model('Document');

                let filePath = path.join(__dirname, "./public_media/customer/", name);
                console.log("on file app filePath", filePath);

                fstream = fs.createWriteStream(filePath);
                // console.log('on file app mimetype', typeof filename.mimeType);

                file.pipe(fstream);
                fstream.on("close", function () {
                    // console.log('Files saved');
                    let url = "customer/" + name;
                    let obj = [{name: name, url: url, type: mimetype}];
                    req.photo_all = obj;
                    let photos = obj;
                    if (photos && photos[0]) {
                        Media.create({
                            name: photos[0].name,
                            url: photos[0].url,
                            type: photos[0].type

                        }, function (err, media) {


                            if (err && !media) {


                                res.json({
                                    err: err,
                                    success: false,
                                    message: "error"
                                });

                            }
                            res.json({
                                success: true,
                                media: media

                            });

                        });
                    } else {
                        res.json({
                            success: false,
                            message: "upload faild!"
                        });
                    }
                });
            });
        } else {
            next();
        }
    }

});
export default self;