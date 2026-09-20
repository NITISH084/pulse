import mongoose from 'mongoose';

/**
 * MongoDB schema for clients/organizations
 * Each client represents a business/organization using the monitoring service
 */

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
      minLength: 2,
      maxLength: 100,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    description: {
      type: String,
      maxLength: 1000,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      dataRetentionDays: {
        type: Number,
        default: 30,
        min:7,
        max:365,
      },
      alertsEnabled: {
        type: Boolean,
        default: true,
      },
      timezone: {
        type: String,
        default: 'UTC',
      }
    }
  },
  {
    timestamps: true,
    collections: "clients"
  }
)

clientSchema.index({ isActive: 1 });

const Client = mongoose.model('Client', clientSchema);

export default Client;
