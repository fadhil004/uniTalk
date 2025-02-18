const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'public/database/attachments/';
        fs.mkdirSync(uploadPath, { recursive: true }); // Buat folder jika belum ada
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        req.uploadedFileName = fileName; // Simpan nama file yang diupload di req
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG, JPG, and PDF are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Batas 5MB
    fileFilter: fileFilter
});

module.exports = {
    uploadAttachment: (fieldName) => (req, res, next) => {
        const uploadFile = upload.single(fieldName);

        uploadFile(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            next();
        });
    }
};
