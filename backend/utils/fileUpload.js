// utils/fileUpload.js
const uploadToS3 = async (file, folder) => {
  // Simulate uploading the file buffer to S3, returning a standard URL
  const fileName = file.originalname ? file.originalname.replace(/\s+/g, '_') : 'certificate.png';
  return `https://s3.amazonaws.com/authenticity-validator-bucket/${folder}/${Date.now()}_${fileName}`;
};

module.exports = { uploadToS3 };
