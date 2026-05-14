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

exports.resizeTourImages = async (files, tourId) => {
  if (files) {
    return;
  }

  const extension = 'jpeg';
  const imageCoverFilename = `tour-${tourId}-${Date.now()}-cover.${extension}`;

  await sharp(files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat(extension)
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${imageCoverFilename}`);

  await Promise.all(
    files.images.map(async (image, index) => {
      const filename = `tour-${tourId}-${Date.now()}-${index + 1}.${extension}`;

      await sharp(image.buffer)
        .resize(2000, 1333)
        .toFormat(extension)
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
    })
  );
};
