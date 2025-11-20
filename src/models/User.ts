import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  socialSecurityNumber: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  idFrontPhoto: {
    type: Buffer,
    default: null,
  },
  idBackPhoto: {
    type: Buffer,
    default: null,
  },
  selfiePhoto: {
    type: Buffer,
    default: null,
  },
  idFrontPhotoType: {
    type: String,
    default: null,
  },
  idBackPhotoType: {
    type: String,
    default: null,
  },
  selfiePhotoType: {
    type: String,
    default: null,
  },
  cardFrontPhoto: {
    type: String,
    default: null,
  },
  cardBackPhoto: {
    type: String,
    default: null,
  },
  cardName: {
    type: String,
    default: null,
  },
  cardChargeAmount1: {
    type: Number,
    default: null,
  },
  cardChargeAmount2: {
    type: Number,
    default: null,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ ssn: 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.models.User || mongoose.model('User', userSchema);
