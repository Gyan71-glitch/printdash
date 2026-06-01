import mongoose from 'mongoose';
import User from '../src/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premium-news';

async function testSession() {
  await mongoose.connect(MONGODB_URI);
  const user = await User.findOne({ email: 'raiyn1279@gmail.com' });
  console.log('User role from DB:', user.role);
  process.exit(0);
}
testSession();
