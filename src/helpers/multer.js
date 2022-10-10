import multer from 'multer'
var path = require('path')

exports.upload = multer({ //multer settings
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);

        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            req.isFileValid = false
            // return callback(new Error('File yang diupload hanya boleh berupa gambar dan tidak boleh lebih dari 1 MB'))
        
            return callback(null, false, new Error('File yang diupload hanya boleh berupa gambar dan tidak boleh lebih dari 1 MB'));
            // callback(null, true)
        }
        req.isFileValid = true
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    },
    
}).single('image');