import sqlite3 from "sqlite3";
import { open } from "sqlite";

const getDBConnection = async () => {
  return open({
    filename: "./database/database.db", 
    driver: sqlite3.Database,
  });
};

// Inisialisasi tabel jika belum ada
const initDB = async () => {
  const db = await getDBConnection();

  // Buat tabel guestbook jika belum ada
  await db.exec(`
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);

  // Buat tabel RSVP jika belum ada
  await db.exec(`
    CREATE TABLE IF NOT EXISTS rsvp (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      isAttending BOOLEAN NOT NULL,
      responseDate TEXT NOT NULL
    )
  `);

await db.exec(`
  CREATE TABLE IF NOT EXISTS guest_names (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL
  )
`);

};

initDB().catch((err) => console.error("Database init error:", err));

export default getDBConnection;
