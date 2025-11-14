// Simple one-off DB connectivity check
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_resume_builder';
console.log('[check-db] connecting to', uri);
mongoose.connect(uri).then(()=> { console.log('[check-db] connected'); return mongoose.connection.close(); }).then(()=> console.log('[check-db] closed')).catch(err=> { console.error('[check-db] error', err); process.exit(1); });
