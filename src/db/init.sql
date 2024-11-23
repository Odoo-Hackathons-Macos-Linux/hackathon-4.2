CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY,
  name TEXT,
  image TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  name TEXT,
  image TEXT
);

CREATE TABLE IF NOT EXISTS events_categories (
  event_id INTEGER,
  category_id INTEGER,
  PRIMARY KEY(event_id, category_id)
);

CREATE TABLE IF NOT EXISTS choices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  image TEXT,
  category_id INTEGER,
  personnality_type TEXT,
  ponderation REAL,
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

INSERT INTO events (id, name) VALUES
  (1, 'normal'),
  (2, 'famine'),
  (3, 'attack'),
  (4, 'storm'),
  (5, 'drop'),
  (6, 'kidnapping'),
  (7, 'incendie'),
  (8, 'illness');

INSERT INTO categories (id, name) VALUES 
  (1, 'resources'),
  (2, 'construction'),
  (3, 'exploration'),
  (4, 'technology'),
  (5, 'save'),
  (6, 'firefighter'),
  (7, 'antidote');

INSERT INTO events_categories (event_id, category_id) VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),

  (2, 1),
  (2, 2),
  (2, 3),
  (2, 4),

  (3, 1),
  (3, 2),
  (3, 3),
  (3, 4),

  (4, 1),
  (4, 2),
  (4, 3),
  (4, 4),

  (5, 1),
  (5, 2),
  (5, 3),
  (5, 4),

  (6, 1),
  (6, 2),
  (6, 3),
  (6, 4),
  (6, 5), /* kidnapping - save */

  (7, 1),
  (7, 2),
  (7, 3),
  (7, 4),
  (7, 6), /* incendie - firefighter */

  (8, 1),
  (8, 2),
  (8, 3),
  (8, 4),
  (8, 7); /* illness - antidote */

INSERT INTO choices (category_id, name) VALUES
  (1, 'water'),
  (1, 'plants'),
  (1, 'fishing'),
  (1, 'wood'),
  (1, 'cooking'),

  (2, 'abris'),
  (2, 'fire'),
  (2, 'ramparts'),
  (2, 'storage'),

  (3, 'water++'),
  (3, 'wood++'),
  (3, 'loot'),
  (3, 'hunting'),

  (4, 'tools'),
  (4, 'transports'),
  (4, 'security'),
  (4, 'agriculture'),

  (5, 'save'),
  (6, 'firefighter'),
  (7, 'illness');

