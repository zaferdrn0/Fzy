import mongoose from 'mongoose';
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  address: {
    street: { type: String },
    city: { type: String },
    postalCode: { type: String }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

customerSchema.index({ email: 1 }, { unique: true });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
