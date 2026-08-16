import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    default: null,
  },
  googleId: {
    type: String,
    default: null,
    unique: true,
    sparse: true,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client',
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false },
});

const User = mongoose.model('User', userSchema);

export default User;
