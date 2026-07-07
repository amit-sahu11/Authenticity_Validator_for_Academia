// routes/universityRoutes.js
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const { authenticate, authorize } = require('../middleware/auth');
const Certificate = require('../models/Certificate');
const { extractDataFromImage } = require('../utils/ocrProcessor');
const { uploadToS3 } = require('../utils/fileUpload');
const { fuzzyMatch } = require('../utils/matching');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// UNIVERSITY: Upload with Photo + OCR Extraction
router.post(
  '/upload-certificate',
  authenticate,
  authorize('university'), // University role
  upload.single('certificatePhoto'),
  async (req, res) => {
    try {
      const { 
        studentName, 
        studentEmail, 
        degreeType, 
        universityName, 
        collegeName, 
        completionYear, 
        enrollmentNumber, 
        cgpa 
      } = req.body;

      // Validate required fields
      if (!studentName || !degreeType || !universityName || !completionYear || !enrollmentNumber) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if certificate with this enrollment number already exists
      const existingCert = await Certificate.findOne({ enrollmentNumber });
      if (existingCert) {
        return res.status(409).json({ message: 'A certificate with this Enrollment/Roll Number is already registered.' });
      }

      // Upload photo to S3
      let photoUrl = null;
      let ocrData = { confidence: 0, extractedText: '', extractionMethod: 'none' };

      if (req.file) {
        photoUrl = await uploadToS3(req.file, 'certificates');

        // Extract data from photo (handles buffer input)
        ocrData = await extractDataFromImage(req.file.buffer);
      } else {
        return res.status(400).json({ message: 'Please upload a certificate document file' });
      }

      // Check matching if OCR text was extracted
      if (ocrData && ocrData.extractedText) {
        const ocrLower = ocrData.extractedText.toLowerCase();
        const reasons = [];

        // 1. Name Check (substring or fuzzy match)
        if (studentName) {
          const nameLower = studentName.toLowerCase().trim();
          let matched = ocrLower.includes(nameLower);
          if (!matched) {
            // Try line-by-line fuzzy matching
            const lines = ocrLower.split('\n');
            matched = lines.some(line => fuzzyMatch(nameLower, line.trim()) >= 70);
          }
          if (!matched) {
            reasons.push(`Student name "${studentName}" does not match certificate text.`);
          }
        }

        // 2. Enrollment / Roll number check
        if (enrollmentNumber) {
          const rollLower = enrollmentNumber.toLowerCase().trim();
          const cleanRoll = rollLower.replace(/[^a-z0-9]/g, '');
          const cleanOcr = ocrLower.replace(/[^a-z0-9]/g, '');
          if (!cleanOcr.includes(cleanRoll)) {
            reasons.push(`Enrollment/Roll number "${enrollmentNumber}" was not found on the certificate.`);
          }
        }

        // 3. University check
        if (universityName) {
          const univLower = universityName.toLowerCase().trim();
          let matched = ocrLower.includes(univLower);
          if (!matched) {
            const words = univLower.split(/\s+/).filter(w => w.length > 3);
            if (words.length > 0) {
              const matchedWords = words.filter(w => ocrLower.includes(w));
              if (matchedWords.length / words.length < 0.5) {
                reasons.push(`University name "${universityName}" does not match the certificate.`);
              }
            } else {
              reasons.push(`University name "${universityName}" was not found on the certificate.`);
            }
          }
        }

        // 4. Year check
        if (completionYear) {
          const yearStr = completionYear.toString().trim();
          if (!ocrLower.includes(yearStr)) {
            reasons.push(`Completion year "${completionYear}" was not found on the certificate.`);
          }
        }

        // If any mismatch exists, reject the upload
        if (reasons.length > 0) {
          return res.status(400).json({
            message: 'Manual entry details do not match the certificate document!',
            errors: reasons
          });
        }
      }

      // Generate SHA-256 Hash to uniquely represent the certificate
      const canonicalString = `${studentName}|${enrollmentNumber}|${universityName}|${degreeType}|${completionYear}`.toLowerCase().trim();
      const hash = crypto.createHash('sha256').update(canonicalString).digest('hex');
      const block = Math.floor(Math.random() * 3000) + 1500; // Mock block number

      // Create certificate record
      const certificate = new Certificate({
        sourceType: 'university',
        uploadedBy: req.user.userId,
        studentName,
        studentEmail,
        degreeType,
        universityName,
        collegeName,
        completionYear: parseInt(completionYear),
        enrollmentNumber,
        cgpa: cgpa ? parseFloat(cgpa) : null,
        verificationStatus: 'verified', // University upload is auto-verified
        isPublished: true,
        hash,
        block,
        documentPhotos: photoUrl
          ? [
              {
                type: photoUrl,
                uploadedAt: new Date(),
                documentType: 'degree',
              },
            ]
          : [],
        ocrData: {
          extractedText: ocrData.extractedText || '',
          confidence: ocrData.confidence || 0,
          extractedAt: new Date(),
          extractionMethod: ocrData.extractionMethod || 'google-vision',
        },
      });

      await certificate.save();

      res.status(201).json({
        message: 'Certificate uploaded and verified successfully',
        certificateId: certificate._id,
        hash,
        block,
        ocrConfidence: ocrData.confidence,
        verificationStatus: 'verified',
      });
    } catch (error) {
      res.status(500).json({ message: 'Upload failed', error: error.message });
    }
  }
);

module.exports = router;
