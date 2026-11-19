const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Database = require('better-sqlite3');

process.env.DATABASE_URL ||= 'file:./dev.db';
const connection = process.env.DATABASE_URL;
if (!connection.startsWith('file:')) throw new Error('This prototype supports SQLite file: DATABASE_URL values only.');
const databasePath = path.resolve(__dirname, connection.slice(5));
fs.mkdirSync(path.dirname(databasePath), { recursive: true });
const db = new Database(databasePath);
try {
  db.pragma('foreign_keys = ON');
  db.exec(`CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" TEXT NOT NULL PRIMARY KEY, "checksum" TEXT NOT NULL, "finished_at" DATETIME,
    "migration_name" TEXT NOT NULL, "logs" TEXT, "rolled_back_at" DATETIME,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "applied_steps_count" INTEGER NOT NULL DEFAULT 0
  )`);
  const migrationsDir = path.join(__dirname, 'migrations');
  const migrations = fs.readdirSync(migrationsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  for (const migrationName of migrations) {
    const existing = db.prepare('SELECT 1 FROM "_prisma_migrations" WHERE migration_name = ? AND rolled_back_at IS NULL').get(migrationName);
    if (existing) { console.log(`Migration ${migrationName} is already applied.`); continue; }
    const sql = fs.readFileSync(path.join(migrationsDir, migrationName, 'migration.sql'), 'utf8');
    const checksum = crypto.createHash('sha256').update(sql).digest('hex');
    const apply = db.transaction(() => {
      if (migrationName === '20261119010000_expense_receipt') {
        const columns = db.prepare('PRAGMA table_info("Expense")').all();
        if (!columns.some((column) => column.name === 'receiptDataUrl')) db.exec(sql);
      } else {
        db.exec(sql);
      }
      db.prepare('INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, applied_steps_count) VALUES (?, ?, CURRENT_TIMESTAMP, ?, 1)')
        .run(crypto.randomUUID(), checksum, migrationName);
    });
    apply();
    console.log(`Applied ${migrationName} to ${databasePath}.`);
  }
} finally {
  db.close();
}
