import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    phone: {
      type: String || null,
      match: [/^\+380\d{9}$/, 'Phone number must be in Ukrainian format: +380XXXXXXXXX'],
      // required: [true, 'Phone is required'],
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String || null,
      // required: [true, 'Email is required'],
      // unique: true,
      match: [/.+@.+/, 'user email is not valid'],
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },

    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
    // avatarUrl: {
    //   type: String,
    //   default: '',
    // },
  },
  { versionKey: false, timestamps: true },
);

export const User = mongoose.model('User', userSchema);
