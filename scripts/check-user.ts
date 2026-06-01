import mongoose from 'mongoose';
import User from '../src/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premium-news';

async function checkUser() {
  await mongoose.connect(MONGODB_URI);
  const user = await User.findOne({ email: 'raiyn1279@gmail.com' });
  console.log('User found:', user);
  process.exit(0);
}
checkUser();
