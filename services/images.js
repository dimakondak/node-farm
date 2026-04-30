const sharp = require('sharp');
const multer = require('multer');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new Error('Not image'));
  }
  cb(null, true);
};

exports.upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.resizeUserPhoto = async (photo, userId) => {
  if (photo) {
    return;
  }

  const extension = 'jpeg';
  photo.filename = `user-${userId}-${Date.now()}.${extension}`;
  await sharp(photo.buffer)
    .resize(500, 500)
    .toFormat(extension)
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${photo.filename}`);
};

exports.resizeTourImages = async (files) => {
  console.log(files);
};
