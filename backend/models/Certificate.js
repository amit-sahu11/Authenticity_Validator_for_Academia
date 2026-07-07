// models/Certificate.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    // Source Information
    sourceType: {
      type: String,
      enum: ['university', 'recruiter_manual'],
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Certificate Details (Common)
    studentName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    studentEmail: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    studentPhone: {
      type: String,
      index: true,
    },

    // Degree Information
    degreeType: {
      type: String,
      enum: ['B.Tech', 'B.A', 'M.Tech', 'MBA', 'B.Sc', 'M.Sc', 'B.Com', 'M.Com'],
      required: true,
    },
    fieldOfStudy: {
      type: String,
      required: true,
    },
    universityName: {
      type: String,
      required: true,
      index: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    enrollmentNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    rollNumber: {
      type: String,
      index: true,
    },

    // Academic Details
    completionYear: {
      type: Number,
      required: true,
      index: true,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    grade: {
      type: String, // A+, A, B+, etc.
    },

    // Photo Upload (Optional for both modes)
    documentPhotos: [
      {
        type: String, // S3/Cloud storage URL
        uploadedAt: Date,
        documentType: {
          type: String,
          enum: ['degree', 'transcript', 'id_proof', 'other'],
        },
      },
    ],

    // OCR Data (From Photo)
    ocrData: {
      extractedText: String,
      confidence: Number, // 0-100
      extractedAt: Date,
      extractionMethod: String, // 'tesseract', 'google-vision', etc.
    },

    // Verification Status
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'manual_review'],
      default: 'pending',
      index: true,
    },

    // Verification Queries Log
    queriedBy: [
      {
        recruiterId: mongoose.Schema.Types.ObjectId,
        recruiterName: String,
        recruiterEmail: String,
        queriedAt: {
          type: Date,
          default: Date.now,
        },
        matchScore: Number, // 0-100
        status: String, // 'matched', 'not_matched', 'partial'
      },
    ],

    // System Metadata
    isPublished: {
      type: Boolean,
      default: false, // Visibility to recruiters
    },
    hash: {
      type: String,
      index: true,
    },
    block: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for fast querying
certificateSchema.index({ studentName: 'text', fieldOfStudy: 'text' });
certificateSchema.index({
  universityName: 1,
  collegeName: 1,
  completionYear: 1,
});

module.exports = mongoose.model('Certificate', certificateSchema);
