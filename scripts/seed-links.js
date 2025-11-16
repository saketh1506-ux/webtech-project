import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { CURATED, CERTIFICATIONS } from '../src/lib/builderCore.js';
import LinkModelFactory from '../server/models/Link.js';

dotenv.config();

const LINKS_MONGODB_URI = process.env.LINKS_MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_links';

// Using ESM imports; no require needed

async function run(){
  console.log('[seed-links] connecting to', LINKS_MONGODB_URI);
  const conn = await mongoose.createConnection(LINKS_MONGODB_URI).asPromise();
  const Link = LinkModelFactory(conn);

  try {
    console.log('[seed-links] clearing existing links...');
    await Link.deleteMany({});

    const courses = Object.entries(CURATED).flatMap(([level, items]) =>
      items.map(i => ({ title: i.title, link: i.link, note: i.note, level, kind: 'course' }))
    );
    const certs = (CERTIFICATIONS || []).map(i => ({ title: i.title, link: i.link, note: i.note, kind: 'certification' }));

    const all = [...courses, ...certs];
    console.log(`[seed-links] inserting ${all.length} items...`);
    await Link.insertMany(all);
    console.log('[seed-links] done');
  } catch (e) {
    console.error('[seed-links] error', e);
    process.exitCode = 1;
  } finally {
    await conn.close();
  }
}

run();
