import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  score: { type: String }, // e.g. "98%", "Passed"
  validFrom: { type: Date },
  validTo: { type: Date },
}, { _id: false });

const aiEmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  domain: {
    type: String,
    enum: ['software-development'],
    required: true,
  },
  roleTitle: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  certifications: {
    type: [certificationSchema],
    default: [],
  },
  trustScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  successRate: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  tasksDone: {
    type: Number,
    default: 0,
  },
  experienceYears: {
    type: Number,
    required: true,
  },
  permissionsSupported: {
    type: [String],
    default: [],
  },
  restrictions: {
    type: [String],
    default: [],
  },
  illustrationKey: {
    type: String,
    default: 'illustration_default',
  },
}, {
  timestamps: true,
});

// Index for search capabilities
aiEmployeeSchema.index({ name: 'text', skills: 'text' });

const AIEmployee = mongoose.model('AIEmployee', aiEmployeeSchema);

export default AIEmployee;
