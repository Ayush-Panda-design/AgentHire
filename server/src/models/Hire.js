import mongoose from 'mongoose';

const activityLogEntrySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  instruction: { type: String, required: true },
  agentReply: { type: String, default: '' },
  filesChanged: { type: [String], default: [] },
}, { _id: false });

const hireSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIEmployee',
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
  amount: {
    type: Number, // paise
    required: true,
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created',
  },
  razorpayOrderId: {
    type: String,
    default: null,
  },
  razorpayPaymentId: {
    type: String,
    default: null,
  },
  cliToken: {
    type: String,
    default: null,
    index: true,
  },
  cliTokenUsed: {
    type: Boolean,
    default: false,
  },
  // Phase 5b #1 — cosmetic permissions checklist selected in the Hire flow.
  // NOT read by the Phase 4 agent/CLI logic; purely for the UI to persist choices.
  permissions: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  activityLog: {
    type: [activityLogEntrySchema],
    default: [],
  },
}, {
  timestamps: true,
});

const Hire = mongoose.model('Hire', hireSchema);

export default Hire;
