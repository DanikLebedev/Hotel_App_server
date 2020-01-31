import multer from 'multer';

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'images');
    },
    filename(req, file, callback) {
        callback(null, new Date().toISOString() + '-' + file.originalname);
    },
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, callback) => {
    if (allowedTypes.includes(file.mimeType)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

export default multer({
    storage,
    fileFilter,
});
