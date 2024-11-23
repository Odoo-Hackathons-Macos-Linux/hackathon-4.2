import SQLDataBase from 'better-sqlite3';

export class Database {
  constructor(fileName) {
    this.db = new SQLDataBase(fileName);
  }

  init() {

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY
      );

      CREATE TABLE IF NOT EXISTS events(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        is_special INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS choices(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT,
        name TEXT,
        personnality_type TEXT,
        ponderation REAL,
        event_id INTEGER,
        user_id TEXT,
        FOREIGN KEY (event_id) REFERENCES events (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
      
    `;

    this.db.exec(createTableQuery);
  }

  insertChoice(image, name, personnality_type, ponderation) {
    this.db.prepare('INSERT INTO choices (image, name, personnality_type, ponderation) VALUES(?,?,?,?)').run(image, name, personnality_type, ponderation);
  }

  insertUser(id, choices) {
    this.db.prepare('INSERT INTO users (id) VALUES (?, ?)').run(id, choices);
  }

  insertEvent(name, is_special) {
    this.db.prepare('INSERT INTO events (name, is_special) VALUES (?, ?)').run(name, is_special);
  }

}

