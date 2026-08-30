import mongoose from 'mongoose';

const communityGroupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    categoryKey: {
      type: String,
      enum: ['prc', 'caf', 'cfap', 'acca', 'overseas', 'general'],
      default: 'caf',
      index: true
    },
    badge: {
      type: String,
      default: 'Community Group'
    },
    badgeBg: {
      type: String,
      default: 'bg-emerald-500/10 text-brandGreen'
    },
    description: {
      type: String,
      required: true
    },
    membersCountText: {
      type: String,
      default: '1,500+ Active Members'
    },
    bullets: {
      type: [String],
      default: []
    },
    whatsappLink: {
      type: String,
      required: true
    },
    discordLink: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const CommunityGroup = mongoose.model('CommunityGroup', communityGroupSchema);
