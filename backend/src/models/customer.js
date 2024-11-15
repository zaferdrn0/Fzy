import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true }
  },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  type: { 
    type: [String],  
    enum: ['physiotherapist', 'pilates'],
    required: true
  },
  details: {
    physiotherapist: {
      medicalHistory: { type: String, default: null },
      injuryType: { type: String, default: null },
      doctorNotes: { type: String, default: null },
      sessionsAttended: { type: Number, default: 0 },
      totalFee: { type: Number, default: 0 },
      payments: [{
        amount: { type: Number, default: 0 },
        date: { type: Date, default: Date.now }
      }]
    },
    pilates: {
      membershipType: { type: String, enum: ['basic', 'premium'], default: 'basic' },
      classesAttended: { type: Number, default: 0 },
      trainerNotes: { type: String, default: null },
      totalFee: { type: Number, default: 0 },
      payments: [{
        amount: { type: Number, default: 0 },
        date: { type: Date, default: Date.now }
      }]
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Customer = mongoose.model('Customer', customerSchema);
