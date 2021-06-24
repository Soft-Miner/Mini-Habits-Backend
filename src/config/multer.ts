import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import fs from 'fs';
import { AppError } from '../errors/AppError';

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024;

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadsFolder = path.resolve(__dirname, '../../tmp/uploads');
      fs.mkdirSync(uploadsFolder, { recursive: true });

      cb(null, uploadsFolder);
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, '');

        const key = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, key);
      });
    },
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: process.env.BUCKET_NAME as string,
    contentType: (req, file, cb) => cb(null, 'image/svg+xml'),
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileName = `${hash.toString('hex')}-${file.originalname}`;

        file.path = `${process.env.BUCKET_URL}/${fileName}`;

        cb(null, fileName);
      });
    },
  }),
};

const multerConfig: multer.Options = {
  limits: {
    fileSize: MAX_SIZE_TWO_MEGABYTES,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/svg+xml'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb((new AppError('Invalid file type.') as unknown) as Error);
    }
  },
  storage: storageTypes[process.env.STORAGE_TYPE as 'local' | 's3'],
};

export default multerConfig;
