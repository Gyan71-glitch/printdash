import mongoose from 'mongoose';
import User from '../src/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premium-news';

async function updateAdmins() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // First, demote everyone to 'user'
    await User.updateMany({}, { $set: { role: 'user' } });
    console.log('Demoted all users to regular users.');

    // Then, promote only the specified email to 'admin'
    const result = await User.updateOne(
      { email: 'raiyn1279@gmail.com' },
      { $set: { role: 'admin' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Successfully granted admin access EXCLUSIVELY to raiyn1279@gmail.com');
    } else {
      console.log('⚠️ raiyn1279@gmail.com was not found or was already an admin.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

updateAdmins();
