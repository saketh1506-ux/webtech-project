const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  years: String,
  description: String
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  years: String
}, { _id: false });

const ResumeSchema = new mongoose.Schema({
  personal: {
    name: String,
    title: String,
    email: String,
    phone: String,
    linkedin: String,
    summary: String
  },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  skills: String,
  accent: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);
