import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    qualification: {
      type: String
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate event registration by same email/user
eventRegistrationSchema.index({ event: 1, email: 1 }, { unique: true });

export const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
