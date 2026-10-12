/**
 * Dinasti Musik - Database Persistence Service
 * Manages atomic reads and writes to data/db.json with safety fallbacks.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const INITIAL_SCHEMA = {
  storeConfig: {},
  users: [],
  products: [],
  orders: [],
  carts: {}
};

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDB(INITIAL_SCHEMA);
      return INITIAL_SCHEMA;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[DB Service] Error reading database:', err.message);
    return INITIAL_SCHEMA;
  }
}

function writeDB(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DB Service] Error writing database:', err.message);
    return false;
  }
}

module.exports = {
  DB_PATH,
  readDB,
  writeDB
};
