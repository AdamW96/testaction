const Database = require('better-sqlite3');
const path = require('path');  
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, '../../test123.db'))

function init() {

    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            create_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS metrics_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider TEXT NOT NULL,
            cpu_usage REAL,
            memory_usage REAL,
            cost_usd REAL,
            recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `)
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@cloud.com')
    if (!existing) {
        const hash = bcrypt.hashSync('password123', 10)
        db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run('admin@cloud.com', hash)
    };
    console.log(`Seed, email is admin@cloud.com password is password123`)
}

module.exports = {db, init}