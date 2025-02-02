import { pool } from '../../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Database connection details:', {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // Not logging sensitive data
  });

  try {
    // Test the connection
    const client = await pool.connect();
    console.log('Successfully connected to database');
    
    // Try a simple query
    const { rows } = await client.query('SELECT NOW()');
    console.log('Query result:', rows[0]);
    
    client.release();
    
    res.status(200).json({ 
      success: true, 
      message: 'Database connection successful',
      timestamp: rows[0]
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}