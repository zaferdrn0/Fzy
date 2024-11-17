import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  serviceType: { type: String, enum: ['pilates', 'physiotherapy', 'massage'], required: true },
  membershipType: { type: String, enum: ['basic', 'premium'], default: null },
  membershipDuration: { type: Number, default: null },
  trainerNotes: { type: String, default: null },
  medicalHistory: { type: String, default: null },
  injuryType: { type: String, default: null },
  doctorNotes: { type: String, default: null },
  massageType: { type: String, default: null },
  preferences: { type: String, default: null },
  totalFee: { type: Number, required: true },
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }], 
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
