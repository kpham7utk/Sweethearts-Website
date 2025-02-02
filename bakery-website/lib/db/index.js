import { Pool } from 'pg';

// Create the pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// Functions
async function getAllClasses() {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM classes 
      WHERE is_active = true 
      ORDER BY date, time
    `);
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch classes');
  }
}

async function getClassById(id) {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM classes WHERE id = $1 AND is_active = true`,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch class');
  }
}

async function createRegistration(registration) {
  try {
    const { rows } = await pool.query(
      `INSERT INTO registrations (
        class_id,
        square_payment_id,
        payment_status,
        customer_email,
        customer_name,
        customer_phone,
        participants
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        registration.classId,
        registration.squarePaymentId,
        registration.paymentStatus,
        registration.customerEmail,
        registration.customerName,
        registration.customerPhone,
        registration.participants
      ]
    );
    return rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create registration');
  }
}

async function updateClassSpots(classId, spotsBooked) {
  try {
    const { rows } = await pool.query(
      `UPDATE classes 
      SET spots_remaining = spots_remaining - $1
      WHERE id = $2 
      AND spots_remaining >= $1
      RETURNING *`,
      [spotsBooked, classId]
    );
    return rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update class spots');
  }
}

// Single export statement at the end
export {
  pool,
  getAllClasses,
  getClassById,
  createRegistration,
  updateClassSpots
};