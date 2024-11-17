import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, enum: ['attended', 'missed', 'scheduled'], required: true },
  notes: { type: String, default: null },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
