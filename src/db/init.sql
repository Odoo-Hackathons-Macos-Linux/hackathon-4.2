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

INSERT INTO events (id, name, image) VALUES
  (1, 'normal', 'events/base.png'),
  (2, 'famine', 'events/famine.jpeg'),
  (3, 'attack', 'events/attack.jpeg'),
  (4, 'storm', 'events/storm.jpeg'),
  (5, 'drop', 'events/supplyDrop.jpeg'),
  (6, 'kidnapping', 'events/kidnapping3.jpeg'),
  (7, 'incendie', 'events/fire.jpeg'),
  (8, 'illness', 'events/maladie.jpeg');

INSERT INTO categories (id, name, image) VALUES 
  (1, 'resources', 'ressources/ressources.jpeg'),
  (2, 'construction', 'construction/construction.jpeg'),
  (3, 'exploration', 'exploration/exploration.jpeg'),
  (4, 'technology', 'technology/technology.jpeg'),
  (5, 'save', 'events/save.jpeg'),
  (6, 'firefighter', 'events/firefighter.jpeg'),
  (7, 'antidote', 'events/antidote.webp');

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

INSERT INTO choices (category_id, name, image, personnality_type) VALUES
  (1, 'water', 'ressources/water.jpeg', 'personalite/agriculteur.jpeg'),
  (1, 'plants', 'ressources/plants.jpeg', 'personalite/agriculteur.jpeg'),
  (1, 'fishing', 'ressources/fishing.jpeg', 'personalite/chasseur.jpeg'),
  (1, 'wood', 'ressources/wood.jpeg', 'personalite/survivant.jpeg'),
  (1, 'cooking', 'ressources/cooking.jpeg', 'personalite/soigneur.jpeg'),

  (2, 'abris', 'construction/abris.jpeg', 'personalite/manager.jpeg'),
  (2, 'fire', 'construction/fire.webp','personalite/gardien.jpeg'),
  (2, 'ramparts', 'construction/security.jpeg', 'personalite/gardien.jpeg'),
  (2, 'storage', 'construction/storage.jpeg', 'personalite/planificateur.jpeg'),

  (3, 'water++', 'exploration/water+.jpeg', 'personalite/courageux.jpeg'),
  (3, 'wood++', 'exploration/wood+.jpeg', 'personalite/courageux.jpeg'),
  (3, 'loot', 'exploration/remains.jpeg', 'personalite/curieux.jpeg'),
  (3, 'hunting', 'exploration/hunting.jpeg', 'personalite/chasseur.jpeg'),

  (4, 'tools', 'technology/tools.jpeg', 'personalite/scientifique.jpeg'),
  (4, 'transports', 'technology/transport.jpeg', 'personalite/manager.jpeg'),
  (4, 'security', 'technology/securite.jpeg', 'personalite/planificateur.jpeg'),
  (4, 'agriculture', 'technology/agriculture.jpeg', 'personalite/agriculteur.jpeg'),

  (5, 'save', 'events/save.jpeg', 'personalite/courageux.jpeg'),
  (6, 'firefighter', 'events/firefighter.jpeg', 'personalite/courageux.jpeg'),
  (7, 'antidote', 'events/antidote.jpeg', 'personalite/soigneur.jpeg');

