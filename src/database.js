import SQLDataBase from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { join } from "node:path";

export class Database {
  /**
  * @constructor
  * @param {string} filename
  */
  constructor(filename) {
    this.db = new SQLDataBase(filename);
  }

  init() {

    const initQueryPath = join(process.cwd(), "src", "db", "init.sql");
    const initQuery = readFileSync(initQueryPath, "utf8");

    this.db.exec(initQuery);
  }

  getTurnData(eventId) {
    const query = this.db.prepare(`
      SELECT ev.id AS event_id, ev.image AS event_image, ca.id AS category_id,
      ca.image AS category_image, ch.id AS choice_id, ch.image AS choice_image
      FROM choices ch
      JOIN categories ca ON ca.id == ch.category_id
      JOIN events_categories ec ON ec.category_id == ca.id
      JOIN events ev ON ev.id == ec.event_id
      WHERE ev.id == ?
    `);

    return query.all(eventId);
  }

  getPersonnalityData() {
    const query = this.db.prepare(`
      SELECT ch.id, ch.personnality_type
      FROM choices ch`);

    return query.all();
  }

}

