import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use CommonJS model from ESM context
const require = createRequire(import.meta.url);
const Resume = require('./models/Resume.js');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_resume_builder';
mongoose.connect(MONGODB_URI).then(()=> console.log('[server] MongoDB connected')).catch(err=> console.error('[server] MongoDB connection error', err));

app.get('/health', (req,res)=> {
  const state = mongoose.connection.readyState; // 0=disconnected 1=connected 2=connecting 3=disconnecting
  res.json({ status: state === 1 ? 'up' : 'down', state });
});

app.post('/api/resumes', async (req,res)=> {
  try { const r = new Resume(req.body); await r.save(); res.status(201).json(r); } catch(e){ console.error(e); res.status(500).json({ error:'save_failed' }); }
});
app.get('/api/resumes/:id', async (req,res)=> {
  try { const r = await Resume.findById(req.params.id); if(!r) return res.status(404).json({ error:'not_found' }); res.json(r); } catch(e){ console.error(e); res.status(500).json({ error:'fetch_failed' }); }
});

// Serve static (optional, if building client dist here)
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req,res)=> { res.sendFile(path.join(__dirname, '../dist/index.html')); });

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('[server] listening on', PORT));
