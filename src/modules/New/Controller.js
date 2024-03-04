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

                                    //const imagePath = path.join(process.env.DIR_UPLOAD, 'src/upload/user_images/images_local', _name);
                                const imagePath = path.join('src/upload/news_images', _name);  
                                        console.log(imagePath)

                                    await this.uploadFileLocal(_data.image,imagePath);
                                    _data.image = _name;
                                } catch (e) {
                                    console.error(e);
                                    return this.response(res, 500, 'Upload failure, please try again');
                                }
                            }

                            await this.db.insert(_data);
                            return this.response(res, 201);
                        }
                    } catch (e) {
                        console.error(e);
                        return this.response(res, 500, e.message);
                    }
                }



                //upload image 
               
                async uploadFileLocal(imageData,imagePath) {

                    console.log(3333, imageData,imagePath)

                    try {
                        if (imageData && imagePath) {
                         
                            const base64Data = imageData.file.replace(/^data:image\/\w+;base64,/, '');

                           // const _dir =  "D:\\NETDEV\\mcv source baitap\\sourceMCCVV\\source\\sourceapii\\src\\upload" || path.resolve(process.env.DIR_UPLOAD);
             const _dir =  "D:\\NETDEV\\mcv source baitap\\sourceMCCVV\\source\\sourceapii\\src\\upload\\news_images" || path.resolve(process.env.DIR_UPLOAD, 'news_images');
                         // const _dir đường dẫn đã tạo ra file cần chỉnh sửa cho gọn
                            
                     //mẫu     //  if (!fs.existsSync(_dir)) fs.mkdirSync(_dir); 

                     //đã fix 
                          if (!fs.existsSync(_dir)) {
                            fs.mkdirSync(_dir);
                        }


       // giải thích //fs.existsSync  Phương thức fs.existsSync() được sử dụng để kiểm tra đồng bộ xem tệp đã tồn tại trong đường dẫn nhất định hay chưa. 
                           
                    function generateUniqueFilename(fileName) {
                        const timestamp = Date.now();
                        const extension = path.extname(fileName);
                        const nameWithoutExtension = path.basename(fileName, extension);
                        return `${nameWithoutExtension}_${timestamp}${extension}`;
                    }
                    
                    const fileName = "image.jpg";
                    const uniqueFileName = generateUniqueFilename(fileName);

                    fs.writeFileSync(path.join(_dir, uniqueFileName), base64Data, 'base64', function(err) { 
                        if(err) {
                            console.error(err);
                        } else {
                            console.log('File created successfully.');
                        }
                    });
                    
                           //(!fs.existsSync(_dir+'/news_images')) fs.mkdirSync(_dir+'/news_images');   //lỗi 
                          
                           
                        //  1  const fileName = "image.jpg"; 
                        //    fs.writeFileSync(path.join(_dir, fileName), base64Data, 'base64', function(err) { 
                        //        if(err) {
                        //            console.error(err);
                        //        } else {
                        //            console.log('File created successfully.');
                        //        }
                        //    });

                          //1 fs.writeFileSync(_dir + '/'+ "fileName", base64Data, 'base64', function(err) { console.log(err);}); // fixx chỗ _name là text chứ hông phải hình
                          //2 return true;
                         
                            
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







