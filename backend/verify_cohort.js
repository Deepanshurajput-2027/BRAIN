import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function verifyCohort() {
  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connection.db.collection('users').updateOne(
    { email: 'cohort@gmail.com' },
    { $set: { isVerified: true } }
  );
  console.log('✅ cohort@gmail.com manually verified.');
  await mongoose.disconnect();
}

verifyCohort();
