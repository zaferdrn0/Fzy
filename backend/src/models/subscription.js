import mongoose from 'mongoose';
const { Schema } = mongoose;

const subscriptionSchema = new Schema({
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
  durationDays: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  sessionLimit: {
    type: Number,
    required: true
  },
  makeupSessions: {
    type: Number,
    default: 0
  },
  fee: {
    type: Number,
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

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
