import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  note: { type: String },
  level: { type: String, enum: ['Foundational','Intermediate','Advanced'], required: false },
  kind: { type: String, enum: ['course','certification'], default: 'course' },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default function LinkModelFactory(connection){
  return connection.model('Link', LinkSchema);
}
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

// Export a factory so we can bind to a specific connection (new database)
module.exports = (connection) => connection.model('Link', LinkSchema);
