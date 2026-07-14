import { query } from "./lib/db";

async function seed() {
  try {
    console.log("Adding rating column...");
    await query(`ALTER TABLE movies ADD COLUMN IF NOT EXISTS rating INT DEFAULT 5;`);
    
    console.log("Inserting cinemas...");
    await query(`
      INSERT INTO cinemas (cinema_id, name, website) VALUES 
      (101, 'Kino Světozor', 'https://www.kinosvetozor.cz'),
      (102, 'Kino Aero', 'https://www.kinoaero.cz'),
      (103, 'Bio Oko', 'https://www.biooko.net')
      ON CONFLICT (cinema_id) DO NOTHING;
    `);

    console.log("Inserting movies...");
    await query(`
      INSERT INTO movies (movie_id, name, director, length, review, date, poster, cinema_id, rating) VALUES 
      (1001, 'Dune: Part Two', 'Denis Villeneuve', 166, '<p>An absolute visual masterpiece that expands on the first film in every way. The sound design is earth-shattering and the cinematography is breathtaking.</p><p>Timothée Chalamet truly comes into his own as Paul Atreides here.</p>', '2024-03-01', 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjcNsV.jpg', 101, 5),
      (1002, 'Poor Things', 'Yorgos Lanthimos', 141, '<p>A bizarre, beautiful, and hilarious journey of self-discovery. Emma Stone delivers the performance of her career. The production design is wonderfully surreal.</p>', '2024-02-15', 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg', 102, 4),
      (1003, 'Past Lives', 'Celine Song', 105, '<p>Quietly devastating. A beautiful meditation on what could have been and the connections that span across decades and continents. The pacing is deliberate and perfect.</p>', '2023-09-10', 'https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg', 103, 5),
      (1004, 'Madame Web', 'S.J. Clarkson', 116, '<p>This was... certainly a movie. The dialogue felt incredibly unnatural, and the editing was jarring. The villain ADR is some of the worst I have seen in a modern blockbuster.</p>', '2024-02-20', 'https://image.tmdb.org/t/p/w500/rULWuutDcN5NvtiZi4FRPzRYWSh.jpg', 101, 1),
      (1005, 'Oppenheimer', 'Christopher Nolan', 180, '<p>A dense, thrilling historical biopic. The Trinity test sequence is a cinematic triumph. Cillian Murphy is mesmerizing, carrying the immense weight of the film on his shoulders.</p><p>However, it is extremely dialogue-heavy and occasionally hard to follow acoustically.</p>', '2023-07-21', 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 102, 5)
      ON CONFLICT (movie_id) DO NOTHING;
    `);
    
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (e) {
    console.error("Seed error:", e);
    process.exit(1);
  }
}
seed();
