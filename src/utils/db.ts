// utils/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

/**
 * Get client ID from slug
 * Helper function for unified database system
 */
export async function getClientId(slug: string): Promise<number | null> {
  try {
    const result = await pool.query(
      'SELECT id FROM clients WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].id;
  } catch (error) {
    console.error('Error getting client ID:', error);
    return null;
  }
}
