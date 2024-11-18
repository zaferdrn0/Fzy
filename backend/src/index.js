import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/mongoose.js';
import { sessionMiddleware } from './config/session.js';
import userRoutes from './api/userRoutes.js';
import customerRoutes from './api/customerRoutes.js';
import serviceRoutes from './api/serviceRoutes.js';
import eventRoutes from './api/eventRoutes.js';
import paymentRoutes from './api/paymentRoutes.js';
import { Role } from './models/role.js';

const app = express();
const port = process.env.PORT;

app.use(express.json()); // To process JSON requests
app.use(sessionMiddleware);


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

app.use('/api/user', userRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/payment', paymentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
