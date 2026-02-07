import { NextResponse } from 'next/server';
import masterDB from '@/utils/db';

export async function POST() {
  try {
    // Add password column to clients table if not exists
    await masterDB.query(`
      ALTER TABLE clients
      ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT 'client123'
    `);

    // Update existing clients with null password to default
    await masterDB.query(`
      UPDATE clients
      SET password = 'client123'
      WHERE password IS NULL
    `);

    console.log('✅ Password column added and existing clients updated');

    return NextResponse.json({
      success: true,
      message: 'Password column setup complete'
    });
  } catch (error) {
    console.error('Error setting up password column:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to setup password column' },
      { status: 500 }
    );
  }
}

// GET method to check status
export async function GET() {
  try {
    // Check if password column exists
    const result = await masterDB.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'clients' AND column_name = 'password'
    `);

    const hasPasswordColumn = result.rows.length > 0;

    // Count clients with/without password
    let clientsWithPassword = 0;
    let clientsWithoutPassword = 0;

    if (hasPasswordColumn) {
      const countResult = await masterDB.query(`
        SELECT
          COUNT(*) FILTER (WHERE password IS NOT NULL) as with_password,
          COUNT(*) FILTER (WHERE password IS NULL) as without_password
        FROM clients
      `);
      clientsWithPassword = parseInt(countResult.rows[0].with_password) || 0;
      clientsWithoutPassword = parseInt(countResult.rows[0].without_password) || 0;
    }

    return NextResponse.json({
      success: true,
      hasPasswordColumn,
      clientsWithPassword,
      clientsWithoutPassword
    });
  } catch (error) {
    console.error('Error checking password column:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check password column status' },
      { status: 500 }
    );
  }
}
