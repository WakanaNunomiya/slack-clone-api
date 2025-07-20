"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const upload = (req, res, folderName) => {
    const destination = `uploads/${folderName}`;
    (0, fs_1.mkdirSync)(destination, { recursive: true });
    const storage = multer_1.default.diskStorage({
        destination,
        filename: (_req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path_1.default.extname(file.originalname);
            cb(null, uniqueSuffix + ext);
        },
    });
    const upload = (0, multer_1.default)({
        storage,
        limits: {
            fileSize: 20 * 1024 * 1024,
        },
    });
    return new Promise((resolve, reject) => {
        upload.single('file')(req, res, (err) => {
            if (err != null)
                return reject(err);
            const baseURL = req.protocol + '://' + req.get('host');
            resolve({
                fileUrl: req.file != null ? `${baseURL}/${req.file.path}` : null,
                body: req.body,
            });
        });
    });
};
exports.upload = upload;
