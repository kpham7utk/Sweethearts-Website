import { sql } from '@vercel/postgres';

export async function getAllClasses() {
  try {
    const { rows } = await sql`
      SELECT * FROM classes 
      WHERE date >= CURRENT_DATE 
      AND is_active = true 
      ORDER BY date, time
    `;
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch classes');
  }
}

export async function getClassById(id) {
  try {
    const { rows } = await sql`
      SELECT * FROM classes 
      WHERE id = ${id} AND is_active = true
    `;
    return rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch class');
  }
}

export async function createRegistration(registration) {
  try {
    const { rows } = await sql`
      INSERT INTO registrations (
        class_id,
        square_payment_id,
        payment_status,
        customer_email,
        customer_name,
        customer_phone,
        participants
      ) VALUES (
        ${registration.classId},
        ${registration.squarePaymentId},
        ${registration.paymentStatus},
        ${registration.customerEmail},
        ${registration.customerName},
        ${registration.customerPhone},
        ${registration.participants}
      )
      RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create registration');
  }
}

export async function updateClassSpots(classId, spotsBooked) {
  try {
    const { rows } = await sql`
      UPDATE classes 
      SET spots_remaining = spots_remaining - ${spotsBooked}
      WHERE id = ${classId} 
      AND spots_remaining >= ${spotsBooked}
      RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update class spots');
  }
}