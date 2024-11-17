import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
