const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Storage for case documents (images/PDFs)
const caseStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'rabiescare/cases',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
    resource_type:   'auto', // handles both images and PDFs
  },
});

// ── Storage for profile pictures (future use)
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'rabiescare/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation:  [{ width: 300, height: 300, crop: 'fill', quality: 'auto' }],
  },
});

const uploadCase   = multer({ storage: caseStorage,   limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 5  * 1024 * 1024 } }); // 5MB

module.exports = { cloudinary, uploadCase, uploadAvatar };