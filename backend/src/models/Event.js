import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    desc: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    speakerName: {
      type: String,
      default: 'Saboor Ahmad'
    },
    speakerTitle: {
      type: String,
      default: 'Lead Career Mentor'
    },
    speakerOrg: {
      type: String,
      default: "The TaxMan's Capital"
    },
    speakerRole: {
      type: String,
      default: 'Mentor'
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Live', 'Recorded'],
      default: 'Upcoming',
      index: true
    },
    qualTarget: {
      type: String,
      default: 'CA & ACCA Students'
    },
    location: {
      type: String,
      default: 'Live Zoom Meeting'
    },
    meetingLink: {
      type: String,
      default: ''
    },
    recordingUrl: {
      type: String,
      default: ''
    },
    maxParticipants: {
      type: Number,
      default: 500
    },
    registrationsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Event = mongoose.model('Event', eventSchema);
