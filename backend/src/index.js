import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/mongoose.js';
import { sessionMiddleware } from './config/session.js';
import userRoutes from './api/userRoutes.js';
import customerRoutes from './api/customerRoutes.js';
import Appointment from './models/appointment.js';
import Subscription from './models/subscription.js';
import { Role } from './models/role.js';
import Service from './models/service.js';
import serviceRoutes from './api/serviceRoutes.js';
import subscriptionRoutes from './api/subscriptionRoutes.js';
import appointmentRoutes from './api/appointmentRoutes.js';
import paymentRoutes from './api/paymentRoutes.js';


const app = express();
const port = process.env.PORT;

app.use(express.json()); // To process JSON requests
app.use(sessionMiddleware);
const initializeServices = async () => {
  await connectDB();
  const defaultServices = [
    { type: 'Pilates', description: 'Pilates dersleri' },
    { type: 'Fizyoterapi', description: 'Fizyoterapi hizmetleri' },
    { type: 'Masaj', description: 'Masaj terapisi' },
  ];

  try {
    for (const service of defaultServices) {
      const exists = await Service.findOne({ type: service.type });
      if (!exists) {
        await Service.create(service);
        console.log(`${service.type} service added to the database.`);
      }
    }
    console.log('Default services initialization completed.');
  } catch (error) {
    console.error('Error initializing default services:', error);
  }
}


const checkAndCreateRole = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Check for 'admin' role
    const existingRole = await Role.findOne({ name: 'admin' });
    if (!existingRole) {
      // If 'admin' role doesn't exist, create it
      const newRole = new Role({ name: 'admin' });
      await newRole.save();
      console.log('Admin role created');
    } else {
      console.log('Admin role already exists');
    }
  } catch (error) {
    console.error('Error checking or creating tenant/role:', error);
  }
};

checkAndCreateRole();
initializeServices()

app.use('/api/user', userRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/service', serviceRoutes); 
app.use('/api/subscription', subscriptionRoutes); 
app.use('/api/appointment', appointmentRoutes);
app.use('/api/payment', paymentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
