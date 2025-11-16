const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  note: { type: String },
  level: { type: String, enum: ['Foundational','Intermediate','Advanced'], required: false },
  kind: { type: String, enum: ['course','certification'], default: 'course' },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = (connection) => connection.model('Link', LinkSchema);
