import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
