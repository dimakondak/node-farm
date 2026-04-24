const sharp = require('sharp');
const multer = require('multer');

exports.upload = upload;

exports.resizeUserPhoto = async (photo, userName) => {
  if (photo) {
    return;
  }

  const extension = 'jpeg';
  photo.filename = `${userName}-${Date.now()}.${extension}`;
  await sharp(photo.buffer)
    .resize(500, 500)
    .toFormat(extension)
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${photo.filename}`);
};

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new Error('Not image'));
  }
  cb(null, true);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
