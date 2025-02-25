const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'public/database/attachments/';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + path.extname(file.originalname);
        req.uploadedFileName = fileName; // Simpan nama file yang diupload di req
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG, and JPG are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: fileFilter
});

module.exports = {
    uploadSingle: (fieldName) => (req, res, next) => {
        const uploadFile = upload.single(fieldName);

        uploadFile(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            next();
        });
    }
};
