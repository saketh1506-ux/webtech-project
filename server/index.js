import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Resume from './models/Resume.js';
import LinkModelFactory from './models/Link.js';

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_resume_builder';
mongoose.connect(MONGODB_URI).then(()=> console.log('[server] MongoDB connected')).catch(err=> console.error('[server] MongoDB connection error', err));

// Separate connection for links in a NEW database
const LINKS_MONGODB_URI = process.env.LINKS_MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_links';
const linksConnection = mongoose.createConnection(LINKS_MONGODB_URI);
linksConnection.asPromise()
  .then(()=> console.log('[server] Links DB connected'))
  .catch(err=> console.error('[server] Links DB connection error', err));
const Link = LinkModelFactory(linksConnection);

app.get('/health', (req,res)=> {
  const state = mongoose.connection.readyState; // 0=disconnected 1=connected 2=connecting 3=disconnecting
  const linksState = linksConnection.readyState; // 0..3
  res.json({ status: state === 1 ? 'up' : 'down', state, linksDb: linksState === 1 ? 'up' : 'down', linksState });
});

app.post('/api/resumes', async (req,res)=> {
  try { const r = new Resume(req.body); await r.save(); res.status(201).json(r); } catch(e){ console.error(e); res.status(500).json({ error:'save_failed' }); }
});
app.get('/api/resumes/:id', async (req,res)=> {
  try { const r = await Resume.findById(req.params.id); if(!r) return res.status(404).json({ error:'not_found' }); res.json(r); } catch(e){ console.error(e); res.status(500).json({ error:'fetch_failed' }); }
});

// Links API (new database)
app.get('/api/links', async (req, res) => {
  try {
    const { level, kind } = req.query;
    const q = {};
    if (level) q.level = level;
    if (kind) q.kind = kind;
    const items = await Link.find(q).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (e) { console.error(e); res.status(500).json({ error: 'links_fetch_failed' }); }
});

app.post('/api/links', async (req, res) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    const sanitized = payload.map(x => ({
      title: x.title,
      link: x.link,
      note: x.note,
      level: x.level,
      kind: x.kind || 'course',
      tags: Array.isArray(x.tags) ? x.tags : []
    }));
    const result = await Link.insertMany(sanitized);
    res.status(201).json(result);
  } catch (e) { console.error(e); res.status(500).json({ error: 'links_save_failed' }); }
});

// Serve static (optional, if building client dist here)
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req,res)=> { res.sendFile(path.join(__dirname, '../dist/index.html')); });

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('[server] listening on', PORT));
