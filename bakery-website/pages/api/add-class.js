import { pool } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // For testing purposes, we'll allow GET requests temporarily
    if (req.method === 'GET') {
      try {
        const { rows } = await pool.query(`
          INSERT INTO classes (
            title,
            description,
            price,
            max_spots,
            duration,
            date,
            time,
            spots_remaining,
            is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `, [
          'Basic Cake Decorating',
          'Learn fundamental cake decorating techniques including frosting, piping, and basic flower creation.',
          75.00,
          8,
          180,
          '2024-02-15',
          '10:00',
          8,
          true
        ]);

        return res.status(200).json(rows[0]);
      } catch (error) {
        console.error('Add class error:', error);
        return res.status(500).json({ error: 'Failed to add class' });
      }
    }
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Handle actual POST requests here
  const { title, description, price, max_spots, duration, date, time } = req.body;
  
  try {
    const { rows } = await pool.query(`
      INSERT INTO classes (
        title,
        description,
        price,
        max_spots,
        duration,
        date,
        time,
        spots_remaining,
        is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      title,
      description,
      price,
      max_spots,
      duration,
      date,
      time,
      max_spots, // spots_remaining starts equal to max_spots
      true
    ]);

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Add class error:', error);
    res.status(500).json({ error: 'Failed to add class' });
  }
}