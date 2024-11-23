import mongoose from 'mongoose';
const { Schema } = mongoose;

const serviceSchema = new Schema({
  type: {
    type: String,
    enum: ['Pilates', 'Fizyoterapi', 'Masaj'],
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
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

const Service = mongoose.model('Service', serviceSchema);
export default Service;
