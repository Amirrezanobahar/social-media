import multer from 'multer';
import fs from 'fs';
import path from 'path';

export const multerStorage = (destination, allowedTypes = /^image\/(jpeg|png|webp)$/) => {
    // Create directory recursively if it doesn't exist
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${unique}${ext}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (allowedTypes.test(file.mimetype)) { // Corrected property name
            cb(null, true);
        } else {
            cb(new Error(`File type ${file.mimetype} not allowed. Only ${allowedTypes} are supported`));
        }
    };

    return multer({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB (corrected from 512MB)
        },
        fileFilter
    });
};