const Controller = require("@system/Controller");
const Model = require('@system/Model');
const { extractBase64 } = require("@utils/Helper");
const { nanoid } = require("nanoid");
const fs = require('fs');
const path = require('path');
// const uploadDirectory = path.join(__dirname, 'src', 'upload', 'news_images');
 //const mkdirSync = fs.mkdirSync;

module.exports = class extends Controller {
    constructor(tableName) {
        super(tableName);
        this.db = new Model('news');
    } 

    async create(req, res) {
        try {
            // Validate
            const _check = await this.validate(req, res);

            if (_check == false) {
                let _data = req.body;
                _data.created_at = new Date();
                _data.updated_at = new Date();

                if (_data?.image) {
                    try {
                        const _year = this.moment().format('YYYY');
                        const _month = this.moment().format('MM');
                        const _parse = extractBase64(_data.image.file);

                        if (!_parse) {
                            return this.response(res, 500, 'Failed to parse image data');
                        }

                        const _name = `/${nanoid()}.${_parse.ext}`;
                        const imagePath = path.join('/public/upload/news_images', _name); 
                        await this.uploadFileLocal(_data.image,imagePath);
                        _data.image = imagePath;
                    } catch (e) {
                        console.error(e);
                        return this.response(res, 500, 'Upload failure, please try again');
                    }
                }

                await this.db.insert(_data);
                return this.response(res, 201);
            }
        }
        catch (e) {
            console.error(e);
            return this.response(res, 500, e.message);
        }
    }

    async update(req, res) {
        try {
            // Validate
            const _check = await this.validate(req, res);
            if (_check == false) {
                let _data = {};
                _data = req.body;
                _data.updated_at = new Date();
                if ((_data?.image)) {
                    try {
                        const _year = this.moment().format('YYYY');
                        const _month = this.moment().format('MM');
                        const _parse = extractBase64(_data.image.file);

                        if (!_parse) {
                            return this.response(res, 500, 'Failed to parse image data');
                        }

                        const _name = `/${nanoid()}.${_parse.ext}`;
                        const imagePath = path.join('/public/upload/news_images', _name); 
                        await this.uploadFileLocal(_data.image,imagePath);
                        _data.image = imagePath;
                    } catch (e) {
                        console.error(e);
                        return this.response(res, 500, 'Upload failure, please try again');
                    }
                }
                if(_data?.ended_at)
                    _data.ended_at = new Date(_data.ended_at);
                this.db.update({ id: req.params.id }, _data);
                this.response(res, 200);
            }
        } catch (e) {
            this.response(res, 500, e.message);
        }
    }

    async  uploadFileLocal(imageData,imagePath) {
        try {
            if (imageData && imagePath) {
                const base64Data = imageData.file.replace(/^data:image\/\w+;base64,/, '');
                const _dir =  "D:\\NETDEV\\mcv source baitap\\sourceMCCVV\\source\\sourceapii\\public\\upload\\news_images" || path.resolve(process.env.DIR_UPLOAD, 'news_images');
                
                if (!fs.existsSync(_dir)) fs.mkdirSync(_dir);
                
                fs.writeFileSync(path.join('D:\\NETDEV\\mcv source baitap\\sourceMCCVV\\source\\sourceapii\\', imagePath), base64Data, 'base64', function(err) {  
                    if(err) console.error(err);
                    else console.log('File created successfully.');
                });

                return path.join(_dir, imagePath);
                
            } else {
                console.error('Image data is missing or invalid');
                return null;

            }
        } catch (e) {
            console.error(e);
            return e.message;
        }
    }
};











