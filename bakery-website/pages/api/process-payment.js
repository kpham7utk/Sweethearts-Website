import { pool } from '../../lib/db';
import square from 'square';

let squareClient;
try {
  squareClient = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox
  });
} catch (error) {
  console.error('Error initializing Square client:', error);
}

export default async function handler(req, res) {
  if (!squareClient) {
    console.error('Square client not initialized');
    return res.status(500).json({ error: 'Payment service not available' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Request body:', req.body);
    const { sourceId, classId, customerInfo, participants, amount } = req.body;

    // Start a database transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if spots are still available
      const { rows: [classDetails] } = await client.query(
        'SELECT spots_remaining FROM classes WHERE id = $1 FOR UPDATE',
        [classId]
      );

      if (!classDetails || classDetails.spots_remaining < participants) {
        throw new Error('Not enough spots available');
      }

      const amountInCents = parseInt(amount * 100);
      console.log('Amount in cents:', amountInCents, typeof amountInCents); // Log amount in cents

      // Process payment with Square
      const payment = await squareClient.payments.create({
        sourceId: sourceId,
        amountMoney: {
          amount: BigInt(Math.round(amount * 100)), // Convert to BigInt
          currency: 'USD'
        },
        idempotencyKey: `${classId}-${Date.now()}-${Math.random()}`,
        buyerEmailAddress: customerInfo.email,
      });
      
      if (payment.payment?.status === 'COMPLETED') {
        // Update spots and create registration
        await client.query(
          'UPDATE classes SET spots_remaining = spots_remaining - $1 WHERE id = $2',
          [participants, classId]
        );

        const { rows: [registration] } = await client.query(
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
            classId,
            payment.payment.id,
            'completed',
            customerInfo.email,
            customerInfo.name,
            customerInfo.phone,
            participants
          ]
        );

        await client.query('COMMIT');
        res.status(200).json({ success: true, registration });
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process registration' 
    });
  }
}