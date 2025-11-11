/ Simple Express + Mongoose server for saving/loading resumes
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const Resume = require('./models/Resume');

const app = express();
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_resume_builder';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.post('/api/resumes', async (req, res) => {
  try {
    const r = new Resume(req.body);
    await r.save();
    res.status(201).json(r);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'save_failed' });
  }
});

app.get('/api/resumes/:id', async (req, res) => {
  try {
    const r = await Resume.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'not_found' });
    res.json(r);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'fetch_failed' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Server listening on', PORT));
