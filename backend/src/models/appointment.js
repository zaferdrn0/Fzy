import mongoose from 'mongoose';
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  subscriptionId: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['İleri Tarihli', 'Geldi', 'Gelmedi'],
    default: 'İleri Tarihli'
  },
  notes: {
    type: String,
    trim: true
  },
  fee: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  doctorReport: {
    diagnosis: { type: String },
    injuryType: { type: String },
    notes: { type: String }
  },
  massageDetails: {
    massageType: { type: String },
    notes: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
