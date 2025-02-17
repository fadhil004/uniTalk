const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/database/logo_partner/'); // Folder penyimpanan
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file dengan timestamp
    }
});

// Filter hanya untuk gambar (jpg, png, jpeg)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG, and JPG are allowed!'), false);
    }
};

// Inisialisasi multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Batas ukuran file 2MB
    fileFilter: fileFilter
});

module.exports = upload;
