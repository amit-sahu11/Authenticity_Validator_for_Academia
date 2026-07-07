// routes/recruiterRoutes.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Certificate = require('../models/Certificate');
const { calculateMatchScore } = require('../utils/matching');

const router = express.Type || express.Router(); // fallback in case express.Type is a typo in user's prompt (which it was, let's use express.Router())
const routerInstance = express.Router();

// RECRUITER: Query with Manual Data Entry (Bina Photo)
routerInstance.post(
  '/verify-certificate',
  authenticate,
  authorize('recruiter'),
  async (req, res) => {
    try {
      const {
        studentName,
        enrollmentNumber,
        degreeType,
        universityName,
        collegeName,
        completionYear,
      } = req.body;

      // Build query dynamically based on provided fields
      const query = {};

      if (studentName) {
        query.studentName = new RegExp(studentName, 'i'); // Case-insensitive
      }
      if (enrollmentNumber) {
        query.enrollmentNumber = enrollmentNumber;
      }
      if (degreeType) {
        query.degreeType = degreeType;
      }
      if (universityName) {
        query.universityName = new RegExp(universityName, 'i');
      }
      if (collegeName) {
        query.collegeName = new RegExp(collegeName, 'i');
      }
      if (completionYear) {
        query.completionYear = parseInt(completionYear);
      }

      // Query database
      const certificates = await Certificate.find(query);

      if (certificates.length === 0) {
        return res.status(404).json({
          message: 'Certificate not found',
          exists: false,
          matches: [],
        });
      }

      // Calculate match scores
      const results = certificates.map((cert) => {
        const matchScore = calculateMatchScore(req.body, cert);
        return {
          certificateId: cert._id,
          studentName: cert.studentName,
          degreeType: cert.degreeType,
          universityName: cert.universityName,
          collegeName: cert.collegeName,
          completionYear: cert.completionYear,
          cgpa: cert.cgpa,
          enrollmentNumber: cert.enrollmentNumber,
          matchScore, // 0-100
          matchLevel: matchScore >= 95 ? 'exact' : matchScore >= 80 ? 'high' : 'partial',
          verificationStatus: cert.verificationStatus,
        };
      });

      // Log this query
      if (results[0]?.matchScore >= 80) {
        await Certificate.updateOne(
          { _id: results[0].certificateId },
          {
            $push: {
              queriedBy: {
                recruiterId: req.user.userId,
                recruiterName: req.user.name,
                recruiterEmail: req.user.email,
                queriedAt: new Date(),
                matchScore: results[0].matchScore,
                status: 'matched',
              },
            },
          }
        );
      }

      res.status(200).json({
        message: 'Certificate verification complete',
        exists: true,
        totalMatches: results.length,
        matches: results,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Verification failed',
        error: error.message,
      });
    }
  }
);

module.exports = routerInstance;
