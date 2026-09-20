import mongoose from "mongoose";
import SecurityUtils from "../../utils/SecurityUtils";

/**
 * MongoDB schema for API keys
 * Each API key belongs to a client and is used for authentication
 */
const apiKeySchema = new mongoose.Schema(
  {
    keyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    keyvalue: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    description: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 500,
    },
    environment: {
        type: String,
        enum: ['production', 'staging', 'development', 'testing'],
        default: 'production',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    permissions: {
      canIngest: {
        type: Boolean,
        default: true,
      },
      canReadAnalytics: {
        type: Boolean,
        default: false,
      },
      allowedServices: [{
        type: String,
        trim: true,
      }],
    },
    security: {
      allowedIPs: [{
        type: String,
        trim: true,
        validate: {
          validator: function (ip) {
            return SecurityUtils.validateIp(ip);
          },
          message: 'Please enter a valid IP address'
        }
      }],
      allowedOrigins: [{
        type: String,
        trim: true,
        validate: {
          validator: function (origin) {
            return SecurityUtils.validateURL(origin);
          },
          message: 'Please enter a valid URL'
        }
      }],
      lastRotated: {
        type: Date,
        default: Date.now
      },
      rotationWarningdays: {
        type: Number,
        default: 30,
      },
    },
    expiresAt: {
      type: Date,
      default: () => {
        const days = parseInt(process.env.API_KEY_EXPIRY_DAYS || '365', 10);
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      },
      index: true,
    },
    metadata: {
      createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      purpose: {
          type: String,
          trim: true,
          maxlength: 200,
      },
      tags: [{
          type: String,
          trim: true,
          maxlength: 50,
      }],
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    collections: "apikeys"
  }
);

apiKeySchema.index({ clientId: 1, isActive: 1 });
apiKeySchema.index({ keyValue: 1, isActive: 1 });
apiKeySchema.index({ environment: 1, clientId: 1 });
// Index expiresAt, and use that index as a TTL(Time to live) index so documents are automatically removed when their expiresAt timestamp is reached.
apiKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

apiKeySchema.methods.isExpired = function () {
  if(!this.expiresAt) {
    return false;
  }
  return this.expiresAt < Date.now();
}

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

export default ApiKey;
